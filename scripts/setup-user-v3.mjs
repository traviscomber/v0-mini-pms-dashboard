import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "1dd3419c-a33a-483f-9998-e117c08f313b";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupUser() {
  try {
    // Try to insert profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: USER_ID, full_name: "Juan Carlitos" }, { onConflict: "id" });
    
    if (profileError) {
      if (profileError.message.includes("does not exist")) {
        console.log("❌ Database schema not initialized");
        console.log("\nPlease complete these steps:");
        console.log("1. Go to http://localhost:3000/setup");
        console.log("2. Initialize the database schema");
        console.log("3. Return and try logging in with:");
        console.log("   Email: juan@n3uralia.com");
        console.log("   Password: C4rlit0s");
      } else {
        throw profileError;
      }
      process.exit(0);
    }

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

    console.log("✓ User juan@n3uralia.com is ready to use!");
    console.log("\nLogin credentials:");
    console.log("  Email: juan@n3uralia.com");
    console.log("  Password: C4rlit0s");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setupUser();
