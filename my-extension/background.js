// ConsentOS Background Service Worker
// Handles AI analysis requests

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // User needs to add their key
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeConsent") {
    analyzeConsentWithAI(request.data)
      .then((analysis) => sendResponse(analysis))
      .catch((error) => {
        console.error("[ConsentOS] Analysis error:", error);
        sendResponse(getFallbackAnalysis());
      });
    return true; // Will respond asynchronously
  }
});

// Analyze consent text with Gemini AI
async function analyzeConsentWithAI(consentData) {
  // Check if API key is configured
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.warn(
      "[ConsentOS] Gemini API key not configured, using fallback analysis",
    );
    return getFallbackAnalysis();
  }

  const prompt = `You are ConsentOS, a privacy advocate helping users understand consent agreements. 
Analyze this consent/cookie popup and provide a clear, actionable breakdown.

Consent Text:
${consentData.text}

Related URLs:
${consentData.urls.join("\n")}

Provide your analysis in this EXACT JSON format:
{
  "summary": "2-3 sentence plain-English explanation of what they're agreeing to",
  "concerns": ["concern 1", "concern 2", "concern 3"],
  "dataCollection": ["data type 1", "data type 2", "data type 3"],
  "recommendation": "Clear recommendation on whether to accept or decline",
  "recommendationLevel": "safe|caution|danger"
}

Focus on:
- What data will be collected
- How data will be used
- Third-party sharing
- User rights
- Potential abuse scenarios

Be specific and actionable. Users need to make a decision NOW.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;

    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);

      // Store analysis for history
      storeAnalysis(consentData, analysis);

      return analysis;
    } else {
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("[ConsentOS] AI analysis failed:", error);
    return getFallbackAnalysis();
  }
}

// Fallback analysis when AI is unavailable
function getFallbackAnalysis() {
  return {
    summary:
      "This website wants to use cookies and collect your data. Without AI analysis available, we recommend reviewing their full privacy policy before accepting.",
    concerns: [
      "Unable to perform detailed AI analysis (API key may not be configured)",
      "Data collection practices unknown - review privacy policy",
      "Third-party sharing status unclear",
      "Recommend declining unless you trust this website",
    ],
    dataCollection: [
      "Cookies (tracking your activity)",
      "Browsing behavior",
      "Potentially personal information",
      "Unknown additional data - check privacy policy",
    ],
    recommendation:
      "⚠️ Review the full privacy policy before accepting. When in doubt, decline.",
    recommendationLevel: "caution",
  };
}

// Store analysis in chrome storage for dashboard
async function storeAnalysis(consentData, analysis) {
  const timestamp = new Date().toISOString();
  const domain = new URL(consentData.urls[0] || "unknown").hostname;

  const record = {
    timestamp,
    domain,
    analysis,
    consentText: consentData.text.substring(0, 500), // Store snippet
  };

  chrome.storage.local.get(["history"], (result) => {
    const history = result.history || [];
    history.unshift(record);

    // Keep last 100 records
    if (history.length > 100) {
      history.pop();
    }

    chrome.storage.local.set({ history });
  });
}

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log(
      "[ConsentOS] Extension installed! Configure your Gemini API key in background.js",
    );

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL("popup.html"),
    });
  }
});

console.log("[ConsentOS] Background service worker initialized");
