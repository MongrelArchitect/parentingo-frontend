import { Outlet } from "react-router-dom";
import Header from "@components/Header";

export default function Root() {
  return (
    <div className="grid min-h-[100lvh] grid-rows-[auto_1fr]">
      <Header />
      <main className="bg-neutral-200 text-slate-800">
        <Outlet />
      </main>
    </div>
  );
}
