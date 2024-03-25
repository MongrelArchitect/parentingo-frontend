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

export default function MemberControls({ groupId, memberList, mods, updateGroupInfo }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [selectedUser, setSelectedUser] = useState<null | string>(null);

  const memberOptions = Object.keys(memberList)
    .filter((memberId) => {
      return !mods.includes(memberId);
    })
    .sort((a, b) => {
      const memberA = memberList[a];
      const memberB = memberList[b];
      return memberA.localeCompare(memberB);
    })
    .map((memberId) => {
      return (
        <option key={`member-${memberId}`} value={memberId}>
          {memberList[memberId]}
        </option>
      );
    });

  const selectUser = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLSelectElement;
    setSelectedUser(target.value);
  };

  const promote = async () => {
    if (selectedUser) {
      const result = await groups.promoteUserToMod(groupId, selectedUser);
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

  const memberSelect = () => {
    if (!memberOptions.length) {
      return <span className="italic">Group has no non-admin members</span>;
    }

    return (
      <select
        className="rounded p-1"
        defaultValue=""
        id="members"
        onChange={selectUser}
      >
        <option value="" disabled>
          Select a user
        </option>
        {memberOptions}
      </select>
    );
  };

  const controlButtons = () => {
    if (!memberOptions.length) {
      return null;
    }
    return (
      <div className="flex flex-wrap justify-between gap-2">
        <Button onClick={promote}>Promote to mod</Button>
        <Button onClick={ban}>Ban user</Button>
      </div>
    );
  };

  return (
    <>
      <label htmlFor="members">
        <h2 className="text-xl">Members</h2>
      </label>
      {memberSelect()}
      {controlButtons()}
      <ErrorMessage error={error} />
    </>
  );
}
