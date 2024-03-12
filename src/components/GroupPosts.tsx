import { useEffect, useState } from "react";

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
        console.log(result.posts);
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
    // XXX sort by timestamp
    const postIds = Object.keys(groupPosts);
    return (
      <ul>
        {postIds.map((postId) => {
          const currentPost = groupPosts[postId];
          return (
            <li key={postId}>
              <div>
                <p>
                  {currentPost.text}
                </p>
                <p>
                  {new Date(currentPost.timestamp).toLocaleString()}
                </p>
                <p>
                  {currentPost.author}
                </p>
              </div>
              <hr />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      {displayPosts()}
      {error ? <div className={styles.error}>error</div> : null}
    </div>
  );
}
