import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "./Button";

import { UserContext } from "@contexts/Users";

export default function Header() {
  const auth = useContext(UserContext);
  const { attemptLogout, user } = auth;

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const logOut = async () => {
    const status = await attemptLogout();
    // these error situations should be very unlikely...
    if (status === 401) {
      setError(
        "No authenticated user to log out. This shouldn't be possible, since you have to be authenticated to see the 'log out' button...something wonky happened here =(",
      );
    }
    if (status === 500) {
      setError("Server error - maybe the back end is down? Try again later =(");
    }
    navigate("/");
  };

  useEffect(() => {
    if (error) {
      // XXX
      // for now we'll just do a good ol' fashioned "alert"
      // maybe later we'll make some nicer modal message or something....
      alert(error);
    }
  }, [error]);

  return (
    <header className="flex flex-wrap items-center justify-between bg-sky-900 p-2 text-lg text-neutral-100 sticky top-0">
      <Link to="/">Parentingo</Link>
      <div className="flex flex-wrap items-center gap-2">
        {user ? <div>{user.username}</div> : null}
        {user ? <Button onClick={logOut}>Log out</Button> : null}
      </div>
    </header>
  );
}
