/* Probetest T09: Generische Klassen (35 Minuten)
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Eine Fallaufgabe mit Teilaufgaben plus Einzelfragen, wie in der Prüfung.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K90-T09',
  kapitel: 'K90',
  titel: 'Probetest 9: Generische Klassen',
  beschreibung: 'Fallaufgabe Lagerfach<T extends Ware> (Bound auf eine Klasse, ? extends / ? super, Methode schreiben) und Einzelfragen zu Inferenz, &-Bounds, Verboten und Comparable<? super T>. 35 Minuten.',
  neu: true,
  dauer: 35,
  themen: [
    { id: 'fach',  name: 'Fallaufgabe Lagerfach' },
    { id: 'einzel', name: 'Einzelfragen Generics' }
  ],
  faelle: [
    { id: 'L', titel: 'Lagerfach für Waren',
      text: `Ein **Lagerfach** nimmt Waren **einer bestimmten Art** auf (nur Bücher, nur Tassen oder beliebige Waren) und hat eine feste **Kapazität**. \`einlegen\` liefert \`false\`, wenn das Fach voll ist.

\`umlagernIn(ziel)\` verschiebt die Waren nacheinander in ein anderes Fach, bis das Ziel voll ist. Was nicht mehr hineinpasst, bleibt im ursprünglichen Fach. Bücher dürfen dabei in ein Fach für Bücher oder in eines für beliebige Waren umgelagert werden, aber nie in ein Tassenfach.`,
      code: `public abstract class Ware {
    private final String name;
    private final double preis;
    public Ware(String name, double preis) { this.name = name; this.preis = preis; }
    public String getName() { return name; }
    public double getPreis() { return preis; }
    @Override public String toString() { return name; }
}
public class Buch extends Ware { public Buch(String n, double p) { super(n, p); } }
public class Tasse extends Ware { public Tasse(String n, double p) { super(n, p); } }

public class Lagerfach<T extends Ware> {
    private final List<T> inhalt = new ArrayList<>();
    private final int kapazitaet;

    public Lagerfach(int kapazitaet) {
        if (kapazitaet <= 0)
            throw new IllegalArgumentException("Kapazität muss positiv sein");
        this.kapazitaet = kapazitaet;
    }

    public boolean einlegen(T ware) {
        if (ware == null)
            throw new NullPointerException("Ware fehlt");
        if (inhalt.size() >= kapazitaet)
            return false;
        inhalt.add(ware);
        return true;
    }

    public double gesamtwert() {
        double summe = 0;
        for (T w : inhalt)
            summe += w.getPreis();
        return summe;
    }

    public void umlagernIn(Lagerfach<? super T> ziel) {
        Iterator<T> it = inhalt.iterator();
        while (it.hasNext()) {
            T w = it.next();
            if (!ziel.einlegen(w))
                return;
            it.remove();
        }
    }

    public T teuerstes() { /* Teilaufgabe */ }

    @Override public String toString() { return inhalt.toString(); }
}` }
  ],
  fragen: [

    /* ========== Fallaufgabe ========== */

    { id: 'K90-T09-F01', sec: 'fach', fall: 'L', type: 'mc', wichtig: true, t: 'L1 · Wozu T extends Ware?',
      prompt: 'Warum ist die Klasse als `Lagerfach<T extends Ware>` und nicht einfach als `Lagerfach<T>` deklariert?',
      options: [
        'Damit `gesamtwert` auf jedem Element `getPreis()` aufrufen darf.',
        'Weil ein Typparameter einer Klasse immer einen Bound braucht.',
        'Damit man ein `Lagerfach<Ware>` mit Büchern füllen kann.',
        'Weil `Ware` abstrakt ist und sonst nicht verwendet werden dürfte.'
      ],
      answer: 0,
      explain: 'Mit einem nackten `T` kennt der Compiler nur die Methoden von `Object`: `t.getPreis()` ergäbe „cannot find symbol“. Der Bound garantiert, dass jedes `T` eine `Ware` ist. Nebenbei verhindert er unsinnige Fächer wie `Lagerfach<String>` („not within bounds“). Ein `Lagerfach<Ware>` könnte man auch ohne Bound mit Büchern füllen.' },

    { id: 'K90-T09-F02', sec: 'fach', fall: 'L', type: 'input', wichtig: true, t: 'L2 · Ausgabe vorhersagen',
      prompt: 'Was gibt das Programm aus? (drei Zeilen) `teuerstes()` liefert die Ware mit dem höchsten Preis.',
      code: `Lagerfach<Buch> buecher = new Lagerfach<>(2);
