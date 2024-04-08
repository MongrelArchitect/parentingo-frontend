import he from "he";
import { useContext } from "react";
import { Link } from "react-router-dom";

import CommentControl from "./CommentControl";
import UserInfo from "./UserInfo";

import { UserContext } from "@contexts/Users";

import CommentInterface from "@interfaces/Comments";
import GroupInterface from "@interfaces/Groups";

interface Props {
  comment: CommentInterface;
  group: GroupInterface;
  postId: string;
  updateComments: () => void;
}

export default function CommentDetail({
  comment,
  group,
  postId,
  updateComments,
}: Props) {
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  // this detemrines if the PostControl component is rendered
  const userIsAdmin = user.id === group.admin;
  const userIsMod = group.mods.includes(user.id);

  // these will determine if the "ban user" checkbox shows up in PostControl
  const eligibleForBan =
    !group.banned.includes(comment.author) &&
    group.members.includes(comment.author);
  const commentByAdmin = comment.author === group.admin;

  // these will determine what comments a mod can or cannot delete
  const commentByMod = group.mods.includes(comment.author);
  const isOwnComment = user.id === comment.author;

  const showCommentControl = () => {
    if (!userIsAdmin && !userIsMod) {
      return false;
    }
    if (userIsMod && (commentByAdmin || (commentByMod && !isOwnComment))) {
      return false;
    }
    return true;
  };

  return (
    <li className="rounded border-2 border-fuchsia-700 bg-white shadow-md shadow-slate-400">
      <div className="bg-fuchsia-700 p-1 text-xl text-neutral-100">
          <Link
            className="flex flex-1 flex-wrap items-center gap-2"
            title="View post author's profile"
            to={`/users/${comment.author}`}
          >
            <UserInfo
              avatar
              avatarMaxWidth={40}
              flipped
              userId={comment.author}
              username
            />
          </Link>
      </div>
      <div className="flex flex-col gap-4 p-1">
        {showCommentControl() ? (
          <CommentControl
            author={comment.author}
            commentByAdmin={commentByAdmin}
            commentId={comment.id}
            commentByMod={commentByMod}
            eligibleForBan={eligibleForBan}
            groupId={group.id}
            isOwnComment={isOwnComment}
            postId={postId}
            updateComments={updateComments}
            userIsAdmin={userIsAdmin}
          />
        ) : null}
        <pre className="whitespace-pre-wrap font-sans text-lg">
          {he.decode(comment.text)}
        </pre>
        <p className="font-mono text-sm">
          {new Date(comment.timestamp).toLocaleString()}
        </p>
      </div>
    </li>
  );
}
