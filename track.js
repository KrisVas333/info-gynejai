/* ==========================================================================
   track.js — Info-Gynėjai / BrAIn Club Jr · seanso analitika
   --------------------------------------------------------------------------
   Kam: matuojam, ar vaikai grįžta prie įrankių NAMIE, kur jie stringa ir ką
   spaudžia — kad gerintume žaidžiamumą, UX ir UI. Nieko daugiau.

   PRIVATUMAS (nekeičiama):
   · jokių vardų, jokių įrenginio ID, jokių pastovių identifikatorių
   · šis failas NIEKO nerašo į localStorage ir nededa jokių sausainėlių
   · clarity("identify", …) NENAUDOJAMAS niekada
   · įvesto teksto (testo „rašyk žodį“ režimas) NESIUNČIAM — tik ok/klaida
   · Clarity pusėje įjungtas Strict masking (visas tekstas užmaskuotas)

   window.ig API (saugu kviesti bet kada, niekada nemeta klaidos):
     ig.ev(name, tags?)   — custom event (+ nebūtinos žymos prieš jį)
     ig.tag(key, val)     — seanso žyma
     ig.upgrade(reason)   — pažymėti šį įrašą kaip svarbų (prioritetas Clarity)
     ig.sesija            — atsitiktinis šio puslapio įkėlimo ID (niekur nesaugomas)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1) Clarity žyma ---------- */
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'yi612dyhxe');

  /* ---------- 2) saugūs apvalkalai ---------- */
  function call() {
    try {
      if (typeof window.clarity !== 'function') return;   /* eilės funkcija jau yra, bet tikrinam */
      window.clarity.apply(null, arguments);
    } catch (e) { /* analitika niekada nelaužo žaidimo */ }
  }
  function tag(key, val) {
    if (key == null || val == null || val === '') return;
    call('set', String(key), String(val).slice(0, 120));
  }
  function ev(name, tags) {
    if (!name) return;
    if (tags) { for (var k in tags) if (Object.prototype.hasOwnProperty.call(tags, k)) tag(k, tags[k]); }
    call('event', String(name).slice(0, 60));
  }
  function upgrade(reason) { call('upgrade', String(reason || 'svarbu').slice(0, 60)); }

  /* ---------- 3) seanso ID (NIEKUR nesaugomas) ----------
     Skirtas TIK tam, kad Clarity įrašą būtų galima susieti su Supabase eilute
     (stulpelis clarity_sesija). Nauja reikšmė kas puslapio įkėlimą — jokio
     localStorage, jokio cookie, jokio sekimo tarp seansų. */
  function uuid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    try {
      var b = new Uint8Array(16); crypto.getRandomValues(b);
      return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    } catch (e) {}
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  var sesija = uuid();

  /* ---------- 4) automatinės žymos ---------- */

  /* irankis = puslapio trumpinys. p1/ ir zaidimai/ failai — bazinis vardas;
     dviem šakniniuose failuose tas pats vardas kaip p1/, tad jie gauna hub- priešdėlį. */
  function slug() {
    var p = (location.pathname || '').replace(/\/+$/, '');
    var file = p.split('/').pop() || '';
    var dir = p.split('/').slice(-2, -1)[0] || '';
    if (!file || file === 'index.html') return dir === 'p1' || dir === 'zaidimai' ? dir : 'hub';
    var base = file.replace(/\.html?$/i, '');
    if (dir !== 'p1' && dir !== 'zaidimai' && (base === 'testas' || base === 'scenarijus')) return 'hub-' + base;
    return base;
  }

  /* kelias = pilnas kelias (vienareikšmiškai atskiria vienodus vardus) */
  function kelias() {
    var p = (location.pathname || '').replace(/^.*?\/info-gynejai\//, '').replace(/^\//, '');
    return p || 'index.html';
  }

  /* kontekstas = pamoka | namai.
     Pamokos langas: ketvirtadienis ir penktadienis 13:00–16:00 Europe/Vilnius.
     Šaltinis: Supabase lentelė bcjr_tvarkarastis (BC Jr Šiaurės licėjaus tvarkaraštis).
     Įrašyta kietai sąmoningai — puslapis neturi teisės skaityti tvarkaraščio.
     TAI yra pagrindinis signalas „ar vaikai žaidžia NAMIE". */
  function kontekstas() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Vilnius', weekday: 'short', hour: '2-digit', hour12: false
      }).formatToParts(new Date());
      var wd = '', hh = -1;
      f.forEach(function (part) {
        if (part.type === 'weekday') wd = part.value;
        if (part.type === 'hour') hh = parseInt(part.value, 10);
      });
      var pamokosDiena = (wd === 'Thu' || wd === 'Fri');
      return (pamokosDiena && hh >= 13 && hh < 16) ? 'pamoka' : 'namai';
    } catch (e) { return 'nezinoma'; }
  }

  function ekranas() {
    var w = window.innerWidth || document.documentElement.clientWidth || 0;
    if (w && w < 600) return 'tel';
    if (w && w < 1024) return 'plansete';
    return 'kompas';
  }

  function saltinis() {
    var r = document.referrer || '';
    if (!r) return 'tiesiogiai';
    try {
      var h = new URL(r).hostname.replace(/^www\./, '');
      if (h === 'infogynejai.lt' || h === 'bcjr-zaidimai.lovable.app') return 'hub';
      if (h === location.hostname) return 'vidinis';
      return h;
    } catch (e) { return 'nezinoma'; }
  }

  /* rezimas = dev | vaikas.
     dev — Kris'o / Gabrieliaus bandymai ir simuliacijos. Clarity filtre:
     rezimas = vaikas, kad statistika būtų tik apie tikrus vaikus.
     Parametrai iš visų trijų įrankių: testas (sim, m, send, nosend, auto, read, cap, v),
     miste-runner (auto, ff, quiz, nosend). */
  var Q = null;
  try { Q = new URLSearchParams(location.search); } catch (e) {}
  function rezimas() {
    if (!Q) return 'vaikas';
    var flags = ['sim', 'auto', 'nosend', 'send', 'ff', 'quiz', 'cap', 'read'];
    for (var i = 0; i < flags.length; i++) if (Q.has(flags[i])) return 'dev';
    if (Q.get('m') === '1') return 'dev';
    return 'vaikas';
  }

  tag('irankis', slug());
  tag('kelias', kelias());
  tag('kontekstas', kontekstas());
  tag('ekranas', ekranas());
  tag('saltinis', saltinis());
  tag('rezimas', rezimas());
  tag('sesija', sesija);
  if (Q && Q.get('g')) tag('grupe', String(Q.get('g')).slice(0, 20));

  /* ivestis = touch | pele — nustatom per pirmą tikrą sąlytį su puslapiu */
  var ivestisSet = false;
  function markIvestis(kind) {
    if (ivestisSet) return;
    ivestisSet = true;
    tag('ivestis', kind);
  }
  try {
    window.addEventListener('pointerdown', function (e) {
      markIvestis(e && e.pointerType === 'touch' ? 'touch' : 'pele');
    }, { once: true, passive: true, capture: true });
    window.addEventListener('touchstart', function () { markIvestis('touch'); },
      { once: true, passive: true, capture: true });
  } catch (e) {}

  /* versija — tik jei puslapis paskelbė globalų const VERSION (p1/testas.html: p1-diag-v3).
     Tikrinam po DOM parsinimo, nes track.js kraunasi PIRMAS. */
  function readVersion() {
    try { if (typeof VERSION === 'string' && VERSION) tag('versija', VERSION); } catch (e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', readVersion, { once: true });
  } else { readVersion(); }

  /* ---------- 5) nuorodų paspaudimai (navigacija tarp puslapių) ---------- */
  document.addEventListener('click', function (e) {
    try {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || /^javascript:/i.test(href)) return;
      ev('nuoroda_click', { i: href.slice(0, 80) });
    } catch (err) {}
  }, true);

  /* ---------- 6) viešas API ---------- */
  window.ig = { ev: ev, tag: tag, upgrade: upgrade, sesija: sesija };
})();
