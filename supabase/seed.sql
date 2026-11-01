-- ============================================================
-- PlanPal: Seed Data – Sample Birthday Event
-- Idempotent: uses ON CONFLICT DO NOTHING throughout
-- ============================================================

-- Fixed IDs for reproducibility
do $$
declare
  v_profile_id  uuid := '00000000-0000-0000-0000-000000000001';
  v_event_id    uuid := '00000000-0000-0000-0000-000000000010';
  v_msg1_id     uuid := '00000000-0000-0000-0000-000000000101';
  v_msg2_id     uuid := '00000000-0000-0000-0000-000000000102';
  v_msg3_id     uuid := '00000000-0000-0000-0000-000000000103';
  v_exp1_id     uuid := '00000000-0000-0000-0000-000000000201';
  v_exp2_id     uuid := '00000000-0000-0000-0000-000000000202';
  v_task1_id    uuid := '00000000-0000-0000-0000-000000000301';
  v_task2_id    uuid := '00000000-0000-0000-0000-000000000302';
  v_task3_id    uuid := '00000000-0000-0000-0000-000000000303';
  v_vendor1_id  uuid := '00000000-0000-0000-0000-000000000401';
  v_vendor2_id  uuid := '00000000-0000-0000-0000-000000000402';
  v_event_date  date := current_date + interval '30 days';
  v_plan        jsonb;
