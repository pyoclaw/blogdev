---
title: "Springy Cards & the Hard-Shadow Look"
date: "2026-09-15"
tags: [css, design, motion, animation]
accent: mint
excerpt: "The playful theme is basically three tricks: chunky offset shadows, an overshooting easing curve, and hover states that lift. No framework — just custom properties and one very good cubic-bezier."
---

The whole vibe of this site — bouncy, cartoonish, faintly toy-like — comes from a surprisingly small set of CSS decisions. Let's take the cards apart.

## The hard-shadow "sticker" look

The offset solid shadow (no blur) is the backbone of the theme. It reads as a paper sticker peeled slightly off the page:

```css
:root {
  --border: 2.5px solid var(--ink);
  --shadow-pop: 6px 6px 0 var(--ink);
  --shadow-pop-lg: 10px 10px 0 var(--ink);
}

.card {
  border: var(--border);
  border-radius: 28px;
  box-shadow: var(--shadow-pop);
}
```

The key is that the shadow is the **same color as the border** (`--ink`) and has **zero blur**. That's what makes it graphic rather than realistic. Everything else on the site — buttons, tags, tag chips, post-nav tiles — reuses these two custom properties, so the look stays coherent for free.

## The one easing curve that sells "playful"

Almost every hover and reveal on this site uses the same curve:

```css
transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
```

That `1.56` control point pushes the curve **past 1.0** before settling — an overshoot. The element springs a touch too far, then eases back. It's the CSS equivalent of a spring, and it's the single most important number in the whole stylesheet. Swap it for a boring `ease` and the site instantly feels corporate.

## Lift on hover, press on click

A card should feel liftable. On hover we translate it up-and-left *toward* the light and grow the shadow, so the "gap" between card and page increases:

```css
.card:hover {
  transform: translate(-4px, -4px) rotate(-0.4deg);
  box-shadow: var(--shadow-pop-lg);
}
```

The half-degree `rotate` is imperceptible consciously but makes the card feel hand-placed. Buttons take the same idea further with a satisfying *press*:

```css
.btn:hover  { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--ink); }
.btn:active { transform: translate(3px, 3px);   box-shadow: 2px 2px 0 var(--ink); }
```

On `:active` the button moves *into* the page and its shadow shrinks — it looks physically pushed down. Two lines, huge tactile payoff.

## A color strip that says "this is one topic"

Each card carries an accent color set per-post via a CSS variable, then painted as a bar across the top with a pseudo-element:

```css
.card { --card-accent: var(--coral); }
.card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 8px;
  background: var(--card-accent);
}
```

In React we just hand the variable down as an inline style:

```tsx
<article
  className="card"
  style={{ ["--card-accent"]: `var(--${post.accent})` }}
>
```

Because it's a custom property, that one value also tints the card's number and its "Read →" link with no extra markup.

## Reveal on scroll, once

The cards fade-and-rise as they enter the viewport, but only the first time — replaying on every scroll-past is annoying:

```tsx
<motion.article
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-40px" }}
  transition={{ duration: 0.45, delay: (index % 3) * 0.06,
                ease: [0.34, 1.56, 0.64, 1] }}
/>
```

Notice the same overshoot curve from earlier, expressed as an array for Framer Motion. And `delay: (index % 3) * 0.06` staggers each **row** of three by a few frames, so a grid cascades in instead of popping all at once.

## The recipe, condensed

- **One accent-colored, zero-blur offset shadow**, reused everywhere.
- **One overshooting cubic-bezier**, reused everywhere.
- **Hover lifts, active presses.**
- **Per-item color via a single CSS custom property.**

That's the entire "playful" system. No framework, about forty lines of CSS doing the emotional heavy lifting.
