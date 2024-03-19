import he from "he";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import GroupPosts from "@components/GroupPosts";
import NewPost from "@components/NewPost";

import { UserContext } from "@contexts/Users";

import GroupInterface from "@interfaces/Groups";

import groups from "@util/groups";

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
  }, []);

  if (!user) {
    return null;
  }

  const displayGroupInfo = () => {
    if (!group) {
      return null;
    }
    return (
      <div>
        <h1 className="text-2xl capitalize">{group.name}</h1>
          <p className="italic">
            {group.members.length} member
            {group.members.length > 1 ? "s" : ""}
          </p>
          <p>{he.decode(group.description)}</p>
      </div>
    );
  };

  const toggleMembership = async () => {
    if (group) {
      const isMember = group.members.includes(user.id);
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
    }
  };

  const displayMembershipControl = () => {
    const isAdmin = group && group.admin === user.id;
    if (isAdmin || !group) {
      // our admin can't leave their own group
      return null;
    }

    const isMember = group.members.includes(user.id);
    return (
      <Button onClick={toggleMembership}>
        {isMember ? "Leave group" : "Join group"}
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {displayGroupInfo()}
      {displayMembershipControl()}
      {group ? <NewPost groupId={group.id} /> : null}
      {group ? <GroupPosts groupId={group.id} /> : null}
      <ErrorMessage error={error} />
    </div>
  );
}
