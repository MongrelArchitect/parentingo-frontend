import { useState } from "react";

import eyeIcon from "@assets/icons/eye.svg";
import eyeOffIcon from "@assets/icons/eye-off-outline.svg";

interface Props {
  attempted: boolean;
  maxLength?: number;
  minLength?: number;
  id: string;
  labelText: string;
  message: string;
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
  valid: boolean;
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
  const [customType, setCustomType] = useState(type);

  const toggleVisible = () => {
    if (customType === "text") {
      setCustomType("password");
    } else {
      setCustomType("text");
    }
  };

  return (
    <div className="relative flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      {type === "password" ? (
        <button
          className="absolute left-2 top-9"
          onClick={toggleVisible}
          title={`${customType === "password" ? "show" : "hide"} password`}
          type="button"
        >
          <img
            alt=""
            className="h-[24px]"
            src={customType === "password" ? eyeOffIcon : eyeIcon}
          />
        </button>
      ) : null}
      <input
        className={`rounded border-2 text-slate-900 ${attempted && !valid ? "border-red-600 focus:outline-red-600" : "border-sky-800 focus:outline-sky-800"} p-1 focus:outline focus:outline-2 ${attempted ? "invalid:border-red-600 invalid:focus:outline-red-600" : ""} ${type === "password" ? "pl-10" : null}`}
        id={id}
        maxLength={maxLength}
        minLength={minLength}
        onChange={onChange}
        pattern={pattern}
        required={required}
        title={title}
        type={customType}
        value={value}
      />
      {attempted && !valid && message ? (
        <span className="text-right text-sm text-red-600">{message}</span>
      ) : null}
      {pattern ? (
        <div className="mt-2 rounded bg-sky-100 p-1 text-sm">
          <span className="font-bold">Password requirements:</span>
          <ul>
            <li>8 characters minimum</li>
            <li>1 uppercase letter</li>
            <li>1 lowercase letter</li>
            <li>1 number</li>
            <li>1 symbol (!, @, #, etc)</li>
          </ul>
        </div>
      ) : null}
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
