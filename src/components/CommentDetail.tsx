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
  }, []);

  return (
    <li className="rounded bg-white shadow-md shadow-slate-400">
      <div className="rounded-t bg-fuchsia-600 p-1 text-xl text-neutral-100">
        <p>{username ? he.decode(username) : ""}</p>
      </div>
      <div className="flex flex-col gap-4 p-1">
        <pre className="whitespace-pre-wrap font-sans text-lg">
          {he.decode(comment.text)}
        </pre>
        <p className="font-mono text-sm">
          {new Date(comment.timestamp).toLocaleString()}
        </p>
        <ErrorMessage error={error} />
      </div>
    </li>
  );
}
