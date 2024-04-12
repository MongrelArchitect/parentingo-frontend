import { Link } from "react-router-dom";

export default function GroupDeleted() {
  return (
    <div className="rounded border-2 border-orange-600 bg-white">
      <h2 className="bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        Group Deleted
      </h2>
      <div className="flex flex-col gap-2 p-1">
        <Link
          className="text-lg text-sky-800 underline"
          to={"/"}
        >
          Go to landing page
        </Link>
      </div>
    </div>
  );
}
