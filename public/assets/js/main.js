(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-spy: highlight the nav link for the section in view
     --------------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinks.find((a) => a.getAttribute("href") === `#${entry.target.id}`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------------------------------------------------------------------
     Hero terminal boot sequence
     --------------------------------------------------------------------- */
  const terminalBody = document.getElementById("terminal-body");

  const bootLines = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "esteban — élève-ingénieur, La Réunion" },
    { type: "cmd", text: "cat identite.txt" },
    { type: "out", text: "Cycle Préparatoire Intégré · ESIROI · 1re année" },
    { type: "cmd", text: "systemctl status homelab" },
    { type: "ok", text: "● active (running) — Proxmox, Docker, Home Assistant, Minecraft" },
    { type: "cmd", text: "echo $DISPONIBILITE" },
    { type: "out", text: "ouvert aux échanges, aux projets et aux collaborations" },
  ];

  function renderStatic() {
    terminalBody.innerHTML = "";
    bootLines.forEach((line) => {
      const el = document.createElement("div");
      if (line.type === "cmd") {
        el.className = "line-cmd";
        el.textContent = line.text;
      } else {
        el.className = line.type === "ok" ? "line-out line-ok" : "line-out";
        el.textContent = line.text;
      }
      terminalBody.appendChild(el);
    });
    const caret = document.createElement("span");
    caret.className = "terminal-caret";
    const promptRow = document.createElement("div");
    promptRow.className = "line-cmd";
    promptRow.appendChild(caret);
    terminalBody.appendChild(promptRow);
  }

  function typeSequence() {
    let i = 0;

    function typeLine(line, container, done) {
      const el = document.createElement("div");
      el.className = line.type === "cmd" ? "line-cmd" : line.type === "ok" ? "line-out line-ok" : "line-out";
      container.appendChild(el);

      if (line.type !== "cmd") {
        el.textContent = line.text;
        return void setTimeout(done, 260);
      }

      let c = 0;
      const speed = 32;
      const tick = () => {
        el.textContent = line.text.slice(0, c);
        c += 1;
        if (c <= line.text.length) {
          setTimeout(tick, speed);
        } else {
          setTimeout(done, 200);
        }
      };
      tick();
    }

    function next() {
      if (i >= bootLines.length) {
        const caret = document.createElement("span");
        caret.className = "terminal-caret";
        const promptRow = document.createElement("div");
        promptRow.className = "line-cmd";
        promptRow.appendChild(caret);
        terminalBody.appendChild(promptRow);
        return;
      }
      typeLine(bootLines[i], terminalBody, next);
      i += 1;
    }
    next();
  }

  if (terminalBody) {
    if (reduceMotion) {
      renderStatic();
    } else {
      const bootObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              typeSequence();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      bootObserver.observe(terminalBody);
    }
  }

  /* ---------------------------------------------------------------------
     Timeline fill — progress bar tied to scroll position
     --------------------------------------------------------------------- */
  const timelineWrap = document.querySelector(".timeline-wrap");
  const timelineFill = document.getElementById("timeline-fill");

  if (timelineWrap && timelineFill && !reduceMotion) {
    let ticking = false;

    function updateFill() {
      const rect = timelineWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visibleStart = vh * 0.85;
      const progressPx = visibleStart - rect.top;
      const ratio = Math.min(1, Math.max(0, progressPx / total));
      timelineFill.style.height = `${ratio * 100}%`;
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateFill);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateFill);
    updateFill();
  } else if (timelineFill) {
    timelineFill.style.height = "100%";
  }

  /* ---------------------------------------------------------------------
     Copy-to-clipboard for the Minecraft server address
     --------------------------------------------------------------------- */
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = "Copié !";
      } catch (err) {
        btn.textContent = "Ctrl+C";
      }
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });
})();
