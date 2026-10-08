const header = document.querySelector("#siteHeader");
const menuBtn = document.querySelector("#menuBtn");
const mobileMenu = document.querySelector("#mobileMenu");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageLoadedAt = Date.now();

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

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

const modal = document.querySelector("#certModal");
const modalClose = document.querySelector("#certModalClose");
const modalThumb = document.querySelector("#certModalThumb");
const modalCat = document.querySelector("#certModalCat");
const modalMeta = document.querySelector("#certModalMeta");
const modalTitle = document.querySelector("#certModalTitle");
const modalDesc = document.querySelector("#certModalDesc");
const modalImg = document.querySelector("#certModalImg");
const modalIcon = modalThumb.querySelector(".icon");
let lastFocusedElement = null;

const openModal = (card) => {
  lastFocusedElement = document.activeElement;
  const image = card.dataset.image;
  modalThumb.querySelector(".cert-cat").textContent = card.dataset.category;
  modalCat.textContent = card.dataset.category;
  modalMeta.textContent = `${card.dataset.org} · ${card.dataset.year}`;
  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc;
  if (image) {
    modalImg.src = image;
    modalImg.hidden = false;
    modalIcon.hidden = true;
  } else {
    modalImg.removeAttribute("src");
    modalImg.hidden = true;
    modalIcon.hidden = false;
  }
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

const form = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setStatus = (message, type = "") => {
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` is-${type}` : ""}`;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const honeypot = form.querySelector('input[name="botcheck"]');
  const tooFast = Date.now() - pageLoadedAt < 3000;

  if ((honeypot && honeypot.checked) || tooFast) {
    form.reset();
    setStatus("Thanks for reaching out! I'll get back to you soon.", "success");
    return;
  }

  const fields = [...form.querySelectorAll("input, textarea")].filter(
    (field) => field.type !== "hidden" && !field.classList.contains("honeypot")
  );
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
    const submitButton = form.querySelector('button[type="submit"]');
    setStatus("Sending…");
    submitButton.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => null);

      const result = response ? await response.json().catch(() => null) : null;

      if (response && response.ok && result?.success !== false) {
        form.reset();
        setStatus("Thanks for reaching out! I'll get back to you soon.", "success");
      } else {
        setStatus(
          result?.message || "Something went wrong — please email me directly.",
          "error"
        );
      }
    } finally {
      submitButton.disabled = false;
    }
  } else {
    const subject = encodeURIComponent(data.subject || "[Portfolio] Pesan Baru");
    const body = encodeURIComponent(
      `${data.message}\n\n— ${data.name} (${data.email})`
    );
    window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`;
    setStatus("Opening your email app to finish sending…", "success");
    form.reset();
  }
});

form.addEventListener("input", (event) => {
  const field = event.target;
  if (field.matches("input, textarea")) field.removeAttribute("aria-invalid");
  if (formStatus.classList.contains("is-error")) setStatus("");
});

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
