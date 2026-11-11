import PersetujuanView from '@/modules/akun/ui/persetujuanView';

export const metadata = { title: 'Persetujuan akun | Fajar Tech' };

// Hanya Pengurus: dibatasi middleware (jalur /dashboard/pengurus) dan API.
export default function HalamanPersetujuan() {
  return <PersetujuanView />;
}