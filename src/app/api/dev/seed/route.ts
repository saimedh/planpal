import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    let db;
    try {
      db = await createServiceClient();
    } catch {
      db = await createClient();
    }

    const demoUserId = "00000000-0000-0000-0000-000000000001";

    // 1. Ensure demo profile exists
    await db
      .from("profiles")
      .upsert({
        id: demoUserId,
        full_name: "Priya Sharma",
        preferred_language: "en",
        preferred_currency: "INR",
      })
      .select();

    // 2. Insert sample celebration: Priya's 30th Birthday Bash
    const sampleEvent = {
      id: "00000000-0000-0000-0000-000000000002",
      user_id: demoUserId,
      title: "Priya's 30th Birthday Bash",
      type: "birthday",
      date: "2026-11-30",
      guests: 40,
      budget: 80000,
      city: "Hyderabad",
      theme: "Bollywood Glam & Marigold Glow",
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
          { category: "Venue & Lawn", amount: 20000, description: "Boutique lawn in Jubilee Hills" },
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
      share_token: "seed-birthday-token-12345",
    };

    await db.from("events").upsert(sampleEvent);

    return NextResponse.json({
      success: true,
      message: "Sample celebration seed completed successfully.",
      eventId: sampleEvent.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Seed failed: " + err.message },
      { status: 500 }
    );
  }
}
