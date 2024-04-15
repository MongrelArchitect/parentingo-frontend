import { Outlet } from "react-router-dom";
import Header from "@components/Header";

export default function Root() {
  return (
    <div className="min-h-[100lvh] bg-stone-200 text-slate-800 flex flex-col">
      <Header />
      <main className="self-center max-w-[640px] w-full">
        <Outlet />
      </main>
    </div>
  );
}
