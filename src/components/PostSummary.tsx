import { useEffect, useState } from "react";
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
      }
      if (result.error) {
        setError(result.message);
        console.error(result.error);
      }
    };
    getInfo();
  }, [post]);

  return (
    <li>
      <div>
        <p>{post.text}</p>
        <p>{new Date(post.timestamp).toLocaleString()}</p>
        <p>
          {username || ""}
        </p>
        {error ? <div className={styles.error}>{error}</div> : null}
      </div>
      <hr />
    </li>
  );
}
