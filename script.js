"use strict";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const menu = $(".menu");
menu.addEventListener("click", () => {
  const open = $("#navigation").classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "Close ×" : "Menu +";
});
$$("#navigation a").forEach((a) =>
  a.addEventListener("click", () => {
    $("#navigation").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu +";
  }),
);
if ("IntersectionObserver" in window && !reduced.matches) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  $$(
    ".intro-grid,.section-heading,.project-card,.roles article,.cap-grid",
  ).forEach((e) => {
    e.classList.add("reveal-ready");
    observer.observe(e);
  });
}
const scenes = $$(".scene");
const captions = [
  "01 / RESIDENTIAL — ARCHITECTURAL VISUALISATION",
  "02 / SKYLINE — ATMOSPHERIC PORTFOLIO IMAGERY",
  "03 / FAÇADE DETAIL — ATMOSPHERIC PORTFOLIO IMAGERY",
];
let sceneIndex = 0,
  paused = reduced.matches,
  heroVisible = true,
  timer;
function showScene(n) {
  sceneIndex = n;
  scenes.forEach((im, i) => {
    if (i === n && im.dataset.src) {
      im.src = im.dataset.src;
      delete im.dataset.src;
    }
    im.classList.toggle("active", i === n);
  });
  $$("[data-scene]").forEach((b, i) =>
    b.setAttribute("aria-pressed", String(i === n)),
  );
  $("#scene-caption").textContent = captions[n];
}
function scheduleScenes() {
  clearInterval(timer);
  $(".hero").classList.toggle(
    "motion-paused",
    paused || !heroVisible || document.hidden,
  );
  $("#motion").textContent = paused ? "▶" : "Ⅱ";
  $("#motion").setAttribute(
    "aria-label",
    paused ? "Play cinematic motion" : "Pause cinematic motion",
  );
  if (!paused && heroVisible && !document.hidden)
    timer = setInterval(
      () => showScene((sceneIndex + 1) % scenes.length),
      9000,
    );
}
$$("[data-scene]").forEach((b) =>
  b.addEventListener("click", () => {
    showScene(Number(b.dataset.scene));
    scheduleScenes();
  }),
);
$("#motion").addEventListener("click", () => {
  paused = !paused;
  scheduleScenes();
});
document.addEventListener("visibilitychange", scheduleScenes);
reduced.addEventListener("change", () => {
  paused = reduced.matches;
  scheduleScenes();
});
if ("IntersectionObserver" in window)
  new IntersectionObserver(([e]) => {
    heroVisible = e.isIntersecting;
    scheduleScenes();
  }).observe($(".hero"));
