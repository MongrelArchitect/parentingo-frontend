import Button from "./Button";

interface MemberList {
  [key: string]: string;
}

interface Props {
  memberList: MemberList;
  banned: string[];
}

export default function BannedControls({ memberList, banned}: Props) {
  const bannedOptions = Object.keys(memberList)
    .filter((memberId) => {
      return banned.includes(memberId);
    })
    .sort((a, b) => {
      const memberA = memberList[a];
      const memberB = memberList[b];
      return memberA.localeCompare(memberB);
    })
    .map((memberId) => {
      return (
        <option key={`banned-${memberId}`} value={memberId}>
          {memberList[memberId]}
        </option>
      );
    });

  const unban = () => {};

  const bannedSelect = () => {
    if (!bannedOptions.length) {
      return <span className="italic">Group has no banned users</span>;
    }

    return (
      <select className="rounded p-1" defaultValue="" id="banned">
        <option value="" disabled>
          Select a user
        </option>
        {bannedOptions}
      </select>
    );
  };

  const controlButtons = () => {
    if (!bannedOptions.length) {
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
    </>
  );
}
