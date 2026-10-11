/* Kapitel 00 · Serie S04: Übung 0 – Vektor, Winkel, Sparbuch, JUnit
   Alle Ausgaben und Trace-Werte wurden mit Java ausgeführt und geprüft.
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben. */
P3.serie({
  id: 'K00-S04',
  kapitel: 'K00',
  titel: 'Übung 0: Vektor, Winkel, Sparbuch, JUnit',
  beschreibung: 'Alles, was in Übung 0 a) und b) schiefgehen kann: Polarkoordinaten, atan2, Unveränderlichkeit, equals/hashCode mit double, der Monats-Fehler im Sparbuch und saubere JUnit-Tests.',
  neu: true,
  themen: [
    { id: 'vek', name: 'Vektor und Winkel' },
    { id: 'eq', name: 'equals und hashCode mit double' },
    { id: 'spar', name: 'Sparbuch: der Monats-Fehler' },
    { id: 'junit', name: 'JUnit 5' },
    { id: 'rev', name: 'Code-Review' }
  ],
  fragen: [
    /* ---------- Vektor und Winkel ---------- */
    { id: 'K00-S04-F01', sec: 'vek', type: 'input', t: 'Winkel normalisiert',
      prompt: 'Der Winkel-Konstruktor bringt jeden Wert in den Bereich [0°, 360°). Was gibt dieser Code aus? (zwei Zeilen)',
      code: `System.out.println(new Winkel(-90).getWinkelInGrad());
System.out.println(new Winkel(725).getWinkelInGrad());`,
      answers: ['270.0\n5.0'],
      explain: '`-90 % 360` ist in Java **−90** (der Rest hat das Vorzeichen des linken Operanden), deshalb addiert der Konstruktor 360: 270.0. `725 % 360` ist 5.0. double-Werte werden mit `.0` ausgegeben.' },

    { id: 'K00-S04-F02', sec: 'vek', type: 'mc', t: 'atan kennt den Quadranten nicht',
      prompt: 'Für den Vektor (−1, −1) berechnet jemand den Winkel mit `Math.toDegrees(Math.atan(y / x))`. Was kommt heraus, und was wäre richtig?',
      options: [
        '225.0, das ist richtig.',
        '45.0, richtig wäre 225°: y/x = 1 sieht für (1, 1) und (−1, −1) gleich aus.',
        '−135.0, richtig wäre 225°.',
        'NaN, weil x negativ ist.'
      ],
      answer: 1,
      explain: 'Durch die Division gehen die Vorzeichen verloren: (−1)/(−1) = 1 = 1/1. atan liefert nur Werte zwischen −90° und 90°. `Math.atan2(y, x)` bekommt beide Koordinaten einzeln, kennt deshalb den Quadranten und liefert −135°, was `new Winkel(...)` zu 225° normalisiert.' },

    { id: 'K00-S04-F03', sec: 'vek', type: 'input', t: 'atan2 und Winkel',
      prompt: 'Was gibt dieser Code aus?',
      code: `double grad = Math.toDegrees(Math.atan2(-1, -1));
System.out.println(grad);
System.out.println(new Winkel(grad).getWinkelInGrad());`,
      answers: ['-135.0\n225.0'],
      explain: '`atan2` liefert Winkel zwischen −180° und 180°, hier −135°. Der Winkel-Konstruktor rechnet −135 % 360 = −135, negativ, also +360 = 225.' },

    { id: 'K00-S04-F04', sec: 'vek', type: 'mc', t: 'Der Nullvektor mit atan(y/x)',
      prompt: 'Die Vorgabe berechnet im kartesischen Konstruktor `phi = new Winkel(Math.toDegrees(Math.atan(y / x)))` und hat die Konstante `public static final Vektor NULL = new Vektor(0, 0);`. Was passiert beim ersten Zugriff auf die Klasse Vektor?',
      options: [
        'Nichts Besonderes, NULL hat den Winkel 0°.',
        '`ArithmeticException` wegen Division durch 0.',
        '0.0 / 0.0 ergibt NaN, `new Winkel(NaN)` wirft eine IllegalArgumentException, und weil das in der statischen Initialisierung passiert, kommt ein `ExceptionInInitializerError`: Die ganze Klasse ist unbenutzbar.',
        'Kompilierfehler, weil man nicht durch 0 teilen darf.'
      ],
      answer: 2,
      explain: 'Bei double gibt es keine ArithmeticException: 0.0/0.0 ist NaN. `Math.atan(NaN)` ist NaN, und Winkel lehnt nicht-endliche Werte ab. Statische Konstanten werden beim Laden der Klasse erzeugt; scheitert das, meldet Java `ExceptionInInitializerError`, und jeder weitere Zugriff auf Vektor scheitert mit `NoClassDefFoundError`. Mit `atan2(0, 0)` = 0 tritt das Problem nicht auf.' },

    { id: 'K00-S04-F05', sec: 'vek', type: 'fill', t: 'Polar → kartesisch',
      prompt: 'Vervollständige den Polar-Konstruktor so, dass x und y richtig berechnet werden.',
      code: `public Vektor(double betrag, Winkel phi) {
    // Prüfungen weggelassen
    this.betrag = betrag;
    this.phi = phi;
    this.x = betrag * Math.[[0]](phi.[[1]]());
    this.y = betrag * Math.[[2]](phi.getWinkelImBogenmass());
}`,
      blanks: [
        { options: ['cos', 'sin', 'tan'], answer: 0, why: 'Die x-Koordinate ist die Ankathete: x = r · cos(φ).' },
        { options: ['getWinkelImBogenmass', 'getWinkelInGrad', 'toString'], answer: 0, why: '`Math.cos` und `Math.sin` erwarten den Winkel im **Bogenmaß** (Radiant). Mit Grad würde cos(90) statt cos(90°) berechnet.' },
        { options: ['sin', 'cos', 'atan2'], answer: 0, why: 'Die y-Koordinate ist die Gegenkathete: y = r · sin(φ).' }
      ],
      explain: 'Merksatz: x = r · cos φ, y = r · sin φ, φ immer im Bogenmaß an die Math-Methoden geben.' },

    { id: 'K00-S04-F06', sec: 'vek', type: 'input', t: 'cos(90°) ist nicht 0',
      prompt: 'Was gibt dieser Code aus?',
      code: `System.out.println(Math.cos(Math.toRadians(90)) == 0);`,
      answers: ['false'],
      explain: 'π/2 ist als double nicht exakt darstellbar, deshalb liefert `Math.cos(Math.toRadians(90))` den Wert 6.123233995736766E-17, fast, aber nicht genau 0. Darum erzeugt der Polar-Konstruktor für (1, 90°) den Vektor (6.1E-17, 1.0), und ein Vergleich mit `new Vektor(0, 1)` per equals ist false. Bei double nie blind mit == vergleichen.' },

    { id: 'K00-S04-F07', sec: 'vek', type: 'trace', t: 'addieren ohne Nebenwirkung',
      prompt: 'Mit der korrigierten, unveränderlichen Klasse Vektor (addieren gibt einen **neuen** Vektor zurück). Trage die Koordinaten nach der letzten Zeile ein.',
      code: `Vektor a = new Vektor(1, 2);
Vektor b = a.addieren(new Vektor(3, 4));
Vektor c = b.addieren(b);`,
      columns: ['getX()', 'getY()'],
      rows: [
        { label: '`a`', values: [['1.0', '1'], ['2.0', '2']] },
        { label: '`b`', values: [['4.0', '4'], ['6.0', '6']] },
        { label: '`c`', values: [['8.0', '8'], ['12.0', '12']] }
      ],
      explain: 'Weil addieren `this` nicht verändert, bleibt a = (1, 2). b = (1+3, 2+4) = (4, 6), c = b + b = (8, 12). In der Vorgabe hätte addieren `this` verändert: a wäre dann selbst (4, 6) geworden, und `NULL.addieren(v)` hätte sogar die Konstante NULL kaputtgemacht.' },

    { id: 'K00-S04-F08', sec: 'vek', type: 'multi', t: 'Was macht Vektor unveränderlich?',
      prompt: 'Welche Maßnahmen tragen dazu bei, dass Vektor-Objekte nach dem Erzeugen nicht mehr verändert werden können?',
      options: [
        'Alle Attribute `private`.',
        'Alle Attribute `final`.',
        'Keine Setter.',
        '`addieren` gibt einen neuen Vektor zurück, statt this zu ändern.',
        'Eine überschriebene `toString()`-Methode.',
        '`hashCode()` überschreiben.'
      ],
      answer: [0, 1, 2, 3],
      explain: 'private verhindert Zugriff von außen, final verhindert Neuzuweisung (auch versehentlich in der eigenen Klasse), ohne Setter und mit „neues Objekt statt Änderung“ gibt es keinen Weg, den Zustand zu ändern. toString und hashCode haben mit Veränderbarkeit nichts zu tun. (Winkel ist zusätzlich `final class`, damit auch keine Unterklasse Veränderbarkeit einschmuggeln kann.)' },

    { id: 'K00-S04-F09', sec: 'vek', type: 'match', t: 'Welche Exception?',
      prompt: 'Ordne jeder Situation die passende Exception zu.',
      pairs: [
        ['`v.addieren(null)`', '`NullPointerException`'],
        ['`new Vektor(-3, new Winkel(0))`', '`IllegalArgumentException`'],
        ['`Vektor.NULL.orthogonalerEinheitsvektor()`', '`IllegalStateException`'],
        ['`int z = 1 / 0;`', '`ArithmeticException`']
      ],
      explain: 'null als Argument: NPE. Ungültiger Wert als Argument: IAE. Methode ohne (problematischen) Parameter, aber der Zustand des Objekts passt nicht (der Nullvektor hat keine Richtung): ISE. Ganzzahlige Division durch 0: ArithmeticException.' },

    { id: 'K00-S04-F10', sec: 'vek', type: 'trace', t: 'Orthogonaler Einheitsvektor',
      prompt: 'Die korrigierte Methode rechnet `new Vektor(this.y / this.betrag, -this.x / this.betrag)`. Trage die Werte für `v = new Vektor(3, 4)` ein.',
      code: `Vektor v = new Vektor(3, 4);
Vektor o = v.orthogonalerEinheitsvektor();
double l = o.getBetrag();`,
      columns: ['Wert'],
      rows: [
        { label: '`v.getBetrag()`', values: [['5.0', '5']] },
        { label: '`o.getX()`', values: [['0.8']] },
        { label: '`o.getY()`', values: [['-0.6']] },
        { label: '`l`', values: [['1.0', '1']] }
      ],
      explain: '√(3² + 4²) = 5. o = (4/5, −3/5) = (0.8, −0.6), Länge √(0.64 + 0.36) = 1. Probe auf dem Papier: 3 · 0.8 + 4 · (−0.6) = 0, also senkrecht. Achtung: `v.skalarprodukt(o)` liefert in Java **4.440892098500626E-16**, nicht 0.0, weil 0.8 und 0.6 als double nicht exakt darstellbar sind. Im Test deshalb `assertEquals(0.0, v.skalarprodukt(o), 1e-9)`.' },

    /* ---------- equals / hashCode ---------- */
    { id: 'K00-S04-F11', sec: 'eq', type: 'input', t: '0.1 + 0.2',
      prompt: 'equals von Vektor vergleicht x und y mit `==`. Was gibt dieser Code aus?',
      code: `Vektor a = new Vektor(0.1 + 0.2, 0);
Vektor b = new Vektor(0.3, 0);
System.out.println(a.equals(b));`,
      answers: ['false'],
      explain: '0.1 + 0.2 ergibt als double 0.30000000000000004, nicht 0.3. Exakte Gleichheit ist bei berechneten double-Werten selten. In Tests vergleicht man deshalb mit Toleranz: `assertEquals(0.3, a.getX(), 1e-9)`.' },

    { id: 'K00-S04-F12', sec: 'eq', type: 'mc', t: '0.0 und −0.0',
      prompt: 'Schwer: equals vergleicht mit `==`, hashCode ist `Objects.hash(x, y)`. Was gilt für `p = new Vektor(0.0, 0)` und `m = new Vektor(-0.0, 0)`?',
      options: [
        'equals false, hashCodes gleich.',
        'equals true, hashCodes gleich, alles in Ordnung.',
        'equals true, aber die hashCodes sind verschieden: Der equals-hashCode-Vertrag ist verletzt, ein HashSet mit p findet m nicht.',
        'Der Konstruktor wirft eine Exception, weil −0.0 nicht endlich ist.'
      ],
      answer: 2,
      explain: '`0.0 == -0.0` ist true. `Objects.hash` benutzt aber `Double.hashCode`, und das unterscheidet 0.0 und −0.0 (verschiedene Bitmuster). In Java ausgeführt: `p.equals(m)` true, `p.hashCode() == m.hashCode()` false, `Set.of(p).contains(m)` false. Saubere Lösung: in equals `Double.compare(x, o.x) == 0` benutzen, das passt genau zu `Double.hashCode` (dann sind 0.0 und −0.0 ungleich). Weiterführend, für die Abgabe von Übung 0 wurde das nicht verlangt.' },

    { id: 'K00-S04-F13', sec: 'eq', type: 'fill', t: 'equals für Vektor',
      prompt: 'Vervollständige equals und hashCode passend zueinander.',
      code: `@Override
public boolean equals(Object other) {
    if (this == other)
        return true;
    if (!(other [[0]] Vektor o))
        return false;
    return this.x == o.x && this.y == o.y;
}

@Override
public int hashCode() {
    return Objects.[[1]](this.x, this.y);
}`,
      blanks: [
        { options: ['instanceof', 'equals', '=='], answer: 0, why: 'Pattern-instanceof (seit Java 16) prüft den Typ und deklariert gleich die Variable o, ganz ohne extra Cast. Bei `null` ist es false, deshalb ist keine eigene null-Prüfung nötig.' },
        { options: ['hash', 'equals', 'hashCode'], answer: 0, why: '`Objects.hash(...)` kombiniert beliebig viele Attribute zu einem hashCode. Es müssen dieselben Attribute sein wie in equals.' }
      ],
      explain: 'Das ist die Fassung aus der korrigierten Übung. Hinweis: Mit `getClass() != other.getClass()` statt instanceof wären Unterklassen-Objekte nie gleich. Bei einer Klasse ohne Unterklassen ist beides in Ordnung.' },

    /* ---------- Sparbuch ---------- */
    { id: 'K00-S04-F14', sec: 'spar', type: 'bug', t: 'Der Monats-Fehler',
      prompt: 'Diese (vereinfachte) abheben-Methode erlaubt mehr als 2000 € pro Monat. Markiere die Zeilen, die an der falschen Stelle stehen, und erkläre den Fehler.',
      code: `public boolean abheben(Geldbetrag betrag) {
    Geldbetrag neu = getKontostand().minus(betrag);
    if (neu.compareTo(MINIMUM) >= 0
            && schonAbgehoben.plus(betrag).compareTo(LIMIT) <= 0) {
        setKontostand(neu);
        schonAbgehoben = schonAbgehoben.plus(betrag);
        LocalDate heute = kalender.getHeutigesDatum();
        if (letzte == null || heute.getMonth() != letzte.getMonth()
                || heute.getYear() != letzte.getYear()) {
            schonAbgehoben = Geldbetrag.NULL_EURO;
        }
        letzte = heute;
        return true;
    }
    return false;
}`,
      required: [8, 10], extra: [4, 6, 7, 9, 11],
      model: `Der Monatswechsel wird erst geprüft (Zeile 8), nachdem der Betrag schon zu schonAbgehoben addiert wurde (Zeile 6). Bei der ersten Abhebung eines Monats setzt Zeile 10 die Summe deshalb auf 0 zurück und löscht damit genau diese Abhebung. Beispiel: 1500 € abheben → schonAbgehoben ist danach 0, die nächsten 1500 € werden erlaubt, insgesamt 3000 € in einem Monat.
Richtig: Datum holen und zurücksetzen (Zeilen 7–11) ganz an den Anfang, VOR die Prüfung in Zeile 4. Dann wird mit dem richtigen Monatsstand geprüft und erst danach addiert.`,
      explain: 'Genau dieser Fehler steckte im Sparbuch des Vorlesungscodes und war Ziel von Übung 0 b): ein Test, der ihn aufdeckt, und die Korrektur.' },

    { id: 'K00-S04-F15', sec: 'spar', type: 'trace', t: 'Trace: fehlerhafte Version',
      prompt: 'Fehlerhafte Version wie oben (Reset NACH dem Addieren). Sparbuch mit 5000 € Kontostand, der Kalender liefert immer den 05.10.2026. Trage nach jedem Aufruf die Werte ein.',
      code: `boolean r1 = s.abheben(new Geldbetrag(1500));
boolean r2 = s.abheben(new Geldbetrag(1500));
boolean r3 = s.abheben(new Geldbetrag(600));`,
      columns: ['Rückgabe', 'Kontostand', 'schonAbgehoben'],
      rows: [
        { label: 'nach `r1`', values: ['true', ['3500.0', '3500'], ['0.0', '0']] },
        { label: 'nach `r2`', values: ['true', ['2000.0', '2000'], ['1500.0', '1500']] },
        { label: 'nach `r3`', values: ['false', ['2000.0', '2000'], ['1500.0', '1500']] }
      ],
      explain: 'r1: letzte ist null → Reset nach dem Addieren, schonAbgehoben fällt von 1500 auf 0. r2: 0 + 1500 ≤ 2000 → erlaubt, gleicher Monat, kein Reset: 1500. Insgesamt sind schon 3000 € abgehoben! r3: 1500 + 600 > 2000 → abgelehnt. (Mit dem Original-Vorlesungscode in Java nachgerechnet.)' },

    { id: 'K00-S04-F16', sec: 'spar', type: 'trace', t: 'Trace: korrigierte Version',
      prompt: 'Korrigierte Version (Reset VOR der Prüfung). Sparbuch mit 5000 €. Der Kalender liefert erst den 05.10.2026, vor dem dritten Aufruf den 02.11.2026.',
      code: `boolean r1 = s.abheben(new Geldbetrag(1500)); // 05.10.
boolean r2 = s.abheben(new Geldbetrag(1500)); // 05.10.
boolean r3 = s.abheben(new Geldbetrag(600));  // 02.11.
boolean r4 = s.abheben(new Geldbetrag(1500)); // 02.11.`,
      columns: ['Rückgabe', 'Kontostand', 'schonAbgehoben'],
      rows: [
        { label: 'nach `r1`', values: ['true', ['3500.0', '3500'], ['1500.0', '1500']] },
        { label: 'nach `r2`', values: ['false', ['3500.0', '3500'], ['1500.0', '1500']] },
        { label: 'nach `r3`', values: ['true', ['2900.0', '2900'], ['600.0', '600']] },
        { label: 'nach `r4`', values: ['false', ['2900.0', '2900'], ['600.0', '600']] }
      ],
      explain: 'r2 scheitert, weil 1500 + 1500 > 2000. Am 02.11. ist ein neuer Monat, also Reset auf 0, dann 600 → erlaubt. r4: 600 + 1500 = 2100 > 2000 → abgelehnt. Bei einer abgelehnten Abhebung ändert sich nichts. (In Java mit der korrigierten Methode nachgerechnet.)' },

    { id: 'K00-S04-F17', sec: 'spar', type: 'fill', t: 'Kalender-Ersatz im Test',
      prompt: 'Für Tests braucht man einen Kalender mit festem Datum. Vervollständige die anonyme Unterklasse.',
      code: `Kalender oktober = new Kalender() {
    @Override
    public LocalDate [[0]]() {
        return LocalDate.[[1]](2026, 10, 5);
    }
};
Sparbuch s = new Sparbuch(kunde, 1, [[2]]);`,
      blanks: [
        { options: ['getHeutigesDatum', 'now', 'getDatum'], answer: 0, why: 'Überschrieben wird die Methode, die Sparbuch aufruft: `getHeutigesDatum()`. @Override meldet einen Fehler, wenn der Name nicht stimmt.' },
        { options: ['of', 'parse', 'now'], answer: 0, why: '`LocalDate.of(Jahr, Monat, Tag)` erzeugt ein festes Datum. `now()` wäre wieder das echte Datum, der Test wäre dann vom Kalendertag abhängig.' },
        { options: ['oktober', 'new Kalender()', 'null'], answer: 0, why: 'Das Sparbuch muss den Ersatz bekommen, sonst fragt es den echten Kalender.' }
      ],
      explain: 'Deshalb gibt es die Klasse Kalender überhaupt: Das „heutige Datum“ wird austauschbar, und ein Monatswechsel lässt sich im Test simulieren. Später im Semester geht das eleganter mit Mocking (Mockito).' },

    /* ---------- JUnit ---------- */
    { id: 'K00-S04-F18', sec: 'junit', type: 'mc', t: 'Grün aus dem falschen Grund',
      prompt: 'Dieser Test soll prüfen, dass höchstens 2000 € pro Monat abgehoben werden können. Er ist grün. Warum ist er trotzdem wertlos?',
      code: `@Test
void testMonatslimit() throws GesperrtException {
    Sparbuch s = new Sparbuch(kunde, 1, oktober);
    assertFalse(s.abheben(new Geldbetrag(2500)));
}`,
      options: [
        'Er ist nicht wertlos, 2500 > 2000.',
        'Das Konto ist leer: Die Abhebung scheitert schon am Mindestkontostand von 0,50 €. Der Test wäre auch ohne jedes Monatslimit grün.',
        'assertFalse prüft nur Exceptions.',
        'Weil throws GesperrtException im Test verboten ist.'
      ],
      answer: 1,
      explain: 'Ein Test muss so gebaut sein, dass genau die zu prüfende Regel den Ausschlag gibt. Erst `s.einzahlen(new Geldbetrag(5000))`, dann sind 2500 € vom Kontostand her möglich und nur das Monatslimit verbietet sie. Faustregel: Würde der Test auch gegen eine fehlerhafte Implementierung grün sein?' },

    { id: 'K00-S04-F19', sec: 'junit', type: 'fill', t: 'assertThrows',
      prompt: 'Vervollständige den Test: Eine negative Abhebung soll eine IllegalArgumentException werfen.',
      code: `@Test
void testNegativerBetrag() {
    Sparbuch s = new Sparbuch(kunde, 1, oktober);
    [[0]](IllegalArgumentException.[[1]],
            [[2]] s.abheben(new Geldbetrag(-1)));
}`,
      blanks: [
        { options: ['assertThrows', 'assertFalse', 'assertEquals'], answer: 0, why: '`assertThrows` ist grün genau dann, wenn der übergebene Code diese Exception (oder eine Unterklasse) wirft.' },
        { options: ['class', 'getClass()', 'new'], answer: 0, why: 'Gebraucht wird das Class-Objekt des Exception-Typs: `IllegalArgumentException.class`.' },
        { options: ['() ->', 'new', 'return'], answer: 0, why: 'Ein Lambda ohne Parameter. Der Code wird nicht sofort ausgeführt, sondern erst innerhalb von assertThrows, das die Exception dann auffängt. Ohne Lambda würde die Exception schon beim Auswerten der Argumente fliegen und der Test rot werden.' }
      ],
      explain: 'Weil abheben `throws GesperrtException` deklariert, darf das Lambda das auch: assertThrows nimmt ein `Executable`, dessen `execute()` beliebige Throwables werfen darf. Deshalb braucht die Testmethode hier kein `throws`.' },

    { id: 'K00-S04-F20', sec: 'junit', type: 'order', t: 'Arrange – Act – Assert',
      prompt: 'Bringe den Aufbau eines Tests in die richtige Reihenfolge.',
      items: [
        'Arrange: Objekte erzeugen und in den Ausgangszustand bringen (Sparbuch, Kalender, einzahlen)',
        'Act: genau die zu testende Methode aufrufen (`abheben`)',
        'Assert: Ergebnis und Zustand prüfen (Rückgabe, Kontostand)'
      ],
      explain: 'Ein Test, ein Verhalten. Liegen mehrere Acts in einem Test, weiß man bei Rot nicht, welcher schuld ist.' },

    { id: 'K00-S04-F21', sec: 'junit', type: 'mc', t: '„not accessible“',
      prompt: 'Eclipse meldet bei `import org.junit.jupiter.api.Test;` „The type org.junit.jupiter.api.Test is not accessible“. Was ist die übliche Ursache im Kurs?',
      options: [
        'JUnit ist veraltet.',
        'Das Projekt hat eine `module-info.java`. Damit ist es ein Modul, und JUnit liegt nicht in den deklarierten Abhängigkeiten. Lösung: module-info.java löschen und JUnit 5 auf den Classpath (nicht Modulepath) legen.',
        'Die Testklasse ist nicht public.',
        'Man braucht IntelliJ statt Eclipse.'
      ],
      answer: 1,
      explain: 'Eclipse legt beim Anlegen eines Projekts oft eine module-info.java an. Ein Modul sieht nur, was es mit `requires` anfordert. Für die Übungen brauchen wir keine Module.' },

    { id: 'K00-S04-F22', sec: 'junit', type: 'multi', t: 'Gute Testfälle für abheben',
      prompt: 'Welche Testfälle sind für das Monatslimit des Sparbuchs sinnvoll? (Kontostand jeweils ausreichend)',
      options: [
        'Genau 2000 € in einem Monat → erlaubt (Grenzfall).',
        '2000,01 € in einem Monat → abgelehnt.',
        '1500 € im Oktober, 1500 € im November → beide erlaubt.',
        '1500 € am 31.10.2026, 1500 € am 31.10.2027 → beide erlaubt (gleicher Monat, anderes Jahr).',
        'abheben 1000-mal mit 1 € in einer Schleife, damit es „gründlich“ ist.'
      ],
      answer: [0, 1, 2, 3],
      explain: 'Grenzwerte (genau am Limit, knapp darüber), Monatswechsel und der Jahreswechsel mit gleichem Monat (deshalb prüft die Methode auch `getYear()`). Eine Schleife mit 1000 Aufrufen testet nichts Zusätzliches und macht Fehler schwer zu lokalisieren.' },

    /* ---------- Code-Review ---------- */
    { id: 'K00-S04-F23', sec: 'rev', type: 'review', t: 'Review einer Vektor-Klasse',
      prompt: 'Ein Kommilitone gibt diese Vektor-Klasse ab. Welche Befunde treffen zu?',
      code: `package Mathematik;

public class Vektor {
    double x, y;

    public Vektor(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getWinkel() {
        return Math.toDegrees(Math.atan(y / x));
    }

    public void addieren(Vektor v) {
        x = x + v.x;
        y = y + v.y;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Vektor v && x == v.x && y == v.y;
    }
}`,
      findings: [
        { text: 'Der Packagename verstößt gegen die Namenskonvention.', correct: true, why: 'Packages nur in Kleinbuchstaben: `mathematik`.' },
        { text: 'Die Attribute müssten `private` sein.', correct: true, why: 'Ohne Modifier sind sie package-private, jede Klasse im Package kann sie ändern.' },
        { text: '`getWinkel()` liefert für (−1, −1) 45° statt 225°.', correct: true, why: 'atan kennt den Quadranten nicht, richtig ist `Math.atan2(y, x)`.' },
        { text: '`getWinkel()` wirft für (0, 0) eine ArithmeticException.', correct: false, why: 'Bei double gibt es keine ArithmeticException: 0.0/0.0 ist NaN, und die Methode liefert still NaN zurück. Das ist ein Fehler, aber nicht dieser.' },
        { text: '`addieren` verändert this; besser einen neuen Vektor zurückgeben.', correct: true, why: 'So bleiben Vektoren unveränderlich und Konstanten wie NULL sicher.' },
        { text: 'equals ist überschrieben, hashCode nicht.', correct: true, why: 'Vertrag verletzt: Gleiche Vektoren landen in einem HashSet in verschiedenen Fächern.' },
        { text: 'Pattern-instanceof in equals kompiliert erst ab Java 25.', correct: false, why: 'Pattern Matching für instanceof gibt es seit Java 16.' },
        { text: 'Der Konstruktor lässt NaN und Infinity als Koordinaten zu.', correct: true, why: 'Ungültige Werte gehören abgelehnt: `if (!Double.isFinite(x) || !Double.isFinite(y)) throw new IllegalArgumentException(...)`.' },
        { text: 'Es fehlt JavaDoc für Klasse, Konstruktor und öffentliche Methoden.', correct: true, why: 'Qualitätsregel: JavaDoc für alles mit mehr als private Sichtbarkeit (außer Tests).' }
      ],
      explain: 'Sieben der neun Befunde treffen zu. Gerade die zwei falschen sind typische Prüfungsfallen: double kennt keine Division-durch-0-Exception, und Pattern-instanceof ist längst Standard.' },

    { id: 'K00-S04-F24', sec: 'rev', type: 'explain', t: 'Warum IllegalStateException?',
      prompt: 'Erkläre, warum `orthogonalerEinheitsvektor()` beim Nullvektor eine IllegalStateException wirft und keine IllegalArgumentException.',
      code: `public Vektor orthogonalerEinheitsvektor() {
    if (this.betrag == 0)
        throw new IllegalStateException("Der Nullvektor hat keinen orthogonalen Einheitsvektor");
    return new Vektor(this.y / this.betrag, -this.x / this.betrag);
}`,
      model: `Die Methode hat keinen Parameter, es gibt also kein Argument, das ungültig sein könnte. Das Problem ist der Zustand des Objekts selbst: this ist der Nullvektor, und für ihn ist die Operation nicht definiert (er hat keine Richtung, und man müsste durch den Betrag 0 teilen). Genau dafür ist IllegalStateException da: „Die Methode passt nicht zum aktuellen Zustand des Objekts.“ IllegalArgumentException heißt dagegen: „Du hast mir einen ungültigen Wert übergeben.“` }
  ]
});
