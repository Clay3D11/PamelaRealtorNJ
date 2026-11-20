/* Site behaviour: renders AGENT data, nav, map, reveal, lead form */
(function () {
  const A = window.AGENT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const t = (k, fb) => (window.I18N ? I18N.t(k, fb) : fb);
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const fullAddr = [A.office.street, A.office.city, `${A.office.state} ${A.office.zip}`].filter(Boolean).join(", ");

  /* ---------- Fill simple fields ---------- */
  const fills = {
    title: A.title, brokerage: A.brokerage, license: A.license, phone: A.phone,
    officeName: A.office.name, address: fullAddr
  };
  $$("[data-fill]").forEach(el => { el.textContent = fills[el.dataset.fill] || ""; });
  $("#yr").textContent = new Date().getFullYear();

  const photo = $("#agentPhoto");
  if (photo && A.photo) photo.src = A.photo;
  $$("[data-photo]").forEach(i => { if (A.photo) i.src = A.photo; else i.remove(); });

  /* ---------- Contact links ---------- */
  const waText = encodeURIComponent("Hi Pamela! I found your website and I'd love to talk about real estate.");
  const hrefs = {
    tel: A.phoneRaw ? "tel:" + A.phoneRaw : "",
    sms: A.mobile ? "sms:" + A.mobile : "",
    wa: A.whatsapp ? `https://wa.me/${A.whatsapp}?text=${waText}` : "",
    zillow: A.zillow,
    email: A.email ? "mailto:" + A.email : "",
    // opens a Gmail compose window with her address and a subject already filled in
    gmail: A.email ? "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(A.email) +
      "&su=" + encodeURIComponent("Real estate question from your website") : ""
  };
  // buttons whose contact method isn't set in data.js are removed,
  // unless they have a data-fallback link (e.g. the nav email button goes to the contact form)
  $$("[data-href]").forEach(el => {
    const h = hrefs[el.dataset.href];
    if (!h) { if (el.dataset.fallback) el.href = el.dataset.fallback; else el.remove(); return; }
    el.href = h;
    if (el.dataset.href === "wa" || el.dataset.href === "gmail") { el.target = "_blank"; el.rel = "noopener"; }
  });

  /* ---------- Contact form: only offer channels that exist ---------- */
  const channels = { wa: !!A.whatsapp, sms: !!A.mobile, email: !!A.email };
  $$('.send-via input[name="via"]').forEach(r => { if (!channels[r.value]) r.closest("label").remove(); });
  const firstVia = $('.send-via input[name="via"]');
  if (firstVia) firstVia.checked = true;
  else $(".send-via")?.remove();

  /* ---------- Stats: null in data.js = hidden everywhere ---------- */
  $$("[data-count]").forEach(el => {
    if (A.stats[el.dataset.count] == null) (el.closest(".stat, .mini-stats > div, .about-float") || el).remove();
  });

  /* ---------- Specialties ---------- */
  $("#specialtyTags").innerHTML = A.specialties.concat(A.languages).map(s => `<span>${s}</span>`).join("");

  /* ---------- Socials ---------- */
  const ico = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4 2.3 2.3 4 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1C2.3 20 4 21.7 7.9 21.9c1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.9-.2 5.6-1.9 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1C21.7 4 20 2.3 16.1 2.1 15 2 14.7 2 12 2z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-3.3 0-5 2.4-5 5.3V8H6v4h3v11h5V12h3.4l.6-4z"/></svg>',
    zillow: '<svg viewBox="0 0 24 24"><path d="M12 2 1 11h3v10h16V11h3zm4 15H8v-2l5-5H8V8h8v2l-5 5h5z"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>'
  };
  const soc = [["zillow", A.zillow], ["instagram", A.instagram], ["facebook", A.facebook], ["wa", hrefs.wa]].filter(s => s[1]);  $("#socials").innerHTML = soc.map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${k}">${ico[k]}</a>`).join("");

  /* ---------- Nav ---------- */
  const nav = $("#nav"), fab = $(".fab");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    fab.classList.toggle("show", y > window.innerHeight * .7);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $("#burger"), links = $("#navLinks");
  /* Explore dropdown (Services / Areas / Calculator / FAQ popups) */
  const drop = $("#navDrop"), dropBtn = $(".nav-drop-btn");
  const setDrop = open => { drop.classList.toggle("open", open); dropBtn.setAttribute("aria-expanded", open); };
  dropBtn.addEventListener("click", () => setDrop(!drop.classList.contains("open")));
  document.addEventListener("click", e => { if (!drop.contains(e.target)) setDrop(false); });
  drop.addEventListener("click", e => { if (e.target.closest("a")) setDrop(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setDrop(false); });

  const setMenu = open => {
    burger.classList.toggle("open", open); links.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    if (!open) setDrop(false);
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  $$("a", links).forEach(a => a.addEventListener("click", () => setMenu(false)));
  $("#navBackdrop").addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  // close drawer if the screen grows back to desktop (rotation / resize)
  matchMedia("(min-width: 1081px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

  // active link highlight
  const secs = $$("section[id]");
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$("a", links).forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => spy.observe(s));

  /* ---------- Reveal + counters ---------- */
  const rev = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); }
  }), { threshold: .12 });
  $$(".reveal").forEach(el => rev.observe(el));

  const countUp = el => {
    const end = A.stats[el.dataset.count] || 0, dur = 1400, t0 = performance.now();
    const step = now => {
      const p = Math.max(0, Math.min(1, (now - t0) / dur));   // first frame can be slightly before t0
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cnt = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { countUp(e.target); cnt.unobserve(e.target); }
  }), { threshold: .5 });
  $$("[data-count]").forEach(el => cnt.observe(el));

  /* ---------- Process toggle ---------- */
  $$("#procToggle button").forEach(b => b.addEventListener("click", () => {
    $$("#procToggle button").forEach(x => x.classList.toggle("active", x === b));
    $$("[data-proc-list]").forEach(l => l.classList.toggle("hidden", l.dataset.procList !== b.dataset.proc));
  }));

  /* ---------- Sales ---------- */
  function renderSales() {
    const g = $("#salesGrid");
    if (A.sales.length) {
      g.innerHTML = A.sales.map(s => `
        <article class="sale reveal in">
          <div class="sale-img" style="${s.image ? `background-image:url('${s.image}')` : ""}"><span class="tag">${t("sales.sold", "SOLD")}</span></div>
          <div class="sale-body">
            <strong>${money(s.price)}</strong>
            <p>${s.address}, ${s.city}${s.side ? " · " + s.side : ""}</p>
            <div class="sale-meta"><span>${s.beds} bd</span><span>${s.baths} ba</span>${s.sqft ? `<span>${s.sqft.toLocaleString()} sqft</span>` : ""}${s.date ? `<span>${s.date}</span>` : ""}</div>
          </div>
        </article>`).join("");
    } else {
      g.innerHTML = `
        <div class="sales-cta">
          <div class="sc-img"></div>
          <div class="sc-body">
            <h3>${t("sales.ctaT", "Real closings. <em>Real families.</em>")}</h3>
            <div class="sc-nums">
              ${A.stats.homesSold != null ? `<div><strong>${A.stats.homesSold}+</strong><span>${t("stat.sold", "Homes sold")}</span></div>` : ""}
              <div><strong>${A.areas.length}</strong><span>${t("stat.areas", "Areas")}</span></div>
            </div>
            <p>${t("sales.ctaP", "See every home Pamela has closed, with prices, dates, and locations, on her verified Zillow sales history.")}</p>
            <div class="btns">
              <a class="btn btn-gold" href="${A.zillow}" target="_blank" rel="noopener">${t("sales.ctaB", "View sales history ↗")}</a>
              <a class="btn btn-outline-light" href="#contact" data-intent-link="Sell">${t("sales.ctaB2", "What's my home worth?")}</a>
            </div>
          </div>
        </div>`;
    }
  }

  /* ---------- Reviews ---------- */
  function renderReviews() {
    const g = $("#revGrid");
    if (A.reviews.length) {
      g.innerHTML = A.reviews.map(r => `
        <article class="rev reveal in">
          <div class="stars">${"★".repeat(r.rating || 5)}</div>
          <p>${r.text}</p>
          <div class="rev-who"><b>${r.name[0]}</b><div><strong>${r.name}</strong><small>${r.type || ""}${r.date ? " · " + r.date : ""}</small></div></div>
        </article>`).join("");
    } else {
      g.innerHTML = `
        <div class="rev-empty">
          <div class="stars-big">★★★★★</div>
          <h3>${t("rev.emptyT", "Worked with Pamela?")}</h3>
          <p>${t("rev.emptyP", "Your words help the next family find a great agent. Share your experience on her Zillow profile and it will be featured here.")}</p>
          <div class="btns">
            <a class="btn btn-gold" href="${A.zillow}" target="_blank" rel="noopener">${t("rev.emptyB", "Leave a review on Zillow ↗")}</a>
            <a class="btn btn-outline" href="#contact">${t("rev.emptyB2", "Become her next success story")}</a>
          </div>
        </div>`;
    }
  }

  /* ---------- Areas + map ---------- */
  const list = $("#areaList"), detail = $("#areaDetail");
  let map, markers = [];
  list.innerHTML = A.areas.map((a, i) => `<button class="area-btn${i === 0 ? " active" : ""}" data-i="${i}">${a.name}<small>${t("areas.explore", "Explore")} →</small></button>`).join("");
  const areaSelect = $("#leadArea");
  A.areas.forEach(a => areaSelect.insertAdjacentHTML("beforeend", `<option>${a.name}</option>`));

  function selectArea(i, fly = true) {
    const a = A.areas[i];
    $$(".area-btn", list).forEach(b => b.classList.toggle("active", +b.dataset.i === i));
    detail.querySelector("strong").textContent = a.name;
    detail.querySelector("p").textContent = t("area." + a.name, a.note);
    markers.forEach((m, j) => m.getElement()?.querySelector(".pin")?.classList.toggle("on", j === i));
    if (map && fly) map.flyTo([a.lat, a.lng], 12, { duration: 1.1 });
  }
  list.addEventListener("click", e => { const b = e.target.closest(".area-btn"); if (b) selectArea(+b.dataset.i); });

  function initMap() {
    if (!window.L) { $("#areaMap").innerHTML = `<iframe style="width:100%;height:100%;border:0" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(A.office.city + ", " + A.office.state)}&z=10&output=embed"></iframe>`; return; }
    // on touch screens, one finger scrolls the page; two fingers pan/zoom the map
    const touch = matchMedia("(hover: none)").matches;
    map = L.map("areaMap", { scrollWheelZoom: false, zoomControl: true, dragging: !touch, tap: false }).setView([A.office.lat, A.office.lng], 11);
    new ResizeObserver(() => map.invalidateSize()).observe($("#areaMap"));
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    const pin = cls => L.divIcon({ className: "", html: `<div class="pin ${cls || ""}"></div>`, iconSize: [30, 30], iconAnchor: [15, 30] });
    A.areas.forEach((a, i) => {
      const m = L.marker([a.lat, a.lng], { icon: pin(i === 0 ? "on" : "") }).addTo(map).bindTooltip(a.name, { direction: "top", offset: [0, -28] });
      m.on("click", () => selectArea(i));
      markers.push(m);
    });
    L.marker([A.office.lat, A.office.lng], { icon: pin("pin-office"), zIndexOffset: 1000 }).addTo(map)
      .bindPopup(`<strong>${A.office.name}</strong><br>${fullAddr}`);
    map.fitBounds(L.latLngBounds(A.areas.map(a => [a.lat, a.lng])).pad(.15));
  }
  // the map is built the first time the Areas popup opens (see openModal below)

  /* ---------- Office Google map ---------- */
  const q = encodeURIComponent(`${A.office.name}, ${fullAddr}`);
  $("#gmap").src = `https://www.google.com/maps?q=${q}&z=15&output=embed`;
  $("#directions").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  $("#hours").innerHTML = A.office.hours.map(([d, h]) => `<li><b>${d}</b><span>${h}</span></li>`).join("");

  /* ---------- Intent chips -> contact form ---------- */
  function setIntent(v) {
    $$("#leadIntent button").forEach(b => b.classList.toggle("active", b.dataset.v === v || (v === "Rent" && b.dataset.v === "Rent")));
  }
  $$("#leadIntent button").forEach(b => b.addEventListener("click", () => setIntent(b.dataset.v)));
  $$(".intent .chip").forEach(c => c.addEventListener("click", () => {
    $$(".intent .chip").forEach(x => x.classList.toggle("active", x === c));
    setIntent(c.dataset.intent);
    $("#contact").scrollIntoView({ behavior: "smooth" });
  }));
  document.addEventListener("click", e => { const l = e.target.closest("[data-intent-link]"); if (l) setIntent(l.dataset.intentLink); });

  /* ---------- Lead form ---------- */
  const toast = msg => { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 3800); };
  window.showToast = toast;
  $("#leadForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const intent = $("#leadIntent .active")?.dataset.v || "Buy";
    const calc = window.lastCalc ? `\nCalculator: ${window.lastCalc}` : "";
    const body =
`Hi Pamela! I'd like help to ${intent.toUpperCase()}.
Name: ${f.get("name")}
Phone: ${f.get("phone")}${f.get("email") ? "\nEmail: " + f.get("email") : ""}${f.get("area") ? "\nArea: " + f.get("area") : ""}${f.get("budget") ? "\nBudget: " + f.get("budget") : ""}${f.get("msg") ? "\n\n" + f.get("msg") : ""}${calc}`;
    const via = f.get("via");
    const enc = encodeURIComponent(body);
    let url;
    if (via === "email" && A.email) url = `mailto:${A.email}?subject=${encodeURIComponent("New inquiry: " + intent)}&body=${enc}`;
    else if (via === "sms" && A.mobile) url = `sms:${A.mobile}?&body=${enc}`;
    else if (via === "wa" && A.whatsapp) url = `https://wa.me/${A.whatsapp}?text=${enc}`;
    // no messaging channel set in data.js yet: fall back to a phone call
    if (!url) { toast(`${t("ct.callUs", "Call Pamela at")} ${A.phone}`); if (A.phoneRaw) location.href = "tel:" + A.phoneRaw; return; }
    window.open(url, via === "wa" ? "_blank" : "_self");
    toast(t("ct.thanks", "Thanks! Your message is ready to send to Pamela."));
  });

  /* ---------- Render + re-render on language change ---------- */
  const renderAll = () => { renderSales(); renderReviews(); selectArea(+($(".area-btn.active")?.dataset.i || 0), false);
    $$(".area-btn small").forEach(s => s.textContent = t("areas.explore", "Explore") + " →"); };
  renderAll();
  document.addEventListener("langchange", renderAll);

  /* ---------- Popups (Services / Areas / FAQ) ----------
     Any element with data-modal="<modalId>" opens that popup.
     [data-close] elements and the Esc key close it. */
  let openModalEl = null, lastFocus = null;
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    if (openModalEl) closeModal(false);
    setMenu(false);
    lastFocus = document.activeElement;
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    openModalEl = m;
    m.querySelector(".modal-body").scrollTop = 0;
    m.querySelector(".modal-close").focus({ preventScroll: true });
    m.querySelectorAll("video").forEach(v => v.play().catch(() => {}));
    // the map lives in a hidden popup, so build it the first time the popup opens
    if (id === "areasModal") {
      if (!map) { initMap(); selectArea(0, false); }
      else { map.invalidateSize(); selectArea(+($(".area-btn.active")?.dataset.i || 0)); }
    }
  }
  function closeModal(restoreFocus = true) {
    if (!openModalEl) return;
    openModalEl.classList.remove("open"); openModalEl.setAttribute("aria-hidden", "true");
    openModalEl.querySelectorAll("video").forEach(v => v.pause());
    document.body.classList.remove("modal-open");
    openModalEl = null;
    if (restoreFocus && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("click", e => {
    const opener = e.target.closest("[data-modal]");
    if (opener) {
      e.preventDefault(); openModal(opener.dataset.modal);
      // data-tab="afford" etc. opens the calculator popup on that tab
      if (opener.dataset.tab && window.calcSwitchTab) window.calcSwitchTab(opener.dataset.tab);
      return;
    }
    if (!openModalEl) return;
    if (e.target.closest("[data-close]")) { closeModal(); return; }
    // links inside a popup that jump to a page section (e.g. #contact) close it first
    const jump = e.target.closest('a[href^="#"]');
    if (jump && openModalEl.contains(jump)) closeModal(false);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
    // keep Tab focus inside the open popup
    if (e.key === "Tab" && openModalEl) {
      const f = $$('a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])', openModalEl).filter(x => x.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // deep links: site.com/#faq opens the FAQ popup
  const hashModal = { "#roadmap": "roadmapModal", "#services": "servicesModal", "#areas": "areasModal", "#faq": "faqModal", "#calculator": "calcModal" };
  if (hashModal[location.hash]) setTimeout(() => openModal(hashModal[location.hash]), 300);

  /* ---------- Launch cards: counts + preview pills come from the popups ---------- */
  const labelOf = el => (el.childNodes[0]?.textContent || el.textContent).trim();
  function renderLaunchers() {
    $$("[data-count-for]").forEach(el => { el.textContent = $$(el.dataset.countFor).length; });
    $$("[data-preview-for]").forEach(el => {
      const items = $$(el.dataset.previewFor).map(labelOf);
      const max = +el.dataset.previewMax || 4, extra = items.length - max;
      el.innerHTML = items.slice(0, max).map(s => `<span>${s}</span>`).join("") +
        (extra > 0 && !el.classList.contains("lines") ? `<span class="more">+${extra}</span>` : "");
    });
  }
  renderLaunchers();
  document.addEventListener("langchange", renderLaunchers);
})();
