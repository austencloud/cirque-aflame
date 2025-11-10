# Tip Sign

Digital tip sign display for Cirque Aflame performers, featuring QR codes for easy tipping.

## Purpose

A simple, static HTML page designed to be displayed on a tablet or screen at performance venues, allowing audience members to easily tip performers via PayPal QR code.

## Tech Stack

- Pure HTML/CSS
- No build process required
- No dependencies

## Files

- `tip-sign.html` - Main display page
- `PayPal QR Code.png` - PayPal QR code for tipping
- `Screenshot 2025-10-14 123325.png` - Preview screenshot

## Usage

Simply open `tip-sign.html` in any web browser:

```bash
# Open directly in browser
open tip-sign.html

# Or serve via local server
python -m http.server 8000
# Then navigate to http://localhost:8000/tip-sign.html
```

## Display Recommendations

- Tablet or monitor positioned near performance area
- Ensure QR code is clearly visible and scannable
- Consider kiosk mode for full-screen display
- Test QR code scanning distance before event

## Future Enhancements

- [ ] Add animations or visual effects
- [ ] Support multiple payment methods (Venmo, Cash App)
- [ ] Add thank you message after scanning
- [ ] Make responsive for different screen sizes
- [ ] Add company branding and logo
- [ ] Digital signature/message board feature
