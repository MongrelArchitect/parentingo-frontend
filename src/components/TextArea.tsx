interface Props {
  maxLength?: number;
  id: string;
  labelText: string;
  onChange: (event: React.SyntheticEvent) => void;
  required?: boolean;
  rows?: number;
  value: string;
}

export default function TextArea({
  maxLength,
  id,
  labelText,
  onChange,
  required,
  rows,
  value,
}: Props) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <textarea
        className="rounded border-2 border-sky-800 p-1"
        id={id}
        maxLength={maxLength}
        onChange={onChange}
        required={required}
        rows={rows}
        value={value}
      />
    </div>
  );
}
