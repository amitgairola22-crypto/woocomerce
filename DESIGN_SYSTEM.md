# Design System

## Design Philosophy

Premium minimalism. Clean whitespace, strong typography, purposeful motion. Inspired by high-end fashion/lifestyle brands combined with the clarity of modern SaaS UIs.

## Color Palette

```css
/* Primary — deep charcoal (brand) */
--color-primary:     #0F0F0F;
--color-primary-hover: #1A1A1A;

/* Accent — warm gold */
--color-accent:      #C9A84C;
--color-accent-hover: #B8963D;

/* Neutrals */
--color-white:       #FFFFFF;
--color-gray-50:     #FAFAFA;
--color-gray-100:    #F5F5F5;
--color-gray-200:    #E5E5E5;
--color-gray-400:    #A3A3A3;
--color-gray-600:    #525252;
--color-gray-900:    #171717;

/* Semantic */
--color-success:     #22C55E;
--color-warning:     #F59E0B;
--color-error:       #EF4444;
--color-info:        #3B82F6;
```

## Typography

```css
/* Headings — serif for premium feel */
font-family: 'Playfair Display', Georgia, serif;

/* Body — clean sans-serif */
font-family: 'Inter', -apple-system, sans-serif;

/* Scale */
text-xs:   0.75rem  / 1rem
text-sm:   0.875rem / 1.25rem
text-base: 1rem     / 1.5rem
text-lg:   1.125rem / 1.75rem
text-xl:   1.25rem  / 1.75rem
text-2xl:  1.5rem   / 2rem
text-3xl:  1.875rem / 2.25rem
text-4xl:  2.25rem  / 2.5rem
text-5xl:  3rem     / 1
text-6xl:  3.75rem  / 1
```

## Spacing

Tailwind's default scale (4px base unit). Consistent use:
- Component internal padding: `p-4` to `p-6`
- Section vertical padding: `py-16` to `py-24`
- Card gaps: `gap-4` to `gap-6`
- Form field gaps: `space-y-4`

## Component Library

### Button

```tsx
// Variants
<Button variant="primary">   // Black fill, white text
<Button variant="secondary"> // White fill, black border
<Button variant="ghost">     // No fill, underline on hover
<Button variant="danger">    // Red fill
<Button size="sm|md|lg">
<Button loading>             // Spinner state
```

### Product Card

- Aspect ratio 3:4 (portrait)
- Image zoom on hover (transform scale)
- Quick-add button appears on hover
- Price with strikethrough for sale items
- Stock badge: "Low Stock" / "Out of Stock"

### Input

```tsx
<Input label="Email" type="email" error="Required" />
<Input prefix={<Search />} />
<Select label="Category" options={[...]} />
<Checkbox label="I agree..." />
```

## Animation Principles

- **Duration:** 150ms (micro) → 300ms (standard) → 500ms (page transitions)
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out) for most; `spring` for drawers
- **Cart drawer:** slides in from right (300ms spring)
- **Page transitions:** fade + slight Y translate (200ms)
- **Product card hover:** image scale 1.05 (300ms ease)
- **Button hover:** subtle scale 1.02 + shadow (150ms)
- **Stagger:** product grids animate in with 50ms stagger per card

## Layout System

### Store Layout
```
<header>  — sticky, 64px height, transparent → white on scroll
<main>    — full width, no max-width on hero; content max-w-7xl centered
<footer>  — dark background, 4-column grid
```

### Admin Layout
```
<aside>   — 256px fixed sidebar, dark theme
<header>  — 64px top bar with breadcrumbs
<main>    — fluid, padded (p-6 to p-8)
```

### Breakpoints

```
sm:  640px   — large phones
md:  768px   — tablets
lg:  1024px  — laptops
xl:  1280px  — desktops
2xl: 1536px  — wide screens
```

## Responsive Grid

- Product catalog: 1 col (mobile) → 2 col (sm) → 3 col (lg) → 4 col (xl)
- Category cards: 2 col (mobile) → 3 col (md) → 4 col (xl)
- Admin table: horizontal scroll on mobile

## Icons

Using **Lucide React** for all icons. Standard sizes:
- Inline icon: `size={16}`
- Button icon: `size={18}`
- Feature icon: `size={24}`
- Hero icon: `size={48}`
