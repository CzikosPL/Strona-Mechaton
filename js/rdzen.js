/* ============================================================
   rdzen.js — silnik stanów Mechaton
   Czyta window.STAN (stan.js — plik operatora) i window.EDYCJE
   (dane/edycje.js — manifest generowany przez generator-edycji).
   Zasady:
   - Wszystko w try/catch: uszkodzona konfiguracja = widok
     domyślny "post" (nigdy rozbita strona).
   - Bez JS: HTML pokazuje stan domyślny; ten skrypt tylko
     przełącza [data-faza] i wypełnia [data-slot].
   - Treść referencyjna NIE zależy od tego skryptu.
   ============================================================ */
(function () {
  "use strict";

  var FAZY = ["post", "ogloszenie", "zapisy", "trwa"];
  var FAZA_DOMYSLNA = "post";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* dozwolone cele linków z konfiguracji: http(s), mailto, kotwica, ścieżka względna */
  function bezpiecznyHref(cel) {
    return /^(https?:\/\/|mailto:|\.{0,2}\/|#)/i.test(cel);
  }

  function bezpiecznyStan() {
    try {
      var s = window.STAN;
      if (!s || typeof s !== "object") return null;
      var faza = FAZY.indexOf(s.faza) !== -1 ? s.faza : FAZA_DOMYSLNA;
      return {
        faza: faza,
        firma: String(s.firma || "").trim(),
        numer: String(s.numer || "").trim(),
        etykieta: String(s.etykieta || "").trim(),
        tematy: String(s.tematy || "").trim(),
        datyTekst: String(s.datyTekst || "").trim(),
        zapisyOdTekst: String(s.zapisyOdTekst || "").trim(),
        zapisyDoTekst: String(s.zapisyDoTekst || "").trim(),
        zapisyStartIso: String(s.zapisyStartIso || "").trim(),
        zapisyKoniecIso: String(s.zapisyKoniecIso || "").trim(),
        linkFormularza: String(s.linkFormularza || "").trim(),
        linkStronyEdycji: String(s.linkStronyEdycji || "").trim()
      };
    } catch (e) {
      return null;
    }
  }

  /* manifest edycji (dane/edycje.js) — fallback: pusta tablica */
  function manifest() {
    try {
      return Array.isArray(window.EDYCJE) ? window.EDYCJE : [];
    } catch (e) {
      return [];
    }
  }

  function dniOdIso(iso) {
    /* ile dni do daty ISO (ujemne = po dacie); null gdy brak/błędna */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    var cel = new Date(iso + "T00:00:00");
    if (isNaN(cel.getTime())) return null;
    var teraz = new Date();
    teraz.setHours(0, 0, 0, 0);
    return Math.round((cel - teraz) / 86400000);
  }

  /* ── 1. Przełączenie bloków [data-faza] ─────────────────── */
  function przelaczFazy(stan) {
    var bloki = document.querySelectorAll("[data-faza]");
    for (var i = 0; i < bloki.length; i++) {
      bloki[i].hidden = bloki[i].getAttribute("data-faza") !== stan.faza;
    }
  }

  /* ── 2. Wypełnienie slotów tekstowych [data-slot] ─────────
     Pusta wartość z konfiguracji NIE czyści treści zapasowej
     z HTML (fallback pozostaje czytelny). */
  function wypelnijSloty(stan) {
    var sloty = document.querySelectorAll("[data-slot]");
    for (var i = 0; i < sloty.length; i++) {
      var el = sloty[i];
      var klucz = el.getAttribute("data-slot");
      var wartosc = stan[klucz];
      if (typeof wartosc === "string" && wartosc !== "") el.textContent = wartosc;
    }
  }

  /* ── 3. Linki [data-slot-link] + zabezpieczenie pustego formularza ── */
  function wypelnijLinki(stan) {
    var linki = document.querySelectorAll("[data-slot-link]");
    for (var i = 0; i < linki.length; i++) {
      var a = linki[i];
      var klucz = a.getAttribute("data-slot-link");
      var cel = stan[klucz];
      if (stan.faza === "zapisy" && klucz === "linkFormularza" && !cel) {
        /* brak formularza w stanie zapisy: uczciwa informacja zamiast martwego linku */
        a.removeAttribute("href");
        a.textContent = "Formularz zgłoszeniowy — wkrótce";
        a.setAttribute("aria-disabled", "true");
      } else if (cel && bezpiecznyHref(cel)) {
        a.setAttribute("href", cel);
      } else if (cel) {
        /* niedozwolony schemat — traktuj jak brak */
        a.removeAttribute("href");
      }
    }
  }

  /* ── 4. Pasek statusu pod nagłówkiem ────────────────────── */
  function pasekStatusu(stan) {
    var pasek = document.querySelector("[data-stan-statusbar]");
    if (!pasek) return;
    var nazwa = stan.numer + ". Mechaton" + (stan.firma ? " × " + stan.firma : "");
    var tekst = "";
    if (stan.faza === "ogloszenie") {
      tekst = nazwa + (stan.zapisyOdTekst ? " — zapisy od " + stan.zapisyOdTekst : " — szczegóły wkrótce");
    } else if (stan.faza === "zapisy") {
      tekst = nazwa + (stan.zapisyDoTekst ? " — zapisy trwają do " + stan.zapisyDoTekst : " — zapisy trwają");
    } else if (stan.faza === "trwa") {
      tekst = nazwa + " — konkurs trwa";
    }
    if (tekst) {
      pasek.textContent = tekst;
      pasek.hidden = false;
    } else {
      pasek.hidden = true;
    }
  }

  /* ── 5. Licznik dni (dekoracja; bez ISO — ukryty) ───────── */
  function liczniki(stan) {
    var els = document.querySelectorAll("[data-licznik]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var cel = el.getAttribute("data-licznik"); // "start" albo "koniec"
      var iso = cel === "koniec" ? stan.zapisyKoniecIso : stan.zapisyStartIso;
      var dni = dniOdIso(iso);
      if (dni === null) { el.hidden = true; continue; }
      el.hidden = false;
      var tresc;
      if (dni > 1) tresc = "za " + dni + " dni";
      else if (dni === 1) tresc = "jutro";
      else if (dni === 0) tresc = "dziś";
      else tresc = null;
      if (tresc) el.textContent = "(" + tresc + ")";
      else el.hidden = true;
    }
  }

  /* ── 6. Sekcje zasilane manifestem: historia + ostatnia edycja ── */
  function renderManifest() {
    var ed = manifest();
    if (!ed.length) return; /* brak manifestu → statyczny fallback w HTML */

    /* tabela historii partnerów — WSZYSTKIE pola escapowane
       (manifest przychodzi z generatora: dane niezaufane z punktu
       widzenia HTML; por. finding recenzji P2, 2026-11-02) */
    var tbody = document.querySelector("[data-manifest-historia]");
    if (tbody) {
      var html = "";
      for (var i = 0; i < ed.length; i++) {
        var e = ed[i];
        var linkFirma = (e.link && bezpiecznyHref(String(e.link)))
          ? '<a href="' + esc(e.link) + '">' + esc(e.firma) + "</a>"
          : esc(e.firma);
        html += "<tr><td>" + esc(e.etykieta) + " · " + esc(e.rok) + "</td><td>" +
          linkFirma +
          "</td><td>" + esc(e.temat) + "</td></tr>";
      }
      tbody.innerHTML = html;
    }

    /* blok „ostatnia edycja" — manifest[0] = najnowsza */
    var box = document.querySelector("[data-manifest-ostatnia]");
    if (box && ed[0]) {
      var n = ed[0];
      var set = function (sel, txt) {
        var el = box.querySelector(sel);
        if (el) el.textContent = txt;
      };
      set("[data-o-etykieta]", n.etykieta);
      set("[data-o-tytul]", n.numer + ". Mechaton × " + n.firma);
      set("[data-o-daty]", n.daty);
      set("[data-o-temat]", n.temat);
      set("[data-o-zespolow]", String(n.zespolow));
      set("[data-o-uczestnikow]", String(n.uczestnikow));
      var link = box.querySelector("[data-o-link]");
      if (link && n.link) link.setAttribute("href", n.link);
    }
  }

  /* ── start ──────────────────────────────────────────────── */
  function start() {
    var stan = bezpiecznyStan() || { faza: FAZA_DOMYSLNA };
    przelaczFazy(stan);
    wypelnijSloty(stan);
    wypelnijLinki(stan);
    pasekStatusu(stan);
    liczniki(stan);
    try { renderManifest(); } catch (e) { /* fallback statyczny zostaje */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
