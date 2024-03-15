import he from "he";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewPost from "@components/NewPost";
import GroupPosts from "@components/GroupPosts";
import { UserContext } from "@contexts/Users";
import GroupInterface from "@interfaces/Groups";
import groups from "@util/groups";
import styles from "@configs/styles";

export default function GroupDetail() {
  const { user } = useContext(UserContext);

  const [error, setError] = useState<null | string>(null);
  const [group, setGroup] = useState<null | GroupInterface>(null);
  const { groupId } = useParams();

  const getGroupInfo = async () => {
    if (!groupId) {
      setError("Missing group id");
    } else {
      const result = await groups.getGroupInfo(groupId);
      if (result.status === 200 && result.group) {
        setGroup(result.group);
      } else {
        setError(result.message);
        // XXX
        // display info more elegantly?
        console.error(result);
      }
    }
  };

  useEffect(() => {
    getGroupInfo();
  });

  if (!user) {
    return null;
  }

  const displayGroupInfo = () => {
    if (!group) {
      return null;
    }
    return (
      <div>
        <h1>{group.name}</h1>
        <p>members: {group.members.length}</p>
        <p>{he.decode(group.description)}</p>
      </div>
    );
  };

  const displayMembershipControl = () => {
    const isAdmin = group && group.admin === user.id;
    if (isAdmin || !group) {
      // our admin can't leave their own group
      return null;
    }

    const isMember = group.members.includes(user.id);
    return (
      <button
        className={styles.buttonConfirm}
        onClick={async () => {
          const result = !isMember
            ? await groups.joinGroup(group.id)
            : await groups.leaveGroup(group.id);
          if (result.status === 200) {
            getGroupInfo();
          } else {
            setError(result.message);
            // XXX
            // display info more elegantly?
            console.error(result);
          }
        }}
        type="button"
      >
        {isMember ? "Leave group" : "Join group"}
      </button>
    );
  };

  return (
    <div>
      {displayGroupInfo()}
      {displayMembershipControl()}
      {group ? <NewPost groupId={group.id} /> : null}
      {group ? <GroupPosts groupId={group.id} /> : null}
      {error ? <div className={styles.error}>error</div> : null}
    </div>
  );
}
