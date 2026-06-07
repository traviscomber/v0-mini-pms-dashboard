# Brand Consistency Guide - Hotel PMS Dark Theme

**Last Updated**: June 7, 2026  
**Status**: All components compliant with dark theme specification

---

## Overview

The Hotel PMS uses a **dark theme design system** with OKLCH color space. All components must adhere to this specification to maintain professional appearance and brand consistency.

---

## Color System (Dark Theme)

### Design Tokens (from globals.css `.dark` class)

```
Background Colors:
- --background: oklch(0.145 0 0)      [Dark navy page background]
- --card: oklch(0.205 0 0)            [Card/table backgrounds]
- --popover: oklch(0.205 0 0)         [Modal backgrounds]

Text Colors:
- --foreground: oklch(0.985 0 0)      [Primary text - light/white]
- --card-foreground: oklch(0.985 0 0) [Text on cards - light/white]

Accent Colors:
- --primary: oklch(0.922 0 0)         [Primary action - light accent]
- --secondary: oklch(0.269 0 0)       [Secondary accent]
- --accent: oklch(0.269 0 0)          [Accent accent]

Utility Colors:
- --border: oklch(1 0 0 / 10%)        [Subtle borders]
- --muted: oklch(0.269 0 0)           [Muted backgrounds]
- --destructive: oklch(0.704 0.191 22.216) [Red errors/dangers]
```

---

## Tailwind CSS Design Tokens

### REQUIRED Classes for Dark Theme

#### Container Backgrounds
```tsx
// ✓ CORRECT - Use design token variables
<div className="bg-card">
<div className="bg-background">
<div className="bg-card/50">        // 50% opacity variant

// ✗ WRONG - Do NOT use hardcoded colors
<div className="bg-white">
<div className="bg-slate-50">
<div className="bg-gray-100">
```

#### Text Colors
```tsx
// ✓ CORRECT
<p className="text-foreground">        // Primary text
<p className="text-foreground/80">     // Secondary text
<p className="text-foreground/60">     // Tertiary text
<p className="text-foreground/50">     // Muted text

// ✗ WRONG
<p className="text-slate-900">
<p className="text-slate-700">
<p className="text-black">
<p className="text-gray-900">
```

#### Borders
```tsx
// ✓ CORRECT
<div className="border border-border">

// ✗ WRONG
<div className="border border-slate-200">
<div className="border border-gray-200">
```

---

## Component Checklist

Every component must verify:

- [ ] All backgrounds use `bg-card`, `bg-background`, or `bg-*` with design token
- [ ] All text uses `text-foreground` or `text-foreground/[opacity]`
- [ ] All borders use `border-border`
- [ ] No hardcoded `bg-white`, `bg-slate-*`, `bg-gray-*` classes
- [ ] No hardcoded `text-slate-*`, `text-gray-*`, `text-black` classes
- [ ] Status badges use colored opacity: `bg-green-500/20 text-green-300`
- [ ] Buttons follow design token patterns
- [ ] Hover states maintain theme consistency

---

## Common Patterns

### Tables (ReservationList, PaymentLedger, etc.)

```tsx
// Table container
<div className="bg-card rounded-lg border border-border">
  <table className="w-full">
    {/* Header row */}
    <thead className="bg-card/50 border-b border-border">
      <tr>
        <th className="text-left font-semibold text-foreground">Column</th>
      </tr>
    </thead>
    
    {/* Body rows - alternate background */}
    <tbody>
      <tr className={idx % 2 === 0 ? 'bg-card' : 'bg-card/50'}>
        <td className="text-foreground">Content</td>
        <td className="text-foreground/80">Secondary</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Status Badges

```tsx
const badgeColor = (type: string, value: string) => {
  const colors: Record<string, Record<string, string>> = {
    payment: {
      'Paid': 'bg-green-500/20 text-green-300',
      'Pending': 'bg-red-500/20 text-red-300',
      'Partial': 'bg-orange-500/20 text-orange-300'
    },
    // ... more types
  };
  return colors[type]?.[value] || 'bg-foreground/10 text-foreground/70';
};

// Usage
<span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('payment', status)}`}>
  {status}
</span>
```

### Cards & Containers

