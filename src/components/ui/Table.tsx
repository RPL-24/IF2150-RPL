import type { TableHTMLAttributes } from "react";

export default function Table({ className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrap">
      <table className={`table ${className}`.trim()} {...props} />
    </div>
  );
}
