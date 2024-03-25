import he from "he";
import { useEffect, useState } from "react";

import users from "@util/users";

interface Props {
  userId: string;
}

export default function Username({ userId }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [username, setUsername] = useState<null | string>(null);

  const getUsername = async () => {
    setError(null);
    // convert post author from userid to username
    const result = await users.getUserInfo(userId);
    if (result.status === 200 && result.user) {
      setError(null);
      setUsername(result.user.username);
    } else {
      setUsername(null);
      setError(result.message);
      console.error(result);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  if (!username) {
    return null;
  }

  return (
    <>
      {error || he.decode(username)}
    </>
  );
}
