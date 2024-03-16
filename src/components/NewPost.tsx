import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import Form from "./Form";
import Input from "./Input";
import TextArea from "./TextArea";

import posts from "@util/posts";

interface Props {
  groupId: string;
}

export default function NewPost({ groupId }: Props) {
  const [error, setError] = useState<null | string>(null);
  const defaultFormInfo = {
    title: { value: "", valid: false },
    text: { value: "", valid: false },
  };
  const [formInfo, setFormInfo] = useState(defaultFormInfo);

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const { id } = event.target as HTMLElement;
    const target =
      id === "text"
        ? (event.target as HTMLTextAreaElement)
        : (event.target as HTMLInputElement);

    switch (id) {
      case "title":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            title: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "text":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            text: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const navigate = useNavigate();

  const submit = async () => {
    const result = await posts.createNewPost(groupId, {
      title: formInfo.title.value,
      text: formInfo.text.value,
    });
    if (result.status === 201 && result.post) {
      // success, redirect to post detail
      navigate(result.post.uri);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  return (
    <Form>
      <h2>New Post</h2>
      <Input
        id="title"
        labelText="title:"
        maxLength={255}
        onChange={handleChange}
        required
        type="text"
        value={formInfo.title.value || ""}
      />
      <TextArea 
        id="text"
        labelText="text:"
        maxLength={255}
        onChange={handleChange}
        required
        rows={5}
        value={formInfo.text.value || ""}
      />
      <Button onClick={submit}>Submit</Button>
      <ErrorMessage error={error} />
    </Form>
  );
}
