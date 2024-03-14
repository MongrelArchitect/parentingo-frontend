import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@contexts/Users";

import styles from "@configs/styles";

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
    <form className={styles.form}>
      <h1>Login</h1>
      <label htmlFor="username">username:</label>
      <input
        className={styles.input}
        id="username"
        onChange={handleChange}
        required
        type="text"
        value={formInfo.username.value || ""}
      />
      <label htmlFor="password">password:</label>
      <input
        className={styles.input}
        id="password"
        onChange={handleChange}
        required
        type="password"
        value={formInfo.password.value || ""}
      />
      <button
        className={styles.buttonConfirm}
        onClick={submit}
        type="button"
      >
        Submit
      </button>
      {error ? <div className={styles.error}>{error}</div> : null}
      <div>
        <span>Need an account? </span>
        <Link className="text-teal-800 underline" to="signup">Sign up</Link>!
      </div>
    </form>
  );
}
