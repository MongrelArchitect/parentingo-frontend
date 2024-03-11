import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import he from "he";
import { GroupList } from "@interfaces/Groups";
import groups from "@util/groups";
import styles from "@configs/styles";

export default function GroupsSummary() {
  const [error, setError] = useState<null | string>(null);
  const [allGroups, setAllGroups] = useState<null | GroupList>(null);

  useEffect(() => {
    const getGroups = async () => {
      const result = await groups.getAllGroups();
      if (result.status === 200 && result.groups) {
        setAllGroups(result.groups);
      } else {
        // XXX
        // need to parse error messages & provide feedback to user
        console.log(result);
        setError(result.message);
      }
    };
    getGroups();
  }, []);

  const displayGroups = () => {
    if (!allGroups) {
      return <p>No groups found</p>;
    }
    const groupIds = Object.keys(allGroups);
    return (
      <ul>
        {groupIds.map((id) => {
          const currentGroup = allGroups[id];
          return (
            <li key={id}>
              <div>
                <Link to={`/groups/${id}`}>
                  <h2 className="underline text-teal-800">{currentGroup.name}</h2>
                </Link>
                <p>
                  {currentGroup.members.length} member
                  {currentGroup.members.length > 1 ? "s" : ""}
                </p>
                <p>{he.decode(currentGroup.description)}</p>
              </div>
              <hr />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <h1>All Groups</h1>
      {displayGroups()}
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}
