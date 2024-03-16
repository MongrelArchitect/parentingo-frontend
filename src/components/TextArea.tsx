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
    <>
      <label htmlFor={id}>{labelText}</label>
      <textarea
        className="border-2 border-slate-600"
        id={id}
        maxLength={maxLength}
        onChange={onChange}
        required={required}
        rows={rows}
        value={value}
      />
    </>
  );
}
