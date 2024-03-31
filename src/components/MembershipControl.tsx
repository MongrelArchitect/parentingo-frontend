import { useContext, useState } from "react";

import ErrorMessage from "./ErrorMessage";

import accountIcon from "@assets/icons/account.svg";
import modIcon from "@assets/icons/account-tie.svg";
import accountOffIcon from "@assets/icons/account-off-outline.svg";
import alertIcon from "@assets/icons/alert-octagon-outline.svg";

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
    return (
      <div className="flex flex-wrap items-center gap-1 text-neutral-50 ">
        <span className="text-lg">ADMIN</span>
        <span className="text-3xl font-bold">★</span>
      </div>
    );
  }

  const isBanned = group.banned.includes(user.id);

  if (isBanned) {
    return (
      <div className="flex flex-wrap items-center gap-1 text-lg text-neutral-50">
        banned
        <img className="h-[24px] invert" src={alertIcon} />
      </div>
    );
  }

  const isMember = group.members.includes(user.id);
  const isMod = group.mods.includes(user.id);

  const determineMemberIcon = () => {
    if (isMod) {
      return modIcon;
    }
    if (isMember) {
      return accountIcon;
    }
    return accountOffIcon;
  };

  return (
    <div className="flex flex-wrap items-center gap-1 text-neutral-50">
      {isMod ? <span className="text-lg">MOD</span> : null}
      <button
        onClick={toggleMembership}
        title={isMember ? "Leave group" : "Join group"}
        type="button"
      >
        <img className="h-[24px] invert" src={determineMemberIcon()} />
      </button>
      {error ? (
        <div className="w-full">
          <ErrorMessage error={error} />
        </div>
      ) : null}
    </div>
  );
}
