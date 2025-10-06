import type { PropsWithChildren } from "react";

export default function AuthLayout({
  
  title,
  subtitle,
  logoSlot,
  backSlot,
  formTitle,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  logoSlot: React.ReactNode;
  backSlot?: React.ReactNode;
  formTitle: string;
}>) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* IZQUIERDA: imagen + título */}
      <div className="hidden lg:block relative">
        <img src='src/assets/cacao.jpg' alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-10 lg:px-16">
            <h1 className="text-white text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow">{title}</h1>
            {subtitle && (
              <p className="text-white/90 text-xl lg:text-2xl mt-2 drop-shadow">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* DERECHA: panel */}
      <div className="h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[540px]">
          <div className="grid grid-cols-[32px_1fr_32px] items-center mb-4">
            <div>{backSlot}</div>
            <div className="flex justify-center">{logoSlot}</div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-content1">
            <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
