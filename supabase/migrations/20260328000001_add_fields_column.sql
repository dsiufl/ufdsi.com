-- Add fields column to forms table (replaces type + settings)
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS fields jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Drop old columns that are no longer used
ALTER TABLE public.forms DROP COLUMN IF EXISTS type;
ALTER TABLE public.forms DROP COLUMN IF EXISTS settings;
