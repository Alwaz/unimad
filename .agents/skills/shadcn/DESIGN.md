# Design System Specification

## 1. Overview & Creative North Star: "The Academic Curator"

This design system is built to move beyond the generic "ed-tech" aesthetic. Instead of a rigid, grid-bound interface, we are adopting a **Creative North Star of "The Academic Curator."**

The visual language balances the prestige of traditional Pakistani academia with the high-velocity efficiency of modern productivity tools like Linear and Stripe. We achieve this through **Organic Minimalist Layering**: using wide-open whitespace, intentional asymmetry in layout, and a "paper-on-glass" depth model. We avoid the "template" look by treating every page as an editorial spread where content breathes and hierarchy is dictated by tonal shifts rather than harsh lines.

---

## 2. shadcn/ui Theme Integration

This system maps all design tokens directly to shadcn/ui CSS variables. All color values use the **OKLCH** color space for perceptually uniform lightness, superior interpolation in gradients, and consistent contrast across the palette.

### globals.css — CSS Variable Definitions

Paste the following into your `globals.css` (or equivalent global stylesheet) inside your `:root` and `.dark` blocks:

```css
@layer base {
  :root {
    /* ── Core Surfaces (The Paper Stack) ── */
    --background: oklch(98.1% 0.012 88); /* #fdf9ee — The Paper Surface */
    --foreground: oklch(14.5% 0.034 251); /* #0c1626 — Professional Authority */

    /* ── Card & Popover ── */
    --card: oklch(100% 0 0); /* #ffffff — Floating Elements */
    --card-foreground: oklch(14.5% 0.034 251);

    --popover: oklch(100% 0 0);
    --popover-foreground: oklch(14.5% 0.034 251);

    /* ── Primary (Midnight Authority) ── */
    --primary: oklch(14.5% 0.034 251); /* #0c1626 */
    --primary-foreground: oklch(98.1% 0.012 88); /* #fdf9ee */

    /* ── Secondary (Cream Container) ── */
    --secondary: oklch(94.8% 0.014 88); /* #f7f3e8 — surface-container-low */
    --secondary-foreground: oklch(14.5% 0.034 251);

    /* ── Muted (Mid-Surface) ── */
    --muted: oklch(91.2% 0.016 88); /* #ece8db — surface-container */
    --muted-foreground: oklch(44.2% 0.012 251); /* #45474c — on_surface_variant */

    /* ── Accent (Golden Merit) ── */
    --accent: oklch(89.6% 0.054 68); /* #f0e1c4 — The Golden Merit */
    --accent-foreground: oklch(14.5% 0.034 251);

    /* ── Destructive ── */
    --destructive: oklch(57.7% 0.245 27.3);
    --destructive-foreground: oklch(98.1% 0.012 88);

    /* ── Ghost Border (The No-Line Rule Fallback) ── */
    --border: oklch(78.4% 0.01 251 / 15%); /* outline_variant at 15% opacity */
    --input: oklch(88.6% 0.016 88); /* surface-container-high */
    --ring: oklch(14.5% 0.034 251 / 20%);

    /* ── Radius Scale ── */
    --radius: 0.75rem; /* Base = md; Cards use 1.5rem (calc(var(--radius) * 2)) */
  }

  .dark {
    --background: oklch(14.5% 0.034 251);
    --foreground: oklch(94.8% 0.014 88);

    --card: oklch(19.8% 0.034 251);
    --card-foreground: oklch(94.8% 0.014 88);

    --popover: oklch(19.8% 0.034 251);
    --popover-foreground: oklch(94.8% 0.014 88);

    --primary: oklch(94.8% 0.014 88);
    --primary-foreground: oklch(14.5% 0.034 251);

    --secondary: oklch(22.1% 0.03 251);
    --secondary-foreground: oklch(94.8% 0.014 88);

    --muted: oklch(22.1% 0.03 251);
    --muted-foreground: oklch(62.3% 0.014 251);

    --accent: oklch(89.6% 0.054 68);
    --accent-foreground: oklch(14.5% 0.034 251);

    --destructive: oklch(57.7% 0.245 27.3);
    --destructive-foreground: oklch(98.1% 0.012 88);

    --border: oklch(94.8% 0.014 88 / 12%);
    --input: oklch(22.1% 0.03 251);
    --ring: oklch(94.8% 0.014 88 / 20%);
  }
}
```

---

## 3. Extended Surface Tokens

These tokens are not part of shadcn's default set but are needed for the surface-layering system. Define them as custom CSS variables alongside the shadcn block above:

