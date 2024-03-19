import he from "he";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";

import GroupInterface from "@interfaces/Groups";

import posts from "@util/posts";

interface Props {
  admin?: boolean;
  group: GroupInterface;
}

export default function GroupSummary({ admin, group }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [postCount, setPostCount] = useState(0);

  const getCount = async () => {
    setError(null);
    const result = await posts.getPostCount(group.id);
    if (result.status === 200) {
      setError(null);
      setPostCount(result.count);
    } else {
      setPostCount(0);
      setError(result.message);
      console.error(result);
    }
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <li className="rounded bg-white shadow-md shadow-slate-400">
      <Link
        className="flex flex-wrap items-center justify-between gap-2 rounded-t bg-sky-600 p-1 text-xl"
        to={`/groups/${group.id}`}
      >
        <h2 className="capitalize text-neutral-100">{group.name}</h2>
        {admin ? <p className="text-3xl font-bold text-yellow-400">★</p> : null}
      </Link>
      <div className="flex flex-col gap-2 p-1">
        <div className="flex flex-wrap justify-between gap-1 font-mono">
          <p>
            {group.members.length} member
            {group.members.length === 1 ? "" : "s"}
          </p>
          <p>
            {postCount} post 
            {postCount === 1 ? "" : "s"}
          </p>
        </div>
        <p className="text-lg">{he.decode(group.description)}</p>
      </div>
      <ErrorMessage error={error} />
    </li>
  );
}
