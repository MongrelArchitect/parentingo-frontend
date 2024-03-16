import he from "he";
import { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";

import CommentInterface from "@interfaces/Comments";

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
      <p>{he.decode(comment.text)}</p>
      <p>{username ? he.decode(username) : ""}</p>
      <p>{new Date(comment.timestamp).toLocaleString()}</p>
      <ErrorMessage error={error} />
      <hr />
    </li>
  );
}
