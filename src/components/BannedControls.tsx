import { useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

import groups from "@util/groups";

interface MemberList {
  [key: string]: string;
}

interface Props {
  bannedList: MemberList;
  groupId: string;
  updateGroupInfo: () => void;
}

export default function BannedControls({
  bannedList,
  groupId,
  updateGroupInfo,
}: Props) {
  const [error, setError] = useState<null | string>(null);
  const [selectedUser, setSelectedUser] = useState<null | string>(null);

  const bannedOptions = Object.keys(bannedList)
    .sort((a, b) => {
      const userA = bannedList[a];
      const userB = bannedList[b];
      return userA.localeCompare(userB);
    })
    .map((userId) => {
      return (
        <option key={`banned-${userId}`} value={userId}>
          {bannedList[userId]}
        </option>
      );
    });

  const selectUser = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLSelectElement;
    setSelectedUser(target.value);
  };

  const unban = async () => {
    if (selectedUser) {
      const result = await groups.unbanUser(groupId, selectedUser);
      if (result.status !== 200) {
        console.error(result);
        setError(result.message);
      } else {
        console.log(result);
        updateGroupInfo();
        setSelectedUser(null);
      }
    }
  };

  const bannedSelect = () => {
    if (!bannedOptions.length) {
      return <span className="italic">Group has no banned users</span>;
    }

    return (
      <select
        className="rounded p-1"
        id="banned"
        onChange={selectUser}
        value={selectedUser || ""}
      >
        <option value="" disabled>
          Select a user
        </option>
        {bannedOptions}
      </select>
    );
  };

  const controlButtons = () => {
    if (!bannedOptions.length || !selectedUser) {
      return null;
    }
    return (
      <div className="flex flex-wrap justify-between gap-2">
        <Button onClick={unban}>Unban user</Button>
      </div>
    );
  };

  return (
    <>
      <label htmlFor="banned">
        <h2 className="text-xl">Banned Users</h2>
      </label>
      {bannedSelect()}
      {controlButtons()}
      <ErrorMessage error={error} />
    </>
  );
}