scheduleScenes();
const lenses = {
  architecture: {
    label: "THE WHOLE BUILDING",
    title: "Start with design intent.",
    text: "The form, openings and terraces establish the context. Engineering review connects these architectural decisions to support, weathering and construction.",
    svg: "",
  },
  facade: {
    label: "BUILDING ENVELOPE",
    title: "Follow the interfaces.",
    text: "Cladding, windows and balcony edges meet at the façade. I look for continuity across those junctions, including tolerances, fixing access and the sequence of installation.",
    svg: '<polygon points="232,594 552,614 595,650 591,874 233,837"/><polygon points="299,369 600,399 603,489 281,476"/>',
  },
  glazing: {
    label: "GLASS + FRAMING",
    title: "Look beyond the glass.",
    text: "A pane belongs to a system. Review questions include its support, framing, edge conditions and the relationship between glazing, seals and the surrounding construction.",
    svg: '<polygon points="244,615 543,630 544,687 237,669"/><polygon points="238,697 547,713 547,760 237,742"/><polygon points="240,771 546,786 547,843 237,824"/><polygon points="350,398 582,417 581,474 349,454"/>',
  },
  structure: {
    label: "SUPPORT + CONNECTIONS",
    title: "Ask where the load goes.",
    text: "Visible slab edges and supports provide a starting point. Actual load paths, connection capacities and movement allowances require structural information and assessment.",
    svg: '<path d="M228 583 L553 604 L591 621 M229 674 L552 692 M230 748 L552 770 M239 610 L239 830 M567 624 L567 863"/>',
  },
  water: {
    label: "WEATHERING + DRAINAGE",
    title: "Trace the path of water.",
    text: "Terraces and thresholds bring systems together. I look at membrane continuity, perimeter seals, drainage interfaces and the effect of construction tolerances.",
    svg: '<path d="M281 496 L449 514 L514 495 L596 503 M245 590 L547 612 M239 683 L549 704 M236 755 L550 778 M238 834 L548 858"/>',
  },
};
$$("[data-lens]").forEach((b) =>
  b.addEventListener("click", () => {
    const lens = lenses[b.dataset.lens];
    $$("[data-lens]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)),
    );
    $("#lens-label").textContent = lens.label;
    $("#lens-title").textContent = lens.title;
    $("#lens-text").textContent = lens.text;
    $("#lens-overlay").innerHTML = lens.svg;
  }),
);
const process = [
  [
    "Design intent",
    "Understand what the building is trying to do.",
    "Read the architectural and structural information together. Identify interfaces, drawing discrepancies and the information needed to progress a review.",
  ],
  [
    "Engineering review",
    "Turn an assumption into a question.",
    "Assist with glazing, aluminium, member and connection assessments. Check the inputs and support conditions before relying on a result.",
  ],
  [
    "Detailing",
    "Make the interface buildable.",
    "Review shop drawings and junctions. Consider movement, water management, tolerances, fixing access and how neighbouring systems meet.",
  ],
  [
    "Construction",
    "Connect the detail to the sequence.",
    "Coordinate with architects, builders, contractors and suppliers. Practical construction experience helps me recognise where a drawing needs clarification.",
  ],
  [
    "Inspection",
    "Compare intent with installation.",
    "Participate in site inspections and window and façade water testing. Document observations, communicate defects and track required follow-up.",
  ],
  [
    "Performance",
    "Close the information loop.",
    "Support technical reporting and communicate what was checked, what was observed and what remains unresolved. Good records help the team make defensible decisions.",
  ],
];
$(".process").innerHTML = process
  .map(
    (p, i) =>
      `<button data-process="${i}" aria-pressed="${i === 0}"><span>0${i + 1} →</span>${p[0]}</button>`,
  )
  .join("");
$$("[data-process]").forEach((b) =>
  b.addEventListener("click", () => {
    const i = Number(b.dataset.process),
      p = process[i];
    $$("[data-process]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)),
    );
    $("#process-number").textContent = `0${i + 1} / ${p[0].toUpperCase()}`;
    $("#process-title").textContent = p[1];
    $("#process-copy").textContent = p[2];
  }),
);
const capabilities = [
  [
    "Façade & building envelope",
    "Reviewing the relationship between windows, cladding, perimeter seals and adjacent construction. Continuity matters most where systems meet.",
  ],
  [
    "Glazing & aluminium",
    "Assisting with glass and aluminium assessments, interpreting support conditions and coordinating proposed systems with drawings and product information.",
  ],
  [
    "Structural assessment & connections",
    "Supporting member and fixing checks, reviewing applied loads and communicating the implications of the assessment to the project team.",
  ],
  [
    "Weatherproofing & water testing",
    "Reviewing weathering interfaces and participating in window and façade water testing, with observations recorded for follow-up and rectification.",
  ],
  [
    "Drawing review & technical reporting",
    "Reviewing architectural, structural and shop drawings; preparing clear mark-ups, technical reports and inspection records.",
  ],
  [
    "Site inspections & coordination",
    "Connecting documentation with installed work and coordinating issues with architects, builders, engineers, contractors and suppliers.",
  ],
];
$("#capability-list").innerHTML = capabilities
  .map(([t, c]) => `<details><summary>${t}</summary><p>${c}</p></details>`)
  .join("");
