import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Plan } from "@/lib/schemas/plan";

// In-Memory store for local development / demo fallback
interface MemoryStore {
  events: Map<string, any>;
  messages: Map<string, any[]>;
  expenses: Map<string, any[]>;
  tasks: Map<string, any[]>;
  vendors: Map<string, any[]>;
}

const memoryStore: MemoryStore = {
  events: new Map(),
  messages: new Map(),
  expenses: new Map(),
  tasks: new Map(),
  vendors: new Map(),
};

// Initialize with sample birthday event
const sampleEventId = "00000000-0000-0000-0000-000000000002";
memoryStore.events.set(sampleEventId, {
  id: sampleEventId,
  user_id: "00000000-0000-0000-0000-000000000001",
  title: "Priya's 30th Birthday Bash",
  type: "birthday",
  date: "2026-11-30",
  guests: 40,
  budget: 80000,
  city: "Hyderabad",
  theme: "Bollywood Glam & Marigold Glow",
  share_token: "seed-birthday-token-12345",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  plan: {
    title: "Priya's 30th Birthday Bash",
    eventType: "birthday",
    date: "2026-11-30",
    guests: 40,
    budget: 80000,
    city: "Hyderabad",
    theme: "Bollywood Glam & Marigold Glow",
    language: "en",
    budgetSplit: [
      { category: "Venue & Lawn", amount: 20000, description: "Boutique banquet lawn in Jubilee Hills" },
      { category: "Food & Mocktails", amount: 25000, description: "Hyderabadi Veg Buffet + Biryani + Chaat counter" },
      { category: "Floral & Fairy Decor", amount: 10000, description: "Marigold photo backdrop & brass urlis" },
      { category: "Candid Photography", amount: 8000, description: "3 hours coverage + digital album" },
      { category: "DJ & Sound Setup", amount: 5000, description: "Bollywood dance playlist & karaoke mic" },
      { category: "Custom 2-Tier Cake", amount: 4000, description: "Belgian Chocolate truffle theme cake" },
      { category: "Return Gifts & Favors", amount: 5000, description: "Customized scented candles & sweets" },
      { category: "Miscellaneous Contingency", amount: 3000, description: "Last minute tips and transport" },
    ],
    timeline: [
      { task: "Shortlist & lock venue lawn in Hyderabad", dueDate: "2026-11-05", assignee: "Host", done: true, reminder: false },
      { task: "Taste test catering menu & confirm live counter", dueDate: "2026-11-12", assignee: "Priya", done: false, reminder: true },
      { task: "Send digital WhatsApp invitations in English & Telugu", dueDate: "2026-11-15", assignee: "Co-host", done: false, reminder: true },
      { task: "Finalize cake design & flavor with baker", dueDate: "2026-11-20", assignee: "Host", done: false, reminder: false },
      { task: "Coordinate sound system & playlist for Bollywood trivia", dueDate: "2026-11-25", assignee: "DJ Lead", done: false, reminder: true },
    ],
    vendors: [
      { type: "Catering", name: "Royal Nawabi Caterers", phone: "+91 98765 11111", status: "quoted", quote: 25000, notes: "Includes live Dosa & Chaat counter", priceRange: "₹500-700/plate" },
      { type: "Decor", name: "Utsav Blooms", phone: "+91 98765 22222", status: "booked", quote: 10000, notes: "Yellow marigold + fairy lights entrance", priceRange: "₹8,000-15,000" },
      { type: "Photography", name: "Frames by Arjun", phone: "+91 98765 33333", status: "to_contact", quote: 8000, notes: "Need reels + candid shots", priceRange: "₹6,000-12,000" },
      { type: "Baker", name: "Cake Delight Hyderabad", phone: "+91 98765 44444", status: "quoted", quote: 4000, notes: "Eggless chocolate truffle", priceRange: "₹1,000/kg" },
    ],
    ideas: {
      menu: [
        { name: "Paneer Tikka Angara", category: "Starters", isVeg: true, isJain: false, isVegan: false },
        { name: "Crispy Corn & Waterchestnut", category: "Starters", isVeg: true, isJain: true, isVegan: true },
        { name: "Hyderabadi Veg Dum Biryani & Mirchi Ka Salan", category: "Mains", isVeg: true, isJain: false, isVegan: false },
        { name: "Paneer Butter Masala & Naan", category: "Mains", isVeg: true, isJain: false, isVegan: false },
        { name: "Live Pani Puri Counter", category: "Live Counters", isVeg: true, isJain: true, isVegan: true },
        { name: "Gulab Jamun with Rabdi", category: "Desserts", isVeg: true, isJain: false, isVegan: false },
      ],
      games: ["Bollywood Dialogue Dumb Charades", "Rapid Fire 'Who Knows Priya Best'", "Musical Hookstep Challenge"],
      surprise: "Surprise video montage of childhood photos and wishes from friends abroad played right before the cake cutting!",
      themes: ["Bollywood Retro Glam (Gold & Magenta)", "Traditional Marigold & Brass Chic"],
      decor: ["Brass urli centerpieces with floating marigolds & candles", "Fairy lights canopy over dining area", "Bollywood photo booth frame"],
      invitationText: {
        en: "✨ Priya is turning 30! Join us for an evening of Bollywood music, delicious food, and celebration on Nov 30, 7 PM at Jubilee Hills, Hyderabad. Dress code: Festive Glam!",
        hi: "✨ प्रिया का 30वां जन्मदिन! 30 नवंबर, शाम 7 बजे जुबली हिल्स, हैदराबाद में संगीत, स्वादिष्ट भोजन और खुशियों के इस उत्सव में सादर आमंत्रित हैं।",
        te: "✨ ప్రియా 30వ పుట్టినరోజు వేడుక! నవంబర్ 30న సాయంత్రం 7 గంటలకు జూబ్లీహిల్స్, హైదరాబాద్‌లో జరిగే ఈ వేడుకకు మీరందరూ సాదరంగా ఆహ్వానితులు!",
      },
    },
    runSheet: [
      { time: "05:00 PM", activity: "Venue decor & lighting final setup", vendor: "Utsav Blooms", contact: "Suresh", notes: "Ensure photo wall lights work" },
      { time: "06:30 PM", activity: "Welcome drinks & live chaat counter open", vendor: "Royal Nawabi Caterers", contact: "Mohan Lead Waiter", notes: "Mocktails iced and ready" },
      { time: "07:30 PM", activity: "Guest arrivals & photo booth sessions", vendor: "Frames by Arjun", contact: "Arjun Photographer", notes: "Capture family portraits" },
      { time: "08:15 PM", activity: "Surprise video screening & Cake Cutting", vendor: "Cake Delight", contact: "Host", notes: "Sparklers handed to guests" },
      { time: "08:45 PM", activity: "Dinner Buffet & Bollywood Dance", vendor: "DJ Setup", contact: "DJ Sunny", notes: "Hot biryani served" },
    ],
  },
});

function hasValidSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url.startsWith("https://") && !url.includes("your-project");
}

export const dbService = {
  // Events
  async getEvent(id: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client.from("events").select("*").eq("id", id).single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase fetch error, using local fallback:", e);
      }
    }
    return memoryStore.events.get(id) || null;
  },

  async getEventByShareToken(token: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client.from("events").select("*").eq("share_token", token).single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase token fetch error, using local fallback:", e);
      }
    }
    for (const ev of memoryStore.events.values()) {
      if (ev.share_token === token) return ev;
    }
    return null;
  },

  async deleteEvent(id: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        await client.from("events").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase event delete error:", e);
      }
    }
    memoryStore.events.delete(id);
    memoryStore.messages.delete(id);
    memoryStore.expenses.delete(id);
    memoryStore.tasks.delete(id);
    memoryStore.vendors.delete(id);
    return { success: true };
  },

  async listEvents(userId?: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        let query = client.from("events").select("*").order("created_at", { ascending: false });
        if (userId) query = query.eq("user_id", userId);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase list error, using local fallback:", e);
      }
    }
    return Array.from(memoryStore.events.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async createEvent(event: any) {
    const id = event.id || crypto.randomUUID();
    const newEvent = {
      ...event,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_token: event.share_token || crypto.randomUUID().replace(/-/g, "").slice(0, 16),
    };

    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client.from("events").insert(newEvent).select().single();
        if (!error && data) {
          memoryStore.events.set(data.id, data);
          return data;
        }
      } catch (e) {
        console.warn("Supabase insert error, using local fallback:", e);
      }
    }

    memoryStore.events.set(id, newEvent);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<any>) {
    const updated = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("events")
          .update(updated)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          memoryStore.events.set(id, data);
          return data;
        }
      } catch (e) {
        console.warn("Supabase update error, using local fallback:", e);
      }
    }

    const current = memoryStore.events.get(id) || {};
    const merged = { ...current, ...updated };
    memoryStore.events.set(id, merged);
    return merged;
  },

  // Messages
  async getRecentMessages(eventId: string, limit: number = 12) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("messages")
          .select("role, content")
          .eq("event_id", eventId)
          .order("created_at", { ascending: true })
          .limit(limit);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase messages fetch error, using local fallback:", e);
      }
    }
    const list = memoryStore.messages.get(eventId) || [];
    return list.slice(-limit);
  },

  async saveMessage(eventId: string, role: "user" | "assistant", content: string) {
    const msg = {
      id: crypto.randomUUID(),
      event_id: eventId,
      role,
      content,
      created_at: new Date().toISOString(),
    };

    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        await client.from("messages").insert(msg);
      } catch (e) {
        console.warn("Supabase message save error:", e);
      }
    }

    const list = memoryStore.messages.get(eventId) || [];
    list.push(msg);
    memoryStore.messages.set(eventId, list);
    return msg;
  },

  // Expenses
  async getExpenses(eventId: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("expenses")
          .select("*")
          .eq("event_id", eventId)
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase expenses error:", e);
      }
    }
    return memoryStore.expenses.get(eventId) || [];
  },

  async createExpense(expense: any) {
    const newExp = {
      id: crypto.randomUUID(),
      ...expense,
      created_at: new Date().toISOString(),
    };

    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client.from("expenses").insert(newExp).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase expense insert error:", e);
      }
    }

    const list = memoryStore.expenses.get(expense.event_id) || [];
    list.unshift(newExp);
    memoryStore.expenses.set(expense.event_id, list);
    return newExp;
  },

  async deleteExpense(id: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        await client.from("expenses").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase expense delete error:", e);
      }
    }

    for (const [eventId, list] of memoryStore.expenses.entries()) {
      memoryStore.expenses.set(
        eventId,
        list.filter((e) => e.id !== id)
      );
    }
    return { success: true };
  },

  // Tasks
  async getTasks(eventId: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("tasks")
          .select("*")
          .eq("event_id", eventId)
          .order("due_date", { ascending: true });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase tasks fetch error:", e);
      }
    }
    return memoryStore.tasks.get(eventId) || [];
  },

  async updateTask(id: string, updates: any) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("tasks")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase task update error:", e);
      }
    }

    for (const [eventId, list] of memoryStore.tasks.entries()) {
      const idx = list.findIndex((t) => t.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        memoryStore.tasks.set(eventId, list);
        return list[idx];
      }
    }
    return null;
  },

  async createTask(task: any) {
    const newTask = {
      id: crypto.randomUUID(),
      done: false,
      reminder: false,
      ...task,
      created_at: new Date().toISOString(),
    };

    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client.from("tasks").insert(newTask).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase task insert error:", e);
      }
    }

    const list = memoryStore.tasks.get(task.event_id) || [];
    list.push(newTask);
    memoryStore.tasks.set(task.event_id, list);
    return newTask;
  },

  async deleteTask(id: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        await client.from("tasks").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase task delete error:", e);
      }
    }

    for (const [eventId, list] of memoryStore.tasks.entries()) {
      memoryStore.tasks.set(
        eventId,
        list.filter((t) => t.id !== id)
      );
    }
    return { success: true };
  },

  // Vendors
  async getVendors(eventId: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("vendors")
          .select("*")
          .eq("event_id", eventId)
          .order("created_at", { ascending: true });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase vendors error:", e);
      }
    }
    return memoryStore.vendors.get(eventId) || [];
  },

  async createVendor(vendor: any) {
    const newVendor = {
      id: crypto.randomUUID(),
      status: "to_contact",
      ...vendor,
      created_at: new Date().toISOString(),
    };

    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client.from("vendors").insert(newVendor).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase vendor insert error:", e);
      }
    }

    const list = memoryStore.vendors.get(vendor.event_id) || [];
    list.push(newVendor);
    memoryStore.vendors.set(vendor.event_id, list);
    return newVendor;
  },

  async updateVendor(id: string, updates: any) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        const { data, error } = await client
          .from("vendors")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase vendor update error:", e);
      }
    }

    for (const [eventId, list] of memoryStore.vendors.entries()) {
      const idx = list.findIndex((v) => v.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        memoryStore.vendors.set(eventId, list);
        return list[idx];
      }
    }
    return null;
  },

  async deleteVendor(id: string) {
    if (hasValidSupabase()) {
      try {
        const client = await createServiceClient();
        await client.from("vendors").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase vendor delete error:", e);
      }
    }

    for (const [eventId, list] of memoryStore.vendors.entries()) {
      memoryStore.vendors.set(
        eventId,
        list.filter((v) => v.id !== id)
      );
    }
    return { success: true };
  },

  // Full Event Export & Import
  async exportEventData(eventId: string) {
    const event = await this.getEvent(eventId);
    if (!event) return null;
    const messages = await this.getRecentMessages(eventId, 100);
    const expenses = await this.getExpenses(eventId);
    const tasks = await this.getTasks(eventId);
    const vendors = await this.getVendors(eventId);

    return {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      event,
      messages,
      expenses,
      tasks,
      vendors,
    };
  },

  async importEventData(bundle: any, userId?: string) {
    const ev = bundle.event;
    if (!ev) throw new Error("Invalid import bundle: missing event object");

    const newId = crypto.randomUUID();
    const importedEvent = {
      ...ev,
      id: newId,
      user_id: userId || ev.user_id || "00000000-0000-0000-0000-000000000001",
      title: `${ev.title} (Imported)`,
      share_token: crypto.randomUUID().replace(/-/g, "").slice(0, 16),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await this.createEvent(importedEvent);

    if (Array.isArray(bundle.expenses)) {
      for (const exp of bundle.expenses) {
        await this.createExpense({ ...exp, event_id: newId });
      }
    }

    if (Array.isArray(bundle.tasks)) {
      for (const t of bundle.tasks) {
        await this.createTask({ ...t, event_id: newId });
      }
    }

    if (Array.isArray(bundle.vendors)) {
      for (const v of bundle.vendors) {
        await this.createVendor({ ...v, event_id: newId });
      }
    }

    return importedEvent;
  },

  // Synchronize timeline tasks and vendors from AI Plan into relational tables
  async syncPlanEntities(eventId: string, plan: Plan) {
    if (plan.timeline && plan.timeline.length > 0) {
      const tasks = plan.timeline.map((t) => ({
        id: crypto.randomUUID(),
        event_id: eventId,
        title: t.task,
        due_date: t.dueDate || null,
        assignee: t.assignee || null,
        done: t.done || false,
        reminder: t.reminder || false,
      }));
      memoryStore.tasks.set(eventId, tasks);

      if (hasValidSupabase()) {
        try {
          const client = await createServiceClient();
          await client.from("tasks").delete().eq("event_id", eventId);
          await client.from("tasks").insert(tasks);
        } catch (e) {
          console.warn("Supabase tasks sync error:", e);
        }
      }
    }

    if (plan.vendors && plan.vendors.length > 0) {
      const vendors = plan.vendors.map((v) => ({
        id: crypto.randomUUID(),
        event_id: eventId,
        type: v.type,
        name: v.name || null,
        phone: v.phone || null,
        status: v.status || "to_contact",
        quote: v.quote || null,
        notes: v.notes || null,
      }));
      memoryStore.vendors.set(eventId, vendors);

      if (hasValidSupabase()) {
        try {
          const client = await createServiceClient();
          await client.from("vendors").delete().eq("event_id", eventId);
          await client.from("vendors").insert(vendors);
        } catch (e) {
          console.warn("Supabase vendors sync error:", e);
        }
      }
    }
  },
};
