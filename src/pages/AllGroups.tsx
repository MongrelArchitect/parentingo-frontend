import { useEffect, useState } from "react";

import ErrorMessage from "@components/ErrorMessage";
import GroupSummary from "@components/GroupSummary";

import { GroupList } from "@interfaces/Groups";

import groups from "@util/groups";

export default function AllGroups() {
  const [error, setError] = useState<null | string>(null);
  const [allGroups, setAllGroups] = useState<null | GroupList>(null);

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

  useEffect(() => {
    getGroups();
  }, []);

  const displayGroups = () => {
    if (!allGroups) {
      return <p>No groups found</p>;
    }
    // XXX TODO
    // sort these...by what criteria?
    const groupIds = Object.keys(allGroups);
    return (
      <ul className="flex flex-col gap-4">
        {groupIds.map((id) => {
          const currentGroup = allGroups[id];
          return (
            <GroupSummary
              group={currentGroup}
              key={id}
              updateGroup={getGroups}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">All Groups</h1>
      {displayGroups()}
      <ErrorMessage error={error} />
    </div>
  );
}
