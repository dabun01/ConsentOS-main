// ConsentOS Content Script - Intercepts consent popups
(function () {
  "use strict";

  const CONSENT_KEYWORDS = [
    "cookie",
    "consent",
    "privacy",
    "terms",
    "accept",
    "agree",
    "gdpr",
    "data processing",
    "terms of service",
    "privacy policy",
  ];

  const CONSENT_SELECTORS = [
    '[class*="cookie"]',
    '[class*="consent"]',
    '[class*="privacy"]',
    '[id*="cookie"]',
    '[id*="consent"]',
    '[role="dialog"]',
    '[class*="modal"]',
    '[class*="banner"]',
  ];

  let analyzedPopups = new Set();
  let overlayActive = false;

  // Detect potential consent popup
  function isConsentPopup(element) {
    const text = element.innerText?.toLowerCase() || "";
    const hasKeyword = CONSENT_KEYWORDS.some((keyword) =>
      text.includes(keyword),
    );
    const hasAcceptButton = element.querySelector(
      'button[class*="accept"], button[class*="agree"]',
    );

    return hasKeyword && hasAcceptButton && element.offsetHeight > 100;
  }

  // Extract consent text from popup
  function extractConsentText(element) {
    const links = element.querySelectorAll(
      'a[href*="privacy"], a[href*="terms"], a[href*="cookie"]',
    );
    const text = element.innerText;
    const urls = Array.from(links).map((link) => link.href);

    return {
      text: text.substring(0, 5000), // Limit text length
      urls: urls,
      html: element.outerHTML.substring(0, 3000),
    };
  }

  // Create ConsentOS overlay
  function createOverlay(consentData, analysis) {
    if (overlayActive) return;
    overlayActive = true;

    const overlay = document.createElement("div");
    overlay.id = "consent-os-overlay";
    overlay.innerHTML = `
      <div class="consent-os-modal">
        <div class="consent-os-header">
          <h2>🛡️ ConsentOS Analysis</h2>
          <button class="consent-os-close" id="consent-close">✕</button>
        </div>
        <div class="consent-os-content">
          <div class="analysis-section">
            <h3>📝 What You're Actually Agreeing To:</h3>
            <p class="summary">${analysis.summary || "Analyzing..."}</p>
          </div>
          <div class="analysis-section warning">
            <h3>⚠️ Potential Concerns:</h3>
            <ul class="concerns">
              ${(analysis.concerns || []).map((c) => `<li>${c}</li>`).join("")}
            </ul>
          </div>
          <div class="analysis-section">
            <h3>🔍 Data They'll Collect:</h3>
            <ul class="data-collection">
              ${(analysis.dataCollection || []).map((d) => `<li>${d}</li>`).join("")}
            </ul>
          </div>
          <div class="analysis-section">
            <h3>💡 Recommendation:</h3>
            <p class="recommendation ${analysis.recommendationLevel}">${analysis.recommendation || "Review carefully"}</p>
          </div>
        </div>
        <div class="consent-os-footer">
          <button class="btn-secondary" id="consent-decline">Decline</button>
          <button class="btn-primary" id="consent-proceed">I Understand, Proceed</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById("consent-close").addEventListener("click", () => {
      overlay.remove();
      overlayActive = false;
    });

    document.getElementById("consent-decline").addEventListener("click", () => {
      overlay.remove();
      overlayActive = false;
      // User declined - try to find and click decline button
      findAndClickDecline();
    });

    document.getElementById("consent-proceed").addEventListener("click", () => {
      overlay.remove();
      overlayActive = false;
      // User understood and wants to proceed - they can now interact with original popup
    });
  }

  // Try to find and click decline/reject button
  function findAndClickDecline() {
    const declineButtons = document.querySelectorAll(
      'button[class*="reject"], button[class*="decline"], ' +
        'button:not([class*="accept"]):not([class*="agree"])',
    );

    for (let btn of declineButtons) {
      if (
        btn.innerText.toLowerCase().includes("reject") ||
        btn.innerText.toLowerCase().includes("decline")
      ) {
        btn.click();
        break;
      }
    }
  }

  // Analyze consent popup with background script
  async function analyzeConsent(consentData) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: "analyzeConsent", data: consentData },
        (response) => {
          resolve(response);
        },
      );
    });
  }

  // Observer to detect new consent popups
  const observer = new MutationObserver(async (mutations) => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          // Element node
          // Check if node or its children match consent selectors
          const candidates = [
            node,
            ...node.querySelectorAll(CONSENT_SELECTORS.join(",")),
          ];

          for (let candidate of candidates) {
            if (
              candidate &&
              !analyzedPopups.has(candidate) &&
              isConsentPopup(candidate)
            ) {
              analyzedPopups.add(candidate);

              const consentData = extractConsentText(candidate);
              console.log(
                "[ConsentOS] Detected consent popup, analyzing...",
                consentData,
              );

              // Show loading overlay
              createOverlay(consentData, {
                summary: "🔄 Analyzing terms with AI...",
                concerns: ["Analysis in progress..."],
                dataCollection: ["Scanning for data collection practices..."],
                recommendation: "Please wait...",
                recommendationLevel: "neutral",
              });

              // Get AI analysis
              const analysis = await analyzeConsent(consentData);

              // Update overlay with actual analysis
              const existingOverlay =
                document.getElementById("consent-os-overlay");
              if (existingOverlay) {
                existingOverlay.remove();
                overlayActive = false;
                createOverlay(consentData, analysis);
              }

              break;
            }
          }
        }
      }
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Check for existing consent popups on page load
  setTimeout(() => {
    CONSENT_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (!analyzedPopups.has(element) && isConsentPopup(element)) {
          analyzedPopups.add(element);
          const consentData = extractConsentText(element);
          analyzeConsent(consentData).then((analysis) => {
            createOverlay(consentData, analysis);
          });
        }
      });
    });
  }, 1000);

  console.log("[ConsentOS] Content script initialized");
})();
