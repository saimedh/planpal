// ============================================================
// PlanPal – Supabase Database Types
// Auto-aligned with supabase/migrations/001_initial_schema.sql
// ============================================================

// ── Plan JSONB Structure ────────────────────────────────────

export interface PlanBudgetItem {
  category: string;
  amount: number;
  description: string;
}

export interface PlanTimelineItem {
  task: string;
  dueDate: string;
  assignee: string;
  done: boolean;
  reminder: boolean;
}

export interface PlanVendorItem {
  type: string;
  name: string;
  phone: string;
  status: 'to_contact' | 'quoted' | 'booked' | 'paid';
  quote: number | null;
  notes: string;
  priceRange: string;
}

export interface PlanMenuItem {
  name: string;
  category: string;
  isVeg: boolean;
  isJain: boolean;
  isVegan: boolean;
}

export interface PlanIdeas {
  menu: PlanMenuItem[];
  games: string[];
  surprise: string;
  themes: string[];
  decor: string[];
  invitationText: {
    en: string;
    hi: string;
    te: string;
  };
}

export interface PlanRunSheetItem {
  time: string;
  activity: string;
  vendor: string | null;
  contact: string | null;
  notes: string;
}

export interface Plan {
  title: string;
  eventType: EventType;
  date: string;
  guests: number;
  budget: number;
  city: string;
  theme: string;
  language: string;
  budgetSplit: PlanBudgetItem[];
  timeline: PlanTimelineItem[];
  vendors: PlanVendorItem[];
  ideas: PlanIdeas;
  runSheet: PlanRunSheetItem[];
}

// ── Enum-like Unions ────────────────────────────────────────

export type EventType =
  | 'wedding'
  | 'birthday'
  | 'housewarming'
  | 'festival'
  | 'community';

export type MessageRole = 'user' | 'assistant';

export type VendorStatus = 'to_contact' | 'quoted' | 'booked' | 'paid';

// ── Database Schema Types ───────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          preferred_language: string;
          preferred_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_language?: string;
          preferred_currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_language?: string;
          preferred_currency?: string;
          updated_at?: string;
        };
      };

      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: EventType;
          date: string | null;
          guests: number | null;
          budget: number | null;
          city: string | null;
          theme: string | null;
          plan: Plan | Record<string, never>;
          share_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type: EventType;
          date?: string | null;
          guests?: number | null;
          budget?: number | null;
          city?: string | null;
          theme?: string | null;
          plan?: Plan | Record<string, never>;
          share_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: EventType;
          date?: string | null;
          guests?: number | null;
          budget?: number | null;
          city?: string | null;
          theme?: string | null;
          plan?: Plan | Record<string, never>;
          share_token?: string;
          updated_at?: string;
        };
      };

      messages: {
        Row: {
          id: string;
          event_id: string;
          role: MessageRole;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          role: MessageRole;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          role?: MessageRole;
          content?: string;
          created_at?: string;
        };
      };

      expenses: {
        Row: {
          id: string;
          event_id: string;
          category: string;
          amount: number;
          note: string | null;
          spent_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          category: string;
          amount: number;
          note?: string | null;
          spent_on?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          category?: string;
          amount?: number;
          note?: string | null;
          spent_on?: string;
        };
      };

      tasks: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          due_date: string | null;
          assignee: string | null;
          done: boolean;
          reminder: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          due_date?: string | null;
          assignee?: string | null;
          done?: boolean;
          reminder?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          due_date?: string | null;
          assignee?: string | null;
          done?: boolean;
          reminder?: boolean;
        };
      };

      vendors: {
        Row: {
          id: string;
          event_id: string;
          type: string;
          name: string | null;
          phone: string | null;
          status: VendorStatus;
          quote: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          type: string;
          name?: string | null;
          phone?: string | null;
          status?: VendorStatus;
          quote?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          type?: string;
          name?: string | null;
          phone?: string | null;
          status?: VendorStatus;
          quote?: number | null;
          notes?: string | null;
        };
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ── Helper Type Aliases ─────────────────────────────────────

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type Expense = Database['public']['Tables']['expenses']['Row'];
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type Vendor = Database['public']['Tables']['vendors']['Row'];
export type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
export type VendorUpdate = Database['public']['Tables']['vendors']['Update'];
