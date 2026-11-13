/* ============================================================
   szablon-edycji.js — WSPÓLNY SZABLON stron edycji i archiwum.
   Używany przez:
     - generator-edycji.html (przeglądarka) — nowe edycje,
     - skrypt buildowy (Node) — wygenerowane strony repozytorium.
   Jeden szablon = zero rozjazdu stylu między edycjami.
   Ścieżki względne: strony edycji żyją w ./edycje/, więc prefiks
   zasobów to "../".
   UWAGA dla deweloperów: zmiana szablonu wymaga regeneracji
   wszystkich stron ED-*.html i archiwum — skrypt:
   research/mechaton/build-edycje.cjs (Node) albo generator-edycji.html
   (CHECKLISTA.md, procedura 2).
   ============================================================ */
(function (global, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    global.SZABLON_EDYCJI = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var P = "../"; /* prefiks ścieżek: strony edycji są w podkatalogu edycje/ */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function naglowek(aktywny) {
    var linki = [
      ["../index.html", "Start", "Start"],
      ["./index.html", "Edycje", "Edycje"],
      ["../wspolpraca.html", "Współpraca", "Współpraca"],
      ["../regulaminy.html", "Regulaminy", "Regulaminy"],
      ["../inni-o-nas.html", "Inni o nas", "Inni o nas"]
    ];
    var li = linki.map(function (l) {
      var cur = l[2] === aktywny ? ' aria-current="page"' : "";
      return '<li><a href="' + l[0] + '"' + cur + ">" + l[1] + "</a></li>";
    }).join("\n        ");
    return '' +
'<header class="site-header">\n' +
'  <p class="statusbar" data-stan-statusbar hidden></p>\n' +
'  <div class="container masthead">\n' +
'    <a class="brand" href="../index.html">\n' +
'      <img src="' + P + 'media/logo-mechaton.png" alt="" width="56" height="56">\n' +
'      <span class="brand-name">MECHATON</span>\n' +
'    </a>\n' +
'    <nav class="site-nav" aria-label="Nawigacja główna">\n' +
'      <ul>\n        ' + li + '\n      </ul>\n' +
'    </nav>\n' +
'  </div>\n' +
'</header>';
  }

  function stopka() {
    return '' +
'<footer class="site-footer">\n' +
'  <div class="container">\n' +
'    <div class="stopka-grid">\n' +
'      <div>\n' +
'        <h2>Mechaton</h2>\n' +
'        <p style="max-width:34ch; color:var(--fg-soft)">Konkurs inżynierski Wydziału\n' +
'        Mechanicznego Politechniki Łódzkiej.</p>\n' +
'        <div class="stopka-loga">\n' +
'          <a href="https://p.lodz.pl/"><img src="' + P + 'media/img/logo-plozdzk.jpg" alt="Politechnika Łódzka" width="70" height="70"></a>\n' +
'          <a href="https://mechaniczny.p.lodz.pl/"><img src="' + P + 'media/img/logo-wydzial-mechaniczny.png" alt="Wydział Mechaniczny PŁ" width="112" height="112"></a>\n' +
'        </div>\n' +
'      </div>\n' +
'      <div class="kontakt-blok">\n' +
'        <h2>Kontakt</h2>\n' +
'        <ul>\n' +
'          <li><a href="mailto:mechaton@info.p.lodz.pl">mechaton@info.p.lodz.pl</a></li>\n' +
'          <li class="adres"><b>Budynek A18 „Fabryka Inżynierów”</b><br>\n' +
'          Politechnika Łódzka, Wydział Mechaniczny<br>\n' +
'          ul. Stefanowskiego 1/15, 90-537 Łódź</li>\n' +
'        </ul>\n' +
'      </div>\n' +
'      <div>\n' +
'        <h2>Przydatne linki</h2>\n' +
'        <ul>\n' +
'          <li><a href="https://mechaniczny.p.lodz.pl/">Wydział Mechaniczny PŁ</a></li>\n' +
'          <li><a href="https://mechaniczny.p.lodz.pl/wydzial/mechatony-na-wydziale">Mechatony na wydziale — ogłoszenia</a></li>\n' +
'          <li><a href="https://www.facebook.com/WydzialMechanicznyPL">Facebook Wydziału Mechanicznego</a></li>\n' +
'          <li><a href="https://www.instagram.com/wrsmechaniczny/">Instagram WrS Mechaniczny</a></li>\n' +
'        </ul>\n' +
'      </div>\n' +
'      <div>\n' +
'        <h2>Nawigacja</h2>\n' +
'        <ul>\n' +
'          <li><a href="./index.html">Edycje</a></li>\n' +
'          <li><a href="../wspolpraca.html">Współpraca</a></li>\n' +
'          <li><a href="../regulaminy.html">Regulaminy</a></li>\n' +
'          <li><a href="../inni-o-nas.html">Inni o nas</a></li>\n' +
'        </ul>\n' +
'      </div>\n' +
'    </div>\n' +
'    <p class="copyright">© MECHATON · Wydział Mechaniczny Politechniki Łódzkiej</p>\n' +
'  </div>\n' +
'</footer>';
  }

  function medal(miejsce) {
    var m = parseInt(miejsce, 10);
    return (m >= 1 && m <= 3)
      ? '<span class="medal medal-' + m + '" aria-hidden="true">' + m + '</span>'
      : '<span class="medal" aria-hidden="true">·</span>';
  }

  function podiumHtml(ed) {
    var zwyciezcy = ed.zwyciezcy;
    if (!zwyciezcy || !zwyciezcy.length) return "";
    var li = zwyciezcy.map(function (z) {
      var druzyna = z.druzyna
        ? '<p class="druzyna" style="margin:0">' + esc(z.druzyna) + '</p>'
        : "";
      return '<li>' + medal(z.miejsce) +
        '<div>' + druzyna +
        '<p class="czlonkowie"' + (z.druzyna ? "" : ' style="color:var(--fg); font-weight:600; font-size:inherit"') + '>' + esc(z.czlonkowie || "") + '</p></div></li>';
    }).join("\n      ");
    var nota = ed.podiumNota
      ? '        <p class="edycja-meta" style="max-width:56ch">' + esc(ed.podiumNota) + '</p>\n'
      : "";
    return '' +
'      <section aria-labelledby="zwyciezcy-tytul">\n' +
'        <div class="section-head">\n' +
'          <span class="etykieta">Wyniki</span>\n' +
'          <h2 id="zwyciezcy-tytul">Zwycięskie zespoły</h2>\n' +
'        </div>\n' + nota +
'        <ol class="podium">\n      ' + li + '\n        </ol>\n' +
'      </section>';
  }

  function wyroznieniaHtml(wyroznienia) {
    if (!wyroznienia || !wyroznienia.length) return "";
    var li = wyroznienia.map(function (w) {
      return '<li><b>' + esc(w.druzyna || "") + '</b>' +
        (w.czlonkowie ? ' — ' + esc(w.czlonkowie) : '') + '</li>';
    }).join("\n          ");
    return '' +
'      <section class="wyroznienia" aria-labelledby="wyroznienia-tytul">\n' +
'        <div class="section-head">\n' +
'          <span class="etykieta">Wyróżnienia</span>\n' +
'          <h2 id="wyroznienia-tytul">Wyróżnione zespoły</h2>\n' +
'        </div>\n' +
'        <ol>\n          ' + li + '\n        </ol>\n' +
'      </section>';
  }

  function mediaHtml(ed) {
    var czesci = [];
    if (ed.grafika && ed.grafika.plik) {
      czesci.push(
'        <figure>\n' +
'          <img loading="lazy" src="' + P + esc(ed.grafika.plik) + '" alt="' + esc(ed.grafika.opis || ("Materiały dokumentacyjne edycji " + ed.etykieta)) + '" width="480" height="360">\n' +
'          <figcaption>' + esc(ed.grafika.opis || "Materiały edycji") + '</figcaption>\n' +
'        </figure>');
    }
    if (ed.audio && ed.audio.plik) {
      czesci.push(
'        <h3 id="audio-tytul">Audycja Radia ŻAK</h3>\n' +
'        <p style="color:var(--fg-soft)">' + esc(ed.audio.opis || "") + '</p>\n' +
'        <audio controls preload="none" src="' + P + esc(ed.audio.plik) + '" aria-labelledby="audio-tytul"></audio>');
    }
    if (!czesci.length) return "";
    return '' +
'      <section class="media-edycji" aria-labelledby="media-tytul">\n' +
'        <div class="section-head">\n' +
'          <span class="etykieta">Materiały</span>\n' +
'          <h2 id="media-tytul">Media edycji</h2>\n' +
'        </div>\n' + czesci.join("\n") + '\n' +
'      </section>';
  }

  function sasiedziHtml(poprz, nast) {
    var czesci = [];
    if (poprz) czesci.push('<span><a href="./' + esc(poprz.plik) + '">← ' + esc(poprz.etykieta + " · " + poprz.firma) + '</a></span>');
    if (nast) czesci.push('<span><a href="./' + esc(nast.plik) + '">' + esc(nast.etykieta + " · " + nast.firma) + ' →</a></span>');
    if (!czesci.length) return "";
    return '<p class="okruszki" style="display:flex; gap:1.5rem; justify-content:space-between">' +
      czesci.join("") + "</p>";
  }

  /* ── pełna strona jednej edycji ─────────────────────────── */
  function strona(ed, poprz, nast) {
    var tytulStrony = ed.numer + ". Mechaton × " + ed.firma + " — edycja " + ed.etykieta;
    var relacja = ed.zuLink
      ? '<p><strong>Relacja:</strong> <a href="' + esc(ed.zuLink) + '">' + esc(ed.zuTytul || "artykuł w „Życiu Uczelni”") + '</a></p>'
      : "";
    return '' +
'<!doctype html>\n' +
'<html lang="pl">\n' +
'<head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'<title>' + esc(tytulStrony) + ' | Mechaton</title>\n' +
'<meta name="description" content="' + esc(ed.numer + ". Mechaton × " + ed.firma + " (" + ed.daty + "): " + ed.temat) + '">\n' +
'<link rel="icon" type="image/jpeg" href="' + P + 'media/favicon-mechaton.jpg">\n' +
'<link rel="preload" href="' + P + 'fonts/plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>\n' +
'<link rel="stylesheet" href="' + P + 'styles.css">\n' +
'<script src="' + P + 'stan.js" defer></script>\n' +
'<script src="' + P + 'dane/edycje.js" defer></script>\n' +
'<script src="' + P + 'js/rdzen.js" defer></script>\n' +
'</head>\n' +
'<body>\n' +
'<a class="skip-link" href="#tresc">Przejdź do treści</a>\n' +
'\n' + naglowek("Edycje") + '\n' +
'\n' +
'<main id="tresc" tabindex="-1">\n' +
'  <div class="container">\n' +
'    <p class="okruszki"><a href="../index.html">Start</a> / <a href="./index.html">Edycje</a> / ' + esc(ed.etykieta) + '</p>\n' +
'    <article>\n' +
'      <header class="hero" style="padding-top:1.2rem">\n' +
'        <span class="etykieta">' + esc(ed.etykieta) + ' · Rejestr edycji</span>\n' +
'        <h1>' + esc(ed.numer) + '. Mechaton × ' + esc(ed.firma) + '</h1>\n' +
'        <p class="edycja-meta" style="font-size:var(--step-1); color:var(--fg-soft)">' + esc(ed.daty) + (ed.miejsce ? ' · ' + esc(ed.miejsce) : ' · kampus PŁ, Łódź') + '</p>\n' +
'      </header>\n' +
'\n' +
'      <section aria-labelledby="zadanie-tytul">\n' +
'        <div class="section-head">\n' +
'          <span class="etykieta">Zadanie</span>\n' +
'          <h2 id="zadanie-tytul">Problem inżynierski</h2>\n' +
'        </div>\n' +
'        <p class="zadanie"><span class="etykieta zadanie-etykieta">Temat od partnera</span>' + esc(ed.temat) + '</p>\n' +
'        <div class="staty">\n' +
'          <div class="fakta"><div class="stat-liczba">' + esc(ed.zespolow) + '</div><div class="stat-etykieta">Zespołów</div></div>\n' +
'          <div class="fakta"><div class="stat-liczba">' + esc(ed.uczestnikow) + '</div><div class="stat-etykieta">Uczestników</div></div>\n' +
((ed.partnerLink) ? ('          <div class="fakta"><div class="stat-liczba" style="font-size:var(--step-2)"><a href="' + esc(ed.partnerLink) + '">' + esc(ed.firma) + '</a></div><div class="stat-etykieta">Partner edycji</div></div>\n') : '') +
'        </div>\n' +
'      </section>\n' +
'\n' + podiumHtml(ed) + '\n' +
'\n' + wyroznieniaHtml(ed.wyroznienia) + '\n' +
'\n' + mediaHtml(ed) + '\n' +
'\n' +
((ed.zuLink || ed.zuTytul) ? ('      <section aria-labelledby="relacja-tytul">\n        <div class="section-head">\n          <span class="etykieta">Relacje</span>\n          <h2 id="relacja-tytul">O edycji pisali</h2>\n        </div>\n        ' + relacja + '\n      </section>\n') : '') +
'\n' + sasiedziHtml(poprz, nast) + '\n' +
'    </article>\n' +
'  </div>\n' +
'</main>\n' +
'\n' + stopka() + '\n' +
'</body>\n' +
'</html>\n';
  }

  /* ── pełna strona archiwum (indeks edycji) ──────────────── */
  function archiwum(lista) {
    var li = lista.map(function (e) {
      return '      <li><a class="karta" href="./' + esc(e.plik || ("ED-" + e.etykieta.replace("ED-", "") + ".html")) + '">\n' +
'        <span class="rok">' + esc(e.etykieta) + ' · ' + esc(e.rok) + '</span>\n' +
'        <span><span class="tytul">' + esc(e.numer) + '. Mechaton × ' + esc(e.firma) + '</span>\n' +
'        <span class="temat">' + esc(e.temat) + '</span></span>\n' +
'        <span class="strzalka" aria-hidden="true">→</span>\n' +
'      </a></li>';
    }).join("\n");
    return '' +
'<!doctype html>\n' +
'<html lang="pl">\n' +
'<head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'<title>Edycje — Mechaton</title>\n' +
'<meta name="description" content="Archiwum edycji konkursu Mechaton: zadania, wyniki i zwycięzcy wszystkich dotychczasowych edycji.">\n' +
'<link rel="icon" type="image/jpeg" href="' + P + 'media/favicon-mechaton.jpg">\n' +
'<link rel="preload" href="' + P + 'fonts/plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>\n' +
'<link rel="stylesheet" href="' + P + 'styles.css">\n' +
'<script src="' + P + 'stan.js" defer></script>\n' +
'<script src="' + P + 'dane/edycje.js" defer></script>\n' +
'<script src="' + P + 'js/rdzen.js" defer></script>\n' +
'</head>\n' +
'<body>\n' +
'<a class="skip-link" href="#tresc">Przejdź do treści</a>\n' +
'\n' + naglowek("Edycje") + '\n' +
'\n' +
'<main id="tresc" tabindex="-1">\n' +
'  <div class="container">\n' +
'    <p class="okruszki"><a href="../index.html">Start</a> / Edycje</p>\n' +
'    <header class="hero" style="padding-top:1.2rem">\n' +
'      <span class="etykieta">Rejestr edycji</span>\n' +
'      <h1>Edycje Mechatonu</h1>\n' +
'      <p class="lede">Każda edycja to inny partner przemysłowy i inne zadanie inżynierskie.' +
' Wejdź do edycji, aby zobaczyć wyniki, podium i materiały.</p>\n' +
'    </header>\n' +
'    <ul class="archiwum">\n' + li + '\n    </ul>\n' +
'  </div>\n' +
'</main>\n' +
'\n' + stopka() + '\n' +
'</body>\n' +
'</html>\n';
  }

  /* ── manifest dane/edycje.js (nowością na górze) ────────── */
  function manifest(lista) {
    var wpis = lista.map(function (e) {
      return '  { etykieta: ' + JSON.stringify(e.etykieta) +
        ', numer: ' + JSON.stringify(e.numer) +
        ', firma: ' + JSON.stringify(e.firma) +
        ', rok: ' + JSON.stringify(e.rok) +
        ', daty: ' + JSON.stringify(e.daty) +
        ', temat: ' + JSON.stringify(e.temat) +
        ', zespolow: ' + Number(e.zespolow || 0) +
        ', uczestnikow: ' + Number(e.uczestnikow || 0) +
        ', link: ' + JSON.stringify("./edycje/" + (e.plik || ("ED-" + e.etykieta.replace("ED-", "") + ".html"))) +
        ' }';
    }).join(",\n");
    return '/* ============================================================\n' +
'   dane/edycje.js — manifest edycji Mechaton\n' +
'   TEN PLIK JEST GENEROWANY przez generator-edycji.html.\n' +
'   Nie edytuj ręcznie — uruchom generator i wgraj świeży plik.\n' +
'   Kolejność: od najnowszej edycji do najstarszej.\n' +
'   ============================================================ */\n' +
'window.EDYCJE = [\n' + wpis + '\n];\n';
  }

  return { strona: strona, archiwum: archiwum, manifest: manifest };
});
