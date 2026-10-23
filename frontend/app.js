
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#trip-form");
  const dateInput = document.querySelector("#trip-date");
  const interestsError = document.querySelector("#interests-error");
  const resultPanel = document.querySelector("#result-panel");
  const resultSummary = document.querySelector("#result-summary");
  const editRequestButton = document.querySelector("#edit-request");
  const generateButton = document.querySelector("#generate-button");
  const menuToggle = document.querySelector("#menu-toggle");
  const sidebar = document.querySelector("#sidebar");
  const mainContent = document.querySelector("#main-content");
  const toast = document.querySelector("#toast");
  const breadcrumb = document.querySelector("#breadcrumb-current");
  const pageTitle = document.querySelector("#page-title");
  const pageIntro = document.querySelector("#page-intro");

  const API_BASE_URL = "http://localhost:8080";
  const DEFAULT_START_TIME = "09:00";

  let toastTimeout;
  let lastFocusedElement = null;

  const pageInfo = {
    home: {
      label: "Home",
      title: "Make every travel hour count.",
      intro:
        "Plan a short stay in Shivamogga around the places you love, the time you have, and the way you like to travel."
    },
    plan: {
      label: "Plan a trip",
      title: "Your next trip starts here.",
      intro:
        "Choose your time, interests and travel pace to prepare a personalised trip request."
    },
    trips: {
      label: "My trips",
      title: "Your trips, all in one place.",
      intro:
        "Your saved itineraries will appear here when trip saving is connected."
    },
    saved: {
      label: "Saved places",
      title: "Keep places worth remembering.",
      intro:
        "Save places from this prototype. Your selections currently last only until you refresh the page."
    },
    explore: {
      label: "Explore Shivamogga",
      title: "Get to know Shivamogga.",
      intro:
        "Discover places to consider for your short stay. Verify travel details before making plans."
    },
    profile: {
      label: "Profile",
      title: "Your travel profile.",
      intro:
        "Account details will appear here after authentication is implemented."
    },
    preferences: {
      label: "Travel preferences",
      title: "Travel the way you like.",
      intro:
        "Your selected interests and preferred travel pace will help shape future recommendations."
    },
    settings: {
      label: "Settings",
      title: "Your settings and privacy.",
      intro:
        "Account, privacy and data controls will be implemented as the application develops."
    }
  };

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const today = localDateString(new Date());
  dateInput.min = today;

  if (!dateInput.value || dateInput.value < today) {
    dateInput.value = today;
  }

  function showToast(message) {
    window.clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.hidden = false;

    toastTimeout = window.setTimeout(() => {
      toast.hidden = true;
    }, 4500);
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.querySelector(".mobile-backdrop")?.classList.remove("is-visible");
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");

    let backdrop = document.querySelector(".mobile-backdrop");

    if (!backdrop) {
      backdrop = document.createElement("button");
      backdrop.type = "button";
      backdrop.className = "mobile-backdrop";
      backdrop.setAttribute("aria-label", "Close navigation");
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", closeSidebar);
    }

    backdrop.classList.add("is-visible");
    lastFocusedElement = document.activeElement;
    sidebar.querySelector(".nav-link.active")?.focus();
  }

  function navigateTo(pageKey, options = {}) {
    const page = pageInfo[pageKey];

    if (!page) {
      showToast("That page is not available yet.");
      return;
    }

    document.querySelectorAll(".nav-link").forEach((link) => {
      const isActive = link.dataset.page === pageKey;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    breadcrumb.textContent = page.label;
    pageTitle.textContent = page.title;
    pageIntro.textContent = page.intro;

    closeSidebar();

    if (pageKey === "plan" || pageKey === "saved") {
      document.querySelector("#trip-panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (pageKey === "saved") {
        showToast(
          "Saved-place controls are available in the sample cards. Persistent saving is not connected."
        );
      }
    } else if (pageKey === "explore") {
      document.querySelector(".destination-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      showToast(
        "Explore currently shows sample destination cards. A real map and place search are not connected."
      );
    } else if (pageKey === "trips") {
      showToast("No saved trips yet. Create a trip request to get started.");
    } else if (pageKey === "profile") {
      showToast("Guest mode is active. Real account details require authentication.");
    } else if (pageKey === "preferences") {
      showToast("Use the trip form to select your current travel preferences.");
    } else if (pageKey === "settings") {
      showToast("Settings and privacy controls will be implemented in a later phase.");
    }

    if (!options.keepHash && window.location.hash !== `#${pageKey}`) {
      history.replaceState(null, "", `#${pageKey}`);
    }
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();

      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    } else {
      openSidebar();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeSidebar();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });

  document.querySelector("#profile-shortcut").addEventListener("click", () => {
    navigateTo("profile");
  });

  document.querySelector("#explore-button").addEventListener("click", () => {
    navigateTo("explore");
  });

  function getSelectedInterests() {
    return Array.from(
      form.querySelectorAll('input[name="interests"]:checked')
    ).map((input) => input.value);
  }

  form.querySelectorAll('input[name="interests"]').forEach((input) => {
    input.addEventListener("change", () => {
      const selected = getSelectedInterests();
      interestsError.hidden = selected.length > 0;

      if (selected.length > 0) {
        input.closest(".field")?.querySelector(".interest-grid")
          ?.removeAttribute("aria-invalid");
      }
    });
  });

  dateInput.addEventListener("change", () => {
    dateInput.setCustomValidity("");

    if (dateInput.value && dateInput.value < today) {
      dateInput.setCustomValidity("Choose today or a future date.");
    }
  });

  function formatDate(dateValue) {
    const date = new Date(`${dateValue}T12:00:00`);

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatDuration(hours) {
    if (hours === 24) return "1 full day";
    if (hours === 48) return "2 days";
    return `${hours} hours`;
  }

  function getRequestSummary(request) {
    const paceLabels = {
      relaxed: "Relaxed",
      balanced: "Balanced",
      packed: "Packed"
    };

    return (
      `Destination: ${request.destination}. ` +
      `Date: ${formatDate(request.tripDate)}. ` +
      `Available time: ${formatDuration(request.durationHours)}. ` +
      `Starting point: ${request.startPoint}. ` +
      `Start time: ${request.startTime}. ` +
      `Interests: ${request.interests.join(", ")}. ` +
      `Travel pace: ${paceLabels[request.pace] || request.pace}.`
    );
  }

  async function submitTripRequest(request) {
    const response = await fetch(`${API_BASE_URL}/api/trips/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(request)
    });

    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        `The server rejected the request (HTTP ${response.status}).`;

      throw new Error(message);
    }

    return data;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedInterests = getSelectedInterests();
    interestsError.hidden = selectedInterests.length > 0;

    dateInput.setCustomValidity("");

    if (dateInput.value && dateInput.value < today) {
      dateInput.setCustomValidity("Choose today or a future date.");
    }

    if (!form.reportValidity()) {
      return;
    }

    if (selectedInterests.length === 0) {
      interestsError.hidden = false;
      form.querySelector(".interest-grid").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    if (generateButton.disabled) {
      return;
    }

    const formData = new FormData(form);

    const request = {
      destination: String(formData.get("destination") || "").trim(),
      startPoint:
        String(formData.get("startingPoint") || "").trim() ||
        "Starting point not specified",
      tripDate: String(formData.get("tripDate") || ""),
      startTime: DEFAULT_START_TIME,
      durationHours: Number(formData.get("duration")),
      pace: String(formData.get("travelPace") || "balanced"),
      interests: selectedInterests
    };

    const buttonLabel = generateButton.querySelector("span:first-child");
    const originalLabel = buttonLabel.textContent;

    generateButton.disabled = true;
    buttonLabel.textContent = "Sending request...";

    try {
      const result = await submitTripRequest(request);

      resultSummary.textContent = getRequestSummary(request);

      const resultLabel = resultPanel.querySelector(".step-label");
      const resultCaveat = resultPanel.querySelector(".result-caveat");

      if (resultLabel) {
        resultLabel.textContent = "TRIP REQUEST RECEIVED BY SERVER";
      }

      if (resultCaveat) {
        resultCaveat.textContent =
          "The backend has accepted your request. An optimised itinerary has not been generated or saved yet.";
      }

      resultPanel.hidden = false;
      resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      buttonLabel.textContent = "Update trip request";

      showToast(
        result?.status === "RECEIVED"
          ? "Success! Spring Boot received your trip request."
          : "The server responded successfully to your trip request."
      );
    } catch (error) {
      console.error("Trip request submission failed:", error);

      if (
        error instanceof TypeError &&
        error.message.toLowerCase().includes("fetch")
      ) {
        showToast(
          "Couldn't reach the backend. Check that Spring Boot is running on port 8080 and the frontend uses the configured address."
        );
      } else {
        showToast(
          error.message || "Something went wrong while submitting your trip."
        );
      }
    } finally {
      generateButton.disabled = false;

      if (buttonLabel.textContent === "Sending request...") {
        buttonLabel.textContent = originalLabel;
      }
    }
  });

  editRequestButton.addEventListener("click", () => {
    resultPanel.hidden = true;

    document.querySelector("#trip-panel").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    document.querySelector("#destination").focus();
  });

  // Sample saved places remain in-memory only.
  document.querySelectorAll("[data-save-place]").forEach((button) => {
    button.addEventListener("click", () => {
      const isSaved = button.getAttribute("aria-pressed") === "true";
      const nextSaved = !isSaved;
      const placeName = button.dataset.savePlace;

      button.setAttribute("aria-pressed", String(nextSaved));
      button.textContent = nextSaved ? "\u2665" : "\u2661";
      button.setAttribute(
        "aria-label",
        `${nextSaved ? "Unsave" : "Save"} ${placeName}`
      );

      showToast(
        nextSaved
          ? `${placeName} marked as saved for this session.`
          : `${placeName} removed from this session's saved places.`
      );
    });
  });

  const initialPage = window.location.hash.replace("#", "");

  if (pageInfo[initialPage]) {
    navigateTo(initialPage, { keepHash: true });
  }

  mainContent.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.matches("a[href^='#']") &&
      !target.matches(".brand")
    ) {
      const destination = target.getAttribute("href").slice(1);

      if (pageInfo[destination]) {
        event.preventDefault();
        navigateTo(destination);
      }
    }
  });
});
