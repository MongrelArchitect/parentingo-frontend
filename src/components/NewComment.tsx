import { useState } from "react";

import posts from "@util/posts";
import styles from "@configs/styles";

interface Props {
  getPost: () => void;
  groupId: string;
  postId: string;
  toggleUpdateComments: () => void;
}

export default function NewComment({ getPost, groupId, postId, toggleUpdateComments }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [text, setText] = useState({
    value: "",
    valid: false,
  });

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLTextAreaElement;
    setText({
      value: target.value,
      valid: target.validity.valid,
    });
  };

  const submit = async () => {
    const result = await posts.createNewComment(groupId, postId, text.value);
    if (result.status === 200) {
      // success, reload the post info
      getPost();
      toggleUpdateComments();
      setText({
        value: "",
        valid: false,
      });
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.error(result);
      setError(result.message);
    }
  };

  return (
    <form className={styles.form}>
      <label htmlFor="text">comment:</label>
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
      {error ? <div className={styles.error}>{error}</div> : null}
    </form>
  );
}
