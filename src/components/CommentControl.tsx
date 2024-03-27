import { useState } from "react";

import Button from "./Button";
import Checkbox from "./Checkbox";
import ErrorMessage from "./ErrorMessage";
import Form from "./Form";

import posts from "@util/posts";
import groups from "@util/groups";

interface Props {
  author: string;
  commentByAdmin: boolean;
  commentId: string;
  eligibleForBan: boolean;
  groupId: string;
  postId: string;
  updateComments: () => void;
}

export default function CommentControl({
  author,
  commentByAdmin,
  commentId,
  eligibleForBan,
  groupId,
  postId,
  updateComments,
}: Props) {
  const [banUser, setBanUser] = useState(false);
  const [deleteComment, setDeleteComment] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const toggleBan = () => {
    setBanUser(!banUser);
  };

  const toggleDelete = () => {
    setDeleteComment(!deleteComment);
  };

  const submit = async () => {
    if (banUser) {
      const result = await groups.banUser(groupId, author);
      if (result.status !== 200) {
        console.error(result);
        setError(result.message);
      } else {
        console.log(result);
        setBanUser(false);
      }
    }

    if (deleteComment) {
      const result = await posts.deleteComment(groupId, postId, commentId);
      if (result.status !== 200) {
        console.error(result);
        setError(result.message);
      } else {
        console.log(result);
        updateComments();
        setDeleteComment(false);
      }
    }
  };

  return (
    <div className="rounded border-2 border-orange-600 bg-white">
      <h2 className="bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        Comment Control
      </h2>
      <div className="flex flex-col gap-2 p-1">
        <Form>
          <Checkbox
            checkedState={deleteComment}
            id={`deletecomment${commentId}`}
            onChange={toggleDelete}
            labelText="delete comment"
          />
          {!commentByAdmin && eligibleForBan ? (
            <Checkbox
              checkedState={banUser}
              id={`banuser${commentId}`}
              onChange={toggleBan}
              labelText="ban user"
            />
          ) : null}
          <Button onClick={submit}>Submit</Button>
        </Form>
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}