```css
:root {
  /* Surface hierarchy — tonal nesting, no borders */
  --surface: oklch(98.1% 0.012 88); /* Base layer           #fdf9ee */
  --surface-container-lowest: oklch(100% 0 0); /* Floating / white     #ffffff */
  --surface-container-low: oklch(94.8% 0.014 88); /* Sectioning           #f7f3e8 */
  --surface-container: oklch(91.2% 0.016 88); /* Mid-depth            ~#ece8db */
  --surface-container-high: oklch(89.1% 0.018 88); /* Input resting state  ~#e8e4d8 */
  --surface-container-highest: oklch(87% 0.02 88); /* Feature cards        #e6e2d8 */
  --surface-bright: oklch(100% 0 0); /* Pop elements         #ffffff */

  /* Shadow — tinted primary, never black */
  --shadow-primary: oklch(14.5% 0.034 251 / 6%);
  --shadow-primary-soft: oklch(14.5% 0.034 251 / 4%);

  /* Glassmorphism nav */
  --glass-background: oklch(98.1% 0.012 88 / 80%);
  --glass-blur: 20px;

  /* Primary gradient (CTAs) */
  --gradient-primary: linear-gradient(
    135deg,
    oklch(14.5% 0.034 251) 0%,
    oklch(19.8% 0.034 251) 100%
  );
}
```

---

## 4. Colors: Tonal Depth & The No-Line Rule

### The "No-Line" Rule

Standard 1px borders are strictly prohibited for sectioning or containment. We define boundaries through **Background Color Shifts**. Transitions must feel like different weights of paper stacked on top of one another, not boxes drawn on a screen. Use `--border` only as a last resort for accessibility ("Ghost Border"), which resolves to `oklch(78.4% 0.010 251 / 15%)` — felt, not seen.

### Surface Hierarchy & Nesting

| Role              | Token                         | OKLCH                   | Approx Hex |
| ----------------- | ----------------------------- | ----------------------- | ---------- |
| Base Layer        | `--surface`                   | `oklch(98.1% 0.012 88)` | `#fdf9ee`  |
| Sectioning        | `--surface-container-low`     | `oklch(94.8% 0.014 88)` | `#f7f3e8`  |
| Feature Cards     | `--surface-container-highest` | `oklch(87.0% 0.020 88)` | `#e6e2d8`  |
| Floating Elements | `--surface-container-lowest`  | `oklch(100% 0 0)`       | `#ffffff`  |

### The Glass & Gradient Rule

Navigation bars and floating action menus use **Glassmorphism**:

```css
background: var(--glass-background); /* oklch(98.1% 0.012 88 / 80%) */
backdrop-filter: blur(var(--glass-blur)); /* 20px */
```

Primary CTAs use the **Signature Gradient** for a "soul" no flat hex can replicate:

```css
background: var(--gradient-primary);
/* linear-gradient(135deg, oklch(14.5% 0.034 251) → oklch(19.8% 0.034 251)) */
```

---

## 5. Typography: Editorial Authority

We pair **Plus Jakarta Sans** for high-impact display with **Manrope** for functional utility.

```css
/* In your tailwind.config or CSS */
--font-display: 'Plus Jakarta Sans', sans-serif;
--font-body: 'Manrope', sans-serif;
```

| Scale        | Font              | Size      | Letter-Spacing | Usage                            |
| ------------ | ----------------- | --------- | -------------- | -------------------------------- |
| `display-lg` | Plus Jakarta Sans | `3.5rem`  | `-0.02em`      | Hero moments                     |
| `headline`   | Plus Jakarta Sans | `1.75rem` | `-0.01em`      | University names, section titles |
| `body`       | Manrope           | `1rem`    | `0`            | Descriptions, data               |
| `body-sm`    | Manrope           | `0.75rem` | `0`            | Requirements, labels             |

Always lead with a `display` or `headline` element before `body` text. Use `--muted-foreground` (`oklch(44.2% 0.012 251)`) for secondary descriptions.

---

## 6. Elevation & Depth: Ambient Light Physics

We reject traditional drop shadows in favor of **Ambient Light Physics**.

- **Layering:** A `--surface-container-lowest` card on a `--surface-container-low` background creates a soft natural lift — no shadow needed.
- **Ambient Shadow (Floating Modals):**
  ```css
  box-shadow: 0 8px 40px 0 var(--shadow-primary); /* 6% opacity, tinted primary */
  ```
- **Ghost Border Fallback:**
  ```css
  border: 1px solid var(--border); /* oklch(78.4% 0.010 251 / 15%) */
  ```
