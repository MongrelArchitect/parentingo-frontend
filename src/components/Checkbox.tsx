interface Props {
  checkedState: boolean;
  id: string;
  onChange: () => void;
  labelText: string;
}

export default function Checkbox({
  checkedState,
  id,
  labelText,
  onChange,
}: Props) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { code } = event;
    if (code === "Space") {
      onChange();
    }
  };

  return (
    <>
      <input
        hidden
        id={id}
        type="checkbox"
        checked={checkedState}
        onChange={onChange}
      />
      <label
        aria-checked={checkedState}
        aria-label={labelText}
        className="flex flex-wrap items-center gap-1"
        htmlFor={id}
        onKeyDown={handleKeyDown}
        role="checkbox"
        tabIndex={0}
      >
        <div
          className={`flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded border-2 border-sky-800 text-3xl text-neutral-50 select-none ${checkedState ? "bg-sky-600" : null}`}
        >
          ✓
        </div>
        <span className="select-none cursor-pointer">{labelText}</span>
      </label>
    </>
  );
}
