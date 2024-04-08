import he from "he";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";
import UserInfo from "./UserInfo";

import PostInterface from "@interfaces/Posts";

import posts from "@util/posts";

interface Props {
  post: PostInterface;
}

export default function PostSummary({ post }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [commentCount, setCommentCount] = useState(0);

  const getInfo = async () => {
    setError(null);
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
  };

  useEffect(() => {
    getInfo();
  }, []);

  const getContentPreview = () => {
    const { text } = post;
    if (he.decode(text).length < 40) {
      return he.decode(text);
    }
    return `${he.decode(text).slice(0, 40)}...`;
  };

  return (
    <li className="rounded border-2 border-emerald-600 bg-white shadow-md shadow-slate-400">
      <Link
        className="flex flex-wrap items-center justify-between gap-2 bg-emerald-600 p-1 text-xl"
        to={`/groups/${post.group}/posts/${post.id}`}
      >
        <h2 className="capitalize text-neutral-100">{he.decode(post.title)}</h2>
      </Link>
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-wrap items-center justify-between gap-1 font-mono">
          <Link
            className="flex flex-1 flex-wrap items-center gap-2 text-sky-900"
            title="View post author's profile"
            to={`/users/${post.author}`}
          >
            <UserInfo
              avatar
              avatarMaxWidth={40}
              flipped
              userId={post.author}
              username
            />
          </Link>
          <div>{new Date(post.timestamp).toLocaleString()}</div>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-lg">
          {getContentPreview()}
        </pre>
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
