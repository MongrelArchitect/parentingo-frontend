import { useEffect, useState } from "react";

import ErrorMessage from "@components/ErrorMessage";
import GroupSummary from "@components/GroupSummary";

import useTitle from "@hooks/useTitle";

import { GroupList } from "@interfaces/Groups";

import groups from "@util/groups";

export default function AllGroups() {
  useTitle("All Groups");

  const [allGroups, setAllGroups] = useState<null | GroupList>(null);
  const [error, setError] = useState<null | string>(null);

  const getGroups = async () => {
    const result = await groups.getAllGroups();
    if (result.status === 200) {
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
      return <p className="text-xl">No groups found</p>;
    }
    // sort alphabetically by name
    const groupIds = Object.keys(allGroups).sort((a, b) => {
      const groupA = allGroups[a];
      const groupB = allGroups[b];
      return groupA.name.localeCompare((groupB.name));
    });
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
