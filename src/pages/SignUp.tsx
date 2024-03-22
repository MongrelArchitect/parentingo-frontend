import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import Input from "@components/Input";
import Form from "@components/Form";

import { UserContext } from "@contexts/Users";

import useTitle from "@hooks/useTitle";

import Response from "@interfaces/Response";

export default function SignUp() {
  useTitle("Sign Up");

  const auth = useContext(UserContext);
  const { attemptSignup } = auth;

  const navigate = useNavigate();

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultMessages = {
    email: "Valid email required, 255 characters max",
    username: "Username required, 3-20 characters",
  };
  const [messages, setMessages] = useState(defaultMessages);

  const defaultFormInfo = {
    username: {
      value: "",
      valid: false,
    },
    password: {
      value: "",
      valid: false,
    },
    confirm: {
      value: "",
      valid: false,
    },
    email: {
      value: "",
      valid: false,
    },
    name: {
      value: "",
      valid: false,
    },
  };

  const [formInfo, setFormInfo] = useState(defaultFormInfo);

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLInputElement;
    switch (target.id) {
      case "username":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            username: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        setMessages((prevState) => {
          return {
            ...prevState,
            username: "Username required, 3-20 characters",
          };
        });
        break;
      case "password":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            password: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "confirm":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            confirm: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "email":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            email: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        setMessages((prevState) => {
          return {
            ...prevState,
            email: "Valid email required, 255 characters max",
          };
        });
        break;
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
      default:
        break;
    }
  };

  // our "confirm" field is only valid if it matches the password
  const handleConfirmValidity = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    if (target.id === "confirm") {
      // we're in the "confirm" input, simple custom validity
      if (target.value === formInfo.password.value) {
        target.setCustomValidity("");
      } else {
        target.setCustomValidity("Passwords do not match");
      }
      target.reportValidity();
    } else {
      // we're in the "password" field, need to update "confirm" field validity
      const confirmInput = document.querySelector(
        "#confirm",
      ) as HTMLInputElement;
      if (target.value === confirmInput.value) {
        confirmInput.setCustomValidity("");
        setFormInfo((prevState) => {
          return {
            ...prevState,
            confirm: {
              value: confirmInput.value,
              valid: true,
            },
          };
        });
      } else {
        confirmInput.setCustomValidity("Passwords do not match");
        setFormInfo((prevState) => {
          return {
            ...prevState,
            confirm: {
              value: confirmInput.value,
              valid: false,
            },
          };
        });
      }
    }
  };

  // prevent the custom validity error message from popping up
  document.addEventListener(
    "invalid",
    (() => {
      return (event) => {
        event.preventDefault();
      };
    })(),
    true,
  );

  const checkAllValid = () => {
    return (
      formInfo.username.valid &&
      formInfo.password.valid &&
      formInfo.confirm.valid &&
      formInfo.email.valid &&
      formInfo.name.valid
    );
  };

  const checkAlreadyTaken = (response: Response) => {
    const { errors } = response;
    if (!errors) {
      return null;
    }
    return {
      email: errors.email ? errors.email.msg === "Email already in use" : false,
      username: errors.username
        ? errors.username.msg === "Username already taken"
        : false,
    };
  };

  const handleAlreadyTaken = (alreadyTaken: {
    email: boolean;
    username: boolean;
  }) => {
    if (alreadyTaken.email && !alreadyTaken.username) {
      setError("Email already in use");
      setFormInfo((prevState) => {
        return {
          ...prevState,
          email: {
            value: formInfo.email.value,
            valid: false,
          },
        };
      });
      setMessages((prevState) => {
        return {
          ...prevState,
          email: "Email already in use",
        };
      });
    } else if (!alreadyTaken.email && alreadyTaken.username) {
      setError("Username already taken");
      setFormInfo((prevState) => {
        return {
          ...prevState,
          username: {
            value: formInfo.username.value,
            valid: false,
          },
        };
      });
      setMessages((prevState) => {
        return {
          ...prevState,
          username: "Username already taken",
        };
      });
    } else {
      setError("Email & username already in use");
      setFormInfo((prevState) => {
        return {
          ...prevState,
          email: {
            value: formInfo.email.value,
            valid: false,
          },
          username: {
            value: formInfo.username.value,
            valid: false,
          },
        };
      });
      setMessages({
        email: "Email already in use",
        username: "Username already taken",
      });
    }
  };

  const submit = async () => {
    setAttempted(true);
    if (!checkAllValid()) {
      setError("Invalid input(s) - check each field");
    } else {
      const result = await attemptSignup({
        username: formInfo.username.value,
        password: formInfo.password.value,
        email: formInfo.email.value,
        name: formInfo.name.value,
      });
      if (result.status === 201) {
        // success, redirect to landing page
        navigate("/");
      } else if (result.status === 400) {
        const alreadyTaken = checkAlreadyTaken(result);
        if (alreadyTaken) {
          handleAlreadyTaken(alreadyTaken);
        } else {
          console.error(result);
          setError(result.message);
        }
      } else {
        // XXX
        // need to parse error messages & provide feedback to user
        console.error(result);
        setError(result.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="rounded bg-white shadow-md shadow-slate-400">
        <h1 className="rounded-t bg-sky-600 p-1 text-2xl text-neutral-100">
          Sign up
        </h1>
        <div className="flex flex-col gap-4 p-1">
          <Form>
            <Input
              attempted={attempted}
              id="username"
              labelText="username:"
              message={messages.username}
              maxLength={20}
              minLength={3}
              onChange={handleChange}
              required
              type="text"
              valid={formInfo.username.valid}
              value={formInfo.username.value || ""}
            />

            <Input
              attempted={attempted}
              id="password"
              labelText="password:"
              message="Password doesn't meet requirements"
              onChange={(event) => {
                handleChange(event);
                handleConfirmValidity(event);
              }}
              pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9]).{8,}$"
              required
              title="8 characters minimum, 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol"
              type="password"
              valid={formInfo.password.valid}
              value={formInfo.password.value || ""}
            />

            <Input
              attempted={attempted}
              id="confirm"
              labelText="confirm password:"
              message="Passwords do not match"
              onChange={(event) => {
                handleChange(event);
                handleConfirmValidity(event);
              }}
              required
              type="password"
              valid={formInfo.confirm.valid}
              value={formInfo.confirm.value || ""}
            />

            <Input
              attempted={attempted}
              id="email"
              labelText="email:"
              maxLength={255}
              message={messages.email}
              onChange={handleChange}
              required
              type="email"
              valid={formInfo.email.valid}
              value={formInfo.email.value || ""}
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

            <Button onClick={submit}>Submit</Button>
          </Form>
          <div className="text-lg">
            <span>Already have an account? </span>
            <Link className="text-sky-800 underline" to="/">
              Log in
            </Link>
            !
          </div>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
