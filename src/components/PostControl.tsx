import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import Checkbox from "./Checkbox";
import ErrorMessage from "./ErrorMessage";
import Form from "./Form";

import posts from "@util/posts";
import groups from "@util/groups";

interface Props {
  author: string;
  eligibleForBan: boolean;
  groupId: string;
  postByAdmin: boolean;
  postId: string;
  updateGroupInfo: () => void;
}

export default function PostControl({
  author,
  eligibleForBan,
  groupId,
  postByAdmin,
  postId,
  updateGroupInfo,
}: Props) {
  const [banUser, setBanUser] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const toggleBan = () => {
    setBanUser(!banUser);
  };

  const toggleDelete = () => {
    setDeletePost(!deletePost);
  };

  const navigate = useNavigate();

  const submit = async () => {
    if (banUser) {
      const result = await groups.banUser(groupId, author);
      if (result.status !== 200) {
        console.error(result);
        setError(result.message);
        updateGroupInfo();
      } else {
        console.log(result);
        setBanUser(false);
      }
    }

    if (deletePost) {
      const result = await posts.deletePost(groupId, postId);
      if (result.status !== 200) {
        console.error(result);
        setError(result.message);
      } else {
        console.log(result);
        setDeletePost(false);
        navigate(`/groups/${groupId}/posts/deleted`);
      }
    }
  };

  return (
    <div className="rounded border-2 border-orange-600 bg-white">
      <h2 className="bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
        Post Control
      </h2>
      <div className="flex flex-col gap-2 p-1">
        <Form>
          <Checkbox
            checkedState={deletePost}
            id="deletepost"
            onChange={toggleDelete}
            labelText="delete post"
          />
          {!postByAdmin && eligibleForBan ? (
            <Checkbox
              checkedState={banUser}
              id="banuser"
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
