export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      evaluasi: {
        Row: {
          catatan: string | null
          id_admin: string
          id_evaluasi: string
          id_hasil: string
          id_laporan: string
          keputusan: Database["public"]["Enums"]["keputusan_evaluasi"]
          waktu_evaluasi: string
        }
        Insert: {
          catatan?: string | null
          id_admin: string
          id_evaluasi?: string
          id_hasil: string
          id_laporan: string
          keputusan: Database["public"]["Enums"]["keputusan_evaluasi"]
          waktu_evaluasi?: string
        }
        Update: {
          catatan?: string | null
          id_admin?: string
          id_evaluasi?: string
          id_hasil?: string
          id_laporan?: string
          keputusan?: Database["public"]["Enums"]["keputusan_evaluasi"]
          waktu_evaluasi?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluasi_id_admin_fkey"
            columns: ["id_admin"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluasi_id_hasil_fkey"
            columns: ["id_hasil"]
            isOneToOne: false
            referencedRelation: "hasil_perbaikan"
            referencedColumns: ["id_hasil"]
          },
          {
            foreignKeyName: "evaluasi_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluasi_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
      foto: {
        Row: {
          created_at: string
          format: string
          id: string
          id_hasil: string | null
          id_laporan: string | null
          path: string
          ukuran: number
        }
        Insert: {
          created_at?: string
          format: string
          id?: string
          id_hasil?: string | null
          id_laporan?: string | null
          path: string
          ukuran: number
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          id_hasil?: string | null
          id_laporan?: string | null
          path?: string
          ukuran?: number
        }
        Relationships: [
          {
            foreignKeyName: "foto_id_hasil_fkey"
            columns: ["id_hasil"]
            isOneToOne: false
            referencedRelation: "hasil_perbaikan"
            referencedColumns: ["id_hasil"]
          },
          {
            foreignKeyName: "foto_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foto_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
      hasil_perbaikan: {
        Row: {
          catatan: string
          id_eksekutor: string
          id_hasil: string
          id_laporan: string
          waktu_unggah: string
        }
        Insert: {
          catatan: string
          id_eksekutor: string
          id_hasil?: string
          id_laporan: string
          waktu_unggah?: string
        }
        Update: {
          catatan?: string
          id_eksekutor?: string
          id_hasil?: string
          id_laporan?: string
          waktu_unggah?: string
        }
        Relationships: [
          {
            foreignKeyName: "hasil_perbaikan_id_eksekutor_fkey"
            columns: ["id_eksekutor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hasil_perbaikan_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hasil_perbaikan_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
      laporan: {
        Row: {
          alasan_penolakan: string | null
          deskripsi: string
          id: string
          id_pelapor: string
          id_tiket: string
          jumlah_upvote: number
          kategori: Database["public"]["Enums"]["kategori_kerusakan"]
          latitude: number
          longitude: number
          skor_prioritas: number
          status: Database["public"]["Enums"]["status_laporan"]
          tahap: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu_masuk: string
          waktu_selesai: string | null
        }
        Insert: {
          alasan_penolakan?: string | null
          deskripsi: string
          id?: string
          id_pelapor: string
          id_tiket?: string
          jumlah_upvote?: number
          kategori: Database["public"]["Enums"]["kategori_kerusakan"]
          latitude: number
          longitude: number
          skor_prioritas?: number
          status?: Database["public"]["Enums"]["status_laporan"]
          tahap?: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu_masuk?: string
          waktu_selesai?: string | null
        }
        Update: {
          alasan_penolakan?: string | null
          deskripsi?: string
          id?: string
          id_pelapor?: string
          id_tiket?: string
          jumlah_upvote?: number
          kategori?: Database["public"]["Enums"]["kategori_kerusakan"]
          latitude?: number
          longitude?: number
          skor_prioritas?: number
          status?: Database["public"]["Enums"]["status_laporan"]
          tahap?: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu_masuk?: string
          waktu_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laporan_id_pelapor_fkey"
            columns: ["id_pelapor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifikasi: {
        Row: {
          id_laporan: string | null
          id_notifikasi: string
          id_user: string
          isi_pesan: string
          status_baca: boolean
          waktu_kirim: string
        }
        Insert: {
          id_laporan?: string | null
          id_notifikasi?: string
          id_user: string
          isi_pesan: string
          status_baca?: boolean
          waktu_kirim?: string
        }
        Update: {
          id_laporan?: string | null
          id_notifikasi?: string
          id_user?: string
          isi_pesan?: string
          status_baca?: boolean
          waktu_kirim?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifikasi_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifikasi_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifikasi_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nama: string
          role: Database["public"]["Enums"]["peran_user"]
        }
        Insert: {
          created_at?: string
          id: string
          nama: string
          role?: Database["public"]["Enums"]["peran_user"]
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          role?: Database["public"]["Enums"]["peran_user"]
        }
        Relationships: []
      }
      riwayat_status: {
        Row: {
          catatan: string | null
          id: string
          id_laporan: string
          status: Database["public"]["Enums"]["status_laporan"]
          tahap: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu: string
        }
        Insert: {
          catatan?: string | null
          id?: string
          id_laporan: string
          status: Database["public"]["Enums"]["status_laporan"]
          tahap?: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu?: string
        }
        Update: {
          catatan?: string | null
          id?: string
          id_laporan?: string
          status?: Database["public"]["Enums"]["status_laporan"]
          tahap?: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu?: string
        }
        Relationships: [
          {
            foreignKeyName: "riwayat_status_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "riwayat_status_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
      upvote: {
        Row: {
          id_laporan: string
          id_upvote: string
          id_user: string
          waktu_upvote: string
        }
        Insert: {
          id_laporan: string
          id_upvote?: string
          id_user: string
          waktu_upvote?: string
        }
        Update: {
          id_laporan?: string
          id_upvote?: string
          id_user?: string
          waktu_upvote?: string
        }
        Relationships: [
          {
            foreignKeyName: "upvote_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upvote_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upvote_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video: {
        Row: {
          created_at: string
          format: string
          id: string
          id_hasil: string | null
          id_laporan: string | null
          path: string
          ukuran: number
        }
        Insert: {
          created_at?: string
          format: string
          id?: string
          id_hasil?: string | null
          id_laporan?: string | null
          path: string
          ukuran: number
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          id_hasil?: string | null
          id_laporan?: string | null
          path?: string
          ukuran?: number
        }
        Relationships: [
          {
            foreignKeyName: "video_id_hasil_fkey"
            columns: ["id_hasil"]
            isOneToOne: false
            referencedRelation: "hasil_perbaikan"
            referencedColumns: ["id_hasil"]
          },
          {
            foreignKeyName: "video_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_id_laporan_fkey"
            columns: ["id_laporan"]
            isOneToOne: false
            referencedRelation: "laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      laporan_publik: {
        Row: {
          deskripsi: string | null
          id: string | null
          id_tiket: string | null
          jumlah_upvote: number | null
          kategori: Database["public"]["Enums"]["kategori_kerusakan"] | null
          latitude: number | null
          longitude: number | null
          skor_prioritas: number | null
          status: Database["public"]["Enums"]["status_laporan"] | null
          tahap: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu_masuk: string | null
          waktu_selesai: string | null
        }
        Insert: {
          deskripsi?: string | null
          id?: string | null
          id_tiket?: string | null
          jumlah_upvote?: number | null
          kategori?: Database["public"]["Enums"]["kategori_kerusakan"] | null
          latitude?: number | null
          longitude?: number | null
          skor_prioritas?: number | null
          status?: Database["public"]["Enums"]["status_laporan"] | null
          tahap?: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu_masuk?: string | null
          waktu_selesai?: string | null
        }
        Update: {
          deskripsi?: string | null
          id?: string | null
          id_tiket?: string | null
          jumlah_upvote?: number | null
          kategori?: Database["public"]["Enums"]["kategori_kerusakan"] | null
          latitude?: number | null
          longitude?: number | null
          skor_prioritas?: number | null
          status?: Database["public"]["Enums"]["status_laporan"] | null
          tahap?: Database["public"]["Enums"]["tahap_penanganan"] | null
          waktu_masuk?: string | null
          waktu_selesai?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      boleh_dukung: { Args: { p_id: string }; Returns: boolean }
      format_tiket: { Args: { n: number }; Returns: string }
      laporan_terbuka: { Args: { p_id: string }; Returns: boolean }
      peran_saya: {
        Args: never
        Returns: Database["public"]["Enums"]["peran_user"]
      }
    }
    Enums: {
      kategori_kerusakan:
        | "jalan_berlubang"
        | "lampu_jalan_mati"
        | "saluran_air_tersumbat"
        | "trotoar_rusak"
        | "rambu_marka_rusak"
      keputusan_evaluasi: "selesai" | "belum_selesai" | "minta_ulang_bukti"
      peran_user: "warga" | "admin" | "eksekutor"
      status_laporan: "diterima" | "ditolak" | "dikerjakan" | "berhasil"
      tahap_penanganan: "menunggu_eksekusi" | "menunggu_evaluasi"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      kategori_kerusakan: [
        "jalan_berlubang",
        "lampu_jalan_mati",
        "saluran_air_tersumbat",
        "trotoar_rusak",
        "rambu_marka_rusak",
      ],
      keputusan_evaluasi: ["selesai", "belum_selesai", "minta_ulang_bukti"],
      peran_user: ["warga", "admin", "eksekutor"],
      status_laporan: ["diterima", "ditolak", "dikerjakan", "berhasil"],
      tahap_penanganan: ["menunggu_eksekusi", "menunggu_evaluasi"],
    },
  },
} as const
