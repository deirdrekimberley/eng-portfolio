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

const PROJECT_ENTRY_SOURCES = new Set(["martinrea", "projects"]);

const getProjectEntrySource = () => {
  const from = new URLSearchParams(window.location.search).get("from");
  if (from === "work") {
    return "projects";
  }
  return PROJECT_ENTRY_SOURCES.has(from) ? from : "";
};

const appendProjectEntrySource = (href, from) => {
  if (!href || !from) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const params = new URLSearchParams(queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "");
  params.set("from", from);
  return `${path}?${params.toString()}${hash}`;
};

const initProjectSequenceNav = () => {
  const from = getProjectEntrySource();
  const contextBack = document.querySelector("[data-context-back]");

  if (contextBack) {
    if (from === "martinrea") {
      contextBack.setAttribute("href", "../experience/martinrea.html");
      contextBack.textContent = "← Back to Martinrea Experience";
    } else {
      contextBack.setAttribute("href", "../work.html#projects");
      contextBack.textContent = "← Back to Projects";
    }
  }

  if (!from) {
    return;
  }

  document.querySelectorAll("[data-preserve-from]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }

    link.setAttribute("href", appendProjectEntrySource(href, from));
  });
};

initProjectSequenceNav();

const initComboEquipLifecycle = () => {
  const root = document.querySelector("[data-combo-equip]");
  if (!root) {
    return;
  }

  const buttons = Array.from(root.querySelectorAll(".combo-equip-stage-btn"));
  const numEl = root.querySelector("[data-combo-equip-num]");
  const titleEl = root.querySelector("[data-combo-equip-title]");
  const bodyEl = root.querySelector("[data-combo-equip-body]");

  if (!buttons.length || !numEl || !titleEl || !bodyEl) {
    return;
  }

  let selectedBtn = buttons.find((btn) => btn.classList.contains("is-active")) || buttons[0];

  const renderStage = (btn) => {
    const stage = btn.closest(".combo-equip-stage");
    const template = stage && stage.querySelector("template[data-stage-content]");

    numEl.textContent = btn.dataset.stageNum || "";
    titleEl.textContent = btn.dataset.stageTitle || "";
    bodyEl.replaceChildren();

    if (template) {
      bodyEl.appendChild(template.content.cloneNode(true));
    }
  };

  const setPreview = (btn) => {
    buttons.forEach((item) => {
      item.classList.toggle("is-preview", item === btn && item !== selectedBtn);
    });
    renderStage(btn);
  };

  const clearPreview = () => {
    buttons.forEach((item) => item.classList.remove("is-preview"));
    renderStage(selectedBtn);
  };

  const setSelected = (btn) => {
    selectedBtn = btn;
    buttons.forEach((item) => {
      const isActive = item === btn;
      item.classList.toggle("is-active", isActive);
      item.classList.remove("is-preview");
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderStage(btn);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => setPreview(btn));
    btn.addEventListener("focus", () => setPreview(btn));
    btn.addEventListener("click", () => setSelected(btn));
  });

  root.querySelector(".combo-equip-lifecycle")?.addEventListener("mouseleave", clearPreview);
  root.querySelector(".combo-equip-lifecycle")?.addEventListener("focusout", (event) => {
    if (!root.querySelector(".combo-equip-lifecycle")?.contains(event.relatedTarget)) {
      clearPreview();
    }
  });

  setSelected(selectedBtn);
};

initComboEquipLifecycle();

const video = document.getElementById("goodboy-demo-video");

if (video) {
  video.muted = true;
  video.defaultMuted = true;

  video.addEventListener("volumechange", () => {
    if (!video.muted || video.volume !== 0) {
      video.muted = true;
      video.volume = 0;
    }
  });

  const outcomes = document.querySelector(".goodboy-page .goodboy-outcomes");
  const videoWrap = video.closest(".goodboy-final-video-wrap");

  const syncGoodboyVideoPlayer = () => {
    if (!outcomes || !videoWrap) {
      return;
    }

    if (window.matchMedia("(max-width: 768px)").matches) {
      videoWrap.style.height = "";
      video.style.maxHeight = "";
      return;
    }

    const caption = video.closest("figure")?.querySelector("figcaption");
    const captionHeight = caption ? caption.getBoundingClientRect().height + 8 : 0;
    const targetHeight = Math.max(
      280,
      Math.round(outcomes.getBoundingClientRect().height - captionHeight)
    );

    videoWrap.style.height = `${targetHeight}px`;
    video.style.maxHeight = "";
  };

  syncGoodboyVideoPlayer();
  window.addEventListener("resize", syncGoodboyVideoPlayer);
  if (typeof ResizeObserver !== "undefined" && outcomes) {
    new ResizeObserver(syncGoodboyVideoPlayer).observe(outcomes);
  }
}