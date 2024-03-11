import he from "he";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NewPost from "@components/NewPost";
import GroupInterface from "@interfaces/Groups";
import groups from "@util/groups";
import styles from "@configs/styles";

export default function GroupDetail() {
  const [error, setError] = useState<null | string>(null);
  const [group, setGroup] = useState<null | GroupInterface>(null);
  const { groupId } = useParams();

  useEffect(() => {
    const getGroupinfo = async () => {
      if (!groupId) {
        setError("Missing group id");
      } else {
        const result = await groups.getGroupInfo(groupId);
        if (result.status === 200 && result.group) {
          setGroup(result.group);
        } else {
          setError(result.message);
          // XXX
          // display info more elegantly?
          console.error(result);
        }
      }
    };
    getGroupinfo();
  }, [groupId]);

  const displayGroupInfo = () => {
    if (!group) {
      return null;
    }
    return (
      <div>
        <h1>{group.name}</h1>
        <p>members: {group.members.length}</p>
        <p>{he.decode(group.description)}</p>
      </div>
    );
  };

  return (
    <div>
      {displayGroupInfo()}
      {group ? <NewPost groupId={group.id} /> : null}
      {error ? <div className={styles.error}>error</div> : null}
    </div>
  );
}
