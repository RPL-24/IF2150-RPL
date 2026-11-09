/**
 * [Naufal Hasbialhaq] Controller & Custom Hook Katalog dan Pendaftaran Layanan Penyedia Jasa
 * Traceability: UC01 (Skenario Normal & Skenario Alternatif 1), UC02, KF04, KF05,
 * Kelas DPPL C15 KategoriJasaController (ALGO-032 s.d. ALGO-034) & C06 PemberiJasaController,
 * Antarmuka UI-16 (Daftar Penyedia Jasa)
 */

import { useCallback, useState } from 'react';
import {
  ApiError,
  SessionUser,
  setCurrentUserRole,
  useSessionUser,
} from '../services/api';
import {
  JENIS_JASA_OPTIONS,
  JenisJasa,
  RegisterPenyediaJasaPayload,
  RegisterPenyediaJasaResult,
  registerServiceProvider,
} from '../services/serviceCatalogService';

export interface PendaftaranJasaForm {
  namaToko: string;
  jenisJasa: JenisJasa | null;
  deskripsiJasa: string;
  tarif: string;
  jamMulai: string;
  jamSelesai: string;
  daerahKerja: string;
}

export type PendaftaranJasaField = keyof PendaftaranJasaForm;

export type PendaftaranJasaErrors = Partial<
  Record<PendaftaranJasaField, string>
>;

export const FIELD_ORDER: PendaftaranJasaField[] = [
  'namaToko',
  'jenisJasa',
  'deskripsiJasa',
  'tarif',
  'jamMulai',
  'jamSelesai',
  'daerahKerja',
];

export const FORM_LIMITS = {
  namaTokoMin: 3,
  namaTokoMax: 50,
  deskripsiMin: 20,
  deskripsiMax: 500,
  tarifMin: 1000,
  tarifMax: 100_000_000,
  daerahMin: 3,
  daerahMax: 100,
} as const;

const TIME_HHMM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const VALID_JENIS_JASA_SET = new Set<string>(
  JENIS_JASA_OPTIONS.map((item) => item.value)
);

/**
 * ALGO-032: Menyiapkan struktur data kosong untuk formulir pendaftaran layanan penyedia jasa
 */
export function showFormKategoriJasa(): PendaftaranJasaForm {
  return {
    namaToko: '',
    jenisJasa: null,
    deskripsiJasa: '',
    tarif: '',
    jamMulai: '',
    jamSelesai: '',
    daerahKerja: '',
  };
}

/**
 * Membersihkan input tarif agar hanya berisi digit angka, tanpa nol di depan, maksimal 9 digit
 */
export function sanitizeTarifInput(text: string): string {
  const digitsOnly = text.replace(/\D+/g, '');
  const withoutLeadingZeros = digitsOnly.replace(/^0+/, '');
  return withoutLeadingZeros.slice(0, 9);
}

/**
 * Memformat string digit tarif menjadi format ribuan Rupiah (contoh: "75000" -> "75.000")
 */
