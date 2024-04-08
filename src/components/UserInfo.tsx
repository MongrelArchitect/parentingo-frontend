import he from "he";
import { useEffect, useState } from "react";

import Avatar from "./Avatar";

import { PublicUserInfo } from "@interfaces/Users";

import users from "@util/users";

interface Props {
  avatar?: true;
  avatarMaxWidth?: number;
  flipped?: true;
  username?: true;
  userId: string;
}

export default function UserInfo({
  avatar,
  avatarMaxWidth,
  flipped,
  userId,
  username,
}: Props) {
  const [error, setError] = useState<null | string>(null);
  const [userInfo, setUserInfo] = useState<null | PublicUserInfo>(null);

  const getUsername = async () => {
    setError(null);
    // convert post author from userid to username
    const result = await users.getUserInfo(userId);
    if (result.status === 200 && result.user) {
      setError(null);
      setUserInfo(result.user);
    } else {
      setUserInfo(null);
      setError(result.message);
      console.error(result);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  if (!userInfo) {
    return null;
  }

  return (
    <>
      {avatar && avatarMaxWidth && flipped ? (
        <Avatar avatarURL={userInfo.avatar} maxWidth={avatarMaxWidth} />
      ) : null}
      {username ? <span>{error || he.decode(userInfo.username)}</span> : null}
      {avatar && avatarMaxWidth && !flipped ? (
        <Avatar avatarURL={userInfo.avatar} maxWidth={avatarMaxWidth} />
      ) : null}
    </>
  );
}
