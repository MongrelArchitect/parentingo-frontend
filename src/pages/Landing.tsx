import { useContext } from "react";
import { UserContext } from "@contexts/Users";
import Login from "@components/Login";

export default function Landing() {
  const auth = useContext(UserContext);
  const user = auth.user;

  if (user) {
    return (
      <div>Welcome {user.name}!</div>
    );
  }
  return (
    <>
      <Login />
    </>
  );
}
