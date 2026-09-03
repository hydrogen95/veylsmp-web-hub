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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          admin_email: string
          created_at: string
          details: Json | null
          id: string
          target: string
        }
        Insert: {
          action: string
          admin_email?: string
          created_at?: string
          details?: Json | null
          id?: string
          target?: string
        }
        Update: {
          action?: string
          admin_email?: string
          created_at?: string
          details?: Json | null
          id?: string
          target?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          description: string
          enabled: boolean
          icon: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          enabled?: boolean
          icon?: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          enabled?: boolean
          icon?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          id: string
          name: string
          path: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          path: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          path?: string
          url?: string
        }
        Relationships: []
      }
      navigation: {
        Row: {
          created_at: string
          enabled: boolean
          href: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          href: string
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          enabled?: boolean
          href?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          title: string
        }
        Insert: {
          author?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          title: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          title?: string
        }
        Relationships: []
      }
      rank_categories: {
        Row: {
          created_at: string
          description: string
          enabled: boolean
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      ranks: {
        Row: {
          category_id: string | null
          color: string
          created_at: string
          currency: string
          description: string
          duration: string
          enabled: boolean
          features: string[]
          icon: string
          id: string
          name: string
          price: number
          purchase_url: string
          sort_order: number
        }
        Insert: {
          category_id?: string | null
          color?: string
          created_at?: string
          currency?: string
          description?: string
          duration?: string
          enabled?: boolean
          features?: string[]
          icon?: string
          id?: string
          name: string
          price?: number
          purchase_url?: string
          sort_order?: number
        }
        Update: {
          category_id?: string | null
          color?: string
          created_at?: string
          currency?: string
          description?: string
          duration?: string
          enabled?: boolean
          features?: string[]
          icon?: string
          id?: string
          name?: string
          price?: number
          purchase_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "ranks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "rank_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      rules: {
        Row: {
          content: string
          created_at: string
          enabled: boolean
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          enabled?: boolean
          id?: string
          sort_order?: number
          title?: string
        }
        Update: {
          content?: string
          created_at?: string
          enabled?: boolean
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      server_settings: {
        Row: {
          bedrock_ip: string
          bedrock_port: string
          check_bedrock: boolean
          check_java: boolean
          combat: string
          description: string
          game_modes: string
          id: number
          java_ip: string
          java_port: string
          maintenance_mode: boolean
          max_players: number
          motd: string
          platform: string
          refresh_interval: number
          server_name: string
          server_version: string
          show_status: boolean
          status_host: string
          status_port: string
          updated_at: string
        }
        Insert: {
          bedrock_ip?: string
          bedrock_port?: string
          check_bedrock?: boolean
          check_java?: boolean
          combat?: string
          description?: string
          game_modes?: string
          id?: number
          java_ip?: string
          java_port?: string
          maintenance_mode?: boolean
          max_players?: number
          motd?: string
          platform?: string
          refresh_interval?: number
          server_name?: string
          server_version?: string
          show_status?: boolean
          status_host?: string
          status_port?: string
          updated_at?: string
        }
        Update: {
          bedrock_ip?: string
          bedrock_port?: string
          check_bedrock?: boolean
          check_java?: boolean
          combat?: string
          description?: string
          game_modes?: string
          id?: number
          java_ip?: string
          java_port?: string
          maintenance_mode?: boolean
          max_players?: number
          motd?: string
          platform?: string
          refresh_interval?: number
          server_name?: string
          server_version?: string
          show_status?: boolean
          status_host?: string
          status_port?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string
          background_color: string
          bedrock_steps: string[]
          border_radius: number
          discord_description: string
          discord_title: string
          discord_url: string
          discord_widget_id: string | null
          favicon_url: string | null
          font_body: string
          font_heading: string
          glow_intensity: number
          hero_background: string | null
          hero_headline: string
          hero_image: string | null
          hero_subtitle: string
          hero_title: string
          id: number
          java_steps: string[]
          logo_url: string | null
          primary_button_label: string
          primary_button_url: string
          primary_color: string
          secondary_button_label: string
          secondary_color: string
          sections: Json
          seo_description: string
          seo_title: string
          text_color: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          background_color?: string
          bedrock_steps?: string[]
          border_radius?: number
          discord_description?: string
          discord_title?: string
          discord_url?: string
          discord_widget_id?: string | null
          favicon_url?: string | null
          font_body?: string
          font_heading?: string
          glow_intensity?: number
          hero_background?: string | null
          hero_headline?: string
          hero_image?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: number
          java_steps?: string[]
          logo_url?: string | null
          primary_button_label?: string
          primary_button_url?: string
          primary_color?: string
          secondary_button_label?: string
          secondary_color?: string
          sections?: Json
          seo_description?: string
          seo_title?: string
          text_color?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          background_color?: string
          bedrock_steps?: string[]
          border_radius?: number
          discord_description?: string
          discord_title?: string
          discord_url?: string
          discord_widget_id?: string | null
          favicon_url?: string | null
          font_body?: string
          font_heading?: string
          glow_intensity?: number
          hero_background?: string | null
          hero_headline?: string
          hero_image?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: number
          java_steps?: string[]
          logo_url?: string | null
          primary_button_label?: string
          primary_button_url?: string
          primary_color?: string
          secondary_button_label?: string
          secondary_color?: string
          sections?: Json
          seo_description?: string
          seo_title?: string
          text_color?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
    Enums: {},
  },
} as const
