import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MenuRequestSchema = z.object({
  eventType: z.string().default("wedding"),
  region: z.enum(["North Indian", "South Indian", "Hyderabadi", "Gujarati / Rajasthani", "Pan-Indian Fusion"]).default("South Indian"),
  dietaryPreference: z.enum(["all-veg", "veg-and-nonveg", "jain-friendly", "vegan"]).default("all-veg"),
  guests: z.number().int().positive().default(50),
});

interface MenuItem {
  name: string;
  category: "Starters" | "Mains" | "Live Counters" | "Desserts" | "Beverages";
  isVeg: boolean;
  isJain: boolean;
  isVegan: boolean;
  description: string;
}

const REGIONAL_MENUS: Record<string, MenuItem[]> = {
  "South Indian": [
    { name: "Crispy Medu Vada with Coconut Chutney", category: "Starters", isVeg: true, isJain: false, isVegan: true, description: "Golden fried lentil fritters" },
    { name: "Gobi 65 & Curry Leaf Crisps", category: "Starters", isVeg: true, isJain: false, isVegan: true, description: "Spicy cauliflower tossed with roasted curry leaves" },
    { name: "Live Dosa & Paniyaram Counter", category: "Live Counters", isVeg: true, isJain: true, isVegan: true, description: "Ghee roast, podi dosa, and vegetable paniyaram" },
    { name: "Authentic Avial & Steamed Kerala Matta Rice", category: "Mains", isVeg: true, isJain: false, isVegan: true, description: "Coconut and curd based mixed vegetable curry" },
    { name: "Mysore Bisi Bele Bath with Boondi", category: "Mains", isVeg: true, isJain: false, isVegan: false, description: "Spiced lentil rice with pure desi ghee" },
    { name: "Elaneer (Tender Coconut) Payasam", category: "Desserts", isVeg: true, isJain: true, isVegan: false, description: "Chilled tender coconut pudding flavored with cardamom" },
    { name: "South Indian Filter Coffee Shots", category: "Beverages", isVeg: true, isJain: true, isVegan: false, description: "Freshly brewed chicory coffee in brass dabarahs" },
  ],
  "Hyderabadi": [
    { name: "Paneer Angara Tikka with Mint Chutney", category: "Starters", isVeg: true, isJain: false, isVegan: false, description: "Smoked cottage cheese marinated in crushed spices" },
    { name: "Crispy Corn & Waterchestnut Pepper Salt", category: "Starters", isVeg: true, isJain: true, isVegan: true, description: "Wok-tossed sweet corn and crunchy chestnuts" },
    { name: "Live Chaat & Pani Puri Counter (6 Flavors)", category: "Live Counters", isVeg: true, isJain: true, isVegan: true, description: "Teekha, meetha, hing, and hajmi pani puri with dahi puri" },
    { name: "Hyderabadi Dum Veg Biryani with Mirchi Ka Salan", category: "Mains", isVeg: true, isJain: false, isVegan: false, description: "Fragrant basmati rice layered with saffron, mint, and fried onions" },
    { name: "Paneer Kastoori Methi with Roomali Roti", category: "Mains", isVeg: true, isJain: false, isVegan: false, description: "Rich cashew and fenugreek gravy with fresh handkerchief breads" },
    { name: "Shahi Double Ka Meetha with Rabdi", category: "Desserts", isVeg: true, isJain: false, isVegan: false, description: "Hyderabadi royal bread pudding infused with saffron and pistachios" },
    { name: "Irani Chai with Osmania Biscuits", category: "Beverages", isVeg: true, isJain: true, isVegan: false, description: "Simmered condensed milk tea paired with traditional salty-sweet biscuits" },
  ],
  "North Indian": [
    { name: "Dahi Ke Kebab", category: "Starters", isVeg: true, isJain: false, isVegan: false, description: "Melt-in-mouth hung curd patties with pomegranate seeds" },
    { name: "Amritsari Paneer Pakora", category: "Starters", isVeg: true, isJain: false, isVegan: false, description: "Crisp gram-flour coated spiced paneer" },
    { name: "Live Tandoori Kulcha & Dal Makhani Counter", category: "Live Counters", isVeg: true, isJain: false, isVegan: false, description: "Clay oven Amritsari kulchas served with 24-hr slow-cooked black lentils" },
    { name: "Paneer Lababdar with Butter Garlic Naan", category: "Mains", isVeg: true, isJain: false, isVegan: false, description: "Creamy tomato onion gravy with grated paneer and clay oven flatbreads" },
    { name: "Subz Handi Dum Pulao with Boondi Raita", category: "Mains", isVeg: true, isJain: false, isVegan: false, description: "Basmati rice cooked in earthen pots with garden veggies" },
    { name: "Moong Dal Halwa with Khoya", category: "Desserts", isVeg: true, isJain: true, isVegan: false, description: "Rich ghee-roasted yellow lentil fudge" },
    { name: "Kesar Pista Lassi in Kulhads", category: "Beverages", isVeg: true, isJain: true, isVegan: false, description: "Traditional thick sweetened yogurt drink served in terracotta cups" },
  ],
  "Gujarati / Rajasthani": [
    { name: "Khandvi & Nylon Khaman with Mustard Tadka", category: "Starters", isVeg: true, isJain: true, isVegan: true, description: "Steamed gram flour rolls with grated coconut and green chillies" },
    { name: "Poha Patties & Lilva Kachori", category: "Starters", isVeg: true, isJain: false, isVegan: true, description: "Crispy winter lentil pastries" },
    { name: "Live Dal Baati Churma Counter", category: "Live Counters", isVeg: true, isJain: false, isVegan: false, description: "Oven baked wheat dumplings steeped in pure ghee with panchmel dal" },
    { name: "Gujarati Undhiyu with Puri", category: "Mains", isVeg: true, isJain: false, isVegan: true, description: "Traditional slow-cooked earthen pot winter vegetable delicacy" },
    { name: "Kadhi Khichdi with Ghee & Papad", category: "Mains", isVeg: true, isJain: true, isVegan: false, description: "Sweet and tangy spiced yogurt soup with tempered rice" },
    { name: "Ghevar with Malai Rabdi", category: "Desserts", isVeg: true, isJain: true, isVegan: false, description: "Honeycomb crisp disc soaked in sugar syrup topped with saffron clotted cream" },
    { name: "Masala Chaas with Roasted Cumin", category: "Beverages", isVeg: true, isJain: true, isVegan: false, description: "Refreshing churned spiced buttermilk" },
  ],
  "Pan-Indian Fusion": [
    { name: "Paneer Tikka Quesadilla with Salsa Verde", category: "Starters", isVeg: true, isJain: false, isVegan: false, description: "Grilled flour tortillas stuffed with tandoori cottage cheese and cheese" },
    { name: "Masala Edamame & Lotus Root Crisps", category: "Starters", isVeg: true, isJain: true, isVegan: true, description: "Steamed pods tossed in chaat masala and crisp lotus stem" },
    { name: "Live Wood-Fired Naanizza Counter", category: "Live Counters", isVeg: true, isJain: false, isVegan: false, description: "Mini garlic naans topped with makhani gravy and mozzarella" },
    { name: "Wild Mushroom Dum Biryani with Truffle Oil", category: "Mains", isVeg: true, isJain: false, isVegan: true, description: "Aromatic basmati rice layered with porcini and button mushrooms" },
    { name: "Dal Makhani Fondue with Chur-Chur Naan Dippers", category: "Mains", isVeg: true, isJain: false, isVegan: false, description: "Velvety black lentils served fondue style with crunchy naan bites" },
    { name: "Gulab Jamun Cheesecake Shots", category: "Desserts", isVeg: true, isJain: false, isVegan: false, description: "New York baked cheesecake base infused with cardamom syrup and mini jamuns" },
    { name: "Kala Khatta Sparkling Spritzer", category: "Beverages", isVeg: true, isJain: true, isVegan: true, description: "Jamun syrup, black salt, mint, and fizzy soda" },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = MenuRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { region, dietaryPreference, guests, eventType } = parsed.data;

    let items = REGIONAL_MENUS[region] || REGIONAL_MENUS["South Indian"];

    // Filter based on dietary preference
    if (dietaryPreference === "jain-friendly") {
      items = items.map((item) => ({
        ...item,
        name: item.isJain ? item.name : `${item.name} (Jain Preparation: No Onion / Garlic / Root Veg)`,
        isJain: true,
      }));
    } else if (dietaryPreference === "vegan") {
      items = items.filter((item) => item.isVegan);
      if (items.length < 4) {
        items = items.map((item) => ({
          ...item,
          name: `${item.name} (Dairy-Free / Cold-Pressed Oil)`,
          isVegan: true,
        }));
      }
    }

    // Suggested per-head cost estimate based on guest count and region
    const basePerPlate = region === "Pan-Indian Fusion" ? 850 : 600;
    const estimatedTotalCatering = basePerPlate * guests;

    return NextResponse.json({
      region,
      dietaryPreference,
      guests,
      eventType,
      estimatedPerPlate: `₹${basePerPlate}`,
      estimatedTotalCatering: `₹${estimatedTotalCatering.toLocaleString("en-IN")}`,
      items,
      count: items.length,
    });
  } catch (err) {
    console.error("Menu generation error:", err);
    return NextResponse.json({ error: "Failed to generate menu" }, { status: 500 });
  }
}
