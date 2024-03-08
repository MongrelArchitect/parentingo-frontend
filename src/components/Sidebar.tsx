import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-teal-200">
      <Link to="/newgroup">New group</Link>
    </div>
  );
}
