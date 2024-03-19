import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-full flex-col">
      <Sidebar />
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  );
}
