import { useId, type ReactNode } from "react";

export default function Field({
  label,
  galat,
  children,
}: {
  label: string;
  galat?: string;
  children: (p: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = useId();
  const galatId = galat ? `${id}-galat` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({ id, "aria-invalid": !!galat, "aria-describedby": galatId })}
      {galat && (
        <p id={galatId} className="field-error">
          {galat}
        </p>
      )}
    </div>
  );
}
