(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const opened = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.setAttribute("aria-label", opened ? "Fermer le menu" : "Ouvrir le menu");
      nav.classList.toggle("is-open", opened);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  // Reveal elements only after the page is ready. The content remains visible
  // without JavaScript and when reduced motion is preferred.
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Active navigation item
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          if (active) link.classList.add("active");
          else link.classList.remove("active");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // Thin reading progress indicator
  const progressBar = document.getElementById("scroll-progress-bar");
  if (progressBar) {
    let scheduled = false;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.transform = "scaleX(" + Math.min(1, Math.max(0, progress)) + ")";
      scheduled = false;
    };
    window.addEventListener("scroll", () => {
      if (!scheduled) {
        window.requestAnimationFrame(updateProgress);
        scheduled = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  // Copy the Minecraft server address
  document.querySelectorAll(".copy-btn[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      const initialLabel = button.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const temporary = document.createElement("textarea");
          temporary.value = value;
          temporary.setAttribute("readonly", "");
          temporary.style.position = "absolute";
          temporary.style.left = "-9999px";
          document.body.appendChild(temporary);
          temporary.select();
          const copied = document.execCommand("copy");
          temporary.remove();
          if (!copied) throw new Error("Clipboard unavailable");
        }
        button.textContent = "Copié !";
        button.setAttribute("aria-label", value + " copié dans le presse-papiers");
      } catch (error) {
        button.textContent = "Copie impossible";
      }
      window.setTimeout(() => {
        button.textContent = initialLabel;
        button.removeAttribute("aria-label");
      }, 1800);
    });
  });
})();