begin

  -- ── Plan JSONB ──────────────────────────────────────────────
  v_plan := jsonb_build_object(
    'title',     'Priya''s 30th Birthday Bash',
    'eventType', 'birthday',
    'date',      v_event_date,
    'guests',    40,
    'budget',    80000,
    'city',      'Hyderabad',
    'theme',     'Bollywood Glam',
    'language',  'en',

    'budgetSplit', jsonb_build_array(
      jsonb_build_object('category', 'Venue',         'amount', 20000, 'description', 'Banquet hall with dance floor & AV setup'),
      jsonb_build_object('category', 'Food & Drinks', 'amount', 25000, 'description', 'Vegetarian buffet with mocktail bar'),
      jsonb_build_object('category', 'Decor',         'amount', 10000, 'description', 'Gold, red & black Bollywood-themed decor with sequin backdrop'),
      jsonb_build_object('category', 'Photography',   'amount',  8000, 'description', 'Candid photographer + instant photo booth'),
      jsonb_build_object('category', 'Entertainment', 'amount',  5000, 'description', 'DJ with Bollywood playlist & dance-off host'),
      jsonb_build_object('category', 'Cake',          'amount',  4000, 'description', 'Custom 3-tier Bollywood clapboard cake'),
      jsonb_build_object('category', 'Miscellaneous', 'amount',  8000, 'description', 'Return gifts, props, invitations, transport')
    ),

    'timeline', jsonb_build_array(
      jsonb_build_object('task', 'Finalise venue & pay advance',    'dueDate', (v_event_date - 25)::text, 'assignee', 'Priya',  'done', true,  'reminder', false),
      jsonb_build_object('task', 'Send digital invitations',        'dueDate', (v_event_date - 20)::text, 'assignee', 'Rahul',  'done', true,  'reminder', false),
      jsonb_build_object('task', 'Confirm catering menu & count',   'dueDate', (v_event_date - 10)::text, 'assignee', 'Priya',  'done', false, 'reminder', true),
      jsonb_build_object('task', 'Book photographer & DJ',          'dueDate', (v_event_date - 14)::text, 'assignee', 'Meena',  'done', false, 'reminder', true),
      jsonb_build_object('task', 'Order cake & return gifts',       'dueDate', (v_event_date -  5)::text, 'assignee', 'Rahul',  'done', false, 'reminder', true)
    ),

    'vendors', jsonb_build_array(
      jsonb_build_object('type', 'Venue',        'name', 'The Grand Pavilion',    'phone', '+91 98765 43210', 'status', 'booked',     'quote', 20000, 'notes', 'Hall B – ground floor, includes chairs & AV', 'priceRange', '18000-25000'),
      jsonb_build_object('type', 'Caterer',      'name', 'Spice Route Catering',  'phone', '+91 91234 56789', 'status', 'quoted',     'quote', 25000, 'notes', 'Veg buffet for 40 pax, includes live chaat counter', 'priceRange', '20000-30000'),
      jsonb_build_object('type', 'Photographer', 'name', 'ClickStar Studios',     'phone', '+91 87654 32109', 'status', 'to_contact', 'quote', null,  'notes', 'Recommended by Anita – does candid + booth', 'priceRange', '6000-12000')
    ),

    'ideas', jsonb_build_object(
      'menu', jsonb_build_array(
        jsonb_build_object('name', 'Paneer Tikka',        'category', 'Starter',    'isVeg', true, 'isJain', false, 'isVegan', false),
        jsonb_build_object('name', 'Pani Puri Station',    'category', 'Chaat',      'isVeg', true, 'isJain', true,  'isVegan', true),
        jsonb_build_object('name', 'Dal Makhani',          'category', 'Main',       'isVeg', true, 'isJain', false, 'isVegan', false),
        jsonb_build_object('name', 'Veg Biryani',          'category', 'Main',       'isVeg', true, 'isJain', false, 'isVegan', false),
        jsonb_build_object('name', 'Gulab Jamun',          'category', 'Dessert',    'isVeg', true, 'isJain', false, 'isVegan', false),
        jsonb_build_object('name', 'Mango Lassi',          'category', 'Beverage',   'isVeg', true, 'isJain', true,  'isVegan', false),
        jsonb_build_object('name', 'Virgin Mojito',        'category', 'Beverage',   'isVeg', true, 'isJain', true,  'isVegan', true)
      ),
      'games', jsonb_build_array(
        'Bollywood Song Guess',
        'Best Dressed Award',
        'Dialogue Dubbing Challenge',
        'Musical Chairs – Bollywood Remix'
      ),
      'surprise', 'Video montage of childhood photos with 90s Bollywood background score',
      'themes', jsonb_build_array(
        'Bollywood Glam',
        'Retro Bollywood (70s-80s)',
        'Mughal-E-Azam Royal Night'
      ),
      'decor', jsonb_build_array(
        'Sequin gold & red backdrop with movie clapboard',
        'Film reel centrepieces on each table',
        'Red carpet entrance with paparazzi cutouts',
        'Fairy lights + marigold garlands combo'
      ),
      'invitationText', jsonb_build_object(
        'en', 'Lights, Camera, Party! 🎬 You''re invited to Priya''s 30th Birthday Bollywood Bash! Join us for a night of glamour, dance, and unlimited fun.',
        'hi', 'लाइट्स, कैमरा, पार्टी! 🎬 प्रिया की 30वीं बर्थडे बॉलीवुड बैश में आपका स्वागत है! एक शानदार रात का आनंद लें।',
        'te', 'లైట్స్, కెమెరా, పార్టీ! 🎬 ప్రియ 30వ పుట్టినరోజు బాలీవుడ్ బాష్‌కు మీకు ఆహ్వానం! మాతో కలిసి సంబరాలు చేసుకోండి.'
      )
    ),

    'runSheet', jsonb_build_array(
      jsonb_build_object('time', '17:00', 'activity', 'Venue setup & decor',        'vendor', 'The Grand Pavilion', 'contact', '+91 98765 43210', 'notes', 'Coordinate with decorator for backdrop'),
      jsonb_build_object('time', '18:30', 'activity', 'Guests arrive / Red carpet', 'vendor', null,                 'contact', null,               'notes', 'Play Bollywood entrance music'),
      jsonb_build_object('time', '19:00', 'activity', 'Welcome drinks & starters',  'vendor', 'Spice Route Catering', 'contact', '+91 91234 56789', 'notes', 'Chaat counter to open simultaneously'),
      jsonb_build_object('time', '20:00', 'activity', 'Dinner buffet opens',        'vendor', 'Spice Route Catering', 'contact', '+91 91234 56789', 'notes', 'Announce buffet, keep live counters going'),
      jsonb_build_object('time', '20:45', 'activity', 'Cake cutting & surprise',    'vendor', null,                 'contact', null,               'notes', 'Dim lights, play video montage, then cake'),
      jsonb_build_object('time', '21:00', 'activity', 'Dance floor & DJ',           'vendor', 'DJ Rahul',           'contact', '+91 99999 11111', 'notes', 'Start with birthday girl''s favourite song'),
      jsonb_build_object('time', '22:30', 'activity', 'Return gifts & wrap-up',     'vendor', null,                 'contact', null,               'notes', 'Hand out gift bags at exit')
    )
  );

  -- ── Profile ────────────────────────────────────────────────
  insert into public.profiles (id, full_name, avatar_url, preferred_language, preferred_currency)
  values (v_profile_id, 'Priya Sharma', null, 'en', 'INR')
  on conflict (id) do nothing;

  -- ── Event ──────────────────────────────────────────────────
  insert into public.events (id, user_id, title, type, date, guests, budget, city, theme, plan)
  values (
    v_event_id,
    v_profile_id,
    'Priya''s 30th Birthday Bash',
    'birthday',
    v_event_date,
    40,
    80000,
    'Hyderabad',
    'Bollywood Glam',
    v_plan
  )
  on conflict (id) do nothing;

  -- ── Messages ───────────────────────────────────────────────
  insert into public.messages (id, event_id, role, content, created_at)
  values
    (v_msg1_id, v_event_id, 'user',
     'I want to plan a Bollywood-themed 30th birthday party in Hyderabad for about 40 guests. Budget is around ₹80,000. Can you help?',
     now() - interval '2 hours'),
    (v_msg2_id, v_event_id, 'assistant',
     'Absolutely! 🎬 Here''s what I''ve put together for your Bollywood Glam birthday bash:\n\n'
     '• **Venue** – The Grand Pavilion, Hall B (₹20,000)\n'
     '• **Food** – Spice Route Catering veg buffet + live chaat (₹25,000)\n'
     '• **Decor** – Sequin backdrop, film-reel centrepieces, red carpet (₹10,000)\n'
     '• **Photography** – ClickStar Studios candid + booth (₹8,000)\n'
     '• **Entertainment** – DJ with Bollywood playlist (₹5,000)\n'
     '• **Cake** – 3-tier clapboard cake (₹4,000)\n'
     '• **Misc** – Return gifts, props, invites (₹8,000)\n\n'
     'Total: ₹80,000. Shall I adjust anything?',
     now() - interval '1 hour 55 minutes'),
    (v_msg3_id, v_event_id, 'user',
     'This looks great! Can you make the entire menu vegetarian? Also include a Jain option and something vegan too.',
     now() - interval '1 hour 50 minutes')
  on conflict (id) do nothing;

  -- ── Expenses ───────────────────────────────────────────────
  insert into public.expenses (id, event_id, category, amount, note, spent_on)
  values
    (v_exp1_id, v_event_id, 'Venue',    10000, 'Advance payment to The Grand Pavilion', current_date - 5),
    (v_exp2_id, v_event_id, 'Decor',     3500, 'Sequin backdrop fabric & fairy lights',  current_date - 2)
  on conflict (id) do nothing;

  -- ── Tasks ──────────────────────────────────────────────────
  insert into public.tasks (id, event_id, title, due_date, assignee, done, reminder)
  values
    (v_task1_id, v_event_id, 'Finalise venue & pay advance',  v_event_date - 25, 'Priya', true,  false),
    (v_task2_id, v_event_id, 'Send digital invitations',      v_event_date - 20, 'Rahul', true,  false),
    (v_task3_id, v_event_id, 'Confirm catering menu & count', v_event_date - 10, 'Priya', false, true)
  on conflict (id) do nothing;

  -- ── Vendors ────────────────────────────────────────────────
  insert into public.vendors (id, event_id, type, name, phone, status, quote, notes)
  values
    (v_vendor1_id, v_event_id, 'Venue',   'The Grand Pavilion',   '+91 98765 43210', 'booked',     20000, 'Hall B – ground floor, includes chairs & AV'),
    (v_vendor2_id, v_event_id, 'Caterer', 'Spice Route Catering', '+91 91234 56789', 'quoted',     25000, 'Veg buffet for 40 pax, includes live chaat counter')
  on conflict (id) do nothing;

end $$;
