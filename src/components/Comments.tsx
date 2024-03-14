import { useEffect, useState } from "react";

import CommentDetail from "./CommentDetail";

import styles from "@configs/styles";
import posts from "@util/posts";

import { CommentList } from "@interfaces/Comments";

interface Props {
  groupId: string;
  postId: string;
  updateComments: boolean;
}

export default function Comments({ groupId, postId, updateComments }: Props) {
  const [comments, setComments] = useState<null | CommentList>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const getComments = async () => {
      const result = await posts.getPostComments(groupId, postId);
      if (result.status === 200 && result.comments) {
        setComments(result.comments);
      } else {
        // XXX
        // need to parse error messages & provide feedback to user
        console.error(result);
        setError(result.message);
      }
    };

    getComments();
  }, [groupId, postId, updateComments]);

  const displayComments = () => {
    if (!comments) {
      return (
        <div>
          No comments found
        </div>
      );
    }
    
    const commentIds = Object.keys(comments).sort((a, b) => {
      const dateA = new Date(comments[a].timestamp);
      const dateB = new Date(comments[b].timestamp);
      return dateB.getTime() - dateA.getTime();
    });

    return (
      <ul>
        {commentIds.map((commentId) => {
          return <CommentDetail key={commentId} comment={comments[commentId]}/>;
        })}
      </ul>
    );
  };

  return (
    <div>
      {displayComments()}
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}
