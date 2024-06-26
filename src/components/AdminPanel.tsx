import { useEffect, useState } from "react";

import BannedControls from "./BannedControls";
import DeleteGroup from "./DeleteGroup";
import ErrorMessage from "./ErrorMessage";
import MemberControls from "./MemberControls";
import ModControls from "./ModControls";

import GroupInterface from "@interfaces/Groups";

import users from "@util/users";

interface Props {
  group: GroupInterface;
  updateGroupInfo: () => void;
  userIsAdmin: boolean;
}

interface MemberList {
  [key: string]: string;
}

export default function AdminPanel({
  group,
  updateGroupInfo,
  userIsAdmin,
}: Props) {
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
    <div className="rounded border-2 border-orange-600 bg-white shadow-md shadow-slate-400">
      <h1 className="bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        {userIsAdmin ? "Admin Panel" : "Mod Panel"}
      </h1>
      <div className="flex flex-col gap-2 p-1 text-lg">
        {memberList ? (
          <MemberControls
            groupId={group.id}
            memberList={memberList}
            mods={group.mods}
            updateGroupInfo={updateGroupInfo}
            userIsAdmin={userIsAdmin}
          />
        ) : null}
        {memberList && userIsAdmin ? (
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
        {userIsAdmin ? <DeleteGroup groupId={group.id} /> : null}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
