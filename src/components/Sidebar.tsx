import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-teal-200 flex flex-col">
      <Link to="/newgroup">New group</Link>
      <Link to="/groups">All groups</Link>
      <Link to="/groups/mine">My groups</Link>
    </div>
  );
}
