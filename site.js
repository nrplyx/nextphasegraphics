// Next Phase Graphics – presentation page behaviour (no dependencies)
(() => {
  // download links / labels from download.js (written by make-package.ps1)
  const d = window.NPG_DOWNLOAD;
  if (d) {
    document.querySelectorAll("[data-download]").forEach(a => a.href = d.file);
    document.querySelectorAll("[data-version]").forEach(e => e.textContent = d.version);
    document.querySelectorAll("[data-size]").forEach(e => e.textContent = Math.round(d.sizeMB) + " MB");
    document.querySelectorAll("[data-built]").forEach(e => e.textContent = d.built);
    document.querySelectorAll("[data-file]").forEach(e => e.textContent = d.file.split("/").pop());
  }

  // hero plates follow the pointer a little
  const plates = document.querySelectorAll(".plate");
  const hero = document.querySelector(".hero");
  if (hero && matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      plates.forEach((p, i) => {
        const k = (i + 1) * 12;
        p.style.transform = `translate(${x * k}px, ${y * k}px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
      });
    });
    hero.addEventListener("pointerleave", () => plates.forEach(p => p.style.transform = ""));
  }

  // showcase window flattens as it scrolls into view
  const tilt = document.querySelector(".tilt");
  const reveal = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add(en.target === tilt ? "flat" : "in");
    reveal.unobserve(en.target);
  }), { threshold: 0.25 });
  if (tilt) reveal.observe(tilt);
  document.querySelectorAll(".card, .fcol, .stats li, .dl-card, .spec article").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 3) * 80 + "ms";
    reveal.observe(el);
  });

  // feature cards: glow follows the pointer
  document.querySelectorAll(".card").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  // tour tabs
  const tabs = [...document.querySelectorAll(".tabs button")];
  const slides = [...document.querySelectorAll(".slide")];
  let current = 0, timer;
  const show = i => {
    current = i;
    tabs.forEach((t, j) => t.setAttribute("aria-selected", j === i));
    slides.forEach((s, j) => s.classList.toggle("active", j === i));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => show((current + 1) % slides.length), 7000); };
  tabs.forEach((t, i) => t.addEventListener("click", () => { show(i); clearInterval(timer); }));
  const stage = document.querySelector(".stage");
  if (stage && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    new IntersectionObserver(([en]) => en.isIntersecting ? auto() : clearInterval(timer)).observe(stage);
    stage.addEventListener("pointerenter", () => clearInterval(timer));
  }

  // lightbox
  const box = document.querySelector(".lightbox"), boxImg = box.querySelector("img");
  document.querySelectorAll(".window img").forEach(img => img.addEventListener("click", () => {
    boxImg.src = img.src; boxImg.alt = img.alt; box.hidden = false;
  }));
  const close = () => { box.hidden = true; };
  box.addEventListener("click", close);
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();
