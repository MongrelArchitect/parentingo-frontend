import { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import PostSummary from "./PostSummary";

import { PostList } from "@interfaces/Posts";

import posts from "@util/posts";

interface Props {
  groupId: string;
}

export default function GroupPosts({ groupId }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [groupPosts, setGroupPosts] = useState<null | PostList>(null);

  const getPosts = async () => {
    const result = await posts.getGroupPosts(groupId, {sort:"newest"});
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
          return <PostSummary key={postId} post={currentPost} />;
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
