# UI Context

> Quick reference for the UniScout design system. The full normative spec lives
> in [DESIGN.md](./DESIGN.md) — read it for rationale, examples, and edge cases.
> When the two files disagree, DESIGN.md wins.

## Theme

Light, warm, earthen palette — the **"Academic Curator"**. No dark mode.
Hierarchy comes from tonal surface shifts, never 1px borders ("No-Line" rule).
Glassmorphism for nav and floating overlays. Editorial spread layout —
whitespace-led, intentionally asymmetric, paper-on-glass depth.

## Colors

All components must use these tokens. No hardcoded hex values. Borders are
forbidden for sectioning — use surface tier shifts instead. Never use pure
`#000000` for text; use `--primary` or `--on-surface`.

| Role                                 | CSS Variable                | Reference Value |
| ------------------------------------ | --------------------------- | --------------- |
| Page background (paper)              | `--surface`                 | `#fdf9ee`       |
| Sectioning layer                     | `--surface-container-low`   | `#f7f3e8`       |
| Input background                     | `--surface-container-high`  | (oklch 89.1%)   |
| Feature card layer                   | `--surface-container-highest` | `#e6e2d8`     |
| Floating element                     | `--surface-container-lowest` | `#ffffff`      |
| Primary accent / authoritative text  | `--primary`                 | `#0c1626`       |
| Primary gradient stop                | `--primary-container`       | `#212a3b`       |
| Highlight (golden merit)             | `--highlight`               | `#f0e1c4`       |
| Secondary text                       | `--on-surface-variant`      | `#45474c`       |
| Ghost border (use at 15% opacity)    | `--outline-variant`         | `#c5c6cd`       |

> Tokens in [globals.css](../apps/frontend/src/styles/globals.css) are stored as
> OKLch; the hex values above are the human-readable equivalents from DESIGN.md.
> `--highlight` and `--outline-variant` are referenced by DESIGN.md but not yet
> declared in `globals.css` — add them when first needed.

## Typography

| Role                       | Font              | Variable         |
| -------------------------- | ----------------- | ---------------- |
| Display (hero, titles)     | Plus Jakarta Sans | `--font-display` |
| Body / labels / data-dense | Manrope           | `--font-body`    |

Required global rules (DESIGN.md §3):

- `h1`–`h6`: `text-wrap: balance`
- `p` / body text: `text-wrap: pretty`
- Layout root: `-webkit-font-smoothing: antialiased`
- All numeric data (deadlines, rankings, fees, rates):
  `font-variant-numeric: tabular-nums`
- Display sizes use `letter-spacing: -0.02em`
- Secondary descriptions use `--on-surface-variant`

> Implementation gap: `apps/frontend/src/app/layout.tsx` currently loads Geist
> and binds it to `--font-sans`. Plus Jakarta Sans / Manrope stacks are declared
> in `globals.css` but the fonts are not yet imported. The wrap / smoothing /
> tabular-nums rules above are also not applied globally yet — wire both when
> editing typography.

## Border Radius

| Context                                     | Class         | Value    |
| ------------------------------------------- | ------------- | -------- |
| Inputs / chips / small UI                   | `rounded-md`  | `0.75rem` |
| Internal images / secondary cards / buttons | `rounded-lg`  | `1rem`   |
| Cards / panels / modals                     | `rounded-xl`  | `1.5rem` |

**Concentric Radius Rule** (DESIGN.md §5): when nested,
`outer = inner + padding`. The inner element's radius must always be smaller
than its container's. Never apply the same radius to a parent and its child.

## Elevation & Shadow

- No traditional drop shadows. Depth comes from surface tier stacking
  (e.g. `surface-container-lowest` card on `surface-container-low` background).
- Floating elements use the **three-layer ambient shadow recipe** — perimeter +
  base lift + ambient spread, all tinted with `rgba(12, 22, 38, …)`, never
  pure black:

  ```css
  .card-shadow {
    box-shadow:
      0 0 0 1px rgba(12, 22, 38, 0.06),    /* perimeter */
      0 1px 2px -1px rgba(12, 22, 38, 0.06), /* base lift */
      0 2px 4px 0 rgba(12, 22, 38, 0.04);    /* ambient spread */
  }
  .card-shadow:hover {
    box-shadow:
      0 0 0 1px rgba(12, 22, 38, 0.08),
      0 1px 2px -1px rgba(12, 22, 38, 0.08),
      0 2px 4px 0 rgba(12, 22, 38, 0.06);
    transition: box-shadow 200ms ease;
  }
  ```

