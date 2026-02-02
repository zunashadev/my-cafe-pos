import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Custom hook untuk mengelola file preview di React (Create/Update forms)
 *
 * Fitur:
 * - Menyimpan file asli untuk submit (getFile)
 * - Membuat preview object URL untuk UI
 * - Bisa menerima initialPreview (misal currentData.avatar_url)
 * - Reset otomatis & manual
 * - Cleanup object URL untuk mencegah memory leak
 *
 * Alur:
 * - setFile → update fileRef & preview, revoke URL lama
 * - reset → reset fileRef & preview ke initialPreview
 * - useEffect → cleanup saat unmount
 * - useEffect → sync initialPreview jika user belum memilih file baru
 */
export function useFilePreview(initialPreview?: string) {
  // 🔹 State untuk URL preview yang akan ditampilkan di UI
  const [preview, setPreview] = useState<string | undefined>(initialPreview);

  // 🔹 Ref untuk menyimpan file asli (tidak memicu re-render)
  const fileRef = useRef<File | undefined>(undefined);

  // 🔹 Ref untuk menyimpan object URL sementara
  // → agar bisa di-revoke saat file diganti atau unmount
  const urlRef = useRef<string | undefined>(undefined);

  /**
   * 🔹 setFile
   * - Dipanggil saat user pilih file baru di input
   * - revoke URL lama agar tidak memory leak
   * - buat object URL baru → update preview state
   * - jika file undefined/null → kembalikan preview ke initialPreview
   */
  const setFile = (file: File | undefined) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = undefined;
    }

    if (!file) {
      // Reset fileRef & kembalikan preview ke initial
      fileRef.current = undefined;
      setPreview(initialPreview);
      return;
    }

    // Simpan file asli
    fileRef.current = file;

    // Buat object URL untuk preview
    const url = URL.createObjectURL(file);
    urlRef.current = url;

    // Update state preview → otomatis render di UI
    setPreview(url);
  };

  /**
   * 🔹 reset
   * - Dipanggil manual untuk reset form (misal modal ditutup)
   * - revoke URL lama agar tidak memory leak
   * - reset fileRef & set preview ke initialPreview
   */
  const reset = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = undefined;
    }
    fileRef.current = undefined;
    setPreview(initialPreview);
  }, [initialPreview]);

  /**
   * 🔹 Cleanup saat unmount
   * - revoke object URL terakhir jika masih ada
   */
  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  /**
   * 🔹 getFile
   * - Ambil file asli untuk submit
   * - Aman dipanggil di event handler tanpa trigger re-render
   */
  const getFile = () => fileRef.current;

  /**
   * 🔹 Sync initialPreview saat berubah
   * - Misal currentData.avatar_url berubah
   * - Tapi hanya update preview jika user belum pilih file baru
   * - Gunakan startTransition agar tidak memicu cascading render / warning React
   */
  useEffect(() => {
    if (!fileRef.current) {
      startTransition(() => {
        setPreview(initialPreview);
      });
    }
  }, [initialPreview]);

  return { preview, setFile, getFile, reset };
}
