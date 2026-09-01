(() => {
  const hero = document.querySelector(".forest-hero");
  const body = document.body;
  if (!hero || !body) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollFrame = 0;

  const updateHeader = () => {
    const threshold = Math.max(80, hero.offsetHeight * 0.76);
    body.classList.toggle("storybook-scrolled", window.scrollY > threshold);
    scrollFrame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
    },
    { passive: true }
  );
  updateHeader();

  if (reducedMotion) return;

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
})();
