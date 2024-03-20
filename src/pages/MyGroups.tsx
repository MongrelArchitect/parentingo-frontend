import { useContext, useEffect, useState } from "react";

import ErrorMessage from "@components/ErrorMessage";
import GroupSummary from "@components/GroupSummary";

import { UserContext } from "@contexts/Users";

import { GroupList } from "@interfaces/Groups";

import groups from "@util/groups";

export default function MyGroups() {
  const [error, setError] = useState<null | string>(null);
  const [memberGroups, setMemberGroups] = useState<null | GroupList>(null);
  const { user } = useContext(UserContext);

  const getGroups = async () => {
    const result = await groups.getMemberGroups();
    if (result.status === 200) {
      setMemberGroups(result.groups);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  if (!user) {
    return null;
  }

  const displayMemberGroups = () => {
    if (!memberGroups) {
      return <li>Not a member of any groups</li>;
    }

    const groupIds = Object.keys(memberGroups).sort((a, b) => {
      const isAdminGroupA = memberGroups[a].admin === user.id;
      const isAdminGroupB = memberGroups[b].admin === user.id;
      if (isAdminGroupA && !isAdminGroupB) {
        return -1;
      }
      if (!isAdminGroupA && isAdminGroupB) {
        return 1;
      }
      return 0;
    });

    return groupIds.map((groupId) => {
      const group = memberGroups[groupId];

      return (
        <GroupSummary
          admin={group.admin === user.id}
          group={group}
          key={groupId}
          updateGroup={getGroups}
        />
      );
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">My Groups</h1>
      <ul className="flex flex-col gap-4">{displayMemberGroups()}</ul>
      <ErrorMessage error={error} />
    </div>
  );
}
