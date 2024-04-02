import he from "he";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import defaultAvatarIcon from "@assets/icons/account-circle.svg";

import Button from "@components/Button";
import EditUserInfo from "@components/EditUserInfo";
import ErrorMessage from "@components/ErrorMessage";

import { UserContext } from "@contexts/Users";

import useTitle from "@hooks/useTitle";

import { PublicUserInfo } from "@interfaces/Users";

import users from "@util/users";

export default function UserDetail() {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  // just to make it clearer which "user" we're referencing
  const authUser = user;

  const [editing, setEditing] = useState(false);
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
  }, [userId, user]);

  useTitle(profileInfo ? profileInfo.username : "");

  if (!userId || !profileInfo || !authUser) {
    return null;
  }

  const ownProfile = authUser.id === userId;

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const displayProfile = (
    <div className="rounded border-2 border-slate-600 bg-white text-lg shadow-md shadow-slate-400">
      <div className="flex flex-wrap justify-between gap-2 bg-slate-600 p-1 text-xl text-neutral-100">
        <span>{he.decode(profileInfo.username)}</span>
        <span className="italic">{he.decode(profileInfo.name)}</span>
      </div>
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-wrap gap-4 items-center">
          <img
            className="h-[80px]"
            src={profileInfo.avatar ? profileInfo.avatar : defaultAvatarIcon}
          />
          <pre className="whitespace-pre-wrap font-sans text-lg">
            {profileInfo.bio
              ? he.decode(profileInfo.bio)
              : `User since ${new Date(profileInfo.created).toLocaleDateString()}`}
          </pre>
        </div>
        {ownProfile ? (
          <Button onClick={toggleEditing}>Edit profile</Button>
        ) : null}
        <ErrorMessage error={error} />
      </div>
    </div>
  );

  if (editing) {
    return (
      <EditUserInfo profileInfo={profileInfo} toggleEditing={toggleEditing} />
    );
  }

  return displayProfile;
}
