(() => {
  const MAX_FINAL_LENGTH = 7000;

  function isVisible(el) {
    const style = window.getComputedStyle(el);
    return (
      style &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      el.offsetWidth > 0 &&
      el.offsetHeight > 0
    );
  }

  function normalizeWhitespace(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function getCandidateElements() {
    const selectors = [
      '[id*="cookie" i]',
      '[class*="cookie" i]',
      '[id*="consent" i]',
      '[class*="consent" i]',
      '[id*="privacy" i]',
      '[class*="privacy" i]',
      '[id*="gdpr" i]',
      '[class*="gdpr" i]',
      '[id*="cmp" i]',
      '[class*="cmp" i]',
      '[id*="onetrust" i]',
      '[class*="onetrust" i]',
      '[id*="trustarc" i]',
      '[class*="trustarc" i]',
      '[aria-label*="cookie" i]',
      '[aria-label*="consent" i]',
      '[aria-label*="privacy" i]',
      '[role="dialog"]',
      '[role="alertdialog"]',
      "dialog",
      "main",
      "footer",
      "section",
      "aside",
      "div",
    ];

    const seen = new Set();
    const elements = [];

    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          elements.push(el);
        }
      });
    }

    return elements;
  }

  function looksLikeConsentText(text) {
    const keywords = [
      "cookie",
      "cookies",
      "consent",
      "privacy",
      "data policy",
      "policy",
      "gdpr",
      "ccpa",
      "legitimate interest",
      "vendors",
      "personal data",
      "your data",
      "tracking",
      "advertising",
      "analytics",
      "accept",
      "reject",
      "preferences",
      "partners",
    ];

    const lower = text.toLowerCase();
    const hits = keywords.filter((word) => lower.includes(word));
    return hits.length >= 2;
  }

  function getElementLabel(el) {
    const parts = [el.tagName.toLowerCase()];
    if (el.id) parts.push(`#${el.id}`);

    const className = (el.className || "").toString().trim();
    if (className) {
      const firstClass = className.split(/\s+/)[0];
      if (firstClass) parts.push(`.${firstClass}`);
    }

    return parts.join("");
  }

  function scoreConsentText(text, el) {
    const lower = text.toLowerCase();
    let score = 0;

    [
      "cookie",
      "consent",
      "privacy",
      "tracking",
      "analytics",
      "partners",
      "vendors",
      "personal data",
      "preferences",
      "accept",
      "reject",
    ].forEach((word) => {
      if (lower.includes(word)) score += 1;
    });

    if (el.getAttribute("role") === "dialog") score += 3;
    if (el.getAttribute("role") === "alertdialog") score += 2;

    const idText = (el.id || "").toLowerCase();
    const classText = (el.className || "").toString().toLowerCase();

    if (idText.includes("cookie") || classText.includes("cookie")) score += 2;
    if (idText.includes("consent") || classText.includes("consent")) score += 2;
    if (idText.includes("gdpr") || classText.includes("gdpr")) score += 2;
    if (idText.includes("onetrust") || classText.includes("onetrust"))
      score += 2;

    return score;
  }

  function collectNearbyActionLabels(container) {
    const controls = container.querySelectorAll(
      'button, [role="button"], a, input[type="button"], input[type="submit"]',
    );

    const actionKeywords = [
      "accept",
      "agree",
      "allow",
      "reject",
      "deny",
      "decline",
      "manage",
      "preferences",
      "settings",
      "save",
      "continue",
    ];

    const labels = [];
    const seen = new Set();

    controls.forEach((control) => {
      if (!isVisible(control)) return;

      const label = normalizeWhitespace(
        control.innerText ||
          control.value ||
          control.getAttribute("aria-label") ||
          "",
      );

      if (!label || label.length > 80) return;

      const lower = label.toLowerCase();
      if (!actionKeywords.some((word) => lower.includes(word))) return;
      if (seen.has(lower)) return;

      seen.add(lower);
      labels.push(label);
    });

    return labels.slice(0, 8);
  }

  function collectPolicyLinks() {
    const policyKeywords = [
      "privacy",
      "cookie",
      "policy",
      "preferences",
      "consent",
    ];
    const links = [];
    const seen = new Set();

    document.querySelectorAll("a[href]").forEach((link) => {
      if (!isVisible(link)) return;

      const label = normalizeWhitespace(
        link.innerText || link.getAttribute("aria-label") || "",
      );
      const href = link.href || "";
      const haystack = `${label} ${href}`.toLowerCase();

      if (!policyKeywords.some((word) => haystack.includes(word))) return;
      if (!href || seen.has(href)) return;

      seen.add(href);
      links.push({
        label: label || "(no link text)",
        href,
      });
    });

    return links.slice(0, 8);
  }

  function buildContextText(matches, policyLinks) {
    const lines = [];

    lines.push("Primary consent context:");
    lines.push(matches[0].text);

    if (matches.length > 1) {
      lines.push("");
      lines.push("Additional related consent text:");
      matches.slice(1).forEach((match, idx) => {
        lines.push(`${idx + 1}. (${match.label}) ${match.text}`);
      });
    }

    const allActions = Array.from(
      new Set(
        matches.flatMap((match) => match.actions.map((a) => a.toLowerCase())),
      ),
    );

    if (allActions.length > 0) {
      lines.push("");
      lines.push("Visible consent actions:");
      allActions.forEach((action) => lines.push(`- ${action}`));
    }

    if (policyLinks.length > 0) {
      lines.push("");
      lines.push("Related policy links:");
      policyLinks.forEach((link) =>
        lines.push(`- ${link.label}: ${link.href}`),
      );
    }

    return lines.join("\n").slice(0, MAX_FINAL_LENGTH);
  }

  const candidates = getCandidateElements();

  const matches = [];

  for (const el of candidates) {
    if (!isVisible(el)) continue;

    const text = normalizeWhitespace(el.innerText || "");
    if (text.length < 40 || text.length > 3000) continue;
    if (!looksLikeConsentText(text)) continue;

    matches.push({
      score: scoreConsentText(text, el),
      text,
      label: getElementLabel(el),
      actions: collectNearbyActionLabels(el),
    });
  }

  if (matches.length === 0) {
    return {
      ok: false,
      message: "No consent text found.",
    };
  }

  matches.sort((a, b) => b.score - a.score || b.text.length - a.text.length);

  const deduped = [];
  const seenText = new Set();

  for (const match of matches) {
    const key = match.text.toLowerCase();
    if (seenText.has(key)) continue;
    seenText.add(key);
    deduped.push(match);
    if (deduped.length >= 3) break;
  }

  const policyLinks = collectPolicyLinks();
  const contextText = buildContextText(deduped, policyLinks);

  return {
    ok: true,
    text: contextText,
    message: `Consent context found (${deduped.length} section${deduped.length > 1 ? "s" : ""}).`,
  };
})();
