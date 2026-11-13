/* ============================================================
   STAN SERWISU MECHATON — JEDYNY PLIK, KTÓRY EDYTUJĄ OPERATORZY
   ============================================================
   ZASADY BEZPIECZEŃSTWA:
   1. Edytuj TYLKO teksty między cudzysłowami "" — nic poza nimi.
   2. Nie usuwaj przecinków, cudzysłowów ani klamer.
   3. Po wgraniu tego pliku na serwer sprawdź stronę (Ctrl+F5).
   4. Jeśli coś zepsujesz — strona wróci do widoku domyślnego
      („edycja za nami"). Nic nie psuje się na stałe.
   Instrukcje krok po kroku: CHECKLISTA.md
   ============================================================ */

window.STAN = {

  /* ── 1. FAZA SERWISU ──────────────────────────────────────
     Wpisz dokładnie jedno słowo (małe litery, w cudzysłowie):
       "post"       → edycja za nami, następna nieznana (widok domyślny)
       "ogloszenie" → znana firma i daty, zapisy jeszcze nie trwają
       "zapisy"     → zapisy otwarte, aktywny przycisk zgłoszenia
       "trwa"       → konkurs właśnie się odbywa
  */
  faza: "post",

  /* ── 2. DANE PRZYSZŁEJ EDYCJI ─────────────────────────────
     Wypełnij, gdy faza to "ogloszenie", "zapisy" lub "trwa".
     Przy "post" pola mogą zostać puste ("").                  */
  firma: "",               // nazwa firmy partnera, np. "MBL"
  numer: "V",              // numer edycji, np. "V"
  etykieta: "ED-05",       // etykieta techniczna, np. "ED-05"
  tematy: "",              // temat zadanego problemu, np. "Konstrukcja ..."
  datyTekst: "",           // np. "18–20 listopada 2026"
  zapisyOdTekst: "",       // start zapisów, np. "4 listopada"
  zapisyDoTekst: "",       // koniec zapisów, np. "12 listopada"
  zapisyStartIso: "",      // dla licznika dni, format "2026-11-04" (może być puste)
  zapisyKoniecIso: "",     // dla licznika dni, format "2026-11-12" (może być puste)
  linkFormularza: "",      // pełny link do formularza zgłoszeniowego
  linkStronyEdycji: ""     // strona edycji po publikacji, np. "./edycje/ED-05.html"

  /* Koniec konfiguracji. Nie edytuj niczego poniżej. */
};
