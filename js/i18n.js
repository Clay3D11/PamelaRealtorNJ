/* English / Español toggle.
   English text lives in the HTML; Spanish lives here keyed by data-i18n. */
(function () {
  const ES = {
    "nav.tag": "Agente Inmobiliaria en New Jersey",
    "nav.about": "Sobre mí", "nav.services": "Servicios", "nav.areas": "Áreas", "nav.calc": "Calculadora Hipotecaria",
    "nav.faq": "Preguntas", "nav.contact": "Contacto", "nav.call": "Llamar a Pamela", "nav.email": "Escríbele a Pamela",
    "nav.home": "Inicio", "nav.explore": "Explorar", "nav.everything": "Todo lo que necesitas", "nav.roadmap": "El Camino", "nav.track": "Historial", "nav.clients": "Clientes",
    "am.sub": "Hablemos de tu próximo paso.", "nd.road": "Paso a paso para compradores y vendedores", "rm.sub": "¿Listo para el primer paso? Es gratis.", "nd.svc": "Comprar, vender, mudarte, invertir", "nd.areas": "Mapa interactivo de sus pueblos", "nd.calc": "Pagos, préstamos y costos de cierre NJ", "nd.faq": "Respuestas rápidas para compradores y vendedores",

    "hero.eyebrow": "REAL · Fairfield, NJ",
    "hero.title": "Tu próximo capítulo en <em>New Jersey</em> empieza con la agente correcta.",
    "hero.lead": "Pamela Espinal ayuda a familias a comprar, vender e invertir en el norte de New Jersey, desde Montclair y Bloomfield hasta Newark y los Oranges. Habla inglés y español, conoce cada vecindario cuadra por cuadra y te acompaña hasta que tengas las llaves en la mano.",
    "hero.cta1": "Agenda una Consulta Gratis", "hero.cta2": "Calcula Mi Pago",
    "hero.intent": "Quiero", "hero.buy": "Comprar", "hero.sell": "Vender", "hero.rent": "Rentar / Administrar",
    "hero.relocate": "Mudarme", "hero.invest": "Invertir", "hero.available": "Disponible hoy",

    "stat.sold": "Casas vendidas", "stat.years": "Años", "stat.areas": "Áreas",
    "stat.sold2": "Casas Vendidas", "stat.years2": "Años en Bienes Raíces", "stat.areas2": "Comunidades Atendidas", "stat.lang2": "Idiomas",
    "stat.lang": "Idiomas", "stat.free2": "Costo de Consulta",
    "cta.call": "Llamar", "cta.email": "Escríbele a Pamela", "cta.text": "Texto",

    "trust.lang": "Bilingüe: English & Español", "trust.zillow": "Ver perfil en Zillow ↗",

    "about.f1": "familias en su nuevo hogar", "about.f2": "Experta en el condado de Essex",
    "about.kicker": "Conoce a Pamela",
    "about.title": "Los bienes raíces son personales. <em>Su servicio también.</em>",
    "about.p1": "Comprar o vender una casa es una de las decisiones más grandes de tu vida, y Pamela la trata así. Responde rápido, explica cada paso en palabras simples (en español o inglés) y negocia como si fuera su propio dinero.",
    "about.p2": "Desde compradores primerizos en East Orange hasta familias que suben a Montclair e inversionistas en multifamiliares de Newark, Pamela guía a sus clientes en todo el norte de New Jersey. Se encarga de todo: estrategia de precios, consejos de presentación, contactos de prestamistas, inspectores y abogados, y un día de cierre sin estrés.",
    "about.c1": "Respuestas rápidas por correo, normalmente el mismo día",
    "about.c2": "Datos del mercado local antes de cualquier oferta",
    "about.c3": "Red de confianza de prestamistas, inspectores y contratistas",
    "about.c4": "Habla inglés y español, así que nada se pierde en la traducción",

    "svc.kicker": "Cómo te ayuda Pamela", "svc.title": "Cada mudanza, <em>de principio a fin.</em>",
    "svc.sub": "Sea tu primera casa o tu quinta propiedad, recibes un plan hecho a la medida de tus metas, tu presupuesto y tus tiempos.",
    "svc.buy.t": "Representación al Comprador", "svc.buy.p": "Visitas privadas, alertas de propiedades fuera del mercado, ofertas inteligentes y una negociación firme para que consigas la casa correcta al precio correcto.",
    "svc.sell.t": "Listado y Venta", "svc.sell.p": "Precio basado en ventas locales, fotografía profesional, exposición en Zillow y MLS, y un plan de mercadeo para atraer buenas ofertas rápido.",
    "svc.reloc.t": "Reubicación", "svc.reloc.p": "¿Te mudas al norte de New Jersey? Tours virtuales, guía de escuelas y del viaje diario a NYC, y el vecindario ideal para ti, todo antes de empacar.",
    "svc.pm.t": "Inversionistas y Multifamiliares", "svc.pm.p": "Casas de dos y tres familias, análisis de ingresos por renta y estrategias para que los inquilinos te ayuden a pagar la hipoteca.",
    "svc.more": "Empezar a comprar →", "svc.more2": "Valorar mi casa →", "svc.more3": "Planear mi mudanza →", "svc.more4": "Empezar a invertir →",

    "proc.kicker": "El camino", "proc.title": "Pasos simples. <em>Cero dudas.</em>",
    "proc.buyers": "Compradores", "proc.sellers": "Vendedores",
    "pb.1t": "Consulta", "pb.1p": "Hablamos de tus metas, lo que necesitas, los vecindarios y tus tiempos. Es gratis y sin presión.",
    "pb.2t": "Pre-Aprobación", "pb.2p": "Pamela te conecta con prestamistas de confianza y te ayuda a comparar FHA, VA, convencional y más.",
    "pb.3t": "Visitas y Oferta", "pb.3p": "Visitas seleccionadas, datos de ventas locales y una estrategia de oferta ganadora.",
    "pb.4t": "Cierra y Celebra", "pb.4p": "Inspección, tasación y cierre, todo coordinado. Y luego recibes tus llaves.",
    "ps.1t": "Valoración", "ps.1p": "Un análisis de mercado local gratis que muestra cuánto vale tu casa hoy.",
    "ps.2t": "Preparar y Presentar", "ps.2p": "Mejoras simples que dan el mayor retorno, más fotos y video profesionales.",
    "ps.3t": "Mercadeo y Visitas", "ps.3p": "MLS, Zillow, campañas en redes y visitas programadas según tu horario.",
    "ps.4t": "Negociar y Cerrar", "ps.4p": "Ofertas comparadas lado a lado, los mejores términos asegurados y el estrés del cierre en sus manos.",

    "sales.kicker": "Historial", "sales.title": "Vendidas <em>recientemente.</em>", "sales.sold": "VENDIDA",
    "sales.ctaT": "Cierres reales. <em>Familias reales.</em>",
    "sales.ctaP": "Mira cada casa que Pamela ha cerrado, con precios, fechas y ubicaciones, en su historial verificado de Zillow.",
    "sales.ctaB": "Ver historial de ventas ↗", "sales.ctaB2": "¿Cuánto vale mi casa?",

    "areas.kicker": "Dónde trabaja", "areas.title": "En todo el <em>norte de New Jersey.</em>", "areas.sub": "Toca una comunidad para verla en el mapa.", "areas.explore": "Explorar",
    "area.Montclair": "Casas victorianas, un centro animado y tren hacia NYC.",
    "area.East Orange": "Casas uni y multifamiliares accesibles, con tren directo a Manhattan.",
    "area.Newark": "La ciudad más grande de New Jersey. Ironbound, condos nuevos y multifamiliares para inversionistas.",
    "area.Belleville": "Calles tranquilas, buen valor y acceso rápido a la Ruta 21.",
    "area.Bloomfield": "Centro caminable, buenas opciones de transporte y clásicas casas de dos familias.",
    "area.West Orange": "Casas en las colinas, el Turtle Back Zoo y más espacio para crecer.",
    "area.Irvington": "Un primer paso accesible para ser dueño de casa en el condado de Essex.",
    "area.Nutley": "Comunidad unida con buenas escuelas y casas coloniales clásicas.",
    "area.Hackensack": "Centro del condado de Bergen con condos, rentas y un gran centro médico.",

    "calc.new": "Gratis", "calc.kicker": "Calculadora Hipotecaria",
    "calc.title": "Conoce tus números <em>antes de enamorarte.</em>",
    "calc.sub": "Compara los préstamos más populares, ve tu pago mensual completo con impuestos a la propiedad y seguro de New Jersey, y descubre cuánta casa puedes pagar.",
    "calc.t1": "Pago Mensual", "calc.t2": "Comparar Préstamos", "calc.t3": "¿Cuánto Puedo Pagar?",
    "calc.type": "Programa de préstamo", "calc.price": "Precio de la casa", "calc.down": "Pago inicial",
    "calc.rate": "Tasa de interés", "calc.term": "Plazo", "calc.extras": "Impuestos, seguro y HOA",
    "calc.tax": "Impuesto / año", "calc.ins": "Seguro de casa / año", "calc.hoa": "HOA / mes", "calc.extra": "Abono extra / mes",
    "calc.flhint": "New Jersey tiene algunos de los impuestos a la propiedad más altos del país, y cambian mucho de pueblo a pueblo (a menudo entre 2% y 3% en el condado de Essex). Pídele a Pamela el impuesto real de cualquier casa.",
    "calc.est": "Pago mensual estimado", "calc.loanamt": "Monto del préstamo", "calc.totint": "Interés total", "calc.cash": "Efectivo al cierre*", "calc.payoff": "Fecha de pago final",
    "calc.cta": "Pre-califica con los prestamistas de Pamela",
    "calc.amort": "Amortización en el tiempo", "calc.bal": "Saldo", "calc.princ": "Capital pagado", "calc.intpaid": "Interés pagado",
    "calc.sched": "Ver tabla anual", "calc.year": "Año", "calc.yr": "Año", "calc.int": "Interés",
    "calc.pi": "Capital e interés", "calc.ptax": "Impuesto a la propiedad", "calc.pins": "Seguro de casa",
    "calc.minDown": "El pago inicial mínimo para este programa es aprox.",
    "calc.pmiHint": "Con menos de 20% de inicial se suma PMI de aprox.", "calc.pmiHint2": "hasta llegar a 20% de equidad.",
    "calc.financed": "se suma a tu préstamo.",
    "calc.jumboHint": "Este préstamo está dentro del límite conforme 2026 del condado de Essex ($1,209,750). Un préstamo convencional puede ser más barato.",
    "calc.armA": "Fijo por 5 años. Después el pago podría ser", "calc.armB": "máx.",
    "calc.saveA": "Pagando", "calc.saveB": "extra ahorras", "calc.saveC": "en intereses y terminas de pagar tu casa", "calc.saveD": "antes.",
    "calc.yrs": "años", "calc.mos": "meses",
    "calc.cmpsub": "La misma casa con distintos préstamos. Usa el precio de tu casa, el pago inicial mínimo típico de cada programa y tasas de ejemplo.",
    "calc.disc": "*Estimados solo con fines educativos; no es una oferta de préstamo. Las tasas son de ejemplo. Tu tasa real, PMI/MIP, costos, impuestos y elegibilidad para NJHMFA dependen de tu crédito, el prestamista y la propiedad. El efectivo al cierre usa costos de cierre típicos para compradores en New Jersey (mira la pestaña Costos de Cierre NJ).",
    "lp.conv30": "Convencional", "lp.conv15": "Convencional", "lp.jumbo": "Jumbo", "lp.arm": "ARM 5/6", "lp.dscr": "Inversionista",
    "lps.conv30": "Fijo 30 años", "lps.conv15": "Fijo 15 años", "lps.fha": "3.5% inicial", "lps.va": "0% inicial", "lps.usda": "0% inicial",
    "lps.jumbo": "Casas de lujo", "lps.arm": "Ajustable", "lps.dscr": "DSCR / renta",
    "ld.conv30": "El préstamo más popular de EE.UU. Desde 3% de inicial para compradores primerizos, y el PMI se elimina al llegar a 20% de equidad.",
    "ld.conv15": "Pago mensual más alto, tasa mucho más baja, y terminas de pagar en la mitad del tiempo. Ahorras muchísimo en intereses.",
    "ld.fha": "Respaldado por el gobierno. 3.5% de inicial con crédito de 580+ y aprobación flexible. Incluye MIP inicial de 1.75% (sumado al préstamo) y MIP mensual.",
    "ld.va": "Para veteranos, militares activos y cónyuges elegibles. $0 de inicial, sin seguro hipotecario mensual y una tarifa de financiamiento única (sumada al préstamo).",
    "ld.usda": "$0 de inicial en zonas rurales y suburbanas elegibles (sobre todo en partes rurales del norte y sur de New Jersey, no en el condado de Essex). Tarifa inicial de 1% + 0.35% anual. Aplican límites de ingreso.",
    "ld.jumbo": "Para montos por encima del límite conforme (condado de Essex 2026: $1,209,750). Normalmente requiere 10 a 20% de inicial, buen crédito y reservas.",
    "ld.arm": "Tasa fija más baja por 5 años, luego se ajusta cada 6 meses. Ideal si planeas vender o refinanciar en pocos años.",
    "ld.dscr": "Para propiedades de inversión. Califica con el ingreso de renta de la propiedad en vez de tu W-2. Usualmente 20 a 25% de inicial.",
    "cmp.lowPay": "Pago más bajo", "cmp.lowCash": "Menos efectivo", "cmp.down": "Inicial", "cmp.cash": "Efectivo al cierre", "cmp.mi": "Seguro hipotec.", "cmp.int": "Interés total",
    "aff.income": "Ingreso anual del hogar (antes de impuestos)", "aff.debts": "Deudas mensuales (auto, tarjetas, préstamos)", "aff.down": "Efectivo para el pago inicial",
    "aff.prog": "Programa", "aff.hint": "Usa las guías comunes de deuda-ingreso de los prestamistas: 36% \"cómodo\" y 43 a 45% \"al límite\" (FHA/VA pueden ir más alto). Incluye impuestos a la propiedad y seguro estimados de New Jersey.",
    "aff.can": "Podrías pagar una casa de hasta aprox.", "aff.comf": "Cómodo", "aff.stretch": "Al límite",
    "aff.comfp": "Precio cómodo", "aff.pay": "Pago al máximo", "aff.dti": "Deuda / ingreso", "aff.loan": "Monto del préstamo",
    "aff.use": "Usar este precio en la calculadora",

    "rev.kicker": "Historias de clientes", "rev.title": "Lo que dicen <em>de Pamela.</em>",
    "rev.emptyT": "¿Trabajaste con Pamela?",
    "rev.emptyP": "Tus palabras ayudan a la próxima familia a encontrar una gran agente. Comparte tu experiencia en su perfil de Zillow y la mostraremos aquí.",
    "rev.emptyB": "Deja una reseña en Zillow ↗", "rev.emptyB2": "Sé su próxima historia de éxito",

    "faq.kicker": "Buenas preguntas", "faq.title": "Respuestas <em>antes de que preguntes.</em>", "faq.sub": "¿Más dudas? Pamela con gusto te ayuda.", "faq.cta": "Haz una pregunta",
    "q1": "¿Cuánto necesito de pago inicial en New Jersey?", "a1": "Menos de lo que crees. Los préstamos FHA empiezan con 3.5%, algunos convencionales con 3%, y VA puede ser 0%. New Jersey también ayuda a compradores primerizos con los programas de asistencia para el pago inicial de NJHMFA (la agencia de vivienda e hipotecas de New Jersey). Pamela te dice para cuáles podrías calificar.",
    "q2": "¿Me cuesta algo trabajar con Pamela como comprador?", "a2": "La primera consulta siempre es gratis. Hoy la compensación del agente del comprador se acuerda por escrito desde el inicio, y muchas veces la paga el vendedor como parte del trato. Pamela te explica todas las opciones con claridad antes de que firmes cualquier cosa.",
    "q3": "¿Cuánto tarda comprar una casa?", "a3": "En New Jersey, cuando ambas partes firman el contrato hay una revisión de abogados de 3 días hábiles. Después, el cierre suele tomar de 30 a 60 días. Pre-aprobarte primero es la forma más rápida de acelerar todo.",
    "q4": "¿Cuánto vale mi casa?", "a4": "Los estimados en línea pueden fallar por decenas de miles de dólares. Pamela prepara un análisis de mercado gratis basado en ventas recientes cercanas, el estado de tu casa y la demanda actual. Pídelo en el formulario de abajo.",
    "q5": "¿Por qué los impuestos a la propiedad son tan altos en New Jersey?", "a5": "Los impuestos a la propiedad pagan las escuelas y los servicios de cada pueblo, así que cambian mucho, incluso entre pueblos vecinos. Pamela compara los impuestos reales antes de que hagas una oferta, y los dueños elegibles pueden calificar para programas estatales de alivio como ANCHOR.",
    "q6": "Do you speak English?", "a6": "Yes! Pamela works with clients in English and Spanish, from the first call to closing day.",

    "ct.kicker": "Hablemos", "ct.title": "Lista cuando <em>tú lo estés.</em>",
    "ct.sub": "Cuéntale a Pamela lo que buscas. Te responde rápido, normalmente el mismo día.",
    "ct.rent": "Rentar", "ct.name": "Nombre completo", "ct.phone": "Teléfono", "ct.email": "Correo (opcional)",
    "ct.area": "Área preferida", "ct.budget": "Presupuesto", "ct.msg": "¿Algo más? Tiempos, lo que necesitas, preguntas...",
    "ct.via": "Enviar por", "ct.sms": "Texto", "ct.send": "Enviar a Pamela",
    "ct.privacy": "Tu información va directo a Pamela y nunca se vende ni se comparte.",
    "ct.hours": "Horario de oficina", "ct.dir": "Cómo llegar ↗", "ct.thanks": "¡Gracias! Tu mensaje está listo para enviarse a Pamela.", "ct.callUs": "Llama a Pamela al",

    "ft.blurb": "Ayudando a familias del norte de New Jersey a comprar, vender e invertir con confianza, en inglés y en español.",
    "ft.explore": "Explorar", "ft.contact": "Contacto", "ft.eho": "Igualdad de Oportunidades de Vivienda",
    "ft.rights": "Todos los derechos reservados. Información confiable pero no garantizada.",
    "fab.calc": "Calculadora",

    "ex.kicker": "Explora", "ex.title": "Todo lo que necesitas, <em>a un toque.</em>",
    "ex.svcT": "Servicios", "ex.svcP": "Comprar, vender, mudarte o rentar una propiedad. Mira cómo Pamela se encarga de cada uno.",
    "ex.svcCount": "servicios", "ex.svcOpen": "Ver servicios",
    "ex.areaT": "Áreas y Mapa", "ex.areaP": "Explora en un mapa interactivo los vecindarios que Pamela conoce mejor.",
    "ex.areaCount": "comunidades", "ex.areaOpen": "Abrir el mapa",
    "ex.faqT": "Preguntas y Respuestas", "ex.faqP": "Pago inicial, costos, tiempos y seguros, explicados en palabras simples.",
    "ex.faqCount": "respuestas", "ex.faqOpen": "Leer las preguntas",
    "m.ready": "¿Listo para empezar?", "m.areaQ": "¿Buscas en una de estas áreas?", "m.talk": "Habla con Pamela",

    "cl.sub": "Pagos mensuales, 8 préstamos populares lado a lado, cuánto puedes pagar y los costos de cierre de New Jersey, todo en un solo lugar.",
    "cl.open": "Abrir la calculadora", "cl.afford": "¿Cuánto puedo pagar?", "cl.live": "Estimado en vivo", "cl.tap": "Toca para ajustar", "cl.down": "inicial",
    "cl.nj1": "Impuestos a la propiedad por pueblo de NJ", "cl.nj2": "Ayuda de NJHMFA para el pago inicial", "cl.nj3": "Costos de cierre en New Jersey",
    "calc.t4": "Costos de Cierre NJ", "calc.town": "Pueblo (fija el impuesto a la propiedad)", "calc.townOther": "Otro pueblo (escribe la tasa)",
    "calc.dpa": "Ayuda para compradores primerizos de NJ (NJHMFA)", "calc.dpa0": "Ninguna",
    "calc.dpa1": "Asistencia para el pago inicial (hasta $15,000)", "calc.dpa2": "Comprador de primera generación (hasta $22,000)",
    "calc.dpaOk": "se descuentan de tu efectivo al cierre. Es un préstamo al 0% que se perdona después de 5 años, con un prestamista participante de NJHMFA. Aplican límites de ingreso y precio.",
    "calc.dpaNo": "La ayuda de NJHMFA funciona con préstamos FHA, VA, USDA o convencionales, no con este programa.",
    "calc.limitConv": "Por encima del límite conforme 2026 del condado de Essex ($1,209,750), así que necesitarías un préstamo jumbo.",
    "calc.limitFha": "Por encima del límite FHA del condado de Essex (aprox. $1.21M). Prueba un pago inicial mayor o un préstamo jumbo.",
    "nj.est": "Costos de cierre estimados del comprador", "nj.cash": "Efectivo total al cierre", "nj.edit": "Cambiar el precio o el préstamo",
    "nj.home": "casa", "nj.loan": "préstamo", "nj.down": "Pago inicial", "nj.dpa": "Asistencia de NJHMFA",
    "nj.mansion": "Mansion tax (lo paga el vendedor)", "nj.rtf": "Realty Transfer Fee", "nj.seller": "Lo paga el vendedor",
    "nj.i1": "Costos del prestamista y tasación", "nj.i2": "Seguro de título y búsqueda", "nj.i3": "Honorarios del abogado",
    "nj.i4": "Inspección de la casa", "nj.i5": "Registro y cargos del gobierno", "nj.i6": "Impuestos y seguro prepagados (escrow)",
    "nj.rulesT": "Reglas de New Jersey que debes conocer",
    "nj.r1t": "Revisión de abogados de 3 días", "nj.r1p": "Después de que ambas partes firman el contrato, el abogado de cualquiera de las dos puede cancelarlo o cambiarlo dentro de 3 días hábiles. La mayoría de los compradores en New Jersey contratan un abogado de bienes raíces.",
    "nj.r2t": "Mansion tax: ahora lo paga el vendedor", "nj.r2p": "Desde el 10 de julio de 2025, el Graduated Percent Fee para casas de más de $1M (1% a 3.5% del precio) lo paga el vendedor, no el comprador.",
    "nj.r3t": "Realty Transfer Fee: lo paga el vendedor", "nj.r3p": "La tarifa de transferencia de New Jersey es un costo del vendedor, así que no forma parte de tu efectivo al cierre como comprador.",
    "nj.r4t": "Límites de préstamo 2026", "nj.r4p": "En el condado de Essex un préstamo conforme puede llegar hasta $1,209,750 para una casa unifamiliar. Préstamos más grandes necesitan una hipoteca jumbo.",
    "nj.r5t": "Ayuda de NJHMFA para el pago inicial", "nj.r5p": "Los compradores primerizos pueden recibir hasta $15,000 (hasta $22,000 si son de primera generación) como un préstamo que se perdona después de 5 años, junto con una primera hipoteca de NJHMFA. Los montos y límites de ingreso varían.",
    "nj.r6t": "Los impuestos cambian por pueblo", "nj.r6p": "Las tasas por pueblo en esta calculadora son tasas efectivas aproximadas de 2025. Siempre revisa el impuesto real de la casa. Los dueños elegibles pueden solicitar el alivio de impuestos ANCHOR."
  };

  const store = {
    get() { try { return localStorage.getItem("pe-lang"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("pe-lang", v); } catch (e) {} }
  };

  const nodes = [...document.querySelectorAll("[data-i18n]")];
  const phNodes = [...document.querySelectorAll("[data-i18n-ph]")];
  nodes.forEach(n => { n._en = n.innerHTML; });
  phNodes.forEach(n => { n._en = n.placeholder; });

  const I18N = window.I18N = {
    lang: "en",
    t(k, fb) { return this.lang === "es" && ES[k] ? ES[k] : fb; },
    set(lang) {
      this.lang = lang;
      document.documentElement.lang = lang;
      nodes.forEach(n => { const v = ES[n.dataset.i18n]; n.innerHTML = lang === "es" && v ? v : n._en; });
      phNodes.forEach(n => { const v = ES[n.dataset.i18nPh]; n.placeholder = lang === "es" && v ? v : n._en; });
      document.querySelectorAll("#langToggle span").forEach(s => s.classList.toggle("on", s.dataset.lang === lang));
      store.set(lang);
      document.dispatchEvent(new Event("langchange"));
    }
  };

  const saved = store.get();
  const initial = saved || ((navigator.language || "").toLowerCase().startsWith("es") ? "es" : "en");
  document.getElementById("langToggle").addEventListener("click", () => I18N.set(I18N.lang === "en" ? "es" : "en"));
  // apply after other scripts have registered listeners
  window.addEventListener("DOMContentLoaded", () => I18N.set(initial));
  document.querySelectorAll("#langToggle span").forEach(s => s.classList.toggle("on", s.dataset.lang === initial));
})();
