import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import FilePicker from "./FilePicker";
import Form from "./Form";
import Input from "./Input";
import LoadingScreen from "./LoadingScreen";
import TextArea from "./TextArea";

import noFileIcon from "@assets/icons/file-hidden.svg";

import { NewPostForm } from "@interfaces/Posts";

import posts from "@util/posts";

interface Props {
  groupId: string;
}

export default function NewPost({ groupId }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const defaultFormInfo: NewPostForm = {
    image: {
      file: null,
      value: null,
      valid: true,
    },
    title: { value: "", valid: false },
    text: { value: "", valid: false },
  };
  const [formInfo, setFormInfo] = useState(defaultFormInfo);
  const [loading, setLoading] = useState(false);

  const checkImageValidity = (file: File) => {
    return file.type.split("/")[0] === "image" && file.size <= 10000000;
  };

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const { id } = event.target as HTMLElement;

    if (id === "title") {
      const target = event.target as HTMLInputElement;
      setFormInfo((prevState) => {
        return {
          ...prevState,
          title: {
            value: target.value,
            valid: target.validity.valid,
          },
        };
      });
    }

    if (id === "text") {
      const target = event.target as HTMLTextAreaElement;
      setFormInfo((prevState) => {
        return {
          ...prevState,
          text: {
            value: target.value,
            valid: target.validity.valid,
          },
        };
      });
    }

    if (id === "image") {
      const target = event.target as HTMLInputElement;
      setFormInfo((prevState) => {
        return {
          ...prevState,
          image: {
            file: target.files ? target.files[0] : null,
            value: target.files ? URL.createObjectURL(target.files[0]) : null,
            valid: target.files ? checkImageValidity(target.files[0]) : true,
          },
        };
      });
    }
  };

  const navigate = useNavigate();

  const submit = async () => {
    setAttempted(true);
    if (
      !formInfo.title.valid ||
      !formInfo.text.valid ||
      !formInfo.image.valid
    ) {
      setError("Invalid input(s) - check each field");
    } else {
      setLoading(true);
      const result = await posts.createNewPost(groupId, {
        image: formInfo.image.file,
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
    setLoading(false);
  };

  const formatSize = (size: number) => {
    let suffix = "bytes";
    let newSize: number | string = size;
    if (size >= 1000 && size < 1000000) {
      suffix = "KB";
      newSize = Math.round(size / 1000);
    }
    if (size >= 1000000 && size < 1000000000) {
      suffix = "MB";
      newSize = Math.round(size / 1000000);
    }
    if (size >= 1000000000) {
      newSize = "WAY";
      suffix = "TOO BIG!";
    }
    return `${newSize} ${suffix}`;
  };

  const displayFileInfo = (file: File) => {
    return `${file.name} - ${formatSize(file.size)}`;
  };

  const displayImageInfo = () => {
    return (
      <div className="flex flex-col items-start gap-1">
        <img
          className={`max-h-[240px] border-2 ${attempted && !formInfo.image.valid ? "border-red-600" : "border-slate-900"}`}
          src={
            formInfo.image.file
              ? URL.createObjectURL(formInfo.image.file)
              : noFileIcon
          }
        />

        <div className="text-sm">
          {formInfo.image.file
            ? displayFileInfo(formInfo.image.file)
            : "No file selected"}
        </div>
        {attempted && !formInfo.image.valid ? (
          <div className="flex flex-wrap items-center gap-1 text-sm text-red-600">
            <span>Image required (10 MB max)</span>
            <span className="text-2xl">⚠</span>
          </div>
        ) : null}
      </div>
    );
  };

  const clearImage = () => {
    setFormInfo((prevState) => {
      return {
        ...prevState,
        image: {
          file: null,
          value: null,
          valid: true,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border-2 border-emerald-600 bg-white shadow-md shadow-slate-400">
        <h1 className="bg-emerald-600 p-1 text-2xl text-neutral-100">
          New Post
        </h1>
        <div className="flex flex-col gap-4 p-1">
          {loading ? <LoadingScreen /> : null}
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
            <FilePicker
              accept="image/*"
              id="image"
              labelText="Choose image"
              onChange={handleChange}
            />
            {displayImageInfo()}
            {formInfo.image.file ? (
              <Button onClick={clearImage}>Remove image</Button>
            ) : null}
            <Button onClick={submit}>Submit</Button>
          </Form>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
