import { PropsWithChildren } from "react";

export default function Form({children}: PropsWithChildren) {
  return (
    <form className="flex flex-col gap-2 text-lg">
      {children}
    </form>
      );

}
