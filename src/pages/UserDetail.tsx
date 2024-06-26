import he from "he";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import followingIcon from "@assets/icons/account-multiple.svg";
import notFollowingIcon from "@assets/icons/account-multiple-outline.svg";

import Avatar from "@components/Avatar";
import Button from "@components/Button";
import EditUserInfo from "@components/EditUserInfo";
import ErrorMessage from "@components/ErrorMessage";
import Followers from "@components/Followers";
import Following from "@components/Following";

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
  const [viewing, setViewing] = useState<"profile" | "followers" | "following">(
    "profile",
  );

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
    setViewing("profile");
  }, [editing, userId, user]);

  useTitle(profileInfo ? profileInfo.username : "");

  if (!userId || !profileInfo || !authUser) {
    return null;
  }

  const ownProfile = authUser.id === userId;

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const toggleFollow = async () => {
    const following = profileInfo.followers.includes(authUser.id);
    const response = following
      ? await users.unfollowUser(userId)
      : await users.followUser(userId);
    if (response.status === 200) {
      getProfileInfo();
      setError(null);
    } else {
      setError(response.message);
    }
  };

  const showFollowers = () => {
    setViewing("followers");
  };

  const showFollowing = () => {
    setViewing("following");
  };

  const showProfile = () => {
    setViewing("profile");
  };

  const chooseView = () => {
    if (viewing === "followers") {
      return (
        <>
          <button
            className="font-mono text-sky-900 underline"
            onClick={showProfile}
            type="button"
          >
            Back to profile
          </button>
          <Followers
            followers={profileInfo.followers}
            username={profileInfo.username}
          />
        </>
      );
    }
    if (viewing === "following") {
      return (
        <>
          <button
            className="font-mono text-sky-900 underline"
            onClick={showProfile}
            type="button"
          >
            Back to profile
          </button>
          <Following
            following={profileInfo.following}
            username={profileInfo.username}
          />
        </>
      );
    }
    return (
      <>
        <div className="flex flex-wrap justify-between gap-2 font-mono text-sky-900 underline">
          <button onClick={showFollowers} type="button">
            {profileInfo.followers.length} follower
            {profileInfo.followers.length === 1 ? "" : "s"}
          </button>
          <button onClick={showFollowing} type="button">
            {profileInfo.following.length} following
          </button>
        </div>
        <div className="flex flex-col flex-wrap items-center gap-4">
          <Avatar avatarURL={profileInfo.avatar} maxWidth={320} />

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
      </>
    );
  };

  const displayProfile = (
    <div className="bg-text-lg rounded border-2 border-slate-600 bg-white shadow-md shadow-slate-400">
      <div className="flex flex-wrap justify-between gap-2 bg-slate-600 p-1 text-xl text-neutral-100">
        <div className="flex flex-wrap gap-2">
          <span>{he.decode(profileInfo.username)}</span>
          {ownProfile ? null : (
            <button
              onClick={toggleFollow}
              title={`${profileInfo.followers.includes(user.id) ? "Unfollow" : "Follow"} ${profileInfo.username}`}
              type="button"
            >
              <img
                alt=""
                className="h-[32px] invert"
                src={
                  profileInfo.followers.includes(user.id)
                    ? followingIcon
                    : notFollowingIcon
                }
              />
            </button>
          )}
        </div>
        <span className="italic">{he.decode(profileInfo.name)}</span>
      </div>
      <div className="flex flex-col gap-4 p-1">{chooseView()}</div>
    </div>
  );

  if (editing) {
    return (
      <EditUserInfo profileInfo={profileInfo} toggleEditing={toggleEditing} />
    );
  }

  return displayProfile;
}
