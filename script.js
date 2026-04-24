const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const yearEl = document.querySelector("#year");
const typedIntroEl = document.querySelector("#typed-intro");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (typedIntroEl) {
  const text = typedIntroEl.dataset.text || "";
  let index = 0;

  const typeNext = () => {
    typedIntroEl.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      window.setTimeout(typeNext, 80);
    }
  };

  typeNext();
}
