# 📘 README.md – Ambacht-Verse-Ontwerp UI Refactor

## 🧭 Goal

Transform the existing **Ambacht-Verse-Ontwerp** project into a fully styled and responsive site that blends:

- 🧁 The refined elegance and layout discipline of the **Julienne Cooking UI** (iOS app style)
- 🍝 The warm, polished, commercial appeal of **Sopranos Catering** ([https://www.sopranoscatering.com/](https://www.sopranoscatering.com/))

The final result must:

- Seamlessly match the **Sopranos color scheme, layout rhythm, and content spacing**
- Adopt the **Julienne UI's clean typographic hierarchy, modern component structure, and visual calmness**
- Remove all outdated Ambacht styling and fix layout bugs across header, pricing, and CTA

---

## ✨ Visual Language

### 🎨 Color System (to replace current theme)

Extracted from Julienne + Sopranos:

```css
:root {
  /* Neutrals (backgrounds, cards) */
  --cream-light: #F8F6F0;
  --warm-beige: #F5E6D3;
  --white: #ffffff;

  /* Primary Text & UI */
  --charcoal: #2C2925;
  --golden-honey: #E6A756;

  /* Accent Colors */
  --accent-orange: #D2691E;
  --accent-red: #A0522D;
  --accent-green: #8B9A7A;

  /* Functional Tokens */
  --success: var(--accent-green);
  --warning: var(--golden-honey);
  --error: var(--accent-red);

  --background: var(--cream-light);
  --foreground: var(--charcoal);
  --muted: #eeeae2;
  --card: var(--warm-beige);
  --input: #f3f0e9;
  --border: #e2d7c8;
}
```

### Typography

Adopt Julienne's scale:

```css
.text-display { font-size: 2.75rem; font-weight: 600; line-height: 1.1; }
.text-heading { font-size: 2rem; font-weight: 600; line-height: 1.25; }
.text-body    { font-size: 1rem; font-weight: 500; line-height: 1.6; }
.text-small   { font-size: 0.875rem; font-weight: 500; line-height: 1.6; }
```

Use Tailwind classes or define CVA variants to map above.

---

## 🧱 Component Refactor Guide

### 1. Header

- Use `bg-card` background with warm padding and centered logo
- Navigation links: horizontally spaced with `.text-body font-medium text-charcoal`
- Mobile behavior: NOT mobile-first, but must **gracefully collapse** under 768px
- Keep it visually aligned with Soprano’s navbar (spacing, height, alignment)

### 2. Hero / Landing Section

- Use Julienne’s central composition (cake or dish center-aligned, CTA below)
- Centered heading + description text
- Primary CTA: `bg-accent-orange text-white rounded-xl px-6 py-3 text-body`

### 3. Pricing Matrix

- Completely restyle to match **Soprano’s 3-column cards**
- Cards should:
  - Be equal height
  - Have soft borders (`border border-border`)
  - Use `bg-card`, with clear `h3.text-heading` titles
  - Include `€25,00 per persoon` formatting with Dutch locale (comma decimals)
  - Fix `€NaN` bugs from current version

### 4. Buttons

- Use only these styles:

```css
.btn-primary   { background: var(--accent-orange); color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; }
.btn-secondary { border: 1px solid var(--border); color: var(--charcoal); background: var(--muted); }
```

- All buttons should have smooth hover transitions (e.g., `hover:brightness-95`, `hover:scale-105`)

### 5. Reservation CTA

- Refactor floating bottom button to be sticky, not absolute
- Style similar to Julienne's `Start Cooking` CTA
- Use warm gradient (Sopranos style): from `#C4411A` to `#E07B3D`
- Text: `text-white font-medium text-body`
- Align perfectly in all screen sizes, don't float outside bounds

---

## 📐 Layout & Grid

- Adopt Julienne's 12-column grid internally, but apply **Sopranos spacing philosophy** (wide margins, vertical space)
- Use `max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8` on main wrappers
- Section spacing:
  - `pt-16 pb-20` for major sections
  - `gap-6` or `gap-8` for cards
  - Avoid tight margins unless required

### Fixes from Current Screenshots:

- Floating icons – wrap in `flex items-center gap-2`
- Misaligned pricing cards – ensure `grid grid-cols-1 md:grid-cols-3`
- Text overflow & emoji spacing – reduce to `text-body` or `text-sm` and limit emoji usage

---

## 🪄 Animation (Optional)

Use **CSS transitions** unless Framer is already used. Prefer Tailwind transitions:

```css
transition-all duration-300 ease-in-out
hover:scale-[1.02] hover:brightness-95
```

Only use Framer Motion if:

- Already present in tech stack
- Needed for specific interaction (e.g., hero reveal, hover scale cards)

---

## 🇳🇱 Dutch Formatting

- Use Dutch locale:

```ts
new Intl.NumberFormat("nl-NL", { style: 'currency', currency: 'EUR' }).format(25.5)
// → €25,50
```

- Dates: `dd-mm-yyyy` or `25 juli 2025`
- Language tag on root: `<html lang="nl">`

---

## ✅ Final Checklist

-

---

## 🔗 References

- Julienne iOS Screens (attached)
- [https://www.sopranoscatering.com/](https://www.sopranoscatering.com/)
- [https://github.com/0xtsotsi/ambacht-verse-ontwerp](https://github.com/0xtsotsi/ambacht-verse-ontwerp)

> ✨ Go above and beyond. Your job is to make this feel like a **beautiful fusion of a high-end culinary site** with **Dutch artisanal charm**. Don’t just match the visuals – make it feel smooth, immersive, and intentional.

---

Let’s build something unforgettable.

– Ambacht UI Design Refactor ✨

