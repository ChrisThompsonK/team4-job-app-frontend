/**
 * Job Filter Handler
 * Handles the initialization and interaction of job filter dropdowns
 */

/**
 * Decodes HTML entities to their actual characters
 * @param {string} html - The HTML string to decode
 * @returns {string} The decoded string
 */
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Initialize filter dropdowns with server-side data
 * @param {Object} config - Configuration object containing filter data
 * @param {string[]} config.uniqueLocations - Array of unique location values
 * @param {string[]} config.uniqueCapabilities - Array of unique capability values
 * @param {string[]} config.uniqueBands - Array of unique band values
 * @param {Object} config.currentFilters - Current filter selections
 * @param {string} config.currentFilters.location - Current location filter
 * @param {string} config.currentFilters.capability - Current capability filter
 * @param {string} config.currentFilters.band - Current band filter
 */
function _initializeJobFilters(config) {
  const { uniqueLocations, uniqueCapabilities, uniqueBands, currentFilters } = config;

  // Get current filter values (decode HTML entities)
  const currentLocation = decodeHTML(currentFilters.location || "");
  const currentCapability = decodeHTML(currentFilters.capability || "");
  const currentBand = decodeHTML(currentFilters.band || "");

  // Populate location filter
  const locationFilter = document.getElementById("location-filter");
  if (locationFilter) {
    uniqueLocations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      if (currentLocation === location) {
        option.selected = true;
      }
      locationFilter.appendChild(option);
    });
  }

  // Populate capability filter
  const capabilityFilter = document.getElementById("capability-filter");
  if (capabilityFilter) {
    uniqueCapabilities.forEach((capability) => {
      const option = document.createElement("option");
      option.value = capability;
      option.textContent = capability;
      if (currentCapability === capability) {
        option.selected = true;
      }
      capabilityFilter.appendChild(option);
    });
  }

  // Populate band filter
  const bandFilter = document.getElementById("band-filter");
  if (bandFilter) {
    uniqueBands.forEach((band) => {
      const option = document.createElement("option");
      option.value = band;
      option.textContent = band;
      if (currentBand === band) {
        option.selected = true;
      }
      bandFilter.appendChild(option);
    });
  }
}

/**
 * Apply filters by navigating to the URL with query parameters
 */
function applyJobFilters() {
  const locationFilter = document.getElementById("location-filter");
  const capabilityFilter = document.getElementById("capability-filter");
  const bandFilter = document.getElementById("band-filter");
  const searchInput = document.getElementById("job-search");

  // Build query parameters
  const params = new URLSearchParams();

  if (searchInput?.value) {
    params.append("search", searchInput.value);
  }
  if (locationFilter?.value) {
    params.append("location", locationFilter.value);
  }
  if (capabilityFilter?.value) {
    params.append("capability", capabilityFilter.value);
  }
  if (bandFilter?.value) {
    params.append("band", bandFilter.value);
  }

  // Navigate to the filtered URL
  window.location.href = `/jobs${params.toString() ? `?${params.toString()}` : ""}`;
}

/**
 * Clear all filters and navigate to base jobs page
 */
function clearJobFilters() {
  window.location.href = "/jobs";
}

/**
 * Set up event listeners for filter controls
 */
function _setupJobFilterListeners() {
  const locationFilter = document.getElementById("location-filter");
  const capabilityFilter = document.getElementById("capability-filter");
  const bandFilter = document.getElementById("band-filter");
  const clearFiltersBtn = document.getElementById("clear-filters");

  if (locationFilter) {
    locationFilter.addEventListener("change", applyJobFilters);
  }
  if (capabilityFilter) {
    capabilityFilter.addEventListener("change", applyJobFilters);
  }
  if (bandFilter) {
    bandFilter.addEventListener("change", applyJobFilters);
  }
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearJobFilters);
  }
}
