import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("[v0] Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createUsers() {
  console.log("[v0] Starting user creation for Blackswan...");

  // Create regular user for Blackswan
  const user1Email = "user@blackswan.org";
  const user1Password = "blackswan2026";

  // Create admin user for Blackswan
  const adminEmail = "admin@blackswan.org";
  const adminPassword = "blackswn2026";

  try {
    // Create regular user
    console.log(`[v0] Creating user: ${user1Email}`);
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: user1Email,
      password: user1Password,
      email_confirm: true,
      user_metadata: {
        full_name: "Blackswan User",
      },
    });

    if (userError) {
      console.error(`[v0] Error creating user ${user1Email}:`, userError.message);
    } else {
      console.log(`[v0] User created: ${userData?.user?.id} (${user1Email})`);
    }

    // Create admin user
    console.log(`[v0] Creating admin user: ${adminEmail}`);
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Blackswan Admin",
      },
    });

    if (adminError) {
      console.error(`[v0] Error creating admin ${adminEmail}:`, adminError.message);
    } else {
      console.log(`[v0] Admin user created: ${adminData?.user?.id} (${adminEmail})`);
    }

    console.log("[v0] User creation complete!");
    console.log("[v0] Test credentials:");
    console.log(`  Regular user: ${user1Email} / ${user1Password}`);
    console.log(`  Admin user: ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    console.error("[v0] Unexpected error:", err);
    process.exit(1);
  }
}

createUsers();
