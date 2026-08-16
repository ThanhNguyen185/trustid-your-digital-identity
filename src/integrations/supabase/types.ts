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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      credentials: {
        Row: {
          created_at: string
          cred_type: string
          detail: Json
          file_path: string | null
          hash: string | null
          icon: string
          id: string
          issued_at: string | null
          issuer: string
          reviewed_at: string | null
          reviewer_note: string | null
          status: Database["public"]["Enums"]["cred_status"]
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cred_type: string
          detail?: Json
          file_path?: string | null
          hash?: string | null
          icon?: string
          id?: string
          issued_at?: string | null
          issuer: string
          reviewed_at?: string | null
          reviewer_note?: string | null
          status?: Database["public"]["Enums"]["cred_status"]
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          cred_type?: string
          detail?: Json
          file_path?: string | null
          hash?: string | null
          icon?: string
          id?: string
          issued_at?: string | null
          issuer?: string
          reviewed_at?: string | null
          reviewer_note?: string | null
          status?: Database["public"]["Enums"]["cred_status"]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_submissions: {
        Row: {
          ai_result: Json | null
          created_at: string
          id: string
          id_doc_path: string | null
          note: string | null
          score: number | null
          selfie_path: string | null
          status: Database["public"]["Enums"]["verify_status"]
          user_id: string
        }
        Insert: {
          ai_result?: Json | null
          created_at?: string
          id?: string
          id_doc_path?: string | null
          note?: string | null
          score?: number | null
          selfie_path?: string | null
          status?: Database["public"]["Enums"]["verify_status"]
          user_id: string
        }
        Update: {
          ai_result?: Json | null
          created_at?: string
          id?: string
          id_doc_path?: string | null
          note?: string | null
          score?: number | null
          selfie_path?: string | null
          status?: Database["public"]["Enums"]["verify_status"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          did: string
          dob: string | null
          email: string | null
          full_name: string | null
          id: string
          identity_score: number | null
          identity_status: Database["public"]["Enums"]["verify_status"]
          major: string | null
          school: string | null
          student_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          did?: string
          dob?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          identity_score?: number | null
          identity_status?: Database["public"]["Enums"]["verify_status"]
          major?: string | null
          school?: string | null
          student_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          did?: string
          dob?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          identity_score?: number | null
          identity_status?: Database["public"]["Enums"]["verify_status"]
          major?: string | null
          school?: string | null
          student_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      share_links: {
        Row: {
          created_at: string
          credential_ids: string[]
          expires_at: string
          fields: string[]
          id: string
          org: string | null
          purpose: string | null
          revoked: boolean
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_ids?: string[]
          expires_at?: string
          fields?: string[]
          id?: string
          org?: string | null
          purpose?: string | null
          revoked?: boolean
          token?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_ids?: string[]
          expires_at?: string
          fields?: string[]
          id?: string
          org?: string | null
          purpose?: string | null
          revoked?: boolean
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "university" | "admin"
      cred_status: "pending" | "verified" | "revoked"
      verify_status: "unverified" | "pending" | "verified" | "rejected"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["student", "university", "admin"],
      cred_status: ["pending", "verified", "revoked"],
      verify_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
