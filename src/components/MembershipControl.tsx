import { useContext, useState } from "react";

import ErrorMessage from "./ErrorMessage";

import accountIcon from "@assets/icons/account.svg";
import accountOffIcon from "@assets/icons/account-off-outline.svg";

import { UserContext } from "@contexts/Users";

import GroupInterface from "@interfaces/Groups";

import groups from "@util/groups";

interface Props {
  updateGroup: () => void;
  group: GroupInterface;
}

export default function MembershipControl({ group, updateGroup }: Props) {
  const { user } = useContext(UserContext);
  const [error, setError] = useState<null | string>(null);

  if (!user) {
    return null;
  }

  const toggleMembership = async () => {
    const isMember = group.members.includes(user.id);
    const result = !isMember
      ? await groups.joinGroup(group.id)
      : await groups.leaveGroup(group.id);
    if (result.status === 200) {
      updateGroup();
    } else {
      setError(result.message);
      // XXX
      // display info more elegantly?
      console.error(result);
    }
  };

  const isAdmin = group.admin === user.id;
  if (isAdmin) {
    return <p className="text-3xl font-bold text-yellow-400">★</p>;
  }

  const isMember = group.members.includes(user.id);
  return (
    <>
      <button
        onClick={toggleMembership}
        title={isMember ? "Leave group" : "Join group"}
        type="button"
      >
        <img
          className="h-[24px] invert"
          src={isMember ? accountIcon : accountOffIcon}
        />
      </button>
      <ErrorMessage error={error} />
    </>
  );
}
