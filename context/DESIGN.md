# Design System Specification

## 1. Overview & Creative North Star: "The Academic Curator"

This design system is built to move beyond the generic "ed-tech" aesthetic. Instead of a rigid, grid-bound interface, we are adopting a **Creative North Star of "The Academic Curator."**

The visual language balances the prestige of traditional Pakistani academia with the high-velocity efficiency of modern productivity tools like Linear and Stripe. We achieve this through **Organic Minimalist Layering**: using wide-open whitespace, intentional asymmetry in layout, and a "paper-on-glass" depth model. We avoid the "template" look by treating every page as an editorial spread where content breathes and hierarchy is dictated by tonal shifts rather than harsh lines.

---

## 2. Colors: Tonal Depth & The No-Line Rule

The palette is rooted in an earthen, sophisticated base (`#fdf9ee`) that evokes premium stationery, contrasted against a deep, authoritative midnight (`#0c1626`).

### The "No-Line" Rule

Standard 1px borders are strictly prohibited for sectioning or containment. We define boundaries through **Background Color Shifts**. To separate a university search bar from a hero section, place a `surface-container-low` element against a `surface` background. Transitions must feel like different weights of paper stacked on top of one another, not boxes drawn on a screen.

### Surface Hierarchy & Nesting

Use the `surface-container` tiers to create logical nesting.

