import { useEffect, useState } from "react";

import CommentDetail from "./CommentDetail";
import ErrorMessage from "./ErrorMessage";

import { CommentList } from "@interfaces/Comments";
import GroupInterface from "@interfaces/Groups";

import posts from "@util/posts";

interface Props {
  group: GroupInterface;
  postId: string;
  updateComments: boolean;
}

export default function Comments({ group, postId, updateComments }: Props) {
  const [comments, setComments] = useState<null | CommentList>(null);
  const [error, setError] = useState<null | string>(null);

  const getComments = async () => {
    const result = await posts.getPostComments(group.id, postId);
    if (result.status === 200) {
      setComments(result.comments);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.error(result);
      setError(result.message);
    }
  };

  useEffect(() => {
    getComments();
  }, [group, postId, updateComments]);

  const displayComments = () => {
    if (!comments) {
      return (
        <div className="rounded border-2 border-fuchsia-700 bg-white p-2 text-xl shadow-md shadow-slate-400">
          This post has no comments.
        </div>
      );
    }

    const commentIds = Object.keys(comments).sort((a, b) => {
      const dateA = new Date(comments[a].timestamp);
      const dateB = new Date(comments[b].timestamp);
      return dateB.getTime() - dateA.getTime();
    });

    return (
      <ul className="flex flex-col gap-4">
        {commentIds.map((commentId) => {
          return (
            <CommentDetail
              key={commentId}
              comment={comments[commentId]}
              group={group}
              postId={postId}
              updateComments={getComments}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      {displayComments()}
      <ErrorMessage error={error} />
    </div>
  );
}
