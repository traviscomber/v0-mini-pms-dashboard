import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const bootstrapFunctionSQL = `
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
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO organizations (id, name, slug)
  VALUES (gen_random_uuid(), organization_name, organization_slug)
  RETURNING id INTO org_id;

  INSERT INTO properties (id, organization_id, name, slug, currency, timezone)
  VALUES (gen_random_uuid(), org_id, property_name, property_slug, property_currency, property_timezone)
  RETURNING id INTO prop_id;

  INSERT INTO memberships (id, user_id, organization_id, role, is_default)
  VALUES (gen_random_uuid(), current_user_id, org_id, 'owner', TRUE)
  ON CONFLICT DO NOTHING;

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
`;

async function createFunction() {
  console.log("📝 Creating bootstrap_workspace() SQL function...");
  
  try {
    // Try to use Supabase SQL endpoint
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: bootstrapFunctionSQL,
    });

    if (error) {
      if (error.message?.includes("exec_sql")) {
        console.error("❌ Cannot create function - exec_sql RPC not available");
        console.log("\n📖 To create this function manually:");
        console.log("1. Go to Supabase dashboard");
        console.log("2. SQL Editor → New query");
        console.log("3. Copy and paste the SQL below:\n");
        console.log(bootstrapFunctionSQL);
        process.exit(1);
      }
      throw error;
    }

    console.log("✅ bootstrap_workspace() function created successfully");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
    console.log("\n📖 To create this function manually:");
    console.log("1. Go to Supabase dashboard");
    console.log("2. SQL Editor → New query");
    console.log("3. Copy and paste the SQL below:\n");
    console.log(bootstrapFunctionSQL);
    process.exit(1);
  }
}

createFunction();
