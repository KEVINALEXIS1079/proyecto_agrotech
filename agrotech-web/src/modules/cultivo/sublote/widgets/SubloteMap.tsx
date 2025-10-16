import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { getAreaOfPolygon, isPointInPolygon, getDistance } from "geolib";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MapCallout from "../ui/MapCallout";
import { useMapCallout, type CalloutKind } from "@/modules/cultivo/lote/hooks/UseMapCallout";

export type CoordenadaSublote = { latitud_sublote: number; longitud_sublote: number };
export type CoordenadaLote = { latitud_lote: number; longitud_lote: number };

export type SubloteExistente = {
  nombre_sublote: string;
  coordenadas_sublote: CoordenadaSublote[];
};

export type LoteExistente = {
  id_lote_pk: number;
  nombre_lote: string;
  coordenadas_lote: CoordenadaLote[];
};

type Props = {
  coordenadas: CoordenadaSublote[];
  setCoordenadas: (c: CoordenadaSublote[]) => void;
  setArea?: (a: number) => void;
  sublotesExistentes?: SubloteExistente[];
  lotes?: LoteExistente[];
  loteSeleccionado?: string;
  setLoteSeleccionado?: (id: string) => void;
  mensaje?: string;
  clearMensaje?: () => void;
  mensajeKind?: CalloutKind;
};

const DEFAULT_CENTER: [number, number] = [1.8928, -76.091];
const MIN_DISTANCE_METERS = 0.5;

const toLatLngSublote = (coords: CoordenadaSublote[]): L.LatLngTuple[] =>
  coords.filter((c) => c && !isNaN(c.latitud_sublote) && !isNaN(c.longitud_sublote))
        .map((c) => [c.latitud_sublote, c.longitud_sublote] as L.LatLngTuple);

const toLatLngLote = (coords: CoordenadaLote[]): L.LatLngTuple[] =>
  coords.filter((c) => c && !isNaN(c.latitud_lote) && !isNaN(c.longitud_lote))
        .map((c) => [c.latitud_lote, c.longitud_lote] as L.LatLngTuple);