- **Ring (Focus States):** `box-shadow: 0 0 0 3px var(--ring)` — matches shadcn's focus ring convention.

---

## 7. Components: shadcn/ui Mapping

### Buttons

```css
/* Primary — maps to shadcn variant="default" */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--primary-foreground); /* oklch(98.1% 0.012 88) */
  border-radius: var(--radius); /* 0.75rem */
}

/* Secondary — maps to shadcn variant="secondary" */
.btn-secondary {
  background: var(--secondary); /* oklch(94.8% 0.014 88) */
  color: var(--secondary-foreground);
  border: none;
}

/* Tertiary / Ghost — maps to shadcn variant="ghost" */
.btn-ghost {
  background: transparent;
  color: var(--primary);
  text-decoration: none;
}
.btn-ghost:hover {
  text-decoration: underline;
}
```

### University Cards — `<Card>` Component

```css
/* shadcn Card overrides */
.card {
  background: var(--surface-container-low); /* resting */
  border-radius: calc(var(--radius) * 2); /* 1.5rem */
  border: none; /* No-Line Rule */
  box-shadow: none;
}
.card:hover {
  background: var(--surface-container-lowest);
  box-shadow: 0 4px 40px 0 var(--shadow-primary-soft);
}
/* Internal images */
.card img {
  border-radius: calc(var(--radius) * 1.33); /* ~1rem */
}
```

### Input Fields — `<Input>` Component

```css
/* shadcn Input overrides */
.input {
  background: var(--input); /* surface-container-high */
  border: none;
}
.input:focus {
  background: var(--surface-container-lowest);
  box-shadow: 0 0 0 1px var(--ring); /* Ghost Border */
}
```

### Featured Components

**Admission Tracker** — Use alternating `--surface-container-low` and `--surface-container-high` backgrounds on list items instead of dividers.

**"Scout" Chip** — Small `<Badge>` using `--accent` background (`oklch(89.6% 0.054 68)`) and `--accent-foreground` text. Example:

```jsx
<Badge style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
  Engineering
</Badge>
```

---

## 8. tailwind.config.ts Integration

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 0.25rem)' /* 0.5rem */,
        md: 'var(--radius)' /* 0.75rem */,
        lg: 'calc(var(--radius) + 0.25rem)' /* 1rem */,
        xl: 'calc(var(--radius) * 2)' /* 1.5rem — Cards */,
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
};

export default config;
```

---

## 9. Do's and Don'ts

### Do

- **Do** map all color usage to shadcn CSS variables (`--primary`, `--muted`, etc.) to ensure light/dark mode works automatically.
- **Do** use asymmetrical margins (e.g., more padding on the left in editorial sections) to create visual interest.
- **Do** prioritize whitespace. If a section feels "busy," double the spacing scale value.
- **Do** use `--surface-bright` / `--card` for interactive elements that need to pop against the cream background.
- **Do** use OKLCH values directly in one-off styles when the alpha channel needs to be modified inline (e.g., `oklch(14.5% 0.034 251 / 8%)`).

### Don't

- **Don't** use 1px solid borders to separate content. Use tonal shifts between surface tokens.
- **Don't** use `oklch(0% 0 0)` (pure black) for text. Use `--foreground` or `--primary` to maintain "Academic Curator" warmth.
- **Don't** use heavy shadows. If the shadow is clearly visible, it is too dark.
- **Don't** cram information into cards. Move secondary data into a reveal layer or `<Collapsible>`.
- **Don't** hardcode hex values in component styles — always reference CSS variables so the dark mode override in `.dark {}` takes effect.

---

## 10. Token Quick Reference

| Design Intent  | shadcn Variable      | OKLCH Value                    | Approx Hex |
| -------------- | -------------------- | ------------------------------ | ---------- |
| Primary Accent | `--primary`          | `oklch(14.5% 0.034 251)`       | `#0c1626`  |
| Soft Base      | `--background`       | `oklch(98.1% 0.012 88)`        | `#fdf9ee`  |
| Golden Merit   | `--accent`           | `oklch(89.6% 0.054 68)`        | `#f0e1c4`  |
| Ghost Border   | `--border`           | `oklch(78.4% 0.010 251 / 15%)` | —          |
| Secondary Text | `--muted-foreground` | `oklch(44.2% 0.012 251)`       | `#45474c`  |
| Card Radius    | `--radius * 2`       | `1.5rem`                       | —          |
| Shadow Alpha   | `--shadow-primary`   | `oklch(14.5% 0.034 251 / 6%)`  | —          |
