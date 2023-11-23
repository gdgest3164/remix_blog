export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      board: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      comment: {
        Row: {
          content: string | null;
          created_at: string;
          id: number;
          password: string | null;
          post_id: number | null;
          writer: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: number;
          password?: string | null;
          post_id?: number | null;
          writer?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: number;
          password?: string | null;
          post_id?: number | null;
          writer?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comment_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "post";
            referencedColumns: ["id"];
          }
        ];
      };
      post: {
        Row: {
          content: string | null;
          created_at: string;
          id: number;
          title: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: number;
          title?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: number;
          title?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
