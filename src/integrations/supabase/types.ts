export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      add_on_services: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          price_per_person: number | null
          flat_rate: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          price_per_person?: number | null
          flat_rate?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          price_per_person?: number | null
          flat_rate?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      availability_slots: {
        Row: {
          id: string
          date: string
          time_slot: string
          max_bookings: number
          current_bookings: number
          is_blocked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          time_slot: string
          max_bookings?: number
          current_bookings?: number
          is_blocked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          time_slot?: string
          max_bookings?: number
          current_bookings?: number
          is_blocked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      booking_add_ons: {
        Row: {
          id: string
          booking_id: string
          add_on_service_id: string
          quantity: number
          calculated_price: number
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          add_on_service_id: string
          quantity?: number
          calculated_price: number
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          add_on_service_id?: string
          quantity?: number
          calculated_price?: number
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          company_name: string | null
          event_date: string
          event_time: string
          guest_count: number
          service_category: Database['public']['Enums']['service_category']
          service_tier: Database['public']['Enums']['service_tier']
          status: Database['public']['Enums']['booking_status']
          special_requests: string | null
          dietary_restrictions: string | null
          estimated_total: number | null
          final_total: number | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          company_name?: string | null
          event_date: string
          event_time: string
          guest_count: number
          service_category: Database['public']['Enums']['service_category']
          service_tier?: Database['public']['Enums']['service_tier']
          status?: Database['public']['Enums']['booking_status']
          special_requests?: string | null
          dietary_restrictions?: string | null
          estimated_total?: number | null
          final_total?: number | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          company_name?: string | null
          event_date?: string
          event_time?: string
          guest_count?: number
          service_category?: Database['public']['Enums']['service_category']
          service_tier?: Database['public']['Enums']['service_tier']
          status?: Database['public']['Enums']['booking_status']
          special_requests?: string | null
          dietary_restrictions?: string | null
          estimated_total?: number | null
          final_total?: number | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          booking_id: string | null
          service_details: Json
          pricing_breakdown: Json
          total_amount: number
          status: Database['public']['Enums']['quote_status']
          valid_until: string
          selected_add_ons: Json
          created_at: string
          updated_at: string
          sent_at: string | null
          accepted_at: string | null
        }
        Insert: {
          id?: string
          booking_id?: string | null
          service_details: Json
          pricing_breakdown: Json
          total_amount: number
          status?: Database['public']['Enums']['quote_status']
          valid_until: string
          selected_add_ons?: Json
          created_at?: string
          updated_at?: string
          sent_at?: string | null
          accepted_at?: string | null
        }
        Update: {
          id?: string
          booking_id?: string | null
          service_details?: Json
          pricing_breakdown?: Json
          total_amount?: number
          status?: Database['public']['Enums']['quote_status']
          valid_until?: string
          selected_add_ons?: Json
          created_at?: string
          updated_at?: string
          sent_at?: string | null
          accepted_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_availability: {
        Args: {
          p_date: string
          p_time: string
        }
        Returns: boolean
      }
      release_time_slot: {
        Args: {
          p_date: string
          p_time: string
        }
        Returns: boolean
      }
      reserve_time_slot: {
        Args: {
          p_date: string
          p_time: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      quote_status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
      service_category: 'corporate' | 'private' | 'wedding' | 'celebration'
      service_tier: 'essential' | 'premium' | 'luxury'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
