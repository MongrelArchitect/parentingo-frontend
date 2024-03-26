import { useEffect, useState } from "react";

import BannedControls from "./BannedControls";
import ErrorMessage from "./ErrorMessage";
import MemberControls from "./MemberControls";
import ModControls from "./ModControls";

import GroupInterface from "@interfaces/Groups";

import users from "@util/users";

interface Props {
  group: GroupInterface;
  updateGroupInfo: () => void;
}

interface MemberList {
  [key: string]: string;
}

export default function AdminPanel({ group, updateGroupInfo }: Props) {
  const { banned, members } = group;

  const [bannedList, setBannedList] = useState<null | MemberList>(null);
  const [error, setError] = useState<null | string>(null);
  const [memberList, setMemberList] = useState<null | MemberList>(null);

  const getUsername = async (userId: string) => {
    setError(null);
    // convert from userid to username
    const result = await users.getUserInfo(userId);
    if (result.status === 200 && result.user) {
      setError(null);
      return result.user.username;
    } else {
      setError(result.message);
      console.error(result);
      return "error getting username";
    }
  };

  useEffect(() => {
    const generateMemberList = async () => {
      const list: MemberList = {};
      for (const memberId of members) {
        if (memberId !== group.admin) {
          list[memberId] = await getUsername(memberId);
        }
      }
      setMemberList(list);
    };

    const generateBannedList = async () => {
      const list: MemberList = {};
      for (const userId of banned) {
        list[userId] = await getUsername(userId);
      }
      setBannedList(list);
    };

    generateMemberList();
    generateBannedList();
  }, [banned, members]);

  return (
    <div className="rounded bg-white shadow-md shadow-slate-400">
      <h1 className="rounded-t bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        Admin Panel
      </h1>
      <div className="flex flex-col gap-2 p-1 text-lg">
        {memberList ? (
          <MemberControls
            groupId={group.id}
            memberList={memberList}
            mods={group.mods}
            updateGroupInfo={updateGroupInfo}
          />
        ) : null}
        {memberList ? (
          <ModControls
            groupId={group.id}
            memberList={memberList}
            mods={group.mods}
            updateGroupInfo={updateGroupInfo}
          />
        ) : null}
        {bannedList ? (
          <BannedControls
            groupId={group.id}
            bannedList={bannedList}
            updateGroupInfo={updateGroupInfo}
          />
        ) : null}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
