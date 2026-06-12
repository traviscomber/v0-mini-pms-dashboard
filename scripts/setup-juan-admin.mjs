import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "1dd3419c-a33a-483f-9998-e117c08f313b";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupJuanAdmin() {
  try {
    console.log("Setting up juan@n3uralia.com as admin...\n");

    // 1. Create profile
    console.log("1. Creating profile...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: USER_ID,
          email: "juan@n3uralia.com",
          full_name: "Juan Carlitos",
        },
        { onConflict: "id" }
      )
      .select();

    if (profileError) throw profileError;
    console.log("   ✓ Profile created:", profile[0].full_name);

    // 2. Create or get organization
    console.log("2. Creating organization...");
    let orgId;
    
    const { data: existingOrg, error: checkError } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", "n3uralia");

    if (existingOrg && existingOrg.length > 0) {
      orgId = existingOrg[0].id;
      console.log("   ✓ Organization already exists:", orgId);
    } else {
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: "N3uralia",
          slug: "n3uralia",
          created_by: USER_ID,
        })
        .select()
        .single();

      if (orgError) throw orgError;
      orgId = org.id;
      console.log("   ✓ Organization created:", org.name);
    }

    // 3. Create membership with admin role
    console.log("3. Creating admin membership...");
    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .upsert(
        {
          organization_id: orgId,
          user_id: USER_ID,
          role: "admin",
          is_default: true,
        },
        { onConflict: "organization_id,user_id" }
      )
      .select();

    if (membershipError) throw membershipError;
    console.log("   ✓ Admin role assigned");

    // 4. Update profile default organization
    console.log("4. Setting default organization...");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ default_organization_id: orgId })
      .eq("id", USER_ID);

    if (updateError) throw updateError;
    console.log("   ✓ Default organization set");

    console.log("\n✅ Setup complete! Juan is ready as admin.\n");
    console.log("Login credentials:");
    console.log("  Email: juan@n3uralia.com");
    console.log("  Password: C4rlit0s");
    console.log("  Role: admin");
    console.log("  Organization: N3uralia");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setupJuanAdmin();