// Coordinates are percentages of each cropped drawing, not of the viewport.
// These are editorial review zones, never a replacement for a design model.
const projects = [
  {
    title: "Terraces & thresholds",
    type: "RESIDENTIAL",
    summary:
      "A terraced residential building with glazed openings, balcony edges and a stepped envelope.",
    overview:
      "Explore how repeated balcony and window interfaces relate to the overall building. The supplied elevations and threshold detail show where water management, support and architectural intent meet.",
    views: [
      {
        name: "West elevation",
        asset: "residential-elevation.webp",
        source:
          "Architectural elevation excerpt · supplied residential set, sheet A3101 · title blocks omitted",
        spots: [
          {
            title: "Glazed openings",
            layer: "glazing",
            x: 38,
            y: 57,
            zone: [22, 50, 49, 17],
            text: "Repeated glazed openings meet the balcony edge. Review the glass support, frame configuration and continuity of perimeter seals alongside the opening schedule.",
          },
          {
            title: "Balcony interfaces",
            layer: "water",
            x: 51,
            y: 72,
            zone: [10, 68, 80, 5],
            text: "Balcony edges and door thresholds need coordinated water management. Follow the relationship between finished levels, subsills, membrane upturns and drainage.",
          },
          {
            title: "Slab edge & support",
            layer: "structure",
            x: 76,
            y: 42,
            zone: [15, 40, 66, 5],
            text: "A slab edge is both a structural interface and part of the envelope. Confirm fixing substrates, edge conditions and movement using the structural and shop-drawing information.",
          },
        ],
      },
      {
        name: "Threshold detail",
        asset: "threshold.webp",
        source:
          "Architectural threshold excerpt · supplied residential set, sheet A5601 · design intent only",
        spots: [
          {
            title: "Door & subsill interface",
            layer: "glazing",
            x: 43,
            y: 40,
            zone: [36, 25, 14, 36],
            text: "The door frame sits at the transition from exterior to interior. The subsill, perimeter seals and adjacent finishes need to be read as one junction.",
          },
          {
            title: "Membrane continuity",
            layer: "water",
            x: 51,
            y: 68,
            zone: [8, 61, 77, 12],
            text: "Trace the membrane through the threshold junction. Upturns, waterstops and changes in material need a coordinated detail and an installation sequence.",
          },
          {
            title: "Supporting substrate",
            layer: "structure",
            x: 47,
            y: 83,
            zone: [9, 77, 75, 13],
            text: "The supporting slab and rebates influence the available build-up. Site tolerances must be checked against the space needed by the weathering system.",
          },
        ],
      },
    ],
  },
  {
    title: "The façade interface",
    type: "COMMERCIAL",
    summary:
      "A commercial building with retail at ground level, glazed façades and upper roof terraces.",
    overview:
      "The architectural material combines commercial levels, retail frontage and a roof terrace. Explore how the façade framing, slab bands and terrace junctions interact.",
    views: [
      {
        name: "East elevation",
        asset: "commercial-elevation.webp",
        source:
          "Architectural elevation excerpt · supplied commercial set, sheet AR-300101 · title blocks omitted",
        spots: [
          {
            title: "Glazing & frame rhythm",
            layer: "glazing",
            x: 46,
            y: 49,
            zone: [24, 32, 69, 43],
            text: "The elevation shows glazed bays divided by framing and horizontal bands. Review the support, joints and movement interfaces using the corresponding façade sections.",
          },
          {
            title: "Roof terrace junction",
            layer: "water",
            x: 55,
            y: 15,
            zone: [7, 8, 83, 12],
            text: "The roof terrace meets glazing, planters and the façade edge. Waterproofing terminations and drainage interfaces need coordination across these systems.",
          },
          {
            title: "Horizontal support zones",
            layer: "structure",
            x: 66,
            y: 77,
            zone: [18, 73, 77, 5],
            text: "Horizontal façade bands align with the floor zones. Architectural elevations establish the geometry; structural drawings are needed to confirm the actual supports and connection design.",
          },
        ],
      },
      {
        name: "Façade detail",
        asset: "commercial-detail.webp",
        source:
          "Architectural façade excerpt · supplied commercial set, sheet AR-700001 · design intent only",
        spots: [
          {
            title: "Glazed bay",
            layer: "glazing",
            x: 40,
            y: 47,
            zone: [23, 32, 53, 32],
            text: "Read the bay together with the related plan and section. Frame intersections, panel edges and adjacent finishes can create coordination issues that an elevation alone does not resolve.",
          },
          {
            title: "Horizontal junction",
            layer: "water",
            x: 48,
            y: 66,
            zone: [13, 62, 73, 7],
            text: "The junction at the horizontal band is a review location for weather seals, drainage and movement. The overlay identifies a consideration rather than a verified waterproofing design.",
          },
          {
            title: "Façade support",
            layer: "structure",
            x: 77,
            y: 49,
            zone: [73, 19, 6, 64],
            text: "Confirm how façade components are supported and how fixing access is maintained. Architectural detail does not establish connection capacity.",
          },
        ],
      },
    ],
  },
  {
    title: "Coordinating complexity",
    type: "HOSPITALITY",
    summary:
      "A large hospitality development organised across multiple functional and construction zones.",
    overview:
      "This plan is a study in coordination: room layouts, circulation, perimeter walls and adjacent zones share one drawing. Explore how to break that complexity into interfaces that can be reviewed and communicated.",
    views: [
      {
        name: "Coordinated plan",
        asset: "hospitality-plan.webp",
        source:
          "Architectural zone-plan excerpt · supplied hospitality set, page 5 · identifying title blocks omitted",
        spots: [
          {
            title: "Perimeter interfaces",
            layer: "facade",
            x: 5,
            y: 48,
            zone: [2, 21, 7, 47],
            text: "Start with the perimeter and identify changes in wall and opening types. Compare the plan with the relevant elevations, schedules and shop drawings before resolving a façade interface.",
          },
          {
            title: "Zone coordination",
            layer: "architecture",
            x: 53,
            y: 50,
            zone: [40, 28, 23, 45],
            text: "Break the plan into manageable zones. Match grids and references, then track interfaces across disciplines so that a local change is understood in its wider context.",
          },
          {
            title: "Construction interfaces",
            layer: "structure",
            x: 28,
            y: 72,
            zone: [12, 65, 33, 16],
            text: "At changes in use and construction, check the relationship between partitions, supporting elements and adjacent works. The plan is a coordination reference, not a structural verification.",
          },
        ],
      },
    ],
  },
];
const dialog = $("#project-dialog"),
  viewport = $("#viewport"),
  plane = $("#drawing-plane"),
  drawing = $("#drawing-image");
