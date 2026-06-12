# N3uralia PMS — Onboarding Wizard Guide

**Status**: ✅ Live and Ready to Use  
**Date**: June 12, 2026  
**Type**: 4-Step Interactive Setup Flow

---

## Overview

The **Onboarding Wizard** is a full-screen animated modal that appears automatically when a user logs in and has **no rooms configured yet** in their property. It walks them through 4 steps in ~2 minutes to go from empty dashboard to fully operational PMS with their first set of rooms.

---

## When Does It Show?

The wizard displays when ALL of these conditions are true:

```javascript
!isLoading &&          // Data has finished fetching
rooms.length === 0 &&  // No rooms exist in Supabase
!liveError             // No API errors occurred
```

Once the user completes the wizard and rooms are added, the wizard **never shows again** — even if they log out and back in, because rooms now exist.

---

## The 4 Steps

### Step 0: Welcome 🎉

**What the user sees:**
- Full-screen modal overlay (dark luxury theme)
- Pulsing iridescent magenta icon (animated pulse effect)
- Large heading: "Welcome to N3uralia PMS"
- 3-line description of the onboarding process:
  1. "Confirm your property details"
  2. "Add your guest rooms"
  3. "Start taking bookings"
- "Get Started" CTA button (magenta)

**What happens:**
- Introductory moment — explains what the user is about to do
- No data collection, just context-setting

### Step 1: Property ✓

**What the user sees:**
- Heading: "Your Property"
- Read-only card showing:
  - Property name (fetched from `/api/viewer`)
  - Property ID (immutable)
  - Created date
  - "Next" button to proceed
- Explainer: "This is your active property. Edit property details in Settings."

**What happens:**
- Confirms the active property — pulled from the current user's authenticated workspace
- Properties are immutable at this step (they can edit in Settings later)
- Ensures the user is adding rooms to the correct property

### Step 2: Rooms 🛏️

**What the user sees:**
- Heading: "Your Guest Rooms"
- Editable table with rows for each room:
  - **Name** (text input, e.g., "Room 101")
  - **Type** (dropdown: "Single", "Double", "Suite", "Studio")
  - **Capacity** (number, 1–8 guests)
  - **Price/Night** (currency in USD)
  - Delete button (❌) per row
- "Add Room" button below table
- "Save & Continue" button (saves all rooms to Supabase)

**What happens:**
- User can:
  - Add up to 10 rooms in the wizard (pre-populate 4 as defaults for a boutique property)
  - Edit name, type, capacity, price for each
  - Remove any room row they don't want
  - Click "Save & Continue" → `POST /api/pms/rooms` is called
  - API validates input and creates `units` rows in Supabase
- If save fails → error toast, user can retry
- If save succeeds → advance to Step 3

**Default rooms pre-filled (for boutique 1–10 room property):**
```
Room 101 | Double  | 2 guests | $120/night
Room 102 | Single  | 1 guest  | $85/night
Room 103 | Suite   | 4 guests | $180/night
Room 104 | Studio  | 1 guest  | $75/night
```

User can delete any of these and add their own.

### Step 3: All Set 🎊

**What the user sees:**
- Heading: "All Set!"
- Animated SVG ring that **draws itself** in real-time (1.2s animation)
- Centered white checkmark that **pops in** after ring completes (0.3s animation)
- Subheading: "Your property is ready to go"
- "Open Dashboard" CTA button (magenta)

**What happens:**
- Purely celebratory UX moment — reinforces success
- Animations convey completion and confidence
- Click "Open Dashboard" → calls `refresh()` (hydrate from `/api/pms`) → wizard disappears → real dashboard appears with new rooms visible

---

## Implementation Details

### Files

```
app/pms/components/OnboardingWizard.tsx    — Wizard UI (604 lines)
app/api/pms/rooms/route.ts                — POST to create units
app/api/viewer/route.ts                   — GET active property + name
app/pms/PMSApp.tsx                        — Render condition + refresh integration
```

### Data Flow

```
User Logs In
    ↓
PMSApp hydrates: useLivePms() → /api/pms
    ↓
rooms.length === 0?
    ├─ YES → Show OnboardingWizard
    │         Fetch /api/viewer for property name
    │         User fills Steps 0→1→2→3
    │         On complete: POST /api/pms/rooms
    │         Then: refresh() → /api/pms (now rooms > 0)
    │         Wizard auto-dismisses
    │
    └─ NO → Skip wizard, show live dashboard
```

### Styling

- **Color Palette**: Luxury gem tokens (primary = magenta, accent = sapphire, bg = ultra-deep black)
- **Animations**:
  - Icon pulse: `opacity: 0.6 → 1` (1.5s infinite)
  - Ring draw: SVG `stroke-dasharray` animation (1.2s)
  - Checkmark pop: `scale: 0.5 → 1.2 → 1` (0.3s bounce)
  - Step transitions: fade + slide-up (0.3s)

---

## Testing the Wizard

To see the wizard in action, you need a user account with **zero rooms**:

### Option 1: Fresh Account
1. Create a new user via `/auth/login` signup
2. Complete `/setup` (property bootstrap)
3. You will see the wizard automatically

### Option 2: Delete Rooms (Manual Test)
1. Log in as any user
2. Open browser DevTools → Network
3. Use Supabase dashboard to delete all rows from `units` table for your property
4. Refresh the page
5. Wizard appears

---

## Success Metrics

✅ **Onboarding completion rate** — Track how many new users click "Open Dashboard" on Step 3  
✅ **Time to first room** — Measure from Step 0 → Step 3 completion  
✅ **Room accuracy** — Verify saved rooms match user input (name, type, capacity, price)  
✅ **Zero errors** — Monitor API `/api/pms/rooms` POST failures in logs  

---

## Future Enhancements

- [ ] Allow bulk import from CSV
- [ ] Photo upload per room (Step 2 extension)
- [ ] Room amenities multi-select (Step 2 extension)
- [ ] First guest booking template (Step 4 optional)
- [ ] Email receipt of room setup (post-Step 3)

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Wizard UI | ✅ Complete | 604-line component, all animations smooth |
| `/api/pms/rooms` POST | ✅ Complete | Validates input, creates units rows |
| `/api/viewer` GET | ✅ Complete | Returns active property + name |
| PMSApp integration | ✅ Complete | Render condition + refresh wired |
| Build | ✅ Zero errors | All routes registered |
| Browser test | ✅ Verified | Dashboard loads, no console errors |

**Production Ready**: YES — Deploy with confidence

