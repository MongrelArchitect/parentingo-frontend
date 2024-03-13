import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostInterface from "@interfaces/Posts";
import users from "@util/users";
import styles from "@configs/styles";

interface Props {
  post: PostInterface;
}

export default function PostSummary({ post }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [username, setUsername] = useState<null | string>(null);

  useEffect(() => {
    const getInfo = async () => {
      setError(null);
      const result = await users.getUserInfo(post.author);
      if (result.status === 200 && result.user) {
        setError(null);
        setUsername(result.user.username);
      } else {
        setUsername(null);
        setError(result.message);
        console.error(result);
      }
    };
    getInfo();
  }, [post]);

  return (
    <li>
      <div>
        <p>{post.text}</p>
        <p>{new Date(post.timestamp).toLocaleString()}</p>
        <p>{username || ""}</p>
        <p>{post.likes.length} likes</p>
        <Link
          className="text-teal-800 underline"
          to={`/groups/${post.group}/posts/${post.id}`}
        >
          View post
        </Link>
        {error ? <div className={styles.error}>{error}</div> : null}
      </div>
      <hr />
    </li>
  );
}
