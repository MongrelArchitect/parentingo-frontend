import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import Form from "@components/Form";
import Input from "@components/Input";

import { UserContext } from "@contexts/Users";

export default function Login() {
  const auth = useContext(UserContext);
  const attemptLogin = auth.attemptLogin;

  const [error, setError] = useState<string | null>(null);

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
    const status = await attemptLogin(
      formInfo.username.value,
      formInfo.password.value,
    );
    if (status === 400 || status === 401) {
      setError("Incorrect username or password");
    }
    if (status === 500) {
      setError("Server error");
    }
    if (status === 200) {
      navigate("/");
    }
  };

  return (
    <Form>
      <h1>Login</h1>
      <Input 
        id="username"
        labelText="username:"
        onChange={handleChange}
        required
        type="text"
        value={formInfo.username.value || ""}
      />
      <Input 
        id="password"
        labelText="password:"
        onChange={handleChange}
        required
        type="password"
        value={formInfo.password.value || ""}
      />
      <Button onClick={submit}>Submit</Button>
      <ErrorMessage error={error} />
      <div>
        <span>Need an account? </span>
        <Link className="text-teal-800 underline" to="signup">Sign up</Link>!
      </div>
    </Form>
  );
}
