# Pamela Espinal - Realtor Landing Page

Static site (HTML/CSS/JS, no build step). Open `index.html` or deploy the folder to GitHub Pages / Netlify.

## Edit content
Everything about Pamela lives in **`js/data.js`**:
- name, title, brokerage, license, phone, WhatsApp, email, Zillow link, socials
- office address, map pin, hours
- stats (homes sold, years...). `null` hides a stat everywhere
- service areas (North Jersey map pins + descriptions)
- contact methods: `mobile`, `whatsapp`, `email`. Empty ones hide their buttons and form options
- `sales: []` - paste sold homes from Zillow and they appear as cards
- `reviews: []` - paste **real** reviews and they appear as testimonials

Photo: save her headshot as `assets/img/pamela.jpg` (portrait). Until then a gold "PE" monogram shows.

## Before going live (VERIFY)
- Phone: currently (866) 201-6210, eXp Realty's main line (her old brokerage) from a public NJ directory. Swap in her cell
- Add `mobile` / `whatsapp` / `email` so the Text, WhatsApp, and Email options appear
- Homes sold and years licensed (currently hidden), plus her NJ license # if she wants it shown
- Confirm the Zillow link is her New Jersey profile

## Features
- English / Español toggle (Spanish text is in `js/i18n.js`)
- Mortgage calculator popup (`#calcModal`, opened from the page banner, nav, hero button, or `/#calculator`). NJ rules live in the `NJ` object in `js/calculator.js` (Essex County 2026 loan limit $1,209,750, NJHMFA programs, typical buyer fees). Update them yearly. Town tax rates are `tax:` on each area in `js/data.js`. It has 8 loan programs (Conventional 30/15, FHA, VA, USDA, Jumbo, 5/6 ARM, Investor DSCR), full PITI with PMI/MIP/funding fees, extra-payment savings, amortization chart + yearly table, side-by-side loan comparison, affordability (DTI) estimate. Sample rates are in `PROGRAMS`, so update them as the market moves.
- Interactive service-area map (Leaflet + OpenStreetMap) and Google Maps office embed
- Lead form that opens WhatsApp / text / email pre-filled with the client's info and their calculator scenario
