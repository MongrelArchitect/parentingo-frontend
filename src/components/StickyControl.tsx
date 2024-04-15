import { useState } from "react";

import ErrorMessage from "./ErrorMessage";

import pinIcon from "@assets/icons/pin.svg";
import hollowPinIcon from "@assets/icons/pin-outline.svg";

import posts from "@util/posts";

interface Props {
  getPosts: () => void;
  groupId: string;
  postId: string;
  sticky: boolean;
}

export default function StickyControl({
  getPosts,
  groupId,
  postId,
  sticky,
}: Props) {
  const [error, setError] = useState<null | string>(null);

  const submit = async () => {
    const response = await posts.toggleStickyPost(groupId, postId, sticky);
    if (response.status === 200) {
      setError(null);
      getPosts();
    } else {
      console.error(response);
      setError(response.message);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ErrorMessage error={error} />
      <button>
        <img
          className="h-[32px] invert"
          alt=""
          onClick={submit}
          src={sticky ? pinIcon : hollowPinIcon}
          title={sticky ? "Unstick post" : "Make post sticky"}
        />
      </button>
    </div>
  );
}
