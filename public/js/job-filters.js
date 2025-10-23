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
function initializeJobFilters(config) {
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
      locationFilter.appendChild(option);
    });
    // Set the selected value after all options are added
    if (currentLocation) {
      locationFilter.value = currentLocation;
    }
  }

  // Populate capability filter
  const capabilityFilter = document.getElementById("capability-filter");
  if (capabilityFilter) {
    uniqueCapabilities.forEach((capability) => {
      const option = document.createElement("option");
      option.value = capability;
      option.textContent = capability;
      capabilityFilter.appendChild(option);
    });
    // Set the selected value after all options are added
    if (currentCapability) {
      capabilityFilter.value = currentCapability;
    }
  }

  // Populate band filter
  const bandFilter = document.getElementById("band-filter");
  if (bandFilter) {
    uniqueBands.forEach((band) => {
      const option = document.createElement("option");
      option.value = band;
      option.textContent = band;
      bandFilter.appendChild(option);
    });
    // Set the selected value after all options are added
    if (currentBand) {
      bandFilter.value = currentBand;
    }
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

  // Get current URL params to preserve existing filters
  const currentParams = new URLSearchParams(window.location.search);

  // Preserve search if it exists
  let searchValue;
  if (searchInput) {
    // If the input is present, use its value (even if empty)
    searchValue = searchInput.value;
  } else {
    // If the input is not present, fall back to the current URL param
    searchValue = currentParams.get("search");
  }
  if (searchValue && searchValue !== "") {
    params.append("search", searchValue);
  }

  // Add location filter
  const locationValue = locationFilter?.value;
  if (locationValue) {
    params.append("location", locationValue);
  }

  // Add capability filter
  const capabilityValue = capabilityFilter?.value;
  if (capabilityValue) {
    params.append("capability", capabilityValue);
  }

  // Add band filter
  const bandValue = bandFilter?.value;
  if (bandValue) {
    params.append("band", bandValue);
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
function setupJobFilterListeners() {
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
