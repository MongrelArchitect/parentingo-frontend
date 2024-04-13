import he from "he";
import { useState } from "react";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import LoadingScreen from "./LoadingScreen";
import Form from "./Form";
import TextArea from "./TextArea";

import groups from "@util/groups";

interface Props {
  description: string;
  getGroupInfo: () => void;
  groupId: string;
  toggleEditing: () => void;
}

export default function EditGroupDescription({
  description,
  getGroupInfo,
  groupId,
  toggleEditing,
}: Props) {
  const defaultFormInfo = {
    value: he.decode(description),
    valid: true,
  };

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [newDescription, setNewDescription] = useState(defaultFormInfo);

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLTextAreaElement;
    setNewDescription({
      value: target.value,
      valid: target.validity.valid,
    });
  };

  const submit = async () => {
    setAttempted(true);
    if (!newDescription.valid) {
      setError("Invalid description");
    } else {
      setLoading(true);
      const response = await groups.editDescription(
        groupId,
        newDescription.value,
      );
      if (response.status === 200) {
        toggleEditing();
        getGroupInfo();
      } else {
        console.error(response.error);
        setError(response.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {loading ? <LoadingScreen /> : null}
      <Form>
        <TextArea
          attempted={attempted}
          id="description"
          labelText="description:"
          maxLength={255}
          message="Description required, 255 characters max"
          onChange={handleChange}
          required
          rows={5}
          valid={newDescription.valid}
          value={newDescription.value || ""}
        />
        <Button onClick={submit}>Submit</Button>
        <ErrorMessage error={error} />
      </Form>
    </div>
  );
}
