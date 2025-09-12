import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import {
  Sprout,
  Bug,
  FileBarChart,
  Thermometer,
  Droplets,
  Sun,
  Gauge,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import type { LayoutContext } from "../../layouts/ProtectedLayout";

export default function Home() {
  const { setTitle } = useOutletContext<LayoutContext>();
  useEffect(() => setTitle("Inicio"), [setTitle]);

  return (
    <>
      <section>
        <HeroCarousel />
      </section>

      <section className="mt-3">
        <SensorsCard />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6">
        <Card shadow="sm">
          <CardBody className="p-5">
            <div className="grid grid-cols-3 gap-4">
              <Kpi icon={<Sprout className="h-6 w-6" />} label="Cultivos activos" value="14" />
              <Kpi icon={<Bug className="h-6 w-6" />} label="Alertas activas" value="3" />
              <Kpi icon={<FileBarChart className="h-6 w-6" />} label="Reportes generados" value="5" />
            </div>
            <div className="mt-6 h-2 w-full rounded bg-default-200 overflow-hidden">
              <div className="h-full w-2/2 bg-success rounded" />
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="p-5">
            <h3 className="text-lg font-semibold mb-4">Últimas actividades</h3>
            <ul className="space-y-4">
              <ActivityRow text="Se fertilizó el cultivo H333 por el aprendiz Juanita" date="15/7/25" time="8:00 AM" />
              <ActivityRow text="Se registró una venta del cultivo H212" date="12/7/25" time="7:00 AM" />
              <ActivityRow text="Se registró limpieza del suelo en el cultivo H432" date="27/7/25" time="5:00 PM" />
            </ul>
            <div className="mt-5 flex justify-end">
              <Button variant="flat" color="success" endContent={<ChevronRight className="h-4 w-4" />}>
                Ver más
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mt-8">
        <h3 className="text-center text-lg font-semibold mb-4">
          Rentabilidad de los últimos 3 meses
        </h3>
        <Card shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-end gap-4 h-40">
              {[{ h: 40 }, { h: 64 }, { h: 80 }, { h: 56 }, { h: 92 }, { h: 70 }].map((b, i) => (
                <div key={i} className="flex-1 grid place-items-end">
                  <div className="w-7 rounded-t bg-success/80" style={{ height: `${b.h}%` }} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

function HeroCarousel() {
  const slides = [
    { id: 1, img: "/FondoLogin.jpeg", title: "Cultivo: H201", subtitle: "Cacao de brasil" },
    { id: 2, img: "/FondoLogin.jpeg", title: "Cultivo: H201", subtitle: "Cacao de brasil" },
    { id: 3, img: "/FondoLogin.jpeg", title: "Cultivo: H201", subtitle: "Cacao de brasil" },
  ];

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  const go = (n: number) => setIdx((n + slides.length) % slides.length);

  return (
    <Card shadow="sm" className="overflow-hidden rounded-xl">
      <div
        className="relative h-52 md:h-60"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-500"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((s) => (
            <div key={s.id} className="relative w-full shrink-0">
              <img src={s.img} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/55" />

              <div className="absolute left-5 md:left-8 top-5 md:top-8 text-white">
                <p className="text-2xl md:text-3xl font-bold">{s.title}</p>
                <p className="opacity-95">{s.subtitle}</p>
              </div>

              <div className="absolute left-5 md:left-8 bottom-5">
                <Button
                  variant="solid"
                  radius="full"
                  onPress={() => navigate("/cultivos")}
                  className="
                    bg-emerald-600 text-white h-9 px-4 text-sm font-medium
                    hover:bg-emerald-700 active:bg-emerald-800
                    opacity-100 data-[hover=true]:opacity-100 data-[pressed=true]:opacity-100
                  "
                  endContent={<ChevronRight className="h-4 w-4" />}
                >
                  Ver más detalles
                </Button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => go(idx - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 text-white grid place-items-center hover:bg-black/40"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => go(idx + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 text-white grid place-items-center hover:bg-black/40"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => go(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                i === idx ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}


function SensorsCard() {
  const items = [
    { icon: <Thermometer className="h-4 w-4" />, label: "Temperatura", value: "32°" },
    { icon: <Droplets className="h-4 w-4" />, label: "Humedad", value: "79%" },
    { icon: <Sun className="h-4 w-4" />, label: "Soleado", value: "" },
    { icon: <Gauge className="h-4 w-4" />, label: "Sensor pH", value: "3.5" },
  ];

  return (
    <Card shadow="sm">
      <CardBody className="p-0">
        <div className="p-4 md:p-5 space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-foreground-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-success">{it.icon}</span>
                <span className="text-sm">{it.label}</span>
              </div>
              <span className="text-sm font-medium">{it.value || ""}</span>
            </div>
          ))}
        </div>

        <div className="px-4 md:px-5 pb-4">
          <Button variant="flat" color="success" className="w-full">
            Ver actividades
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="h-10 w-10 rounded-full bg-default-200 grid place-items-center">
        <span className="text-foreground-700">{icon}</span>
      </div>
      <div className="text-2xl font-semibold leading-none">{value}</div>
      <div className="text-xs text-foreground-500 text-center">{label}</div>
    </div>
  );
}

function ActivityRow({ text, date, time }: { text: string; date: string; time: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="h-2.5 w-2.5 rounded-full bg-success shrink-0" />
      <p className="flex-1 text-sm text-foreground-700">{text}</p>
      <div className="text-xs text-foreground-500 flex items-center gap-3 shrink-0">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </li>
  );
}
