document.addEventListener("DOMContentLoaded", () => {
  const quoraCheckbox = document.getElementById("quora");
  const youtubeCheckbox = document.getElementById("youtube");
  const redditCheckbox = document.getElementById("reddit");

  const featureKeys = ["quoraState", "youtubeState", "redditState"];

  // Initialize checkbox states
  chrome.storage.local.get(featureKeys, (result) => {
    quoraCheckbox.checked = result.quoraState || false;
    youtubeCheckbox.checked = result.youtubeState || false;
    redditCheckbox.checked = result.redditState || false;
  });

  // Save state on change
  [quoraCheckbox, youtubeCheckbox, redditCheckbox].forEach(
    (checkbox, index) => {
      checkbox.addEventListener("change", () => {
        const key = featureKeys[index];
        chrome.storage.local.set({ [key]: checkbox.checked });
      });
    }
  );
});
