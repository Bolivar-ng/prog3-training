# Prog3-Training

Trainingsplattform für **Programmieren 3** (HTW Berlin): pro Kapitel eine Zusammenfassung und mehrere Trainingsserien.

- **Lernmodus**: ohne Timer, sofortige Rückmeldung mit Erklärung nach jeder Antwort.
- **Prüfungsmodus**: mit Timer (wählbar), keine Rückmeldung bis zur Abgabe, danach Auswertung mit **Note** (1,0–5,0). Läuft nach einem Neuladen weiter.
- **Große Prüfung**: zufällige Fragen aus mehreren Kapiteln; dazu ein Probe-Moodle-Test (15 Fragen, 30 Minuten).
- **Fehlertraining** (alles, was zuletzt falsch war), **Gemerkt** (☆), **Notizen** pro Frage, **Verlauf** aller Prüfungen.
- Fortschritt liegt im `localStorage` des Browsers (Präfix `prog3-training:`), Export und Import als JSON unter *Einstellungen*.
- Hell/dunkel, mobil nutzbar, alles auf Deutsch.

## Starten

- Online: über GitHub Pages (siehe unten).
- Lokal: `index.html` per Doppelklick öffnen. Es gibt keinen Build-Schritt und keine Abhängigkeiten.

## Aufbau

```
index.html                Seitengerüst
assets/style.css          Gestaltung
assets/kern.js            Speicherung, Noten, Hilfsfunktionen, Registrierung der Inhalte
assets/typen.js           die Aufgabentypen
assets/app.js             Ansichten, Lern- und Prüfungsmodus, Router
content/inhalt.js         Inhaltsverzeichnis: Kapitel und ihre Serien
content/k00/zusammenfassung.js
content/k00/s01.js …      eine Datei pro Serie
tools/pruefen.js          prüft alle Inhalte auf Formfehler
```

Motor und Inhalte sind getrennt: Neue Kapitel und Serien brauchen keine Änderung am Code.

## Neue Serie hinzufügen

Umfang: **10–20 Fragen pro Serie**, nur die wichtigsten.


1. Datei `content/k00/s05.js` anlegen (Format unten).
2. In `content/inhalt.js` beim Kapitel `'s05'` an `serien` anhängen.
3. `node tools/pruefen.js` ausführen, muss „Alles in Ordnung.“ melden.
4. Committen und pushen. Der Fortschritt bleibt erhalten.

Neues Kapitel: Eintrag in `content/inhalt.js` anhängen, Ordner `content/k01/` mit `zusammenfassung.js` und Serien anlegen.

## Probetests

Kapitel `K90` mit `bereich: 'tests'` (Ordner `content/tests/`, Dateien `t01.js`, `t02.js` …) erscheint nicht in der Kapitelliste, sondern als eigener, orange markierter Bereich ganz unten auf der Startseite (unter Kapitel und Gezielt üben). Jede Test-Serie hat `dauer` (Minuten): Das ist die feste Zeit im Prüfungsmodus. Ein Probetest mischt Theorie und Praxis aus allen bisherigen Kapiteln; bei mc-Fragen darf die richtige Antwort weder auffällig oft die längste Option noch immer an derselben Position sein.

## Feste IDs: die wichtigste Regel

Jede Frage hat eine feste ID `Kxx-Snn-Fnn` (z. B. `K00-S04-F07`). Der Fortschritt hängt an dieser ID.

- IDs **nie** ändern, neu nummerieren oder für eine andere Frage wiederverwenden.
- Eine Frage korrigieren (Tippfehler, bessere Erklärung) ist jederzeit erlaubt, die ID bleibt.
- Eine Frage löschen: einfach entfernen. Die ID danach nicht neu vergeben.
- Neue Fragen in einer bestehenden Serie bekommen die nächste freie Nummer.

## Format einer Serie

```js
P3.serie({
  id: 'K00-S05',               // = Kapitel + Dateiname
  kapitel: 'K00',
  titel: 'Titel der Serie',
  beschreibung: 'Ein Satz, worum es geht.',
  neu: true,                   // optional: Markierung „neu“
  minutenProFrage: 1.5,        // optional: Basis für den Zeitvorschlag
  themen: [{ id: 'exc', name: 'Exceptions' }],
  fragen: [ /* Fragen, siehe unten */ ]
});
```

Gemeinsame Felder jeder Frage: `id`, `sec` (Themen-ID), `type`, `t` (kurzer Titel), `prompt` (Frage), optional `code`, `explain` (Erklärung nach der Auflösung), `kind` (eigene Typ-Beschriftung), `minuten` (eigene Zeit im Prüfungsmodus).

In `prompt`, `options`, `explain` usw. wird `` `Code` `` als Code und `**fett**` fett dargestellt.

| `type` | Bedeutung | Pflichtfelder |
|---|---|---|
| `mc` | eine richtige Antwort | `options`, `answer` (Index ab 0) |
| `multi` | mehrere richtige Antworten | `options`, `answer` (Liste von Indizes) |
| `input` | Ausgabe eintippen | `code`, `answers` (Liste erlaubter Lösungen; `\n` für mehrzeilig) |
| `fill` | Lückentext im Code | `code` mit `[[0]]`, `[[1]]` …, `blanks: [{ options, answer, why }]` |
| `order` | Reihenfolge | `items` in **richtiger** Reihenfolge (wird gemischt angezeigt) |
| `match` | Zuordnen | `pairs: [[links, rechts], …]` |
| `bug` | Fehlerzeilen markieren | `code`, `required` (Zeilennummern ab 1), optional `extra` (dürfen mitmarkiert werden), optional `model` → zusätzlich Erklärung mit Selbstbewertung |
| `review` | Code-Review | `code`, `findings: [{ text, correct, why }]` |
| `trace` | Trace-Tabelle | `code`, `columns`, `rows: [{ label, values }]`; ein Wert darf eine Liste erlaubter Schreibweisen sein, z. B. `['4.0', '4']` |
| `explain` | Erklären | `model` (Musterlösung); bewertet wird selbst: 1 / 0,5 / 0 |

Bewertung: jede Frage 1 Punkt, nur vollständig richtig zählt (bei Erklärungen auch 0,5).

## Noten

Bestehensgrenze (Standard 50 %, in den Einstellungen änderbar) = 4,0, ab 95 % gibt es 1,0, dazwischen gleich breite Stufen (1,0 1,3 1,7 … 4,0), darunter 5,0.

## Inhalte und Qualität

- Alle Fragen sind eigene Übungsfragen. Keine Folien, Übungsblätter oder Vorgaben der Lehrveranstaltung im Repo.
- Ausgaben und Trace-Werte werden vor dem Einchecken in Java ausgeführt und geprüft.

## Veröffentlichen mit GitHub Pages

```
gh repo create prog3-training --public --source . --push
```

Dann auf GitHub: *Settings → Pages → Source: Deploy from a branch → main / (root)*. Nach ein bis zwei Minuten ist die Seite unter `https://<benutzername>.github.io/prog3-training/` erreichbar.
