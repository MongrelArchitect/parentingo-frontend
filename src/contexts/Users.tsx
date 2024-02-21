import { createContext, useEffect, useState } from "react";
import UserInterface from "@interfaces/Users";

interface ContextProps {
  children: React.ReactNode;
}

interface ContextValue {
  attemptLogin: (username: string, password: string) => void;
  clearUser: () => void;
  user: UserInterface | null;
}

export const UserContext = createContext<ContextValue | null>(null);

export default function UserContextProvider({ children }: ContextProps) {
  const [user, setUser] = useState<UserInterface | null>(null);

  const clearUser = () => {
    setUser(null);
  };

  const attemptLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3131/users/current", {
        body: JSON.stringify({username, password}),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        mode: "cors",
      });
      const result = await response.json();
      if (response.status === 200) {
        console.log(result);
      }
      console.log(response.status);
      console.log(result);
    } catch (err) {
      // XXX
      // display this error in ui?
      console.error(err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:3131/users/current", {
        mode: "cors",
      });
      const result = await response.json();
      if (response.status === 200) {
        console.log(result);
      }
      console.log(response.status);
      console.log(result);
    } catch (err) {
      // XXX
      // display this error in ui?
      console.error(err);
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