let projectIndex = 0,
  viewIndex = 0,
  layer = "all",
  activeSpot = -1,
  story = -1,
  lastFocus,
  zoom = 1,
  panX = 0,
  panY = 0,
  baseW = 1,
  baseH = 1;
let points = new Map(),
  dragStart = null,
  pinch = null,
  loadVersion = 0;
const project = () => projects[projectIndex];
const view = () => project().views[viewIndex];
function openProject(i) {
  if (!dialog.open) {
    lastFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add("modal-open");
  }
  projectIndex = (i + projects.length) % projects.length;
  viewIndex = 0;
  story = -1;
  layer = "all";
  activeSpot = -1;
  $("#project-index").textContent =
    `PROJECT 0${projectIndex + 1} / ${project().type}`;
  $("#project-title").textContent = project().title;
  $("#project-summary").textContent = project().summary;
  $("#drawing-tabs").innerHTML = project()
    .views.map(
      (v, n) =>
        `<button data-view="${n}" aria-pressed="${n === 0}">${v.name}</button>`,
    )
    .join("");
  $$("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      story = -1;
      setView(Number(b.dataset.view));
    }),
  );
  setView(0);
  dialog.scrollTop = 0;
}
function finishClose() {
  document.body.classList.remove("modal-open");
  points.clear();
  if (lastFocus) lastFocus.focus();
}
$("#close-project").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", finishClose);
$$("[data-project]").forEach((b) =>
  b.addEventListener("click", () => openProject(Number(b.dataset.project))),
);
$("#next-project").addEventListener("click", () =>
  openProject(projectIndex + 1),
);
$("#previous-project").addEventListener("click", () =>
  openProject(projectIndex - 1),
);
function setView(n) {
  viewIndex = n;
  activeSpot = -1;
  layer = "all";
  const version = ++loadVersion;
  $$("[data-view]").forEach((b) =>
    b.setAttribute("aria-pressed", String(Number(b.dataset.view) === n)),
  );
  drawing.alt = `${project().type.toLowerCase()} ${view().name.toLowerCase()} architectural drawing`;
  drawing.onload = () => {
    if (version === loadVersion) {
      fitDrawing();
      renderSpots();
    }
  };
  drawing.onerror = () => {
    $("#drawing-source").textContent =
      "Drawing could not load. Choose another view or reload the page.";
  };
  drawing.src = `assets/${view().asset}`;
  $("#drawing-source").textContent = view().source;
  renderLayers();
  renderSpots();
  overview();
  syncStory();
  if (drawing.complete && drawing.naturalWidth) fitDrawing();
}
function fitDrawing() {
  const w = viewport.clientWidth,
    h = viewport.clientHeight;
  const fit = Math.min(
    (w - 55) / drawing.naturalWidth,
    (h - 75) / drawing.naturalHeight,
  );
  if (!Number.isFinite(fit)) return;
  baseW = drawing.naturalWidth * fit;
  baseH = drawing.naturalHeight * fit;
  plane.style.width = `${baseW}px`;
  plane.style.height = `${baseH}px`;
  zoom = 1;
  panX = (w - baseW) / 2;
  panY = (h - baseH) / 2;
  transform();
}
function transform() {
  const w = viewport.clientWidth,
    h = viewport.clientHeight;
  panX = Math.max(-baseW * zoom + 45, Math.min(w - 45, panX));
  panY = Math.max(-baseH * zoom + 45, Math.min(h - 45, panY));
  plane.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
  plane.style.setProperty("--inverse-scale", String(1 / zoom));
  $("#zoom-value").textContent = `${Math.round(zoom * 100)}%`;
  $("#zoom-out").disabled = zoom <= 1;
  $("#zoom-in").disabled = zoom >= 5;
}
function changeZoom(
  z,
  cx = viewport.clientWidth / 2,
  cy = viewport.clientHeight / 2,
) {
  z = Math.max(1, Math.min(5, z));
  const ratio = z / zoom;
  panX = cx - (cx - panX) * ratio;
  panY = cy - (cy - panY) * ratio;
  zoom = z;
  transform();
}
function moveTo(s) {
  zoom = 1.8;
  panX = viewport.clientWidth / 2 - ((baseW * s.x) / 100) * zoom;
  panY = viewport.clientHeight / 2 - ((baseH * s.y) / 100) * zoom;
  transform();
}
function overview() {
  activeSpot = -1;
  $("#inspector-label").textContent = "PROJECT OVERVIEW";
  $("#inspector-title").textContent = project().title;
  $("#inspector-text").textContent = project().overview;
  renderSpots();
}
function renderLayers() {
  const names = {
    all: "All systems",
    architecture: "Architecture",
    facade: "Façade",
    glazing: "Glazing",
    water: "Water management",
    structure: "Structure",
  };
  const keys = ["all", ...new Set(view().spots.map((s) => s.layer))];
  $("#layer-controls").innerHTML = keys
    .map(
      (k) =>
        `<button data-layer="${k}" aria-pressed="${layer === k}">${names[k]}</button>`,
    )
    .join("");
  $$("[data-layer]").forEach((b) =>
    b.addEventListener("click", () => {
      story = -1;
      layer = b.dataset.layer;
      activeSpot = -1;
      renderLayers();
      overview();
      syncStory();
    }),
  );
}
function renderSpots() {
  const visible = view()
    .spots.map((s, i) => ({ ...s, i }))
    .filter((s) => layer === "all" || s.layer === layer);
  $("#hotspots").innerHTML = visible
    .map(
      (s) =>
        `<button class="hotspot" data-spot="${s.i}" style="left:${s.x}%;top:${s.y}%" aria-label="${s.title}" aria-pressed="${activeSpot === s.i}">${String(s.i + 1).padStart(2, "0")}</button>`,
    )
    .join("");
  $("#hotspot-list").innerHTML = visible
    .map(
      (s) =>
        `<button data-spot="${s.i}" aria-pressed="${activeSpot === s.i}">0${s.i + 1} / ${s.title} ↗</button>`,
    )
    .join("");
  $$("[data-spot]").forEach((b) =>
    b.addEventListener("click", () => {
      story = -1;
      selectSpot(Number(b.dataset.spot));
      syncStory();
    }),
  );
  const highlighted =
    activeSpot >= 0
      ? [view().spots[activeSpot]]
      : layer !== "all"
        ? visible
        : [];
  $("#drawing-zones").setAttribute("class", layer);
  $("#drawing-zones").innerHTML = highlighted
    .map(
      (s) =>
        `<rect x="${s.zone[0]}" y="${s.zone[1]}" width="${s.zone[2]}" height="${s.zone[3]}"/>`,
    )
    .join("");
}
function selectSpot(i) {
  activeSpot = i;
  const s = view().spots[i];
  $("#inspector-label").textContent = "ENGINEERING REVIEW LENS";
  $("#inspector-title").textContent = s.title;
  $("#inspector-text").textContent = s.text;
  moveTo(s);
  renderSpots();
}
const storyTitles = [
  "Project",
  "Engineering challenge",
  "Drawing / detail",
  "My involvement",
  "Engineering considerations",
  "Site reality",
  "Reflection",
];
function syncStory() {
  $("#start-story").hidden = story >= 0;
  $("#story-controls").hidden = story < 0;
  if (story < 0) return;
  $("#story-progress").textContent =
    `0${story + 1} / 07 — ${storyTitles[story]}`;
  $("#story-back").disabled = story === 0;
  $("#story-next").textContent = story === 6 ? "Finish ✓" : "Next →";
}
function renderStory() {
  layer = "all";
  renderLayers();
  if (story === 0) {
    fitDrawing();
    overview();
  } else if (story === 1) {
    selectSpot(0);
    $("#inspector-label").textContent = "02 / ENGINEERING CHALLENGE";
  } else if (story === 2) {
    selectSpot(1);
    $("#inspector-label").textContent = "03 / DRAWING + DETAIL";
  } else if (story === 3) {
    $("#inspector-label").textContent = "04 / EXPERIENCE CONTEXT";
    $("#inspector-title").textContent = "Contributing to the review.";
    $("#inspector-text").textContent =
      "My wider consultancy experience includes drawing reviews, assessments, site inspections, testing and reporting. These architectural files show the project context; they do not establish which individual elements I assessed.";
  } else if (story === 4) {
    selectSpot(2);
    $("#inspector-label").textContent = "05 / ENGINEERING CONSIDERATIONS";
  } else if (story === 5) {
    $("#inspector-label").textContent = "06 / SITE REALITY";
    $("#inspector-title").textContent = "A drawing is the starting point.";
    $("#inspector-text").textContent =
      "Installed conditions need to be compared with design intent: substrate, access, tolerances, seals and interfaces. Site photographs and inspection records have not been supplied for this walkthrough.";
  } else {
    $("#inspector-label").textContent = "07 / REFLECTION";
    $("#inspector-title").textContent = "Close the loop.";
    $("#inspector-text").textContent =
      "A useful review makes interfaces and unresolved questions visible. The next step is to connect the drawing, supporting assessments and site records. No project outcome is claimed from the architectural material alone.";
    fitDrawing();
  }
  syncStory();
}
$("#start-story").addEventListener("click", () => {
  story = 0;
  renderStory();
});
$("#story-next").addEventListener("click", () => {
  if (story === 6) {
    story = -1;
    overview();
    syncStory();
  } else {
    story++;
    renderStory();
  }
});
$("#story-back").addEventListener("click", () => {
  story = Math.max(0, story - 1);
  renderStory();
});
$("#story-exit").addEventListener("click", () => {
  story = -1;
  overview();
  fitDrawing();
  syncStory();
});
$("#zoom-in").addEventListener("click", () => changeZoom(zoom + 0.4));
$("#zoom-out").addEventListener("click", () => changeZoom(zoom - 0.4));
$("#zoom-reset").addEventListener("click", fitDrawing);
$("#drawing-theme").addEventListener("click", () => {
  const dark = viewport.classList.toggle("dark-drawing");
  $("#drawing-theme").setAttribute("aria-pressed", String(dark));
  $("#drawing-theme").textContent = dark ? "Light drawing" : "Dark drawing";
});
viewport.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      changeZoom(
        zoom * Math.exp(-e.deltaY * 0.008),
        e.clientX - r.left,
        e.clientY - r.top,
      );
    }
  },
  { passive: false },
);
viewport.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button")) return;
  viewport.setPointerCapture(e.pointerId);
  points.set(e.pointerId, { x: e.clientX, y: e.clientY });
  dragStart = { x: e.clientX, y: e.clientY, px: panX, py: panY };
  viewport.classList.add("dragging");
  if (points.size === 2) {
    const [a, b] = [...points.values()];
    pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
  }
});
viewport.addEventListener("pointermove", (e) => {
  if (!points.has(e.pointerId)) return;
  points.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (points.size === 2 && pinch) {
    const [a, b] = [...points.values()],
      r = viewport.getBoundingClientRect();
    changeZoom(
      (pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.distance,
      (a.x + b.x) / 2 - r.left,
      (a.y + b.y) / 2 - r.top,
    );
  } else if (dragStart) {
    panX = dragStart.px + e.clientX - dragStart.x;
    panY = dragStart.py + e.clientY - dragStart.y;
    transform();
  }
});
function pointerEnd(e) {
  points.delete(e.pointerId);
  pinch = null;
  viewport.classList.remove("dragging");
  const next = [...points.values()][0];
  dragStart = next ? { x: next.x, y: next.y, px: panX, py: panY } : null;
}
viewport.addEventListener("pointerup", pointerEnd);
viewport.addEventListener("pointercancel", pointerEnd);
viewport.addEventListener("lostpointercapture", pointerEnd);
viewport.addEventListener("keydown", (e) => {
  if (e.target !== viewport) return;
  const keys = [
    "+",
    "=",
    "-",
    "0",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];
  if (!keys.includes(e.key)) return;
  e.preventDefault();
  if (e.key === "+" || e.key === "=") changeZoom(zoom + 0.3);
  else if (e.key === "-") changeZoom(zoom - 0.3);
  else if (e.key === "0") fitDrawing();
  else {
    panX += e.key === "ArrowLeft" ? 35 : e.key === "ArrowRight" ? -35 : 0;
    panY += e.key === "ArrowUp" ? 35 : e.key === "ArrowDown" ? -35 : 0;
    transform();
  }
});
let resizeTimer;
new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (dialog.open && drawing.naturalWidth) fitDrawing();
  }, 100);
}).observe(viewport);
