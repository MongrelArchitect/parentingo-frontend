import Button from "./Button";

interface MemberList {
  [key: string]: string;
}

interface Props {
  memberList: MemberList;
  mods: string[];
}

export default function ModControls({ memberList, mods }: Props) {
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

  const demote = () => {};

  const ban = () => {};

  const modSelect = () => {
    if (!modOptions.length) {
      return <span className="italic">Group has no non-admin mods</span>;
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
    </>
  );
}