System.out.println(buecher.einlegen(new Buch("Java", 40)) + " "
        + buecher.einlegen(new Buch("SQL", 25.5)) + " "
        + buecher.einlegen(new Buch("Go", 30)));
System.out.println(buecher + " " + buecher.gesamtwert() + " " + buecher.teuerstes().getName());

Lagerfach<Ware> gemischt = new Lagerfach<>(3);
gemischt.einlegen(new Tasse("Becher", 8));
buecher.umlagernIn(gemischt);
System.out.println(gemischt + " " + buecher + " " + gemischt.gesamtwert());`,
      answers: ['true true false\n[Java, SQL] 65.5 Java\n[Becher, Java, SQL] [] 73.5'],
      explain: 'Die Kapazität 2 ist nach zwei Büchern erreicht: „Go“ wird abgelehnt. `teuerstes()` liefert ein `Buch`, deshalb ist `getName()` ohne Cast möglich. `umlagernIn` nimmt `Lagerfach<? super Buch>`, ein `Lagerfach<Ware>` passt also. Das Ziel hat noch zwei freie Plätze, beide Bücher passen hinein und das Bücherfach ist danach leer.' },

    { id: 'K90-T09-F03', sec: 'fach', fall: 'L', type: 'multi', wichtig: true, t: 'L3 · Welche Zeilen kompilieren?',
      prompt: 'Welche Zeilen kompilieren?',
      options: [
        '`Lagerfach<Ware> f = new Lagerfach<Buch>(3);`',
        '`Lagerfach<? extends Ware> f = new Lagerfach<Buch>(3);`',
        '`Lagerfach<?> f = new Lagerfach<Tasse>(3);`',
        '`Lagerfach<String> f = new Lagerfach<>(3);`',
        '`buecherfach.umlagernIn(tassenfach);`',
        '`buecherfach.umlagernIn(warenfach);`'
      ],
      answer: [1, 2, 5],
      explain: 'Keine Polymorphie zwischen spitzen Klammern: `Lagerfach<Buch>` ist kein `Lagerfach<Ware>`. Mit `? extends Ware` oder `?` geht die Zuweisung. `String` ist keine `Ware`: „not within bounds“. `umlagernIn` verlangt `Lagerfach<? super Buch>`: ein Fach für Bücher oder einen Obertyp, ein Tassenfach gehört nicht dazu.' },

    { id: 'K90-T09-F04', sec: 'fach', fall: 'L', type: 'multi', t: 'L4 · Was darf man mit Lagerfach<? extends Ware>?',
      prompt: 'Gegeben `Lagerfach<? extends Ware> f = new Lagerfach<Buch>(3);`. Welche Anweisungen kompilieren?',
      options: [
        '`double d = f.gesamtwert();`',
        '`f.einlegen(new Buch("Go", 30));`',
        '`Ware w = f.teuerstes();`',
        '`Buch b = f.teuerstes();`',
        '`f.einlegen(null);`'
      ],
      answer: [0, 2, 4],
      explain: 'Der Compiler weiß nur: Das Fach ist für **irgendeine** Unterart von Ware. Was herauskommt, ist sicher eine `Ware`, aber nicht sicher ein `Buch`. Hineinlegen kann er nichts prüfen, denn es könnte ein Tassenfach sein. Nur `null` passt immer, und das wirft dann zur Laufzeit die `NullPointerException` aus `einlegen`.' },

    { id: 'K90-T09-F05', sec: 'fach', fall: 'L', type: 'fill', t: 'L5 · Warum ? super T bei umlagernIn?',
      prompt: 'Ergänze die Begründung für den Parameter von `umlagernIn`.',
      code: `// umlagernIn [[0]] Waren vom Typ T an das Ziel ab.
