# ConsentOS - Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Extension doesn't load

**Symptoms:**

- Extension doesn't appear in Chrome
- Error when loading unpacked extension

**Solutions:**

1. Make sure you're using Google Chrome (not Brave, Edge, etc.)
2. Check that Developer mode is enabled in `chrome://extensions/`
3. Verify you selected the `my-extension` folder (not the parent folder)
4. Look for error messages on the extension card - they'll tell you what's wrong
5. Try clicking "Reload" on the extension card after making changes

---

### 🟡 No analysis appears when consent popup shows

**Symptoms:**

- Consent popups appear but ConsentOS doesn't intercept them
- No overlay shows up

**Solutions:**

1. **Check API Key Configuration:**
   - Open `my-extension/background.js`
   - Verify your API key is correctly set (not still `YOUR_GEMINI_API_KEY_HERE`)
   - Make sure there are no extra spaces or quotes

2. **Open DevTools to debug:**
   - Press F12 to open Chrome DevTools
   - Go to Console tab
   - Look for `[ConsentOS]` log messages
   - Check for any errors (shown in red)

3. **Verify Extension is Active:**
   - Go to `chrome://extensions/`
   - Make sure ConsentOS is enabled (toggle should be blue)
   - Try clicking "Reload" on the extension

4. **Test on a different site:**
   - Some sites use custom implementations that might not be detected yet
   - Try: nytimes.com, theguardian.com, or any major news site
   - These typically have standard consent popups

---

### 🟠 Analysis shows "Unable to perform detailed AI analysis"

**Symptoms:**

- Overlay appears but shows fallback message
- No AI-generated summary

**Solutions:**

1. **Verify API Key:**
   - Your Gemini API key might be invalid or expired
   - Test it at: https://makersuite.google.com/app/apikey
   - Generate a new key if needed

2. **Check Network:**
   - Make sure you have internet connection
   - Open DevTools → Network tab
   - Look for requests to `generativelanguage.googleapis.com`
   - Check if they're failing (red)

3. **Check API Quotas:**
   - Free Gemini API has usage limits
   - Visit Google AI Studio to check your quota
   - Wait a bit if you've hit the limit

4. **Inspect Console Errors:**
   - Open DevTools Console
   - Look for errors mentioning "Gemini" or "API"
   - Error messages will guide you to the specific issue

---

### 🔵 Extension works but styling looks broken

**Symptoms:**

- Overlay appears but looks unstyled or broken
- Text is hard to read

**Solutions:**

1. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click "Reload" on ConsentOS
   - Refresh the webpage you're testing

2. **Check CSS File:**
   - Verify `my-extension/overlay.css` exists
   - Check that `manifest.json` includes it in `content_scripts.css`

3. **Clear Browser Cache:**
   - Sometimes Chrome caches old CSS
   - Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

---

### 🟢 History doesn't save

**Symptoms:**

- Extension popup shows "0 Popups Analyzed"
- No history items appear

**Solutions:**

1. **Check Storage Permissions:**
   - Open `my-extension/manifest.json`
   - Verify `"storage"` is in the `permissions` array

2. **Test Storage:**
   - Open DevTools Console
   - Run: `chrome.storage.local.get(['history'], console.log)`
   - See if data is being stored

3. **Clear and Test:**
   - Click "Clear History" in the popup
   - Analyze a new consent popup
   - Check if it appears

---

### 🟣 Popup doesn't open

**Symptoms:**

- Clicking extension icon does nothing
- Or shows blank popup

**Solutions:**

1. **Check Popup Files:**
   - Verify `popup.html` and `popup.js` exist in `my-extension/`
   - Check for JavaScript errors in popup DevTools

2. **Debug Popup:**
   - Right-click the extension icon
   - Select "Inspect popup"
   - Check Console for errors

3. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click "Reload" on ConsentOS

---

## Debugging Tips

### Enable Verbose Logging

Add this to the top of `content.js` for more detailed logs:

```javascript
const DEBUG = true;
const log = (...args) => DEBUG && console.log("[ConsentOS Debug]", ...args);
```

Then replace `console.log` calls with `log` calls.

### Test Detection Manually

Open Console on any page and run:

```javascript
// Check if content script is loaded
console.log("ConsentOS content script loaded?", window.consentOsLoaded);

// Manually trigger detection
document.querySelectorAll('[class*="cookie"]').forEach((el) => {
  console.log("Found potential popup:", el);
});
```

### Test AI Analysis Manually

1. Open extension popup
2. Right-click popup → "Inspect popup"
3. In console, run:

```javascript
chrome.runtime.sendMessage(
  {
    action: "analyzeConsent",
    data: {
      text: "We use cookies to track you",
      urls: [],
    },
  },
  console.log,
);
```

---

## Still Having Issues?

### Check These Files

Make sure all these files exist and have content:

```
my-extension/
├── manifest.json      ✓ Should be ~30 lines
├── background.js      ✓ Should be ~160 lines
├── content.js         ✓ Should be ~230 lines
├── overlay.css        ✓ Should be ~135 lines
├── popup.html         ✓ Should be ~140 lines
├── popup.js           ✓ Should be ~55 lines
└── icon.png           ✓ Any image file
```

### Verify Manifest V3 Compatibility

Chrome extensions must use Manifest V3. Check that `manifest.json` has:

```json
{
  "manifest_version": 3,
  ...
}
```

### API Key Security

**NEVER commit your API key to git!**

- The `.gitignore` file is set up to help
- If you accidentally commit it, regenerate immediately at Google AI Studio

---

## Getting Help

If you're still stuck:

1. **Check the console** - Errors tell you exactly what's wrong
2. **Review the code** - It's well-commented and open source
3. **Test incrementally** - Disable parts to isolate the issue
4. **Open an issue** - Share error messages and what you've tried

---

## Performance Notes

### If Extension Feels Slow

- The AI analysis takes 2-5 seconds (this is normal)
- Gemini API free tier has rate limits
- Consider upgrading to paid tier for faster responses

### If Popup Detection Misses Some Sites

- Some sites use non-standard implementations
- Detection can be improved by adding patterns to `CONSENT_KEYWORDS` and `CONSENT_SELECTORS` in `content.js`

### If Analysis Quality is Poor

- Try adjusting the prompt in `background.js`
- Consider using a different Gemini model
- More detailed consent text = better analysis

---

## Best Practices

✅ **Do:**

- Keep your API key private
- Test on multiple sites
- Check DevTools Console for logs
- Update the extension when you make changes (reload it)

❌ **Don't:**

- Share your API key
- Commit your configured `background.js` to public repos
- Expect instant analysis (AI takes time)
- Use on sensitive/banking sites without reviewing full terms

---

Made with ❤️ for privacy-conscious users
