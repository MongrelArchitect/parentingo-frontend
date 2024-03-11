import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@configs/styles";
import posts from "@util/posts";

interface Props {
  groupId: string;
}

export default function NewPost({ groupId }: Props) {
  const [error, setError] = useState<null | string>(null);

  const [text, setText] = useState({value: "", valid: false});

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLTextAreaElement;
    setText({
      value: target.value,
      valid: target.validity.valid,
    });
  };

  const navigate = useNavigate();

  const submit = async () => {
    const result = await posts.createNewPost(groupId, text.value);
    if (result.status === 201 && result.post) {
      // success, redirect to post detail
      console.log(result);
      navigate(result.post.uri);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  return (
    <form className={styles.form}>
      <h2>New Post</h2>
      <label htmlFor="text">text:</label>
        <textarea
          className={styles.input}
          id="text"
          maxLength={255}
          onChange={handleChange}
          required
          rows={5}
          value={text.value || ""}
        />
        <button className={styles.buttonConfirm} onClick={submit} type="button">
          Submit
        </button>
      {error ? <div className={styles.error}>error</div> : null}
    </form>
  );
}
