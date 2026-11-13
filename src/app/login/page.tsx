import { Suspense } from 'react';
import LoginView from '@/modules/akun/ui/loginView';

export const metadata = { title: 'Masuk | Fajar Tech' };

// useSearchParams di LoginView butuh batas Suspense saat build.
export default function HalamanLogin() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
