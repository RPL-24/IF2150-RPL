// Rute awal "/": GerbangPeran di _layout.js akan mengarahkan ke login atau beranda sesuai peran.
import { TampilanMemuat } from '../components/ui';

export default function Awal() {
  return <TampilanMemuat />;
}