- **Base Layer:** `surface` (#fdf9ee)
- **Sectioning:** `surface-container-low` (#f7f3e8)
- **Feature Cards:** `surface-container-highest` (#e6e2d8)
- **Floating Elements:** `surface-container-lowest` (#ffffff)

### The Glass & Gradient Rule

To ensure the UI feels alive, use **Glassmorphism** for navigation bars and floating action menus. Apply `surface` at 80% opacity with a `backdrop-blur` of 20px.

- **Signature Texture:** Use a subtle linear gradient for Primary CTAs transitioning from `primary` (#0c1626) to `primary_container` (#212a3b) at a 135-degree angle. This adds a "soul" to the button that flat hex codes cannot replicate.

---

## 3. Typography: Editorial Authority

We pair **Plus Jakarta Sans** for high-impact display with **Manrope** for functional utility. This combination feels both avant-garde and highly legible for students researching complex data.

- **Display (Plus Jakarta Sans):** Used for "Hero" moments. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create a "Stripe-like" impact.
- **Headlines (Plus Jakarta Sans):** Used for university names and section titles. Bold and clear.
- **Body & Labels (Manrope):** Used for all data-dense information. Manrope's geometric nature ensures that even at `body-sm` (0.75rem), university requirements remain readable.
- **Hierarchy Note:** Always lead with a `display` or `headline` element to anchor the page before transitioning into `body` text. Use `on_surface_variant` (#45474c) for secondary descriptions to maintain a sophisticated contrast ratio.

### Text Wrapping Rules

Uncontrolled line breaks are a silent quality killer. Apply the following rules globally:

- **Titles & Headlines:** Always use `text-wrap: balance`. This distributes text evenly across lines, preventing awkward single-word orphans on short lines and giving headlines the editorial weight they deserve.
- **Body & Descriptions:** Use `text-wrap: pretty` on all paragraph-level text. This prevents orphaned single words at the end of a paragraph without the layout disruption that `balance` can cause at longer line lengths.

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  text-wrap: balance;
}

p,
.body-text {
  text-wrap: pretty;
}
```

### Font Smoothing

On macOS, the default subpixel rendering makes text appear heavier than intended, which works against the system's refined, lightweight aesthetic. Apply `-webkit-font-smoothing: antialiased` at the layout root so all text renders thinner and crisper — more in line with the "paper" feel.

```html
<body class="font-sans antialiased">
  ...
</body>
```

### Tabular Numbers

All numerical data — admission deadlines, ranking numbers, tuition fees, acceptance rates — must use `font-variant-numeric: tabular-nums`. This ensures digits are equal-width and columns of numbers don't visually shift or dance when values update dynamically.

```css
.numeric-data {
  font-variant-numeric: tabular-nums;
}
```

> **Note:** Manrope's numerals change appearance slightly when `tabular-nums` is active. Verify this looks correct in context, especially at `body-sm`.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional drop shadows in favor of **Ambient Light Physics**.

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#ffffff) card sitting on a `surface-container-low` (#f7f3e8) background creates a natural, soft lift.
- **Ambient Shadows:** If a card must float (e.g., a university comparison modal), use a shadow with a 40px blur, 0px spread, and 4% opacity. The shadow color must be a tinted version of `primary` (#0c1626), never pure black, to mimic natural environment light.
- **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline_variant` (#c5c6cd) at **15% opacity**. It should be felt, not seen.
- **Glassmorphism:** For overlays, use semi-transparent surface colors. This allows the vibrant Pakistani campus photography to bleed through the UI, making the digital platform feel integrated with the physical world it represents.

### Preferred Shadow Recipe (Cards & Interactive Elements)

Rather than a single heavy shadow, compose three layered shadows. This is the preferred technique for any element that needs to be lifted off the surface — it produces a naturally ambient result that single-shadow approaches cannot replicate:

```css
.card-shadow {
  box-shadow:
    0px 0px 0px 1px rgba(12, 22, 38, 0.06),
    /* perimeter definition */ 0px 1px 2px -1px rgba(12, 22, 38, 0.06),
    /* base lift */ 0px 2px 4px 0px rgba(12, 22, 38, 0.04); /* ambient spread */
}

.card-shadow:hover {
  box-shadow:
    0px 0px 0px 1px rgba(12, 22, 38, 0.08),
    0px 1px 2px -1px rgba(12, 22, 38, 0.08),
    0px 2px 4px 0px rgba(12, 22, 38, 0.06);
  transition: box-shadow 200ms ease;
}
```

The shadow color uses `primary` (#0c1626) as the tint source rather than `#000000`, consistent with the "Ambient Light Physics" rule.

### Image Outlines

All university campus photography and logo images must carry a 1px inset outline at 10% opacity. This adds a sense of depth and prevents images from "floating" disconnectedly on the cream surface:

```css
.campus-image,
.university-logo {
  outline: 1px solid rgba(12, 22, 38, 0.1);
  outline-offset: -1px;
}
```

---

## 5. Border Radius: Concentric Consistency

### The Concentric Radius Rule

When elements are nested inside one another — a logo inside a card, a tag inside a button, an icon inside a badge — the outer and inner radii must follow the **concentric offset formula**:

```
outer radius = inner radius + padding
```

This is one of the most commonly violated rules in interfaces and one of the most immediately noticeable when wrong. Mismatched radii make a UI feel "off" without the viewer knowing why.

**Example:**

- A university card (`xl` radius = `1.5rem`) contains an internal image or chip
- If the chip has a `0.5rem` radius, the card's padding around that chip must be `1.0rem` to arrive at the card's `1.5rem` outer radius
- Never apply a flat `1rem` radius to a card and a `1rem` radius to an element nested inside it — the inner element must always have a _smaller_ radius

---

## 6. Components: Refined Interaction

### Buttons

- **Primary:** `primary` background, `on_primary` text. Radius: `md` (0.75rem). Use the signature gradient (Primary to Primary-Container).
- **Secondary:** `secondary_container` background. No border. High-end, soft-touch feel.
- **Tertiary:** Ghost style. No background. Use `primary` text with an underline that appears only on hover.

#### Optical Alignment in Buttons

Geometric centering is not always visually correct. When a button contains both a label and an icon, reduce the padding on the icon side by 2–4px to optically balance the content. The eye perceives icons as lighter than text, so geometric equality reads as icon-heavy. Fix this at the CSS level, not by adjusting the icon's SVG:

```css
.button-with-icon {
  padding-left: 16px;
  padding-right: 12px; /* slightly reduced on icon side */
}
```

Apply the same principle to play/arrow/chevron icons, which typically need 2px of inward optical nudge.

### University Cards

- **Style:** Forbid divider lines. Separate the university logo, name, and ranking using vertical whitespace (`spacing.6`).
- **Shape:** Use `xl` (1.5rem) roundedness for large cards and `lg` (1rem) for internal images. Always apply the Concentric Radius Rule (see Section 5).
- **Interaction:** On hover, a card should transition from `surface-container-low` to `surface-container-lowest` with a very soft ambient shadow.

### Input Fields

- **Visuals:** No bottom-line-only inputs. Use a solid `surface-container-high` background.
- **State:** On focus, the background shifts to `surface-container-lowest` with a 1px "Ghost Border" at 20% opacity.

### Featured Components for UniScout

- **The Admission Tracker:** A vertical list using background color shifts (`surface-container-low` vs `surface-container-high`) instead of lines to show progress.
- **The "Scout" Chip:** Small, high-contrast labels (`tertiary_fixed`) used to tag university specialties (e.g., "Engineering," "Top 10").

---

## 7. Motion & Animation

Animation is a functional layer, not decoration. These rules govern how UniScout moves.

### Enter Animations: Split and Stagger

Never animate a large block as a single unit. Break hero sections, cards, and modals into individual chunks — headline, description, actions — and animate each separately with a staggered delay. This makes the interface feel responsive and alive rather than sluggish.

```css
@keyframes enter {
  from {
    transform: translateY(8px);
    filter: blur(5px);
    opacity: 0;
  }
}

.animate-enter {
  animation: enter 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: calc(100ms * var(--stagger, 0));
}
```

```html
<div class="animate-enter" style="--stagger: 1">Headline</div>
<div class="animate-enter" style="--stagger: 2">Description</div>
<div class="animate-enter" style="--stagger: 3">Actions</div>
```

For display-level headlines, consider splitting the title into individual word `<span>` elements and staggering at 80ms per word.

### Exit Animations: Keep Them Subtle

Exit animations demand far less movement than enter animations. Use a fixed, short `y` offset (-12px) rather than the full height of the exiting container. Combine with `opacity: 0` and `filter: blur(4px)`. The goal is a soft, directional hint — not a full reversal of the enter animation.

```javascript
// Enter
initial={{ opacity: 0, y: "calc(-100% - 4px)", filter: "blur(4px)" }}
animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}

// Exit: subtle, NOT a mirror of the enter
exit={{ opacity: 0, y: "-12px", filter: "blur(4px)" }}
```

### Interruptible Transitions

**All interactive animations must be interruptible.** Use CSS `transition` (not `@keyframes`) for any state driven by user interaction — hover states, drawer open/close, card hover lifts, focus rings. CSS transitions interpolate toward the latest state automatically. Keyframe animations run on a fixed timeline and feel broken when interrupted mid-way.

- **Use CSS transitions for:** hover, focus, open/close toggles, card lifts
- **Use keyframe animations for:** page enter sequences, loading states, one-shot celebrations

### Contextual Icon Animation

When icons swap contextually (e.g., a Copy icon transitioning to a Check icon on success), animate the transition using a combination of `opacity`, `scale`, and `blur`. A bare swap with no animation feels abrupt and low-quality.

```javascript
// Outgoing icon
{ opacity: 0, scale: 0.8, filter: "blur(2px)" }

// Incoming icon
{ opacity: 1, scale: 1, filter: "blur(0px)" }
```

Use spring animations (`type: "spring", bounce: 0`) for icon transitions in UniScout's status indicators and the Admission Tracker state changes.

---

## 8. Do's and Don'ts

### Do

- **Do** use asymmetrical margins (e.g., more padding on the left than the right in editorial sections) to create visual interest.
- **Do** prioritize whitespace. If a section feels "busy," double the spacing scale value.
- **Do** use `surface_bright` for interactive elements that need to pop against the cream background.
- **Do** apply `text-wrap: balance` to all headlines and `text-wrap: pretty` to all body text.
- **Do** enforce the concentric radius formula whenever an element is nested inside another. Outer = inner + padding.
- **Do** align optically, not geometrically. When buttons, icons, or mixed-content elements look off-center despite equal padding, nudge by 2–4px and verify visually.
- **Do** use the three-layer shadow recipe for all floating elements. A single shadow is never enough.
- **Do** add a 1px inset outline at 10% opacity to all images to ground them in the surface.
- **Do** use `font-variant-numeric: tabular-nums` on all numerical data to prevent layout shift.
- **Do** use `antialiased` font smoothing at the root layout level.

### Don't

- **Don't** use 1px solid borders to separate content. Use tonal shifts.
- **Don't** use pure black (#000000) for text. Use `on_surface` or `primary` to maintain the "Academic Curator" warmth.
- **Don't** use "Standard" shadows. If the shadow is easily visible, it is too dark.
- **Don't** cram information. If a university card has too much data, move the secondary data into a "reveal" or secondary layer.
- **Don't** animate large blocks as a single unit. Always split and stagger entering content.
- **Don't** mirror enter animations on exit. Exit animations should be shorter and more subtle.
- **Don't** use `@keyframes` for interactive state transitions — they're not interruptible and will feel broken when users change intent mid-animation.
- **Don't** apply the same border radius to a parent and its nested child. The child must always carry a smaller radius.
- **Don't** assume geometric centering is visually correct for icon-text combinations. Always do an optical check.

---

## 9. Token Quick Reference

- **Primary Accent:** `#0c1626` (Professional Authority)
- **Soft Base:** `#fdf9ee` (The Paper Surface)
- **Highlight:** `#f0e1c4` (The Golden Merit)
- **Radius (Cards):** `1.5rem` (Friendly & Modern)
- **Shadow Alpha:** `4-8%` (Ambient Depth)
- **Shadow Tint:** `#0c1626` (Never pure black — always primary-tinted)
- **Image Outline:** `rgba(12, 22, 38, 0.10)` inset at 1px
- **Text Wrap (Headlines):** `balance`
- **Text Wrap (Body):** `pretty`
- **Font Smoothing:** `antialiased` (root level)
- **Numeric Font Variant:** `tabular-nums` (all data displays)
