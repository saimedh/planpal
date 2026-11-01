import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DraftInquirySchema = z.object({
  vendorType: z.string().min(1),
  vendorName: z.string().optional().default("Vendor Partner"),
  eventTitle: z.string().min(1),
  eventType: z.string().default("Celebration"),
  date: z.string().optional().default("Upcoming Date"),
  city: z.string().default("Hyderabad"),
  guests: z.number().int().positive().default(40),
  budget: z.number().optional(),
  language: z.enum(["en", "hi", "te"]).default("en"),
  customNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = DraftInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      vendorType,
      vendorName,
      eventTitle,
      eventType,
      date,
      city,
      guests,
      budget,
      language,
      customNotes,
    } = parsed.data;

    const formattedBudget = budget ? `₹${budget.toLocaleString("en-IN")}` : "our designated range";

    let subject = "";
    let message = "";
    let whatsappUrl = "";

    if (language === "hi") {
      subject = `${eventTitle} - ${vendorType} पूछताछ`;
      message =
        `नमस्ते ${vendorName} जी,\n\n` +
        `हम ${city} में ${date} को हमारे "${eventTitle}" (${eventType}) का आयोजन कर रहे हैं। इस शुभ अवसर पर लगभग ${guests} अतिथि शामिल होंगे।\n\n` +
        `हमें आपके ${vendorType} काम की काफी सराहना मिली है और हम आपके साथ जुड़ना चाहते हैं। ${budget ? `हमारा अनुमानित बजट लगभग ${formattedBudget} है।` : ""}\n` +
        (customNotes ? `विशेष आवश्यकताएं: ${customNotes}\n` : "") +
        `\nकृपया बताएं कि क्या आप इस तिथि पर उपलब्ध हैं? अपनी पैकेज डिटेल्स और हालिया काम का पोर्टफोलियो साझा करने की कृपा करें।\n\n` +
        `धन्यवाद एवं सादर,\nआयोजक परिवार`;
    } else if (language === "te") {
      subject = `${eventTitle} - ${vendorType} విచారణ`;
      message =
        `నమస్కారం ${vendorName} గారు,\n\n` +
        `మేము ${city} లో ${date} తేదీన మా "${eventTitle}" (${eventType}) వేడుకను జరుపుకుంటున్నాము. ఈ వేడుకకు దాదాపు ${guests} మంది అతిథులు రానున్నారు.\n\n` +
        `మీ ${vendorType} సేవల గురించి విన్నాము, మీతో కలిసి పనిచేయాలని ఆశిస్తున్నాము. ${budget ? `మా అంచనా బడ్జెట్ దాదాపు ${formattedBudget}.` : ""}\n` +
        (customNotes ? `ప్రత్యేక అవసరాలు: ${customNotes}\n` : "") +
        `\nఈ తేదీకి మీరు అందుబాటులో ఉన్నారా? దయచేసి మీ ప్యాకేజీ వివరాలు మరియు పని ఫోటోలు పంపగలరు.\n\n` +
        `ధన్యవాదాలతో,\nఈవెంట్ హోస్ట్`;
    } else {
      subject = `Inquiry: ${vendorType} for ${eventTitle}`;
      message =
        `Namaste ${vendorName},\n\n` +
        `We are planning our celebration "${eventTitle}" (${eventType}) in ${city} on ${date}. We are expecting around ${guests} guests.\n\n` +
        `We really admire your work in ${vendorType} and would love to check your availability for this date. ${budget ? `We have set an indicative budget of ${formattedBudget} for this service.` : ""}\n` +
        (customNotes ? `Special preferences: ${customNotes}\n` : "") +
        `\nCould you please share your latest package pricing, portfolio, and what's included?\n\n` +
        `Looking forward to hearing from you!\nWarm regards,\nEvent Host`;
    }

    whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      subject,
      message,
      whatsappUrl,
      metadata: {
        vendorType,
        vendorName,
        language,
        city,
        date,
      },
    });
  } catch (err) {
    console.error("Draft inquiry error:", err);
    return NextResponse.json({ error: "Failed to generate vendor inquiry" }, { status: 500 });
  }
}
