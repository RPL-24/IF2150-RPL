import type { ButtonHTMLAttributes } from "react";

type Varian = "primary" | "secondary" | "danger" | "link";

export default function Button({
  varian = "secondary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { varian?: Varian }) {
  const kelas = varian === "secondary" ? "btn" : `btn ${varian}`;
  return <button type={type} className={`${kelas} ${className}`.trim()} {...props} />;
}
