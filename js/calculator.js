/* ==========================================================================
   Mortgage calculator - payment, loan comparison, affordability.
   Sample rates live in PROGRAMS below; update them any time.
   ========================================================================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const t = (k, fb) => (window.I18N ? I18N.t(k, fb) : fb);
  const num = v => parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0;
  const fmt = n => Math.round(n).toLocaleString("en-US");
  const usd = n => "$" + fmt(n);
  const usdK = n => n >= 1e6 ? "$" + (n / 1e6).toFixed(2) + "M" : "$" + Math.round(n / 1000) + "K";

  /* ---------- Loan programs (sample rates, edit freely) ---------- */
  const PROGRAMS = {
    conv30: { name: "Conventional", sub: "30-yr fixed", rate: 6.25, term: 30, minDown: 3, cmpDown: 5, mi: "pmi",
      desc: "The most popular loan in America. As little as 3% down for first-time buyers, and PMI goes away once you reach 20% equity." },
    conv15: { name: "Conventional", sub: "15-yr fixed", rate: 5.6, term: 15, minDown: 3, cmpDown: 10, mi: "pmi",
      desc: "Higher monthly payment, much lower rate, and you're mortgage-free in half the time. Saves a lot of interest." },
    fha: { name: "FHA", sub: "3.5% down", rate: 6.0, term: 30, minDown: 3.5, cmpDown: 3.5, mi: "fha",
      desc: "Government-backed. 3.5% down with 580+ credit and flexible approval. Includes a 1.75% upfront MIP (added to the loan) plus monthly MIP." },
    va: { name: "VA", sub: "0% down", rate: 5.75, term: 30, minDown: 0, cmpDown: 0, mi: "va",
      desc: "For veterans, active military, and eligible spouses. $0 down, no monthly mortgage insurance, and a one-time funding fee (added to the loan)." },
    usda: { name: "USDA", sub: "0% down", rate: 6.0, term: 30, minDown: 0, cmpDown: 0, mi: "usda",
      desc: "$0 down for eligible rural and suburban areas (mostly in rural parts of North and South Jersey, not Essex County). 1% upfront guarantee fee + 0.35% annual fee. Income limits apply." },
    jumbo: { name: "Jumbo", sub: "Luxury homes", rate: 6.5, term: 30, minDown: 10, cmpDown: 10, mi: "pmi",
      desc: "For loan amounts above the conforming limit (Essex County 2026: $1,209,750). Usually needs 10 to 20% down and strong credit and reserves." },
    arm: { name: "5/6 ARM", sub: "Adjustable", rate: 5.85, term: 30, minDown: 5, cmpDown: 5, mi: "pmi", arm: { fixed: 5, first: 2, life: 5 },
      desc: "Lower fixed rate for 5 years, then it adjusts every 6 months. Great if you plan to sell or refinance within a few years." },
    dscr: { name: "Investor", sub: "DSCR / rental", rate: 7.25, term: 30, minDown: 20, cmpDown: 20, mi: "none",
      desc: "For investment properties. Qualifies on the property's rental income instead of your W-2. Usually 20 to 25% down." }
  };
  const ORDER = Object.keys(PROGRAMS);
  let prog = "conv30";

  /* ---------- New Jersey rules (2026) - update yearly ----------
     loanLimit: Essex County 1-unit conforming limit (FHFA 2026).
     dpaPrograms: first mortgages NJHMFA down payment assistance can pair with.
     Flat fees are typical North Jersey buyer costs, used for cash to close. */
  const NJ = {
    loanLimit: 1209750,
    dpaPrograms: ["conv30", "conv15", "fha", "va", "usda"],
    appraisal: 650, attorney: 1500, inspection: 650, recording: 450
  };

  /** Typical NJ buyer closing costs (the seller pays the transfer fee and mansion tax) */
  function njClosing(o, loan) {
    const items = [
      ["nj.i1", "Lender fees & appraisal", loan > 0 ? loan * .0075 + NJ.appraisal : 0],
      ["nj.i2", "Title insurance & search", Math.max(1200, o.price * .005)],
      ["nj.i3", "Attorney fee", NJ.attorney],
      ["nj.i4", "Home inspection", NJ.inspection],
      ["nj.i5", "Recording & government fees", NJ.recording],
      ["nj.i6", "Prepaid taxes & insurance (escrow)", o.price * o.taxPct / 100 / 4 + o.ins]
    ];
    return { items, total: items.reduce((sum, i) => sum + i[2], 0) };
  }

  /** NJ Graduated Percent Fee ("mansion tax"), seller-paid since July 10, 2025 */
  function mansionTax(price) {
    if (price <= 1e6) return 0;
    const rate = price <= 2e6 ? .01 : price <= 2.5e6 ? .02 : price <= 3e6 ? .025 : price <= 3.5e6 ? .03 : .035;
    return price * rate;
  }

  /* ---------- Core math ---------- */
  const pmt = (L, ratePct, years) => {
    const r = ratePct / 1200, n = years * 12;
    return r === 0 ? L / n : L * r / (1 - Math.pow(1 + r, -n));
  };

  function pmiRate(ltv) {            // annual % of loan, rough market averages
    if (ltv <= 80) return 0;
    if (ltv <= 85) return .25;
    if (ltv <= 90) return .4;
    if (ltv <= 95) return .55;
    return .75;
  }

  /** Full monthly breakdown for a scenario */
  function scenario(o) {
    const p = PROGRAMS[o.prog];
    const downAmt = Math.min(o.price, o.price * o.downPct / 100);
    let base = o.price - downAmt;
    const ltv = o.price ? base / o.price * 100 : 0;
    let upfront = 0, miMonthly = 0, miLabel = "PMI";

    if (p.mi === "fha") {
      upfront = base * .0175;
      const annual = o.term > 15 ? (ltv > 95 ? .55 : .5) : (ltv > 90 ? .4 : .15);
      miMonthly = base * annual / 100 / 12; miLabel = "FHA MIP";
    } else if (p.mi === "va") {
      upfront = base * (o.downPct < 5 ? .0215 : o.downPct < 10 ? .015 : .0125); miLabel = "VA fee";
    } else if (p.mi === "usda") {
      upfront = base * .01; miMonthly = base * .0035 / 12; miLabel = "USDA fee";
    } else if (p.mi === "pmi") {
      miMonthly = base * pmiRate(ltv) / 100 / 12;
    }
    const loan = base + upfront;
    const pi = pmt(loan, o.rate, o.term);
    const tax = o.price * o.taxPct / 100 / 12;
    const ins = o.ins / 12;
    const total = pi + tax + ins + miMonthly + o.hoa;
    const closing = njClosing(o, loan);
    const dpa = o.dpa && NJ.dpaPrograms.includes(o.prog) ? Math.min(o.dpa, downAmt + closing.total) : 0;
    return { p, downAmt, base, loan, upfront, ltv, pi, tax, ins, mi: miMonthly, miLabel, hoa: o.hoa, total,
      closing, dpa, cash: downAmt + closing.total - dpa };
  }

  /** Amortization with optional extra principal. Returns yearly rows + totals */
  function amortize(loan, ratePct, years, extra = 0) {
    const r = ratePct / 1200, n = years * 12, m = pmt(loan, ratePct, years);
    let bal = loan, cumInt = 0, cumPrin = 0, months = 0;
    const rows = [];
    let yInt = 0, yPrin = 0;
    for (let i = 1; i <= n && bal > .005; i++) {
      const int = bal * r;
      let prin = Math.min(bal, m - int + extra);
      bal -= prin; cumInt += int; cumPrin += prin; yInt += int; yPrin += prin; months = i;
      if (i % 12 === 0 || bal <= .005) {
        rows.push({ year: Math.ceil(i / 12), int: yInt, prin: yPrin, bal: Math.max(0, bal), cumInt, cumPrin });
        yInt = yPrin = 0;
      }
    }
    return { rows, totalInt: cumInt, months };
  }

  /* ---------- Inputs ---------- */
  const el = id => document.getElementById(id);
  const I = {
    price: el("price"), priceR: el("priceR"), downAmt: el("downAmt"), downPct: el("downPct"), downR: el("downR"),
    rate: el("rate"), term: el("term"), taxPct: el("taxPct"), ins: el("ins"), hoa: el("hoa"), extra: el("extra")
  };
  const read = () => ({
    prog, price: num(I.price.value), downPct: num(I.downPct.value), rate: num(I.rate.value), term: +I.term.value,
    taxPct: num(I.taxPct.value), ins: num(I.ins.value), hoa: num(I.hoa.value), extra: num(I.extra.value),
    dpa: num(el("njDpa").value)
  });

  /* ---------- Town picker: sets the NJ property tax rate ---------- */
  const town = el("town");
  const taxTowns = () => (window.AGENT?.areas || []).filter(a => a.tax != null);
  function renderTowns() {
    const cur = town.value;
    town.innerHTML = taxTowns().map(a => `<option value="${a.name}">${a.name} · ${a.tax}%</option>`).join("") +
      `<option value="">${t("calc.townOther", "Other town (type the rate)")}</option>`;
    town.value = cur;
  }
  renderTowns();
  if (taxTowns().length) { town.value = taxTowns()[0].name; I.taxPct.value = taxTowns()[0].tax; }
  town.addEventListener("change", () => {
    const a = taxTowns().find(x => x.name === town.value);
    if (a) { I.taxPct.value = a.tax; update(); }
  });
  I.taxPct.addEventListener("input", () => { town.value = ""; });
  el("njDpa").addEventListener("change", () => update());
  const paintRange = r => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%");

  // loan type buttons
  el("loanTypes").innerHTML = ORDER.map(k => {
    const p = PROGRAMS[k];
    return `<button type="button" class="lt${k === prog ? " active" : ""}" data-k="${k}">${t("lp." + k, p.name)}<small>${t("lps." + k, p.sub)}</small></button>`;
  }).join("");

  function setProgram(k, keepDown) {
    prog = k; const p = PROGRAMS[k];
    $$(".lt").forEach(b => b.classList.toggle("active", b.dataset.k === k));
    I.rate.value = p.rate;
    I.term.value = String(p.term);
    if (!keepDown) {
      const cur = num(I.downPct.value);
      if (cur < p.minDown || (p.minDown === 0 && cur > 0 && (k === "va" || k === "usda"))) I.downPct.value = p.minDown;
      if (k === "conv30" || k === "conv15") I.downPct.value = Math.max(cur, p.minDown);
    }
    syncDown("pct"); update();
  }
  el("loanTypes").addEventListener("click", e => { const b = e.target.closest(".lt"); if (b) setProgram(b.dataset.k); });

  function syncDown(from) {
    const price = num(I.price.value);
    if (from === "amt") {
      const pct = price ? num(I.downAmt.value) / price * 100 : 0;
      I.downPct.value = +pct.toFixed(1);
    } else {
      I.downAmt.value = fmt(price * num(I.downPct.value) / 100);
    }
    I.downR.value = Math.min(60, num(I.downPct.value)); paintRange(I.downR);
  }

  I.priceR.addEventListener("input", () => { I.price.value = fmt(I.priceR.value); paintRange(I.priceR); syncDown("pct"); update(); });
  I.price.addEventListener("input", () => { const v = num(I.price.value); I.priceR.value = v; paintRange(I.priceR); syncDown("pct"); update(); });
  I.downR.addEventListener("input", () => { I.downPct.value = I.downR.value; syncDown("pct"); update(); });
  I.downPct.addEventListener("input", () => { syncDown("pct"); update(); });
  I.downAmt.addEventListener("input", () => { syncDown("amt"); update(); });
  [I.rate, I.term, I.taxPct, I.ins, I.hoa, I.extra].forEach(x => x.addEventListener("input", update));
  // pretty-format money fields on blur
  [I.price, I.downAmt, I.ins, I.hoa, I.extra, el("cmpPrice"), el("aIncome"), el("aDebts"), el("aDown")].forEach(x =>
    x.addEventListener("blur", () => { x.value = fmt(num(x.value)); }));

  /* ---------- Donut ---------- */
  const COLORS = { pi: "#d4af6a", tax: "#2a9d8f", ins: "#e07a5f", mi: "#9b8cff", hoa: "#7fb7e6" };
  function drawDonut(s) {
    const parts = [
      ["pi", t("calc.pi", "Principal & interest"), s.pi],
      ["tax", t("calc.ptax", "Property tax"), s.tax],
      ["ins", t("calc.pins", "Home insurance"), s.ins],
      ["mi", s.miLabel, s.mi],
      ["hoa", "HOA", s.hoa]
    ].filter(p => p[2] > 0.5);
    const C = 2 * Math.PI * 15.915; // r so circumference ~100
    let off = 0, svg = `<circle cx="21" cy="21" r="15.915" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5.5"/>`;
    parts.forEach(([k, , v]) => {
      const pct = v / s.total * 100;
      svg += `<circle cx="21" cy="21" r="15.915" fill="none" stroke="${COLORS[k]}" stroke-width="5.5" stroke-dasharray="${Math.max(0, pct - .6)} ${100 - pct + .6}" stroke-dashoffset="${-off}"/>`;
      off += pct;
    });
    el("donut").innerHTML = svg;
    el("legend").innerHTML = parts.map(([k, label, v]) => `<li><i style="background:${COLORS[k]}"></i>${label}<b>${usd(v)}</b></li>`).join("");
  }

  /* ---------- Amortization chart (canvas) ---------- */
  const cv = el("amortChart"), tip = el("chartTip");
  let chartRows = [], chartGeom = null;
  function drawChart() {
    const rows = chartRows; if (!rows.length) return;
    const dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight || 260;
    if (!W) return;
    cv.width = W * dpr; cv.height = H * dpr;
    const c = cv.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    const small = W < 480;
    const pad = { l: small ? 44 : 58, r: 10, t: 12, b: 28 };
    const max = Math.max(rows[0].bal + rows[0].prin, rows[rows.length - 1].cumInt, rows[rows.length - 1].cumPrin);
    const x = i => pad.l + (W - pad.l - pad.r) * (i / Math.max(1, rows.length - 1));
    const y = v => pad.t + (H - pad.t - pad.b) * (1 - v / max);
    chartGeom = { x, y, pad, W, H };

    // grid + labels
    c.font = (small ? 10 : 11) + "px Inter, sans-serif"; c.fillStyle = "rgba(255,255,255,.45)"; c.strokeStyle = "rgba(255,255,255,.07)";
    for (let g = 0; g <= 4; g++) {
      const v = max * g / 4, yy = y(v);
      c.beginPath(); c.moveTo(pad.l, yy); c.lineTo(W - pad.r, yy); c.stroke();
      c.textAlign = "right"; c.fillText(usdK(v), pad.l - 8, yy + 4);
    }
    c.textAlign = "center";
    const stepY = rows.length > 20 ? (small ? 10 : 5) : rows.length > 10 ? (small ? 5 : 2) : 1;
    rows.forEach((r, i) => { if (r.year % stepY === 0 || i === 0) c.fillText((small ? "" : t("calc.yr", "Yr") + " ") + r.year, x(i), H - 8); });

    // balance area
    const grad = c.createLinearGradient(0, pad.t, 0, H - pad.b);
    grad.addColorStop(0, "rgba(212,175,106,.45)"); grad.addColorStop(1, "rgba(212,175,106,0)");
    c.beginPath(); c.moveTo(x(0), y(0));
    rows.forEach((r, i) => c.lineTo(x(i), y(r.bal)));
    c.lineTo(x(rows.length - 1), y(0)); c.closePath(); c.fillStyle = grad; c.fill();
    const line = (key, color, w = 2.5) => {
      c.beginPath(); rows.forEach((r, i) => i ? c.lineTo(x(i), y(r[key])) : c.moveTo(x(i), y(r[key])));
      c.strokeStyle = color; c.lineWidth = w; c.lineJoin = "round"; c.stroke();
    };
    line("bal", "#d4af6a", 3); line("cumPrin", "#2a9d8f"); line("cumInt", "#e07a5f");
  }
  // pointer events = mouse, pen and finger
  const showTip = e => {
    if (!chartGeom || !chartRows.length) return;
    const rect = cv.getBoundingClientRect(), mx = e.clientX - rect.left;
    const { pad, W } = chartGeom;
    const i = Math.max(0, Math.min(chartRows.length - 1, Math.round((mx - pad.l) / (W - pad.l - pad.r) * (chartRows.length - 1))));
    const r = chartRows[i];
    tip.innerHTML = `<b>${t("calc.year", "Year")} ${r.year}</b><br>${t("calc.bal", "Balance")}: ${usd(r.bal)}<br>${t("calc.princ", "Principal paid")}: ${usd(r.cumPrin)}<br>${t("calc.intpaid", "Interest paid")}: ${usd(r.cumInt)}`;
    tip.style.opacity = 1;
    const px = cv.offsetLeft + chartGeom.x(i);
    const left = px + 12 + tip.offsetWidth > cv.offsetLeft + W ? px - tip.offsetWidth - 12 : px + 12;
    tip.style.left = Math.max(cv.offsetLeft, left) + "px"; tip.style.top = (cv.offsetTop + 10) + "px";
  };
  cv.addEventListener("pointermove", showTip);
  cv.addEventListener("pointerdown", showTip);
  cv.addEventListener("pointerleave", () => tip.style.opacity = 0);
  document.addEventListener("pointerdown", e => { if (e.target !== cv) tip.style.opacity = 0; });
  // redraw on any size change (window resize, phone rotation, tab switch)
  let rz; new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(drawChart, 80); }).observe(cv);

  /* ---------- Main update ---------- */
  function update() {
    const o = read(), p = PROGRAMS[prog];
    const s = scenario(o);
    el("loanDesc").textContent = t("ld." + prog, p.desc);
    el("payTotal").textContent = usd(s.total);
    el("kLoan").textContent = usd(s.loan);
    el("kCash").textContent = usd(s.cash);

    // hints
    const hint = el("downHint"); hint.className = "hint"; hint.textContent = "";
    if (o.downPct < p.minDown) { hint.textContent = `${t("calc.minDown", "Minimum down for this program is about")} ${p.minDown}%`; hint.classList.add("warn"); }
    else if (p.mi === "pmi" && s.ltv > 80) hint.textContent = `${t("calc.pmiHint", "Under 20% down adds PMI of about")} ${usd(s.mi)}/mo ${t("calc.pmiHint2", "until you reach 20% equity.")}`;
    else if (s.upfront) hint.textContent = `${s.miLabel} ${usd(s.upfront)} ${t("calc.financed", "is added to your loan.")}`;
    // NJ loan limits (Essex County 2026)
    const overLimit = s.base > NJ.loanLimit;
    if ((prog === "conv30" || prog === "conv15" || prog === "arm") && overLimit) { hint.textContent = t("calc.limitConv", "Above Essex County's 2026 conforming limit ($1,209,750), so this would need a jumbo loan."); hint.classList.add("warn"); }
    if (prog === "fha" && overLimit) { hint.textContent = t("calc.limitFha", "Above the FHA limit for Essex County (about $1.21M). Try a bigger down payment or a jumbo loan."); hint.classList.add("warn"); }
    if (prog === "jumbo" && !overLimit) { hint.textContent = t("calc.jumboHint", "This loan is within Essex County's 2026 conforming limit ($1,209,750). A conventional loan may be cheaper."); hint.classList.add("warn"); }

    // NJHMFA down payment assistance
    const dh = el("dpaHint"); dh.className = "hint"; dh.textContent = "";
    if (o.dpa) {
      if (s.dpa) dh.textContent = `${usd(s.dpa)} ${t("calc.dpaOk", "comes off your cash to close. It's a 0% loan forgiven after 5 years, through an NJHMFA participating lender. Income and price limits apply.")}`;
      else { dh.textContent = t("calc.dpaNo", "NJHMFA help pairs with FHA, VA, USDA, or conventional loans, not this program."); dh.classList.add("warn"); }
    }

    // ARM note
    const armEl = el("armNote"); armEl.textContent = "";
    if (p.arm) {
      const fixedM = p.arm.fixed * 12, r = o.rate / 1200, m = s.pi;
      let bal = s.loan; for (let i = 0; i < fixedM; i++) bal -= (m - bal * r);
      const after1 = pmt(bal, o.rate + p.arm.first, o.term - p.arm.fixed);
      const worst = pmt(bal, o.rate + p.arm.life, o.term - p.arm.fixed);
      armEl.textContent = `${t("calc.armA", "Fixed for 5 yrs. After that P&I could be")} ${usd(after1)} (+${p.arm.first}%) · ${t("calc.armB", "max")} ${usd(worst)} (+${p.arm.life}%)`;
    }

    drawDonut(s);

    // amortization
    const base = amortize(s.loan, o.rate, o.term, 0);
    const withX = o.extra > 0 ? amortize(s.loan, o.rate, o.term, o.extra) : base;
    el("kInt").textContent = usd(withX.totalInt);
    const pay = new Date(); pay.setMonth(pay.getMonth() + withX.months + 1);
    el("kPayoff").textContent = pay.toLocaleDateString(window.I18N?.lang === "es" ? "es-US" : "en-US", { month: "short", year: "numeric" });
    const sv = el("savedBox");
    if (o.extra > 0 && base.totalInt - withX.totalInt > 1) {
      const mSaved = base.months - withX.months;
      sv.innerHTML = `💰 ${t("calc.saveA", "Paying an extra")} <b>${usd(o.extra)}/mo</b> ${t("calc.saveB", "saves")} <b>${usd(base.totalInt - withX.totalInt)}</b> ${t("calc.saveC", "in interest and pays off your home")} <b>${Math.floor(mSaved / 12)} ${t("calc.yrs", "yrs")} ${mSaved % 12} ${t("calc.mos", "mos")}</b> ${t("calc.saveD", "sooner.")}`;
      sv.classList.add("show");
    } else sv.classList.remove("show");

    chartRows = withX.rows; drawChart();
    el("schedTable").innerHTML = `<thead><tr><th>${t("calc.year", "Year")}</th><th>${t("calc.princ", "Principal")}</th><th>${t("calc.int", "Interest")}</th><th>${t("calc.bal", "Balance")}</th></tr></thead><tbody>` +
      withX.rows.map(r => `<tr><td>${r.year}</td><td>${usd(r.prin)}</td><td>${usd(r.int)}</td><td>${usd(r.bal)}</td></tr>`).join("") + "</tbody>";

    window.lastCalc = `${p.name} ${p.sub}, ${usd(o.price)} home, ${o.downPct}% down, ${o.rate}% → ~${usd(s.total)}/mo`;
    el("cmpPrice").value = fmt(o.price);
    renderCompare();
    renderNJ(o, s);
    renderPreview(o, s);
  }

  /* ---------- NJ closing costs tab ---------- */
  function renderNJ(o, s) {
    const p = PROGRAMS[prog], gpf = mansionTax(o.price);
    el("njTotal").textContent = usd(s.closing.total);
    el("njMeta").textContent = `${usd(o.price)} ${t("nj.home", "home")} · ${t("lp." + prog, p.name)} · ${t("nj.loan", "loan")} ${usd(s.loan)}`;
    el("njList").innerHTML =
      s.closing.items.map(([k, label, v]) => `<li><span>${t(k, label)}</span><b>${usd(v)}</b></li>`).join("") +
      `<li class="sub"><span>${t("nj.down", "Down payment")}</span><b>${usd(s.downAmt)}</b></li>` +
      (s.dpa ? `<li class="credit"><span>${t("nj.dpa", "NJHMFA assistance")}</span><b>−${usd(s.dpa)}</b></li>` : "") +
      `<li class="seller"><span>${t("nj.mansion", "Mansion tax (seller pays)")}</span><b>${usd(gpf)}</b></li>` +
      `<li class="seller"><span>${t("nj.rtf", "Realty Transfer Fee")}</span><b>${t("nj.seller", "Seller pays")}</b></li>`;
    el("njCash").textContent = usd(s.cash);
  }

  /* ---------- Banner preview on the page (live) ---------- */
  function renderPreview(o, s) {
    const p = PROGRAMS[prog];
    el("clPay").textContent = usd(s.total);
    el("clMeta").textContent = `${usd(o.price)} · ${+o.downPct}% ${t("cl.down", "down")} · ${t("lp." + prog, p.name)} ${t("lps." + prog, p.sub)}`;
    el("clBars").innerHTML = [["pi", s.pi], ["tax", s.tax], ["ins", s.ins], ["mi", s.mi], ["hoa", s.hoa]]
      .filter(x => x[1] > .5).map(([k, v]) => `<i style="flex:${v.toFixed(0)};background:${COLORS[k]}"></i>`).join("");
  }
  function renderPills() {
    const names = [...new Set(ORDER.map(k => t("lp." + k, PROGRAMS[k].name)))];
    el("clPills").innerHTML = names.map(n => `<span>${n}</span>`).join("");
  }

  /* ---------- Compare ---------- */
  function renderCompare() {
    const price = num(el("cmpPrice").value) || num(I.price.value);
    const base = read();
    const list = ORDER.map(k => {
      const p = PROGRAMS[k];
      const s = scenario({ ...base, prog: k, price, downPct: p.cmpDown, rate: p.rate, term: p.term });
      const tot = amortize(s.loan, p.rate, p.term).totalInt;
      return { k, p, s, tot };
    });
    const minPay = Math.min(...list.map(x => x.s.total)), minCash = Math.min(...list.map(x => x.s.cash));
    el("compareGrid").innerHTML = list.map(({ k, p, s, tot }) => {
      const rib = s.total === minPay ? t("cmp.lowPay", "Lowest payment") : s.cash === minCash ? t("cmp.lowCash", "Least cash") : "";
      return `<article class="cmp${rib ? " best" : ""}" data-k="${k}">
        ${rib ? `<span class="ribbon">${rib}</span>` : ""}
        <h4>${t("lp." + k, p.name)}</h4><div class="cmp-sub">${t("lps." + k, p.sub)} · ${p.rate}%</div>
        <div class="cmp-pay">${usd(s.total)}<small>/mo</small></div>
        <dl>
          <dt>${t("cmp.down", "Down")} (${p.cmpDown}%)</dt><dd>${usd(s.downAmt)}</dd>
          <dt>${t("cmp.cash", "Cash to close")}</dt><dd>${usd(s.cash)}</dd>
          <dt>${t("cmp.mi", "Mortgage ins.")}</dt><dd>${s.mi ? usd(s.mi) + "/mo" : "-"}</dd>
          <dt>${t("cmp.int", "Lifetime interest")}</dt><dd>${usdK(tot)}</dd>
        </dl></article>`;
    }).join("");
  }
  el("cmpPrice").addEventListener("input", renderCompare);
  el("compareGrid").addEventListener("click", e => {
    const c = e.target.closest(".cmp"); if (!c) return;
    const p = PROGRAMS[c.dataset.k];
    I.price.value = fmt(num(el("cmpPrice").value)); I.priceR.value = num(I.price.value); paintRange(I.priceR);
    I.downPct.value = p.cmpDown;
    setProgram(c.dataset.k, true);
    switchTab("payment");
  });

  /* ---------- Affordability ---------- */
  const A = { income: el("aIncome"), debts: el("aDebts"), down: el("aDown"), rate: el("aRate"), prog: el("aProg") };
  function maxPrice(budget, cash, k, rate) {
    const key = k === "conv" ? "conv30" : k, p = PROGRAMS[key], base = read();
    let lo = 0, hi = 5e6;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      const downPct = Math.min(100, cash / mid * 100);
      const okDown = downPct >= p.minDown;
      const s = scenario({ ...base, prog: key, price: mid, downPct, rate, term: 30 });
      if (okDown && s.total <= budget) lo = mid; else hi = mid;
    }
    return lo;
  }
  function updateAfford() {
    const inc = num(A.income.value) / 12, debts = num(A.debts.value), cash = num(A.down.value), rate = num(A.rate.value), k = A.prog.value;
    const stretchDti = k === "fha" ? .5 : .45;
    const comfBudget = Math.max(0, Math.min(inc * .28, inc * .36 - debts));
    const maxBudget = Math.max(0, inc * stretchDti - debts);
    const comf = maxPrice(comfBudget, cash, k, rate), mx = maxPrice(maxBudget, cash, k, rate);
    const progKey = k === "conv" ? "conv30" : k;
    const s = scenario({ ...read(), prog: progKey, price: mx, downPct: mx ? Math.min(100, cash / mx * 100) : 0, rate, term: 30 });
    el("aMax").textContent = usd(Math.floor(mx / 1000) * 1000);
    el("aComf").textContent = usd(Math.floor(comf / 1000) * 1000);
    el("aPay").textContent = usd(s.total) + "/mo";
    el("aDti").textContent = inc ? Math.round((s.total + debts) / inc * 100) + "%" : "-";
    el("aLoan").textContent = usd(s.loan);
    el("aMeter").style.setProperty("--m", (mx ? Math.max(4, Math.min(96, comf / mx * 100)) : 50) + "%");
    A._result = { price: Math.floor(mx / 1000) * 1000, prog: progKey, downPct: mx ? +(cash / mx * 100).toFixed(1) : 0, rate };
  }
  Object.values(A).forEach(x => x.addEventListener("input", updateAfford));
  el("aUse").addEventListener("click", () => {
    const r = A._result; if (!r) return;
    I.price.value = fmt(r.price); I.priceR.value = r.price; paintRange(I.priceR);
    I.downPct.value = r.downPct;
    setProgram(r.prog, true); I.rate.value = r.rate; syncDown("pct"); update();
    switchTab("payment");
  });

  /* ---------- Tabs ---------- */
  function switchTab(name) {
    $$("#calcTabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    $$(".calc-panel").forEach(p => { p.classList.toggle("active", p.dataset.panel === name); if (p.dataset.panel === name) p.classList.add("in"); });
    if (name === "payment") requestAnimationFrame(drawChart);
    if (name === "afford") updateAfford();
  }
  $$("#calcTabs button").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));
  $$("[data-tab-go]").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tabGo)));
  window.calcSwitchTab = switchTab;   // used by buttons that open the popup on a specific tab

  /* ---------- Language re-render ---------- */
  document.addEventListener("langchange", () => {
    $$(".lt").forEach(b => { const k = b.dataset.k; b.innerHTML = `${t("lp." + k, PROGRAMS[k].name)}<small>${t("lps." + k, PROGRAMS[k].sub)}</small>`; });
    renderTowns(); renderPills(); update(); updateAfford();
  });

  /* ---------- Init ---------- */
  paintRange(I.priceR); syncDown("pct"); renderPills(); update(); updateAfford();
  // chart needs layout width once visible
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { drawChart(); o.disconnect(); } }).observe(cv);
})();
