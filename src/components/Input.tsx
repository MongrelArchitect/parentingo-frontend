interface Props {
  attempted?: boolean;
  maxLength?: number;
  minLength?: number;
  id: string;
  labelText: string;
  message?: string;
  onChange: (event: React.SyntheticEvent) => void;
  pattern?: string;
  required?: boolean;
  title?: string;
  type:
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "file"
    | "number"
    | "password"
    | "radio"
    | "tel"
    | "text";
  valid?: boolean;
  value: string;
}

export default function Input({
  attempted,
  maxLength,
  minLength,
  id,
  labelText,
  message,
  onChange,
  pattern,
  required,
  title,
  type,
  valid,
  value,
}: Props) {
  return (
    <div className="relative flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <input
        className={`rounded border-2 border-sky-800 p-1 focus:outline focus:outline-2 focus:outline-sky-800 ${attempted ? "invalid:border-red-600 invalid:focus:outline-red-600" : ""}`}
        id={id}
        maxLength={maxLength}
        minLength={minLength}
        onChange={onChange}
        pattern={pattern}
        required={required}
        title={title}
        type={type}
        value={value}
      />
      {attempted && !valid && message ? <span className="text-sm text-red-600 text-right">{message}</span> : null}
      {attempted ? (
        <span
          className={`absolute right-2 top-8 text-2xl ${valid ? "text-sky-800" : "text-red-600"}`}
        >
          {valid ? "✓" : "⚠"}
        </span>
      ) : null}
    </div>
  );
}
