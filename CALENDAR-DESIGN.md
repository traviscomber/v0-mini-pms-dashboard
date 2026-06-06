# Booking.com Calendar Study - Implementation Guide

## Key Features Observed

### 1. Dual Calendar Grid
- Shows 2 months side-by-side (e.g., June 2026 and July 2026)
- Previous/Next arrows to navigate months
- Month/Year header for each calendar
- 7-day week grid layout (Su, Mo, Tu, We, Th, Fr, Sa)

### 2. Date Selection Mechanics
- **Click first date** = Check-in date (highlighted blue)
- **Click second date** = Check-out date (date range highlighted)
- **Hover behavior** = Range preview with light color
- **Real-time counter** = Shows "X Nights" during selection
- **Today button** = Quick access to current date

### 3. Visual Hierarchy
- **Past dates** = Disabled/grayed out
- **Available dates** = White background
- **Selected range** = Light blue background
- **Check-in/out** = Darker blue/highlighted
- **Hover** = Slight shade change for interactivity

### 4. Interaction Patterns
- **One-click range** = Can select entire week/range
- **Mobile-friendly** = Large touch targets (each date ~40px square)
- **Keyboard support** = Arrow keys to navigate dates
- **Accessibility** = Semantic date inputs, ARIA labels

### 5. Additional Elements
- **Guest count selector** = Above calendar
- **Room count selector** = Integral part
- **Price indicator** = Optional price per night on hover
- **Availability status** = Number of rooms remaining
- **Search button** = Sticky/fixed position below calendar

## N3uralia PMS Calendar Implementation Plan

### Component Architecture
```
AdvancedCalendar (Main Component)
├── CalendarHeader (Navigation + Month display)
├── DualCalendarGrid (Two-month view)
│   ├── CalendarMonth (June grid)
│   ├── CalendarMonth (July grid)
│   └── DateCell (Individual date with availability)
├── SelectionInfo (Night counter + date display)
└── BookingFooter (Search/Book button)
```

### Features to Build
1. **Dual-month calendar view** with lazy month loading
2. **Date range selection** with visual feedback
3. **Real-time price calculation** ($basePrice * nights)
4. **Availability status** (available/booked/partial)
5. **Color coding** for booking status
6. **Keyboard navigation** (arrows, enter, escape)
7. **Mobile responsive** design
8. **Animation** for date transitions
9. **Drag-to-select** date range (optional enhancement)
10. **Hotkey shortcuts** for quick date selection

### State Management
```javascript
{
  startDate: Date | null,
  endDate: Date | null,
  hoveredDate: Date | null,
  currentMonth: Date,
  selectedRoomId: string,
  availability: Map<date, {available, booked, guests}>
}
```

### Performance Considerations
- Memoize CalendarMonth components
- Lazy-load months beyond +/-3 months
- Cache availability data
- Debounce hover effects
- Virtual scrolling for large date ranges (6+ months)

### Accessibility Requirements
- ARIA labels: "June 2026", "Check-in date", "Available"
- Keyboard: Tab (navigate), Enter (select), Escape (cancel)
- Screen reader: "June 15, 2026, available, 3 rooms left"
- Focus outline: Clear 2px blue border
- Color contrast: WCAG AA compliant

## Implementation Steps
1. Create AdvancedCalendar component with state
2. Build CalendarMonth grid rendering
3. Add date selection logic and visual feedback
4. Implement keyboard navigation
5. Add real-time price/night calculation
6. Style with N3uralia design system
7. Test accessibility and keyboard flows
8. Optimize performance with memoization
9. Add drag-to-select enhancement
10. Mobile responsive refinement

## Token Efficiency
- Zero new dependencies (pure React + Tailwind)
- Reuse existing N3uralia design tokens
- CSS Grid for layout (performance)
- React hooks for state management
- Memoization to prevent re-renders
