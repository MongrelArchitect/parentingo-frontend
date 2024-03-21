interface Props {
  error: string | null;
}

export default function ErrorMessage({ error }: Props) {
  if (error) {
    return (
      <div className="rounded bg-white shadow-md shadow-slate-400">
        <h2 className="rounded-t bg-red-600 p-1 text-xl text-neutral-100">
          Error
        </h2>
        <p className="p-1 text-lg text-red-700">{error}</p>
      </div>
    );
  }

  return null;
}
