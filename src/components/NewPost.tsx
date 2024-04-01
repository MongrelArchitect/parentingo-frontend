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
  const [attempted, setAttempted] = useState(false);
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
    setAttempted(true);
    if (!formInfo.title.valid || !formInfo.text.valid) {
      setError("Invalid input(s) - check each field");
    } else {
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
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border-2 border-emerald-600 bg-white shadow-md shadow-slate-400">
        <h1 className="bg-emerald-600 p-1 text-2xl text-neutral-100">
          New Post
        </h1>
        <div className="flex flex-col gap-4 p-1">
          <Form>
            <Input
              attempted={attempted}
              id="title"
              labelText="title:"
              maxLength={255}
              message="Title required, 255 characters max"
              onChange={handleChange}
              required
              type="text"
              valid={formInfo.title.valid}
              value={formInfo.title.value || ""}
            />
            <TextArea
              attempted={attempted}
              id="text"
              labelText="text:"
              maxLength={50000}
              message="Text required, 50,000 characters max"
              onChange={handleChange}
              required
              rows={5}
              valid={formInfo.text.valid}
              value={formInfo.text.value || ""}
            />
            <Button onClick={submit}>Submit</Button>
          </Form>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
