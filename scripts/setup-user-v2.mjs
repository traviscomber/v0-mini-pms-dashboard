import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "1dd3419c-a33a-483f-9998-e117c08f313b";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupUser() {
  try {
    // Check if tables exist
    console.log("Checking schema...");
    const { data: tables } = await supabase.rpc("get_tables", { schema: "public" }).catch(() => ({ data: [] }));

    // Just try to insert - if table doesn't exist, setup is needed
    console.log("Creating profile...");
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: USER_ID, full_name: "Juan Carlitos" }, { onConflict: "id" });
    
    if (profileError?.message?.includes("does not exist")) {
      console.log("❌ Profiles table not found.");
      console.log("The database schema needs to be initialized via the /setup page.");
      console.log("Please:");
      console.log("  1. Go to http://localhost:3000/setup");
      console.log("  2. Complete the schema setup");
      console.log("  3. Then login with juan@n3uralia.com / C4rlit0s");
      process.exit(1);
    }

    if (profileError) throw profileError;

    // Create org
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: "N3uralia", slug: "n3uralia" })
      .select()
      .single();
    
    if (orgError) throw orgError;

    // Create membership
    const { error: membershipError } = await supabase
      .from("memberships")
      .insert({ user_id: USER_ID, organization_id: org.id, role: "admin", is_default: true });
    
    if (membershipError) throw membershipError;

    console.log("✓ User setup complete!");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

setupUser();
