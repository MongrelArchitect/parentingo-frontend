import { useState } from "react";
import { useNavigate } from "react-router-dom";
import groups from "@util/groups";
import styles from "@configs/styles";

export default function NewGroup() {
  const [error, setError] = useState<string | null>(null);

  const defaultFormInfo = {
    name: {
      value: "",
      valid: false,
    },
    description: {
      value: "",
      valid: false,
    },
  };

  const [formInfo, setFormInfo] = useState(defaultFormInfo);

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const { id } = event.target as HTMLElement;
    const target =
      id === "description"
        ? (event.target as HTMLTextAreaElement)
        : (event.target as HTMLInputElement);
    switch (target.id) {
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
      case "description":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            description: {
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
    const result = await groups.attemptNewGroup(
      {
        name: formInfo.name.value,
        description: formInfo.description.value,
      },
    );
    if (result.status === 201 && result.group) {
      // success, redirect to group
      console.log(result);
      navigate(`/groups/${result.group.id}`);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  return (
    <div>
      <form className={styles.form}>
        <h1>New Group</h1>
        <label htmlFor="name">name:</label>
        <input
          className={styles.input}
          id="name"
          max={255}
          onChange={handleChange}
          required
          type="text"
          value={formInfo.name.value || ""}
        />
        <label htmlFor="description">description:</label>
        <textarea
          className={styles.input}
          id="description"
          maxLength={255}
          onChange={handleChange}
          required
          rows={5}
          value={formInfo.description.value || ""}
        />
        <button className={styles.buttonConfirm} onClick={submit} type="button">
          Submit
        </button>
        {error ? <div className={styles.error}>{error}</div> : null}
      </form>
    </div>
  );
}
