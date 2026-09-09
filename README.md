# Daniel Sleiman — Engineering portfolio

A dependency-free static portfolio for Vercel. The redesign connects editorial project navigation with architectural drawing exploration, conceptual system overlays and concise guided review narratives.

## Run locally

```sh
python3 -m http.server 3000
```

Open http://localhost:3000. No build command, package installation or runtime service is required. Vercel should use the **Other** framework preset, with the repository root as the output directory. The existing GitHub/Vercel integration deploys the production branch.

## Structure

- `index.html`: semantic page sections and native modal project explorer.
- `styles.css`: responsive layouts, motion and drawing themes.
- `script.js`: project/view data, drawing navigation, hotspots, layer controls, guided stories and page interactions.
- `assets/`: optimised WebP images and selected drawing crops.
- Existing CV and Industrus cover-letter PDFs retain their original filenames and download links.
- `vercel.json`: asset caching and response headers.

## Content and evidence

The three editorial project titles describe the supplied material; they are not official project names. The residential set supports a terraced apartment study; the commercial set supports retail/commercial façade exploration; the hospitality set supports zone coordination. Do not relabel these as a high-rise or a mixed-use residential project without supporting evidence.

Project-specific scope, calculations and outcomes are not inferred from architectural drawings. The guided narratives distinguish general consultancy experience from project evidence. Hotspots and system polygons are conceptual review zones, not engineering assessments, certified details, construction instructions or BIM-derived layers.

Selected source views: residential cover visualisation, A3101 west elevation and A5601 threshold; commercial model visualisation, AR-300101 east elevation and AR-700001 façade excerpt; hospitality page 5 zone plan; supplied residential model image. Title blocks are omitted and a neighbouring address in the commercial elevation is redacted. Full source PDFs and the native Revit file are not included in this public repository.

The existing skyline image is atmospheric portfolio imagery. Its façade close-up is another view of the same asset, not a separate documented project or a site photograph. The residential hero image is a supplied architectural visualisation. Motion is a restrained 2D camera treatment, not a true 3D orbit.

The supplied Revit 2025 file was inspected at container metadata and embedded-preview level. Its preview is a disclaimer page; it does not expose usable model geometry. An IFC or GLB export is needed before implementing geometry-based 3D exploration. No Revit conversion is claimed.

Site photographs and project inspection records were not supplied. A drawing/site comparison is intentionally not fabricated. Add matched, approved site photographs and verified individual contributions to develop project-specific case studies further.

## Interaction and accessibility

- Project cards open a native `dialog`, with Escape dismissal and focus restoration.
- Drawings support pointer drag, touch pinch, zoom buttons and reset. Focus the drawing viewport to use arrow keys, `+`, `-` and `0`. Ctrl/Cmd + wheel zooms without intercepting normal page scrolling.
- Hotspots also appear as labelled buttons alongside the drawing. Layers show conceptual highlight zones.
- Guided walkthroughs have seven manually advanced stages, back and exit controls.
- Capability explanations use native disclosure elements for keyboard, touch and pointer input.
- Hero motion pauses on request, when offscreen and when the tab is hidden. Reduced-motion preferences disable animation and autoplay by default.
- Additional drawing assets load when selected; the initial page does not fetch the full architectural documents.

## Updating content

Edit the `projects`, `lenses`, `process` and `capabilities` arrays in `script.js`. Hotspot positions and rectangles use percentages of the associated cropped image. If replacing a crop, recalibrate those coordinates against that exact asset. Preserve original filenames for the PDF download links, or change the corresponding links in `index.html`.

## Verification

Verified with a local Chromium browser at desktop (1440 × 1000) and mobile (390 × 844) sizes: all three project explorers, alternate views, hotspot selection, layer filtering, zoom/reset, all seven guided stages, project navigation, Escape dismissal and focus restoration, mobile navigation, reduced-motion defaults and both PDF responses. No JavaScript errors or failed asset responses were recorded. Hero and explorer screenshots were visually reviewed at both sizes. HTML asset paths, JavaScript syntax and Vercel JSON were checked.

The portfolio owner explicitly approved publication of these selected architectural images and drawing excerpts to this public repository and its Vercel site.
