/* Inhaltsverzeichnis der Plattform.
   Neues Kapitel: Eintrag anhängen. Neue Serie: Dateiname (ohne .js) an "serien" anhängen
   und die Datei content/<ordner>/<serie>.js anlegen. Reihenfolge hier = Reihenfolge auf der Seite. */
P3.kapitel([
  {
    id: 'K00',
    ordner: 'k00',
    titel: 'Grundlagen und Wiederholung',
    beschreibung: 'Qualitätsregeln, Namen und JavaDoc, Referenzen, equals/hashCode, Exceptions, switch, Bankprojekt und Übung 0.',
    zusammenfassung: true,
    serien: ['s03', 's04']
  },
  {
    id: 'K01',
    ordner: 'k01',
    titel: 'Maven',
    beschreibung: 'Build-Management: GAV, pom.xml, Lebenszyklus, Dependencies und Scopes, Plugins und Goals, typische Fehler.',
    zusammenfassung: true,
    serien: ['s01', 's02', 's03']
  },
  {
    id: 'K02',
    ordner: 'k02',
    titel: 'Interfaces',
    beschreibung: 'Interfaces schreiben und verwenden, die Wege der Implementierung (innere, anonyme Klassen), this, compareTo, instanceof, funktionale Interfaces und Lambda-Ausdrücke.',
    zusammenfassung: true,
    serien: ['s01']
  }
]);
