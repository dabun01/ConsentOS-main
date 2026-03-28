# ConsentOS - Quick Setup Guide

## 🚀 Get Started in 3 Minutes

### Prerequisites

- Google Chrome browser
- A free Gemini API key (we'll get this in Step 1)

---

## Step 1: Get Your Free Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key (it looks like: `AIzaSy...`)

**Note**: This is completely free. No credit card required.

---

## Step 2: Configure ConsentOS with .env

1. In the project root, create a local env file:
   - Copy `.env.example` to `.env`
2. Open `.env` and set your key:
   - `GEMINI_API_KEY=AIzaSy...your-actual-key...`
3. From the project root, run:
   - `node scripts/inject-env.js`
4. This generates `my-extension/env.json` for the extension runtime

Important:

- Re-run `node scripts/inject-env.js` any time you change `.env`
- `.env` and `my-extension/env.json` are gitignored and should not be committed

---

## Step 3: Install the Extension

1. Open Google Chrome
2. Go to: `chrome://extensions/`
3. Enable **"Developer mode"** (toggle switch in the top-right)
4. Click **"Load unpacked"**
5. Navigate to and select the `my-extension` folder
6. Done! You should see the ConsentOS extension appear

---

## 🎉 You're All Set!

ConsentOS is now protecting your privacy. Here's what happens next:

### How to Use

1. **Browse normally** - just visit any website
2. **Automatic detection** - when a consent popup appears, ConsentOS will intercept it
3. **AI analysis** - wait a few seconds while it analyzes the terms
4. **Review & decide** - read the clear breakdown and make an informed choice

### View Your History

Click the ConsentOS extension icon in your toolbar to see:

- Number of popups analyzed
- Recent consent history
- Recommendations for each site

---

## 🔍 What ConsentOS Analyzes

For every consent popup, you'll see:

✅ **Plain-English Summary**

- What you're actually agreeing to in simple terms

⚠️ **Potential Concerns**

- Red flags and risks to watch out for

📊 **Data Collection**

- Exactly what information they'll collect

💡 **Recommendation**

- Clear advice: Accept, Decline, or Review

---

## 🛠️ Troubleshooting

### Extension doesn't appear

- Make sure Developer mode is enabled in `chrome://extensions/`
- Try clicking "Reload" on the extension card

### No analysis appears

- Check that your key is set in `.env`
- Re-run `node scripts/inject-env.js`
- Reload the extension in `chrome://extensions/`
- Open DevTools (F12) and check the Console for errors
- Make sure your API key is valid (test it at Google AI Studio)

### Analysis says API key is missing

- This means `my-extension/env.json` is missing or empty
- Go back to Step 2 and run the inject step again

---

## 📝 Testing It Out

Want to test if it's working? Try these sites:

- Any major news website (they usually have consent banners)
- E-commerce sites
- Social media platforms

The extension will automatically detect and analyze consent popups!

---

## 🔐 Privacy Notes

- Your API key stays in your browser (never sent anywhere except to Gemini)
- ConsentOS doesn't track or collect any of your data
- All analysis happens between your browser and Google Gemini
- Your consent history is stored locally in Chrome

---

## 💪 What's Next?

Now that ConsentOS is installed:

- ✅ You'll see clear explanations of every consent agreement
- ✅ You'll know what data is being collected
- ✅ You can make truly informed decisions
- ✅ You're protected from predatory data practices

**Welcome to informed consent!** 🎉

---

## 🤝 Need Help?

- Check the README.md for more details
- Open an issue on GitHub
- Review the code - it's open source!

Built with ❤️ for privacy-conscious users
