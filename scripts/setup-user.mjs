import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "1dd3419c-a33a-483f-9998-e117c08f313b"; // juan@n3uralia.com

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupUser() {
  try {
    // 1. Create profile
    console.log("Creating profile...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: USER_ID, full_name: "Juan Carlitos" }, { onConflict: "id" })
      .select();
    
    if (profileError) throw profileError;
    console.log("Profile created:", profile);

    // 2. Create organization
    console.log("Creating organization...");
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: "N3uralia", slug: "n3uralia" })
      .select()
      .single();
    
    if (orgError) throw orgError;
    console.log("Organization created:", org.id);

    // 3. Create membership
    console.log("Creating membership...");
    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .insert({
        user_id: USER_ID,
        organization_id: org.id,
        role: "admin",
        is_default: true,
      })
      .select();
    
    if (membershipError) throw membershipError;
    console.log("Membership created");

    console.log("\n✓ User setup complete!");
    console.log("  User can now login and access the dashboard");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

setupUser();
