import he from "he";
import { useContext } from "react";

import CommentControl from "./CommentControl";
import Username from "./Username";

import { UserContext } from "@contexts/Users";

import CommentInterface from "@interfaces/Comments";
import GroupInterface from "@interfaces/Groups";

interface Props {
  comment: CommentInterface;
  group: GroupInterface;
  postId: string;
  updateComments: () => void;
}

export default function CommentDetail({ comment, group, postId, updateComments }: Props) {
  const { user } = useContext(UserContext);
  
  if (!user) {
    return null;
  }

  // this detemrines if the PostControl component is rendered
  const isAdmin = user.id === group.admin;

  // these will determine if the "ban user" checkbox shows up in PostControl
  const eligibleForBan =
    !group.banned.includes(comment.author) && group.members.includes(comment.author);
  const commentByAdmin = comment.author === group.admin;

  return (
    <li className="rounded bg-white shadow-md shadow-slate-400">
      <div className="rounded-t bg-fuchsia-700 p-1 text-xl text-neutral-100">
        <Username userId={comment.author} />
      </div>
      <div className="flex flex-col gap-4 p-1">
        {isAdmin ? (
          <CommentControl
            author={comment.author}
            commentByAdmin={commentByAdmin}
            commentId={comment.id}
            eligibleForBan={eligibleForBan}
            groupId={group.id}
            postId={postId}
            updateComments={updateComments}
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
