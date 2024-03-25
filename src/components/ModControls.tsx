import { useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

import groups from "@util/groups";

interface MemberList {
  [key: string]: string;
}

interface Props {
  groupId: string;
  memberList: MemberList;
  mods: string[];
  updateGroupInfo: () => void;
}

export default function ModControls({
  groupId,
  memberList,
  mods,
  updateGroupInfo,
}: Props) {
  const [error, setError] = useState<null | string>(null);
  const [selectedUser, setSelectedUser] = useState<null | string>(null);

  const modOptions = Object.keys(memberList)
    .filter((memberId) => {
      return mods.includes(memberId);
    })
    .sort((a, b) => {
      const memberA = memberList[a];
      const memberB = memberList[b];
      return memberA.localeCompare(memberB);
    })
    .map((memberId) => {
      return (
        <option key={`mod-${memberId}`} value={memberId}>
          {memberList[memberId]}
        </option>
      );
    });

  const selectUser = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLSelectElement;
    setSelectedUser(target.value);
  };

  const demote = async () => {
    if (selectedUser) {
      const result = await groups.demoteMod(groupId, selectedUser);
      if (result.status !== 200) {
        console.error(result);
        setError(result.message);
      } else {
        console.log(result);
        updateGroupInfo();
      }
    }
  };

  const ban = () => {};

  const modSelect = () => {
    if (!modOptions.length) {
      return <span className="italic">Group has no non-admin mods</span>;
    }

    return (
      <select
        className="rounded p-1"
        defaultValue=""
        id="mods"
        onChange={selectUser}
      >
        <option value="" disabled>
          Select a user
        </option>
        {modOptions}
      </select>
    );
  };

  const controlButtons = () => {
    if (!modOptions.length) {
      return null;
    }
    return (
      <div className="flex flex-wrap justify-between gap-2">
        <Button onClick={demote}>Demote to member</Button>
        <Button onClick={ban}>Ban user</Button>
      </div>
    );
  };

  return (
    <>
      <label htmlFor="mods">
        <h2 className="text-xl">Mods</h2>
      </label>
      {modSelect()}
      {controlButtons()}
      <ErrorMessage error={error} />
    </>
  );
}
