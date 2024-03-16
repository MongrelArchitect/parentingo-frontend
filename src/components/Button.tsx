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
      className="border-2 border-slate-800 bg-slate-600 p-1 text-white"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
