// =========================================================
// Yoo Chi Hun — Portfolio interactions
// =========================================================
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Nav scroll state
const nav = document.querySelector(".nav");
const onScroll = () => {
  if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal-on-scroll
const revealTargets = document.querySelectorAll(
  ".hero__intro, .hero__portrait, .metrics, .section__head, .about, .pillar, " +
    ".tl-item, .case, .teach__card, .teach__modules, .teach-feature, " +
    ".contact__title, .contact__card"
);
revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);
revealTargets.forEach((el) => revealIO.observe(el));

// Animated counters (supports decimals + reduced motion)
const counters = document.querySelectorAll("[data-counter]");
const format = (value, decimals) =>
  decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

counters.forEach((el) => {
  const raw = el.getAttribute("data-counter") || "0";
  const target = parseFloat(raw) || 0;
  const decimals = (raw.split(".")[1] || "").length;

  if (prefersReduced) {
    el.textContent = format(target, decimals);
    return;
  }

  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const duration = 1300;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(target * eased, decimals);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  countIO.observe(el);
});

// Scroll-spy — highlight the current section in the nav
const navLinks = Array.from(document.querySelectorAll(".nav__links a"));
const spied = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    const section = id && id.startsWith("#") ? document.querySelector(id) : null;
    return section ? { link, section } : null;
  })
  .filter(Boolean);

if (spied.length) {
  const byId = new Map(spied.map((s) => [s.section, s.link]));
  const spyIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const active = byId.get(entry.target);
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  spied.forEach((s) => spyIO.observe(s.section));
}
