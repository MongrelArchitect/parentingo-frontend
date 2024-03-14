import { useEffect, useState } from "react";
import CommentInterface from "@interfaces/Comments";
import styles from "@configs/styles";
import users from "@util/users";

interface Props {
  comment: CommentInterface;
}
export default function CommentDetail({ comment }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [username, setUsername] = useState<null | string>(null);

  const getAuthorUsername = async (author: string) => {
    const authorResult = await users.getUserInfo(author);
    if (authorResult.status === 200 && authorResult.user) {
      setError(null);
      // then get the author's username from their id
      setUsername(authorResult.user.username);
    } else {
      setUsername(null);
      setError(authorResult.message);
      console.error(authorResult);
    }
  };

  useEffect(() => {
    getAuthorUsername(comment.author);
  }, [comment]);

  return (
    <li>
      <p>{comment.text}</p>
      <p>{username || ""}</p>
      <p>{new Date(comment.timestamp).toLocaleString()}</p>
      {error ? <div className={styles.error}>{error}</div> : null}
      <hr />
    </li>
  );
}
