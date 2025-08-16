export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_lockouts: {
        Row: {
          created_at: string
          email: string
          failed_attempts: number
          id: string
          last_attempt: string | null
          locked_until: string | null
        }
        Insert: {
          created_at?: string
          email: string
          failed_attempts?: number
          id?: string
          last_attempt?: string | null
          locked_until?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          failed_attempts?: number
          id?: string
          last_attempt?: string | null
          locked_until?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number | null
          permissions: Json | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number | null
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number | null
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_submissions: {
        Row: {
          aadhaar_back_url: string | null
          aadhaar_front_url: string | null
          aadhaar_number: string
          created_at: string
          current_address: string
          date_of_birth: string
          district: string
          email: string
          full_name: string
          gender: string
          id: string
          joining_as: string
          languages: string[]
          pan_document_url: string | null
          pan_number: string
          permanent_address: string
          phone: string
          photo_url: string | null
          state: string
          updated_at: string
          whatsapp_phone: string
          why_join: string
        }
        Insert: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_number: string
          created_at?: string
          current_address: string
          date_of_birth: string
          district: string
          email: string
          full_name: string
          gender: string
          id?: string
          joining_as: string
          languages: string[]
          pan_document_url?: string | null
          pan_number: string
          permanent_address: string
          phone: string
          photo_url?: string | null
          state: string
          updated_at?: string
          whatsapp_phone: string
          why_join: string
        }
        Update: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_number?: string
          created_at?: string
          current_address?: string
          date_of_birth?: string
          district?: string
          email?: string
          full_name?: string
          gender?: string
          id?: string
          joining_as?: string
          languages?: string[]
          pan_document_url?: string | null
          pan_number?: string
          permanent_address?: string
          phone?: string
          photo_url?: string | null
          state?: string
          updated_at?: string
          whatsapp_phone?: string
          why_join?: string
        }
        Relationships: []
      }
      atm_enquiry_submissions: {
        Row: {
          city: string
          created_at: string
          email: string | null
          enquiry_purpose: string
          full_name: string
          has_own_space: string
          id: string
          occupation: string
          phone: string
          state: string
          whatsapp_number: string
        }
        Insert: {
          city?: string
          created_at?: string
          email?: string | null
          enquiry_purpose: string
          full_name: string
          has_own_space: string
          id?: string
          occupation: string
          phone: string
          state: string
          whatsapp_number: string
        }
        Update: {
          city?: string
          created_at?: string
          email?: string | null
          enquiry_purpose?: string
          full_name?: string
          has_own_space?: string
          id?: string
          occupation?: string
          phone?: string
          state?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          subject?: string
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempt_time: string | null
          blocked_until: string | null
          email: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          blocked_until?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          blocked_until?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      form_drafts: {
        Row: {
          created_at: string
          draft_data: Json
          expires_at: string
          form_type: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          draft_data: Json
          expires_at?: string
          form_type: string
          id?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          draft_data?: Json
          expires_at?: string
          form_type?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_rate_limits: {
        Row: {
          attempt_count: number
          blocked_until: string | null
          created_at: string
          form_type: string
          id: string
          identifier: string
          window_start: string
        }
        Insert: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          form_type: string
          id?: string
          identifier: string
          window_start?: string
        }
        Update: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          form_type?: string
          id?: string
          identifier?: string
          window_start?: string
        }
        Relationships: []
      }
      franchise_applications: {
        Row: {
          additional_info: string | null
          address_line1: string
          address_line2: string | null
          agreed_to_terms: boolean
          alternate_phone: string | null
          business_type: string
          city: string
          created_at: string
          credit_score: string
          current_occupation: string
          date_of_birth: string
          email: string
          experience_years: string
          first_name: string
          funding_source: string
          id: string
          investment_budget: string
          last_name: string
          monthly_income: string
          net_worth: string
          phone: string
          pincode: string
          preferred_location: string
          space_availability: string
          space_size: string
          state: string
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          address_line1: string
          address_line2?: string | null
          agreed_to_terms?: boolean
          alternate_phone?: string | null
          business_type: string
          city: string
          created_at?: string
          credit_score: string
          current_occupation: string
          date_of_birth: string
          email: string
          experience_years: string
          first_name: string
          funding_source: string
          id?: string
          investment_budget: string
          last_name: string
          monthly_income: string
          net_worth: string
          phone: string
          pincode: string
          preferred_location: string
          space_availability: string
          space_size: string
          state: string
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          address_line1?: string
          address_line2?: string | null
          agreed_to_terms?: boolean
          alternate_phone?: string | null
          business_type?: string
          city?: string
          created_at?: string
          credit_score?: string
          current_occupation?: string
          date_of_birth?: string
          email?: string
          experience_years?: string
          first_name?: string
          funding_source?: string
          id?: string
          investment_budget?: string
          last_name?: string
          monthly_income?: string
          net_worth?: string
          phone?: string
          pincode?: string
          preferred_location?: string
          space_availability?: string
          space_size?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      influencer_submissions: {
        Row: {
          aadhaar_back_url: string | null
          aadhaar_front_url: string | null
          aadhaar_number: string
          created_at: string
          current_address: string
          date_of_birth: string
          district: string
          email: string
          facebook_link: string
          full_name: string
          gender: string
          id: string
          instagram_link: string
          languages: string[]
          linkedin_link: string | null
          other_channel_1: string | null
          other_channel_2: string | null
          pan_document_url: string | null
          pan_number: string
          permanent_address: string
          phone: string
          photo_url: string | null
          state: string
          updated_at: string
          whatsapp_phone: string
          youtube_link: string
        }
        Insert: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_number: string
          created_at?: string
          current_address: string
          date_of_birth: string
          district: string
          email: string
          facebook_link: string
          full_name: string
          gender: string
          id?: string
          instagram_link: string
          languages: string[]
          linkedin_link?: string | null
          other_channel_1?: string | null
          other_channel_2?: string | null
          pan_document_url?: string | null
          pan_number: string
          permanent_address: string
          phone: string
          photo_url?: string | null
          state: string
          updated_at?: string
          whatsapp_phone: string
          youtube_link: string
        }
        Update: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_number?: string
          created_at?: string
          current_address?: string
          date_of_birth?: string
          district?: string
          email?: string
          facebook_link?: string
          full_name?: string
          gender?: string
          id?: string
          instagram_link?: string
          languages?: string[]
          linkedin_link?: string | null
          other_channel_1?: string | null
          other_channel_2?: string | null
          pan_document_url?: string | null
          pan_number?: string
          permanent_address?: string
          phone?: string
          photo_url?: string | null
          state?: string
          updated_at?: string
          whatsapp_phone?: string
          youtube_link?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          candidate_name: string
          created_at: string
          current_location: string | null
          cv_file_url: string | null
          email: string | null
          expected_salary: string | null
          experience: string | null
          id: string
          job_title: string
          notice_period: string | null
          phone: string
        }
        Insert: {
          candidate_name: string
          created_at?: string
          current_location?: string | null
          cv_file_url?: string | null
          email?: string | null
          expected_salary?: string | null
          experience?: string | null
          id?: string
          job_title: string
          notice_period?: string | null
          phone: string
        }
        Update: {
          candidate_name?: string
          created_at?: string
          current_location?: string | null
          cv_file_url?: string | null
          email?: string | null
          expected_salary?: string | null
          experience?: string | null
          id?: string
          job_title?: string
          notice_period?: string | null
          phone?: string
        }
        Relationships: []
      }
      location_submissions: {
        Row: {
          additional_info: string | null
          address: string
          agent_code: string | null
          assisted_by_agent: boolean | null
          building_photo_url: string | null
          city: string
          created_at: string
          district: string
          email: string
          full_name: string
          google_map_link: string | null
          id: string
          location_name: string
          phone: string
          pincode: string
          room_photo_url: string | null
          state: string
          whatsapp_phone: string
        }
        Insert: {
          additional_info?: string | null
          address?: string
          agent_code?: string | null
          assisted_by_agent?: boolean | null
          building_photo_url?: string | null
          city: string
          created_at?: string
          district?: string
          email: string
          full_name: string
          google_map_link?: string | null
          id?: string
          location_name?: string
          phone: string
          pincode?: string
          room_photo_url?: string | null
          state: string
          whatsapp_phone: string
        }
        Update: {
          additional_info?: string | null
          address?: string
          agent_code?: string | null
          assisted_by_agent?: boolean | null
          building_photo_url?: string | null
          city?: string
          created_at?: string
          district?: string
          email?: string
          full_name?: string
          google_map_link?: string | null
          id?: string
          location_name?: string
          phone?: string
          pincode?: string
          room_photo_url?: string | null
          state?: string
          whatsapp_phone?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      search_content: {
        Row: {
          content_section: string
          content_text: string
          content_type: string | null
          created_at: string | null
          id: string
          keywords: string[] | null
          page_path: string
          page_title: string
          updated_at: string | null
        }
        Insert: {
          content_section: string
          content_text: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          page_path: string
          page_title: string
          updated_at?: string | null
        }
        Update: {
          content_section?: string
          content_text?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          page_path?: string
          page_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      website_translations: {
        Row: {
          content_key: string
          content_type: string | null
          created_at: string | null
          id: string
          language_code: string
          original_text: string
          page_path: string
          translated_text: string | null
          updated_at: string | null
        }
        Insert: {
          content_key: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          language_code: string
          original_text: string
          page_path: string
          translated_text?: string | null
          updated_at?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          language_code?: string
          original_text?: string
          page_path?: string
          translated_text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_admin_role: {
        Args: { target_role: string }
        Returns: boolean
      }
      check_account_lockout: {
        Args: { user_email: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_form_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_expired_drafts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enhanced_rate_limit_check: {
        Args: {
          p_identifier: string
          p_form_type: string
          p_ip_address?: unknown
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      get_translation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          language_code: string
          total_count: number
          completed_count: number
        }[]
      }
      has_admin_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_email?: string }
        Returns: boolean
      }
      is_admin_secure: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_with_role_check: {
        Args: { required_role?: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_type: string
          table_name?: string
          record_id?: string
          old_values?: Json
          new_values?: Json
        }
        Returns: undefined
      }
      log_admin_action_enhanced: {
        Args: {
          action_type: string
          table_name?: string
          record_id?: string
          old_values?: Json
          new_values?: Json
          ip_address?: unknown
          user_agent?: string
        }
        Returns: undefined
      }
      log_file_operation: {
        Args: {
          operation_type: string
          file_name: string
          file_size?: number
          file_type?: string
          upload_success?: boolean
        }
        Returns: undefined
      }
      log_security_event: {
        Args: { event_type: string; event_details?: Json; risk_level?: string }
        Returns: undefined
      }
      log_security_event_secure: {
        Args: {
          event_type: string
          event_details?: Json
          risk_level?: string
          ip_address?: unknown
        }
        Returns: undefined
      }
      record_failed_login: {
        Args: { user_email: string }
        Returns: undefined
      }
      reset_account_lockout: {
        Args: { user_email: string }
        Returns: undefined
      }
      track_admin_login: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
