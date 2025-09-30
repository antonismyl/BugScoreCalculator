# Transifex Ticket Builder

A streamlined web application for creating standardized JIRA tickets with intelligent priority scoring. Built as a static site with zero build dependencies for maximum simplicity and reliability.

**Live App:** https://antonismyl.github.io/TransifexTicketBuilder/

## ✨ Features

### Core Functionality
- **Three Report Types:**
  - 🐛 Bug reports with impact assessment
  - 📋 Story requests with detailed documentation
  - 🧮 Quick Score Calculator (score-only mode)

- **Intelligent Priority Scoring:**
  - Automatic calculation based on customer plan, impact, churn risk, and urgency
  - Priority ranges: Trivial (1-19), Low (20-49), Medium (50-99), High (≥100), Severe (blockers)
  - Both score and priority displayed in final output

- **Rich Text Editing:**
  - Markdown support with EasyMDE editor
  - Live preview and side-by-side view
  - Image paste & drag-drop with base64 encoding
  - Auto-expanding text areas

### Quality Controls
- **Due Diligence Checklist** (for new tickets):
  - Pre-existing ticket search verification
  - Documentation review confirmation
  - Slack discussion check
  - Interactive help tooltips

- **Form Validation:**
  - Required field enforcement with visual indicators
  - Real-time validation with debounced updates (150ms)
  - Error messages with clear guidance

### User Experience
- **Multi-step Workflow:**
  - 7-step wizard for full reports (8-9 for quick calculator)
  - Progress tracking with visual indicators
  - Data preservation when navigating between steps
  - "Start Fresh" button for quick resets

- **Responsive Design:**
  - Dark/light mode with system preference detection
  - Mobile-friendly layout
  - Keyboard navigation support
  - Screen reader accessible (WCAG compliant)

- **Performance Optimized:**
  - DOM element caching (92% fewer lookups)
  - Debounced validation for smooth typing
  - ~100KB total size, loads instantly

## 🚀 Quick Start

1. Visit https://antonismyl.github.io/TransifexTicketBuilder/
2. Choose your report type:
   - **Bug Report:** Full documentation with priority scoring
   - **Story Report:** Feature requests with current/expected functionality
   - **Quick Calculator:** Priority score only (no documentation)
3. Follow the step-by-step wizard
4. Copy the generated JIRA template

## 📋 Workflows

### Bug Report (New Ticket)
1. Select "Bug Report" → "Create New Ticket"
2. Complete Due Diligence checklist
3. Enter customer details (name, ARR, plan type, URLs)
4. Answer impact assessment questions
5. Document bug summary, reproduction steps, expected vs actual behavior
6. Review calculated priority and copy template

### Bug Report (Update Ticket)
1. Select "Bug Report" → "Update Existing Ticket"
2. Enter customer details and comment
3. Answer impact assessment questions
4. Add bug summary
5. Copy template to add to existing JIRA ticket

### Story Report
1. Select "Story Report" → "Create New Ticket"
2. Complete Due Diligence checklist
3. Enter customer details
4. Document description, current/expected functionality, timeline
5. Copy template

### Quick Score Calculator
1. Select "Quick Score Calculator"
2. Choose internal/external and plan type
3. Answer impact questions
4. Get instant priority score

## 🛠️ Technical Details

### Architecture
- **Pure Static Site:** No build process, no bundlers, no transpilation
- **Zero Dependencies:** All libraries loaded via CDN
  - Tailwind CSS (styling)
  - EasyMDE (markdown editing)
  - Inter font (typography)
- **Single Page Application:** ~2,800 lines of vanilla JavaScript
- **Client-Side Only:** All processing in browser, no backend needed

### Key Components
- `index.html` - All UI structure (steps 1-9, modals, navigation)
- `script.js` - Application logic with clear sectioning:
  - Constants & Configuration
  - Utility Functions (validation, scoring, sanitization)
  - Quick Calculator Functions
- `styles.css` - Minimal custom styles (Tailwind handles most)
- `CLAUDE.md` - Developer documentation for Claude Code

### Performance Features
- DOM element caching system
- Debounced form validation (150ms)
- Consolidated reusable functions
- Efficient event delegation

### Security
- XSS prevention via input sanitization
- Image file type and size validation (2MB max)
- Base64 encoding for safe image handling

## 💻 Local Development

No setup required! Just open the files:

```bash
# Clone the repo
git clone https://github.com/antonismyl/TransifexTicketBuilder.git
cd TransifexTicketBuilder

# Option 1: Open directly in browser
open index.html

# Option 2: Use a simple HTTP server (recommended for testing)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📝 Customization

### Modifying Priority Scoring
Edit `PRIORITY_THRESHOLDS` in `script.js` (lines 76-81)

### Adding Questions
Add to `questions` array in `script.js` (lines 6-47)

### Updating Templates
Modify `generateFinalOutput()` in `script.js` (starting line 1344)

### Changing Plan Scores
Update `PLAN_SCORES` in `script.js` (lines 66-73)

## 🤝 Contributing

This is an internal Transifex tool. For changes:
1. Test locally
2. Update `CLAUDE.md` if architecture changes
3. Update `CHANGELOG.md` with your changes
4. Push to `main` branch (auto-deploys via GitHub Pages)

## 📄 License

Internal use only - Transifex, Inc.

## 🔗 Resources

- [CLAUDE.md](./CLAUDE.md) - Developer documentation for AI assistance
- [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- [Live App](https://antonismyl.github.io/TransifexTicketBuilder/) - Production deployment
