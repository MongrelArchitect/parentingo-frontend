import he from "he";

import Username from "./Username";

import CommentInterface from "@interfaces/Comments";

interface Props {
  comment: CommentInterface;
}

export default function CommentDetail({ comment }: Props) {
  return (
    <li className="rounded bg-white shadow-md shadow-slate-400">
      <div className="rounded-t bg-fuchsia-700 p-1 text-xl text-neutral-100">
        <Username userId={comment.author} />
      </div>
      <div className="flex flex-col gap-4 p-1">
        <pre className="whitespace-pre-wrap font-sans text-lg">
          {he.decode(comment.text)}
        </pre>
        <p className="font-mono text-sm">
          {new Date(comment.timestamp).toLocaleString()}
        </p>
      </div>
    </li>
  );
}
