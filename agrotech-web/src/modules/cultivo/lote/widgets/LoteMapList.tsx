import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import MapCallout from "../ui/MapCallout";
import LotePopup, { type LoteExistente } from "../ui/LotePopup";
import { getAreaOfPolygon } from "geolib";
import type { Callout } from "../hooks/UseMapCallout";

export interface Coordenada { latitud: number; longitud: number; }

export interface Lote {
  id_lote_pk: number;
  nombre_lote: string;
  coordenadas: Coordenada[];
}

type Props = {
  lotes: Lote[];
  editable?: boolean;
  onChange?: (coords: Coordenada[], loteId: number) => void;
};

const DEFAULT_TIMEOUT = 3000;

export default function LoteMapList({ lotes, editable = false, onChange }: Props) {
  const [coordsState, setCoordsState] = useState<Record<number, Coordenada[]>>({});
  const [callout, setCallout] = useState<Callout | null>(null);

  useEffect(() => {
    const initial: Record<number, Coordenada[]> = {};
    lotes.forEach((lote) => initial[lote.id_lote_pk] = [...lote.coordenadas]);
    setCoordsState(initial);
  }, [lotes]);

  useEffect(() => {
    if (callout) {
      const t = setTimeout(() => setCallout(null), DEFAULT_TIMEOUT);
      return () => clearTimeout(t);
    }
  }, [callout]);

  const handleDragMarker = (loteId: number, index: number, lat: number, lng: number) => {
    const newCoords = [...(coordsState[loteId] || [])];
    newCoords[index] = { latitud: lat, longitud: lng };
    setCoordsState(prev => ({ ...prev, [loteId]: newCoords }));
    if (onChange) onChange(newCoords, loteId);
  };

  function MapEditor({ loteId }: { loteId: number }) {
    useMapEvents({
      click(e) {
        if (!editable) return;
        const currentCoords = coordsState[loteId] || [];
        const newCoords = [...currentCoords, { latitud: e.latlng.lat, longitud: e.latlng.lng }];
        setCoordsState(prev => ({ ...prev, [loteId]: newCoords }));
        if (onChange) onChange(newCoords, loteId);
      },
    });
    return null;
  }

  return (
    <MapContainer center={[1.8928, -76.091]} zoom={18} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

      {lotes.map((lote) => (
        <div key={lote.id_lote_pk}>
          {editable && <MapEditor loteId={lote.id_lote_pk} />}

          <Polygon
            positions={(coordsState[lote.id_lote_pk] || []).map(c => [c.latitud, c.longitud])}
            pathOptions={{ color: editable ? "green" : "blue", fillOpacity: 0.3 }}
          >
            <Tooltip direction="top" sticky>
              <LotePopup
                lote={{ nombre: lote.nombre_lote, coordenadas: coordsState[lote.id_lote_pk] || [] }}
                coords={coordsState[lote.id_lote_pk] || []}
              />
            </Tooltip>
          </Polygon>

          {(editable && (coordsState[lote.id_lote_pk] || []).map((c, i) => (
            <Marker
              key={i}
              position={[c.latitud, c.longitud]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  handleDragMarker(lote.id_lote_pk, i, lat, lng);
                },
              }}
            />
          )))}
        </div>
      ))}

      {callout && <MapCallout callout={callout} />}
    </MapContainer>
  );
}
