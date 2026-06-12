import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "1dd3419c-a33a-483f-9998-e117c08f313b";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setup() {
  try {
    // 1. Create profile
    console.log("1. Creating profile...");
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: USER_ID, full_name: "Juan Carlitos", email: "juan@n3uralia.com" }, { onConflict: "id" });
    
    if (profileError && !profileError.message.includes("does not exist")) {
      throw profileError;
    }

    // 2. Create organization
    console.log("2. Creating organization...");
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: "N3uralia", slug: "n3uralia" })
      .select()
      .single();
    
    if (orgError) throw orgError;

    // 3. Create membership
    console.log("3. Creating membership...");
    const { error: membershipError } = await supabase
      .from("memberships")
      .insert({
        user_id: USER_ID,
        organization_id: org.id,
        role: "admin",
        is_default: true,
      });
    
    if (membershipError) throw membershipError;

    // 4. Create property
    console.log("4. Creating property...");
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        organization_id: org.id,
        name: "Beachfront Resort",
        description: "Luxury oceanfront property",
        address: "123 Beach Ave",
        city: "Miami",
        state: "FL",
        country: "USA",
        postal_code: "33139",
        check_in_time: "15:00",
        check_out_time: "11:00",
        total_rooms: 48,
      })
      .select()
      .single();
    
    if (propertyError) throw propertyError;

    // 5. Create rooms
    console.log("5. Creating rooms...");
    const rooms = Array.from({ length: 48 }, (_, i) => ({
      property_id: property.id,
      room_number: `${String.fromCharCode(65 + Math.floor(i / 12))}${String(i % 12 + 1).padStart(2, "0")}`,
      room_type: i < 24 ? "standard" : "deluxe",
      capacity: i < 24 ? 2 : 4,
      price_per_night: i < 24 ? 150 : 250,
    }));

    const { error: roomsError } = await supabase
      .from("rooms")
      .insert(rooms);
    
    if (roomsError) throw roomsError;

    console.log("\n✓ Setup complete!");
    console.log("\nJuan can now login:");
    console.log("  Email: juan@n3uralia.com");
    console.log("  Password: C4rlit0s");
    console.log("  URL: http://localhost:3000");
  } catch (err) {
    if (err.message?.includes("does not exist")) {
      console.log("⚠ Database schema not initialized.");
      console.log("Visit http://localhost:3000/setup to initialize first.");
    } else {
      console.error("❌ Error:", err.message);
    }
    process.exit(1);
  }
}

setup();
