# Faster media, persistent navigation, and page transitions

## Goal
Make section photography and maps begin loading immediately, keep the navigation visible while scrolling, and add polished but restrained transitions between routes.

## Changes
- Replace idle, low-priority image warming with immediate preload/decode scheduling for all known section and event images, while retaining bounded parallel work so decoding does not freeze scrolling.
- Prioritize section hero images and preload the section image set from route metadata so downloads begin before React renders the page.
- Start the Google Maps script once at app startup, remove viewport-gated mounting from public maps, and retain stable placeholders while each map initializes.
- Remove the header hide-on-scroll state and transform so the sticky navigation remains visible at every scroll position on mobile and desktop.
- Refine the existing route entrance into a subtle opacity/vertical transition and add a short navigation progress cue; respect reduced-motion preferences.
- Correct the invalid image priority attribute found in browser telemetry.

## Verification
- Check `/seccoes`, a section detail page, `/eventos`, and `/contactos` in the browser.
- Confirm image and Maps requests start on initial page load, the header stays fixed while scrolling, and page transitions do not hide or overlap content.
- Confirm the latest build and runtime logs are clean.
