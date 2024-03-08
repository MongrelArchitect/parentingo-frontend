import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@contexts/Users";
import styles from "@configs/styles";

export default function SignUp() {
  const auth = useContext(UserContext);
  const { attemptSignup } = auth;

  const navigate = useNavigate();

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
    if (target.value === formInfo.password.value) {
      target.setCustomValidity("");
    } else {
      target.setCustomValidity("Passwords do not match");
    }
    target.reportValidity();
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

  const submit = async () => {
    const result = await attemptSignup({
      username: formInfo.username.value,
      password: formInfo.password.value,
      email: formInfo.email.value,
      name: formInfo.name.value,
    });
    if (result.status === 201) {
      // success, redirect to landing page
      navigate("/");
    } else if (result.status === 400 || result.status === 500) {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  return (
    <form className={styles.form}>
      <h1>Sign Up</h1>
      <label htmlFor="username">username:</label>
      <input
        className={styles.input}
        id="username"
        maxLength={20}
        minLength={3}
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
        pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9]).{8,}$"
        required
        title="8 characters minimum, 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol"
        type="password"
        value={formInfo.password.value || ""}
      />
      <label htmlFor="confirm">confirm password:</label>
      <input
        className={styles.input}
        id="confirm"
        onChange={(event) => {
          handleChange(event);
          handleConfirmValidity(event);
        }}
        required
        type="password"
        value={formInfo.confirm.value || ""}
      />
      <label htmlFor="email">email:</label>
      <input
        className={styles.input}
        id="email"
        maxLength={255}
        onChange={handleChange}
        required
        type="email"
        value={formInfo.email.value || ""}
      />
      <label htmlFor="name">name:</label>
      <input
        className={styles.input}
        id="name"
        maxLength={255}
        onChange={handleChange}
        required
        type="text"
        value={formInfo.name.value || ""}
      />
      <button className={styles.buttonConfirm} onClick={submit} type="button">
        Submit
      </button>
      {error ? <div className={styles.error}>{error}</div> : null}
      <div>
        <span>Already have an account? </span>
        <Link className="text-teal-800 underline" to="/">Log in</Link>!
      </div>
    </form>
  );
}
