# ConsentOS

**Real-time data consent translator - Understand what you're agreeing to**

🛡️ Nobody actually understands what they're agreeing to when they click "Accept Cookies." ConsentOS uses AI to translate complex legal terms into plain English, showing you exactly what data you're sharing and potential risks.

![ConsentOS Demo](https://img.shields.io/badge/Status-Active-success)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)
![AI Powered](https://img.shields.io/badge/AI-Gemini-orange)

## 🎯 The Problem

Every day, billions of people click "Accept" on consent popups without understanding what they're agreeing to. These popups use complex legal language designed to confuse rather than inform.

- **93%** of users don't read terms of service
- Websites share data with **180+** third parties on average
- The data broker industry is worth **$200+ billion**

**ConsentOS changes this.** It acts as your personal privacy advocate, translating legalese into plain English and highlighting potential risks in real-time.

## ✨ Features

- 🔍 **Automatic Detection** - Detects consent popups and cookie banners as you browse
- 🤖 **AI-Powered Analysis** - Uses Google Gemini to analyze terms in real-time
- ⚠️ **Risk Assessment** - Identifies concerns, data collection, and abuse scenarios
- 📊 **Clear Recommendations** - Provides actionable advice (Accept/Decline/Review)
- 🛡️ **Privacy Protection** - All analysis uses your API key - no tracking
- 📈 **History Tracking** - View your consent analysis history

## 🚀 Installation

### Step 1: Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free API key (no credit card required)
3. Copy your API key

### Step 2: Configure the Extension

1. Download or clone this repository
2. Open `my-extension/background.js`
3. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```javascript
   const GEMINI_API_KEY = "your-actual-api-key-here";
   ```
4. Save the file

### Step 3: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `my-extension` folder from this repository
5. ConsentOS is now active! 🎉

## 💻 Usage

Once installed, ConsentOS works automatically:

1. **Browse normally** - Visit any website
2. **Automatic detection** - When a consent popup appears, ConsentOS intercepts it
3. **AI analysis** - The extension analyzes the terms using Gemini AI
4. **Review results** - A beautiful overlay shows you:
   - Plain-English summary of what you're agreeing to
   - Specific concerns and potential risks
   - Types of data that will be collected
   - Clear recommendation
5. **Make informed decision** - Choose to accept, decline, or review further

## 📁 Project Structure

```
ConsentOS/
├── my-extension/          # Chrome extension
│   ├── manifest.json      # Extension configuration
│   ├── background.js      # Service worker (AI analysis)
│   ├── content.js         # Content script (popup detection)
│   ├── overlay.css        # Overlay styling
│   ├── popup.html         # Extension popup
│   ├── popup.js           # Popup functionality
│   └── icon.png           # Extension icon
├── frontend/              # Dashboard website
│   └── index.html         # Landing page & documentation
└── README.md              # This file
```

## 🔧 Technical Details

### How It Works

1. **Detection**: Content script monitors DOM for consent popups using:
   - Keyword matching (cookie, consent, privacy, etc.)
   - Element selectors (modals, banners, dialogs)
   - Mutation observer for dynamic content

2. **Extraction**: Captures consent text and privacy policy URLs

3. **Analysis**: Background service worker sends data to Gemini AI with structured prompt:
   - Requests JSON response with specific fields
   - Analyzes data collection practices
   - Identifies potential abuse scenarios
   - Provides risk assessment

4. **Display**: Shows analysis in styled overlay with:
   - Summary, concerns, data collection
   - Color-coded recommendations
   - Accept/Decline action buttons

5. **Storage**: Saves analysis history in Chrome local storage

### Technologies Used

- **Chrome Extension Manifest V3**
- **Google Gemini AI API**
- **Vanilla JavaScript** (no frameworks)
- **CSS3** (animations, gradients, flexbox/grid)
- **Chrome Storage API**
- **Chrome Scripting API**

## 🎨 Screenshots

_Coming soon - showing the extension in action_

## 🔐 Privacy & Security

- **Your API key stays local** - Stored only in your browser
- **No tracking** - ConsentOS doesn't collect any user data
- **Open source** - Full transparency, audit the code yourself
- **Local processing** - All detection happens in your browser
- **Secure communication** - Only communicates with Google Gemini API

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** - Open an issue describing the problem
2. **Suggest features** - Share your ideas for improvements
3. **Submit PRs** - Fork, make changes, and submit pull requests
4. **Improve detection** - Help identify more consent popup patterns
5. **Enhance analysis** - Improve AI prompts for better results

## 📝 Roadmap

- [ ] Firefox extension support
- [ ] Safari extension support
- [ ] Automatic decline/accept based on user preferences
- [ ] Dashboard for viewing detailed consent history
- [ ] Export consent history as CSV/JSON
- [ ] Community-sourced privacy ratings
- [ ] Integration with other AI models (Claude, GPT-4, etc.)
- [ ] Mobile browser support

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

Built to empower users against predatory data practices. Inspired by the need for transparency in digital consent.

## 📧 Contact

Questions? Suggestions? Open an issue or contribute to the project!

---

**⚠️ Disclaimer**: ConsentOS provides AI-powered analysis for informational purposes. Always review privacy policies for critical decisions. The accuracy of AI analysis depends on the quality of the source material and AI model capabilities.

---

Made with ❤️ for privacy-conscious users everywhere
