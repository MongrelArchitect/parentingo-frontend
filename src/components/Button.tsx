import { PropsWithChildren } from "react";

interface Props {
  onClick: () => void;
}

export default function Button({
  children,
  onClick,
}: PropsWithChildren<Props>) {
  return (
    <button
      className="rounded bg-rose-800 p-1 text-neutral-100 hover:bg-rose-900 hover:outline hover:outline-2 hover:outline-slate-800 focus:bg-rose-900 focus:outline focus:outline-2 focus:outline-slate-800"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
