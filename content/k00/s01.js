/* Kapitel 00 · Serie S01: Training Woche 1
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben, sonst geht der Fortschritt verloren. */
P3.serie({
  "id": "K00-S01",
  "kapitel": "K00",
  "titel": "Training Woche 1",
  "beschreibung": "Qualitätsregeln, Referenzen, Exceptions, UML, Testen, Fehler finden und Erklären.",
  "themen": [
    {
      "id": "grund",
      "name": "Grundlagen und Qualitätsregeln"
    },
    {
      "id": "ref",
      "name": "Referenzen und Ausgabe"
    },
    {
      "id": "exc",
      "name": "Exceptions"
    },
    {
      "id": "uml",
      "name": "UML-Klassendiagramme"
    },
    {
      "id": "test",
      "name": "Testen"
    },
    {
      "id": "bug",
      "name": "Fehler finden"
    },
    {
      "id": "erk",
      "name": "Code erklären"
    }
  ],
  "fragen": [
    {
      "id": "K00-S01-F01",
      "sec": "grund",
      "type": "mc",
      "t": "Sichtbarkeit von Attributen",
      "prompt": "Welcher Sichtbarkeitsmodifizierer wird für Instanz-Attribute verwendet?",
      "options": [
        "immer public",
        "manchmal private, manchmal protected",
        "immer private",
        "gar keiner",
        "Das hängt vom Attribut ab."
      ],
      "answer": 2,
      "explain": "Hubrichs Qualitätsregel: Attribute macht man grundsätzlich `private`. Die einzige Ausnahme sind statische Konstanten, und die sind keine Instanz-Attribute. Unterklassen greifen über geschützte Methoden wie `#setKontostand(...)` zu, nicht direkt aufs Attribut."
    },
    {
      "id": "K00-S01-F02",
      "sec": "grund",
      "type": "multi",
      "t": "JavaDoc-Pflicht",
      "prompt": "Welche Elemente brauchen laut Hubrichs Qualitätsregel zwingend einen JavaDoc-Kommentar?",
      "options": [
        "`public class Konto`",
        "`public static final int MAX_KONTEN`",
        "`public double getKontostand()`",
        "`private double kontostand`",
        "`@Test void testEinzahlen()` in KontoTest",
        "`protected void setKontostand(double kontostand)`"
      ],
      "answer": [
        0,
        1,
        2,
        5
      ],
      "explain": "Pflicht ist JavaDoc für alles im Produktivcode mit mehr als `private` Sichtbarkeit: Klassen, statische Konstanten, Konstruktoren und jede Methode, ausdrücklich auch Getter und Setter. `protected` ist mehr als private, also Pflicht. Private Elemente wären „eigentlich auch“ gut, sind aber keine Pflicht. Tests sind ausgenommen."
    },
    {
      "id": "K00-S01-F03",
      "sec": "grund",
      "type": "multi",
      "t": "Namenskonventionen",
      "prompt": "Welche Namen entsprechen den Namenskonventionen?",
      "options": [
        "`package bankprojekt;`",
        "`class UngueltigerBetrag extends Exception`",
        "`public static final double ZINS_SATZ`",
        "`private double KontoStand;`",
        "`class GirokontoTest`",
        "`public boolean getGesperrt()`"
      ],
      "answer": [
        0,
        2,
        4
      ],
      "explain": "Exception-Klassen enden auf „Exception“, also `UngueltigerBetragException`. Attribute beginnen klein: `kontoStand`. Bei boolean heißt der Getter `isGesperrt()`. Packages: klein, ein Wort. Statische Konstanten: GROSS_MIT_UNTERSTRICH. Testklassen: Klassenname + Test."
    },
    {
      "id": "K00-S01-F04",
      "sec": "grund",
      "type": "mc",
      "t": "Getter bei boolean",
      "prompt": "Eine Klasse hat das Attribut `private boolean gesperrt;`. Welches Getter/Setter-Paar entspricht den Konventionen?",
      "options": [
        "`getGesperrt()` und `setGesperrt(boolean gesperrt)`",
        "`isGesperrt()` und `setGesperrt(boolean gesperrt)`",
        "`isGesperrt()` und `isSetGesperrt(boolean gesperrt)`",
        "`gesperrt()` und `gesperrt(boolean gesperrt)`"
      ],
      "answer": 1,
      "explain": "Sonderregel für boolean: Der Getter beginnt mit `is`. Der Setter bleibt `set…`. Der Name dahinter ist bei beiden gleich und beginnt mit einem Großbuchstaben."
    },
    {
      "id": "K00-S01-F05",
      "sec": "grund",
      "type": "mc",
      "t": "Property-Name",
      "prompt": "Wahr oder falsch? Der Name hinter get/set muss mit dem Namen des Attributs übereinstimmen.",
      "options": [
        "Wahr",
        "Falsch"
      ],
      "answer": 1,
      "explain": "Falsch. Getter und Setter müssen untereinander übereinstimmen, aber nicht mit dem Attributnamen. Es muss nicht einmal ein einzelnes Attribut dahinterstehen: `getName()` kann aus Vor- und Nachname berechnet werden."
    },
    {
      "id": "K00-S01-F06",
      "sec": "grund",
      "type": "mc",
      "t": "Direkte Initialisierung",
      "prompt": "Was ist der Unterschied zwischen `private Datentyp attribut = einWert;` und der Initialisierung desselben Attributs im Konstruktor?",
      "options": [
        "gar keiner",
        "Die direkte Initialisierung passiert sofort, die im Konstruktor erst bei der Objekterzeugung.",
        "Die direkte Initialisierung ist nur bei primitiven Datentypen erlaubt.",
        "Bei der direkten Initialisierung sind nur konstante Werte erlaubt, keine Berechnungen."
      ],
      "answer": 0,
      "explain": "Der Compiler kopiert die direkte Initialisierung an den Anfang jedes Konstruktors. Beide passieren also bei `new`. Objekte wie `= new Object()` und Berechnungen sind direkt ebenfalls erlaubt."
    },
    {
      "id": "K00-S01-F07",
      "sec": "grund",
      "type": "mc",
      "t": "Anweisung vor this(...)",
      "prompt": "Kompiliert dieser Konstruktor mit Java 25?",
      "code": "public Kunde(String vorname, String nachname, LocalDate geb) {\n    if (geb == null) {\n        throw new IllegalArgumentException(\"Geburtstag fehlt\");\n    }\n    this(vorname, nachname, \"unbekannt\", geb);\n}",
      "options": [
        "Ja: Anweisungen vor `this(...)` sind ab Java 25 erlaubt, solange sie nicht auf das entstehende Objekt zugreifen.",
        "Nein: `this(...)` muss immer die erste Anweisung sein.",
        "Nein: Vor `this(...)` darf keine Exception geworfen werden.",
        "Ja, und das ging schon in allen Java-Versionen."
      ],
      "answer": 0,
      "explain": "Seit Java 25 („Flexible Constructor Bodies“) dürfen vor `this(...)` bzw. `super(...)` Anweisungen stehen, zum Beispiel Parameterprüfungen. Verboten bleibt der Zugriff auf das entstehende Objekt. Bis Java 24 musste `this(...)` die erste Anweisung sein."
    },
    {
      "id": "K00-S01-F08",
      "sec": "grund",
      "type": "mc",
      "t": "Instanzmethode vor this(...)",
      "prompt": "Und dieser Konstruktor? (`normalisieren` ist eine private Instanzmethode von Kunde.)",
      "code": "public Kunde(String vorname, String nachname) {\n    String n = this.normalisieren(nachname);\n    this(vorname, n, \"unbekannt\", null);\n}",
      "options": [
        "Kompiliert ab Java 25.",
        "Kompiliert nicht: Vor `this(...)` darf keine Instanzmethode aufgerufen werden, weil das Objekt noch nicht fertig erzeugt ist.",
        "Kompiliert, weil `normalisieren` private ist.",
        "Kompiliert nicht, weil lokale Variablen vor `this(...)` verboten sind."
      ],
      "answer": 1,
      "explain": "Vor `this(...)` ist jeder Zugriff auf das Objekt verboten: kein `this.attribut`, keine Instanzmethoden. Eine statische Hilfsmethode `normalisieren(String)` wäre erlaubt. Lokale Variablen sind seit Java 25 erlaubt."
    },
    {
      "id": "K00-S01-F09",
      "sec": "grund",
      "type": "mc",
      "t": "Statischer Block",
      "prompt": "Wann wird ein statischer Block `static { … }` ausgeführt?",
      "options": [
        "bei jedem `new`",
        "genau einmal, wenn die Klasse geladen wird",
        "bei jedem Aufruf einer statischen Methode",
        "nur, wenn die Klasse eine main-Methode hat"
      ],
      "answer": 1,
      "explain": "Der statische Block (statischer Initialisierer) läuft einmal beim Laden der Klasse, vor ihrer ersten Verwendung. Typisch: statische Attribute initialisieren."
    },
    {
      "id": "K00-S01-F10",
      "sec": "grund",
      "type": "mc",
      "t": "Qualifizierter Name",
      "prompt": "Die Datei Konto.java beginnt mit `package bank;`. Wie lautet der qualifizierte Name der Klasse?",
      "options": [
        "`Konto`",
        "`bank.Konto`",
        "`bank/Konto.java`",
        "`Konto.bank`"
      ],
      "answer": 1,
      "explain": "Qualifizierter Name = Paketname + Punkt + Klassenname. Er macht gleichnamige Klassen eindeutig, etwa `java.util.Date` und `java.sql.Date`."
    },
    {
      "id": "K00-S01-F11",
      "sec": "grund",
      "type": "mc",
      "t": "Liskov",
      "prompt": "In Konto ist `abheben` dokumentiert mit `@throws IllegalArgumentException wenn betrag negativ ist`. Girokonto überschreibt `abheben` und wirft zusätzlich eine `IllegalStateException`, wenn das Konto gesperrt ist. Bewertung?",
      "options": [
        "In Ordnung, weil `IllegalStateException` unchecked ist.",
        "Verstoß gegen das Liskovsche Substitutionsprinzip: eine zusätzliche Exception, die die Dokumentation der Oberklasse nicht abdeckt.",
        "In Ordnung, solange Girokonto sie mit `@throws` dokumentiert.",
        "Kompiliert nicht."
      ],
      "answer": 1,
      "explain": "Ein Girokonto muss überall funktionieren, wo ein Konto erwartet wird, und wer mit Konto arbeitet, verlässt sich auf dessen Doku. Zusätzliche oder andere Exceptions sind verboten, egal ob checked oder unchecked. Erlaubt sind nur speziellere Exceptions. Kompilieren würde der Code übrigens, weil die Exception unchecked ist."
    },
    {
      "id": "K00-S01-F12",
      "sec": "grund",
      "type": "mc",
      "t": "Down-Cast",
      "prompt": "Du hast `Konto k` und willst `Girokonto g = (Girokonto) k;` schreiben. Was verlangt die Qualitätsregel?",
      "options": [
        "Nichts, der Compiler prüft den Cast.",
        "Den Cast möglichst vermeiden; falls er wirklich nötig ist, vorher mit `instanceof` prüfen, sonst droht eine `ClassCastException`.",
        "Den Cast in `try-catch (ClassCastException e)` packen und im catch nichts tun.",
        "Überall `Girokonto` statt `Konto` als Typ verwenden."
      ],
      "answer": 1,
      "explain": "Datentypen so allgemein wie möglich, so konkret wie nötig. Bringt ein Cast einen echten Vorteil, vorher sicherstellen, dass er möglich ist. Ein leerer catch-Block versteckt den Fehler nur."
    },
    {
      "id": "K00-S01-F13",
      "sec": "grund",
      "type": "mc",
      "t": "Ein-/Ausgabe trennen",
      "prompt": "Wo darf laut Qualitätsregel `System.out.println(...)` stehen?",
      "options": [
        "In `Konto.einzahlen`, als Bestätigung für den Benutzer.",
        "Nur in Klassen, die mit dem Benutzer kommunizieren, nie in Klassen der Verarbeitungsschicht.",
        "Überall, solange es in einem catch-Block steht.",
        "Nirgends."
      ],
      "answer": 1,
      "explain": "Eine Klasse, die rechnet, gibt nichts aus; eine Klasse, die mit dem Benutzer redet, rechnet nicht. Konto ist Verarbeitung, also kein println."
    },
    {
      "id": "K00-S01-F14",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Zwei Variablen, ein Konto",
      "prompt": "Welche Ausgabe erwartest du? Neue Konten haben den Kontostand `Geldbetrag.NULL_EURO`.",
      "code": "// kunde sei ein vorhandenes Kunde-Objekt\nGirokonto k1 = new Girokonto(kunde, 1, new Geldbetrag(500));\nGirokonto k2 = new Girokonto(kunde, 2, new Geldbetrag(500));\nk2 = k1;\nk1.einzahlen(new Geldbetrag(50));\nk2.einzahlen(new Geldbetrag(30));\nSystem.out.println(k1.getKontostand().getBetrag());",
      "options": [
        "50.0",
        "30.0",
        "80.0",
        "0.0"
      ],
      "answer": 2,
      "explain": "`k2 = k1` kopiert die Referenz, nicht das Konto. Danach zeigen beide Variablen auf dasselbe Objekt, das zweite Girokonto ist nicht mehr erreichbar. Beide Einzahlungen landen im selben Objekt: 50 + 30 = 80.0."
    },
    {
      "id": "K00-S01-F15",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Unveränderliches LocalDate",
      "prompt": "Welche Ausgabe erwartest du?",
      "code": "LocalDate d = LocalDate.of(2026, 10, 5);\nd.plusDays(1);\nSystem.out.println(d);",
      "options": [
        "2026-10-05",
        "2026-10-06",
        "null",
        "Kompilierfehler"
      ],
      "answer": 0,
      "explain": "`LocalDate` ist unveränderlich. `plusDays(1)` liefert ein neues Objekt, das hier weggeworfen wird. Richtig wäre `d = d.plusDays(1);`. Dasselbe Muster gilt für `Geldbetrag.plus(...)` im Bankprojekt."
    },
    {
      "id": "K00-S01-F16",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Primitive Kopie",
      "prompt": "Welche Ausgabe erwartest du?",
      "code": "int a = 5;\nint b = a;\na++;\nSystem.out.println(a + \" \" + b);",
      "options": [
        "6 6",
        "6 5",
        "5 5",
        "5 6"
      ],
      "answer": 1,
      "explain": "Bei primitiven Typen kopiert `=` den Wert. `b` hat eine eigene 5 und bleibt unberührt, wenn `a` später erhöht wird."
    },
    {
      "id": "K00-S01-F17",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Vergleich mit ==",
      "prompt": "Welche Ausgabe erwartest du?",
      "code": "Konto a = new Girokonto(kunde, 1, new Geldbetrag(500));\nKonto b = new Girokonto(kunde, 1, new Geldbetrag(500));\nSystem.out.println(a == b);",
      "options": [
        "true",
        "false",
        "Kompilierfehler, weil Konto abstrakt ist"
      ],
      "answer": 1,
      "explain": "`==` vergleicht bei Objekten die Referenzen. Zweimal `new` bedeutet zwei verschiedene Objekte, also `false`, auch bei gleichem Inhalt. Konto ist abstrakt, als Variablentyp aber erlaubt; erzeugt wird ein Girokonto."
    },
    {
      "id": "K00-S01-F18",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "finally und return",
      "prompt": "Welche Ausgabe erwartest du?",
      "code": "static int test() {\n    try {\n        throw new IllegalStateException(\"x\");\n    } catch (RuntimeException e) {\n        System.out.print(\"A\");\n        return 1;\n    } finally {\n        System.out.print(\"B\");\n    }\n}\n\npublic static void main(String[] args) {\n    System.out.print(test());\n}",
      "options": [
        "A1",
        "AB1",
        "A1B",
        "B1"
      ],
      "answer": 1,
      "explain": "IllegalStateException ist eine RuntimeException und wird gefangen: „A“. Vor dem Verlassen der Methode läuft `finally`: „B“. Erst dann kommt der Rückgabewert 1 in main an und wird ausgegeben."
    },
    {
      "id": "K00-S01-F19",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Parameter auf null setzen",
      "prompt": "Welche Ausgabe erwartest du?",
      "code": "static void leeren(Girokonto k) {\n    k = null;\n}\n\npublic static void main(String[] args) {\n    Girokonto g = new Girokonto(kunde, 1, new Geldbetrag(500));\n    g.einzahlen(new Geldbetrag(20));\n    leeren(g);\n    System.out.println(g.getKontostand().getBetrag());\n}",
      "options": [
        "20.0",
        "0.0",
        "NullPointerException",
        "null"
      ],
      "answer": 0,
      "explain": "Java übergibt eine Kopie der Referenz. `k = null` ändert nur die lokale Kopie in `leeren`; `g` zeigt weiter auf das Konto mit 20.0. Hätte `leeren` dagegen `k.abheben(new Geldbetrag(20))` aufgerufen, wäre das Objekt selbst verändert worden."
    },
    {
      "id": "K00-S01-F20",
      "sec": "exc",
      "type": "multi",
      "t": "Checked Exceptions",
      "prompt": "Welche dieser Exceptions sind checked?",
      "options": [
        "`IOException`",
        "`IllegalArgumentException`",
        "`NullPointerException`",
        "`FileNotFoundException`",
        "`ClassCastException`"
      ],
      "answer": [
        0,
        3
      ],
      "explain": "Checked ist, was von Exception erbt, aber nicht von RuntimeException. `FileNotFoundException` erbt von `IOException` und ist deshalb ebenfalls checked, obwohl sie nicht direkt von Exception erbt. Die anderen drei sind RuntimeExceptions."
    },
    {
      "id": "K00-S01-F21",
      "sec": "exc",
      "type": "mc",
      "t": "Fehlendes throws",
      "prompt": "Was passiert beim Kompilieren?",
      "code": "public void laden(String pfad) {\n    if (pfad.isBlank()) {\n        throw new IOException(\"Kein Pfad\");\n    }\n    // ...\n}",
      "options": [
        "Kompiliert ohne Probleme.",
        "Kompilierfehler: `IOException` ist checked und wird weder gefangen noch mit `throws` angekündigt.",
        "Kompiliert, wirft aber zur Laufzeit eine NullPointerException.",
        "Kompilierfehler, weil `throw` nur in try-Blöcken stehen darf."
      ],
      "answer": 1,
      "explain": "Bei checked Exceptions erzwingt der Compiler try-catch oder throws. Hier fehlt `throws IOException` (plus `@throws` im JavaDoc). Fachlich passt eher eine `IllegalArgumentException`, denn ein leerer Pfad ist ein ungültiger Parameter."
    },
    {
      "id": "K00-S01-F22",
      "sec": "exc",
      "type": "mc",
      "t": "checked vs. unchecked",
      "prompt": "Der Unterschied zwischen checked und unchecked Exceptions besteht …",
      "options": [
        "nur zur Laufzeit: unchecked Exceptions brechen das Programm nicht ab.",
        "nur zur Kompilierzeit: Der Compiler verlangt bei checked Exceptions eine Behandlung.",
        "zur Kompilier- und zur Laufzeit.",
        "darin, dass unchecked Exceptions nicht gefangen werden können."
      ],
      "answer": 1,
      "explain": "Zur Laufzeit verhalten sich beide gleich: Sie fliegen, bis jemand sie fängt. Unchecked Exceptions lassen sich genauso fangen."
    },
    {
      "id": "K00-S01-F23",
      "sec": "exc",
      "type": "mc",
      "t": "Wann werfen?",
      "prompt": "Wann sollte eine Methode eine Exception werfen?",
      "options": [
        "Wenn sie den Benutzer über einen Fehler informieren will.",
        "Wenn sie ihre Aufgabe in der vorliegenden Situation nicht erledigen kann.",
        "Immer, wenn ein if-Zweig ungewöhnlich ist.",
        "Nur in main."
      ],
      "answer": 1,
      "explain": "Exceptions sind Kommunikation zwischen Methoden, nicht mit dem Benutzer. Kann die Methode das Problem im Rahmen ihrer Aufgabe lösen, behebt sie es selbst; sonst wirft sie."
    },
    {
      "id": "K00-S01-F24",
      "sec": "exc",
      "type": "mc",
      "t": "Exception-Unsinn 4",
      "prompt": "Was ist das Hauptproblem dieses Codes?",
      "code": "/**\n * @throws RuntimeException wenn etwas schief geht\n */\npublic void methode() {\n    try {\n        fehleranfaelligeAnweisung();\n    } catch (FileNotFoundException e) {\n        throw new RuntimeException();\n    }\n}",
      "options": [
        "Man darf `FileNotFoundException` nicht fangen.",
        "Alle Informationen der ursprünglichen Exception (Typ, Nachricht, Ursache) gehen für den Aufrufer verloren.",
        "RuntimeExceptions muss man nicht dokumentieren.",
        "Der try-Block ist zu kurz."
      ],
      "answer": 1,
      "explain": "Hubrichs „Exception-Unsinn 4“: Der Aufrufer bekommt eine nackte RuntimeException ohne jeden Hinweis auf die Ursache. „Wenn etwas schief geht“ ist außerdem keine echte Dokumentation. RuntimeExceptions müssen bei ihr sehr wohl dokumentiert werden."
    },
    {
      "id": "K00-S01-F25",
      "sec": "uml",
      "type": "mc",
      "t": "{readOnly}",
      "prompt": "UML: `-nummer: long {readOnly}`. Welche Java-Deklaration passt?",
      "options": [
        "`public long nummer;`",
        "`private final long nummer;`",
        "`private static long nummer;`",
        "`private long nummer;` ohne Setter"
      ],
      "answer": 1,
      "explain": "`-` = private, `{readOnly}` = final. Nur keinen Setter anzubieten reicht nicht: Intern könnte das Attribut dann trotzdem geändert werden."
    },
    {
      "id": "K00-S01-F26",
      "sec": "uml",
      "type": "mc",
      "t": "{leaf}",
      "prompt": "Was bedeutet `{leaf}` hinter einer Methode?",
      "options": [
        "Die Methode ist abstrakt.",
        "Die Methode ist nicht überschreibbar, also `final`.",
        "Die Methode ist static.",
        "Die Methode hat keine Parameter."
      ],
      "answer": 1,
      "explain": "`{leaf}` = final. Nicht verwechseln: `{abstract}` muss überschrieben werden, `{query}` ändert nichts an this."
    },
    {
      "id": "K00-S01-F27",
      "sec": "uml",
      "type": "mc",
      "t": "Gestrichelt mit Dreieck",
      "prompt": "Eine gestrichelte Linie mit leerem Dreieck führt von Kunde zu Comparable. Was bedeutet das?",
      "options": [
        "`Kunde extends Comparable`",
        "`Kunde implements Comparable`",
        "Kunde benutzt Comparable kurzfristig (`<<use>>`)",
        "Kunde hat ein Attribut vom Typ Comparable"
      ],
      "answer": 1,
      "explain": "Durchgezogen + leeres Dreieck = Vererbung (extends). Gestrichelt + leeres Dreieck = Interface realisieren (implements). Gestrichelt mit offener Spitze und `<<use>>` = kurzfristige Abhängigkeit."
    },
    {
      "id": "K00-S01-F28",
      "sec": "uml",
      "type": "mc",
      "t": "Assoziation umsetzen",
      "prompt": "Ein Pfeil führt von Bank zu Konto, beschriftet mit `-kontenliste`, am Konto-Ende steht `*`. Welche Umsetzung passt?",
      "options": [
        "In Bank: `private Konto kontenliste;`",
        "In Bank: `private Set<Konto> kontenliste;`",
        "In Konto: `private Bank kontenliste;`",
        "In Bank: `public Set<Konto> kontenliste;`"
      ],
      "answer": 1,
      "explain": "Pfeilrichtung = Navigierbarkeit: Die Bank kennt ihre Konten, also steht das Attribut in Bank. `*` = beliebig viele, also eine Collection (Set, List, Map) oder ein Array. `-` = private."
    },
    {
      "id": "K00-S01-F29",
      "sec": "uml",
      "type": "mc",
      "t": "Unterstrichen",
      "prompt": "Was bedeutet es, wenn ein Attribut oder eine Methode im Klassendiagramm unterstrichen ist?",
      "options": [
        "abstrakt",
        "static",
        "final",
        "besonders wichtig"
      ],
      "answer": 1,
      "explain": "Statische Mitglieder werden unterstrichen, zum Beispiel `+MUSTERMANN: Kunde` oder `+getAnrede(): String`."
    },
    {
      "id": "K00-S01-F30",
      "sec": "uml",
      "type": "mc",
      "t": "Abgeleitetes Attribut",
      "prompt": "Was bedeutet der Schrägstrich in `+/name: String`?",
      "options": [
        "Das Attribut ist optional.",
        "Das Attribut ist abgeleitet, also aus anderen Werten berechenbar.",
        "Das Attribut ist ein Dateipfad.",
        "Das Attribut ist veraltet."
      ],
      "answer": 1,
      "explain": "Abgeleitete Attribute tauchen oft in der Planungsphase auf. Im Code gibt es dafür oft kein Attribut, nur eine Methode wie `getName()`, die Nachname und Vorname zusammensetzt."
    },
    {
      "id": "K00-S01-F31",
      "sec": "uml",
      "type": "mc",
      "t": "Attribut und Linie",
      "prompt": "Konto hat im Diagramm das Attribut `-inhaber: Kunde` und zusätzlich eine Linie `-inhaber` zu Kunde. Bewertung?",
      "options": [
        "Vorbildlich, die Information ist doppelt abgesichert.",
        "Schlecht: Die Beziehung ist doppelt angegeben. Für Klassen des Projekts nur die Linie zeichnen.",
        "Schlecht: Nur das Attribut zeichnen, die Linie weglassen.",
        "Egal, beides ist gleichwertig."
      ],
      "answer": 1,
      "explain": "Faustregel: primitive Typen und allseits bekannte Klassen als Attribut, Klassen des eigenen Projekts als Beziehung. Beides gleichzeitig steht auf ihrer „Ganz schlecht!“-Folie."
    },
    {
      "id": "K00-S01-F32",
      "sec": "uml",
      "type": "mc",
      "t": "{unique}",
      "prompt": "Ein Attribut ist mit `{unique}` gekennzeichnet. Was heißt das für die Implementierung?",
      "options": [
        "Java sorgt automatisch für Eindeutigkeit.",
        "Die Eindeutigkeit muss im eigenen Code sichergestellt werden.",
        "Das Attribut muss static sein.",
        "Das Attribut muss final sein."
      ],
      "answer": 1,
      "explain": "Für unique gibt es kein Java-Schlüsselwort. Man setzt es selbst um, etwa durch eine zentrale Vergabe der Kontonummern in der Bank."
    },
    {
      "id": "K00-S01-F33",
      "sec": "uml",
      "type": "mc",
      "t": "Beidseitige Navigierbarkeit",
      "prompt": "Eine Assoziation hat an keinem Ende eine Pfeilspitze (beidseitig navigierbar). Was bedeutet das im Code?",
      "options": [
        "Nichts, das ist reine Optik.",
        "Beide Klassen brauchen ein Attribut aufeinander, und Änderungen müssen in beiden Objekten synchron bleiben. Oft ein Zeichen für schlechten Entwurf.",
        "Nur die linke Klasse bekommt ein Attribut.",
        "Man braucht zwingend eine Assoziationsklasse."
      ],
      "answer": 1,
      "explain": "Jede Änderung zieht eine Änderung im Partnerobjekt nach sich. Manchmal nötig, aber oft vermeidbar."
    },
    {
      "id": "K00-S01-F34",
      "sec": "uml",
      "type": "mc",
      "t": "<<utility>>",
      "prompt": "Was bedeutet der Stereotyp `<<utility>>` vor einem Klassennamen?",
      "options": [
        "Die Klasse ist abstrakt.",
        "Die Klasse hat ausschließlich statische Methoden und Eigenschaften.",
        "Die Klasse bildet ein Ding aus der realen Welt ab.",
        "Die Klasse ist ein Interface."
      ],
      "answer": 1,
      "explain": "utility = Hilfsklasse nur mit statischen Mitgliedern, wie `Math`. Ein Ding aus der realen Welt wäre `<<focus>>`."
    },
    {
      "id": "K00-S01-F35",
      "sec": "test",
      "type": "mc",
      "t": "Erfolgreicher Testfall",
      "prompt": "Wann ist ein Testfall laut Vorlesung erfolgreich?",
      "options": [
        "Wenn er grün ist.",
        "Wenn er einen bisher unbekannten Fehler entdeckt.",
        "Wenn er jede Zeile des Codes ausführt.",
        "Wenn er in unter einer Sekunde läuft."
      ],
      "answer": 1,
      "explain": "„Verkehrte Welt“: Ziel des Testens ist es, Fehler zu finden. Deshalb die Frage: „Wie kriege ich das am besten kaputt?“"
    },
    {
      "id": "K00-S01-F36",
      "sec": "test",
      "type": "mc",
      "t": "Fehlerfreiheit beweisen",
      "prompt": "Wahr oder falsch? Mit genügend Unit-Tests kann man beweisen, dass eine Klasse fehlerfrei ist.",
      "options": [
        "Wahr",
        "Falsch"
      ],
      "answer": 1,
      "explain": "Tests können nur zeigen, dass Fehler da sind, nie beweisen, dass keine da sind."
    },
    {
      "id": "K00-S01-F37",
      "sec": "test",
      "type": "mc",
      "t": "Unit vs. Integration",
      "prompt": "Beim Testen von Konto wird das Kunde-Objekt durch ein simuliertes Objekt ersetzt. Um welche Testart geht es?",
      "options": [
        "Integrationstest",
        "Unit-Test",
        "Abnahmetest",
        "Lasttest"
      ],
      "answer": 1,
      "explain": "Der Unit-Test prüft eine Unit möglichst isoliert; andere Units werden simuliert (später: Mocking). Der Integrationstest prüft die echte Zusammenarbeit. Unit-Tests sind Whitebox-Tests."
    },
    {
      "id": "K00-S01-F38",
      "sec": "test",
      "type": "mc",
      "t": "Gute Testwerte",
      "prompt": "Die Doku von `setAlter(int alter)` sagt: gültig sind 0 bis 150, sonst `IllegalArgumentException`. Welche Testwerte decken die Faustregeln am besten ab?",
      "options": [
        "30, 45, 60",
        "0 und 150",
        "30, 0, 150, -1, 151, `Integer.MIN_VALUE`, `Integer.MAX_VALUE`",
        "-1 und 151"
      ],
      "answer": 2,
      "explain": "Normale Werte (30), Grenzen laut Doku (0, 150), falsche Werte direkt daneben (-1, 151) und die Grenzen des Datentyps. „Verlassen Sie Ihren Wohlfühlbereich.“"
    },
    {
      "id": "K00-S01-F39",
      "sec": "test",
      "type": "mc",
      "t": "Was nicht prüfen",
      "prompt": "Was solltest du laut Faustregel NICHT prüfen?",
      "options": [
        "den Rückgabewert",
        "die Attribute, die sich ändern sollen",
        "ob die Methode etwas tut, was sie nicht tun soll",
        "Verhalten, das die Dokumentation gar nicht zusagt"
      ],
      "answer": 3,
      "explain": "„Prüfen Sie nicht mehr, als die Dokumentation aussagt!“ Sonst testest du Implementierungsdetails, und der Test bricht bei jeder erlaubten Änderung."
    },
    {
      "id": "K00-S01-F40",
      "sec": "bug",
      "type": "bug",
      "t": "Konto-Klasse",
      "prompt": "Markiere die 3 Zeilen, in denen gegen Hubrichs Regeln verstoßen wird. Fehlendes JavaDoc zählt hier nicht.",
      "code": "public class Konto {\n    public double kontostand;\n    private final long nummer;\n\n    public Konto(long nummer) {\n        this.nummer = nummer;\n    }\n\n    public void abheben(double betrag) {\n        if (betrag < 0) {\n            System.out.println(\"Ungültiger Betrag!\");\n        }\n        kontostand = kontostand - betrag;\n    }\n\n    public long getnummer() {\n        return nummer;\n    }\n}",
      "required": [
        2,
        11,
        16
      ],
      "extra": [
        13
      ],
      "explain": "Zeile 2: Attribute sind immer private. Zeile 11: println in einer Verarbeitungsklasse, und statt eine Exception zu werfen läuft der Code weiter. Folge in Zeile 13: Ein negativer Betrag wird abgezogen, das Konto bekommt Geld geschenkt (Zeile 13 gilt deshalb auch). Richtig wäre `throw new IllegalArgumentException(...)`. Zeile 16: Der Getter heißt `getNummer()`."
    },
    {
      "id": "K00-S01-F41",
      "sec": "bug",
      "type": "bug",
      "t": "Datei laden",
      "prompt": "Markiere die 3 problematischen Zeilen.",
      "code": "/**\n * liest die Datei\n * @throws IOException wenn etwas schiefgeht\n */\npublic void laden(String pfad) throws IOException {\n    try {\n        Files.readAllLines(Path.of(pfad));\n    } catch (IOException e) {\n        e.printStackTrace();\n    }\n}",
      "required": [
        5,
        7,
        9
      ],
      "extra": [
        3
      ],
      "explain": "Zeile 5 (samt `@throws` in Zeile 3): Die IOException wird gefangen und kommt nie nach außen. Angekündigt wird nur, was wirklich rauskommt („Exception-Unsinn 2“). Zeile 7: Das Ergebnis von `readAllLines` wird weggeworfen, die Methode lädt also nichts. Zeile 9: Eine Ausgabe ist keine Fehlerbehebung („Exception-Unsinn 5“), der Aufrufer erfährt nichts."
    },
    {
      "id": "K00-S01-F42",
      "sec": "bug",
      "type": "bug",
      "t": "Bank einlesen",
      "prompt": "Aus der Vorgabe für Übung 10, leicht gekürzt: Markiere die 2 Fehler.",
      "code": "/**\n * liest ein Bank-Objekt aus quelle\n * @return das gelesene Bank-Objekt\n * @throws NullPointerException wenn ziel null ist\n */\npublic static Bank einlesen(InputStream quelle) {\n    Bank bankCopy;\n    try {\n        ObjectInputStream in = new ObjectInputStream(quelle);\n        bankCopy = (Bank) in.readObject();\n    } catch (IOException | ClassNotFoundException _) {\n        bankCopy = new Bank(0);\n    }\n    return bankCopy;\n}",
      "required": [
        4,
        12
      ],
      "extra": [
        3,
        11
      ],
      "explain": "Zeile 4: Copy & Paste aus `speichern`; der Parameter heißt `quelle`, nicht `ziel`. Zeile 12: Der Fehler wird verschluckt, der Aufrufer bekommt still eine leere Bank und hält sie für seine Daten (Zeile 3 verschweigt das sogar). Der Cast in Zeile 10 ist hier unvermeidbar, weil `readObject` nur Object liefert. `_` ist eine unbenannte Variable (ab Java 22)."
    },
    {
      "id": "K00-S01-F43",
      "sec": "bug",
      "type": "bug",
      "t": "Wertloser Test",
      "prompt": "Markiere die Zeile, die diesen Test wertlos macht. (Vereinfachtes Sparbuch mit `double`-Kontostand und `berechneZinsen()`.)",
      "code": "@Test\nvoid testZinsen() {\n    Sparbuch s = new Sparbuch(kunde, 1);\n    s.einzahlen(1000);\n    double erwartet = s.getKontostand() * s.getZinssatz() / 100;\n    assertEquals(erwartet, s.berechneZinsen());\n}",
      "required": [
        5
      ],
      "extra": [],
      "explain": "Die Formel ist aus dem Code kopiert. Ist sie dort falsch, rechnet der Test denselben Fehler und bleibt grün. Richtig: das Ergebnis selbst ausrechnen, etwa `assertEquals(30.0, s.berechneZinsen());` bei 3 % Zinsen."
    },
    {
      "id": "K00-S01-F44",
      "sec": "erk",
      "type": "explain",
      "t": "static einlesen",
      "prompt": "Warum ist `einlesen` static, `speichern` aber nicht?",
      "code": "public void speichern(OutputStream ziel) throws IOException { ... }\npublic static Bank einlesen(InputStream quelle) { ... }",
      "model": "`speichern` arbeitet mit einem existierenden Objekt und schreibt `this` in den Stream; Aufruf: `bank1.speichern(out)`. `einlesen` soll ein Bank-Objekt erst erzeugen. Vorher gibt es kein Objekt, auf dem man eine Instanzmethode aufrufen könnte, also Aufruf über die Klasse: `Bank.einlesen(in)`, ähnlich einer Fabrikmethode."
    },
    {
      "id": "K00-S01-F45",
      "sec": "erk",
      "type": "explain",
      "t": "Variable ≠ Objekt",
      "prompt": "Erkläre den Satz „Variable ≠ Objekt“ am Beispiel `Girokonto k2 = k1;`.",
      "model": "Eine Variable eines Klassentyps enthält nur eine Referenz auf ein Objekt im Speicher. `k2 = k1` kopiert diese Referenz; es entsteht kein neues Objekt. Beide Variablen zeigen auf dasselbe Girokonto, Änderungen über k1 sind über k2 sichtbar. Ein neues Objekt entsteht nur mit `new`."
    },
    {
      "id": "K00-S01-F46",
      "sec": "erk",
      "type": "explain",
      "t": "try-with-resources",
      "prompt": "Erkläre, was dieser Code macht, warum kein catch nötig ist und welche Nebenwirkung das Schließen hat.",
      "code": "public void speichern(OutputStream ziel) throws IOException {\n    try (ObjectOutputStream out = new ObjectOutputStream(ziel)) {\n        out.writeObject(this);\n    }\n}",
      "model": "try-with-resources: Der Stream in den runden Klammern wird am Ende automatisch geschlossen, auch bei einer Exception. Ein catch ist nicht nötig, weil die Methode das Problem nicht selbst lösen kann und die IOException per `throws` an den Aufrufer weitergibt. Nebenwirkung: Das Schließen des ObjectOutputStream schließt auch den darunterliegenden Stream `ziel`. Ein zweites `speichern` in denselben Stream scheitert dann."
    },
    {
      "id": "K00-S01-F47",
      "sec": "erk",
      "type": "explain",
      "t": "Formel im Test",
      "prompt": "Warum soll man im Test keine Formeln aus dem zu testenden Code kopieren?",
      "model": "Ist die Formel im Code falsch, berechnet der Test denselben falschen Wert. Erwartung und Ergebnis stimmen überein, der Test bleibt grün und der Fehler unentdeckt. Der Test vergleicht den Code nur mit sich selbst. Besser: das Ergebnis selbst ausrechnen, möglichst auf einem anderen Weg."
    },
    {
      "id": "K00-S01-F48",
      "sec": "erk",
      "type": "explain",
      "t": "plus ohne Zuweisung",
      "prompt": "`Geldbetrag` ist unveränderlich. Erkläre, warum diese Methode nicht funktioniert und wie man sie korrigiert.",
      "code": "public void einzahlen(Geldbetrag betrag) {\n    getKontostand().plus(betrag);\n}",
      "model": "`plus` verändert das vorhandene Objekt nicht, sondern liefert einen neuen Geldbetrag. Der wird hier weggeworfen, der Kontostand bleibt gleich, und der Compiler meldet nichts. Korrektur: `setKontostand(getKontostand().plus(betrag));`, über den Setter, damit dessen Prüfung greift. Außerdem fehlen die Prüfung auf ungültige Beträge (null, negativ) und das JavaDoc."
    }
  ]
});
