// Theme toggle functionality
function initializeThemeToggle() {
  const themeToggle = document.querySelector("[data-toggle-theme]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
}

// Load saved theme
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();
  initializeThemeToggle();
});
