# Bootstrap Workspace Function Setup

## Problem
The `bootstrap_workspace()` SQL function is missing from the Supabase database, blocking all new users from creating their first workspace.

**Error when trying to complete setup:**
```
Could not find the function public.bootstrap_workspace(...) in the schema cache
```

## Solution: Manual Setup Required

The function must be created directly in Supabase SQL Editor. Here's how:

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query** button

### Step 2: Copy & Run the Function SQL
Copy the entire SQL from `database/migrations/003_bootstrap_workspace_function.sql` and paste it into the SQL Editor.

```sql
CREATE OR REPLACE FUNCTION public.bootstrap_workspace(
  organization_name TEXT,
  organization_slug TEXT,
  property_name TEXT,
  property_slug TEXT,
  property_currency TEXT,
  property_timezone TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  org_id UUID;
  prop_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO organizations (id, name, slug)
  VALUES (gen_random_uuid(), organization_name, organization_slug)
  RETURNING id INTO org_id;

  INSERT INTO properties (id, organization_id, name, slug, currency, timezone)
  VALUES (gen_random_uuid(), org_id, property_name, property_slug, property_currency, property_timezone)
  RETURNING id INTO prop_id;

  INSERT INTO memberships (id, user_id, organization_id, role, is_default)
  VALUES (gen_random_uuid(), current_user_id, org_id, 'owner', TRUE)
  ON CONFLICT DO NOTHING;

  INSERT INTO profiles (id, full_name)
  VALUES (current_user_id, '')
  ON CONFLICT DO NOTHING;

  RETURN json_build_object(
    'organization_id', org_id,
    'property_id', prop_id,
    'success', TRUE
  );
END;
$$;
```

### Step 3: Click "Run" Button
The query should execute successfully with message: "Success. No rows returned."

### Step 4: Test the Setup
1. Go to the PMS setup page
2. Enter your organization and property details
3. Click "Create workspace and continue"
4. Should successfully create your workspace and redirect to onboarding

## What This Function Does

When a new user creates their workspace, this function:

1. **Creates Organization**: Stores the company/brand name
2. **Creates Property**: Creates the first hotel/property
3. **Creates Membership**: Links the user as owner of the organization
4. **Creates Profile**: Initializes user profile record
5. **Returns IDs**: Provides organization_id and property_id for redirect

## After Setup

Once this function is created:
- ✅ All new users can complete workspace setup
- ✅ Onboarding wizard becomes accessible
- ✅ Users can add rooms and start using the PMS
- ✅ Multi-property support enabled

## Troubleshooting

**Error: "Column 'timezone' does not exist"**
- Check if your `properties` table schema matches expected columns
- Verify: id, organization_id, name, slug, timezone, currency

**Error: "Column 'role' does not exist in memberships"**
- Verify memberships table has a `role` column with string type

**Error: "Table 'organizations' does not exist"**
- Ensure database migrations have been run
- Check Supabase database schema

## Files

- **Migration SQL**: `database/migrations/003_bootstrap_workspace_function.sql`
- **Setup Script**: `scripts/create-bootstrap-workspace-function.mjs`
- **Documentation**: This file

