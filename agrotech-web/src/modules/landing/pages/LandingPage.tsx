import { useState } from "react";
import { Activity, Boxes, LineChart, Menu, X } from "lucide-react";

function Feature({
  title,
  text,
  icon,
}: { title: string; text: string; icon?: React.ReactNode }) {
  return (
    <div
      className="
        group relative rounded-2xl p-6 md:p-8
        bg-white/70 dark:bg-white/60 backdrop-blur
        ring-1 ring-default-200 hover:ring-success/50
        shadow-sm hover:shadow-lg transition-all duration-300
      "
    >
      {icon && (
        <div
          className="
            absolute -top-6 left-6
            h-12 w-12 rounded-xl
            bg-gradient-to-br from-emerald-500/15 to-green-500/15
            ring-1 ring-success/30 grid place-items-center
            shadow-sm
          "
        >
          <span className="text-success">{icon}</span>
        </div>
      )}

      <div className="pt-6">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm md:text-base text-foreground-500 leading-relaxed">
          {text}
        </p>

        <div
          className="
            mt-6 h-px bg-gradient-to-r from-transparent via-default-200 to-transparent
            opacity-80 group-hover:opacity-100 transition-opacity
          "
        />
      </div>
    </div>
  );
}

/* ----------------------------------- */

export default function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <main className="bg-white text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-default-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl h-16 px-5 flex items-center gap-4">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/LogoTic.png"
              alt="TIC"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <span className="hidden sm:inline text-base font-semibold tracking-tight">
              AgroTech
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="ml-auto hidden md:flex items-center gap-10 text-foreground-600">
            <a
              href="#caracteristicas"
              className="relative hover:text-foreground transition-colors"
            >
              Características
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-success transition-all group-hover:w-full" />
            </a>
            <a
              href="#acerca"
              className="relative hover:text-foreground transition-colors"
            >
              Acerca de
            </a>
          </nav>

          <div className="hidden md:flex">
            <a
              href="/login"
              className="
                inline-flex items-center rounded-full
                bg-gradient-to-br from-emerald-600 to-green-600
                px-5 py-2 text-white text-sm font-medium
                shadow-sm hover:shadow-lg
                hover:from-emerald-700 hover:to-green-700
                transition-all
              "
            >
              Iniciar sesión
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="ml-auto md:hidden h-9 w-9 grid place-items-center rounded-full hover:bg-default-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Sheet */}
        {open && (
          <div className="md:hidden border-t border-default-200/70 bg-white">
            <div className="px-5 py-4 flex flex-col gap-3">
              <a
                href="#caracteristicas"
                className="py-2 text-foreground-700"
                onClick={() => setOpen(false)}
              >
                Características
              </a>
              <a
                href="#acerca"
                className="py-2 text-foreground-700"
                onClick={() => setOpen(false)}
              >
                Acerca de
              </a>

              <a
                href="/login"
                className="
                  mt-2 inline-flex items-center justify-center rounded-full
                  bg-emerald-600 px-5 py-2 text-white text-sm font-medium
                  shadow-sm hover:bg-emerald-700 transition-colors
                "
                onClick={() => setOpen(false)}
              >
                Iniciar sesión
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Fondo */}
        <img
          src="/FondoLogin.jpeg"
          alt="Fondo agrícola"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Radial + degradado */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65),rgba(0,0,0,0.8))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* Contenido */}
        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-5 min-h-[66dvh] md:min-h-[70dvh] grid place-items-center">
            <div className="text-center text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs ring-1 ring-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Plataforma para productores y empresas
              </span>

              <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Gestiona tus Cultivos
                <br className="hidden md:block" />
                con Inteligencia
              </h1>

              <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-white/90">
                Optimiza, planifica y analiza cada etapa de tu producción. Todo en un solo lugar,
                con datos claros y decisiones más rápidas.
              </p>

              <div className="mt-8 flex items-center justify-center gap-3 md:gap-4">
                <a
                  href="/register"
                  className="
                    rounded-full px-7 py-3 font-medium
                    bg-white text-emerald-700
                    hover:bg-gray-100
                    shadow-sm hover:shadow-lg
                    transition-all
                  "
                >
                  Comenzar
                </a>
                <a
                  href="#caracteristicas"
                  className="
                    rounded-full px-6 py-3 font-medium
                    border border-white/70 text-white
                    hover:bg-white/10
                    transition-colors
                  "
                >
                  Más información
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Decoraciones */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-400/20 blur-3xl"
        />
      </section>

      {/* CARACTERÍSTICAS */}
      <section id="caracteristicas" className="relative">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Feature
              title="Monitoreo inteligente"
              text="Métricas y alertas en tiempo real para la salud de tus cultivos y el estado de los lotes."
              icon={<Activity className="h-6 w-6" />}
            />
            <Feature
              title="Gestión de recursos"
              text="Planifica y controla insumos, mano de obra y costos con flujos simples y efectivos."
              icon={<Boxes className="h-6 w-6" />}
            />
            <Feature
              title="Análisis de datos"
              text="Paneles de rendimiento e históricos para decisiones más rápidas y precisas."
              icon={<LineChart className="h-6 w-6" />}
            />
          </div>

          {/* logos */}
          <div className="mt-14 flex items-center justify-center gap-16 opacity-95">
            <img src="/LogoTic.png" alt="TIC" className="h-16 md:h-20 w-auto object-contain" />
            <img src="/logoSena.png" alt="SENA" className="h-14 md:h-18 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* ACERCA */}
      <section id="acerca" className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_.8fr] gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Acerca de AgroTech
              </h2>
              <p className="mt-4 text-lg text-foreground-600 leading-relaxed">
                Conectamos innovación y sostenibilidad para ayudarte a gestionar tus cultivos con
                herramientas modernas de monitoreo, análisis y digitalización. Diseñado para ser
                simple y potente, tanto para pequeños productores como para empresas agrícolas.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white ring-1 ring-default-200 p-4">
                  <p className="text-sm text-foreground-500">Ahorro en costos</p>
                  <p className="text-2xl font-semibold">hasta 25%</p>
                </div>
                <div className="rounded-xl bg-white ring-1 ring-default-200 p-4">
                  <p className="text-sm text-foreground-500">Procesos digitalizados</p>
                  <p className="text-2xl font-semibold">+40</p>
                </div>
                <div className="rounded-xl bg-white ring-1 ring-default-200 p-4">
                  <p className="text-sm text-foreground-500">Alertas y métricas</p>
                  <p className="text-2xl font-semibold">en tiempo real</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-default-200 shadow-md">
                <img
                  src="/FondoLogin.jpeg"
                  alt="Cultivo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 hidden sm:block rounded-xl bg-white/90 backdrop-blur ring-1 ring-default-200 px-4 py-3 shadow">
                <p className="text-sm">
                  “Una plataforma clara para planificar y decidir mejor.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-600" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            ¿Listo para transformar tu cultivo?
          </h2>
          <p className="mt-3 text-lg opacity-90">
            Empieza hoy a digitalizar tu producción agrícola con AgroTech.
          </p>
          <a
            href="/register"
            className="
              inline-flex items-center justify-center
              mt-6 rounded-full bg-white text-emerald-700
              px-8 py-3 font-medium shadow-sm hover:shadow-lg
              hover:bg-gray-100 transition-all
            "
          >
            Crear cuenta gratis
          </a>
        </div>

        {/* decor */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/3 h-44 w-44 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 right-1/4 h-52 w-52 rounded-full bg-white/10 blur-2xl"
        />
      </section>

      {/* FOOTER mínimo */}
      <footer className="border-t border-default-200/70">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between text-sm text-foreground-500">
          <span>© {new Date().getFullYear()} AgroTech</span>
          <div className="hidden sm:flex items-center gap-4">
            <a href="#acerca" className="hover:text-foreground">Acerca</a>
            <a href="#caracteristicas" className="hover:text-foreground">Características</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

