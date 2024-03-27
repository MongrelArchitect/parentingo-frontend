import { Link, useParams } from "react-router-dom";

import ErrorMessage from "@components/ErrorMessage";

export default function PostDeleted() {
  const { groupId } = useParams();

  if (!groupId) {
    return <ErrorMessage error="Missing groupId in URL path" />;
  }

  return (
    <div className="rounded border-2 border-orange-600 bg-white">
      <h2 className="bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        Post Deleted
      </h2>
      <div className="flex flex-col gap-2 p-1">
        <Link
          className="text-lg text-sky-800 underline"
          to={`/groups/${groupId}`}
        >
          Return to group
        </Link>
      </div>
    </div>
  );
}
