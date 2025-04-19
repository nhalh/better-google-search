(() => {
  const featureStates = {
    quora: false,
    youtube: false,
    reddit: false,
  };

  const featureFunctions = {
    quora: removeQuoraResults,
    youtube: disableYoutubePopup,
    reddit: addRedditSearchButton,
  };

  // Initialize feature states
  chrome.storage.local.get(
    ["quoraState", "youtubeState", "redditState"],
    (result) => {
      featureStates.quora = result.quoraState || false;
      featureStates.youtube = result.youtubeState || false;
      featureStates.reddit = result.redditState || false;
      applyFeatures();
    }
  );

  // Listen for changes in feature states
  chrome.storage.onChanged.addListener((changes) => {
    let shouldReapply = false;
    for (const [key, { newValue }] of Object.entries(changes)) {
      const featureKey = key.replace("State", "");
      if (featureKey in featureStates) {
        featureStates[featureKey] = newValue;
        shouldReapply = true;
      }
    }
    if (shouldReapply) {
      applyFeatures();
    }
  });

  function applyFeatures() {
    if (featureStates.quora) removeQuoraResults();
    if (featureStates.youtube) disableYoutubePopup();
    if (featureStates.reddit) addRedditSearchButton();
  }

  // Remove Quora results from search
  function removeQuoraResults() {
    if (document.querySelector(".YmvwI[selected]").textContent == "All") {
      // Limit to only Web results page
      if (document.querySelector("block-component") != null) {
        // If highlighted result is a Quora result
        if (
          document.querySelector("block-component").innerText.includes("quora")
        )
          document.querySelector("block-component").remove();
      }

      const searchResults = document.querySelectorAll(".MjjYud");
      searchResults.forEach((result) => {
        if (result.textContent.includes("Quora")) {
          result.remove();
        }
      });
    }
  }

  // Disable YouTube popup video player
  function disableYoutubePopup() {
    const links = document.querySelectorAll("a[data-ved]");
    links.forEach((link) => {
      const parent = link.closest("[data-surl]");
      if (parent) {
        const dataSurl = parent.getAttribute("data-surl");
        if (dataSurl && dataSurl.includes("youtube.com")) {
          link.removeAttribute("data-ved");
          link.href = dataSurl;
        }
      }
    });
  }

  // Add Reddit search button
  function addRedditSearchButton() {
    if (sessionStorage.getItem("removeRedditSiteFromSearchInput") === "true") {
      console.log("session exists");
      const searchInput = document.querySelector('textarea[name="q"]');

      if (searchInput && searchInput.value.includes(" reddit")) {
        console.log("string exists");
        searchInput.value = searchInput.value.replace(" reddit", "");
      }
      sessionStorage.removeItem("removeRedditSiteFromSearchInput");
    }

    // Prevent adding multiple buttons
    if (document.getElementById("reddit-search-button")) return;

    // Get original search button
    const originalButton = document.querySelector("button.Tg7LZd");
    if (!originalButton) return;

    const redditButton = originalButton.cloneNode(true);
    redditButton.id = "reddit-search-button";

    // Replace icon with Reddit icon
    const iconContainer = redditButton.querySelector(".z1asCe.MZy1Rb");
    if (iconContainer) {
      iconContainer.innerHTML = "";
      const redditIcon = document.createElement("img");
      redditIcon.src = chrome.runtime.getURL("images/reddit.png");
      redditIcon.style.width = "24px";
      redditIcon.style.height = "24px";
      iconContainer.appendChild(redditIcon);
    }

    // Append Reddit to search query on click event
    redditButton.addEventListener("click", () => {
      const searchInput = document.querySelector('textarea[name="q"]');
      if (searchInput) {
        searchInput.value += " reddit";

        // Set a flag to remove 'site:reddit.com' after the page loads
        sessionStorage.setItem("removeRedditSiteFromSearchInput", "true");
      }
    });

    // Insert Reddit button after the original search button
    originalButton.parentNode.insertBefore(
      redditButton,
      originalButton.nextSibling
    );
  }

  // Observe changes in search results
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (featureStates.quora) removeQuoraResults();
      if (featureStates.youtube) disableYoutubePopup();
    });
  });

  const targetNode = document.getElementById("search");
  // search = Page search results
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
})();
