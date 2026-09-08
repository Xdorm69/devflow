import { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`btn-primary ${className}`} {...props} />;
}