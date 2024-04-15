import he from "he";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";
import StickyControl from "./StickyControl";
import UserInfo from "./UserInfo";

import pinIcon from "@assets/icons/pin.svg";

import PostInterface from "@interfaces/Posts";

import posts from "@util/posts";

interface Props {
  getPosts: () => void;
  groupId: string;
  post: PostInterface;
  postByAdmin: boolean;
  userIsAdmin: boolean;
  userIsMod: boolean;
}

export default function PostSummary({
  getPosts,
  groupId,
  post,
  postByAdmin,
  userIsAdmin,
  userIsMod,
}: Props) {
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

  const displayStickyControl = () => {
    if (userIsAdmin) {
      // admin can stick or unstick any post
      return (
        <StickyControl
          getPosts={getPosts}
          groupId={groupId}
          postId={post.id}
          sticky={post.sticky || false}
        />
      );
    }
    if (userIsMod) {
      // mods can stick or unstick any non-admin post, but if the post is by
      // admin they can only stick it (not unstick it)
      if (!postByAdmin || (postByAdmin && !post.sticky)) {
        return (
          <StickyControl
            getPosts={getPosts}
            groupId={groupId}
            postId={post.id}
            sticky={post.sticky || false}
          />
        );
      }
    }
    if (post.sticky) {
      return (
        <img className="max-h-[32px] invert" alt="Sticky post" src={pinIcon} />
      );
    }
    return null;
  };

  return (
    <li className="rounded border-2 border-emerald-600 bg-white shadow-md shadow-slate-400">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-600 p-1 text-xl">
        <Link title="View post" to={`/groups/${post.group}/posts/${post.id}`}>
          <h2 className="capitalize text-neutral-100">
            {he.decode(post.title)}
          </h2>
        </Link>
        {displayStickyControl()}
      </div>
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

        <div className="flex flex-col items-start gap-4">
          {post.image ? (
            <img
              alt=""
              loading="lazy"
              className="h-auto max-h-[320px] min-h-[200px] min-w-[200px] border-2 border-slate-900"
              src={post.image}
            />
          ) : null}
          <pre className="whitespace-pre-wrap font-sans text-lg">
            {getContentPreview()}
          </pre>
        <Link to={`/groups/${post.group}/posts/${post.id}`}>
          <span className="text-sky-800 underline">
            View full post
          </span>
        </Link>
        </div>

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
