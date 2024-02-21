import { useContext } from "react";
import { UserContext } from "@contexts/Users";
import Login from "@components/Login";

export default function Landing() {
  const auth = useContext(UserContext);
  const user = auth ? auth.user : null;

  if (user) {
    return (
      <div>LANDING WITH USER</div>
    );
  }
  return (
    <Login />
  );
}
