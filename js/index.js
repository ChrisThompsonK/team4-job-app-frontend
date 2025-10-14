// Main application JavaScript
// This file contains general JavaScript functionality for the job application

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add any future JavaScript functionality here
  console.log("Job Application frontend loaded successfully");
});

// Logout function
function logout() {
  // Send logout request to server
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Redirect to home page after successful logout
        window.location.href = "/";
      } else {
        console.error("Logout failed");
        // Fallback - still redirect to home in case of error
        window.location.href = "/";
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
      // Fallback - still redirect to home in case of error
      window.location.href = "/";
    });
}
