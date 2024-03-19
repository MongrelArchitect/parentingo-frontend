interface Props {
  maxLength?: number;
  minLength?: number;
  id: string;
  labelText: string;
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
  value: string;
}

export default function Input({
  maxLength,
  minLength,
  id,
  labelText,
  onChange,
  pattern,
  required,
  title,
  type,
  value,
}: Props) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <input
        className="rounded border-2 border-sky-800 p-1"
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
    </div>
  );
}
