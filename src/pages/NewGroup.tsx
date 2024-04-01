import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import Form from "@components/Form";
import Input from "@components/Input";
import TextArea from "@components/TextArea";

import useTitle from "@hooks/useTitle";

import { GroupResponse } from "@interfaces/Response";

import groups from "@util/groups";

export default function NewGroup() {
  useTitle("New Group");

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultNameMessage = "Name required, 255 characters max";
  const [nameMessage, setNameMessage] = useState(defaultNameMessage);

  const defaultFormInfo = {
    name: {
      value: "",
      valid: false,
    },
    description: {
      value: "",
      valid: false,
    },
  };

  const [formInfo, setFormInfo] = useState(defaultFormInfo);

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const { id } = event.target as HTMLElement;
    const target =
      id === "description"
        ? (event.target as HTMLTextAreaElement)
        : (event.target as HTMLInputElement);
    switch (target.id) {
      case "name":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            name: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        setNameMessage(defaultNameMessage);
        break;
      case "description":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            description: {
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

  const checkAlreadyTaken = (response: GroupResponse) => {
    const { errors } = response;
    if (
      !errors ||
      !errors.name ||
      errors.name.msg !== "Group with that name already exists"
    ) {
      return false;
    }
    return true;
  };

  const handleAlreadyTaken = () => {
    setError("Group with that name already exists");
    setFormInfo((prevState) => {
      return {
        ...prevState,
        name: {
          value: formInfo.name.value,
          valid: false,
        },
      };
    });
    setNameMessage("Group name already in use");
  };

  const submit = async () => {
    setAttempted(true);
    if (!formInfo.name.valid || !formInfo.description.valid) {
      setError("Invalid input(s) - check each field");
    } else {
      const result = await groups.attemptNewGroup({
        name: formInfo.name.value,
        description: formInfo.description.value,
      });
      if (result.status === 201 && result.group) {
        // success, redirect to group
        console.log(result);
        navigate(`/groups/${result.group.id}`);
      } else if (result.status === 400) {
        // XXX
        const alreadyTaken = checkAlreadyTaken(result);
        if (alreadyTaken) {
          handleAlreadyTaken();
        } else {
          console.error(result);
          setError(result.message);
        }
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
      <div className="rounded border-2 border-sky-600 bg-white shadow-md shadow-slate-400">
        <h1 className="bg-sky-600 p-1 text-2xl text-neutral-100">New Group</h1>
        <div className="flex flex-col gap-4 p-1">
          <Form>
            <Input
              attempted={attempted}
              id="name"
              labelText="name:"
              maxLength={255}
              message={nameMessage}
              onChange={handleChange}
              required
              type="text"
              valid={formInfo.name.valid}
              value={formInfo.name.value || ""}
            />
            <TextArea
              attempted={attempted}
              id="description"
              labelText="description:"
              maxLength={255}
              message="Description required, 255 characters max"
              onChange={handleChange}
              required
              rows={5}
              valid={formInfo.description.valid}
              value={formInfo.description.value || ""}
            />
            <Button onClick={submit}>Submit</Button>
          </Form>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
