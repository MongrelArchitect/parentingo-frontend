import { useEffect, useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

import GroupInterface from "@interfaces/Groups";

import users from "@util/users";

interface Props {
  group: GroupInterface;
}

interface MemberList {
  [key: string]: string;
}

export default function AdminPanel({ group }: Props) {
  const { members } = group;

  const [error, setError] = useState<null | string>(null);
  const [memberList, setMemberList] = useState<null | MemberList>(null);

  const getUsername = async (userId: string) => {
    setError(null);
    // convert post author from userid to username
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
    generateMemberList();
  }, []);

  const memberOptions = memberList
    ? Object.keys(memberList)
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
        })
    : null;

  const modOptions = memberList
    ? Object.keys(memberList)
        .filter((memberId) => {
          return group.mods.includes(memberId);
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
        })
    : null;

  const memberSelect = () => {
    if (!members || !memberOptions || !memberOptions.length) {
      return <span>Group has no non-admin members</span>;
    }

    return (
      <select className="rounded p-1" defaultValue="" id="members">
        <option value="" disabled>
          Select a user
        </option>
        {memberOptions}
      </select>
    );
  };

  const modSelect = () => {
    if (!members || !modOptions || !modOptions.length) {
      return <span>Group has no non-admin mods</span>;
    }

    return (
      <select className="rounded p-1" defaultValue="" id="mods">
        <option value="" disabled>
          Select a user
        </option>
        {modOptions}
      </select>
    );
  };

  const promote = () => {};

  const demote = () => {};

  const ban = () => {};

  const memberControls = () => {
    return (
      <>
        <label htmlFor="members">
          <h2 className="text-xl">Members</h2>
        </label>
        {memberSelect()}
        <div className="flex flex-wrap justify-between gap-2">
          <Button onClick={promote}>Promote to mod</Button>
          <Button onClick={ban}>Ban user</Button>
        </div>
      </>
    );
  };

  const modControls = () => {
    return (
      <>
        <label htmlFor="mods">
          <h2 className="text-xl">Mods</h2>
        </label>
        {modSelect()}
        <div className="flex flex-wrap justify-between gap-2">
          <Button onClick={demote}>Demote to member</Button>
          <Button onClick={ban}>Ban user</Button>
        </div>
      </>
    );
  };

  return (
    <div className="rounded bg-white shadow-md shadow-slate-400">
      <h1 className="rounded-t bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        Admin Panel
      </h1>
      <div className="flex flex-col gap-2 p-1 text-lg">
        {memberControls()}
        {modControls()}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
