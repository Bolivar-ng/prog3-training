/* Kapitel 06 · Serie S01: Mocking-Grundlagen – erzeugen, einrichten, prüfen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Die Java-Teile wurden kompiliert; das Verhalten von Mockito entspricht der Mockito-Dokumentation. */
P3.serie({
  id: 'K06-S01',
  kapitel: 'K06',
  titel: 'Grundlagen: Mocks erzeugen, einrichten, prüfen',
  beschreibung: 'Wozu Mocks, Eigenschaften eines Mock-Objekts, Testaufbau, when/thenReturn, Standardwerte, doThrow bei void, verify mit Anzahl, Matcher-Regel, Dependency Injection.',
  neu: true,
  themen: [
    { id: 'idee',  name: 'Wozu Mocks?' },
    { id: 'setup', name: 'Erzeugen und einrichten' },
    { id: 'check', name: 'Aufrufe prüfen' },
    { id: 'regel', name: 'Regeln und Entwurf' }
  ],
  fragen: [

    { id: 'K06-S01-F01', sec: 'idee', type: 'mc', wichtig: true, t: 'Wann ein Mock hilft',
      prompt: 'Die Methoden der Klasse `Bank` liefern nur richtige Ergebnisse, wenn `Konto` richtig arbeitet. Warum mockt man im Bank-Test die Konten?',
      options: [
        'Weil Konten zu viele Attribute haben, um sie im Test zu erzeugen.',
        'Weil ein roter Test sonst nicht zeigt, ob der Fehler in Bank oder Konto steckt.',
        'Weil JUnit echte Objekte anderer Klassen nicht als Parameter akzeptiert.',
        'Weil Mock-Objekte intern schneller rechnen und damit jeden Test spürbar beschleunigen.'
      ],
      answer: 1,
      explain: 'Mit Mocks testet man die Bank **unabhängig** von der Funktionalität der Konten. Schlägt der Test fehl, liegt der Fehler sicher in der Bank. Weitere Gründe: Partnerklassen sind vielleicht noch nicht fertig, langsam, nicht reproduzierbar, oder es kommen später neue Unterklassen hinzu. Mocks rechnen gar nicht, sie liefern nur vorgegebene Werte.' },

    { id: 'K06-S01-F02', sec: 'idee', type: 'multi', wichtig: true, t: 'Eigenschaften eines Mock-Objekts',
      prompt: 'Welche Aussagen über ein Mock-Objekt stimmen?',
      options: [
        'Es hat dieselbe Schnittstelle wie das echte Objekt.',
        'Es führt die echten Methoden aus, protokolliert sie aber mit.',
        'Es liefert vordefinierte Testwerte statt echter Daten.',
        'Es merkt sich, welche Methoden mit welchen Parametern aufgerufen wurden.',
        'Man muss dafür von Hand eine Unterklasse schreiben.'
      ],
      answer: [0, 2, 3],
      explain: 'Ein Mock ist ein Platzhalter: gleiche Methoden (und gleicher Typ), aber **kein echter Code**. Er liefert, was der Test festlegt, und protokolliert jeden Aufruf. Erzeugt wird er von Mockito mit `Mockito.mock()`, ohne eigene Unterklasse.' },

    { id: 'K06-S01-F03', sec: 'idee', type: 'match', t: 'Die vier Phasen eines Tests',
      prompt: 'Ordne jeder Phase zu, was dort passiert.',
      pairs: [
        ['SetUp', 'Testobjekt erzeugen und Mocks für die Situation einrichten'],
        ['Exercise', 'die zu testende Methode mit echten Werten aufrufen'],
        ['Verify', 'Rückgabewerte und Nebeneffekte auf den Mocks prüfen'],
        ['TearDown', 'gegebenenfalls aufräumen']
      ],
      explain: 'Nebeneffekte prüft man vor allem auf den **abhängigen Objekten**: Wurden ihre Methoden richtig aufgerufen? Der Testname soll die Situation beschreiben, der Code möglichst einfach sein.' },

    { id: 'K06-S01-F04', sec: 'setup', type: 'order', wichtig: true, t: 'Die 5 Schritte eines Mockito-Tests',
      prompt: 'Bringe die Schritte eines Tests für `Automat` (mit gemockter `Kasse`) in die richtige Reihenfolge.',
      items: [
        '`Kasse kasse = Mockito.mock();`',
        '`Mockito.when(kasse.getKontostand()).thenReturn(42);`',
        '`Automat automat = new Automat(kasse);`',
        '`boolean ok = automat.rueckgeld(10);`',
        '`assertTrue(ok); Mockito.verify(kasse).auszahlen(10);`'
      ],
      explain: 'Erzeugen, einrichten, an das Testobjekt übergeben, die Methode aufrufen, prüfen. Das Einrichten muss **vor** dem Aufruf passieren, sonst liefert das Mock nur Standardwerte.' },

    { id: 'K06-S01-F05', sec: 'setup', type: 'fill', wichtig: true, t: 'Ein Mock einrichten',
      prompt: 'Die gemockte Kasse soll vortäuschen, dass sie 42 € enthält.',
      code: `Kasse kasse = Mockito.[[0]]();
Mockito.[[1]](kasse.getKontostand()).[[2]](42);`,
      blanks: [
        { options: ['spy', 'mock', 'create', 'when'], answer: 1,
          why: '`Mockito.mock()` erzeugt das Mock-Objekt. Den Typ nimmt Mockito aus der Variablen links.' },
        { options: ['verify', 'when', 'doReturn', 'given'], answer: 1,
          why: '`when(…)` bekommt den Methodenaufruf auf dem Mock, dessen Ergebnis man festlegen will.' },
        { options: ['thenReturn', 'thenThrow', 'returns', 'answer'], answer: 0,
          why: '`thenReturn(wert)`: Wird `getKontostand()` aufgerufen, kommt 42 heraus.' }
      ],
      explain: 'Den Zustand eines Objekts erkennt man nur an seinen Rückgabewerten. Wer sie festlegt, „ist“ für den Automaten eine Kasse mit 42 €, egal was intern passiert.' },

    { id: 'K06-S01-F06', sec: 'setup', type: 'match', wichtig: true, t: 'Nicht eingerichtete Methoden',
      prompt: 'Was liefert eine **nicht** eingerichtete Methode eines Mocks? Ordne nach dem Rückgabetyp zu.',
      pairs: [
        ['`int getKontostand()`', '`0`'],
        ['`double getZins()`', '`0.0`'],
        ['`boolean abheben(…)`', '`false`'],
        ['`String getName()`', '`null`'],
        ['`List<Konto> getKonten()`', 'eine leere Liste']
      ],
      explain: 'Ohne `when` antwortet ein Mock mit Standardwerten. Eine häufige Fehlerquelle: Man vergisst das Einrichten, `abheben` liefert `false`, und der Test schlägt aus einem ganz anderen Grund fehl als erwartet.' },

    { id: 'K06-S01-F07', sec: 'setup', type: 'mc', wichtig: true, t: 'Exception bei einer void-Methode',
      prompt: '`auszahlen(int)` ist eine `void`-Methode. Wie lässt man sie im Mock eine Exception werfen?',
      options: [
        '`Mockito.when(kasse.auszahlen(10)).thenThrow(new IllegalStateException());`',
        '`Mockito.when(kasse).auszahlen(10).thenThrow(new IllegalStateException());`',
        '`Mockito.doThrow(new IllegalStateException()).when(kasse).auszahlen(10);`',
        '`Mockito.thenThrow(new IllegalStateException()).when(kasse.auszahlen(10));`'
      ],
      answer: 2,
      explain: '`when(…)` braucht als Argument einen **Rückgabewert**, und eine `void`-Methode hat keinen: Die erste Zeile kompiliert nicht. Deshalb die umgekehrte Schreibweise: `doThrow(exception).when(mock).methode(parameter)`. Bei Methoden mit Rückgabewert geht `when(mock.methode()).thenThrow(…)`.' },

    { id: 'K06-S01-F08', sec: 'setup', type: 'input', t: 'Mehrere Rückgabewerte',
      prompt: 'Was wird ausgegeben?',
      code: `Kasse kasse = Mockito.mock();
Mockito.when(kasse.getKontostand()).thenReturn(50, 20, 0);
System.out.println(kasse.getKontostand() + " " + kasse.getKontostand() + " "
        + kasse.getKontostand() + " " + kasse.getKontostand());`,
      answers: ['50 20 0 0'],
      explain: '`thenReturn(w1, w2, w3)` legt die Werte für aufeinanderfolgende Aufrufe fest. Gibt es mehr Aufrufe als Werte, wird der **letzte** Wert wiederholt.' },

    { id: 'K06-S01-F09', sec: 'check', type: 'mc', wichtig: true, t: 'Was prüft verify ohne Angabe?',
      prompt: 'Was genau prüft `Mockito.verify(kasse).auszahlen(10);`?',
      options: [
        'Dass `auszahlen` irgendwann mit irgendeinem Betrag aufgerufen wurde.',
        'Dass `auszahlen(10)` genau einmal auf `kasse` aufgerufen wurde.',
        'Dass der Kontostand der Kasse danach um 10 kleiner ist.',
        'Dass `auszahlen(10)` mindestens einmal aufgerufen wurde, egal wie oft.'
      ],
      answer: 1,
      explain: 'Ohne zweiten Parameter gilt `times(1)`: diese Methode, **genau mit diesen Parametern**, **genau einmal**. Einen Kontostand gibt es bei einem Mock nicht. Man prüft nicht die Auswirkung, sondern **ob der Aufruf stattfand**.' },

    { id: 'K06-S01-F10', sec: 'check', type: 'match', t: 'VerificationModes',
      prompt: 'Ordne zu.',
      pairs: [
        ['`verify(m, times(2)).x()`', 'genau zweimal aufgerufen'],
        ['`verify(m, atLeast(1)).x()`', 'mindestens einmal aufgerufen'],
        ['`verify(m, atMost(3)).x()`', 'höchstens dreimal aufgerufen'],
        ['`verify(m, only()).x()`', 'x war die einzige Methode, die auf m aufgerufen wurde'],
        ['`verifyNoInteractions(m)`', 'auf m wurde überhaupt nichts aufgerufen'],
        ['`verifyNoMoreInteractions(m)`', 'außer den schon verifizierten Aufrufen gab es keine weiteren']
      ],
      explain: '„Nie aufgerufen“ schreibt man als `times(0)` oder `never()`. `verifyNoInteractions` eignet sich für Fehlerfälle („bei ungültigen Parametern darf das Konto gar nicht angefasst werden“).' },

    { id: 'K06-S01-F11', sec: 'check', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 5, t: 'Test für zu wenig Geld',
      prompt: 'Schreibe einen Test für `Automat.rueckgeld`: Die gemockte Kasse enthält nur 5 €, verlangt werden 10 €. Prüfe das Ergebnis **und** dass nichts ausgezahlt wurde.',
      model: 'Kernpunkte: (1) Aussagekräftiger Name, der die Situation beschreibt. (2) SetUp: Mock erzeugen, `getKontostand()` auf 5 einrichten, Automat mit dem Mock bauen. (3) Exercise: `rueckgeld(10)` mit echtem Wert. (4) Verify mit JUnit: Rückgabe `false`. (5) Verify mit Mockito: `auszahlen` darf **nie** aufgerufen worden sein, mit welchem Betrag auch immer (`anyInt()`).',
      modelCode: `@Test
void keinRueckgeldWennKasseZuLeer() {
    Kasse kasse = Mockito.mock();
    Mockito.when(kasse.getKontostand()).thenReturn(5);
    Automat automat = new Automat(kasse);

    boolean ok = automat.rueckgeld(10);

    assertFalse(ok);
    Mockito.verify(kasse, Mockito.times(0)).auszahlen(ArgumentMatchers.anyInt());
}`,
      explain: 'Gerade der zweite Check ist der Gewinn durch Mockito: Ein fehlerhafter Automat, der trotzdem auszahlt und dann `false` liefert, würde nur so auffallen.' },

    { id: 'K06-S01-F12', sec: 'regel', type: 'mc', wichtig: true, t: 'Matcher mischen',
      prompt: 'Was ist an `Mockito.verify(bank).ueberweisen(ArgumentMatchers.anyLong(), 500);` falsch?',
      options: [
        'Nichts, Matcher und feste Werte dürfen beliebig gemischt werden.',
        '`anyLong()` gibt es nicht, es heißt `anyInt()`.',
        'Entweder alle Parameter mit Matchern oder keiner: es muss `eq(500)` heißen.',
        'Matcher dürfen nur beim Einrichten in `when(…)` stehen, aber niemals in `verify(…)`.'
      ],
      answer: 2,
      explain: 'Regel: **Alle Parameter mit ArgumentMatchers oder keiner.** Genau dafür gibt es `eq(wert)`: `verify(bank).ueberweisen(anyLong(), eq(500))`. Matcher sind in `when` **und** in `verify` erlaubt, aber nie in der Exercise-Phase.' },

    { id: 'K06-S01-F13', sec: 'regel', type: 'mc', wichtig: true, t: 'Nie die getestete Klasse mocken',
      prompt: 'Warum mockt man **nie** ein Objekt der Klasse, die man gerade testet?',
      options: [
        'Weil Mockito nur Interfaces mocken kann, keine Klassen.',
        'Weil dann nur vorgetäuschtes Verhalten geprüft wird, nicht der eigene Code.',
        'Weil ein Mock nur einmal pro Testklasse erzeugt werden darf.',
        'Weil der Compiler das Mocken einer Klasse verbietet, die im selben Projekt liegt.'
      ],
      answer: 1,
      explain: 'Ein Mock führt keinen echten Code aus. Mockt man den Automaten selbst, prüft der Test nur, was man vorher eingerichtet hat, und kein einziger Fehler im Automaten fällt auf. Mockito kann übrigens auch Klassen mocken, z. B. `Konto`.' },

    { id: 'K06-S01-F14', sec: 'regel', type: 'mc', wichtig: true, t: 'Dependency Injection',
      prompt: 'Welche Version von `Automat` lässt sich mit einer gemockten Kasse testen?',
      options: [
        '`private Kasse kasse = new EchteKasse();` im Attribut',
        '`public Automat() { kasse = new EchteKasse(); }`',
        '`public Automat(Kasse kasse) { this.kasse = kasse; }`',
        '`private static final Kasse KASSE = new EchteKasse();`'
      ],
      answer: 2,
      explain: 'Ein Mock muss **von außen** hineingegeben werden können: über Konstruktor, Setter oder eine Einfüge-Methode. Erzeugt die Klasse ihren Partner selbst, gibt es keinen Weg, ihn zu ersetzen. Am besten ist der Parametertyp ein **Interface**.' },

    { id: 'K06-S01-F15', sec: 'regel', type: 'multi', t: 'Was mocken, was nicht?',
      prompt: 'Eine `Bank` soll getestet werden. Welche Entscheidungen sind sinnvoll?',
      options: [
        '`Konto` mocken: Die Bank soll unabhängig von (auch künftigen) Kontoarten funktionieren.',
        '`Geldbetrag` echt verwenden: einfache Wertklasse, für die Bank-Logik unkritisch.',
        '`Bank` mocken, damit der Test schneller läuft.',
        '`Kunde` echt verwenden: einfach und für die Bank-Funktionalität kaum wichtig.'
      ],
      answer: [0, 1, 3],
      explain: 'Faustregel: Man mockt, was **gerade nicht getestet** wird und worauf man sich nicht hundertprozentig verlassen kann. Bei Konten muss man mit neuen Unterklassen rechnen. Einfache, stabile Klassen wie Geldbetrag oder Kunde darf man echt benutzen. Die getestete Klasse selbst wird nie gemockt.' }
  ]
});
