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

  useEffect(() => {
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
    getInfo();
  }, [post]);

  return (
    <li>
      <article>
        <h2>{post.title}</h2>
        <p>{new Date(post.timestamp).toLocaleString()}</p>
        <p>{username || ""}</p>
        <p>
          {post.likes.length} like{post.likes.length === 1 ? "" : "s"}
        </p>
        <p>
          {commentCount} comment{commentCount === 1 ? "" : "s"}
        </p>
        <Link
          className="text-teal-800 underline"
          to={`/groups/${post.group}/posts/${post.id}`}
        >
          View post
        </Link>
        <ErrorMessage error={error} />
      </article>
      <hr />
    </li>
  );
}
