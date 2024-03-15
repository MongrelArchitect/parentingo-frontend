import he from "he";
import { Link } from "react-router-dom";
import GroupInterface from "@interfaces/Groups";

interface Props {
  admin?: boolean;
  group: GroupInterface;
}

export default function GroupSummary({ admin, group }: Props) {
  return (
    <li>
      <div>
        <Link to={`/groups/${group.id}`}>
          <h2 className="text-teal-800 underline">{group.name}</h2>
        </Link>
        {admin ? <p className="font-bold text-blue-800">ADMIN</p> : null}
        <p>
          {group.members.length} member
          {group.members.length > 1 ? "s" : ""}
        </p>
        <p>{he.decode(group.description)}</p>
      </div>
      <hr />
    </li>
  );
}
