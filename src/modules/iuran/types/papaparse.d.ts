// Sementara: @types/papaparse belum ada di package.json (berkas beku milik Andro).
// Hapus berkas ini setelah "npm i -D @types/papaparse" masuk lewat Issue freeze-change.
declare module "papaparse" {
  interface UnparseConfig {
    newline?: string;
    escapeFormulae?: boolean | RegExp;
  }
  interface UnparseObject {
    fields: string[];
    data: unknown[][];
  }
  const Papa: {
    unparse(data: UnparseObject | unknown[][], config?: UnparseConfig): string;
    parse<T>(input: string, config?: { skipEmptyLines?: boolean }): { data: T[] };
  };
  export default Papa;
}
