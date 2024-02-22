import { useContext, useState } from "react";
import { UserContext } from "@contexts/Users";

const inputStyle = "border-2 border-slate-600";

export default function Login() {
  const auth = useContext(UserContext);
  const attemptLogin = auth.attemptLogin;

  const [error, setError] = useState<string | null>(null);

  const [formInfo, setFormInfo] = useState({
    username: {
      value: "",
      valid: false,
    },
    password: {
      value: "",
      valid: false,
    },
  });

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
  };

  return (
    <form className="flex flex-col gap-2 text-lg">
      <h1>Login</h1>
      <label htmlFor="username">username:</label>
      <input
        className={inputStyle}
        id="username"
        onChange={handleChange}
        required
        type="text"
        value={formInfo.username.value || ""}
      />
      <label htmlFor="password">password:</label>
      <input
        className={inputStyle}
        id="password"
        onChange={handleChange}
        required
        type="password"
        value={formInfo.password.value || ""}
      />
      <button
        className="border-2 bg-slate-600 text-white"
        onClick={submit}
        type="button"
      >
        Submit
      </button>
      {error ? <div className="text-red-700">{error}</div> : null}
    </form>
  );
}
