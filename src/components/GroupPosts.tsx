import { useEffect, useState } from "react";

import PostSummary from "./PostSummary";
import styles from "@configs/styles";
import { PostList } from "@interfaces/Posts";
import posts from "@util/posts";

interface Props {
  groupId: string;
}

export default function GroupPosts({ groupId }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [groupPosts, setGroupPosts] = useState<null | PostList>(null);

  useEffect(() => {
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
    getPosts();
  }, [groupId]);

  const displayPosts = () => {
    if (!groupPosts) {
      return (
        <p>No posts in this group</p>
      );
    }
    // sort by timestamp
    const postIds = Object.keys(groupPosts).sort((a, b) => {
      const dateA = new Date(groupPosts[a].timestamp);
      const dateB = new Date(groupPosts[b].timestamp);
      return dateB.getTime() - dateA.getTime();
    });
    return (
      <ul>
        {postIds.map((postId) => {
          const currentPost = groupPosts[postId];
          return (
            <PostSummary key={postId} post={currentPost} />
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      {displayPosts()}
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}