import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "@configs/styles";
import posts from "@util/posts";
import users from "@util/users";
import PostInterface from "@interfaces/Posts";

export default function PostDetail() {
  const { groupId, postId } = useParams();
  const [error, setError] = useState<null | string>(null);
  const [post, setPost] = useState<null | PostInterface>(null);
  const [username, setUsername] = useState<null | string>(null);

  useEffect(() => {
    const getPost = async () => {
      setError(null);
      if (!groupId || !postId) {
        setError("Missing group or post id");
      } else {
        const result = await posts.getSinglePost(groupId, postId);
        if (result.status === 200 && result.post) {
          setError(null);
          // first set the post info
          setPost(result.post);
          const authorResult = await users.getUserInfo(result.post.author);
          if (authorResult.status === 200 && authorResult.user) {
            setError(null);
            // then get the author's username from their id
            setUsername(authorResult.user.username);
          } else {
            setUsername(null);
            setError(authorResult.message);
            console.error(authorResult);
          }
        } else {
          setError(result.message);
          // XXX
          // display info more elegantly?
          console.error(result);
        }
      }
    };
    getPost();
  }, [groupId, postId]);

  const displayPost = () => {
    if (!post) {
      return (
        <div>{error ? <div className={styles.error}>{error}</div> : null}</div>
      );
    }
    return (
      <div>
        <p>{post.text}</p>
        <p>{new Date(post.timestamp).toLocaleString()}</p>
        <p>{username || ""}</p>
        <p>{post.comments.length} comments</p>
        <p>{post.likes.length} likes</p>
        {error ? <div className={styles.error}>{error}</div> : null}
      </div>
    );
  };

  return displayPost();
}
