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
    const result = await posts.getGroupPosts(groupId);
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
      return <p>No posts in this group</p>;
    }
    // sort by timestamp
    const postIds = Object.keys(groupPosts).sort((a, b) => {
      const dateA = new Date(groupPosts[a].timestamp);
      const dateB = new Date(groupPosts[b].timestamp);
      return dateB.getTime() - dateA.getTime();
    });
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
