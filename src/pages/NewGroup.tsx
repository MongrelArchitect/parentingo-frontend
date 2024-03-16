import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import Form from "@components/Form";
import Input from "@components/Input";
import TextArea from "@components/TextArea";

import groups from "@util/groups";

export default function NewGroup() {
  const [error, setError] = useState<string | null>(null);

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

  const submit = async () => {
    const result = await groups.attemptNewGroup({
      name: formInfo.name.value,
      description: formInfo.description.value,
    });
    if (result.status === 201 && result.group) {
      // success, redirect to group
      console.log(result);
      navigate(`/groups/${result.group.id}`);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  return (
    <Form>
      <h1>New Group</h1>
      <Input
        id="name"
        labelText="name:"
        maxLength={255}
        onChange={handleChange}
        required
        type="text"
        value={formInfo.name.value || ""}
      />
      <TextArea
        id="description"
        labelText="description:"
        maxLength={255}
        onChange={handleChange}
        required
        rows={5}
        value={formInfo.description.value || ""}
      />
      <Button onClick={submit}>Submit</Button>
      <ErrorMessage error={error} />
    </Form>
  );
}