export function formatRupiah(digits: string): string {
  const cleanDigits = digits.replace(/\D+/g, '');
  if (!cleanDigits) {
    return '';
  }
  return cleanDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Memformat input jam secara otomatis ke bentuk HH:MM saat pengguna mengetik (contoh: "0830" -> "08:30")
 */
export function sanitizeJamInput(text: string): string {
  const digits = text.replace(/\D+/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

/**
 * Memvalidasi satu field pada formulir pendaftaran penyedia jasa (UC01 Skenario Alternatif 1)
 */
export function validateField(
  field: PendaftaranJasaField,
  form: PendaftaranJasaForm
): string | undefined {
  switch (field) {
    case 'namaToko': {
      const val = form.namaToko.trim();
      if (val.length === 0) {
        return 'Nama toko wajib diisi';
      }
      if (val.length < FORM_LIMITS.namaTokoMin) {
        return 'Nama toko minimal 3 karakter';
      }
      if (val.length > FORM_LIMITS.namaTokoMax) {
        return 'Nama toko maksimal 50 karakter';
      }
      return undefined;
    }

    case 'jenisJasa': {
      if (!form.jenisJasa || !VALID_JENIS_JASA_SET.has(form.jenisJasa)) {
        return 'Pilih jenis jasa';
      }
      return undefined;
    }

    case 'deskripsiJasa': {
      const val = form.deskripsiJasa.trim();
      if (val.length === 0) {
        return 'Deskripsi jasa wajib diisi';
      }
      if (val.length < FORM_LIMITS.deskripsiMin) {
        return 'Deskripsi minimal 20 karakter agar pelanggan memahami jasamu';
      }
      if (val.length > FORM_LIMITS.deskripsiMax) {
        return 'Deskripsi maksimal 500 karakter';
      }
      return undefined;
    }

    case 'tarif': {
      const raw = form.tarif.trim();
      if (raw.length === 0) {
        return 'Estimasi tarif wajib diisi';
      }
      if (!/^\d+$/.test(raw)) {
        return 'Tarif hanya boleh berisi angka';
      }
      const numericTarif = Number(raw);
      if (
        !Number.isInteger(numericTarif) ||
        numericTarif < FORM_LIMITS.tarifMin
      ) {
        return 'Tarif minimal Rp1.000';
      }
      if (numericTarif > FORM_LIMITS.tarifMax) {
        return 'Tarif maksimal Rp100.000.000';
      }
      return undefined;
    }

    case 'jamMulai': {
      const val = form.jamMulai.trim();
      if (val.length === 0) {
        return 'Jam mulai wajib diisi';
      }
      if (!TIME_HHMM_REGEX.test(val)) {
        return 'Format jam harus HH:MM (00:00–23:59)';
      }
      return undefined;
    }

    case 'jamSelesai': {
      const selesai = form.jamSelesai.trim();
      if (selesai.length === 0) {
        return 'Jam selesai wajib diisi';
      }
      if (!TIME_HHMM_REGEX.test(selesai)) {
        return 'Format jam harus HH:MM (00:00–23:59)';
      }
      const mulai = form.jamMulai.trim();
      if (TIME_HHMM_REGEX.test(mulai) && selesai <= mulai) {
        return 'Jam selesai harus setelah jam mulai';
      }
      return undefined;
    }

    case 'daerahKerja': {
      const val = form.daerahKerja.trim();
      if (val.length === 0) {
        return 'Wilayah kerja wajib diisi';
      }
      if (val.length < FORM_LIMITS.daerahMin) {
        return 'Wilayah kerja minimal 3 karakter';
      }
      if (val.length > FORM_LIMITS.daerahMax) {
        return 'Wilayah kerja maksimal 100 karakter';
      }
      return undefined;
    }
  }
}

export interface ValidateKategoriJasaResult {
  isValid: boolean;
  errors: PendaftaranJasaErrors;
  firstInvalidField: PendaftaranJasaField | null;
}

/**
 * ALGO-033: Memvalidasi seluruh field formulir pendaftaran jasa dan mengembalikan
 * daftar error per field beserta field pertama yang tidak valid
 */
export function validateKategoriJasa(
  form: PendaftaranJasaForm
): ValidateKategoriJasaResult {
  const errors: PendaftaranJasaErrors = {};
  let firstInvalidField: PendaftaranJasaField | null = null;

  for (const field of FIELD_ORDER) {
    const errorMsg = validateField(field, form);
    if (errorMsg) {
      errors[field] = errorMsg;
      if (firstInvalidField === null) {
        firstInvalidField = field;
      }
    }
  }

  return {
    isValid: firstInvalidField === null,
    errors,
    firstInvalidField,
  };
}

/**
 * Mengecek apakah syarat minimal tombol "Ajukan Pendaftaran" (UI-16-07) terpenuhi:
 * aktif apabila UI-16-04 (Nama Toko) dan UI-16-06 (Jenis Jasa) sudah terisi.
 */
export function isMinimalFilled(form: PendaftaranJasaForm): boolean {
  return (
    form.namaToko.trim().length > 0 &&
    form.jenisJasa !== null &&
    VALID_JENIS_JASA_SET.has(form.jenisJasa)
  );
}

/**
 * Mengonversi state formulir UI-16 menjadi payload request POST /api/services/register
 */
export function toRegisterPayload(
  form: PendaftaranJasaForm,
  idPemberiJasa: string
): RegisterPenyediaJasaPayload {
  return {
    idPemberiJasa: idPemberiJasa.trim(),
    namaToko: form.namaToko.trim(),
    jenisJasa: form.jenisJasa ?? '',
    deskripsiJasa: form.deskripsiJasa.trim(),
    tarif: Number(form.tarif.trim()),
    jamKerja: `${form.jamMulai.trim()} - ${form.jamSelesai.trim()}`,
    daerahKerja: form.daerahKerja.trim(),
  };
}

/**
 * ALGO-034: Memvalidasi formulir dan mengirimkan data pendaftaran ke backend
 */
export async function submitFormKategoriJasa(
  form: PendaftaranJasaForm,
  idPemberiJasa: string
): Promise<RegisterPenyediaJasaResult> {
  const validation = validateKategoriJasa(form);
  if (!validation.isValid) {
    throw new Error('Data formulir tidak valid');
  }
  const payload = toRegisterPayload(form, idPemberiJasa);
  return registerServiceProvider(payload);
}

export interface UseCatalogControllerResult {
  user: SessionUser;
  isPenyediaJasa: boolean;
  form: PendaftaranJasaForm;
  errors: PendaftaranJasaErrors;
  touched: Partial<Record<PendaftaranJasaField, boolean>>;
  submitAttempted: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  successResult: RegisterPenyediaJasaResult | null;
  setFieldValue: <K extends PendaftaranJasaField>(
    field: K,
    value: PendaftaranJasaForm[K]
  ) => void;
  handleBlur: (field: PendaftaranJasaField) => void;
  validateBeforeSubmit: () => ValidateKategoriJasaResult;
  submitRegistration: () => Promise<RegisterPenyediaJasaResult | null>;
  dismissServerError: () => void;
  dismissSuccessModal: () => void;
}

/**
 * Custom Hook Controller (C15 KategoriJasaController) untuk mengelola state,
 * validasi real-time, dan pengiriman formulir UI-16 Daftar Penyedia Jasa
 */
export function useCatalogController(): UseCatalogControllerResult {
  const { user, isPenyediaJasa } = useSessionUser();
  const [form, setForm] = useState<PendaftaranJasaForm>(() =>
    showFormKategoriJasa()
  );
  const [errors, setErrors] = useState<PendaftaranJasaErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<PendaftaranJasaField, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successResult, setSuccessResult] =
    useState<RegisterPenyediaJasaResult | null>(null);

  const setFieldValue = useCallback(
    <K extends PendaftaranJasaField>(
      field: K,
      value: PendaftaranJasaForm[K]
    ) => {
      setForm((prevForm) => {
        const nextForm: PendaftaranJasaForm = {
          ...prevForm,
          [field]: value,
        };

        setErrors((prevErrors) => {
          const shouldRevalidate =
            submitAttempted ||
            Boolean(touched[field]) ||
            Boolean(prevErrors[field]);

          if (
            !shouldRevalidate &&
            !(
              field === 'jamMulai' &&
              (submitAttempted ||
                Boolean(touched.jamSelesai) ||
                Boolean(prevErrors.jamSelesai))
            )
          ) {
            return prevErrors;
          }

          const nextErrors: PendaftaranJasaErrors = { ...prevErrors };

          if (shouldRevalidate) {
            const fieldErr = validateField(field, nextForm);
            if (fieldErr) {
              nextErrors[field] = fieldErr;
            } else {
              delete nextErrors[field];
            }
          }

          if (
            field === 'jamMulai' &&
            (submitAttempted ||
              Boolean(touched.jamSelesai) ||
              Boolean(prevErrors.jamSelesai))
          ) {
            const selesaiErr = validateField('jamSelesai', nextForm);
            if (selesaiErr) {
              nextErrors.jamSelesai = selesaiErr;
            } else {
              delete nextErrors.jamSelesai;
            }
          }

          return nextErrors;
        });

        return nextForm;
      });
    },
    [submitAttempted, touched]
  );

  const handleBlur = useCallback(
    (field: PendaftaranJasaField) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prevErrors) => {
        const nextErrors: PendaftaranJasaErrors = { ...prevErrors };
        const fieldErr = validateField(field, form);
        if (fieldErr) {
          nextErrors[field] = fieldErr;
        } else {
          delete nextErrors[field];
        }
        return nextErrors;
      });
    },
    [form]
  );

  const validateBeforeSubmit = useCallback((): ValidateKategoriJasaResult => {
    setSubmitAttempted(true);
    const allTouched: Partial<Record<PendaftaranJasaField, boolean>> = {};
    for (const f of FIELD_ORDER) {
      allTouched[f] = true;
    }
    setTouched(allTouched);

    const validation = validateKategoriJasa(form);
    setErrors(validation.errors);
    return validation;
  }, [form]);

  const submitRegistration =
    useCallback(async (): Promise<RegisterPenyediaJasaResult | null> => {
      if (isSubmitting) {
        return null;
      }

      const validation = validateBeforeSubmit();
      if (!validation.isValid) {
        return null;
      }

      setIsSubmitting(true);
      setServerError(null);

      try {
        const result = await submitFormKategoriJasa(form, user.idPengguna);
        setCurrentUserRole(result.role ?? 'PEMBERI_JASA');
        setSuccessResult(result);
        return result;
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          if (err.status === 0) {
            setServerError(err.message);
          } else if (err.status === 400) {
            setServerError(`Pendaftaran ditolak: ${err.message}`);
          } else if (err.status === 404) {
            setServerError('Akun tidak ditemukan. Silakan masuk ulang.');
          } else {
            setServerError(
              'Terjadi kesalahan pada server. Coba beberapa saat lagi.'
            );
          }
        } else {
          setServerError(
            'Terjadi kesalahan pada server. Coba beberapa saat lagi.'
          );
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    }, [form, isSubmitting, user.idPengguna, validateBeforeSubmit]);

  const dismissServerError = useCallback(() => {
    setServerError(null);
  }, []);

  const dismissSuccessModal = useCallback(() => {
    setSuccessResult(null);
  }, []);

  return {
    user,
    isPenyediaJasa,
    form,
    errors,
    touched,
    submitAttempted,
    isSubmitting,
    serverError,
    successResult,
    setFieldValue,
    handleBlur,
    validateBeforeSubmit,
    submitRegistration,
    dismissServerError,
    dismissSuccessModal,
  };
}

export default useCatalogController;
