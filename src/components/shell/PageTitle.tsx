import type { ReactNode } from "react";

export default function PageTitle({
  judul,
  deskripsi,
  aksi,
}: {
  judul: string;
  deskripsi?: string;
  aksi?: ReactNode;
}) {
  return (
    <header className="page-title">
      <div>
        <h1>{judul}</h1>
        {deskripsi && <p>{deskripsi}</p>}
      </div>
      {aksi && <div className="actions">{aksi}</div>}
    </header>
  );
}
