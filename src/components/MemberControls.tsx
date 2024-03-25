import Button from "./Button";

interface MemberList {
  [key: string]: string;
}

interface Props {
  memberList: MemberList;
}

export default function MemberControls({ memberList }: Props) {
  const memberOptions = Object.keys(memberList)
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

  const promote = () => {};

  const ban = () => {};

  const memberSelect = () => {
    if (!memberOptions.length) {
      return <span className="italic">Group has no non-admin members</span>;
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
    </>
  );
}
