import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: "juan@n3uralia.com",
      password: "C4rlit0s",
      email_confirm: true,
    });

    if (error) {
      console.error("Error creating user:", error);
      process.exit(1);
    }

    console.log("✓ User created successfully");
    console.log("  User ID:", data.user.id);
    console.log("  Email:", data.user.email);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createUser();
