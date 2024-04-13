import he from "he";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AdminPanel from "@components/AdminPanel";
import Button from "@components/Button";
import EditGroupDescription from "@components/EditGroupDescription";
import ErrorMessage from "@components/ErrorMessage";
import GroupPosts from "@components/GroupPosts";
import MembershipControl from "@components/MembershipControl";
import NewPost from "@components/NewPost";
import UserInfo from "@components/UserInfo";

import { UserContext } from "@contexts/Users";

import useTitle from "@hooks/useTitle";

import GroupInterface from "@interfaces/Groups";

import groups from "@util/groups";
import posts from "@util/posts";

export default function GroupDetail() {
  const { user } = useContext(UserContext);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [group, setGroup] = useState<null | GroupInterface>(null);
  const [postCount, setPostCount] = useState(0);
  const { groupId } = useParams();

  const getGroupInfo = async () => {
    if (!groupId) {
      setError("Missing group id");
    } else {
      const result = await groups.getGroupInfo(groupId);
      // first get group info
      if (result.status === 200 && result.group) {
        setGroup(result.group);
        const countResult = await posts.getPostCount(groupId);
        // then get post count
        if (result.status === 200) {
          setError(null);
          setPostCount(countResult.count);
        } else {
          setPostCount(0);
          setError(countResult.message);
          console.error(countResult);
        }
      } else {
        setError(result.message);
        // XXX
        // display info more elegantly?
        console.error(result);
      }
    }
  };

  useEffect(() => {
    getGroupInfo();
  }, []);

  useTitle(group ? he.decode(group.name) : "");

  if (!user || !group) {
    return null;
  }

  const userIsAdmin = user.id === group.admin;
  const userIsMod = group.mods.includes(user.id);

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const displayEditButton = () => {
    return (
      <Button onClick={toggleEditing}>
        {editing ? "Cancel edit" : "Edit description"}
      </Button>
    );
  };

  const displayGroupInfo = () => {
    return (
      <div className="rounded border-2 border-sky-600 bg-white shadow-md shadow-slate-400">
        <h1 className="flex flex-wrap items-center justify-between gap-2 bg-sky-600 p-1 text-2xl text-neutral-100">
          <span className="capitalize">{group.name}</span>
          <MembershipControl updateGroup={getGroupInfo} group={group} />
        </h1>
        <div className="flex flex-col gap-4 p-1 text-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
            <p>
              {group.members.length} member
              {group.members.length === 1 ? "" : "s"},
            </p>
            <p>
              {postCount} post
              {postCount === 1 ? "" : "s"}
            </p>
            <div className="relative flex flex-1 flex-wrap items-center gap-1">
              <Link
                className="flex-1 text-sky-900"
                title="View admin's profile"
                to={`/users/${group.admin}`}
              >
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <UserInfo
                    avatar
                    avatarMaxWidth={48}
                    username
                    userId={group.admin}
                  />
                </div>
              </Link>
              <span className="absolute right-[56px] top-0 text-xs">admin</span>
            </div>
          </div>
          {userIsAdmin ? displayEditButton() : null}
          {editing ? (
            <EditGroupDescription 
              description={group.description}
              getGroupInfo={getGroupInfo}
              groupId={group.id}
              toggleEditing={toggleEditing}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-lg">
              {he.decode(group.description)}
            </pre>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {displayGroupInfo()}
      {userIsAdmin || userIsMod ? (
        <AdminPanel
          group={group}
          userIsAdmin={userIsAdmin}
          updateGroupInfo={getGroupInfo}
        />
      ) : null}
      {group && group.members.includes(user.id) ? (
        <NewPost groupId={group.id} />
      ) : null}
      {group ? <GroupPosts groupId={group.id} /> : null}
      <ErrorMessage error={error} />
    </div>
  );
}
