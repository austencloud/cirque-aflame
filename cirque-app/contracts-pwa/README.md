# Cirque Aflame Contract Generator PWA 🎪

A fully functional Progressive Web App for generating professional performance contracts for Cirque Aflame circus production company. Create, preview, and download PDF contracts entirely in your browser - works online and offline!

## ✨ Features

### 🚀 Progressive Web App
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Works without internet connection
- **Responsive Design**: Optimized for all screen sizes
- **Fast & Lightweight**: Built with modern web technologies

### 📝 Contract Management
- **Interactive Forms**: Easy-to-use form interface for all contract details
- **Real-time Preview**: See your contract before generating PDF
- **Client-side PDF Generation**: No server required - all processing in browser
- **Draft System**: Save and load multiple contract drafts
- **Auto-save**: Form data automatically saved to prevent data loss

### 📄 PDF Features
- **Professional Layout**: Beautiful, print-ready contracts
- **Customizable**: All contract details fully editable
- **High Quality**: Sharp text and graphics
- **Instant Download**: Generate PDFs in seconds

## 🏗️ Tech Stack

- **Build Tool**: Vite 5
- **PDF Generation**: html2pdf.js
- **PWA Plugin**: vite-plugin-pwa
- **Service Worker**: Workbox
- **Styling**: Modern CSS with CSS Variables
- **Storage**: LocalStorage & SessionStorage APIs

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Server

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📱 PWA Installation

### Desktop (Chrome, Edge, Safari)
1. Visit the app in your browser
2. Look for the install icon in the address bar
3. Click "Install" when prompted
4. App will open in its own window

### Mobile (iOS, Android)
1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. App will appear on your home screen like a native app

## 🎯 How to Use

### Creating a Contract

1. **Fill Out the Form**
   - Enter effective date and performance date
   - Add client information (name, contact details, organization)
   - Specify performance details (location, time, description)
   - Set financial terms (fee, payment method, timing)
   - Review producer information

2. **Preview the Contract**
   - Click "👁️ Preview Contract" to see the formatted contract
   - Review all details for accuracy
   - Make edits as needed

3. **Generate PDF**
   - Click "📄 Generate PDF" to create the final document
   - PDF will automatically download to your device
   - File is named based on event name for easy organization

### Saving Drafts

- **Save Draft**: Click "💾 Save Draft" to store current form data
  - Give your draft a memorable name
  - Drafts are saved to browser storage

- **Load Draft**: Click "📂 Load Draft" to restore a saved draft
  - Select from your saved drafts
  - Form will be populated with saved data

### Auto-save Feature

The app automatically saves your work to session storage as you type. If you accidentally close the browser, your data will be restored when you return.

## 📂 File Structure

```
sunday-contract/
├── index.html              # Main HTML file with form interface
├── style.css               # Comprehensive styling
├── main.js                 # Core application logic
├── vite.config.js          # Vite and PWA configuration
├── package.json            # Dependencies and scripts
├── generate-icons.html     # Icon generator tool
├── Simple Banner.png       # Company branding asset
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🎨 Generating App Icons

1. Open `generate-icons.html` in your browser
2. Click the download buttons to save icons:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
3. Place the downloaded icons in the `public` folder
4. Also create a `favicon.png` for the browser tab icon

## 🔧 Customization

### Brand Colors

Edit CSS variables in [style.css](style.css):

```css
:root {
    --primary-color: #3a0ca3;    /* Deep purple */
    --secondary-color: #f72585;   /* Pink */
    --accent-color: #4cc9f0;      /* Cyan */
    --success-color: #06d6a0;     /* Green */
}
```

### Contract Template

Modify the `generateContractHTML()` function in [main.js](main.js) to customize:
- Section content
- Legal terms
- Layout structure
- Additional fields

### Form Fields

Add or remove fields by:
1. Adding HTML input elements in [index.html](index.html)
2. Including field ID in the `fields` array in [main.js](main.js)
3. Using the field value in the `generateContractHTML()` function

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Deployment

### Deploy to Vercel, Netlify, or similar

```bash
# Build the app
pnpm build

# Deploy the dist/ folder
```

The built files will be in the `dist/` directory, ready for deployment.

### GitHub Pages

```bash
# Build with correct base path
vite build --base=/your-repo-name/

# Deploy dist/ folder to gh-pages branch
```

## 🔐 Privacy & Security

- **No Server**: All processing happens in your browser
- **Local Storage**: Drafts stored only on your device
- **No Tracking**: No analytics or third-party scripts
- **Offline Capable**: Works without internet connection

## 🐛 Troubleshooting

### PDF Generation Issues

If PDF generation fails:
- Ensure all required fields are filled
- Check browser console for errors
- Try disabling browser extensions
- Clear browser cache and reload

### Icons Not Showing

1. Generate icons using `generate-icons.html`
2. Place icons in the `public/` directory
3. Rebuild the app with `pnpm build`

### Service Worker Not Updating

- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear service worker in browser DevTools
- Increment version in `package.json`

## 🚀 Future Enhancements

- [ ] Digital signature support
- [ ] Multiple contract templates
- [ ] Email delivery integration
- [ ] Cloud sync for drafts
- [ ] Contract history/archive
- [ ] Print optimization
- [ ] QR code for contract verification
- [ ] Multi-language support
- [ ] Export to other formats (Word, etc.)
- [ ] Contract comparison/diff tool

## 📄 License

This project is proprietary software for Cirque Aflame.

## 🎪 About Cirque Aflame

Cirque Aflame is a circus production company specializing in professional fire performances, stilt-walking, juggling, and theatrical circus acts for events and festivals.

**Contact:**
- Email: cirque.aflame@gmail.com
- Phone: 872-226-7692
- Show Manager: Austen Cloud

---

**Built with ❤️ for Cirque Aflame** | © 2025 Cirque Aflame
