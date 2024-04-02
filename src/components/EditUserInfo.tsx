import he from "he";
import { useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import FilePicker from "./FilePicker";
import Form from "./Form";
import Input from "./Input";
import TextArea from "./TextArea";

import defaultAvatarIcon from "@assets/icons/account-circle.svg";

import { PublicUserInfo } from "@interfaces/Users";

interface Props {
  profileInfo: PublicUserInfo;
  toggleEditing: () => void;
}

interface FormInfo {
  avatar: {
    changed: boolean;
    file: null | File;
    valid: boolean;
    value: string | undefined;
  };
  bio: {
    changed: boolean;
    valid: boolean;
    value: string | undefined;
  };
  name: {
    changed: boolean;
    valid: boolean;
    value: string;
  };
}

export default function EditUserInfo({ profileInfo, toggleEditing }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const defaultFormInfo: FormInfo = {
    avatar: {
      changed: false,
      file: null,
      value: profileInfo.avatar,
      valid: true,
    },
    bio: { changed: false, value: profileInfo.bio, valid: true },
    name: { changed: false, value: profileInfo.name, valid: true },
  };

  const [formInfo, setFormInfo] = useState(defaultFormInfo);

  const checkImageValidity = (file: File) => {
    return file.type.split("/")[0] === "image";
  };

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLInputElement;
    switch (target.id) {
      case "name":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            name: {
              changed: true,
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "bio":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            bio: {
              changed: true,
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "avatar":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            avatar: {
              changed: true,
              file: target.files ? target.files[0] : null,
              value: target.files
                ? URL.createObjectURL(target.files[0])
                : undefined,
              valid: target.files ? checkImageValidity(target.files[0]) : true,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const cancel = () => {
    setAttempted(false);
    setError(null);
    setFormInfo(defaultFormInfo);
    toggleEditing();
  };

  const submit = () => {
    setAttempted(true);
    console.log(formInfo);
  };

  return (
    <div className="rounded border-2 border-orange-600 bg-white text-lg shadow-md shadow-slate-400">
      <div className="flex flex-wrap justify-between gap-2 bg-orange-600 p-1 text-xl text-neutral-100">
        <span>{he.decode(profileInfo.username)}</span>
        <span>EDIT PROFILE</span>
      </div>
      <div className="flex flex-col gap-4 p-1">
        <Form>
          <img
            className="h-[80px] self-start"
            src={
              formInfo.avatar.value ? formInfo.avatar.value : defaultAvatarIcon
            }
          />
          <FilePicker
            accept="image/*"
            id="avatar"
            labelText={`${profileInfo.avatar ? "Update" : "Add"} profile image`}
            onChange={handleChange}
          />
          <Input
            attempted={attempted}
            id="name"
            labelText="name:"
            maxLength={255}
            message="Name required, 255 characters max"
            onChange={handleChange}
            required
            type="text"
            valid={formInfo.name.valid}
            value={formInfo.name.value || ""}
          />
        </Form>
        <TextArea
          attempted={attempted}
          labelText="bio:"
          id="bio"
          message="20,000 characters max"
          onChange={handleChange}
          maxLength={20000}
          placeholder={`User since ${new Date(profileInfo.created).toLocaleDateString()}`}
          rows={5}
          valid={formInfo.bio.valid}
          value={formInfo.bio.value || ""}
        />
        <Button onClick={cancel}>Cancel edit</Button>
        <Button onClick={submit}>Submit</Button>
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}
