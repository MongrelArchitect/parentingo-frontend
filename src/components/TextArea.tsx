interface Props {
  attempted?: boolean;
  maxLength?: number;
  message?: string;
  id: string;
  labelText: string;
  onChange: (event: React.SyntheticEvent) => void;
  required?: boolean;
  rows?: number;
  valid?: boolean;
  value: string;
}

export default function TextArea({
  attempted,
  maxLength,
  id,
  labelText,
  message,
  onChange,
  required,
  rows,
  valid,
  value,
}: Props) {
  return (
    <div className="relative flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <textarea
        className={`rounded border-2 ${attempted && !valid ? "border-red-600 focus:outline-red-600" : "border-sky-800 focus:outline-sky-800"} p-1 focus:outline focus:outline-2 ${attempted ? "invalid:border-red-600 invalid:focus:outline-red-600" : ""}`}
        id={id}
        maxLength={maxLength}
        onChange={onChange}
        required={required}
        rows={rows}
        value={value}
      />
      {attempted && !valid && message ? (
        <span className="text-right text-sm text-red-600">{message}</span>
      ) : null}
      {attempted ? (
        <span
          className={`absolute right-2 top-[45%] text-2xl ${valid ? "text-sky-800" : "text-red-600"}`}
        >
          {valid ? "✓" : "⚠"}
        </span>
      ) : null}
    </div>
  );
}
