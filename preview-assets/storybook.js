(() => {
  const body = document.body;
  if (!body) return;

  const hero = document.querySelector(".forest-hero");
  const paper = document.querySelector(".storybook-paper");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollFrame = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateScrollState = () => {
    const headerThreshold = hero ? Math.max(80, hero.offsetHeight * 0.76) : 24;
    body.classList.toggle("storybook-scrolled", window.scrollY > headerThreshold);

    if (paper) {
      const distance = Math.max(1, paper.scrollHeight - window.innerHeight);
      const progress = clamp((window.scrollY - paper.offsetTop) / distance, 0, 1);
      paper.style.setProperty("--story-progress", progress.toFixed(4));
    }

    if (body.classList.contains("storybook-inner")) {
      const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      body.style.setProperty("--site-progress", clamp(window.scrollY / distance, 0, 1).toFixed(4));
    }

    scrollFrame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
    },
    { passive: true }
  );
  window.addEventListener("resize", updateScrollState, { passive: true });
  updateScrollState();

  const revealItems = document.querySelectorAll(
    [
      ".storybook-section-heading",
      ".storybook-about__copy",
      ".storybook-selected__heading",
      ".storybook-publications ol.bibliography > li",
      ".storybook-social",
      ".storybook-inner .post-header",
      ".storybook-inner .projects .category",
      ".storybook-inner .projects > .row > .col",
      ".storybook-inner .publications ol.bibliography > li",
      ".storybook-inner .cv .card",
      ".storybook-inner .header-bar",
      ".storybook-inner .featured-posts .col",
      ".storybook-inner .post-list > li",
      ".storybook-inner .archive tr",
      ".storybook-inner #markdown-content > *",
    ].join(", ")
  );
  revealItems.forEach((item) => item.classList.add("storybook-reveal"));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6%" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (reducedMotion || !hero) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let motionFrame = 0;

  const draw = () => {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;
    hero.style.setProperty("--scene-x", `${currentX}px`);
    hero.style.setProperty("--scene-y", `${currentY}px`);

    if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
      motionFrame = window.requestAnimationFrame(draw);
    } else {
      motionFrame = 0;
    }
  };

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const bounds = hero.getBoundingClientRect();
    targetX = -(((event.clientX - bounds.left) / bounds.width) - 0.5) * 5;
    targetY = -(((event.clientY - bounds.top) / bounds.height) - 0.5) * 3;
    if (!motionFrame) motionFrame = window.requestAnimationFrame(draw);
  });

  hero.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    if (!motionFrame) motionFrame = window.requestAnimationFrame(draw);
  });

  if (paper) {
    paper.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const bounds = paper.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -10;
      const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * -7;
      paper.style.setProperty("--paper-x", `${x}px`);
      paper.style.setProperty("--paper-y", `${y}px`);
    });

    paper.addEventListener("pointerleave", () => {
      paper.style.setProperty("--paper-x", "0px");
      paper.style.setProperty("--paper-y", "0px");
    });
  }
})();
