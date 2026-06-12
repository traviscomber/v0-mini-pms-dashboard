import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase.auth.admin.updateUserById(
  "1dd3419c-a33a-483f-9998-e117c08f313b",
  { password: "C4rlit0s", email_confirm: true }
);

if (error) console.error("Error:", error.message);
else console.log("Password reset OK for:", data.user.email);
