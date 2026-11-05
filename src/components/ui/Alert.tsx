import type { ReactNode } from "react";

export default function Alert({ nada = "info", children }: { nada?: "info" | "bahaya"; children: ReactNode }) {
  return (
    <div className={nada === "bahaya" ? "note bad" : "note"} role={nada === "bahaya" ? "alert" : "status"}>
      {children}
    </div>
  );
}
