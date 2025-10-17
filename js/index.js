// Main application JavaScript
// This file contains general JavaScript functionality for the job application

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add any future JavaScript functionality here
  console.log("Job Application frontend loaded successfully");

  // Mobile menu accessibility - manage aria-expanded state
  const mobileMenuButton = document.querySelector('[aria-controls="mobile-menu"]');
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    // Toggle aria-expanded when button is clicked
    mobileMenuButton.addEventListener("click", () => {
      const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
    });

    // Update aria-expanded when menu loses focus (closes)
    mobileMenuButton.addEventListener("blur", () => {
      // Small delay to allow click events to process
      setTimeout(() => {
        if (!mobileMenu.contains(document.activeElement)) {
          mobileMenuButton.setAttribute("aria-expanded", "false");
        }
      }, 100);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when ESC key is pressed
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenuButton.getAttribute("aria-expanded") === "true") {
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.focus();
      }
    });
  }
});
