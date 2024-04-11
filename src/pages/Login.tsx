import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import Form from "@components/Form";
import Input from "@components/Input";
import LoadingScreen from "@components/LoadingScreen";

import { UserContext } from "@contexts/Users";

import useTitle from "@hooks/useTitle";

export default function Login() {
  useTitle("Login");

  const auth = useContext(UserContext);
  const { attemptLogin } = auth;

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultFormInfo = {
    username: {
      value: "",
      valid: false,
    },
    password: {
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
      default:
        break;
    }
  };

  const navigate = useNavigate();

  const submit = async () => {
    setAttempted(true);
    if (!formInfo.username.valid || !formInfo.password.valid) {
      setError("Username and password required");
    } else {
      setLoading(true);
      const result = await attemptLogin(
        formInfo.username.value,
        formInfo.password.value,
      );
      if (result.status === 400 || result.status === 401) {
        setError("Incorrect username or password");
      }
      if (result.status === 500) {
        console.error(result.error);
        setError(result.message);
      }
      if (result.status === 200) {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="rounded border-2 border-sky-600 bg-white shadow-md shadow-slate-400">
        <h1 className="bg-sky-600 p-1 text-2xl text-neutral-100">Login</h1>
        <div className="relative flex flex-col gap-4 p-1">
          {loading ? <LoadingScreen /> : null}
          <Form>
            <Input
              attempted={attempted}
              id="username"
              labelText="username:"
              message="Username required"
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
              message="Password required"
              onChange={handleChange}
              required
              type="password"
              valid={formInfo.password.valid}
              value={formInfo.password.value || ""}
            />
            <Button onClick={submit}>Submit</Button>
          </Form>
          <div className="text-lg">
            <span>Need an account? </span>
            <Link className="text-sky-800 underline" to="signup">
              Sign up
            </Link>
            !
          </div>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
