import { createContext, useEffect, useState } from "react";
import UserInterface from "@interfaces/Users";
import api from "@configs/api";

interface ContextProps {
  children: React.ReactNode;
}

interface SignUpForm {
  username: string;
  password: string;
  email: string;
  name: string;
}

interface SignUpResponse {
  status: number;
  message: string;
  error?: string;
  errors?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface ContextValue {
  attemptLogin: (username: string, password: string) => Promise<number>;
  attemptLogout: () => Promise<number>;
  attemptSignup: (formInfo: SignUpForm) => Promise<SignUpResponse>;
  clearUser: () => void;
  user: UserInterface | null;
}

export const UserContext = createContext<ContextValue>({
  attemptLogin: async () => {
    return 500;
  },
  attemptLogout: async () => {
    return 500;
  },
  attemptSignup: async () => {
    return {
      status: 500,
      message: "Default message",
    };
  },
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
      const response = await fetch(`${api.url}/users/current`, {
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
      const response = await fetch(`${api.url}/users/login`, {
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

  const attemptLogout = async () => {
    try {
      const response = await fetch(`${api.url}/users/logout`, {
        credentials: "include",
        method: "POST",
        mode: "cors",
      });
      if (response.status === 200) {
        clearUser();
      }
      return response.status;
    } catch (err) {
      // XXX
      // display this error in ui?
      console.error(err);
      return 500;
    }
  };

  const attemptSignup = async (formInfo: SignUpForm): Promise<SignUpResponse> => {
    // fetch will serialize this to x-www-form-urlencoded (what server expects)
    const formBody = new URLSearchParams();
    const formKeys = Object.keys(formInfo) as Array<keyof SignUpForm>;
    formKeys.forEach((field) => {
      formBody.append(field, formInfo[field])
    });

    try {
      const response = await fetch(`${api.url}/users/`, {
        body: formBody,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        mode: "cors",
      });
      if (response.status === 201) {
        // our user was successfully created & authenticated, so get their info
        await getCurrentUser();
      }
      const responseBody = await response.json();
      const signUpResponse: SignUpResponse = {
        status: response.status,
        message: responseBody.message,
      };
      // this happens with a 400 response, either from invalid/missing form
      // data or from a alread existing email or username
      if (responseBody.errors) {
        signUpResponse.errors = responseBody.errors;
      }
      // this happens with a 500 response, either from a problem creating the
      // user or for some other unforseen server issue
      if (responseBody.error) {
        signUpResponse.error = responseBody.error;
      }
      return signUpResponse;
    } catch (err) {
      // XXX
      // display this error in ui?
      console.error(err);
      // this will happen if there's some problem with fetch itself, just
      // report as a server error & handle similarly
      return {
        status: 500,
        message: "Server error",
      };
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ attemptLogin, attemptLogout, attemptSignup, clearUser, user }}
    >
      {children}
    </UserContext.Provider>
  );
}
