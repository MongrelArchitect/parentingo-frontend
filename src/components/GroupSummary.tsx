import he from "he";
import { Link } from "react-router-dom";
import GroupInterface from "@interfaces/Groups";

interface Props {
  admin?: boolean;
  group: GroupInterface;
}

export default function GroupSummary({ admin, group }: Props) {
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
        <p className="italic">
          {group.members.length} member
          {group.members.length > 1 ? "s" : ""}
        </p>
        <p>{he.decode(group.description)}</p>
      </div>
    </li>
  );
}