export default function SubloteMap({
  coordenadas,
  setCoordenadas,
  setArea = () => {},
  sublotesExistentes = [],
  lotes = [],
  loteSeleccionado = "",
  setLoteSeleccionado = () => {},
  mensaje = "",
  clearMensaje = () => {},
  mensajeKind = "info",
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const { activeCallout, triggerCallout } = useMapCallout(mensaje, clearMensaje, mensajeKind);

  // Centrar mapa al mostrar callout
  useEffect(() => {
    if (activeCallout && mapRef.current) {
      const pos = activeCallout.pos[0] !== 0 || activeCallout.pos[1] !== 0
        ? activeCallout.pos
        : DEFAULT_CENTER;
      mapRef.current.flyTo(pos, 19, { animate: true });
    }
  }, [activeCallout]);

  // Calcular área del sublote
  useEffect(() => {
    if (coordenadas.length > 2) {
      const area = Math.round(
        getAreaOfPolygon(
          coordenadas.map((c) => ({ latitude: c.latitud_sublote, longitude: c.longitud_sublote }))
        )
      );
      setArea(area);
    } else setArea(0);
  }, [coordenadas, setArea]);

  // Limpiar coordenadas al cambiar lote
  useEffect(() => {
    setCoordenadas([]);
    setArea(0);
  }, [loteSeleccionado]);

  // ----------------------------
  // Validar punto
  // ----------------------------
  const checkValidPoint = (lat: number, lng: number) => {
    if (!loteSeleccionado) {
      triggerCallout([lat, lng], "Selecciona primero un lote.", "error");
      return false;
    }

    const lote = lotes.find((l) => l.id_lote_pk === Number(loteSeleccionado));
    if (!lote || lote.coordenadas_lote.length < 3) {
      triggerCallout([lat, lng], "Este lote no tiene coordenadas válidas.", "error");
      return false;
    }

    const coordenadasLote = lote.coordenadas_lote.map((c) => ({
      latitude: c.latitud_lote,
      longitude: c.longitud_lote,
    }));

    if (!isPointInPolygon({ latitude: lat, longitude: lng }, coordenadasLote)) {
      triggerCallout([lat, lng], "El punto está fuera del lote.", "error");
      return false;
    }

    // Validar distancia mínima con otros sublotes/lotes
    const demasiadoCerca = [
      ...sublotesExistentes.flatMap((s) => s.coordenadas_sublote),
      ...lotes.flatMap((l) => l.coordenadas_lote.map((p) => ({ latitud_sublote: p.latitud_lote, longitud_sublote: p.longitud_lote })))
    ].some((p) => getDistance({ latitude: p.latitud_sublote, longitude: p.longitud_sublote }, { latitude: lat, longitude: lng }) < MIN_DISTANCE_METERS);

    if (demasiadoCerca) {
      triggerCallout([lat, lng], `Zona restringida: demasiado cerca (${MIN_DISTANCE_METERS}m) de otro lote o sublote.`, "error");
      return false;
    }

    // Validar si está dentro de otro sublote
    const dentroDeOtro = sublotesExistentes.some((sub) => {
      if (!sub.coordenadas_sublote || sub.coordenadas_sublote.length < 3) return false;
      return isPointInPolygon(
        { latitude: lat, longitude: lng },
        sub.coordenadas_sublote.map((p) => ({ latitude: p.latitud_sublote, longitude: p.longitud_sublote }))
      );
    });

    if (dentroDeOtro) {
      triggerCallout([lat, lng], "No puedes colocar un punto dentro de otro sublote.", "error");
      return false;
    }

    return true;
  };

  const handleAddPoint = (lat: number, lng: number) => {
    if (!checkValidPoint(lat, lng)) return;
    setCoordenadas([...coordenadas, { latitud_sublote: lat, longitud_sublote: lng }]);
    /* triggerCallout([lat, lng], "Punto añadido correctamente.", "info"); */
  };

  const handleDragMarker = (index: number, lat: number, lng: number) => {
    if (!checkValidPoint(lat, lng)) return;
    const nuevas = [...coordenadas];
    nuevas[index] = { latitud_sublote: lat, longitud_sublote: lng };
    setCoordenadas(nuevas);
/*     triggerCallout([lat, lng], `Punto ${index + 1} movido.`, "info"); */
  };

  const MapPicker = () => {
    useMapEvents({
      click(e) {
        handleAddPoint(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const polygonCoords = coordenadas.length >= 3 ? [...toLatLngSublote(coordenadas), toLatLngSublote(coordenadas)[0]] : [];

  return (
    <div className="h-[450px] rounded-xl overflow-hidden border border-gray-300 relative">
      <MapContainer center={DEFAULT_CENTER} zoom={18} style={{ height: "100%", width: "100%" }} ref={mapRef}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapPicker />

        {/* Lotes existentes */}
        {lotes.map((lote) => (
          <Polygon
            key={lote.id_lote_pk}
            positions={toLatLngLote(lote.coordenadas_lote)}
            pathOptions={{
              color: loteSeleccionado === String(lote.id_lote_pk) ? "green" : "gray",
              fillOpacity: loteSeleccionado === String(lote.id_lote_pk) ? 0.3 : 0.1,
            }}
            eventHandlers={{ click: () => setLoteSeleccionado(String(lote.id_lote_pk)) }}
          />
        ))}

        {/* Sublotes existentes */}
        {sublotesExistentes.map(
          (sub, i) =>
            sub.coordenadas_sublote?.length >= 3 && (
              <Polygon
                key={i}
                positions={toLatLngSublote(sub.coordenadas_sublote)}
                pathOptions={{ color: "blue", fillOpacity: 0.25 }}
              />
            )
        )}

        {/* Sublote en edición */}
        {coordenadas.length > 0 && (
          <>
            {coordenadas.length < 3 ? (
              <Polyline positions={toLatLngSublote(coordenadas)} pathOptions={{ color: "orange", weight: 4, dashArray: "8,6" }} />
            ) : (
              <Polygon positions={polygonCoords} pathOptions={{ color: "orange", fillOpacity: 0.45 }} />
            )}
            {coordenadas.map((c, i) => (
              <Marker
                key={i}
                position={[c.latitud_sublote, c.longitud_sublote]}
                draggable
                eventHandlers={{ dragend: (e) => handleDragMarker(i, e.target.getLatLng().lat, e.target.getLatLng().lng) }}
              />
            ))}
          </>
        )}

        {/* Callout */}
        {activeCallout && <MapCallout callout={activeCallout} />}
      </MapContainer>

      {/* Indicador de lote seleccionado */}
      {loteSeleccionado && (
        <div className="absolute top-2 left-2 bg-green-700 text-white px-4 py-2 rounded-lg shadow text-sm font-semibold">
          Lote seleccionado: {lotes.find((l) => String(l.id_lote_pk) === loteSeleccionado)?.nombre_lote || "Desconocido"}
        </div>
      )}
    </div>
  );
}
