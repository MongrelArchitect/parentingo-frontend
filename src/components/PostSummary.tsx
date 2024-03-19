import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";

import PostInterface from "@interfaces/Posts";

import posts from "@util/posts";
import users from "@util/users";

interface Props {
  post: PostInterface;
}

export default function PostSummary({ post }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [username, setUsername] = useState<null | string>(null);

  const getInfo = async () => {
    setError(null);
    // convert post author from userid to username
    const result = await users.getUserInfo(post.author);
    if (result.status === 200 && result.user) {
      setError(null);
      setUsername(result.user.username);
      // now get our comment count
      const countResult = await posts.getCommentCount(post.group, post.id);
      if (countResult.status === 200) {
        setError(null);
        setCommentCount(countResult.count);
      } else {
        setCommentCount(0);
        setError(countResult.message);
        console.error(countResult);
      }
    } else {
      setUsername(null);
      setError(result.message);
      console.error(result);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const getContentPreview = () => {
    const { text } = post;
    if (text.length < 40) {
      return text;
    }
    return `${text.slice(0, 40)}...`;
  };

  return (
    <li className="rounded bg-white shadow-md shadow-slate-400">
      <Link
        className="flex flex-wrap items-center justify-between gap-2 rounded-t bg-sky-600 p-1 text-xl"
        to={`/groups/${post.group}/posts/${post.id}`}
      >
        <h2 className="capitalize text-neutral-100">{post.title}</h2>
      </Link>
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-wrap justify-between gap-1 font-mono">
          <p>{username || ""}</p>
          <p>{new Date(post.timestamp).toLocaleString()}</p>
        </div>
        <p className="text-lg">{getContentPreview()}</p>
        <div className="flex justify-between gap-2 text-xl">
          <p className="flex gap-1">
            <span className="text-red-600" title="likes">
              ♥
            </span>
            {post.likes.length}
          </p>
          <p className="flex gap-1">
            <span className="text-lg" title="comments">
              💬
            </span>
            {commentCount}
          </p>
        </div>
        <ErrorMessage error={error} />
      </div>
    </li>
  );
}
