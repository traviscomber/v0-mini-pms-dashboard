-- Create the bootstrap_workspace SQL function
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.bootstrap_workspace(
  organization_name TEXT,
  organization_slug TEXT,
  property_name TEXT,
  property_slug TEXT,
  property_currency TEXT,
  property_timezone TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  org_id UUID;
  prop_id UUID;
  current_user_id UUID;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Create organization
  INSERT INTO organizations (id, name, slug)
  VALUES (gen_random_uuid(), organization_name, organization_slug)
  RETURNING id INTO org_id;

  -- Create first property
  INSERT INTO properties (id, organization_id, name, slug, currency, timezone)
  VALUES (gen_random_uuid(), org_id, property_name, property_slug, property_currency, property_timezone)
  RETURNING id INTO prop_id;

  -- Create owner membership (role = owner)
  INSERT INTO memberships (id, user_id, organization_id, role, is_default)
  VALUES (gen_random_uuid(), current_user_id, org_id, 'owner', TRUE)
  ON CONFLICT DO NOTHING;

  -- Create user profile
  INSERT INTO profiles (id, full_name)
  VALUES (current_user_id, '')
  ON CONFLICT DO NOTHING;

  RETURN json_build_object(
    'organization_id', org_id,
    'property_id', prop_id,
    'success', TRUE
  );
END;
$$;
