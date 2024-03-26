import { useState } from "react";

import Button from "./Button";
import Checkbox from "./Checkbox";
import Form from "./Form";

export default function PostControl() {
  const [banUser, setBanUser] = useState(false);
  const [deletePost, setDeletePost] = useState(false);

  const toggleBan = () => {
    setBanUser(!banUser);
  };

  const toggleDelete = () => {
    setDeletePost(!deletePost);
  };

  const submit = () => {
  };

  return (
    <div className="rounded bg-white border-2 border-orange-600">
      <h2 className="bg-orange-600 p-1 text-2xl capitalize text-neutral-100">
       Post Control 
      </h2>
      <div className="p-1">
        <Form>
          <Checkbox 
            checkedState={deletePost}
            id="deletepost"
            onChange={toggleDelete}
            labelText="delete post"
          />
          <Checkbox 
            checkedState={banUser}
            id="banuser"
            onChange={toggleBan}
            labelText="ban user"
          />
          <Button onClick={submit}>Submit</Button>
        </Form>
      </div>
    </div>
  );
}
