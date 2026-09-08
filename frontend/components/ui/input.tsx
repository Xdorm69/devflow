import { InputHTMLAttributes, forwardRef } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        <input id={inputId} ref={ref} className="form-input" {...props} />
        {error && <p className="mt-1.5 text-xs text-critical">{error}</p>}
      </div>
    );
  }
);
InputField.displayName = "InputField";