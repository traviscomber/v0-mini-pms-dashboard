# N3uralia Royal Palette Brandbook

**Premium Property Management for Luxury Hospitality**

---

## Design Philosophy

N3uralia embodies **sophistication, elegance, and operational excellence** for boutique hotels and premium vacation rentals. The royal palette balances deep, regal tones with luxurious accents—creating an interface that feels both powerful and refined.

**Core Values:**
- Opulence without excess
- Clarity within complexity
- Trust through elegance
- Efficiency with style

---

## Color Palette

### Primary Colors

#### **Midnight Navy** (Background)
- **Hex**: `#1a1f3a`
- **OKLCH**: `oklch(0.11 0.02 260)`
- **Usage**: Page backgrounds, base surfaces
- **Emotion**: Deep, trustworthy, sophisticated
- **Accessibility**: WCAG AAA contrast on all foregrounds

#### **Rich Gold** (Primary Accent)
- **Hex**: `#d4af37`
- **OKLCH**: `oklch(0.72 0.18 60)`
- **Usage**: Buttons, highlights, CTAs, focus states
- **Emotion**: Luxury, premium, aspirational
- **Accessibility**: Strong contrast on midnight navy and dark surfaces

#### **Emerald Green** (Secondary Accent)
- **Hex**: `#2d7d6f`
- **OKLCH**: `oklch(0.45 0.15 150)`
- **Usage**: Success states, growth indicators, secondary CTAs
- **Emotion**: Balance, harmony, prosperity
- **Accessibility**: Full WCAG AA contrast on all backgrounds

#### **Rose Blush** (Tertiary Accent)
- **Hex**: `#d97f8e`
- **OKLCH**: `oklch(0.62 0.14 20)`
- **Usage**: Alerts, premium highlights, sophisticated details
- **Emotion**: Refinement, attention, elegance
- **Accessibility**: Readable on both light and dark surfaces

### Neutral Colors

#### **Cream White** (Foreground)
- **Hex**: `#f2f0eb`
- **OKLCH**: `oklch(0.95 0.01 0)`
- **Usage**: Primary text, UI elements
- **Contrast Ratio**: 14.2:1 on midnight navy (WCAG AAA)

#### **Card Surface**
- **Hex**: `#252d45`
- **OKLCH**: `oklch(0.16 0.02 260)`
- **Usage**: Cards, panels, elevated surfaces
- **Depth**: 5% lighter than background for subtle elevation

#### **Muted Plum**
- **Hex**: `#3e3b52`
- **OKLCH**: `oklch(0.32 0.05 270)`
- **Usage**: Disabled states, secondary text, subtle backgrounds
- **Emotion**: Calm, restrained, professional

#### **Border**
- **Hex**: `rgba(255, 255, 255, 0.12)`
- **OKLCH**: `oklch(1 0 0 / 12%)`
- **Usage**: Dividers, input borders, subtle separations
- **Subtlety**: Visible but not intrusive

### Semantic Colors

| Intent | Color | OKLCH | Use Case |
|--------|-------|-------|----------|
| **Error** | Deep Red | `oklch(0.55 0.2 25)` | Validation errors, destructive actions |
| **Warning** | Warm Orange | Via chart-4 | Caution states, pending items |
| **Success** | Emerald | `oklch(0.45 0.15 150)` | Confirmations, completed tasks |
| **Info** | Soft Lavender | Via chart-5 | Neutral information, tips |

---

## Typography

