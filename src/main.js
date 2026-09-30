/* ===================================================================
   Portfolio — interactions
   Navbar, mobile menu, active section, reveal animation, project
   filter, certificate modal, contact form.
=================================================================== */

const header = document.querySelector("#siteHeader");
const menuBtn = document.querySelector("#menuBtn");
const mobileMenu = document.querySelector("#mobileMenu");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ------------------------- Navbar: blur saat scroll ------------------------- */
const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

/* ------------------------- Mobile menu ------------------------- */
const setMenu = (open) => {
  menuBtn.classList.toggle("is-open", open);
  mobileMenu.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

menuBtn.addEventListener("click", () => {
  setMenu(!mobileMenu.classList.contains("is-open"));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
    setMenu(false);
    menuBtn.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) setMenu(false);
});

/* ------------------------- Active section indicator ------------------------- */
const navLinks = document.querySelectorAll(".nav-link, .mobile-link");

const setActiveSection = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

document
  .querySelectorAll("main section[id]")
  .forEach((section) => sectionObserver.observe(section));

/* ------------------------- Reveal on scroll (stagger) ------------------------- */
document.querySelectorAll("[data-reveal-group]").forEach((group) => {
  group.querySelectorAll(":scope > [data-reveal]").forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("[data-reveal]").forEach((el) => {
  revealObserver.observe(el);
});

/* ------------------------- Certificate modal ------------------------- */
const modal = document.querySelector("#certModal");
const modalClose = document.querySelector("#certModalClose");
const modalThumb = document.querySelector("#certModalThumb");
const modalCat = document.querySelector("#certModalCat");
const modalMeta = document.querySelector("#certModalMeta");
const modalTitle = document.querySelector("#certModalTitle");
const modalDesc = document.querySelector("#certModalDesc");
const modalLink = document.querySelector("#certModalLink");
let lastFocusedElement = null;

const openModal = (card) => {
  lastFocusedElement = document.activeElement;
  modalThumb.querySelector(".cert-cat").textContent = card.dataset.category;
  modalCat.textContent = card.dataset.category;
  modalMeta.textContent = `${card.dataset.org} · ${card.dataset.year}`;
  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc;
  modalLink.href = card.dataset.credential;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
};

document.querySelectorAll(".cert-card").forEach((card) => {
  card.querySelector(".link-btn").addEventListener("click", () => openModal(card));
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

/* ------------------------- Contact form ------------------------- */
const form = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setStatus = (message, type = "") => {
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` is-${type}` : ""}`;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("input, textarea")];
  let firstInvalid = null;

  fields.forEach((field) => {
    const invalid =
      field.value.trim() === "" ||
      (field.type === "email" && !EMAIL_PATTERN.test(field.value.trim()));
    field.setAttribute("aria-invalid", String(invalid));
    if (invalid && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    setStatus("Please fill in all fields with a valid email address.", "error");
    firstInvalid.focus();
    return;
  }

  const endpoint = form.dataset.endpoint;
  const data = Object.fromEntries(new FormData(form));

  if (endpoint) {
    // Form backend aktif (contoh: Formspree) → kirim langsung
    setStatus("Sending…");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("Thanks for reaching out! I'll get back to you soon.", "success");
    } catch {
      setStatus("Something went wrong — please email me directly.", "error");
    }
  } else {
    // Belum ada backend → buka email client dengan isi pesan
    const subject = encodeURIComponent(`[Portfolio] ${data.subject}`);
    const body = encodeURIComponent(
      `${data.message}\n\n— ${data.name} (${data.email})`
    );
    window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`;
    setStatus("Opening your email app to finish sending…", "success");
    form.reset();
  }
});

// Bersihkan status error saat user mengetik ulang
form.addEventListener("input", (event) => {
  const field = event.target;
  if (field.matches("input, textarea")) field.removeAttribute("aria-invalid");
  if (formStatus.classList.contains("is-error")) setStatus("");
});

/* ------------------------- Smooth scroll (reduced motion aware) ------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", id);
  });
});