- Ghost border (accessibility fallback only): `--outline-variant` at 15% opacity.
- Image outlines: every campus photo and university logo carries
  `outline: 1px solid rgba(12, 22, 38, 0.10); outline-offset: -1px;`.
- Glassmorphism: `--surface` at 80% opacity + `backdrop-blur: 20px` for nav and
  overlays (tokens `--glass-background`, `--glass-blur` already defined).

## Component Library

shadcn/ui (`style: radix-nova`, `iconLibrary: lucide`, `cssVariables: true`) on
**Tailwind CSS v4**. Components live in
[apps/frontend/src/components/ui/](../apps/frontend/src/components/ui/). Add new
components via the shadcn CLI — do not write Radix primitives from scratch.
Tailwind v4 is configured via `@theme` blocks in `globals.css`; there is no
`tailwind.config.js`.

## Component Patterns

- **Buttons — Primary:** `--primary` → `--primary-container` 135° gradient
  (token `--gradient-primary`), `rounded-md`, `--primary-foreground` text.
- **Buttons — Secondary:** `secondary-container` background. No border.
- **Buttons — Tertiary:** ghost; `--primary` text with hover-only underline.
- **Optical alignment:** when a button mixes label + icon, reduce padding on
  the icon side by 2–4px (e.g. `padding-left: 16px; padding-right: 12px`).
  Apply to chevrons / arrows too. Do not adjust the icon SVG.
- **Cards:** `rounded-xl`. No divider lines — separate fields with `space-3`–
  `space-6` whitespace. Hover swaps `surface-container-low` →
  `surface-container-lowest` plus the three-layer ambient shadow. Internal
  images at `rounded-lg`. Concentric Radius Rule applies.
- **Inputs:** solid `surface-container-high` background. On focus, shift to
  `surface-container-lowest` + 1px ghost border at 20% opacity. No
  bottom-line-only inputs.
- **Featured (UniScout):** Admission Tracker uses tonal step lists
  (`surface-container-low` vs `surface-container-high`) instead of dividers;
  "Scout" chips use `tertiary-fixed` for high-contrast specialty tags.

## Layout Patterns

- **Page** (directory):  sticky glassmorphism header → search bar → filter
  group → result count → responsive grid (3 cols at `lg`) → pagination.
- **Sectioning:** tonal background shifts (`surface` ↔ `surface-container-low`)
  — never 1px dividers.
- **Editorial spreads:** asymmetrical margins; if a section feels busy, double
  the spacing scale value before adding density.
- **Overlays / nav:** glassmorphism (see Elevation & Shadow).

## Motion

From DESIGN.md §7:

- **Enter:** split blocks into chunks (headline / description / actions),
  animate each separately with a `--stagger` delay (100ms per step). Hero words
  may stagger at 80ms per `<span>`. Use the `enter` keyframe
  (`translateY(8px)`, `blur(5px)`, `opacity: 0` → resting state) with
  `cubic-bezier(0.25, 0.46, 0.45, 0.94)` over 800ms.
- **Exit:** subtle, **not** a mirror of enter — fixed `-12px` offset, `opacity:
  0`, `filter: blur(4px)`.
- **Interruptible state changes:** use CSS `transition` (never `@keyframes`)
  for hover, focus, open/close, card lifts. Reserve `@keyframes` for one-shot
  enter sequences, loading states, celebrations.
- **Icon swaps** (e.g. Copy → Check): animate via `opacity` + `scale 0.8↔1` +
  `blur 2px↔0`; prefer `type: "spring", bounce: 0`.

## Icons

`lucide-react`, stroke-based only. Sizes: `h-4 w-4` inline, `h-5 w-5` in
buttons.

## Do / Don't (quick reference)

**Do**

- Use tonal surface shifts to separate sections.
- Prioritize whitespace; double the scale before adding density.
- Apply `text-wrap: balance` to headings, `pretty` to body.
- Enforce the Concentric Radius Rule on every nested element.
- Align optically (2–4px nudge) for icon + text combos.
- Use the three-layer shadow recipe for any floating element.
- Add a 1px inset outline at 10% opacity to all images.
- Use `tabular-nums` on numerical data.
- Apply `antialiased` font smoothing at the layout root.
- Tint shadows with `--primary`, never pure black.

**Don't**

- Use 1px solid borders for sectioning.
- Use pure `#000000` for text.
- Use a single heavy shadow — always layer three.
- Cram data into a card; move secondary data into a reveal layer.
- Animate large blocks as a single unit — split and stagger.
- Mirror enter animations on exit.
- Use `@keyframes` for interactive state transitions (use `transition`).
- Apply the same radius to a parent and a nested child.
- Rely on geometric centering for icon + text — verify optically.
