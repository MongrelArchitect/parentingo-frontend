import { Outlet } from "react-router-dom";
import Header from "@components/Header";

export default function Root() {
  return (
    <div className="min-h-[100lvh] bg-stone-200 text-slate-800">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
