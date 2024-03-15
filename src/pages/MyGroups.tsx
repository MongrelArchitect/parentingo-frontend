import { useContext, useEffect, useState } from "react";
import { UserContext } from "@contexts/Users";
import GroupSummary from "@components/GroupSummary";
import styles from "@configs/styles";
import { GroupList } from "@interfaces/Groups";
import groups from "@util/groups";

export default function MyGroups() {
  const [error, setError] = useState<null | string>(null);
  const [memberGroups, setMemberGroups] = useState<null | GroupList>(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
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
          admin={group.admin === user.id}
          group={group}
          key={groupId}
        />
      );
    });
  };

  return (
    <div>
      <h1>My Groups</h1>
      <ul>{displayMemberGroups()}</ul>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}
