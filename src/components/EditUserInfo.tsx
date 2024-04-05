import he from "he";
import { useContext, useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import FilePicker from "./FilePicker";
import Form from "./Form";
import Input from "./Input";
import LoadingScreen from "./LoadingScreen";
import TextArea from "./TextArea";

import defaultAvatarIcon from "@assets/icons/account-circle.svg";

import { UserContext } from "@contexts/Users";

import { PublicUserInfo, UpdateFormInfo } from "@interfaces/Users";

import users from "@util/users";

interface Props {
  profileInfo: PublicUserInfo;
  toggleEditing: () => void;
}

export default function EditUserInfo({ profileInfo, toggleEditing }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const defaultFormInfo: UpdateFormInfo = {
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
    return file.type.split("/")[0] === "image" && file.size <= 10000000;
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

  const { getCurrentUser } = useContext(UserContext);

  const submit = async () => {
    setAttempted(true);
    if (!formInfo.name.valid || !formInfo.bio.valid || !formInfo.avatar.valid) {
      setError("Invalid input(s) - check each field");
    } else {
      setLoading(true);
      const result = await users.updateUserInfo(formInfo);
      if (result.status === 200) {
        toggleEditing();
        getCurrentUser();
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

  const avatarStyle = {
    backgroundImage: `url("${formInfo.avatar.value ? formInfo.avatar.value : defaultAvatarIcon}")`,
  };

  return (
    <div className="rounded border-2 border-orange-600 bg-white text-lg shadow-md shadow-slate-400">
      <div className="flex flex-wrap justify-between gap-2 bg-orange-600 p-1 text-xl text-neutral-100">
        <span>{he.decode(profileInfo.username)}</span>
        <span>EDIT PROFILE</span>
      </div>
      <div className="relative flex flex-col gap-4 p-1">
        {loading ? <LoadingScreen /> : null}
        <Form>
          <div className="flex flex-col gap-1">
            {/* 
              not using our "Avatar" component here, in order to show the
              preview image as it appears after cropping
            */}
            <div
              style={avatarStyle}
              className={`aspect-square h-auto w-full max-w-[240px] rounded-full border-2 ${attempted && !formInfo.avatar.valid ? "border-red-600" : "border-slate-900"} bg-cover bg-center`}
            />

            <div className="text-sm">
              {formInfo.avatar.file
                ? displayFileInfo(formInfo.avatar.file)
                : "No file selected"}
            </div>
            {attempted && !formInfo.avatar.valid ? (
              <div className="flex flex-wrap items-center gap-1 text-sm text-red-600">
                <span>Image required (10 MB max)</span>
                <span className="text-2xl">⚠</span>
              </div>
            ) : null}
          </div>
          <FilePicker
            accept="image/*"
            id="avatar"
            labelText="Choose profile image"
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
