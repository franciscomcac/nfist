# NFIST — Under the Stars ??

> Cinematic, scroll-driven interactive hero experience created for the Physics Student Association at Instituto Superior Técnico (NFIST - IST Lisbon).

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nfist--preview.site-amber.svg)](https://nfist-preview.site)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 / CSS3](https://img.shields.io/badge/HTML5-CSS3-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![SVG Shaders](https://img.shields.io/badge/SVG-feColorMatrix-00599C.svg)](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix)

**?? Live Demo:** [https://nfist-preview.site](https://nfist-preview.site)

---

## ?? Overview

An interactive landing experience simulating a vertical journey through the night: from a rooftop student stargazing through a telescope, down fire-escape stairs, past cliffside trees, into the foreground grass.

### Technical Highlights
- **In-DOM Chroma-Keying with SVG Filters:** Uses dynamic `<feColorMatrix>` color-matrix filters and channel arithmetic to strip green-screen backgrounds from HTML5 video layers on the fly without heavy WebGL post-processing shaders.
- **Sub-Pixel Scroll Matrix Engine:** Custom `requestAnimationFrame` render loop calculating scroll progress, easing functions, and applying multi-layer 2D transform translations and scale factors across 6 discrete visual strata.
- **Zero-Dependency Architecture:** Engineered in pure vanilla ES6+ JavaScript and CSS3 with hardware-accelerated transforms (`will-change: transform`).

---

## ?? Quick Start

Open `index.html` directly in any modern web browser or serve with a local static server:

```bash
# Using Python
python -m http.server 8000

# Or using npx serve
npx serve .
```

---

## ?? License
MIT License
