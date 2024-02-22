import { createContext, useEffect, useState } from "react";
import UserInterface from "@interfaces/Users";

interface ContextProps {
  children: React.ReactNode;
}

interface ContextValue {
  attemptLogin: (username: string, password: string) => Promise<number>;
  clearUser: () => void;
  user: UserInterface | null;
}

export const UserContext = createContext<ContextValue>({
  attemptLogin: async () => {return 500},
  user: null,
  clearUser: () => {},
});

export default function UserContextProvider({ children }: ContextProps) {
  const [user, setUser] = useState<UserInterface | null>(null);

  const clearUser = () => {
    setUser(null);
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:3131/users/current", {
        credentials: "include",
        mode: "cors",
      });
      const result = await response.json();
      switch (response.status) {
        case 200:
          console.log("User authenticated successfully");
          setUser({
            avatar: result.avatar || null,
            email: result.email,
            id: result.id,
            followers: result.followers,
            following: result.following,
            lastLogin: new Date(result.lastLogin),
            name: result.name,
            username: result.username,
          });
          break;
        case 401:
          console.log("User authentication required - please login");
          break;
        default:
          console.log("UNEXPECTED RESPONSE");
          console.log(`status: ${response.status}`);
          console.log(result);
          break;
      }
    } catch (err) {
      // XXX
      // display this error in ui?
      console.error(err);
    }
  };

  const attemptLogin = async (username: string, password: string) => {
    // fetch will serialize this to x-www-form-urlencoded (what server expects)
    const formBody = new URLSearchParams();
    formBody.append("username", username);
    formBody.append("password", password);

    try {
      const response = await fetch("http://localhost:3131/users/login", {
        body: formBody,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        mode: "cors",
      });
      if (response.status === 200) {
        await getCurrentUser();
      }
      return response.status;
    } catch (err) {
      // XXX
      // display this error in ui?
      console.error(err);
      return 500;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ attemptLogin, clearUser, user }}>
      {children}
    </UserContext.Provider>
  );
}
