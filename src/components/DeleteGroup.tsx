import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import LoadingScreen from "./LoadingScreen";

import groups from "@util/groups";

interface Props {
  groupId: string;
}

export default function DeleteGroup({ groupId }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const toggleConfirming = () => {
    setConfirming(!confirming);
  };

  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    const response = await groups.deleteGroup(groupId);
    if (response.status === 200) {
      setError(null);
      console.log(response);
      navigate("/groups/deleted");
    } else {
      console.error(response.error);
      setError(response.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {loading ? <LoadingScreen /> : null}
      {confirming ? (
        <div className="flex flex-col gap-2">
          <p className="text-red-700">
            Are you sure? The group and all its posts, comments and images will
            be deleted.
          </p>
          <p className="text-red-700">
            <strong>This cannot be undone!</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={toggleConfirming}>Cancel</Button>
            <Button onClick={submit}>Confirm delete</Button>
          </div>
        </div>
      ) : null}
      {confirming ? (
        <div></div>
      ) : (
        <Button onClick={toggleConfirming}>Delete group</Button>
      )}
      {error ? <ErrorMessage error={error} /> : null}
    </div>
  );
}
