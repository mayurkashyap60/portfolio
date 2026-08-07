(() => {
  "use strict";

  const safe = (label, fn) => {
    try { return fn(); }
    catch (err) { console.warn("[main.js] module failed:", label, err); return undefined; }
  };

  document.body.classList.add("js-anim");

  const mq = (q) => {
    try { return window.matchMedia(q).matches; } catch (e) { return false; }
  };

  const REDUCED = mq("(prefers-reduced-motion: reduce)");
  const TOUCH = mq("(hover: none)") || mq("(pointer: coarse)") || "ontouchstart" in window;

  const IOS =
    /iP(hone|od|ad)/.test(navigator.platform || "") ||
    /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
    (navigator.userAgent.includes("Macintosh") && (navigator.maxTouchPoints || 0) > 1);

  const SAFARI = IOS || (/^((?!chrome|android).)*safari/i.test(navigator.userAgent || ""));

  if (REDUCED) document.body.classList.add("no-motion");
  if (IOS) document.body.classList.add("is-ios");

  safe("vh-unit", () => {
    const setVH = () => {
      const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      document.documentElement.style.setProperty("--vh", h * 0.01 + "px");
    };
    setVH();
    window.addEventListener("orientationchange", () => setTimeout(setVH, 260));
    if (window.visualViewport) window.visualViewport.addEventListener("resize", setVH);
  });

  const HAS_GSAP = typeof gsap !== "undefined";
  if (!HAS_GSAP) {
    document.body.classList.remove("js-anim");
    document.body.classList.add("no-motion");
    return;
  }

  const HAS_ST = typeof ScrollTrigger !== "undefined";
  const HAS_SPLIT = typeof SplitText !== "undefined";
  const HAS_LENIS = typeof Lenis !== "undefined";

  safe("registerPlugin", () => {
    const plugins = [];
    if (HAS_ST) plugins.push(ScrollTrigger);
    if (HAS_SPLIT) plugins.push(SplitText);
    if (plugins.length) gsap.registerPlugin.apply(gsap, plugins);
  });

  safe("st-config", () => {
    if (!HAS_ST) return;
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
  });

  let lenis = null;
  const USE_LENIS = HAS_LENIS && !REDUCED && !TOUCH && !IOS;

  safe("lenis", () => {
    if (USE_LENIS) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, smoothTouch: false });
      if (HAS_ST) lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else if (HAS_ST) {
      window.addEventListener("scroll", ScrollTrigger.update, { passive: true });
    }
  });

  const scrollToTarget = (target) => safe("scrollTo", () => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (lenis) { lenis.scrollTo(el || target, { offset: 0, duration: 1.4 }); return; }
    if (!el) return;
    try { el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" }); }
    catch (e) { el.scrollIntoView(); }
  });

  safe("header", () => {
    const header = document.querySelector(".header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  const revealMap = new Map();

  const runReveal = (el) => {
    const fn = revealMap.get(el);
    if (!fn) return;
    revealMap.delete(el);
    if (io) { try { io.unobserve(el); } catch (e) { } }
    safe("reveal", fn);
  };

  const io = (!REDUCED && "IntersectionObserver" in window)
    ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting && !(en.intersectionRatio > 0)) return;
        runReveal(en.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: [0, 0.01, 0.05, 0.1, 0.15, 0.2] })
    : null;

  const onReveal = (el, fn) => {
    if (!el) return;
    if (!io) { safe("reveal-direct", fn); return; }
    revealMap.set(el, fn);
    try { io.observe(el); } catch (e) { safe("reveal-direct", fn); }
  };

  safe("reveal-watchdog", () => {
    const flushVisible = () => {
      [...revealMap.keys()].forEach((el) => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.top < vh * 1.05 && r.bottom > 0) runReveal(el);
      });
    };
    window.addEventListener("load", () => setTimeout(flushVisible, 200));
    window.addEventListener("orientationchange", () => setTimeout(flushVisible, 400));
    setTimeout(flushVisible, 800);
    setTimeout(flushVisible, 1500);
    setTimeout(flushVisible, 3000);
    setTimeout(flushVisible, 5000);

    let scrollTick = false;
    window.addEventListener("scroll", () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        flushVisible();
        scrollTick = false;
      });
    }, { passive: true });
  });

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

  safe("magnetic", () => {
    if (TOUCH || IOS || REDUCED) return;
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
  });

  const splitHeadings = [];
  let heroIntroRequested = false;
  let heroRevealed = false;

  const USE_BLUR = !SAFARI && !IOS;

  const revealHeading = (entry) => {
    if (!entry || !entry.targets || !entry.targets.length) return;
    const to = {
      yPercent: 0, opacity: 1,
      duration: 0.9, ease: "power4.out",
      stagger: { each: 0.016, from: "start" },
      onComplete: () => gsap.set(entry.targets, { clearProps: "filter,willChange" }),
    };
    if (USE_BLUR) to.filter = "blur(0px)";
    gsap.to(entry.targets, to);
  };

  const revealHero = () => {
    const h = splitHeadings.find((s) => s.el.classList.contains("hero__title"));
    if (h && !heroRevealed) { heroRevealed = true; revealHeading(h); }
  };

  if (!REDUCED && io && HAS_SPLIT) {
    document.body.classList.add("split-pending");

    const releasePending = () => document.body.classList.remove("split-pending");
    setTimeout(releasePending, 2500);

    const fontsReady = Promise.race([
      new Promise((resolve) => {
        try {
          if (document.fonts && document.fonts.ready) document.fonts.ready.then(resolve, resolve);
          else resolve();
        } catch (e) { resolve(); }
      }),
      new Promise((r) => setTimeout(r, 1500)),
    ]);

    const waitFrames = (n) => new Promise((r) => {
      let count = 0;
      const step = () => { if (++count >= n) r(); else requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });

    const settled = fontsReady.then(() => waitFrames(IOS ? 5 : 3));

    settled.then(() => {
      document.querySelectorAll("[data-split]").forEach((el) => {
        try {
          const split = new SplitText(el, {
            type: "lines,chars",
            linesClass: "split-line",
            charsClass: "split-char",
            ignore: ".hero__em",
          });
          const targets = [
            ...(split.chars || []),
            ...el.querySelectorAll(".hero__em"),
          ];
          if (!targets.length) return;
          const from = { yPercent: 110, opacity: 0 };
          if (USE_BLUR) from.filter = "blur(6px)";
          gsap.set(targets, from);
          splitHeadings.push({ el, split, targets });
        } catch (e) { }
      });

      releasePending();

      if (heroIntroRequested) revealHero();

      splitHeadings.forEach((entry) => {
        if (entry.el.classList.contains("hero__title")) return;
        onReveal(entry.el, () => revealHeading(entry));
      });
      if (HAS_ST) ScrollTrigger.refresh();

      let rotateTimer;
      window.addEventListener("orientationchange", () => {
        clearTimeout(rotateTimer);
        rotateTimer = setTimeout(() => safe("re-split", () => {
          splitHeadings.forEach((entry) => {
            if (!entry.split || typeof entry.split.split !== "function") return;
            gsap.set(entry.targets, { clearProps: "all" });
            entry.split.split({ type: "lines,chars", linesClass: "split-line", charsClass: "split-char", ignore: ".hero__em" });
            entry.targets = [...(entry.split.chars || []), ...entry.el.querySelectorAll(".hero__em")];
            gsap.set(entry.targets, { clearProps: "all", opacity: 1, yPercent: 0 });
          });
          if (HAS_ST) ScrollTrigger.refresh();
        }), 300);
      });
    }).catch(() => {
      releasePending();
      document.querySelectorAll("[data-split]").forEach((el) => {
        gsap.set(el, { clearProps: "all", opacity: 1 });
      });
    });
  } else {
    document.body.classList.remove("split-pending");
  }

  const introHero = () => {
    heroIntroRequested = true;
    revealHero();
    if (document.querySelector("#hero .reveal-line")) {
      gsap.to("#hero .reveal-line", {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        stagger: 0.12, delay: REDUCED ? 0 : 0.15,
        clearProps: "willChange",
      });
    }
  };

  if (REDUCED) {
    document.querySelectorAll(".reveal-line").forEach((el) => {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }
  safe("introHero", introHero);

  setTimeout(() => safe("hero-failsafe", () => {
    document.body.classList.remove("split-pending");
    document.querySelectorAll("#hero .reveal-line").forEach((el) => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
        el.style.opacity = 1; el.style.transform = "none";
      }
    });
  }), 3200);

  safe("hero-video", () => {
    const video = document.querySelector(".hero__video");
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("preload", video.getAttribute("preload") || "auto");

    if (IOS) {
      video.load();
    }

    let done = false;
    const nudge = () => {
      if (done) return;
      if (IOS && video.readyState < 2) {
        video.load();
        return;
      }
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => { done = true; }).catch(() => { });
      } else { done = true; }
    };

    nudge();
    ["loadeddata", "loadedmetadata", "canplay", "canplaythrough"].forEach((ev) =>
      video.addEventListener(ev, nudge, { once: true }));

    ["touchstart", "touchend", "pointerdown", "click"].forEach((ev) =>
      document.addEventListener(ev, nudge, { once: true, passive: true }));

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && video.paused) { done = false; nudge(); }
    });

    if (IOS) {
      setTimeout(nudge, 500);
      setTimeout(nudge, 1500);
    }
  });

  safe("anchors", () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = a.getAttribute("href");
        if (!target || target.length <= 1) return;
        let node = null;
        try { node = document.querySelector(target); } catch (err) { return; }
        if (node) { e.preventDefault(); scrollToTarget(target); }
      });
    });
  });

  safe("scroll-fx", () => {
    if (REDUCED || !HAS_ST || IOS) return;
    if (!document.querySelector("#work")) return;
    gsap.to("body", {
      backgroundColor: "#08070c",
      scrollTrigger: { trigger: "#work", start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  safe("portrait-mask", () => {
    const portrait = document.querySelector(".about__portrait");
    const mask = document.querySelector(".mask-reveal");
    if (!portrait || !mask) return;

    onReveal(portrait, () => {
      const closed = "inset(0 0 100% 0)";
      const open = "inset(0 0 0% 0)";
      gsap.fromTo(mask,
        { clipPath: closed, webkitClipPath: closed },
        {
          clipPath: open, webkitClipPath: open,
          duration: 1.2, ease: "power4.inOut",
          clearProps: "clipPath,webkitClipPath",
          onComplete: () => { mask.style.clipPath = ""; mask.style.webkitClipPath = ""; },
        });
    });
  });

  safe("stagger-groups", () => {
    enterStagger(document.querySelector(".stats"), ".stats__item");
    enterStagger(document.querySelector(".blog__grid"), ".bcard");
  });

  safe("counters", () => {
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      if (!isFinite(target)) return;
      const final = String(Math.round(target));
      onReveal(el, () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.6, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v); },
          onComplete: () => { el.textContent = final; },
        });
      });
    });
  });

  safe("xp-index", () => enterStagger(document.getElementById("xpIndex"), ".xpi__row"));

  safe("marquee", () => {
    const rows = document.querySelectorAll("[data-brands]");
    if (!rows.length) return;

    const LOGOS = Array.from({ length: 30 }, (_, i) => `images/brands/p${i + 1}.png`);

    rows.forEach((track) => {
      const order = track.dataset.brands === "reverse" ? [...LOGOS].reverse() : LOGOS;
      const half = (hidden) => order
        .map((src) => `<div class="brand"${hidden ? ' aria-hidden="true"' : ""}>` +
          `<img src="${src}" alt="" decoding="async" fetchpriority="low" /></div>`)
        .join("");
      track.innerHTML = half(false) + half(true);

      if (TOUCH) {
        track.style.willChange = "transform";
        track.style.transform = "translate3d(0,0,0)";
        track.style.backfaceVisibility = "hidden";
        track.style.webkitBackfaceVisibility = "hidden";
        track.style.perspective = "1000px";
        track.style.webkitPerspective = "1000px";
      }

      if (!REDUCED) track.classList.add("is-ready");
    });
  });

  safe("work", () => {
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
      if (!shots.n || !shots.track) return;
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

      if (shots.dots) {
        [...shots.dots.children].forEach((d, k) => {
          d.classList.toggle("is-active", k === shots.i);
          d.setAttribute("aria-current", k === shots.i ? "true" : "false");
        });
      }
      if (shots.count) {
        shots.count.textContent =
          String(shots.i + 1).padStart(2, "0") + " / " + String(shots.n).padStart(2, "0");
      }
    };

    const shotsBuild = (list) => {
      if (!shots.track) return;
      const imgs = Array.isArray(list) ? list : [];
      shots.n = imgs.length;
      shots.track.innerHTML = imgs
        .map((src, k) => `<div class="shots__slide">` +
          `<img src="${src}" alt="Screen ${k + 1} of ${imgs.length}" ` +
          `decoding="async"${k ? ' fetchpriority="low"' : ""} /></div>`)
        .join("");
      if (shots.dots) {
        shots.dots.innerHTML = imgs
          .map((_, k) => `<button class="shots__dot" type="button" ` +
            `aria-label="Go to image ${k + 1}"></button>`)
          .join("");
      }
      if (shots.root) shots.root.classList.toggle("is-single", shots.n <= 1);
      gsap.killTweensOf(shots.track);
      shotsGo(0, false);
    };

    if (shots.prev) shots.prev.addEventListener("click", () => shotsGo(shots.i - 1));
    if (shots.next) shots.next.addEventListener("click", () => shotsGo(shots.i + 1));
    if (shots.dots) {
      shots.dots.addEventListener("click", (e) => {
        const dot = e.target.closest(".shots__dot");
        if (dot) shotsGo([...shots.dots.children].indexOf(dot));
      });
    }

    if (shots.viewport) {
      let sx = 0, sy = 0, down = false, swiping = false;

      const start = (x, y) => { down = true; swiping = false; sx = x; sy = y; };
      const end = (x, y) => {
        if (!down) return;
        down = false;
        swiping = false;
        const dx = x - sx, dy = y - sy;
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
          shotsGo(shots.i + (dx < 0 ? 1 : -1));
        }
      };

      shots.viewport.addEventListener("pointerdown", (e) => start(e.clientX, e.clientY));
      shots.viewport.addEventListener("pointerup", (e) => end(e.clientX, e.clientY));
      shots.viewport.addEventListener("pointercancel", () => { down = false; swiping = false; });

      shots.viewport.addEventListener("touchstart", (e) => {
        const t = e.touches[0]; if (t) start(t.clientX, t.clientY);
      }, { passive: true });
      shots.viewport.addEventListener("touchmove", (e) => {
        if (!down) return;
        const t = e.touches[0];
        if (!t) return;
        const dx = Math.abs(t.clientX - sx);
        const dy = Math.abs(t.clientY - sy);
        if (!swiping && dx > 10 && dx > dy) {
          swiping = true;
        }
        if (swiping && e.cancelable) {
          e.preventDefault();
        }
      }, { passive: false });
      shots.viewport.addEventListener("touchend", (e) => {
        const t = e.changedTouches[0]; if (t) end(t.clientX, t.clientY);
      }, { passive: true });
      shots.viewport.addEventListener("touchcancel", () => { down = false; swiping = false; });

      shots.viewport.style.touchAction = "pan-y pinch-zoom";
    }

    const modal = document.getElementById("caseModal");
    if (!modal) return;
    const panel = modal.querySelector(".modal__panel");
    const scroll = modal.querySelector(".modal__scroll");
    const link = document.getElementById("modalLink");
    const linkText = document.getElementById("modalLinkText");
    if (!panel || !scroll) return;
    let lastFocus = null;

    const set = (id, value) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    };

    let lockedY = 0;
    const lockScroll = () => {
      lockedY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = -lockedY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("is-locked");
      if (TOUCH) {
        document.body.style.touchAction = "none";
        document.documentElement.style.overscrollBehavior = "none";
      }
    };
    const unlockScroll = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.classList.remove("is-locked");
      if (TOUCH) {
        document.body.style.touchAction = "";
        document.documentElement.style.overscrollBehavior = "";
      }
      window.scrollTo(0, lockedY);
    };

    const open = (key) => {
      const p = byId(key);
      if (!p) return;
      const idx = PROJECTS.indexOf(p) + 1;

      set("modalNum", "CASE " + String(idx).padStart(2, "0"));
      set("modalTitle", p.name);
      set("modalDesc", p.desc);
      shotsBuild(p.shots);
      set("modalClient", p.client);
      set("modalProblem", p.problem);
      set("modalApproach", p.approach);
      set("modalResult", p.result);

      if (!link) { }
      else if (p.link) {
        link.href = p.link;
        link.target = "_blank";
        link.rel = "noopener";
        linkText.textContent = p.linkLabel || "Live website";
      } else {
        link.href = "#contact";
        link.removeAttribute("target");
        link.removeAttribute("rel");
        linkText.textContent = "Talk about this build";
      }

      hidePreview();
      lastFocus = document.activeElement;
      modal.hidden = false;
      scroll.scrollTop = 0;
      if (lenis) lenis.stop();
      lockScroll();

      if (!REDUCED) {
        gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.72, ease: "expo.out" });
        if (document.querySelector(".modal__backdrop")) {
          gsap.fromTo(".modal__backdrop", { opacity: 0 }, { opacity: 1, duration: 0.45 });
        }
        gsap.fromTo(scroll.children,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.05, delay: 0.22, clearProps: "all" });
      }
      scroll.focus({ preventScroll: true });
    };

    const close = () => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        modal.hidden = true;
        unlockScroll();
        if (lenis) lenis.start();
        if (lastFocus && typeof lastFocus.focus === "function") {
          lastFocus.focus({ preventScroll: true });
        }
      };
      if (REDUCED) return done();
      gsap.to(panel, { xPercent: 100, duration: 0.5, ease: "power3.inOut" });
      const backdrop = document.querySelector(".modal__backdrop");
      if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.45, onComplete: done });
      setTimeout(done, 700);
    };

    rows.forEach((row) => row.addEventListener("click", () => open(row.dataset.case)));
    modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
    if (link) {
      link.addEventListener("click", (e) => {
        if (link.getAttribute("href") !== "#contact") return;
        e.preventDefault();
        close();
        setTimeout(() => scrollToTarget("#contact"), REDUCED ? 0 : 520);
      });
    }
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") return close();
      if (e.key === "ArrowLeft") { e.preventDefault(); shotsGo(shots.i - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); shotsGo(shots.i + 1); }
    });
  });

  safe("footer", () => {
    const clock = document.getElementById("istClock");

    const istManual = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
      const pad = (n) => String(n).padStart(2, "0");
      return pad(ist.getHours()) + ":" + pad(ist.getMinutes()) + ":" + pad(ist.getSeconds());
    };

    let useIntl = true;
    const tick = () => {
      if (!clock) return;
      let time;
      if (useIntl) {
        try {
          time = new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata", hour12: false,
          });
        } catch (e) { useIntl = false; }
      }
      if (!useIntl || !time) time = istManual();
      clock.textContent = time + " IST";
    };

    if (clock) { tick(); setInterval(tick, 1000); }

    const top = document.getElementById("backToTop");
    if (top) top.addEventListener("click", () => scrollToTarget("#hero"));

    enterStagger(document.getElementById("wordmark"), "span", { yPercent: 100, y: 0 });
  });

  safe("refresh", () => {
    if (!HAS_ST) return;

    let t;
    const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 180); };

    window.addEventListener("load", refresh);
    window.addEventListener("orientationchange", () => setTimeout(refresh, 320));

    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });

    setTimeout(refresh, 1500);

    if (IOS || TOUCH) {
      setTimeout(refresh, 2500);
      setTimeout(refresh, 4000);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) setTimeout(refresh, 300);
      });
    }

    let lastW = window.innerWidth;
    window.addEventListener("resize", () => {
      if (Math.abs(window.innerWidth - lastW) < 40) return;
      lastW = window.innerWidth;
      refresh();
    }, { passive: true });

    let scrollCount = 0;
    const earlyScrollRefresh = () => {
      scrollCount++;
      if (scrollCount >= 3) {
        window.removeEventListener("scroll", earlyScrollRefresh);
        setTimeout(refresh, 100);
      }
    };
    window.addEventListener("scroll", earlyScrollRefresh, { passive: true });
  });

  window.addEventListener("error", () => {
    document.body.classList.remove("split-pending");
    document.querySelectorAll(".reveal-line").forEach((el) => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
        el.style.opacity = 1;
        el.style.transform = "none";
      }
    });
  });
})();