### Font Family Stack
```css
--font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

### Hierarchy

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 2.5rem | 700 | 1.2 | Page titles, hero sections |
| **H2** | 1.875rem | 700 | 1.3 | Section headers, major components |
| **H3** | 1.5rem | 600 | 1.4 | Subsection headers, card titles |
| **Body** | 1rem | 400 | 1.6 | Primary content, descriptions |
| **Small** | 0.875rem | 400 | 1.5 | Secondary text, metadata |
| **Mono** | 0.875rem | 500 | 1.5 | Code, technical data, pricing |

### Text Color System

- **Primary Text**: Cream White (`--foreground`)
- **Secondary Text**: Muted Plum with 70% opacity
- **Disabled Text**: Muted Plum with 50% opacity
- **Links**: Rich Gold with underline on hover

---

## Component Styling

### Buttons

#### **Primary Button** (Rich Gold)
```
Background: oklch(0.72 0.18 60)
Text: Midnight Navy (oklch(0.11 0.02 260))
Padding: 0.75rem 1.5rem
Border Radius: 0.625rem
Hover: +5% lightness, shadow elevation
Active: -5% lightness
```

#### **Secondary Button** (Emerald)
```
Background: oklch(0.45 0.15 150)
Text: Cream White
Padding: 0.75rem 1.5rem
Border Radius: 0.625rem
Hover: +8% lightness
Active: -8% lightness
```

#### **Tertiary Button** (Ghost)
```
Background: transparent
Border: 1px solid oklch(1 0 0 / 12%)
Text: Cream White
Hover: oklch(1 0 0 / 8%) background
```

### Cards & Containers

- **Background**: Card Surface (`oklch(0.16 0.02 260)`)
- **Border**: 1px `oklch(1 0 0 / 12%)`
- **Border Radius**: 0.625rem
- **Padding**: 1.5rem
- **Shadow**: 0 4px 12px rgba(0, 0, 0, 0.4)
- **Hover**: +2% background lightness, shadow deepens

### Form Elements

- **Input Background**: `oklch(1 0 0 / 8%)`
- **Input Border**: 1px `oklch(1 0 0 / 12%)`
- **Focus Ring**: 2px Gold (`oklch(0.72 0.18 60)`)
- **Label**: Cream White, 0.875rem, 600 weight
- **Placeholder**: Muted Plum with 50% opacity

### Status Indicators

| Status | Color | Indicator |
|--------|-------|-----------|
| **Active/Ready** | Emerald | Solid dot + text |
| **Pending** | Warm Orange | Pulsing dot + text |
| **Completed** | Emerald | Checkmark + text |
| **Error** | Deep Red | Alert icon + text |
| **Disabled** | Muted Plum | Grayed out |

---

## Spacing System

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

**Rule**: Always use multiples of 4px (rem increments) for alignment and consistency.

---

## Border Radius System

```
sm: 0.375rem (6px)
md: 0.625rem (10px) — default
lg: 0.875rem (14px)
xl: 1.25rem (20px)
2xl: 1.75rem (28px)
```

**All interactive elements default to `md` (0.625rem)**

---

## Elevation & Depth

### Shadow System

| Level | Shadow | Use Case |
|-------|--------|----------|
| **xs** | `0 2px 4px rgba(0,0,0,0.3)` | Subtle hover states |
| **sm** | `0 4px 8px rgba(0,0,0,0.4)` | Cards, dropdowns |
| **md** | `0 8px 16px rgba(0,0,0,0.5)` | Modals, elevated panels |
| **lg** | `0 16px 32px rgba(0,0,0,0.6)` | Alerts, overlays |

---

## Dark Mode Strategy

**N3uralia is dark-first and dark-only** — all designs optimize for the royal palette with midnight navy backgrounds.

- **All tokens use OKLCH color space** for perceptually consistent colors
- **No light mode exists** — focus on premium dark aesthetic
- **Contrast maintained across all interactive states**

---

## Accessibility Guidelines

### Contrast Ratios
- **WCAG AAA (7:1)** on all primary text
- **WCAG AA (4.5:1)** minimum on all secondary UI
- **Gold on Navy**: 7.2:1 (AAA)
- **Emerald on Navy**: 4.8:1 (AA+)

### Color Independence
- Never rely on color alone to convey information
- **Use icons, patterns, or text labels** in addition to color
- Status indicators combine color + symbols

### Focus States
- **Ring**: 2px Gold border
- **Always visible** on all interactive elements
- **Keyboard accessible** for all components

---

## Brand Applications

### Dashboard Header
- Background: Midnight Navy
- Title: Cream White, 2.5rem, 700 weight
- Accent line: Rich Gold, 3px

### Data Visualizations
- **Primary series**: Rich Gold (`oklch(0.72 0.18 60)`)
- **Secondary series**: Emerald (`oklch(0.45 0.15 150)`)
- **Accent series**: Rose Blush (`oklch(0.62 0.14 20)`)
- **Neutral series**: Muted Plum (`oklch(0.32 0.05 270)`)

### Navigation
- **Active tab**: Gold underline, cream text
- **Inactive tab**: Muted text, subtle border
- **Hover**: +5% background lightness

### Alerts
| Type | Background | Border | Icon |
|------|------------|--------|------|
| **Success** | Emerald 20% | Emerald | ✓ |
| **Warning** | Orange 20% | Orange | ⚠ |
| **Error** | Red 20% | Red | ✕ |
| **Info** | Blue 20% | Blue | ℹ |

---

## Dos and Don'ts

### ✅ DO
- Use the gold accent for **primary CTAs** and **high-priority UI**
- Apply emerald for **success states** and **secondary actions**
- Maintain cream white on all dark surfaces for readability
- Use subtle shadows for elevation and depth
- Keep spacing consistent with the 4px grid

### ❌ DON'T
- Don't use pure white or black — use the palette whites/blacks
- Don't mix saturated colors without purpose
- Don't reduce gold or emerald saturation artificially
- Don't use more than **5 colors per component**
- Don't break the 4px spacing grid without deliberate reason
- Don't forget focus states on interactive elements

---

## File References

- **CSS Variables**: `app/globals.css`
- **Theme Configuration**: `@theme inline` block in globals.css
- **Component Library**: All components use CSS custom properties
- **Tailwind Integration**: TailwindCSS v4 with custom tokens

---

## Version History

| Date | Update |
|------|--------|
| June 12, 2026 | Initial Royal Palette launch with OKLCH colors, emerald + gold + rose |
| | Migrated from generic grays to luxury hospitality aesthetic |
| | Added comprehensive accessibility and component guidelines |

---

**N3uralia Premium Property Management**  
*Elegance in Operations*
