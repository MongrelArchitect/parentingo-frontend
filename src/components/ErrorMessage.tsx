interface Props {
  error: string | null;
}

export default function ErrorMessage({ error }: Props) {
  if (error) {
    return (
      <div className="text-red-700">
        {error}
      </div>
    );
  }

  return null;
}
