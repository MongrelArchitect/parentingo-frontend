import he from "he";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";
import MembershipControl from "./MembershipControl";

import GroupInterface from "@interfaces/Groups";

import posts from "@util/posts";

interface Props {
  group: GroupInterface;
  updateGroup: () => void;
}

export default function GroupSummary({ group, updateGroup }: Props) {
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
    <li className="rounded border-2 border-sky-600 bg-white shadow-md shadow-slate-400">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-sky-600 p-1 text-xl">
        <Link to={`/groups/${group.id}`}>
          <h2 className="capitalize text-neutral-100">
            {he.decode(group.name)}
          </h2>
        </Link>
        <MembershipControl group={group} updateGroup={updateGroup} />
      </div>
      <div className="flex flex-col gap-4 p-1">
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
        <pre className="whitespace-pre-wrap font-sans text-lg">
          {he.decode(group.description)}
        </pre>
      </div>
      <ErrorMessage error={error} />
    </li>
  );
}
