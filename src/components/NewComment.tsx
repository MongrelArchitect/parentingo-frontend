import { useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import Form from "./Form";
import TextArea from "./TextArea";

import posts from "@util/posts";

interface Props {
  getPost: () => void;
  groupId: string;
  postId: string;
  toggleUpdateComments: () => void;
}

export default function NewComment({
  getPost,
  groupId,
  postId,
  toggleUpdateComments,
}: Props) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [text, setText] = useState({
    value: "",
    valid: false,
  });

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLTextAreaElement;
    setText({
      value: target.value,
      valid: target.validity.valid,
    });
  };

  const submit = async () => {
    setAttempted(true);
    if (!text.valid) {
      setError("Comment text required");
    } else {
    const result = await posts.createNewComment(groupId, postId, text.value);
    if (result.status === 200) {
      // success, reload the post info
      getPost();
      toggleUpdateComments();
      setText({
        value: "",
        valid: false,
      });
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.error(result);
      setError(result.message);
    }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded bg-white shadow-md shadow-slate-400">
        <h1 className="rounded-t bg-fuchsia-700 p-1 text-2xl text-neutral-100">
          New Comment
        </h1>
        <div className="flex flex-col gap-4 p-1">
          <Form>
            <TextArea
              attempted={attempted}
              id="text"
              labelText="comment:"
              maxLength={255}
              message="Comment required, 255 characters max"
              onChange={handleChange}
              required
              rows={5}
              valid={text.valid}
              value={text.value || ""}
            />
            <Button onClick={submit}>Submit</Button>
          </Form>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
