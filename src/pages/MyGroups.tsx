import { useContext, useEffect, useState } from "react";

import ErrorMessage from "@components/ErrorMessage";
import GroupSummary from "@components/GroupSummary";

import { UserContext } from "@contexts/Users";

import useTitle from "@hooks/useTitle";

import { GroupList } from "@interfaces/Groups";

import groups from "@util/groups";

export default function MyGroups() {
  useTitle("My Groups");

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

    const groupIds = Object.keys(memberGroups);

    return groupIds.map((groupId) => {
      const group = memberGroups[groupId];

      return (
        <GroupSummary
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