// Das Ziel muss also T-Objekte [[1]] können.
// Das kann jedes Lagerfach für T oder einen [[2]] von T.
public void umlagernIn(Lagerfach<? super T> ziel)`,
      blanks: [
        { options: ['liest', 'gibt', 'vergleicht', 'erzeugt'], answer: 1,
          why: 'Die Waren gehen **aus** dem eigenen Fach **hinaus** an das Ziel. Faustregel: Daten gehen hinaus, also `super`.' },
        { options: ['zurückgeben', 'vergleichen', 'aufnehmen', 'sortieren'], answer: 2,
          why: '`ziel.einlegen(w)` muss ein `T` annehmen.' },
        { options: ['Untertyp', 'Obertyp', 'Interface', 'Typparameter'], answer: 1,
          why: 'Ein Fach für `Ware` nimmt auch Bücher auf, ein Fach für `Tasse` nicht. `? super T` heißt: T oder ein Obertyp.' }
      ],
      explain: 'Mit `Lagerfach<T>` könnte man Bücher nur in ein anderes Bücherfach umlagern, nicht in ein gemischtes Warenfach.' },

    { id: 'K90-T09-F06', sec: 'fach', fall: 'L', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 5, t: 'L6 · teuerstes schreiben',
      prompt: 'Schreibe `teuerstes()` mit JavaDoc: Sie liefert die Ware mit dem höchsten Preis, bei leerem Fach eine `NoSuchElementException`. Begründe den Rückgabetyp.',
      model: 'Kernpunkte: (1) Rückgabetyp **`T`**, nicht `Ware`: Bei einem `Lagerfach<Buch>` bekommt der Aufrufer dann ein `Buch` ohne Cast. (2) `getPreis()` darf aufgerufen werden, weil `T extends Ware` gilt. (3) Leeres Fach vorher prüfen und die Exception dokumentieren. (4) Lokale Variable vom Typ `T`.',
      modelCode: `/**
 * liefert die teuerste Ware in diesem Fach
 * @return die Ware mit dem höchsten Preis
 * @throws NoSuchElementException wenn das Fach leer ist
 */
public T teuerstes() {
    if (inhalt.isEmpty())
        throw new NoSuchElementException("Das Fach ist leer");
    T max = inhalt.get(0);
    for (T w : inhalt)
        if (w.getPreis() > max.getPreis())
            max = w;
    return max;
}`,
      explain: 'Mit Rückgabetyp `Ware` wäre `buecher.teuerstes().getName()` zwar auch möglich, Buch-spezifische Methoden bräuchten dann aber einen Cast, und den sollen Typparameter gerade vermeiden.' },

    /* ========== Einzelfragen ========== */

    { id: 'K90-T09-F07', sec: 'einzel', type: 'input', t: 'Was rät der Compiler?',
      prompt: 'Was gibt das Programm aus?',
      code: `static <X> X waehle(boolean erstes, X a, X b) {
    return erstes ? a : b;
}

