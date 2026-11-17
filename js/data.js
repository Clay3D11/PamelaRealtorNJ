/* ==========================================================================
   AGENT DATA - edit this file to update the whole site.
   Everything on the page (stats, areas, sales, reviews, contact links)
   is rendered from this object, so you never have to touch the HTML.

   Source: public NJ agent directory (eXp Realty LLC, Montclair office) and
   public listing pages. Items marked  VERIFY  could not be confirmed
   automatically; check them with Pamela before going live.
   ========================================================================== */
window.AGENT = {
  firstName: "Pamela",
  lastName: "Espinal",
  title: "Licensed Real Estate Salesperson",
  brokerage: "eXp Realty",
  license: "Licensed in New Jersey",         // VERIFY - add her NJ license # if she wants it shown
  photo: "assets/img/pamela.jpg",             // her headshot (converted from pam.jpg, which is HEIC)

  /* Contact. phone = calls. mobile = texts. whatsapp = digits only.
     Leave mobile / whatsapp / email empty and those buttons hide themselves. */
  phone: "(866) 201-6210",                   // VERIFY - eXp Realty main line from the directory; use her cell
  phoneRaw: "+18662016210",
  mobile: "",                                 // her cell, e.g. "+19735551234" - turns on Text buttons
  whatsapp: "",                               // e.g. "19735551234" - turns on WhatsApp buttons
  email: "",                                  // e.g. "pamela@gmail.com" - powers the nav Gmail button + Email option in the form
  zillow: "https://www.zillow.com/profile/Pamela%20espinal5",
  instagram: "",                              // optional full URL
  facebook: "",                               // optional full URL

  office: {
    name: "eXp Realty",
    street: "28 Valley Rd",
    city: "Montclair",
    state: "NJ",
    zip: "07042",
    lat: 40.8166,
    lng: -74.2186,
    hours: [
      ["Mon - Fri", "9:00 AM - 6:00 PM"],
      ["Saturday", "10:00 AM - 4:00 PM"],
      ["Sunday", "By appointment"]
    ]
  },

  languages: ["English", "Español"],
  specialties: ["Buyer's Agent", "Listing Agent", "First-Time Buyers", "Multi-Family & Investors"],

  /* Stats. Set a number to show it; leave null to hide it everywhere. */
  stats: {
    homesSold: null,        // VERIFY - total homes sold (from Zillow), e.g. 25
    years: null,            // VERIFY - years licensed, e.g. 4
    serviceAreas: 9,
    languages: 2
  },

  /* tax = approximate 2025 effective property tax rate (%), used by the calculator's town picker.
     VERIFY with the town tax office; null = not in the picker until a rate is added. */
  areas: [
    { name: "Montclair",   lat: 40.8259, lng: -74.2090, tax: 2.16, note: "Home base. Victorian homes, a lively downtown, and train service toward NYC." },
    { name: "East Orange", lat: 40.7673, lng: -74.2049, tax: 2.89, note: "Affordable single and multi-family homes with direct trains to Manhattan." },
    { name: "Newark",      lat: 40.7357, lng: -74.1724, tax: 1.85, note: "New Jersey's largest city. Ironbound, new condos, and investor-friendly multi-families." },
    { name: "Belleville",  lat: 40.7937, lng: -74.1501, tax: 2.71, note: "Quiet streets, solid value, and quick access to Route 21." },
    { name: "Bloomfield",  lat: 40.8068, lng: -74.1854, tax: 2.39, note: "Walkable downtown, great commuter options, and classic two-family homes." },
    { name: "West Orange", lat: 40.7987, lng: -74.2390, tax: 3.08, note: "Hillside homes, Turtle Back Zoo, and more room to grow." },
    { name: "Irvington",   lat: 40.7323, lng: -74.2346, tax: 2.91, note: "A budget-friendly first step into Essex County homeownership." },
    { name: "Nutley",      lat: 40.8223, lng: -74.1599, tax: 2.43, note: "Tight-knit town with strong schools and classic colonials." },
    { name: "Hackensack",  lat: 40.8859, lng: -74.0435, tax: null, note: "Bergen County hub with condos, rentals, and a major medical center." }
  ],

  /* Recent sales. Copy these from her Zillow / MLS sold history.
     Leave empty and the site shows a link to her Zillow profile instead.
     Example:
     { address: "123 Main St", city: "East Orange", price: 489000, beds: 3, baths: 2, sqft: 1540,
       date: "2026-03", side: "Seller", image: "assets/img/sold-1.jpg" }                         */
  sales: [],

  /* Client reviews. Paste real reviews from Zillow/Google only.
     Leave empty and the site invites clients to leave one.
     { name: "Maria G.", date: "2026-05", rating: 5, type: "Bought a home in Montclair", text: "..." } */
  reviews: []
};
