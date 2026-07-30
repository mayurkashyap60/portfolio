/* ═══════════════════════════════════════════════════════════
   MAYUR KASHYAP · PORTFOLIO 2.0 — main.js
   GSAP + ScrollTrigger + SplitText + Lenis
   ═══════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // gates pre-hidden CSS states (hero reveal lines) — without JS, all content renders
  document.body.classList.add("js-anim");

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (REDUCED) document.body.classList.add("no-motion");

  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ─────────────── LENIS SMOOTH SCROLL ─────────────── */
  let lenis = null;
  if (!REDUCED) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "auto" });
  };

  /* ─────────────── HEADER SCROLL STATE ─────────────── */
  {
    const header = document.querySelector(".header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────── REVEAL-ON-VIEW SYSTEM ───────────────
     All entrance animations run through IntersectionObserver. Content is
     NEVER pre-hidden by scroll-trigger state: elements sit visible in pure
     CSS, get hidden only at the instant their animation starts, and are
     restored to pure CSS on completion (clearProps). If JS, fonts, or the
     observer ever fail, the worst case is "no animation" — never
     "invisible content" or stuck half-states. */
  const revealMap = new Map();
  const io = (!REDUCED && "IntersectionObserver" in window)
    ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const fn = revealMap.get(en.target);
        revealMap.delete(en.target);
        if (fn) fn();
      });
    }, { rootMargin: "0px 0px -8% 0px" })
    : null;
  const onReveal = (el, fn) => { if (el && io) { revealMap.set(el, fn); io.observe(el); } };

  /* stagger a group into view; CSS transitions are suspended for the tween
     so hover transitions can't fight GSAP's frames, then every inline prop
     is cleared so elements return to their natural CSS state */
  const enterStagger = (container, childSel, fromVars = {}) => {
    if (!container) return;
    const els = gsap.utils.toArray(childSel, container);
    if (!els.length) return;
    onReveal(container, () => {
      els.forEach((el) => { el.style.transition = "none"; });
      gsap.fromTo(els,
        { y: 36, opacity: 0, ...fromVars },
        {
          y: 0, yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out",
          stagger: 0.08, clearProps: "all"
        });
    });
  };

  /* ─────────────── MAGNETIC ELEMENTS ─────────────── */
  if (!TOUCH && !REDUCED) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const strength = 0.35;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ─────────────── SPLIT HEADINGS ───────────────
     Splitting waits for document.fonts.ready so line breaks are measured
     with the real webfonts. Headings are never pre-hidden — chars are only
     hidden once the split exists AND a reveal is guaranteed to follow. */
  const splitHeadings = [];
  let heroIntroRequested = false;
  let heroRevealed = false;

  const revealHeading = (entry) => {
    gsap.to(entry.targets, {
      yPercent: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.9, ease: "power4.out",
      stagger: { each: 0.016, from: "start" },
      // drop the leftover blur filter so chars don't hold a stacking context
      onComplete: () => gsap.set(entry.targets, { clearProps: "filter,willChange" }),
    });
  };

  const revealHero = () => {
    const h = splitHeadings.find((s) => s.el.classList.contains("hero__title"));
    if (h && !heroRevealed) { heroRevealed = true; revealHeading(h); }
  };

  if (!REDUCED && io) {
    /* With no loader curtain to hide behind, the hero headline would paint
       unsplit, then get hidden by the split, then animate in — a visible
       flash. Hide it until the split exists. The class is added ONLY on the
       path that is guaranteed to remove it below, so it can never stick. */
    document.body.classList.add("split-pending");

    // don't hold headings hostage if webfonts stall — 2.5s ceiling
    const fontsReady = Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 2500)),
    ]);
    fontsReady.then(() => {
      document.querySelectorAll("[data-split]").forEach((el) => {
        try {
          const split = new SplitText(el, {
            type: "lines,chars",
            linesClass: "split-line",
            charsClass: "split-char",
            // keep gradient words whole — splitting them to chars would strip
            // their background-clip gradient (chars get hoisted out of the em)
            ignore: ".hero__em",
          });
          // animate ignored gradient words as single units alongside the chars
          const targets = [...split.chars, ...el.querySelectorAll(".hero__em")];
          gsap.set(targets, { yPercent: 110, opacity: 0, filter: "blur(6px)" });
          splitHeadings.push({ el, split, targets });
        } catch (e) { /* fall through — heading shows unsplit */ }
      });

      /* unconditional: if the split succeeded the chars carry their own hidden
         state, and if it threw the heading simply shows as plain text */
      document.body.classList.remove("split-pending");

      if (heroIntroRequested) revealHero();

      splitHeadings.forEach((entry) => {
        if (entry.el.classList.contains("hero__title")) return;
        onReveal(entry.el, () => revealHeading(entry));
      });
      ScrollTrigger.refresh();
    });
  }

  /* ─────────────── HERO INTRO ───────────────
     There is no loader, so the hero reveals as soon as the script runs.
     `.reveal-line` is pre-hidden only while JS is active and motion is
     allowed, so this call is what un-hides it — it must always fire. */
  const introHero = () => {
    // headline chars + kicker/sub/cta lines
    heroIntroRequested = true;
    revealHero();
    gsap.to("#hero .reveal-line", {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      stagger: 0.12, delay: REDUCED ? 0 : 0.15,
    });
  };

  if (REDUCED) {
    document.querySelectorAll(".reveal-line").forEach((el) => {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }
  introHero();

  /* ─────────────── HERO VIDEO ───────────────
     The markup already declares autoplay+muted+playsinline, but some browsers
     still refuse (Safari Low Power Mode, data-saver). Nudge it, and if the
     nudge is rejected leave the poster frame showing rather than a blank box. */
  (() => {
    const video = document.querySelector(".hero__video");
    if (!video) return;
    const nudge = () => video.play().catch(() => { });
    nudge();
    video.addEventListener("loadeddata", nudge, { once: true });
    // last resort: the first user gesture anywhere satisfies every autoplay policy
    document.addEventListener("pointerdown", nudge, { once: true });
  })();

  /* ─────────────── ANCHOR CLICKS THROUGH LENIS ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = a.getAttribute("href");
      if (target.length > 1 && document.querySelector(target)) {
        e.preventDefault(); scrollToTarget(target);
      }
    });
  });

  /* ─────────────── SCROLL-POSITION EFFECTS (scrub — self-correcting) ─────────────── */
  if (!REDUCED) {
    // subtle page "breathing" — bg shifts slightly warmer as you descend
    gsap.to("body", {
      backgroundColor: "#08070c",
      scrollTrigger: { trigger: "#work", start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  /* ─────────────── ENTRANCES (observer-driven, fail-safe) ─────────────── */
  // portrait mask reveal
  onReveal(document.querySelector(".about__portrait"), () => {
    gsap.fromTo(".mask-reveal",
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power4.inOut", clearProps: "clipPath" });
  });

  // stat strip + blog cards
  enterStagger(document.querySelector(".stats"), ".stats__item");
  enterStagger(document.querySelector(".blog__grid"), ".bcard");

  /* ─────────────── STAT COUNTERS ───────────────
     markup holds the final numbers, so no-JS / reduced-motion show them as-is */
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = +el.dataset.counter;
    onReveal(el, () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.v); },
      });
    });
  });

  /* ─────────────── EXPERIENCE — CAREER INDEX ─────────────── */
  enterStagger(document.getElementById("xpIndex"), ".xpi__row");

  /* ─────────────── BRAND MARQUEES ───────────────
     The scroll itself is a pure CSS keyframe (see .marquee__track). All this
     does is build the two identical halves the -50% keyframe depends on.

     Why CSS and not a GSAP tween: the old version measured track.scrollWidth
     on init to derive the loop distance. With 60 <img> children that measure
     runs before the images have decoded, so the distance was wrong and the
     loop showed a gap — and it never recomputed on resize. A percentage-based
     keyframe needs no measurement at all, so there is nothing to get stale. */
  (() => {
    const rows = document.querySelectorAll("[data-brands]");
    if (!rows.length) return;

    const LOGOS = Array.from({ length: 30 }, (_, i) => `images/brands/p${i + 1}.png`);

    rows.forEach((track) => {
      const order = track.dataset.brands === "reverse" ? [...LOGOS].reverse() : LOGOS;
      /* NOT loading="lazy": the row is moved by transform, and lazy-loading
         decides from layout position, not transform — off-screen logos could
         scroll into view still blank. fetchpriority="low" keeps these 30 files
         (~390 KB, deduped across both halves) behind the hero video instead. */
      const half = (hidden) => order
        .map((src) => `<div class="brand"${hidden ? ' aria-hidden="true"' : ""}>` +
          `<img src="${src}" alt="" decoding="async" fetchpriority="low" /></div>`)
        .join("");
      // exactly two halves — the keyframe translates by precisely one of them
      track.innerHTML = half(false) + half(true);
      if (!REDUCED) track.classList.add("is-ready");
    });
  })();

  /* ─────────────── WORK — PROJECT INDEX + CASE DRAWER ───────────────
     One data source drives three surfaces: the row list, the visual that
     follows the cursor on hover, and the drawer that opens on click.
     `link` is deliberately absent on the internal Bajaj Capital builds —
     there is no public URL, so the CTA falls back to the contact anchor
     rather than inventing one. */
  (() => {
    /* ── SHOTS ──
       Placeholder screenshots so the carousel has something to move. Replace
       these paths with real captures — any count works, the UI adapts, and a
       single-shot case hides the arrows/dots automatically. Keep them 16:10. */
    // const PH = [
    //   "images/cases/placeholder-01.svg",
    //   "images/cases/placeholder-02.svg",
    //   "images/cases/placeholder-03.svg",
    // ];

    const PH1 = [
      "images/cases/8.png",
      "images/cases/9.png",
      "images/cases/10.png",
    ];
    const PH2 = [
      "images/cases/1.png",
      "images/cases/2.png",
      "images/cases/3.png",
      "images/cases/4.png",
      "images/cases/5.png",
      "images/cases/7.png",
      "images/cases/6.png",
    ];
    const PH3 = [
      "images/cases/11.jpg",
      "images/cases/12.jpg",
      "images/cases/13.jpg",
    ];
    const PH4 = [
      "images/cases/14.jpg",
      "images/cases/15.jpg",
      "images/cases/16.jpg",
    ];

    const PROJECTS = [
      {
        id: "ikigai",
        name: "Ikigai365",
        tags: "EDITORIAL · STORYTELLING · DESIGN · FRONTEND",
        client: "Ikigai365 — a founding team across Japan, Singapore and India",
        link: "https://www.ikigai365.com/home",
        linkLabel: "Visit ikigai365.com",
        shots: PH1,
        desc:
          "A book and a philosophy, given a home on the web — a centuries-old Japanese " +
          "idea that life is worth living in small, everyday moments, turned into an " +
          "unhurried reading experience.",
        problem:
          "Ikigai is one of the most misquoted ideas on the internet, flattened into a " +
          "four-circle diagram and sold as a career hack. This site had to carry the real " +
          "thing: a Japanese way of life, a printed book carrying a foreword from His " +
          "Holiness the Dalai Lama, and four intimate life stories from Japan — without " +
          "tipping into self-help cliché on one side or corporate gloss on the other.",
        approach:
          "I designed for restraint. Editorial typography and generous whitespace set a " +
          "reading pace instead of a scroll race. The four seasonal stories each get their " +
          "own card and their own way in, so a visitor can wander rather than be funnelled. " +
          "Motion is deliberately slow — fades and soft reveals that feel closer to turning " +
          "a page than to a product demo — and the reflection prompts sit beside the stories " +
          "that earn them.",
        result:
          "A site that reads like the book it belongs to. Visitors land on a philosophy " +
          "rather than a pitch, and Fujio-san, Hanazawa-san, Ishizaki-san and Ogawa-san do " +
          "the persuading. It gave a five-person team spread across three countries a home " +
          "credible enough to stand beside the printed edition.",
      },
      {
        id: "ott",
        name: "OTT Platforms",
        tags: "VIDEO · MULTI-DEVICE · FRONTEND",
        client: "MultiTV Tech Solutions — for broadcaster and content-owner clients",
        shots: PH2,
        desc:
          "Streaming front-ends for broadcasters and content owners — built once, " +
          "re-skinned many times. Players, live channels and VOD catalogues that had " +
          "to feel native on every screen a viewer owns.",
        problem:
          "One codebase had to become many products. Every broadcaster wanted their own " +
          "brand, their own content shape, their own home screen, while the video pipeline " +
          "underneath stayed identical — and hand-rolling a front-end per client does not " +
          "scale. Streaming UI is also unforgiving: a viewer notices a stalled player or a " +
          "control that misses long before they notice good typography.",
        approach:
          "I built the interface as a themeable system rather than a stack of pages — " +
          "colour, type and spacing tokenised so a new client became a configuration, not a " +
          "rewrite. Content grids, live-channel rails and VOD detail pages were composed " +
          "from shared components. Player controls got the most scrutiny: generous hit " +
          "areas, focus states that survive a keyboard or a TV remote, and honest states " +
          "for buffering, ad breaks and failure instead of a spinner that never resolves.",
        result:
          "New broadcaster front-ends could be stood up from the same foundation instead of " +
          "started from zero, and a fix in the shared layer landed across every tenant at " +
          "once. Over two years I ran several client builds in parallel at a steady weekly " +
          "turnaround, without regressions leaking between brands.",
      },
      {
        id: "insights",
        name: "Insights · BajajCapital",
        tags: "REACT · GSAP · AI",
        client: "Bajaj Capital — internal advisor platform",
        link: "https://insights.bajajcapital.com/",
        linkLabel: "Open platform · login required",
        shots: PH3,
        desc:
          "The advisor cockpit for Bajaj Capital. One place where relationship and branch " +
          "managers see clients, targets and incentives — with AI recommendations treated " +
          "as a first-class surface, not a bolt-on.",
        problem:
          "Relationship and branch managers were working out of scattered tools and " +
          "spreadsheets with no single trustworthy view of a client, a target, or what they " +
          "had actually earned. AI suggestions already existed but were being ignored: " +
          "rendered as one more row in one more table, they read as noise rather than advice.",
        approach:
          "I architected the frontend end to end — Client 360, the RM dashboard, BI views " +
          "for branch managers, and an incentive module with what-if sliders so a manager " +
          "can see the consequence of a decision before committing to it. AI recommendations " +
          "were given visual rank: a confidence state, a reason you can open, and motion that " +
          "points at what changed. A single design system holds it together, so each new " +
          "module inherits the same language instead of inventing one.",
        result:
          "A platform advisors work inside daily rather than a dashboard they open once. The " +
          "AI layer went from ignored to the thing an RM starts the morning with, because it " +
          "explains itself. The design system now sets the pattern for every module added as " +
          "the platform grows.",
      },
      {
        id: "mf",
        name: "Mutual Fund Platform",
        tags: "ONBOARDING · KYC · SIP · PORTFOLIO",
        client: "Bajaj Capital",
        link: "https://onlinemf.bajajcapital.com/",
        linkLabel: "Visit onlinemf.bajajcapital.com",
        shots: PH4,
        desc:
          "Bajaj Capital's mutual fund platform, where a first-time investor opens an " +
          "account in minutes. Paperless onboarding, digital KYC and mandates, SIP setup " +
          "and portfolio reporting for a six-decade-old advisory business.",
        problem:
          "Regulated onboarding is exactly where investors give up. KYC, nominee " +
          "declaration, mandate registration and e-sign each add fields, and each field is " +
          "another reason to abandon — while a sixty-year-old advisory brand cannot afford a " +
          "journey that feels like paperwork. The same platform also had to serve two very " +
          "different people: someone investing for themselves, and a relationship manager " +
          "transacting on someone else's behalf.",
        approach:
          "I broke the journeys into wizards that only ask for what the current step needs, " +
          "with inline validation, progress that survives a refresh, and errors that say what " +
          "to fix rather than that something went wrong. DigiLocker KYC, nominee declaration " +
          "and e-sign were sequenced to feel like one continuous flow. The calculators — SIP, " +
          "lumpsum, and a fund-versus-deposit comparison — were built to be played with, " +
          "because a number you moved yourself persuades far better than one you were shown.",
        result:
          "Account opening and SIP registration read as short, honest flows instead of forms, " +
          "and the self-serve and RM-assisted paths share one interface rather than drifting " +
          "into two products. The calculators turn idle browsing into engagement, which gives " +
          "the advisory team a much warmer opening than a cold enquiry.",
      },
    ];

    const byId = (id) => PROJECTS.find((p) => p.id === id);

    /* ── build the rows ── */
    const list = document.getElementById("projectList");
    if (!list) return;
    list.innerHTML = PROJECTS.map((p, i) => `
      <li class="prj__row">
        <button class="prj__hit" type="button" data-case="${p.id}"
                aria-label="Open case study: ${p.name}">
          <span class="prj__num mono">${String(i + 1).padStart(2, "0")}</span>
          <span class="prj__name">${p.name}</span>
          <span class="prj__tags mono">${p.tags}</span>
          <span class="prj__view mono">VIEW CASE <i aria-hidden="true">↗</i></span>
        </button>
      </li>`).join("");

    const rows = [...list.querySelectorAll(".prj__hit")];
    enterStagger(list, ".prj__row");

    /* ── cursor-following preview ── */
    const preview = document.getElementById("prjPreview");
    const previewCard = document.getElementById("prjPreviewCard");
    let showPreview = () => { };
    let hidePreview = () => { };

    if (!TOUCH && !REDUCED && preview) {
      const xTo = gsap.quickTo(preview, "x", { duration: 0.42, ease: "power3" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.42, ease: "power3" });
      window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });

      let current = null;
      showPreview = (id) => {
        if (current !== id) {
          // the row's first shot doubles as its hover thumbnail
          const first = byId(id)?.shots?.[0];
          previewCard.innerHTML = first ? `<img src="${first}" alt="" />` : "";
          current = id;
        }
        preview.classList.add("is-visible");
      };
      hidePreview = () => preview.classList.remove("is-visible");

      rows.forEach((row) => {
        row.addEventListener("mouseenter", () => showPreview(row.dataset.case));
        row.addEventListener("mouseleave", hidePreview);
      });
    }

    /* ── 4 · shots carousel ───────────────────────────────────────────────
       Rebuilt per case when the drawer opens. Track moves by xPercent so the
       distance is always exact regardless of viewport, and the incoming image
       settles from a slight scale-up, which is what makes the move read as
       smooth rather than as a jump. */
    const shots = {
      root: document.getElementById("shots"),
      viewport: document.getElementById("shotsViewport"),
      track: document.getElementById("shotsTrack"),
      dots: document.getElementById("shotsDots"),
      count: document.getElementById("shotsCount"),
      prev: document.getElementById("shotsPrev"),
      next: document.getElementById("shotsNext"),
      i: 0,
      n: 0,
    };

    const shotsGo = (to, animate = true) => {
      if (!shots.n) return;
      // wrap both ways so prev from the first lands on the last
      shots.i = ((to % shots.n) + shots.n) % shots.n;

      const x = -100 * shots.i;
      if (animate && !REDUCED) {
        gsap.to(shots.track, { xPercent: x, duration: 0.75, ease: "power3.out", overwrite: true });
        const img = shots.track.children[shots.i]?.querySelector("img");
        if (img) {
          gsap.fromTo(img, { scale: 1.06 },
            { scale: 1, duration: 1.1, ease: "power3.out", overwrite: true });
        }
      } else {
        gsap.set(shots.track, { xPercent: x, overwrite: true });
      }

      [...shots.dots.children].forEach((d, k) => {
        d.classList.toggle("is-active", k === shots.i);
        d.setAttribute("aria-current", k === shots.i ? "true" : "false");
      });
      shots.count.textContent =
        String(shots.i + 1).padStart(2, "0") + " / " + String(shots.n).padStart(2, "0");
    };

    const shotsBuild = (list) => {
      const imgs = Array.isArray(list) ? list : [];
      shots.n = imgs.length;
      // eager, not lazy: slides are created at open time and moved by transform,
      // which lazy-loading does not re-evaluate (same trap as the brand marquee)
      shots.track.innerHTML = imgs
        .map((src, k) => `<div class="shots__slide">` +
          `<img src="${src}" alt="Screen ${k + 1} of ${imgs.length}" ` +
          `decoding="async"${k ? ' fetchpriority="low"' : ""} /></div>`)
        .join("");
      shots.dots.innerHTML = imgs
        .map((_, k) => `<button class="shots__dot" type="button" ` +
          `aria-label="Go to image ${k + 1}"></button>`)
        .join("");
      shots.root.classList.toggle("is-single", shots.n <= 1);
      gsap.killTweensOf(shots.track);
      shotsGo(0, false);
    };

    shots.prev.addEventListener("click", () => shotsGo(shots.i - 1));
    shots.next.addEventListener("click", () => shotsGo(shots.i + 1));
    shots.dots.addEventListener("click", (e) => {
      const dot = e.target.closest(".shots__dot");
      if (dot) shotsGo([...shots.dots.children].indexOf(dot));
    });

    /* pointer swipe — only commits on a mostly-horizontal drag, so a vertical
       flick still scrolls the drawer (see touch-action:pan-y on the viewport) */
    if (!REDUCED) {
      let sx = 0, sy = 0, down = false;
      shots.viewport.addEventListener("pointerdown", (e) => {
        down = true; sx = e.clientX; sy = e.clientY;
      });
      shots.viewport.addEventListener("pointerup", (e) => {
        if (!down) return;
        down = false;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          shotsGo(shots.i + (dx < 0 ? 1 : -1));
        }
      });
      shots.viewport.addEventListener("pointercancel", () => { down = false; });
    }

    /* ── case drawer ── */
    const modal = document.getElementById("caseModal");
    const panel = modal.querySelector(".modal__panel");
    const scroll = modal.querySelector(".modal__scroll");
    const link = document.getElementById("modalLink");
    const linkText = document.getElementById("modalLinkText");
    let lastFocus = null;

    const set = (id, value) => { document.getElementById(id).textContent = value; };

    const open = (key) => {
      const p = byId(key);
      if (!p) return;
      const idx = PROJECTS.indexOf(p) + 1;

      set("modalNum", "CASE " + String(idx).padStart(2, "0"));   // 1
      set("modalTitle", p.name);                                 // 2
      set("modalDesc", p.desc);                                  // 3
      shotsBuild(p.shots);                                       // 4
      set("modalClient", p.client);                              // 5
      set("modalProblem", p.problem);                            // 6
      set("modalApproach", p.approach);                          // 7
      set("modalResult", p.result);                              // 8

      if (p.link) {
        link.href = p.link;
        link.target = "_blank";
        link.rel = "noopener";
        // linkLabel lets a login-walled platform say so instead of promising a site
        linkText.textContent = p.linkLabel || "Live website";
      } else {
        // no public URL (client work under NDA) — point at the contact section
        link.href = "#contact";
        link.removeAttribute("target");
        link.removeAttribute("rel");
        linkText.textContent = "Talk about this build";
      }

      hidePreview();
      lastFocus = document.activeElement;
      modal.hidden = false;
      scroll.scrollTop = 0;
      lenis?.stop();

      if (!REDUCED) {
        gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.72, ease: "expo.out" });
        gsap.fromTo(".modal__backdrop", { opacity: 0 }, { opacity: 1, duration: 0.45 });
        gsap.fromTo(scroll.children,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.05, delay: 0.22, clearProps: "all" });
      }
      /* focus the scroll container, not the close button: it is the element the
         keyboard needs to drive, and with aria-modal + aria-labelledby a screen
         reader still announces the dialog by its title. Close stays one
         Shift+Tab away (it precedes this container in the DOM). */
      scroll.focus({ preventScroll: true });
    };

    const close = () => {
      const done = () => { modal.hidden = true; lenis?.start(); lastFocus?.focus(); };
      if (REDUCED) return done();
      gsap.to(panel, { xPercent: 100, duration: 0.5, ease: "power3.inOut" });
      gsap.to(".modal__backdrop", { opacity: 0, duration: 0.45, onComplete: done });
    };

    rows.forEach((row) => row.addEventListener("click", () => open(row.dataset.case)));
    modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
    // the fallback CTA is an in-page anchor — lenis is stopped while the
    // drawer is open, so close it first and scroll once it has cleared
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") !== "#contact") return;   // real external link
      e.preventDefault();
      close();
      setTimeout(() => scrollToTarget("#contact"), REDUCED ? 0 : 520);
    });
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") return close();
      // ← / → drive the carousel; neither key scrolls the drawer, so no conflict
      if (e.key === "ArrowLeft") { e.preventDefault(); shotsGo(shots.i - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); shotsGo(shots.i + 1); }
    });
  })();

  /* ─────────────── FOOTER — CLOCK, GRAIN, TOP ─────────────── */
  (() => {
    const clock = document.getElementById("istClock");
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata", hour12: false,
      }) + " IST";
    };
    tick(); setInterval(tick, 1000);

    document.getElementById("backToTop").addEventListener("click", () => scrollToTarget("#hero"));

    // wordmark ripple on enter (clipped by the container — can never overlap links)
    enterStagger(document.getElementById("wordmark"), "span", { yPercent: 100, y: 0 });
  })();

  /* ─────────────── FINAL REFRESH ─────────────── */
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
