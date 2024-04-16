import { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import PostSummary from "./PostSummary";

import GroupInterface from "@interfaces/Groups";
import { PostList } from "@interfaces/Posts";

import posts from "@util/posts";

interface Props {
  group: GroupInterface;
  userIsAdmin: boolean;
  userIsMod: boolean;
}

export default function GroupPosts({ group, userIsAdmin, userIsMod }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [groupPosts, setGroupPosts] = useState<null | PostList>(null);

  const getPosts = async () => {
    const result = await posts.getGroupPosts(group.id, { sort: "newest" });
    if (result.status === 200) {
      setGroupPosts(result.posts);
    } else {
      setError(result.message);
      // XXX
      // display info more elegantly?
      console.error(result);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const displayPosts = () => {
    if (!groupPosts) {
      return (
        <div className="rounded border-2 border-emerald-600 bg-white p-2 text-xl shadow-md shadow-slate-400">
          This group has no posts
        </div>
      );
    }

    const postIds = Object.keys(groupPosts);

    return (
      <ul className="flex flex-col gap-4">
        {postIds.map((postId) => {
          const currentPost = groupPosts[postId];
          const postByAdmin = groupPosts[postId].author === group.admin;
          return (
            <PostSummary
              getPosts={getPosts}
              groupId={group.id}
              key={postId}
              post={currentPost}
              postByAdmin={postByAdmin}
              userIsAdmin={userIsAdmin}
              userIsMod={userIsMod}
              viewingInGroup
            />
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      {displayPosts()}
      <ErrorMessage error={error} />
    </div>
  );
}
