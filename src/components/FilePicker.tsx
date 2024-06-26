interface Props {
  accept: string;
  id: string;
  labelText: string;
  onChange: (event: React.SyntheticEvent) => void;
}

export default function FilePicker({ accept, id, labelText, onChange }: Props) {
  // this is to replicate the behavior of the default file picker button
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { code } = event;
    if (code === "Space" || code === "Enter") {
      // XXX better way to do this?
      const element = document.querySelector(`#${id}`) as HTMLButtonElement;
      element.click();
    }
  };

  return (
    <>
      <input accept={accept} hidden id={id} onChange={onChange} type="file" />
      <label
        className="cursor-pointer select-none rounded bg-orange-600 p-1 text-center text-neutral-100 hover:bg-orange-800 hover:outline hover:outline-2 hover:outline-slate-800 focus:bg-orange-800 focus:outline focus:outline-2 focus:outline-slate-800"
        htmlFor={id}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        {labelText}
      </label>
    </>
  );
}
