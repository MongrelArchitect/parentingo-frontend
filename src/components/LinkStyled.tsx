import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
}

export default function LinkStyled({
  children,
  to,
}: PropsWithChildren<Props>) {
  return (
    <Link
      className="rounded bg-violet-700 p-1 text-neutral-100 hover:bg-violet-800 hover:outline hover:outline-2 hover:outline-slate-800 focus:bg-violet-800 focus:outline focus:outline-2 focus:outline-slate-800"
      to={to}
    >
      {children}
    </Link>
  );
}
