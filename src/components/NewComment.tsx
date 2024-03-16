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

export default function NewComment({ getPost, groupId, postId, toggleUpdateComments }: Props) {
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
  };

  return (
    <Form>
      <TextArea 
        id="text"
        labelText="comment:"
        maxLength={255}
        onChange={handleChange}
        required
        rows={5}
        value={text.value || ""}
      />
      <Button onClick={submit}>Submit</Button>
      <ErrorMessage error={error} />
    </Form>
  );
}
