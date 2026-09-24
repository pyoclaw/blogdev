---
title: "Going Dark: The Red-Cosmic Reskin"
date: "2026-09-24"
tags: [css, design, animation, ux]
accent: coral
excerpt: "Same springy bones, brand-new skin. The site traded cream paper for deep space and crimson: a glowing celestial orb, a synthwave neon grid, poster-scale condensed type, and katakana accents — all pure CSS. Here's how each piece is built."
---

The blog kept its playful, motion-first personality but swapped its entire look: from warm cream-and-coral to a **dark, crimson, poster-grade** aesthetic — inspired by a stack of reference art heavy on red, huge condensed type, katakana, a celestial orb, and a synthwave grid. Almost none of it is an image file. Here's the whole re-skin, piece by piece.

## 1. The palette flip lived in one place

Because the theme was built on CSS custom properties from day one, re-skinning meant editing variables, not chasing hex codes through 800 lines. The accent *names* even stayed the same, so every post's `accent: coral` frontmatter kept working — they just point at new colors now:

```css
:root {
  --void: #0b0305;          /* near-black space */
  --surface: #180810;       /* card background */
  --paper: #f6e9ea;         /* light foreground text */
  --coral: #ff2d3f;         /* the signature red */
  --coral-deep: #c8102e;
  --lemon: #ffb03a;         /* katana gold */
  --mint: #ff6b8a;          /* rose */
  --grape: #a03bd6;         /* cosmic violet */
  --sky: #ff4d6d;           /* hot pink-red */
}
```

The one genuinely tricky bit: the old theme used a single `--ink` for *both* text and the hard drop-shadows. In a dark theme those split apart — text became `--paper` (light), while the neubrutalist shadow stayed pure black (`--shadow-ink`). Same shadow trick, opposite foreground.

## 2. A cosmic background with zero images

The page background is three stacked gradients — a crimson glow bleeding down from the top, a faint violet corner, and a vertical space-fade — plus a CSS-only **starfield** made entirely of tiny radial-gradients:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(1.4px 1.4px at 12% 18%, rgba(255,220,220,.7), transparent),
    radial-gradient(1.6px 1.6px at 63% 22%, rgba(255,255,255,.6), transparent),
    radial-gradient(1.2px 1.2px at 82% 47%, rgba(255,200,200,.5), transparent);
  /* …a handful more scattered around… */
}
```

Each gradient is a single dot; stacking a few gives a convincing sky for a few hundred bytes.

## 3. The celestial orb

The planet from the reference art is one `<div>`. A single radial-gradient with an off-center light source gives it a lit face and a dark limb; layered `box-shadow`s do the atmospheric rim-glow and the inner shadow that makes it read as a sphere:

```css
.orb {
  border-radius: 50%;
  background: radial-gradient(circle at 36% 32%,
    #ff8a7a 0%, #ff2d3f 30%, #b3122e 58%, #4c0713 100%);
  box-shadow:
    0 0 0 1.5px rgba(255,90,100,.7),      /* crisp rim */
    0 0 60px  rgba(255,45,63,.5),         /* near glow */
    0 0 160px rgba(200,16,46,.45),        /* far halo */
    inset -18px -22px 60px rgba(0,0,0,.55); /* terminator shadow */
}
```

A thin, squashed `.orb__ring` (`transform: rotate(-18deg) scaleY(.32)`) suggests an orbital ring, and Framer Motion bobs the whole thing on an endless 9-second float. No texture map, no canvas.

## 4. The synthwave neon grid

The receding floor is the classic trick: a flat plane painted with two `linear-gradient` line sets, then tipped away from the camera in 3D with `rotateX` under a `perspective`:

```css
.neon-grid { perspective: 320px; }              /* the camera */
.neon-grid__floor {
  transform: rotateX(78deg);                    /* lay the plane down */
  transform-origin: 50% 100%;
  background-image:
    linear-gradient(to right,  rgba(255,45,63,.7) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,45,63,.7) 1px, transparent 1px);
  background-size: 64px 64px;
  animation: grid-run 2.4s linear infinite;     /* endless approach */
}
@keyframes grid-run {
  from { background-position: 0 0; }
  to   { background-position: 0 64px; }          /* exactly one cell */
}
```

Two finishing touches sell it: a glowing `box-shadow` bar for the **horizon line**, and a `mask-image` fading the top of the grid to transparent so the lines dissolve into the distance instead of ending in a hard edge. Animating `background-position` by exactly one tile height makes the loop seamless.

## 5. Poster-scale type

The reference posters lean on enormous condensed type, so the display face switched to **Anton** — a single-weight, ultra-condensed grotesque — set uppercase at up to `9rem`, while body copy stays on Space Grotesk:

```css
:root { --font-display: "Anton", "Arial Narrow", sans-serif; }
.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 12vw, 9rem);
  line-height: 0.92;
  text-transform: uppercase;
}
```

Behind the headline sits a giant `-webkit-text-stroke` outline character (赤, "red") as a ghost watermark, and a vertical **katakana** label runs down the corner via `writing-mode: vertical-rl` — straight from the poster language.

## 6. One small motion fix for dark mode

The cursor blob used `mix-blend-mode: multiply`, which is invisible on black. On the dark theme it flips to `screen` (additive) so it *glows* instead of darkening:

```css
.spotlight {
  background: radial-gradient(circle,
    rgba(255,80,95,.9) 0%, rgba(255,45,63,.35) 60%, transparent 75%);
  mix-blend-mode: screen;
}
```

## Same soul, new suit

Every transition, tilt, magnetic pull, and spring from the previous posts still runs untouched — the reskin was almost entirely a *presentation* change, which is exactly the payoff of building on custom properties and keeping structure separate from style. New planet, same orbit.
