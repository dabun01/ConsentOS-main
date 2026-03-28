// ConsentOS Popup Script
document.addEventListener("DOMContentLoaded", () => {
  loadHistory();

  document
    .getElementById("clear-history")
    .addEventListener("click", clearHistory);
});

function loadHistory() {
  chrome.storage.local.get(["history"], (result) => {
    const history = result.history || [];

    // Update stats
    document.getElementById("total-analyzed").textContent = history.length;

    // Update history list
    const historyList = document.getElementById("history-list");

    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <p>No consent popups analyzed yet.</p>
          <p style="margin-top: 8px; font-size: 12px;">Visit websites and ConsentOS will automatically detect and analyze consent popups!</p>
        </div>
      `;
    } else {
      historyList.innerHTML = history
        .slice(0, 5)
        .map((item) => {
          const date = new Date(item.timestamp);
          const timeAgo = getTimeAgo(date);

          return `
          <div class="history-item">
            <div class="history-domain">${item.domain}</div>
            <div class="history-time">${timeAgo}</div>
            <span class="history-recommendation recommendation-${item.analysis.recommendationLevel}">
              ${item.analysis.recommendationLevel.toUpperCase()}
            </span>
          </div>
        `;
        })
        .join("");
    }
  });
}

function clearHistory() {
  if (confirm("Clear all analysis history?")) {
    chrome.storage.local.set({ history: [] }, () => {
      loadHistory();
    });
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
