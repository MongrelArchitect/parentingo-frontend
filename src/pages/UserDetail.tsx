import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorMessage from "@components/ErrorMessage";

import useTitle from "@hooks/useTitle";

import { PublicUserInfo } from "@interfaces/Users";

import users from "@util/users";

export default function UserDetail() {
  const { userId } = useParams();

  const [error, setError] = useState<null | string>(null);
  const [profileInfo, setProfileInfo] = useState<null | PublicUserInfo>(null);

  const getProfileInfo = async () => {
    if (userId) {
      const response = await users.getUserInfo(userId);
      if (response.status === 200 && response.user) {
        setProfileInfo(response.user);
        setError(null);
      } else {
        setError(response.message);
      }
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);

  useTitle(profileInfo ? profileInfo.username : "");

  if (!userId || !profileInfo) {
    return null;
  }

  return (
    <div className="rounded border-2 border-slate-600 bg-white shadow-md shadow-slate-400">
      <div className="flex flex-wrap justify-between gap-2 bg-slate-600 p-1 text-xl text-neutral-100">
        <span>{profileInfo.username}</span>
        <span className="italic">{profileInfo.name}</span>
      </div>
      <div className="flex flex-col gap-4 p-1">
        Sit et beatae recusandae aperiam ea! Corporis autem illo atque iste
        velit. Aut eaque debitis sequi eaque molestiae Ipsa dicta?
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
