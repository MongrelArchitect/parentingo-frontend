import he from "he";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorMessage from "@components/ErrorMessage";
import GroupPosts from "@components/GroupPosts";
import MembershipControl from "@components/MembershipControl";
import NewPost from "@components/NewPost";
import Username from "@components/Username";

import { UserContext } from "@contexts/Users";

import GroupInterface from "@interfaces/Groups";

import groups from "@util/groups";
import posts from "@util/posts";

export default function GroupDetail() {
  const { user } = useContext(UserContext);

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

  if (!user) {
    return null;
  }

  const displayGroupInfo = () => {
    if (!group) {
      return null;
    }

    return (
      <>
        <h1 className="flex flex-wrap items-center justify-between gap-2 rounded-t bg-sky-600 p-1 text-2xl capitalize text-neutral-100">
          {group.name}
          <MembershipControl updateGroup={getGroupInfo} group={group} />
        </h1>
        <div className="flex flex-col gap-4 p-1">
          <div className="flex flex-wrap justify-between gap-2 font-mono">
            <p>
              {group.members.length} member
              {group.members.length === 1 ? "" : "s"}
            </p>
            <p>
              {postCount} post
              {postCount === 1 ? "" : "s"}
            </p>
            <div className="flex gap-1 flex-wrap">
              <span>admin:</span>
              <Username userId={group.admin} />
            </div>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-lg">
            {he.decode(group.description)}
          </pre>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded bg-white shadow-md shadow-slate-400">
        {displayGroupInfo()}
      </div>
      {group ? <NewPost groupId={group.id} /> : null}
      {group ? <GroupPosts groupId={group.id} /> : null}
      <ErrorMessage error={error} />
    </div>
  );
}
