import { useEffect, useState } from "react";

import ErrorMessage from "@components/ErrorMessage";
import GroupSummary from "@components/GroupSummary";

import { GroupList } from "@interfaces/Groups";

import groups from "@util/groups";

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
        console.error(result);
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
            <GroupSummary group={currentGroup} key={id} />
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <h1>All Groups</h1>
      {displayGroups()}
      <ErrorMessage error={error} />
    </div>
  );
}