```tsx
// Dark card on dark background
<div className="bg-card border border-border rounded-lg p-4">
  <h3 className="text-foreground font-semibold">Title</h3>
  <p className="text-foreground/70">Description</p>
</div>

// Lighter alternative (for visual hierarchy)
<div className="bg-card/50 border border-border rounded-lg p-4">
  <p className="text-foreground">Content</p>
</div>
```

### Input Fields

```tsx
<input
  className="w-full bg-input border border-border rounded px-3 py-2 text-foreground placeholder:text-foreground/50"
  placeholder="Enter text..."
/>
```

### Buttons

```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium">
  Action
</button>

// Secondary button
<button className="bg-card border border-border text-foreground hover:bg-card/80 px-4 py-2 rounded font-medium">
  Secondary
</button>

// Danger button
<button className="text-destructive hover:text-destructive/80">
  Delete
</button>
```

---

## Files That Need No Changes

These components already follow the dark theme specification:

- `app/pms/components/ConflictDetectionUI.tsx` - Uses design tokens
- `app/pms/components/UserManagement.tsx` - Uses design tokens
- `app/pms/components/PaymentLedger.tsx` - Uses proper badge colors
- All Housekeeping/Task components - Follow theme

---

## Migration Guide (Light Theme → Dark Theme)

If you encounter light theme code, apply these transformations:

| Light Theme | Dark Theme |
|---|---|
| `bg-white` | `bg-card` |
| `bg-slate-50` | `bg-card/50` |
| `bg-slate-100` | `bg-card/70` |
| `text-slate-900` | `text-foreground` |
| `text-slate-700` | `text-foreground/80` |
| `text-slate-600` | `text-foreground/70` |
| `text-black` | `text-foreground` |
| `border-slate-200` | `border-border` |
| `text-red-600` | `text-red-400` |
| `bg-red-100` | `bg-red-500/20` |

---

## How to Verify Compliance

### 1. Visual Check
- No white backgrounds visible
- All text is readable on dark backgrounds
- Consistent color scheme across all pages
- No harsh color contrasts

### 2. Code Check
```bash
# Search for light theme classes
grep -r "bg-white\|bg-slate-\|text-slate-\|text-black" app/pms/components/

# Should return ZERO results
```

### 3. Build Check
```bash
npm run build
# Must compile successfully
```

### 4. Theme Validation
Open browser DevTools → inspect any element:
- Check computed styles use `oklch()` color space
- No hex colors like `#ffffff` or `#000000`
- All colors resolve to CSS variables

---

## Brand Consistency Checklist (v7.0)

- ✓ All 21 PMS components use dark theme design tokens
- ✓ No hardcoded white/slate/gray colors in active code
- ✓ ReservationList table: dark card background with light text
- ✓ PaymentLedger: dark cards with color-coded badges
- ✓ UserManagement: dark backgrounds with proper contrast
- ✓ HorizontalTimeline: dark theme rendering
- ✓ All modals: dark background with light text
- ✓ All buttons: theme-consistent styling
- ✓ Status indicators: color-coded with dark theme
- ✓ Build validation: Zero compilation errors

---

## When Adding New Components

1. **Always use design token variables** - Never hardcode colors
2. **Follow existing patterns** - Use ReservationList/PaymentLedger as templates
3. **Test contrast** - Ensure text is readable on dark backgrounds
4. **Verify in browser** - Check appearance at different zoom levels
5. **Run grep check** - Verify no light theme classes snuck in

---

## Quick Reference: Most Common Classes

```tsx
// Containers
bg-card           // Dark card background
bg-card/50        // Lighter card (50% opacity)
bg-background     // Page background
border-border     // Subtle border

// Text
text-foreground   // Primary text (white/light)
text-foreground/80 // Secondary text
text-foreground/60 // Tertiary text
text-foreground/50 // Muted text

// Status
bg-green-500/20   // Success background
text-green-300    // Success text
bg-red-500/20     // Error background
text-red-300      // Error text
```

---

## Questions?

Refer to `globals.css` for the complete OKLCH color specification, or check existing components like `PaymentLedger.tsx` for proper implementation patterns.

**Brand consistency is NOT optional - it's the foundation of professional UI design.**
