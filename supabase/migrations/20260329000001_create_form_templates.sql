-- Create form_templates table
CREATE TABLE IF NOT EXISTS public.form_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  icon        text NOT NULL DEFAULT 'FileText',
  category    text NOT NULL DEFAULT 'general',
  fields      jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_default  boolean NOT NULL DEFAULT false,
  created_by  uuid REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS form_templates_category_idx ON public.form_templates(category);

-- Seed the 4 default templates
INSERT INTO public.form_templates (name, description, icon, category, fields, is_default) VALUES
(
  'Blank Form',
  'Start from scratch with an empty canvas',
  'FileText',
  'general',
  '[]'::jsonb,
  true
),
(
  'Bus Trip Registration',
  'Pre-configured for transportation events with emergency contacts',
  'Bus',
  'events',
  '[
    {"id":"header-1","type":"section-header","label":"Personal Information","width":"full"},
    {"id":"field-1","type":"short-text","label":"First Name","placeholder":"Enter your first name","required":true,"width":"half"},
    {"id":"field-2","type":"short-text","label":"Last Name","placeholder":"Enter your last name","required":true,"width":"half"},
    {"id":"field-3","type":"email","label":"Email Address","placeholder":"you@ufl.edu","required":true,"width":"full","validation":{"emailDomain":"ufl.edu"}},
    {"id":"field-4","type":"phone","label":"Phone Number","placeholder":"(123) 456-7890","required":true,"width":"half"},
    {"id":"field-5","type":"uf-id","label":"UF ID","placeholder":"12345678","required":true,"width":"half"},
    {"id":"header-2","type":"section-header","label":"Trip Details","width":"full"},
    {"id":"field-6","type":"radio","label":"T-Shirt Size","required":true,"width":"full","options":["XS","S","M","L","XL","2XL"]},
    {"id":"field-7","type":"chip-select","label":"Dietary Restrictions","width":"full","options":["Vegetarian","Vegan","Gluten-Free","Dairy-Free","Nut Allergy","None"]},
    {"id":"field-8","type":"emergency-contact","label":"Emergency Contact","required":true,"width":"full"},
    {"id":"waiver-1","type":"waiver","label":"Liability Waiver","required":true,"width":"full","content":"I understand that participation in this trip is voluntary and involves travel by bus. I acknowledge and accept any risks associated with this activity. I agree to follow all instructions from trip organizers and release UF DSI from any liability."}
  ]'::jsonb,
  true
),
(
  'Symposium Registration',
  'Perfect for conferences, talks, and research showcases',
  'Presentation',
  'events',
  '[
    {"id":"info-1","type":"info-banner","label":"","width":"full","content":"Join us for the DSI Spring Symposium featuring keynote speakers, research presentations, and networking opportunities with industry professionals."},
    {"id":"header-1","type":"section-header","label":"Attendee Information","width":"full"},
    {"id":"field-1","type":"short-text","label":"First Name","placeholder":"Enter your first name","required":true,"width":"half"},
    {"id":"field-2","type":"short-text","label":"Last Name","placeholder":"Enter your last name","required":true,"width":"half"},
    {"id":"field-3","type":"email","label":"Email Address","placeholder":"you@ufl.edu","required":true,"width":"full"},
    {"id":"field-4","type":"dropdown","label":"Affiliation","placeholder":"Select your affiliation","required":true,"width":"half","options":["Undergraduate Student","Graduate Student","Faculty","Industry Professional","Other"]},
    {"id":"field-5","type":"short-text","label":"Organization","placeholder":"University or Company","width":"half"},
    {"id":"page-1","type":"page-break","label":"Page Break","width":"full"},
    {"id":"header-2","type":"section-header","label":"Session Preferences","width":"full"},
    {"id":"field-6","type":"checkbox-group","label":"Which sessions are you interested in?","width":"full","options":["Machine Learning Applications","Natural Language Processing","Computer Vision","Data Visualization","Ethics in AI","Career Panel"]},
    {"id":"field-7","type":"yes-no","label":"Will you stay for the networking reception?","required":true,"width":"full"},
    {"id":"field-8","type":"long-text","label":"What topics would you like to see covered in future events?","placeholder":"Share your suggestions...","width":"full"}
  ]'::jsonb,
  true
),
(
  'Simple Event RSVP',
  'Quick sign-up form for general meetings and social events',
  'CalendarCheck',
  'events',
  '[
    {"id":"field-1","type":"short-text","label":"First Name","placeholder":"Enter your first name","required":true,"width":"half"},
    {"id":"field-2","type":"short-text","label":"Last Name","placeholder":"Enter your last name","required":true,"width":"half"},
    {"id":"field-3","type":"email","label":"Email Address","placeholder":"you@ufl.edu","required":true,"width":"full","validation":{"emailDomain":"ufl.edu"}},
    {"id":"field-4","type":"yes-no","label":"Will you attend?","required":true,"width":"full"},
    {"id":"field-5","type":"number","label":"How many guests will you bring?","placeholder":"0","width":"full","validation":{"min":0,"max":3}}
  ]'::jsonb,
  true
);
