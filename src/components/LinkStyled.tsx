import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
}

export default function LinkStyled({ children, to }: PropsWithChildren<Props>) {
  return (
    <NavLink className="border-2 border-b-transparent hover:border-b-rose-700" to={to}>
      {children}
    </NavLink>
  );
}
