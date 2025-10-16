import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAreaOfPolygon } from "geolib";
import type { Sublote } from "../model/types";
import type { Lote } from "../../lote/model/types";

interface SubloteMapListProps {
  sublotes: Sublote[];
  lotes: Lote[];
}

const FitBoundsHandler = ({ sublotes, lotes }: SubloteMapListProps) => {
  const map = useMap();

  useEffect(() => {
    const allCoords = [
      ...lotes.flatMap((l) =>
        l.coordenadas_lote?.map((c) => [c.latitud_lote, c.longitud_lote])
      ),
      ...sublotes.flatMap((s) =>
        s.coordenadas_sublote?.map((c) => [c.latitud_sublote, c.longitud_sublote])
      ),
    ].filter(
      (c): c is [number, number] =>
        Array.isArray(c) && typeof c[0] === "number" && typeof c[1] === "number"
    );

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      const MIN_ZOOM = 17;
      map.fitBounds(bounds, { padding: [10, 10] });

      if (map.getZoom() < MIN_ZOOM) {
        map.setZoom(MIN_ZOOM);
      }
    }
  }, [sublotes, lotes, map]);

  return null;
};

function formatPopupContent(
  nombre: string,
  coords: { latitud: number; longitud: number }[],
  tipo: "lote" | "sublote"
) {
  if (!coords || coords.length === 0) return "";
  const first = coords[0];
  let area = 0;
  if (coords.length > 2) {
    area = getAreaOfPolygon(
      coords.map((c) => ({
        latitude: c.latitud,
        longitude: c.longitud,
      }))
    );
  }
  return (
    <>
      <div><strong>{nombre}</strong></div>
      <div>Área ({tipo}): {area.toLocaleString("es-CO", { maximumFractionDigits: 2 })} m²</div>
      <div>{coords.length} puntos</div>
      <div>Lat: {first.latitud.toFixed(5)}, Lng: {first.longitud.toFixed(5)}</div>
    </>
  );
}

export default function SubloteMapList({ sublotes, lotes }: SubloteMapListProps) {
  return (
    <MapContainer
      center={[2.44, -76.61]}
      zoom={17}
      style={{ height: "100%", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* 🟫 Lotes en gris */}
      {lotes.map((lote) => {
        const coords = lote.coordenadas_lote
          ?.filter(
            (c) =>
              c &&
              typeof c.latitud_lote === "number" &&
              typeof c.longitud_lote === "number"
          )
          .map((c) => ({
            latitud: c.latitud_lote,
            longitud: c.longitud_lote,
          }));

        if (!coords || coords.length < 3) return null;

        const positions = coords.map((c) => [c.latitud, c.longitud]) as [number, number][];

        return (
          <Polygon
            key={`lote-${lote.id_lote_pk}`}
            positions={positions}
            pathOptions={{
              color: "gray",
              fillColor: "#d3d3d3",
              fillOpacity: 0.4,
              weight: 1.2,
            }}
          >
            <Tooltip direction="top" sticky>
              {formatPopupContent(lote.nombre_lote, coords, "lote")}
            </Tooltip>
          </Polygon>
        );
      })}

      {/* 🟩 Sublotes en verde */}
      {sublotes.map((sublote) => {
        const coords = sublote.coordenadas_sublote
          ?.filter(
            (c) =>
              c &&
              typeof c.latitud_sublote === "number" &&
              typeof c.longitud_sublote === "number"
          )
          .map((c) => ({
            latitud: c.latitud_sublote,
            longitud: c.longitud_sublote,
          }));

        if (!coords || coords.length < 3) return null;

        const positions = coords.map((c) => [c.latitud, c.longitud]) as [number, number][];

        return (
          <Polygon
            key={`sublote-${sublote.id_sublote_pk}`}
            positions={positions}
            pathOptions={{
              color: "#059669",
              fillColor: "#34d399",
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Tooltip direction="top" sticky>
              {formatPopupContent(sublote.nombre_sublote, coords, "sublote")}
            </Tooltip>
          </Polygon>
        );
      })}

      <FitBoundsHandler sublotes={sublotes} lotes={lotes} />
    </MapContainer>
  );
}
