/* Kapitel 03 · Serie S02: Records
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K03-S02',
  kapitel: 'K03',
  titel: 'Records',
  beschreibung: 'Was der Compiler erzeugt, was erlaubt ist, kompakter und weitere Konstruktoren, equals und toString, flache Unveränderlichkeit, Record oder Klasse, Enum oder Record.',
  neu: true,
  themen: [
    { id: 'aufbau',  name: 'Was der Compiler erzeugt' },
    { id: 'erlaubt', name: 'Erlaubt & verboten' },
    { id: 'konstr',  name: 'Konstruktoren' },
    { id: 'einsatz', name: 'Einsatz & Grenzen' }
  ],
  fragen: [

    /* ========== Was der Compiler erzeugt ========== */

    { id: 'K03-S02-F01', sec: 'aufbau', type: 'multi', t: 'Was wird erzeugt?',
      prompt: 'Für `public record Geldbetrag(double betrag, String waehrung) { }` erzeugt der Compiler … (mehrere)',
      options: [
        'zwei `private final`-Attribute',
        'die Methode `getBetrag()`',
        'die Methode `betrag()`',
        'einen zusätzlichen Konstruktor ohne Parameter für Standardwerte',
        'einen Konstruktor mit beiden Komponenten',
        'die Methode `setBetrag(double)`',
        '`equals`, `hashCode` und `toString` über beide Komponenten'
      ],
      answer: [0, 2, 4, 6],
      explain: 'Die Zugriffsmethoden heißen wie die Komponenten, **ohne** get: `betrag()`. Es gibt nur den kanonischen Konstruktor mit allen Komponenten, keinen parameterlosen. Setter gibt es nicht, die Attribute sind final.' },

    { id: 'K03-S02-F02', sec: 'aufbau', type: 'input', t: 'equals, == und toString',
      prompt: 'Was gibt das Programm aus? (fünf Zeilen)',
      code: `record Punkt(int x, int y) { }

public class Test {
    public static void main(String[] args) {
        Punkt a = new Punkt(1, 2);
        Punkt b = new Punkt(1, 2);
        System.out.println(a);
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println(a.hashCode() == b.hashCode());
        System.out.println(a.x() + b.y());
    }
}`,
      answers: ['Punkt[x=1, y=2]\nfalse\ntrue\ntrue\n3'],
      explain: '`toString` hat das Format `Name[komponente=wert, …]`. `a` und `b` sind zwei verschiedene Objekte, `==` ist `false`. Das erzeugte `equals` vergleicht den **Inhalt** aller Komponenten: `true`, und passend dazu sind die Hashcodes gleich. Anders als bei Enums braucht man bei Records also `equals`.' },

    { id: 'K03-S02-F03', sec: 'aufbau', type: 'mc', wichtig: true, t: 'Interface implementieren',
      prompt: 'Darf ein Record ein Interface implementieren, z. B. `record Geldbetrag(double betrag) implements Comparable<Geldbetrag>`?',
      options: [
        'Nein, Records dürfen weder `extends` noch `implements` verwenden.',
        'Nur funktionale Interfaces, weil ein Record nur eine Methode hat.',
        'Ja, beliebig viele Interfaces, nur `extends` ist nicht möglich.',
        'Ja, aber dann darf er keine eigenen Methoden mehr enthalten.'
      ],
      answer: 2,
      explain: 'Ein Record erbt schon von `java.lang.Record`, darum geht `extends` nicht. Interfaces implementieren darf er beliebig viele, die Methoden schreibt man in die geschweiften Klammern. Für Enums gilt dasselbe.' },

    /* ========== Erlaubt & verboten ========== */

    { id: 'K03-S02-F04', sec: 'erlaubt', type: 'multi', wichtig: true, t: 'Was ist in Records erlaubt?',
      prompt: 'Welche Elemente darf man in die geschweiften Klammern eines Records schreiben? (mehrere)',
      options: [
        'ein weiteres Instanzattribut `private int zaehler;`',
        'eine statische Konstante',
        'eine abstrakte Methode',
        'eine normale Instanzmethode wie `plus(Geldbetrag g)`',
        'einen Setter wie `setBetrag(double)`, der ein Attribut ändert',
        'ein statisches, veränderliches Attribut',
        'eine statische Methode',
        'mehrere zusätzliche Konstruktoren'
      ],
      answer: [1, 3, 5, 6, 7],
      explain: 'Verboten sind weitere **Instanz**attribute (javac: „field declaration must be static“), abstrakte Methoden (ein Record ist final und kann nicht abstrakt sein) und Setter (die Attribute sind final). Statische Attribute dürfen sogar veränderlich sein. Zusätzliche Konstruktoren dürfen jede Sichtbarkeit haben, müssen aber zuerst `this(...)` aufrufen.' },

    { id: 'K03-S02-F05', sec: 'erlaubt', type: 'bug', t: 'Record mit Fehlern',
      prompt: 'Markiere alle Zeilen, an denen javac einen **Compilerfehler** meldet. (javac meldet sie nacheinander, wenn man jeweils den vorigen Fehler behebt.)',
      code: `public record Konto(long nummer, double kontostand) {
    private static int anzahl = 0;
    private String inhaber;

    public Konto(long nummer) {
        this.nummer = nummer;
        this.kontostand = 0;
    }

    public void einzahlen(double betrag) {
        kontostand = kontostand + betrag;
    }

    public static int getAnzahl() {
        return anzahl;
    }
}`,
      required: [3, 5, 11],
      extra: [6, 7],
      explain: 'Zeile 3: weitere Instanzattribute sind verboten. Zeile 5: Ein zusätzlicher Konstruktor muss als erste Anweisung `this(...)` aufrufen, z. B. `this(nummer, 0);`, direkte Zuweisungen in Zeile 6 und 7 sind nicht erlaubt. Zeile 11: `kontostand` ist final. Zeile 2 ist korrekt, statische Attribute sind erlaubt. Ein Konto mit veränderlichem Kontostand ist ohnehin kein Fall für einen Record.' },

    /* ========== Konstruktoren ========== */

    { id: 'K03-S02-F06', sec: 'konstr', type: 'fill', wichtig: true, t: 'Was gibt der kompakte Konstruktor aus?',
      prompt: '`new Geldbetrag(2.5, "EUR")` wird ausgeführt. Wähle für jede Zeile im kompakten Konstruktor, was passiert.',
      code: `public record Geldbetrag(double betrag, String waehrung) {
    public Geldbetrag {
        System.out.println(betrag);        // [[0]]
        System.out.println(betrag());      // [[1]]
        System.out.println(this.betrag);   // [[2]]
    }
}`,
      blanks: [
        { options: ['2.5', '0.0', 'Exception', 'Compilerfehler'], answer: 0,
          why: 'Im kompakten Konstruktor ist `betrag` der **Parameter** mit dem übergebenen Wert.' },
        { options: ['2.5', '0.0', 'Exception', 'Compilerfehler'], answer: 1,
          why: '`betrag()` liest das **Attribut**. Die Zuweisung ergänzt der Compiler erst am Ende des Konstruktors, also steht dort noch der Standardwert 0.0.' },
        { options: ['2.5', '0.0', 'Exception', 'Compilerfehler'], answer: 3,
          why: 'Das finale Attribut direkt zu lesen, bevor es zugewiesen ist, verbietet der Compiler: „variable betrag might not have been initialized“.' }
      ],
      explain: 'Merke die Reihenfolge im kompakten Konstruktor: erst dein Code (mit den Parametern), ganz am Ende die automatischen Zuweisungen `this.betrag = betrag; this.waehrung = waehrung;`.' },

    { id: 'K03-S02-F07', sec: 'konstr', type: 'fill', t: 'Kompakter Konstruktor schreiben',
      prompt: 'Ein negativer Betrag soll eine Exception auslösen, eine fehlende Währung soll zu "EUR" werden. Vervollständige.',
      code: `public record Geldbetrag(double betrag, String waehrung) {
    public [[0]] {
        if (betrag < 0) {
            throw new IllegalArgumentException("negativer Betrag");
        }
        if (waehrung == null) {
            [[1]] = "EUR";
        }
    }

    public Geldbetrag(double betrag) {
        [[2]];
    }
}`,
      blanks: [
        { options: ['Geldbetrag()', 'Geldbetrag', 'void Geldbetrag()', 'Geldbetrag(double betrag, String waehrung)'], answer: 1,
          why: 'Der kompakte Konstruktor hat **weder Klammern noch Parameterliste**. Mit voller Parameterliste wäre es der normale kanonische Konstruktor, dann müsste man selbst zuweisen.' },
        { options: ['this.waehrung', 'waehrung', 'waehrung()', 'Geldbetrag.waehrung'], answer: 1,
          why: 'Man ändert den **Parameter**. Der geänderte Wert wird am Ende automatisch ins Attribut übernommen. `this.waehrung = …` wäre hier ein Fehler, weil der Compiler die Zuweisung selbst ergänzt.' },
        { options: ['this.betrag = betrag', 'this(betrag, null)', 'super(betrag)', 'new Geldbetrag(betrag, "EUR")'], answer: 1,
          why: 'Jeder weitere Konstruktor muss zuerst einen vorhandenen mit `this(...)` aufrufen. Mit `null` als Währung greift die Regel im kompakten Konstruktor und macht "EUR" daraus. `this("EUR")` hätte übrigens auch gepasst, `super(...)` und direkte Zuweisungen sind verboten.' }
      ],
      explain: 'Prüfen und Korrigieren gehört in den kompakten Konstruktor, weil **jeder** Weg zum Objekt (auch über weitere Konstruktoren) dort vorbeikommt.' },

    { id: 'K03-S02-F08', sec: 'konstr', type: 'input', t: 'Konstruktorkette im Record',
      prompt: 'Was gibt `new Punkt(-3)` mit der folgenden Ausgabe aus? (drei Zeilen)',
      code: `record Punkt(int x, int y) {
    public Punkt {
        if (x < 0) {
            x = -x;
        }
        System.out.println("K");
    }

    public Punkt(int x) {
        this(x, x);
        System.out.println("E");
    }
}

public class Test {
    public static void main(String[] args) {
        Punkt p = new Punkt(-3);
        System.out.println(p);
    }
}`,
      answers: ['K\nE\nPunkt[x=3, y=-3]'],
      explain: '`new Punkt(-3)` ruft zuerst mit `this(-3, -3)` den kompakten Konstruktor auf: Er gibt `K` aus, danach läuft der Rest des weiteren Konstruktors: `E`. Achtung Falle: Der kompakte Konstruktor korrigiert nur `x`, also bleibt `y = -3`.' },

    { id: 'K03-S02-F09', sec: 'konstr', type: 'mc', t: 'Kompakt oder kanonisch?',
      prompt: 'Was unterscheidet den **kompakten** Konstruktor vom selbst geschriebenen **kanonischen** Konstruktor?',
      options: [
        'Der kompakte darf keine Exceptions werfen, der kanonische schon.',
        'Der kompakte hat keine Parameterliste, die Zuweisungen ergänzt der Compiler.',
        'Der kompakte ist immer privat, der kanonische immer public.',
        'Der kompakte darf nur in Enums vorkommen, der kanonische dagegen nur in Records.'
      ],
      answer: 1,
      explain: 'Beide ersetzen den automatisch erzeugten Konstruktor. Beim kanonischen schreibt man die vollständige Parameterliste und alle Zuweisungen `this.x = x;` selbst. Beim kompakten fehlen Parameterliste und Zuweisungen, man schreibt nur Prüfungen und Korrekturen. Beide dürfen Exceptions werfen und haben mindestens die Sichtbarkeit des Records.' },

    /* ========== Einsatz & Grenzen ========== */

    { id: 'K03-S02-F10', sec: 'einsatz', type: 'review', t: 'Ist das wirklich unveränderlich?',
      prompt: 'Welche Befunde treffen auf diesen Code zu?',
      code: `record Kunde(String name, List<String> konten) { }

List<String> l = new ArrayList<>(List.of("DE01"));
Kunde k = new Kunde("Meier", l);
l.add("DE02");
k.konten().add("DE03");
System.out.println(k);`,
      findings: [
        { text: 'Die Ausgabe ist `Kunde[name=Meier, konten=[DE01, DE02, DE03]]`.', correct: true,
          why: 'Record und Variable `l` zeigen auf **dieselbe** Liste, beide Änderungen landen dort.' },
        { text: 'Der Record ist nur flach unveränderlich: Die Referenz ist final, der Inhalt der Liste nicht.', correct: true,
          why: 'Final verhindert nur, dass das Attribut auf eine andere Liste zeigt.' },
        { text: 'Mit `konten = List.copyOf(konten);` im kompakten Konstruktor wäre der Inhalt geschützt.', correct: true,
          why: '`List.copyOf` liefert eine unveränderliche Kopie: spätere Änderungen an `l` wirken nicht, und `add` über `konten()` wirft eine Exception.' },
        { text: 'Zeile 6 ist ein Compilerfehler, weil Records keine Änderungen erlauben.', correct: false,
          why: 'Es kompiliert und läuft. Der Compiler sieht nur einen Methodenaufruf auf einer Liste.' }
      ],
      explain: 'Darum der Rat: Datentypen der Komponenten so wählen, dass sie selbst unveränderlich sind (String, Zahlen, LocalDate, unveränderliche Listen).' },

    { id: 'K03-S02-F11', sec: 'einsatz', type: 'multi', t: 'Record oder Klasse?',
      prompt: 'Welche dieser Typen aus dem Bankprojekt-Umfeld eignen sich als **Record**? (mehrere)',
      options: [
        '`Geldbetrag` mit Betrag und Währung, `plus` liefert ein neues Objekt',
        '`Kunde` mit Settern, z. B. `setNachname`',
        '`Konto` mit Kontostand, der sich bei jeder Einzahlung und Abhebung ändert',
        '`Bankverbindung` mit IBAN und BIC',
        '`Kontoart` mit den festen Werten Giro und Spar',
        '`Ueberweisung` mit Absender, Empfänger, Betrag und Datum'
      ],
      answer: [0, 3, 5],
      explain: 'Records passen für unveränderliche Daten, von denen es beliebig viele gibt. Kunde und Konto ändern ihren Zustand, das geht mit finalen Attributen nicht. `Kontoart` ist eine feste, kleine Menge: ein Fall für eine **Enum**, nicht für einen Record.' },

    { id: 'K03-S02-F12', sec: 'einsatz', type: 'explain', t: 'Enum oder Record?',
      prompt: 'Erkläre den Unterschied zwischen Enum und Record und nenne für beide ein passendes Beispiel aus dem Bankprojekt.',
      model: 'Eine **Enum** ist eine kleine, abgeschlossene Menge von Konstanten. Es gibt genau die aufgezählten Objekte, `new` ist verboten, der Konstruktor ist privat, Vergleich mit `==`. Beispiel: `Kontoart { GIRO, SPAR }`. Ein **Record** ist ein unveränderliches Datenobjekt: Der Compiler erzeugt private finale Attribute, kanonischen Konstruktor, Zugriffsmethoden ohne get sowie `equals`, `hashCode` und `toString`. Man kann beliebig viele Objekte erzeugen, Vergleich mit `equals`. Beispiel: `Geldbetrag(double betrag, String waehrung)`. Gemeinsam: beide sind nicht beerbbar, können nicht erben, dürfen aber Interfaces implementieren und eigene Methoden haben.' }
  ]
});
