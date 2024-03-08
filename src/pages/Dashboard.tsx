import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2">
      <Sidebar />
      <Outlet />
    </div>
  );
}
