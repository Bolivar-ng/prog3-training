/* Kapitel 00 · Serie S02: Test Grundlagen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben, sonst geht der Fortschritt verloren. */
P3.serie({
  "id": "K00-S02",
  "kapitel": "K00",
  "titel": "Test Grundlagen",
  "beschreibung": "Großer Grundlagentest: Qualitätsregeln, Namen und JavaDoc, Bankprojekt, Unveränderlichkeit, Entscheidungsdiagramm, Exception-Unsinn, Liskov.",
  "themen": [
    {
      "id": "q",
      "name": "Qualitätsregeln"
    },
    {
      "id": "n",
      "name": "Namen und JavaDoc"
    },
    {
      "id": "bp",
      "name": "Bankprojekt lesen"
    },
    {
      "id": "ref",
      "name": "Referenzen und Unveränderlichkeit"
    },
    {
      "id": "exc",
      "name": "Exceptions und Entscheidungsdiagramm"
    },
    {
      "id": "uns",
      "name": "Exception-Unsinn erkennen"
    },
    {
      "id": "lsp",
      "name": "Liskov"
    },
    {
      "id": "bug",
      "name": "Fehler finden"
    },
    {
      "id": "erk",
      "name": "Erklären"
    }
  ],
  "fragen": [
    {
      "id": "K00-S02-F01",
      "sec": "q",
      "type": "multi",
      "t": "Schnittstelle ändern",
      "prompt": "Eine Klasse ist bereits veröffentlicht und wird von anderem Code benutzt. Welche Änderungen sind laut Qualitätsregel erlaubt?",
      "options": [
        "eine neue public Methode ergänzen",
        "einen zusätzlichen Konstruktor ergänzen",
        "einer public Methode einen Parameter hinzufügen",
        "eine public Methode umbenennen",
        "die Klasse in ein anderes Package verschieben",
        "ein neues private Attribut ergänzen",
        "`getKontostand()` liefert ab jetzt Cent statt Euro"
      ],
      "answer": [
        0,
        1,
        5
      ],
      "explain": "Ergänzen ist erlaubt. Verboten sind Umbenennen, Verschieben, Löschen, geänderte Parameter und Bedeutungsänderungen. Der Cent-Fall ist besonders gemein: Die Signatur bleibt gleich, aber jeder Aufrufer rechnet plötzlich falsch."
    },
    {
      "id": "K00-S02-F02",
      "sec": "q",
      "type": "mc",
      "t": "Konstruktor ruft Konstruktor",
      "prompt": "Welche Qualitätsregel setzt dieser Konstruktor aus `Konto` um?",
      "code": "public Konto() {\n    this(Kunde.MUSTERMANN, 1234567);\n}",
      "options": [
        "Vermeiden Sie Copy & Paste (Aufruf eines vorhandenen Konstruktors).",
        "Attribute macht man grundsätzlich private.",
        "Trennen Sie Verarbeitung von Ein-/Ausgabe.",
        "Vermeiden Sie Down-Casts."
      ],
      "answer": 0,
      "explain": "Statt die Prüfungen (inhaber nicht null, gültige Kontonummer) zu kopieren, ruft der Standard-Konstruktor den vollständigen Konstruktor auf. Alle Prüfungen stehen an einer Stelle."
    },
    {
      "id": "K00-S02-F03",
      "sec": "q",
      "type": "mc",
      "t": "Standardwerte von Attributen",
      "prompt": "Ein Konstruktor setzt diese drei Attribute nicht. Welche Werte haben sie nach `new`?",
      "code": "private boolean gesperrt;\nprivate Geldbetrag kontostand;\nprivate int anzahlBuchungen;",
      "options": [
        "`false`, `null`, `0`",
        "`false`, `0.0`, `0`",
        "`true`, `null`, `0`",
        "Kompilierfehler, weil sie nicht initialisiert sind"
      ],
      "answer": 0,
      "explain": "Attribute bekommen automatisch Standardwerte: false, null, 0. Genau davor warnt die Regel „Denken Sie an die Initialisierung“: `kontostand` wäre `null`, und das erste `einzahlen` würde abstürzen."
    },
    {
      "id": "K00-S02-F04",
      "sec": "q",
      "type": "mc",
      "t": "Lokale Variable",
      "prompt": "Und was passiert hier?",
      "code": "public void zaehlen() {\n    int summe;\n    summe++;\n}",
      "options": [
        "`summe` ist 1.",
        "Kompilierfehler: lokale Variable ist nicht initialisiert.",
        "`summe` ist 0, weil 0 der Standardwert ist.",
        "NullPointerException zur Laufzeit."
      ],
      "answer": 1,
      "explain": "Standardwerte gibt es nur für Attribute, nicht für lokale Variablen. Eine lokale Variable muss vor dem ersten Lesen einen Wert bekommen, sonst verweigert der Compiler die Übersetzung."
    },
    {
      "id": "K00-S02-F05",
      "sec": "q",
      "type": "mc",
      "t": "Ein-/Ausgabe trennen",
      "prompt": "Welche Methode aus `Konto` verstößt gegen „Trennen Sie Verarbeitung von Ein-/Ausgabe“?",
      "options": [
        "`toString()`",
        "`ausgebenAufDerKonsole()`",
        "`getKontonummerFormatiert()`",
        "`getIban(long blz)`"
      ],
      "answer": 1,
      "explain": "`toString()` und die Formatierungsmethoden liefern nur einen String zurück; der Aufrufer entscheidet, was damit passiert. `ausgebenAufDerKonsole()` schreibt selbst mit `System.out.println` auf die Konsole, und das in einer Verarbeitungsklasse."
    },
    {
      "id": "K00-S02-F06",
      "sec": "q",
      "type": "mc",
      "t": "Allgemeiner Datentyp",
      "prompt": "Eine Methode soll die Summe der Kontostände beliebiger Konten berechnen. Welcher Parametertyp ist am besten?",
      "options": [
        "`ArrayList<Girokonto>`",
        "`List<Konto>`",
        "`Object`",
        "`ArrayList<Object>`"
      ],
      "answer": 1,
      "explain": "„So allgemein wie möglich, so konkret wie nötig.“ `Konto` reicht, weil jedes Konto `getKontostand()` hat, und `List` statt `ArrayList`, weil die konkrete Listenart egal ist. `Object` wäre zu allgemein und würde Down-Casts erzwingen."
    },
    {
      "id": "K00-S02-F07",
      "sec": "q",
      "type": "mc",
      "t": "Einheitliche Fehlerbehandlung",
      "prompt": "In Konto wirft `setInhaber(null)` eine NullPointerException, `setKontostand(null)` ignoriert den Aufruf stillschweigend. Welche Regel wird dadurch in Frage gestellt?",
      "options": [
        "Attribute macht man grundsätzlich private.",
        "In der gleichen Fehlersituation sollen alle Methoden einer Klasse gleichartig reagieren.",
        "Vermeiden Sie Down-Casts.",
        "Ändern Sie die Schnittstelle nicht nachträglich."
      ],
      "answer": 1,
      "explain": "Gleicher Fehler (null übergeben), unterschiedliche Reaktion. Das ist genau die Frage, die du in der Übung stellen kannst."
    },
    {
      "id": "K00-S02-F08",
      "sec": "q",
      "type": "mc",
      "t": "JavaDoc bei Tests",
      "prompt": "Wahr oder falsch? Für Testklassen gilt die JavaDoc-Pflicht genauso wie für Produktivcode.",
      "options": [
        "Wahr",
        "Falsch"
      ],
      "answer": 1,
      "explain": "Die Regel gilt ausdrücklich für den Produktivcode: „Das heißt: gilt nicht für Tests!“"
    },
    {
      "id": "K00-S02-F09",
      "sec": "n",
      "type": "multi",
      "t": "Namen prüfen",
      "prompt": "Welche Namen entsprechen den Konventionen?",
      "options": [
        "Package `bankprojekt.basisdaten`",
        "Package `Bank_Projekt`",
        "Methode `berechneZinsen()`",
        "statische Konstante `MAX_DISPO`",
        "lokale Variable `Kontonummer`",
        "Exception-Klasse `KontoGesperrt`"
      ],
      "answer": [
        0,
        2,
        3
      ],
      "explain": "Packages klein und ohne Sonderzeichen. Variablen und Methoden lowerCamelCase, also `kontonummer`. Exception-Klassen enden auf „Exception“: `KontoGesperrtException`."
    },
    {
      "id": "K00-S02-F10",
      "sec": "n",
      "type": "mc",
      "t": "Getter-Name ≠ Attribut",
      "prompt": "Das Attribut heißt `private final long nummer;`, der Getter im Bankprojekt aber `getKontonummer()`. Ist das erlaubt?",
      "options": [
        "Nein, der Getter muss `getNummer()` heißen.",
        "Ja, die Übereinstimmung mit dem Attributnamen ist nicht erforderlich.",
        "Nur, wenn es keinen Setter gibt.",
        "Nur bei final-Attributen."
      ],
      "answer": 1,
      "explain": "Übereinstimmen müssen nur get/is und set untereinander. Der Name hinter get beschreibt die Eigenschaft nach außen, nicht das interne Attribut."
    },
    {
      "id": "K00-S02-F11",
      "sec": "n",
      "type": "mc",
      "t": "{@return …}",
      "prompt": "Was bewirkt `{@return aktueller Kontostand}` im JavaDoc von `getKontostand()`?",
      "options": [
        "Es ist Java-Code, der den Kontostand zurückgibt.",
        "Eine Kurzform: erzeugt den Beschreibungssatz und den @return-Eintrag gleichzeitig.",
        "Der Kommentar wird vom JavaDoc-Werkzeug ignoriert.",
        "Es markiert die Methode als {query}."
      ],
      "answer": 1,
      "explain": "Die Inline-Form spart bei einfachen Gettern doppeltes Schreiben. Sie steht trotzdem in einem Kommentar und ist kein ausführbarer Code."
    },
    {
      "id": "K00-S02-F12",
      "sec": "n",
      "type": "mc",
      "t": "JavaDoc beim Überschreiben",
      "prompt": "`Sparbuch` überschreibt `abheben` aus `Konto`. Braucht die überschriebene Methode zwingend einen neuen JavaDoc-Kommentar?",
      "options": [
        "Ja, jede Methode braucht ihren eigenen Kommentar.",
        "Nein, der Kommentar der Oberklasse wird geerbt.",
        "Nur, wenn die Methode public ist.",
        "Nein, überschriebene Methoden dürfen keine Kommentare haben."
      ],
      "answer": 1,
      "explain": "Laut Folie wird der JavaDoc-Kommentar „geerbt“, neu schreiben ist nicht zwingend. Inhaltlich muss die Methode ihn wegen Liskov sowieso erfüllen."
    },
    {
      "id": "K00-S02-F13",
      "sec": "n",
      "type": "mc",
      "t": "RuntimeException dokumentieren",
      "prompt": "Eine Methode kann eine `NullPointerException` werfen. Muss das dokumentiert werden?",
      "options": [
        "Nein, RuntimeExceptions werden nie dokumentiert.",
        "Ja, mit @throws, auch RuntimeExceptions.",
        "Nur in der Signatur mit throws.",
        "Nur, wenn die Exception selbst geworfen wird."
      ],
      "answer": 1,
      "explain": "„Deshalb muss jede eventuell geworfene Exception immer mit @throws dokumentiert werden. Das gilt auch für RuntimeExceptions!“ In die Signatur muss sie dagegen nicht."
    },
    {
      "id": "K00-S02-F14",
      "sec": "n",
      "type": "mc",
      "t": "Name der Testklasse",
      "prompt": "Wie heißt die Testklasse für `Geldbetrag`?",
      "options": [
        "`TestGeldbetrag`",
        "`GeldbetragTest`",
        "`Geldbetrag_Test`",
        "`GeldbetragTests`"
      ],
      "answer": 1,
      "explain": "Name der zu testenden Klasse + Endung „Test“."
    },
    {
      "id": "K00-S02-F15",
      "sec": "bp",
      "type": "mc",
      "t": "inhaber = null",
      "prompt": "Der Konto-Konstruktor (über eine Unterklasse) wird mit `inhaber = null` aufgerufen. Was passiert?",
      "code": "public Konto(Kunde inhaber, long kontonummer) {\n    if(inhaber == null)\n        throw new NullPointerException(\"Inhaber darf nicht null sein!\");\n    if(kontonummer < 0 || kontonummer > 9_999_999_999L)\n        throw new UngueltigeKontonummerException();\n    this.inhaber = inhaber;\n    this.nummer = kontonummer;\n    this.kontostand = Geldbetrag.NULL_EURO;\n    this.gesperrt = false;\n}",
      "options": [
        "Es entsteht ein Konto ohne Inhaber.",
        "NullPointerException mit Nachricht, es entsteht kein Objekt.",
        "Kunde.MUSTERMANN wird automatisch eingesetzt.",
        "UngueltigeKontonummerException."
      ],
      "answer": 1,
      "explain": "Erst prüfen, dann zuweisen. Fliegt die Exception, wird der Konstruktor abgebrochen und es gibt kein Konto mit ungültigem Zustand."
    },
    {
      "id": "K00-S02-F16",
      "sec": "bp",
      "type": "mc",
      "t": "9_999_999_999L",
      "prompt": "Warum steht in der Prüfung `9_999_999_999L`?",
      "options": [
        "Die Unterstriche sind ein Tippfehler.",
        "L macht die Zahl zum long, weil sie für int zu groß ist; die Unterstriche dienen nur der Lesbarkeit.",
        "L bedeutet „Limit“.",
        "Die Unterstriche trennen Bankleitzahl und Kontonummer."
      ],
      "answer": 1,
      "explain": "int reicht nur bis etwa 2,1 Milliarden. Ohne L wäre das Literal ein int und würde nicht kompilieren. Unterstriche in Zahlen ignoriert der Compiler."
    },
    {
      "id": "K00-S02-F17",
      "sec": "bp",
      "type": "mc",
      "t": "Kein throws trotz Exception",
      "prompt": "Der Konstruktor kann `UngueltigeKontonummerException` werfen. Warum steht kein `throws UngueltigeKontonummerException` in der Signatur?",
      "options": [
        "Vergessen, das ist ein Fehler.",
        "Sie erbt von RuntimeException, ist also unchecked; der Compiler verlangt kein throws. Dokumentiert ist sie trotzdem mit @throws.",
        "Konstruktoren dürfen kein throws haben.",
        "Weil sie nur bei negativen Nummern geworfen wird."
      ],
      "answer": 1,
      "explain": "Unchecked: kein throws nötig. Hubrichs Regel verlangt aber @throws im JavaDoc, und das steht im Bankprojekt auch drin."
    },
    {
      "id": "K00-S02-F18",
      "sec": "bp",
      "type": "mc",
      "t": "Sicherer Cast in equals",
      "prompt": "Warum kann der Cast in `equals` keine ClassCastException auslösen?",
      "code": "public boolean equals(Object other) {\n    if(this == other)\n        return true;\n    if(other == null)\n        return false;\n    if(this.getClass() != other.getClass())\n        return false;\n    if(this.nummer == ((Konto)other).nummer)\n        return true;\n    else\n        return false;\n}",
      "options": [
        "Weil Konto abstrakt ist.",
        "Weil vorher mit getClass() geprüft wird, dass other dieselbe Klasse hat.",
        "Weil equals immer ein Object bekommt.",
        "Er kann eine auslösen, das ist ein Fehler."
      ],
      "answer": 1,
      "explain": "Genau so verlangt es die Qualitätsregel: Wenn ein Down-Cast nötig ist, vorher sicherstellen, dass er möglich ist."
    },
    {
      "id": "K00-S02-F19",
      "sec": "bp",
      "type": "mc",
      "t": "einzahlen(null)",
      "prompt": "Was passiert bei `konto.einzahlen(null)`?",
      "code": "/**\n * @throws IllegalArgumentException wenn betrag negativ ist\n * @throws NullPointerException wenn betrag null ist\n */\npublic void einzahlen(Geldbetrag betrag) {\n    if(betrag.isNegativ())\n        throw new IllegalArgumentException(\"Falscher Betrag\");\n    setKontostand(betrag.plus(this.getKontostand()));\n}",
      "options": [
        "Nichts, der Kontostand bleibt gleich.",
        "NullPointerException bei `betrag.isNegativ()`, wie dokumentiert.",
        "IllegalArgumentException.",
        "Kompilierfehler."
      ],
      "answer": 1,
      "explain": "Ein Methodenaufruf auf null wirft automatisch eine NullPointerException. Weil sie dokumentiert ist, ist das gewolltes Verhalten."
    },
    {
      "id": "K00-S02-F20",
      "sec": "bp",
      "type": "mc",
      "t": "abstract abheben",
      "prompt": "Warum ist `abheben` in `Konto` abstrakt?",
      "options": [
        "Weil Konto keine Attribute hat.",
        "Weil jede Kontoart eigene Abheberegeln hat (Dispo, Sparbuch-Grenzen), die Konto nicht allgemein umsetzen kann.",
        "Weil abstrakte Methoden schneller sind.",
        "Weil abheben eine Exception wirft."
      ],
      "answer": 1,
      "explain": "Konto legt mit der Doku nur den Vertrag fest. Wie abgehoben wird, entscheidet jede Unterklasse selbst."
    },
    {
      "id": "K00-S02-F21",
      "sec": "bp",
      "type": "mc",
      "t": "new Konto()",
      "prompt": "Kompiliert `Konto k = new Konto();`?",
      "options": [
        "Ja, es gibt ja einen Konstruktor ohne Parameter.",
        "Nein, von einer abstrakten Klasse kann man keine Objekte erzeugen. Ihre Konstruktoren werden nur von Unterklassen aufgerufen.",
        "Ja, aber abheben wirft dann eine Exception.",
        "Nur in derselben Package."
      ],
      "answer": 1,
      "explain": "`Konto k = new Girokonto();` geht dagegen: Variablentyp abstrakt, Objekt konkret. Der Konstruktor `Konto()` läuft dabei über die super-Kette mit."
    },
    {
      "id": "K00-S02-F22",
      "sec": "bp",
      "type": "mc",
      "t": "getIban mit falscher BLZ",
      "prompt": "`getIban(long blz)` liefert bei ungültiger BLZ einen leeren String. Was ist daran diskutabel?",
      "options": [
        "Nichts, das ist ideal.",
        "Andere Methoden der Klasse reagieren auf ungültige Parameter mit Exceptions, getIban mit einem Sonderwert. Das ist nicht einheitlich.",
        "Ein leerer String kann nicht zurückgegeben werden.",
        "getIban müsste static sein."
      ],
      "answer": 1,
      "explain": "Der Konstruktor wirft bei ungültiger Kontonummer eine Exception, getIban liefert \"\". Das fällt wieder unter „in der gleichen Fehlersituation gleichartig reagieren“. Immerhin ist das Verhalten dokumentiert."
    },
    {
      "id": "K00-S02-F23",
      "sec": "bp",
      "type": "mc",
      "t": "Prüfung nach super(...)",
      "prompt": "So sieht der Girokonto-Konstruktor aus. Was erlaubt Java 25 hier zusätzlich?",
      "code": "public Girokonto(Kunde inhaber, long kontonummer, Geldbetrag dispo) {\n    super(inhaber, kontonummer);\n    if(dispo.isNegativ())\n        throw new IllegalArgumentException(\"Der Dispo ist nicht gültig!\");\n    this.dispo = dispo;\n}",
      "options": [
        "Nichts, super(...) muss immer zuerst stehen.",
        "Die Prüfung von dispo vor super(...) zu schreiben, weil sie nicht auf das entstehende Objekt zugreift.",
        "Das Attribut dispo vor super(...) mit this.getDispo() zu lesen.",
        "super(...) ganz wegzulassen."
      ],
      "answer": 1,
      "explain": "Seit Java 25 dürfen Anweisungen vor super(...) stehen, solange sie das Objekt nicht anfassen. Die Prüfung eines Parameters gehört genau dazu. Vorteil: Ein ungültiger Dispo wird erkannt, bevor der Konto-Teil überhaupt aufgebaut wird."
    },
    {
      "id": "K00-S02-F24",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Gemeinsames NULL_EURO",
      "prompt": "Zwei frisch erzeugte Girokonten. Was wird ausgegeben?",
      "code": "Konto a = new Girokonto(kunde, 1, new Geldbetrag(100));\nKonto b = new Girokonto(kunde, 2, new Geldbetrag(100));\nSystem.out.println(a.getKontostand() == b.getKontostand());",
      "options": [
        "true",
        "false",
        "Kompilierfehler"
      ],
      "answer": 0,
      "explain": "Beide Konstruktoren setzen `kontostand = Geldbetrag.NULL_EURO`. Das ist eine einzige statische Konstante, also zeigen beide Attribute auf dasselbe Objekt, und `==` liefert true."
    },
    {
      "id": "K00-S02-F25",
      "sec": "ref",
      "type": "mc",
      "t": "Warum Teilen ungefährlich ist",
      "prompt": "Alle neuen Konten referenzieren dasselbe NULL_EURO-Objekt. Warum ist das ungefährlich?",
      "options": [
        "Weil es static ist.",
        "Weil Geldbetrag unveränderlich ist: Niemand kann das gemeinsame Objekt ändern, Rechenmethoden liefern neue Objekte.",
        "Weil Java Objekte bei jeder Zuweisung kopiert.",
        "Es ist gefährlich, das ist ein Fehler."
      ],
      "answer": 1,
      "explain": "`betrag` ist private final, und plus/minus/mal erzeugen neue Objekte. Wäre Geldbetrag veränderbar, würde eine Einzahlung auf Konto A den Kontostand aller neuen Konten mitändern."
    },
    {
      "id": "K00-S02-F26",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "plus erzeugt Neues",
      "prompt": "Was wird ausgegeben?",
      "code": "Geldbetrag g = new Geldbetrag(10);\nGeldbetrag h = g.plus(new Geldbetrag(5));\nSystem.out.println(g.getBetrag() + \" \" + h.getBetrag());",
      "options": [
        "15.0 15.0",
        "10.0 15.0",
        "10.0 10.0",
        "15.0 10.0"
      ],
      "answer": 1,
      "explain": "`plus` lässt g unverändert und liefert ein neues Objekt mit 15.0, das in h landet."
    },
    {
      "id": "K00-S02-F27",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "== vs. equals",
      "prompt": "Was wird ausgegeben? (`Geldbetrag.equals` vergleicht die Beträge.)",
      "code": "Geldbetrag x = new Geldbetrag(5);\nGeldbetrag y = new Geldbetrag(5);\nSystem.out.println((x == y) + \" \" + x.equals(y));",
      "options": [
        "true true",
        "false true",
        "false false",
        "true false"
      ],
      "answer": 1,
      "explain": "`==` vergleicht Referenzen: zwei new, zwei Objekte, also false. `equals` vergleicht den Inhalt: beide 5, also true."
    },
    {
      "id": "K00-S02-F28",
      "sec": "ref",
      "type": "mc",
      "kind": "Ausgabe vorhersagen",
      "t": "Statischer Zähler",
      "prompt": "Was wird ausgegeben?",
      "code": "public class Zaehler {\n    private static int anzahl = 0;\n\n    public Zaehler() {\n        anzahl++;\n    }\n\n    public static int getAnzahl() {\n        return anzahl;\n    }\n}\n\n// in main:\nnew Zaehler();\nnew Zaehler();\nZaehler z = new Zaehler();\nSystem.out.println(Zaehler.getAnzahl());",
      "options": [
        "1",
        "3",
        "0",
        "Kompilierfehler, weil die ersten beiden Objekte keiner Variable zugewiesen sind"
      ],
      "answer": 1,
      "explain": "Ein statisches Attribut gibt es nur einmal pro Klasse. Jeder Konstruktoraufruf erhöht denselben Zähler. Objekte ohne Variable sind erlaubt, der Konstruktor läuft trotzdem."
    },
    {
      "id": "K00-S02-F29",
      "sec": "ref",
      "type": "mc",
      "t": "Variablen und Objekte zählen",
      "prompt": "Wie viele Variablen und wie viele Kunde-Objekte gibt es am Ende?",
      "code": "Kunde a = new Kunde();\nKunde b = a;\nKunde c = new Kunde();\nb = c;",
      "options": [
        "3 Variablen, 3 Objekte",
        "3 Variablen, 2 Objekte",
        "2 Variablen, 2 Objekte",
        "3 Variablen, 1 Objekt"
      ],
      "answer": 1,
      "explain": "Nur `new` erzeugt Objekte, also zwei. Am Ende zeigt a auf Objekt 1, b und c auf Objekt 2. Variable ≠ Objekt."
    },
    {
      "id": "K00-S02-F30",
      "sec": "exc",
      "type": "mc",
      "t": "GesperrtException",
      "prompt": "`public class GesperrtException extends Exception`. Was folgt daraus für Code, der `setInhaber(...)` aufruft?",
      "options": [
        "Nichts Besonderes.",
        "Sie ist checked: Der Aufrufer muss sie fangen (try-catch) oder selbst mit throws weitergeben.",
        "Sie ist unchecked, weil sie selbst geschrieben ist.",
        "Sie kann nur in main gefangen werden."
      ],
      "answer": 1,
      "explain": "Direkt von Exception und nicht von RuntimeException geerbt, also checked. Der Compiler erzwingt die Behandlung."
    },
    {
      "id": "K00-S02-F31",
      "sec": "exc",
      "type": "mc",
      "t": "Fall A, Antwort nein",
      "prompt": "Die Methode `kontoAufloesen(Konto k)` ruft `k.abheben(...)` auf, das eine GesperrtException werfen kann. Ein gesperrtes Konto zu entsperren gehört nicht zu ihrer Aufgabe. Was tut sie laut Entscheidungsdiagramm?",
      "options": [
        "try-catch und im catch das Konto entsperren.",
        "throws GesperrtException (und @throws) – der Aufrufer muss entscheiden.",
        "try-catch mit printStackTrace.",
        "Die GesperrtException in eine RuntimeException umwandeln."
      ],
      "answer": 1,
      "explain": "Fall A (aufgerufene Methode wirft), Frage „im Rahmen der Aufgabe lösbar?“ → nein → throws. Entsperren würde etwas völlig anderes tun, als der Name verspricht."
    },
    {
      "id": "K00-S02-F32",
      "sec": "exc",
      "type": "mc",
      "t": "Fall B, Antwort nein",
      "prompt": "`abheben` stellt fest, dass der Betrag negativ ist. Was tut die Methode?",
      "options": [
        "Den Betrag ins Positive umrechnen und abheben.",
        "`throw new IllegalArgumentException(...)`; da unchecked, ist kein throws nötig, aber @throws im JavaDoc.",
        "false zurückgeben und eine Meldung ausgeben.",
        "Nichts."
      ],
      "answer": 1,
      "explain": "Fall B (Fehler selbst erkannt), lösbar? Nein: Was der Aufrufer mit einem negativen Betrag wollte, kann die Methode nicht wissen. Also throw. Genau so steht es im Bankprojekt."
    },
    {
      "id": "K00-S02-F33",
      "sec": "exc",
      "type": "mc",
      "t": "Fall B, Antwort ja",
      "prompt": "Die Doku einer Methode `setAnzeigename(String name)` legt fest: „Ist name null oder leer, wird der Nachname als Anzeigename verwendet.“ Die Methode erkennt `name == null`. Was tut sie?",
      "options": [
        "throw new NullPointerException()",
        "Im if-Block den Nachnamen als Anzeigenamen setzen, ohne Exception.",
        "throws NullPointerException in die Signatur",
        "printStackTrace()"
      ],
      "answer": 1,
      "explain": "Fall B, lösbar? Ja, die Doku macht es ausdrücklich zur Aufgabe der Methode. Also im if-Block beheben. Ob eine Lösung „im Rahmen der Aufgabe“ liegt, entscheidet die Dokumentation."
    },
    {
      "id": "K00-S02-F34",
      "sec": "exc",
      "type": "mc",
      "t": "extends Throwable",
      "prompt": "`class MeinFehler extends Throwable` – checked oder unchecked?",
      "options": [
        "checked",
        "unchecked",
        "Kompilierfehler, man darf nicht von Throwable erben"
      ],
      "answer": 0,
      "explain": "Die Folie sagt: Erben von Throwable wäre auch möglich. Unchecked sind nur RuntimeException und Error samt ihren Unterklassen. Alles andere ist checked."
    },
    {
      "id": "K00-S02-F35",
      "sec": "exc",
      "type": "mc",
      "t": "Exception für den Benutzer?",
      "prompt": "Eine Verarbeitungsmethode wirft `new IllegalArgumentException(\"Bitte geben Sie einen positiven Betrag ein!\")`. Was ist daran fragwürdig?",
      "options": [
        "Nichts.",
        "Exceptions informieren den aufrufenden Code, nicht den Benutzer. Die Formulierung für den Benutzer gehört in die Ein-/Ausgabe-Klasse.",
        "IllegalArgumentException darf keine Nachricht haben.",
        "Man darf keine Ausrufezeichen verwenden."
      ],
      "answer": 1,
      "explain": "„nicht zum Benutzer!“ steht auf der Folie. Die Nachricht sollte für Entwickler beschreiben, was schiefging. Was der Benutzer liest, entscheidet die Klasse, die mit ihm kommuniziert."
    },
    {
      "id": "K00-S02-F36",
      "sec": "exc",
      "type": "multi",
      "t": "Unchecked Exceptions",
      "prompt": "Welche Aussagen über unchecked Exceptions stimmen?",
      "options": [
        "Sie können mit try-catch gefangen werden.",
        "Sie müssen nicht in der throws-Klausel stehen.",
        "Bei Frau Hubrich müssen sie mit @throws dokumentiert werden.",
        "Zur Laufzeit verhalten sie sich anders als checked Exceptions.",
        "Sie erben (direkt oder indirekt) von RuntimeException."
      ],
      "answer": [
        0,
        1,
        2,
        4
      ],
      "explain": "Der Unterschied besteht nur zur Kompilierzeit, nicht zur Laufzeit."
    },
    {
      "id": "K00-S02-F37",
      "sec": "uns",
      "type": "mc",
      "t": "Muster A",
      "prompt": "Welches Muster steckt in diesem Code?",
      "code": "public void ueberweisen(Konto von, Konto nach, Geldbetrag b) {\n    try {\n        von.abheben(b);\n        nach.einzahlen(b);\n    } catch (GesperrtException e) {\n        throw new RuntimeException();\n    }\n}",
      "options": [
        "Unsinn 1: selbst werfen und im selben try fangen",
        "Unsinn 2: throws angekündigt, aber selbst gefangen",
        "Unsinn 3: @throws für etwas, das nicht auftreten kann",
        "Unsinn 4: Information geht durch nackte RuntimeException verloren",
        "Unsinn 5: nur Ausgabe statt Fehlerbehebung",
        "Kein Unsinn, der Code ist korrekt"
      ],
      "answer": 3,
      "explain": "Die GesperrtException wusste, welches Konto gesperrt war. Die nackte RuntimeException weiß nichts mehr. Besser: `throws GesperrtException`."
    },
    {
      "id": "K00-S02-F38",
      "sec": "uns",
      "type": "mc",
      "t": "Muster B",
      "prompt": "Welches Muster steckt in diesem Code?",
      "code": "/**\n * hebt 10 € ab\n * @throws GesperrtException wenn das Konto gesperrt ist\n */\npublic void zehnAbheben(Konto k) throws GesperrtException {\n    try {\n        k.abheben(new Geldbetrag(10));\n    } catch (GesperrtException e) {\n        k.entsperren();\n    }\n}",
      "options": [
        "Unsinn 1: selbst werfen und im selben try fangen",
        "Unsinn 2: throws angekündigt, aber selbst gefangen",
        "Unsinn 3: @throws für etwas, das nicht auftreten kann",
        "Unsinn 4: Information geht durch nackte RuntimeException verloren",
        "Unsinn 5: nur Ausgabe statt Fehlerbehebung",
        "Kein Unsinn, der Code ist korrekt"
      ],
      "answer": 1,
      "explain": "Die Exception wird gefangen und kommt nie heraus, trotzdem wird sie angekündigt. Entweder selbst auffangen oder weiterwerfen. (Ob Entsperren hier fachlich überhaupt sinnvoll ist, ist eine zweite Frage.)"
    },
    {
      "id": "K00-S02-F39",
      "sec": "uns",
      "type": "mc",
      "t": "Muster C",
      "prompt": "Welches Muster steckt in diesem Code?",
      "code": "public void einzahlen(Geldbetrag betrag) {\n    try {\n        if (betrag.isNegativ())\n            throw new IllegalArgumentException();\n        setKontostand(getKontostand().plus(betrag));\n    } catch (IllegalArgumentException e) {\n        // ignorieren\n    }\n}",
      "options": [
        "Unsinn 1: selbst werfen und im selben try fangen",
        "Unsinn 2: throws angekündigt, aber selbst gefangen",
        "Unsinn 3: @throws für etwas, das nicht auftreten kann",
        "Unsinn 4: Information geht durch nackte RuntimeException verloren",
        "Unsinn 5: nur Ausgabe statt Fehlerbehebung",
        "Kein Unsinn, der Code ist korrekt"
      ],
      "answer": 0,
      "explain": "Die Methode wirft die Exception und fängt sie sofort selbst. Niemand wird informiert, der Aufrufer glaubt, die Einzahlung habe geklappt."
    },
    {
      "id": "K00-S02-F40",
      "sec": "uns",
      "type": "mc",
      "t": "Muster D",
      "prompt": "Welches Muster steckt in diesem Code?",
      "code": "/**\n * hebt ab, falls nicht gesperrt\n * @throws GesperrtException kann nicht auftreten\n */\npublic void sicherAbheben(Konto k) throws GesperrtException {\n    if (!k.isGesperrt())\n        k.abheben(new Geldbetrag(10));\n}",
      "options": [
        "Unsinn 1: selbst werfen und im selben try fangen",
        "Unsinn 2: throws angekündigt, aber selbst gefangen",
        "Unsinn 3: @throws für etwas, das nicht auftreten kann",
        "Unsinn 4: Information geht durch nackte RuntimeException verloren",
        "Unsinn 5: nur Ausgabe statt Fehlerbehebung",
        "Kein Unsinn, der Code ist korrekt"
      ],
      "answer": 2,
      "explain": "Vorher geprüft, die Exception ist unmöglich, trotzdem müssen alle Aufrufer sie behandeln. Richtig: try-catch drumherum, catch leer mit Kommentar „kann nicht auftreten“."
    },
    {
      "id": "K00-S02-F41",
      "sec": "uns",
      "type": "mc",
      "t": "Muster E",
      "prompt": "Welches Muster steckt in diesem Code?",
      "code": "/**\n * hebt betrag von k ab\n * @param k Konto\n * @param betrag abzuhebender Betrag\n * @return true, wenn die Abhebung geklappt hat\n * @throws GesperrtException wenn k gesperrt ist\n */\npublic boolean barAuszahlen(Konto k, Geldbetrag betrag) throws GesperrtException {\n    return k.abheben(betrag);\n}",
      "options": [
        "Unsinn 1: selbst werfen und im selben try fangen",
        "Unsinn 2: throws angekündigt, aber selbst gefangen",
        "Unsinn 3: @throws für etwas, das nicht auftreten kann",
        "Unsinn 4: Information geht durch nackte RuntimeException verloren",
        "Unsinn 5: nur Ausgabe statt Fehlerbehebung",
        "Kein Unsinn, der Code ist korrekt"
      ],
      "answer": 5,
      "explain": "Die Methode kann ein gesperrtes Konto nicht reparieren, also gibt sie die Exception weiter und dokumentiert sie. Fall A, Antwort nein: genau richtig."
    },
    {
      "id": "K00-S02-F42",
      "sec": "uns",
      "type": "mc",
      "t": "Muster F",
      "prompt": "Welches Muster steckt in diesem Code?",
      "code": "public void monatsabschluss(List<Konto> konten) {\n    for (Konto k : konten) {\n        try {\n            k.abheben(new Geldbetrag(5));\n        } catch (GesperrtException e) {\n            e.printStackTrace();\n        }\n    }\n}",
      "options": [
        "Unsinn 1: selbst werfen und im selben try fangen",
        "Unsinn 2: throws angekündigt, aber selbst gefangen",
        "Unsinn 3: @throws für etwas, das nicht auftreten kann",
        "Unsinn 4: Information geht durch nackte RuntimeException verloren",
        "Unsinn 5: nur Ausgabe statt Fehlerbehebung",
        "Kein Unsinn, der Code ist korrekt"
      ],
      "answer": 4,
      "explain": "Roter Text auf der Konsole ist keine Behebung. Niemand erfährt im Programm, welche Konten nicht belastet wurden. Nebenbei: Das Ergebnis false von abheben wird auch ignoriert."
    },
    {
      "id": "K00-S02-F43",
      "sec": "lsp",
      "type": "mc",
      "t": "Dispo-Prüfung",
      "prompt": "Die Doku von `Konto.abheben` sagt: ausgezahlt wird, „wenn es nicht gesperrt ist und die speziellen Abheberegeln des jeweiligen Kontotyps die Abhebung erlauben“, sonst `false`. Girokonto lehnt mit false ab, wenn der Dispo überschritten wird. Liskov?",
      "options": [
        "Verstoß, weil Konto keinen Dispo kennt.",
        "In Ordnung: Die Dispo-Regel ist eine spezielle Abheberegel, die die Oberklassen-Doku ausdrücklich vorsieht.",
        "Verstoß, weil false zurückgegeben wird.",
        "Nur in Ordnung, wenn Girokonto eine Exception wirft."
      ],
      "answer": 1,
      "explain": "Die Oberklassen-Doku ist absichtlich so formuliert, dass Unterklassen eigene Regeln haben dürfen. Der Aufrufer rechnet mit false und wird nicht überrascht."
    },
    {
      "id": "K00-S02-F44",
      "sec": "lsp",
      "type": "mc",
      "t": "Gebühr nur in Unterklasse dokumentiert",
      "prompt": "Girokonto zieht bei jedem `abheben` zusätzlich 2 € Gebühr ab und dokumentiert das sorgfältig im eigenen JavaDoc. Die Doku von Konto erwähnt keine Gebühren. Liskov?",
      "options": [
        "In Ordnung, weil es dokumentiert ist.",
        "Verstoß: Die Zusatzaktion ist durch die Doku der Oberklasse nicht abgedeckt. Wer mit Konto arbeitet, liest nur die Konto-Doku.",
        "In Ordnung, weil keine Exception geworfen wird.",
        "Kompiliert nicht."
      ],
      "answer": 1,
      "explain": "Entscheidend ist die Doku der Oberklasse. Wer `Konto k` benutzt, weiß nicht einmal, ob es ein Girokonto ist, und erwartet nach abheben(100) genau 100 € weniger."
    },
    {
      "id": "K00-S02-F45",
      "sec": "lsp",
      "type": "mc",
      "t": "Speziellere Exception",
      "prompt": "Sparbuch wirft in `abheben` eine `PfaendungException extends GesperrtException`, wenn das Konto gepfändet ist. Liskov?",
      "options": [
        "Verstoß, das ist eine neue Exception.",
        "Erlaubt: Sie ist spezieller als die dokumentierte GesperrtException; jeder catch (GesperrtException e) fängt sie mit.",
        "Kompiliert nicht.",
        "Nur erlaubt, wenn sie unchecked ist."
      ],
      "answer": 1,
      "explain": "„möglich: speziellere Exceptions“. Kein Aufrufer wird überrascht, weil sie eine GesperrtException ist."
    },
    {
      "id": "K00-S02-F46",
      "sec": "lsp",
      "type": "mc",
      "t": "Neue checked Exception",
      "prompt": "Was passiert mit dieser Überschreibung in einer Unterklasse von Konto?",
      "code": "@Override\npublic boolean abheben(Geldbetrag betrag) throws GesperrtException, IOException {\n    ...\n}",
      "options": [
        "Kompiliert, ist aber ein Liskov-Verstoß.",
        "Kompiliert nicht: Eine überschreibende Methode darf keine zusätzlichen checked Exceptions deklarieren.",
        "Kompiliert und ist in Ordnung.",
        "Kompiliert nur, wenn IOException dokumentiert ist."
      ],
      "answer": 1,
      "explain": "Bei checked Exceptions sichert der Compiler Liskov selbst ab. Bei unchecked Exceptions kompiliert es dagegen, und der Verstoß fällt erst zur Laufzeit auf. Das ist die gefährlichere Variante."
    },
    {
      "id": "K00-S02-F47",
      "sec": "lsp",
      "type": "mc",
      "t": "Test für Liskov",
      "prompt": "Welche Frage entlarvt einen Liskov-Verstoß am zuverlässigsten?",
      "options": [
        "Ist die Unterklasse vollständig dokumentiert?",
        "Wird Code, der nur die Doku der Oberklasse kennt, vom Verhalten der Unterklasse überrascht?",
        "Hat die Unterklasse mehr Methoden als die Oberklasse?",
        "Ruft die Unterklasse super auf?"
      ],
      "answer": 1,
      "explain": "Liskov heißt: Ein Unterklassen-Objekt kann überall eingesetzt werden, wo ein Oberklassen-Objekt verlangt wird, ohne dass etwas Unerwartetes passiert."
    },
    {
      "id": "K00-S02-F48",
      "sec": "bug",
      "type": "bug",
      "t": "Bankkunde",
      "prompt": "Markiere die 3 Hauptfehler. Fehlendes JavaDoc zählt hier nicht.",
      "code": "public class Bankkunde {\n    private String Name;\n    private int alter;\n\n    public Bankkunde(String name, int alter) {\n        this.Name = name;\n        this.alter = alter;\n    }\n\n    public void setAlter(int alter) {\n        this.alter = alter;\n    }\n\n    public boolean getVolljaehrig() {\n        return alter >= 18;\n    }\n}",
      "required": [
        2,
        11,
        14
      ],
      "extra": [
        6,
        7
      ],
      "explain": "Zeile 2: Attribute beginnen klein, also `name`. Zeile 11 (und 7): keine Prüfung, ein negatives Alter landet im Attribut. Am besten prüft der Setter, und der Konstruktor ruft ihn auf, statt die Prüfung zu kopieren. Zeile 14: boolean-Getter heißt `isVolljaehrig()`. Zeile 6 setzt außerdem ungeprüft einen null-Namen."
    },
    {
      "id": "K00-S02-F49",
      "sec": "bug",
      "type": "bug",
      "t": "Alle Dispos erhöhen",
      "prompt": "Markiere die 2 Zeilen, die gegen Qualitätsregeln verstoßen.",
      "code": "public class Bank {\n    private List<Konto> konten = new ArrayList<>();\n\n    public void alleDisposErhoehen(Geldbetrag plus) {\n        for (Konto k : konten) {\n            Girokonto g = (Girokonto) k;\n            g.setDispo(g.getDispo().plus(plus));\n            System.out.println(\"Dispo erhöht: \" + g);\n        }\n    }\n}",
      "required": [
        6,
        8
      ],
      "extra": [],
      "explain": "Zeile 6: Down-Cast ohne Prüfung. Sobald ein Sparbuch in der Liste ist, fliegt eine ClassCastException. Richtig: vorher prüfen, z. B. `if (k instanceof Girokonto g)`. Zeile 8: println in einer Verarbeitungsklasse."
    },
    {
      "id": "K00-S02-F50",
      "sec": "bug",
      "type": "bug",
      "t": "Umbuchen",
      "prompt": "Markiere die 2 schwersten Fehler. Hier kann Geld aus dem Nichts entstehen.",
      "code": "/**\n * bucht betrag von quelle nach ziel um\n * @param quelle Konto, von dem abgebucht wird\n * @param ziel Konto, auf das eingezahlt wird\n * @param betrag umzubuchender Betrag\n */\npublic void umbuchen(Konto quelle, Konto ziel, Geldbetrag betrag) {\n    try {\n        quelle.abheben(betrag);\n    } catch (GesperrtException e) {\n        e.printStackTrace();\n    }\n    ziel.einzahlen(betrag);\n}",
      "required": [
        11,
        13
      ],
      "extra": [
        9
      ],
      "explain": "Zeile 11: nur Ausgabe statt Behebung (Unsinn 5). Zeile 13: Die Einzahlung passiert auch dann, wenn das Abheben gescheitert ist, also entsteht Geld. Zeile 9 gehört dazu: Das Ergebnis false von abheben wird ignoriert. Richtig: `throws GesperrtException` und nur einzahlen, wenn abheben true geliefert hat."
    },
    {
      "id": "K00-S02-F51",
      "sec": "bug",
      "type": "bug",
      "t": "Tagesgeldkonto",
      "prompt": "Markiere die Zeile, die das Liskovsche Substitutionsprinzip verletzt.",
      "code": "public class Tagesgeldkonto extends Konto {\n\n    @Override\n    public boolean abheben(Geldbetrag betrag) throws GesperrtException {\n        if (betrag.getBetrag() > 1000) {\n            throw new IllegalStateException(\"Tageslimit überschritten\");\n        }\n        if (isGesperrt()) {\n            throw new GesperrtException(getKontonummer());\n        }\n        setKontostand(getKontostand().minus(betrag));\n        return true;\n    }\n}",
      "required": [
        6
      ],
      "extra": [],
      "explain": "Zeile 6: Die Konto-Doku sieht für abgelehnte Abhebungen `false` vor, nicht eine neue IllegalStateException. Weil sie unchecked ist, kompiliert es, und der Verstoß fällt erst zur Laufzeit auf. Richtig: `return false;`. Bonus: Die dokumentierte Prüfung auf negative Beträge fehlt komplett."
    },
    {
      "id": "K00-S02-F52",
      "sec": "erk",
      "type": "explain",
      "t": "NULL_EURO",
      "prompt": "Erkläre, warum `this.kontostand = Geldbetrag.NULL_EURO;` im Konstruktor nötig ist und warum es ungefährlich ist, dass alle Konten dasselbe Objekt verwenden.",
      "model": "Ohne die Zeile hätte `kontostand` den Standardwert null; das erste `einzahlen` würde bei `plus` eine NullPointerException werfen (Regel: an die Initialisierung denken). NULL_EURO ist eine statische Konstante, also ein einziges Objekt für alle. Das ist ungefährlich, weil Geldbetrag unveränderlich ist: Das Attribut ist final, und plus/minus liefern neue Objekte, sodass niemand das gemeinsame Objekt ändern kann."
    },
    {
      "id": "K00-S02-F53",
      "sec": "erk",
      "type": "explain",
      "t": "Unsinn 3",
      "prompt": "Erkläre „Exception-Unsinn 3“ und wie man es richtig macht.",
      "model": "Eine Methode kündigt mit throws/@throws eine checked Exception an, die gar nicht auftreten kann, weil vorher geprüft wurde. Dadurch müssen alle Aufrufer grundlos try-catch schreiben. Richtig: die Exception innerhalb der Methode mit try-catch abfangen und den catch-Block leer lassen, mit Kommentar „kann nicht auftreten“. Angekündigt wird nur, was wirklich nach außen kommt."
    },
    {
      "id": "K00-S02-F54",
      "sec": "erk",
      "type": "explain",
      "t": "Entscheidungsdiagramm",
      "prompt": "Erkläre das Diagramm „Wann Exception werfen?“ mit beiden Fällen.",
      "model": "Es gibt zwei Ausgangslagen: Eine aufgerufene Methode wirft eine Exception (Fall A), oder die Methode erkennt selbst eine Fehlersituation (Fall B). In beiden Fällen lautet die Frage: Kann das Problem im Rahmen der Aufgabe der Methode gelöst werden? Fall A: ja → try-catch und beheben; nein → throws. Fall B: ja → im if-Block beheben; nein → throw new … plus throws (bei checked). Was zur Aufgabe gehört, legt die Dokumentation fest."
    },
    {
      "id": "K00-S02-F55",
      "sec": "erk",
      "type": "explain",
      "t": "Doku nur in Unterklasse",
      "prompt": "Warum genügt es nicht, eine Zusatzaktion nur in der Unterklasse zu dokumentieren?",
      "model": "Wer mit einer Variablen vom Typ der Oberklasse arbeitet (z. B. `Konto k`), kennt nur deren Doku und weiß oft gar nicht, welche Unterklasse dahintersteckt. Er verlässt sich auf den Vertrag der Oberklasse. Eine Zusatzaktion, die dort nicht vorgesehen ist, überrascht ihn und kann seinen Code brechen. Das verletzt das Liskovsche Substitutionsprinzip."
    },
    {
      "id": "K00-S02-F56",
      "sec": "erk",
      "type": "explain",
      "t": "this(...) im Konstruktor",
      "prompt": "`Konto()` ruft `this(Kunde.MUSTERMANN, 1234567)` auf. Welche Vorteile hat das gegenüber einem eigenen Rumpf mit Zuweisungen?",
      "model": "Kein doppelter Code (Regel: kein Copy & Paste). Alle Prüfungen und Initialisierungen (inhaber nicht null, Kontonummer gültig, Kontostand NULL_EURO, nicht gesperrt) stehen an einer Stelle und gelten automatisch auch für den Standard-Konstruktor. Ändert man später eine Prüfung, muss man nur eine Stelle anpassen und kann keine vergessen."
    }
  ]
});
