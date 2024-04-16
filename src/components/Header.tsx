import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "./Button";

import defaultAvatarIcon from "@assets/icons/account-circle.svg";

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
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between bg-sky-900 p-2 text-lg text-neutral-100">
      <Link title="View your landing page feed" to="/">
        Parentingo
      </Link>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
        {user ? (
          <Link
            className="flex flex-wrap items-center justify-end gap-2"
            title="View your user profile"
            to={`/users/${user.id}`}
          >
            <img
              alt=""
              className="h-[48px] w-[48px] bg-white rounded-full border-2 border-slate-900"
              src={user.avatar || defaultAvatarIcon}
            />
            <span>{user.username}</span>
          </Link>
        ) : null}
        {user ? <Button onClick={logOut}>Log out</Button> : null}
      </div>
    </header>
  );
}
