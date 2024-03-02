import { useContext } from "react";
import { UserContext } from "@contexts/Users";

import Dashboard from "@components/Dashboard";
import Login from "@components/Login";

export default function Landing() {
  const auth = useContext(UserContext);
  const user = auth.user;

  if (user) {
    return (
      <Dashboard user={user} />
    );
  }
  return (
    <>
      <Login />
    </>
  );
}
