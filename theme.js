function initTheme() {
  const toggleBtn =
    document.querySelector(".ThemeToggle") ||
    document.querySelector(".Theme-toggle");

  const iconBtn =
    document.querySelector(".IconBtn") ||
    document.querySelector(".iconbtn");

  function setTheme(theme) {
    const icons = document.querySelectorAll(
      ".ThemeToggle i, .Theme-toggle i, .IconBtn i, .iconbtn i"
    );

    if (theme === "dark") {
      //Dark mode
      document.body.classList.add("dark");

      icons.forEach((icon) => {
        if (icon.classList.contains("fa-moon")) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
        }
      });
    } else {
      // This is to disable drak mode
      document.body.classList.remove("dark");

      icons.forEach((icon) => {
        if (icon.classList.contains("fa-sun")) {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
        }
      });
    }

    localStorage.setItem("theme", theme);
  }


  function toggleTheme() {
    // Toggle between light and dark mode
    const isDark = document.body.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

  // Only use iconBtn as a theme toggle if it isn't the cart icon wrapper
  if (
    iconBtn &&
    !iconBtn.closest(".CartIconLink") &&
    !iconBtn.closest(".Cart-Icon-Link")
  ) {
    iconBtn.addEventListener("click", toggleTheme);
  }
  // Load previously saved theme if available
  const savedTheme = localStorage.getItem("theme");
  // This is the light theme
  setTheme(savedTheme ? savedTheme : "light");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
