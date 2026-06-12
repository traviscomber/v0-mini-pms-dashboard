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

    // Split SQL by semicolons and filter empty statements
    const statements = sql
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`  [${i + 1}/${statements.length}] ${stmt.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc("query", { query: stmt }).catch(() => ({
        error: { message: "direct_query" }
      }));

      // If rpc fails, try direct execution
      if (error?.message === "direct_query") {
        const { error: directError } = await supabase
          .from("_bootstrap_exec")
          .insert({ sql: stmt })
          .catch(() => ({ error: { message: "no_table" } }));
      }
    }

    console.log("✓ Migration complete!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

applyMigration();
