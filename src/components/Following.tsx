import { Link } from "react-router-dom";

import UserInfo from "./UserInfo";

interface Props {
  following: string[];
  username: string;
}

export default function Following({ following, username }: Props) {
  return (
    <>
      <h1 className="text-xl">Following</h1>
      {following.length ? (
        <ul className="flex flex-col gap-4">
          {following.map((userId) => {
            return (
              <li key={userId}>
                <Link
                  className="flex flex-wrap items-center gap-2 text-lg text-sky-900"
                  to={`/users/${userId}`}
                >
                  <UserInfo
                    avatar
                    avatarMaxWidth={48}
                    flipped
                    userId={userId}
                    username
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>{username} follows nobody</div>
      )}
    </>
  );
}
