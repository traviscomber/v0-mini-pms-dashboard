# Brandbook Compliance Fix Strategy

## Status
- **Audit Date**: June 13, 2026
- **Branch**: v0/travis-2540-e5d85c8d
- **Compliance Level**: 65% (needs immediate fixes)

## Critical Issues Found

### 1. Hardcoded Status Colors (20+ files)
- `text-red-*`, `bg-red-*` → Should use `destructive` token
- `text-green-*`, `bg-green-*` → Should use `accent` or new `success` token
- `text-yellow-*`, `bg-yellow-*` → Should use `secondary` token
- `text-blue-*`, `bg-blue-*` → Should use `primary` token

### 2. Gradient Violations
- `from-green-500/10 to-green-600/10` → Use `from-accent/10 to-primary/10`
- `from-primary via-accent to-emerald-400` → Use `from-primary via-accent to-secondary`

## Solution: Add Success Token

Add to `globals.css`:
```css
--success: oklch(0.54 0.22 195);  /* teal jade, maps to accent */
--success-foreground: oklch(0.98 0 0);
```

## Color Mapping

| Hardcoded | Brand Token | Use Case |
|-----------|------------|----------|
| red-* | destructive | Errors, critical |
| green-* | accent/success | Available, positive |
| yellow-* | secondary | Warnings, pending |
| blue-* | primary | Info, neutral |

## Files Requiring Fixes

Priority: OperationalSignalBoard, AlertBanner, ChannelManager (critical visual components first)

## Next Steps
1. Add success token to globals.css
2. Create sed script to bulk replace hardcoded colors
3. Verify WCAG AAA contrast maintained
4. Deploy with verified compliance
