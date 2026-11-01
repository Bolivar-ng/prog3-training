/* Probetest T06: Interfaces, Enums und Records gemischt, 30 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K90-T06',
  kapitel: 'K90',
  titel: 'Interfaces, Enums und Records',
  beschreibung: 'Kapitel 2 und 3 gemischt: default-Methoden, Lambdas, anonyme Klassen, Enums mit Konstruktor und Interface, Records mit kompaktem Konstruktor und Comparable.',
  neu: true,
  dauer: 30,
  themen: [
    { id: 'iface',  name: 'Interfaces & Lambda' },
    { id: 'enum',   name: 'Enums' },
    { id: 'record', name: 'Records' },
    { id: 'mix',    name: 'Gemischt' }
  ],
  fragen: [

    /* ========== Interfaces & Lambda ========== */

    { id: 'K90-T06-F01', sec: 'iface', type: 'multi', t: 'Korrekt oder falsch',
      prompt: 'Welche Aussagen sind **korrekt**? (mehrere)',
      options: [
        'Ein Lambda-Ausdruck kann nur einem funktionalen Interface zugewiesen werden.',
        'In einem Lambda bezeichnet `this` das Lambda-Objekt selbst.',
        'Eine anonyme Klasse kann eigene Attribute haben, ein Lambda nicht.',
        'Lokale Variablen, die ein Lambda benutzt, müssen effektiv final sein.',
        'Eine default-Methode kann von der implementierenden Klasse überschrieben werden.',
        'Eine statische Interface-Methode ruft man über ein Objekt der implementierenden Klasse auf.',
        'Attribute der umgebenden Klasse darf ein Lambda nur lesen, aber nicht ändern.'
      ],
      answer: [0, 2, 3, 4],
      explain: 'Im Lambda ist `this` das Objekt der **umgebenden** Klasse (anders als in der anonymen Klasse). Statische Interface-Methoden werden nicht vererbt, man ruft sie nur über den Interface-Namen auf. Die Regel „effektiv final“ gilt nur für **lokale** Variablen: Attribute darf ein Lambda auch ändern.' },

    { id: 'K90-T06-F02', sec: 'iface', type: 'input', t: 'Zähler: anonym und Lambda',
      prompt: 'Was gibt `new Test().los()` aus? (eine Zeile)',
      code: `interface Zaehler {
    int weiter();
}

public class Test {
    private int basis = 100;

    void los() {
        Zaehler anonym = new Zaehler() {
            private int stand = 0;

            @Override
            public int weiter() {
                stand++;
                return stand;
            }
        };
        Zaehler lambda = () -> ++basis;
        anonym.weiter();
        lambda.weiter();
        System.out.println(anonym.weiter() + " " + lambda.weiter() + " " + basis);
    }
}`,
      answers: ['2 102 102'],
      explain: 'Die anonyme Klasse hat ein eigenes Attribut `stand`: 1, dann 2. Das Lambda verändert das **Attribut** `basis` der umgebenden Klasse (erlaubt, es ist keine lokale Variable): 101, dann 102. `basis` wird erst nach dem zweiten Aufruf ausgewertet, also auch 102.' },

    { id: 'K90-T06-F03', sec: 'iface', type: 'bug', t: 'Zwei default-Methoden',
      prompt: 'Markiere alle Zeilen, an denen javac einen **Compilerfehler** meldet.',
      code: `interface Druckbar {
    default String text() { return "Druck"; }
}
interface Speicherbar {
    default String text() { return "Speicher"; }
    static String version() { return "1.0"; }
}
class Beleg implements Druckbar, Speicherbar {
    @Override
    public String text() {
        return super.text() + Speicherbar.super.text();
    }
}
public class Test {
    public static void main(String[] args) {
        System.out.println(new Beleg().text());
        System.out.println(Beleg.version());
    }
}`,
      required: [11, 17],
      explain: 'Der Namenskonflikt ist gelöst, weil `Beleg` `text()` überschreibt (Zeile 8 ist also in Ordnung). Zeile 11: `super.text()` meint die Oberklasse `Object`, die kein `text()` hat. Richtig wäre `Druckbar.super.text()`. Zeile 17: Statische Interface-Methoden werden nicht vererbt, nur `Speicherbar.version()` geht.' },

    { id: 'K90-T06-F04', sec: 'iface', type: 'fill', t: 'Konten absteigend sortieren',
      prompt: 'Die Konten sollen nach Kontostand **absteigend** sortiert werden (größter zuerst). `getKontostand()` liefert einen `double`.',
      code: `Arrays.sort(konten, [[0]] -> [[1]].compare(k2.getKontostand(), k1.getKontostand()));`,
      blanks: [
        { options: ['(Konto k1, k2)', '(k1, k2)', 'k1, k2', '(k1; k2)'], answer: 1,
          why: 'Zwei Parameter brauchen Klammern. Typen gibt man für alle oder für keinen an, und getrennt wird mit Komma.' },
        { options: ['Integer', 'Double', 'Comparator', 'Konto'], answer: 1,
          why: '`Double.compare` vergleicht zwei `double`-Werte ohne Überlaufproblem. Absteigend wird es, weil `k2` vorne steht.' }
      ],
      explain: '`Arrays.sort` erwartet einen `Comparator<Konto>`, das Lambda liefert `compare(k1, k2)`. Mit vertauschten Argumenten kehrt sich die Reihenfolge um.' },

    /* ========== Enums ========== */

    { id: 'K90-T06-F05', sec: 'enum', type: 'input', t: 'Wann läuft der Enum-Konstruktor?',
      prompt: 'Was gibt das Programm aus? (fünf Zeilen)',
      code: `enum Stufe {
    NIEDRIG(1), HOCH(3);

    private final int wert;

    Stufe(int wert) {
        this.wert = wert;
        System.out.println("K" + wert);
    }

    public int getWert() { return wert; }
}

public class Test {
    public static void main(String[] args) {
        System.out.println("Start");
        Stufe s = Stufe.HOCH;
        System.out.println(s + " " + s.getWert());
        System.out.println(Stufe.NIEDRIG.getWert());
    }
}`,
      answers: ['Start\nK1\nK3\nHOCH 3\n1'],
      explain: 'Die Konstanten werden beim **ersten Zugriff** auf die Enum erzeugt, also erst nach „Start“, und zwar **alle**, in Definitionsreihenfolge: K1, K3. Danach läuft der Konstruktor nie wieder, auch nicht beim Zugriff auf `NIEDRIG`.' },

    { id: 'K90-T06-F06', sec: 'enum', type: 'mc', t: 'Was kompiliert nicht?',
      prompt: 'Gegeben ist `enum Ampel { ROT, GELB, GRUEN }`. Welche Zeile führt zu einem **Compilerfehler**?',
      options: [
        '`Ampel a = Ampel.valueOf("ROT");`',
        '`int n = Ampel.values().length;`',
        '`Ampel b = new Ampel();`',
        '`boolean v = Ampel.ROT.compareTo(Ampel.GELB) < 0;`'
      ],
      answer: 2,
      explain: 'Von einer Enum gibt es nur die aufgezählten Objekte, der Konstruktor ist privat: „enum classes may not be instantiated“. `valueOf` und `values` erzeugt der Compiler, `compareTo` gibt es, weil jede Enum `Comparable` ist.' },

    { id: 'K90-T06-F07', sec: 'enum', type: 'input', t: 'Enum als funktionales Interface',
      prompt: 'Was gibt das Programm aus? (vier Zeilen) `IntBinaryOperator` aus `java.util.function` hat die Methode `int applyAsInt(int a, int b)`.',
      code: `enum Rechnung implements IntBinaryOperator {
    PLUS {
        @Override
        public int applyAsInt(int a, int b) { return a + b; }
    },
    MAX {
        @Override
        public int applyAsInt(int a, int b) { return Math.max(a, b); }
    };
}

public class Test {
    static int anwenden(IntBinaryOperator op, int a, int b) {
        return op.applyAsInt(a, b);
    }

    public static void main(String[] args) {
        System.out.println(anwenden(Rechnung.PLUS, 4, 9));
        System.out.println(anwenden(Rechnung.MAX, 4, 9));
        System.out.println(anwenden((a, b) -> a * b, 4, 9));
        System.out.println(Rechnung.MAX instanceof IntBinaryOperator);
    }
}`,
      answers: ['13\n9\n36\ntrue'],
      explain: 'Eine Enum darf Interfaces implementieren, jede Konstante liefert hier ihre eigene Implementierung. `anwenden` nimmt jedes Objekt, das `IntBinaryOperator` implementiert: eine Enum-Konstante oder ein Lambda. `instanceof` prüft auch Interfaces.' },

    { id: 'K90-T06-F08', sec: 'enum', type: 'input', t: 'valueOf im Lambda',
      prompt: 'Was gibt das Programm aus? Hinweis: Die letzte Zeile führt zu einer Exception. Gib als dritte Zeile nur den **einfachen Namen** der Exception-Klasse an.',
      code: `enum Ampel { ROT, GELB, GRUEN }

public class Test {
    public static void main(String[] args) {
        Function<String, Ampel> umwandeln = s -> Ampel.valueOf(s.toUpperCase());
        System.out.println(umwandeln.apply("gelb").ordinal());
        System.out.println(umwandeln.apply("Gruen"));
        System.out.println(umwandeln.apply("Blau"));
    }
}`,
      answers: ['1\nGRUEN\nIllegalArgumentException'],
      explain: '`toUpperCase` macht aus „gelb“ „GELB“, die Position ist 1. „Gruen“ wird zu „GRUEN“ und ausgegeben. „BLAU“ gibt es nicht: `valueOf` wirft eine `IllegalArgumentException` („No enum constant Ampel.BLAU“).' },

    /* ========== Records ========== */

    { id: 'K90-T06-F09', sec: 'record', type: 'input', t: 'Records in einer Liste',
      prompt: 'Was gibt das Programm aus? (vier Zeilen)',
      code: `record Punkt(int x, int y) { }

public class Test {
    public static void main(String[] args) {
        Punkt a = new Punkt(1, 2);
        List<Punkt> liste = List.of(a, new Punkt(3, 4));
        System.out.println(liste.contains(new Punkt(1, 2)));
        System.out.println(liste.get(0) == a);
        System.out.println(new Punkt(2, 1).equals(a));
        System.out.println(liste);
    }
}`,
      answers: ['true\ntrue\nfalse\n[Punkt[x=1, y=2], Punkt[x=3, y=4]]'],
      explain: '`contains` benutzt `equals`, und das erzeugte `equals` vergleicht den Inhalt: true. `liste.get(0)` ist genau das Objekt `a`, also ist auch `==` true. (2, 1) und (1, 2) sind verschieden: Die Reihenfolge der Komponenten zählt. Die Liste gibt jedes Element mit dem erzeugten `toString` aus.' },

    { id: 'K90-T06-F10', sec: 'record', type: 'bug', t: 'Record Konto',
      prompt: 'Markiere alle Zeilen, an denen javac einen **Compilerfehler** meldet. (javac meldet sie nacheinander, wenn man jeweils den vorigen Fehler behebt.)',
      code: `public record Konto(long nummer, String inhaber) {
    private static int anzahl;
    private double kontostand;

    public Konto {
        anzahl++;
    }

    public Konto(long nummer) {
        this(nummer, "unbekannt");
    }

    public void setInhaber(String neu) {
        this.inhaber = neu;
    }

    public abstract double zinsen();
}`,
      required: [3, 14, 17],
      extra: [1],
      explain: 'Zeile 3: weitere Instanzattribute sind verboten („field declaration must be static“). Zeile 14: `inhaber` ist final. Zeile 17: Ein Record ist final und kann keine abstrakten Methoden haben (javac meldet das an Zeile 1). Richtig sind Zeile 2 (statische Attribute sind erlaubt), der kompakte Konstruktor und der zusätzliche Konstruktor mit `this(...)`.' },

    { id: 'K90-T06-F11', sec: 'record', type: 'fill', t: 'Kompakter Konstruktor für Kunde',
      prompt: 'Der Name darf nicht leer sein und wird ohne Leerzeichen am Rand gespeichert. Ein negatives Alter ist ungültig. `new Kunde("  Meier ", 30)` soll `Kunde[name=Meier, alter=30]` ergeben.',
      code: `public record Kunde(String name, int alter) {
    [[0]] {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Name fehlt");
        if (alter < 0)
            throw new [[1]]("Alter negativ");
        [[2]];
    }
}`,
      blanks: [
        { options: ['public Kunde', 'public Kunde()', 'public Kunde(String name, int alter)', 'public void Kunde'], answer: 0,
          why: 'Der kompakte Konstruktor hat keine Klammern und keine Parameterliste. Mit Parameterliste wäre es der kanonische, dann fehlten die Zuweisungen.' },
        { options: ['NullPointerException', 'IllegalStateException', 'IllegalArgumentException', 'ArithmeticException'], answer: 2,
          why: 'Ein ungültiger Wert als Argument → `IllegalArgumentException`. `IllegalStateException` passt, wenn der Zustand des Objekts nicht stimmt.' },
        { options: ['this.name = name.trim()', 'name.trim()', 'name = name.trim()', 'return name.trim()'], answer: 2,
          why: 'Man ändert den Parameter, die Zuweisung an das Attribut macht der Compiler am Ende. `name.trim()` allein würde das Ergebnis wegwerfen (Strings sind unveränderlich).' }
      ],
      explain: 'Geprüft: `new Kunde("  Meier ", 30)` ergibt `Kunde[name=Meier, alter=30]`, `new Kunde(" ", 3)` wirft „Name fehlt“.' },

    { id: 'K90-T06-F12', sec: 'record', type: 'input', t: 'Record mit Comparable',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `record Note(String fach, double wert) implements Comparable<Note> {
    @Override
    public int compareTo(Note o) {
        return Double.compare(this.wert, o.wert);
    }
}

public class Test {
    public static void main(String[] args) {
        Note[] noten = { new Note("Prog", 2.3), new Note("Mathe", 1.7), new Note("BuN", 3.0) };
        Arrays.sort(noten);
        System.out.println(noten[0].fach() + " " + noten[2].fach());
        Arrays.sort(noten, (n1, n2) -> n1.fach().compareTo(n2.fach()));
        System.out.println(noten[0].fach() + " " + noten[2].wert());
        Arrays.sort(noten, (n1, n2) -> n2.compareTo(n1));
        System.out.println(noten[0]);
    }
}`,
      answers: ['Mathe BuN\nBuN 2.3\nNote[fach=BuN, wert=3.0]'],
      explain: 'Natürliche Ordnung nach Note: 1.7 (Mathe), 2.3, 3.0 (BuN). Nach Fach alphabetisch: BuN, Mathe, Prog, das letzte hat 2.3. `n2.compareTo(n1)` dreht die natürliche Ordnung um: 3.0 zuerst. Die Ausgabe kommt vom erzeugten `toString`.' },

    /* ========== Gemischt ========== */

    { id: 'K90-T06-F13', sec: 'mix', type: 'match', t: 'Welches Sprachmittel?',
      prompt: 'Ordne jeder Situation das passende Sprachmittel zu.',
      pairs: [
        ['Die vier Jahreszeiten, jede mit einem Anfangsmonat', 'Enum'],
        ['Eine unveränderliche Koordinate mit x und y, beliebig viele', 'Record'],
        ['Ein Vertrag „kann sortiert werden“ für ganz verschiedene Klassen', 'Interface'],
        ['Gemeinsamer Zustand und Code für Girokonto und Sparbuch', 'abstrakte Klasse'],
        ['Einmalig eine Sortierregel an Arrays.sort übergeben', 'Lambda-Ausdruck']
      ],
      explain: 'Feste, kleine Menge → Enum. Unveränderliche Daten, beliebig viele → Record. Fähigkeit ohne Zustand für fremde Klassen → Interface. Gemeinsame Attribute und Methoden in einer Klassenhierarchie → abstrakte Klasse. Einmaliger Code für ein funktionales Interface → Lambda.' },

    { id: 'K90-T06-F14', sec: 'mix', type: 'multi', t: 'Enum und Record im Vergleich',
      prompt: 'Welche Aussagen gelten für **Enums und Records gleichermaßen**? (mehrere)',
      options: [
        'Sie können Interfaces implementieren.',
        'Man kann mit `new` beliebig viele Objekte erzeugen.',
        'Man kann nicht von ihnen erben.',
        'Sie dürfen statische Methoden enthalten.',
        'Zwei Objekte vergleicht man am besten mit `==`.',
        'Sie dürfen keine Instanzattribute außer den Komponenten haben.'
      ],
      answer: [0, 2, 3],
      explain: '`new` geht nur beim Record. `==` ist nur bei Enums richtig, Records vergleicht man mit `equals`. Eine Enum darf beliebig viele Instanzattribute haben (z. B. Kurs und Symbol), nur beim Record sind sie auf die Komponenten beschränkt.' },

    { id: 'K90-T06-F15', sec: 'mix', type: 'explain', t: 'Der private Enum-Konstruktor',
      prompt: 'Der Konstruktor einer Enum ist immer privat. Erkläre drei Folgen davon.',
      model: '1. Es gibt **genau die aufgezählten Objekte**, niemand kann mit `new` weitere erzeugen. Deshalb darf man Enum-Konstanten mit `==` vergleichen, und das ist sogar null-sicher. 2. Der Konstruktor wird nur von den Konstanten aufgerufen, die der Entwickler selbst in dieselbe Datei schreibt. Eine **Prüfung der Parameter** ist deshalb überflüssig. 3. Von einer Enum kann man **nicht erben** (die einzigen Unterklassen sind die Konstantenrümpfe in derselben Datei). Darum wirkt `protected` dort wie packageweit, und eine „erweiterte“ Enum muss man komplett neu schreiben.' }
  ]
});
