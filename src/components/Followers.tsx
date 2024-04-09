import { Link } from "react-router-dom";

import UserInfo from "./UserInfo";

interface Props {
  followers: string[];
  username: string;
}

export default function Followers({ followers, username }: Props) {
  return (
    <>
      <h1 className="text-xl">Followers</h1>
      {followers.length ? (
        <ul className="flex flex-col gap-4">
          {followers.map((userId) => {
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
        <div>{username} has no followers</div>
      )}
    </>
  );
}
