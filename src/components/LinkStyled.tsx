import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
}

export default function LinkStyled({
  children,
  to,
}: PropsWithChildren<Props>) {
  return (
    <NavLink
      to={to}
    >
      {children}
    </NavLink>
  );
}
