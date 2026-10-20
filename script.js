const pages = new Set(["home", "pokemon", "party", "damage"]);
const pageElements = document.querySelectorAll("[data-page]");
const navigationLinks = document.querySelectorAll("[data-nav]");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = themeToggle.querySelector("span");

function showPage() {
  const requestedPage = window.location.hash.slice(1);
  const currentPage = pages.has(requestedPage) ? requestedPage : "home";

  if (requestedPage !== currentPage) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${currentPage}`);
  }

  pageElements.forEach((page) => {
    page.hidden = page.dataset.page !== currentPage;
  });

  navigationLinks.forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeLabel.textContent = isDark ? "ライトモード" : "ダークモード";
}

window.addEventListener("hashchange", showPage);
themeToggle.addEventListener("click", toggleTheme);

if (!window.location.hash) {
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
}

showPage();