Object o = waehle(true, 1, "eins");
System.out.println(o + " " + o.getClass().getSimpleName());`,
      answers: ['1 Integer'],
      explain: 'Der Compiler sucht einen Typ `X`, zu dem 1 (Integer) **und** „eins“ (String) passen, also einen gemeinsamen Obertyp. Das Ergebnis passt in eine `Object`-Variable. Zur Laufzeit ist das zurückgegebene Objekt aber das echte `Integer`. Schreibt man stattdessen `Integer i = waehle(true, 1, "eins");`, lehnt der Compiler ab, denn „eins“ ist kein Integer.' },

    { id: 'K90-T09-F08', sec: 'einzel', type: 'mc', wichtig: true, t: 'static und der Typparameter der Klasse',
      prompt: 'Warum kompiliert `class Speicher<T> { static T letzter; }` nicht?',
      options: [
        'Weil statische Attribute in generischen Klassen grundsätzlich verboten sind.',
        'Weil `T` zu jedem Objekt gehört, ein statisches Attribut aber zu keinem.',
        'Weil statische Attribute immer `final` sein müssen.',
        'Weil der Compiler `T` erst nach dem Konstruktor kennt.'
      ],
      answer: 1,
      explain: 'Jedes Objekt hat seinen eigenen Wert für `T` (`Speicher<String>`, `Speicher<Integer>` …). Ein statisches Attribut gibt es nur einmal für alle Objekte: Welches `T` sollte es haben? Erlaubt sind statische Attribute ohne `T` (z. B. ein Zähler) und statische Methoden mit **eigenem** Typparameter (`static <U> …`).' },

    { id: 'K90-T09-F09', sec: 'einzel', type: 'multi', t: 'Bounds mit &',
      prompt: 'Welche Deklarationen sind korrekt?',
      options: [
        '`class A<T extends Ware & Comparable<T>>`',
        '`class A<T extends Comparable<T> & Ware>`',
        '`class A<T extends Runnable & AutoCloseable>`',
        '`class A<T extends Buch & Tasse>`',
        '`class A<T extends Ware, U extends T>`'
      ],
      answer: [0, 2, 4],
      explain: 'Bei `&`: höchstens **eine Klasse**, und zwar an **erster Stelle**, danach beliebig viele Interfaces. `Buch & Tasse` sind zwei Klassen, verboten. Das Komma trennt **Typparameter**: `U extends T` ist ein zweiter Typparameter mit dem ersten als Bound, das ist erlaubt.' },

    { id: 'K90-T09-F10', sec: 'einzel', type: 'mc', wichtig: true, t: 'Collections.sort und LocalDate',
      prompt: '`Collections.sort` ist als `<T extends Comparable<? super T>> void sort(List<T> list)` deklariert. Was wäre mit `<T extends Comparable<T>>` anders?',
      options: [
        'Man könnte keine `List<String>` mehr sortieren.',
        'Man könnte keine `List<LocalDate>` mehr sortieren.',
        'Man könnte keine Listen mit Duplikaten mehr sortieren.',
        'Es gäbe keinen Unterschied, beide Deklarationen sind gleichwertig.'
      ],
      answer: 1,
      explain: '`String` ist `Comparable<String>` und funktioniert mit beiden. `LocalDate` ist aber `Comparable<ChronoLocalDate>`, also vergleichbar mit einem **Obertyp**, und erfüllt `Comparable<LocalDate>` nicht. Dasselbe gilt für jede Unterklasse, die `compareTo` erbt.' },

    { id: 'K90-T09-F11', sec: 'einzel', type: 'match', wichtig: true, t: 'Faustregel anwenden',
      prompt: 'Ordne jeder Methode den passenden Parameter zu.',
      pairs: [
        ['`double durchschnitt(??? zahlen)`: liest Zahlen', '`Collection<? extends Number>`'],
        ['`void fuelleNullen(??? liste, int n)`: legt n-mal 0 hinein', '`List<? super Integer>`'],
        ['`boolean istLeer(??? c)`: prüft nur die Größe', '`Collection<?>`'],
        ['`<T> void tausche(??? l, int i, int j)`: vertauscht zwei Elemente', '`List<T>`']
      ],
      explain: 'Lesen: `extends`. Schreiben: `super`. Typ egal: `?`. Lesen **und** an anderer Stelle zurückschreiben: ein fester Typ. (Java selbst nimmt bei `Collections.swap` einen Trick mit `List<?>` und einer privaten Hilfsmethode, das gehört aber nicht zum Kurs.)' },

    { id: 'K90-T09-F12', sec: 'einzel', type: 'mc', t: 'Was zur Laufzeit übrig bleibt',
      prompt: 'Welche Aussage über Typparameter zur Laufzeit stimmt?',
      options: [
        '`new ArrayList<String>().getClass() == new ArrayList<Integer>().getClass()` ist `true`.',
        'Zur Laufzeit prüft die JVM bei jedem `add`, ob der Typ zum Typargument passt.',
        '`obj instanceof List<String>` funktioniert, solange `obj` vom Typ `Object` ist.',
        'Für jedes verwendete Typargument erzeugt der Compiler eine eigene, angepasste Klassendatei.'
      ],
      answer: 0,
      explain: 'Der Compiler prüft die Typen und **entfernt** die Typargumente dann (Type Erasure). Zur Laufzeit gibt es nur die eine Klasse `ArrayList`. Deshalb prüft die JVM nichts beim `add` (siehe rohe Typen), `instanceof List<String>` lehnt schon der Compiler ab, und es gibt keine eigenen Klassendateien pro Typargument.' }
  ]
});
