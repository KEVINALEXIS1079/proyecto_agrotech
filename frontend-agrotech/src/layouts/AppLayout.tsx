
import { Outlet } from "react-router-dom";
import Menu from "../components/menu";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto w-full p-3 flex items-center justify-between">
          <div className="font-semibold">AgroTech</div>
          <Menu />
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
