import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function applyMigration() {
  try {
    console.log("Reading migration file...");
    const sql = fs.readFileSync(
      "/vercel/share/v0-project/supabase/migrations/202606110001_sprint1_foundation.sql",
      "utf-8"
    );

    console.log("Executing SQL migration...");
    const { error } = await supabase.rpc("exec", { p_sql: sql });

    if (error) {
      if (!error.message.includes("does not exist")) {
        throw error;
      }
    }

    console.log("✓ Migration applied successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

applyMigration();
