# Money-Pro Design Guidelines

## Design Approach
**Selected Framework:** Custom Financial Dashboard System inspired by Linear's precision + Stripe's professional restraint + Modern banking interfaces (Revolut, Wise)

**Core Principle:** Data-first clarity with sophisticated purple accents. Every element serves financial decision-making while maintaining visual polish.

## Color System

**Primary Palette:**
- Primary Purple: 270 85% 60% (vibrant accent for CTAs, key metrics, active states)
- Deep Purple: 270 70% 25% (sidebar backgrounds, card headers)
- Pure White: 0 0% 100% (main backgrounds, cards)
- True Black: 0 0% 0% (primary text, critical data)
- Charcoal: 0 0% 15% (secondary text, borders)

**Functional Colors:**
- Success Green: 140 60% 45% (positive trends, gains)
- Warning Red: 0 70% 55% (losses, alerts)
- Neutral Gray: 0 0% 50% (disabled states, placeholders)
- Light Gray: 0 0% 96% (subtle backgrounds, dividers)

**Dark Mode:**
- Background: 270 20% 8%
- Surface: 270 15% 12%
- Text Primary: 0 0% 95%
- Borders: 270 10% 20%

## Typography

**Font Stack:**
- Primary: 'Inter' (financial data, UI elements)
- Monospace: 'IBM Plex Mono' (currency amounts, account numbers)

**Hierarchy:**
- Hero Display: 64px/700 (landing page)
- Dashboard Headers: 32px/600
- Section Titles: 24px/600
- Card Titles: 18px/600
- Body: 16px/400
- Small Data: 14px/500
- Labels: 12px/500 uppercase tracking-wide

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16 (p-2, h-8, m-4, gap-6, etc.)

**Dashboard Grid:**
- Sidebar: Fixed 280px (collapsed: 72px icon-only)
- Main Content: Fluid with max-width-7xl
- Card Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Stat Cards: 2-4 column responsive grid

**Containers:**
- Page padding: px-6 lg:px-8
- Section spacing: py-12 desktop, py-8 mobile
- Card padding: p-6
- Tight components: p-4

## Component Library

### Navigation
**Sidebar (Admin Dashboard):**
- Fixed left, full height, deep purple background (270 70% 25%)
- Logo at top (white), navigation items with icons
- Active state: light purple background (270 90% 95%) + primary purple text
- Hover: subtle lightening effect
- Bottom: user profile card with avatar, name, role

**Top Bar:**
- White background, subtle shadow
- Search bar (left), notification bell + user menu (right)
- Height: 64px, border-bottom light gray

### Data Display

**Metric Cards:**
- White backgrounds, subtle shadow (shadow-sm)
- Header: Label + icon (purple), trend indicator (↑↓)
- Large number: 36px monospace font
- Subtext: Percentage change with color coding (green/red)
- Sparkline chart in bottom third (purple gradient fill)

**Data Tables:**
- Zebra striping: alternating white/light gray rows
- Header: bold, sticky, light purple background
- Cell padding: px-4 py-3
- Hover row: subtle purple tint
- Action buttons: icon-only, purple on hover

**Charts:**
- Line/Area charts: Purple primary (270 85% 60%), gradient to transparent
- Bar charts: Purple fills, light gray backgrounds
- Donut/Pie: Purple shades (60%, 50%, 40%, 30%)
- Grid lines: light gray, minimal
- Tooltips: white card, shadow-lg, purple accent border-left

### Forms & Inputs

**Input Fields:**
- Height: 44px
- Border: 2px light gray, focus: purple with purple ring
- Padding: px-4
- Labels: 14px, charcoal, mb-2
- Dark mode: background (270 15% 12%), white text

**Buttons:**
- Primary: Purple background, white text, px-6 py-3, rounded-lg
- Secondary: White background, purple border, purple text
- Ghost: Transparent, purple text, hover subtle purple background
- Disabled: Gray background, gray text

**Dropdowns:**
- Trigger: input-style button
- Menu: white, shadow-xl, rounded-lg, py-2
- Items: hover purple background (light), px-4 py-2

### Cards & Containers

**Dashboard Cards:**
- White background (dark mode: 270 15% 12%)
- Rounded-xl, shadow-sm
- Padding: p-6
- Header with title + action button/menu
- Divider: border-t light gray between sections

**Transaction Lists:**
- Each item: flex justify-between, py-4, border-b
- Left: icon (category), description, date (small gray)
- Right: amount (monospace, color-coded), status badge

**Status Badges:**
- Small pill shape, px-3 py-1, rounded-full
- Success: green background (10% opacity), green text
- Pending: purple background (10% opacity), purple text
- Failed: red background (10% opacity), red text

## Landing Page Sections

**Hero Section:**
- Full viewport height (min-h-screen)
- Two-column: Left 50% content, Right 50% dashboard preview image
- Background: White with subtle purple gradient overlay (top-left)
- Headline: 64px bold, black text
- Subheadline: 24px, charcoal
- CTA: Large purple button + outline white button (backdrop-blur-sm if over image)
- Trust indicators below: "Trusted by 50,000+ investors" (small text, logos)

**Features Grid:**
- 3-column layout (1 on mobile)
- Each card: icon (purple, 48px), title, description
- Icons in rounded-2xl containers with light purple backgrounds
- Hover: lift with shadow-lg transition

**Dashboard Preview:**
- Full-width section, light gray background
- Large screenshot/mockup of admin dashboard
- Caption: Feature highlights with arrows/annotations

**Stats Bar:**
- 4-column grid, py-16
- Large numbers (48px monospace), labels below
- Purple accent lines separating columns

**CTA Section:**
- Centered, py-20, purple gradient background
- White text, large headline
- Primary white button (text black) + secondary outline button

**Footer:**
- Black background, white text
- 4-column grid: Product, Company, Resources, Legal
- Newsletter signup: input + purple button
- Bottom: Copyright, social icons (white)

## Images

**Hero Image:**
- Large: Modern dashboard screenshot showing portfolio overview, charts, transaction list
- Style: Sleek, professional, high-contrast mockup
- Placement: Right 50% of hero section, subtle shadow

**Feature Visuals:**
- Dashboard Components: Individual card screenshots (metrics, charts)
- Mobile App Mockup: Optional phone mockup showing mobile dashboard
- Security Badge: Trust symbols, encryption icons

**Dashboard Screenshots:**
- Full admin panel view with sidebar, charts, data tables
- Analytics page: graphs and performance metrics
- Portfolio management: asset allocation charts

## Animations

**Minimal Motion:**
- Number counters: Count-up animation on viewport entry (duration-1000)
- Chart draws: Subtle path animation on load
- Card hover: translate-y-1 + shadow transition
- Button: Scale on active (scale-95)

## Critical Dashboard Features

**Must Include:**
- Portfolio overview cards (4-stat grid at top)
- Recent transactions table (sortable, filterable)
- Performance chart (line chart, time range selector)
- Asset allocation donut chart
- Quick actions bar (transfer, invest, withdraw buttons)
- Notification center (dropdown from top bar)
- User settings modal

**Quality Standards:** Every dashboard view must include 6-8 meaningful data components, no sparse layouts, production-ready polish with real-world financial metrics presentation.