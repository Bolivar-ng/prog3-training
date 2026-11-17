/* Kapitel 05 · Serie S01: Generische Klassen und Methoden schreiben
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K05-S01',
  kapitel: 'K05',
  titel: 'Grundlagen: generische Klassen und Methoden schreiben',
  beschreibung: 'Wozu Typparameter, Deklaration und Benutzung, generische Methoden und ihr Aufruf, Wildcard ?, was mit T verboten ist.',
  neu: true,
  themen: [
    { id: 'zweck',   name: 'Wozu Typparameter?' },
    { id: 'klasse',  name: 'Generische Klassen' },
    { id: 'methode', name: 'Generische Methoden' },
    { id: 'wild',    name: 'Wildcard ?' },
    { id: 'verbot',  name: 'Was nicht geht' }
  ],
  fragen: [

    { id: 'K05-S01-F01', sec: 'zweck', type: 'mc', wichtig: true, t: 'Der Hauptzweck von Typparametern',
      prompt: 'Was ist der wichtigste Vorteil, wenn eine Klasse einen Typparameter hat, statt überall `Object` zu verwenden?',
      options: [
        'Das Programm läuft schneller, weil keine Objekte mehr erzeugt werden müssen.',
        'Man kann auch primitive Typen wie `int` direkt als Typargument benutzen.',
        'Typfehler fallen beim Kompilieren auf, Casts und `instanceof` entfallen.',
        'Die Klasse braucht keine JavaDoc mehr, weil der Typ alles erklärt.'
      ],
      answer: 2,
      explain: 'Mit `Object` müsste man beim Herausholen casten, und ein falscher Typ fiele erst zur **Laufzeit** als `ClassCastException` auf. Mit Typparametern prüft der **Compiler**: Fehlerhafter Code lässt sich gar nicht erst übersetzen und ausliefern. Primitive Typen sind als Typargument nie erlaubt (`Box<int>` ergibt „unexpected type“), und `@param <T>` gehört weiterhin in die JavaDoc.' },

    { id: 'K05-S01-F02', sec: 'zweck', type: 'input', wichtig: true, t: 'Roher Typ: Wann knallt es?',
      prompt: 'Das Programm kompiliert (mit Warnungen). Was gibt es aus? (zwei Zeilen)',
      code: `List roh = new ArrayList<String>();
roh.add(5);
System.out.println("eingefügt");
List<String> texte = roh;
try {
    String s = texte.get(0);
    System.out.println(s);
} catch (ClassCastException e) {
    System.out.println("ClassCastException");
}`,
      answers: ['eingefügt\nClassCastException'],
      explain: 'Über den **rohen Typ** `List` prüft der Compiler nichts mehr, die 5 landet in einer Liste, die eigentlich nur Strings enthalten soll. Der Fehler fällt nicht beim Einfügen auf, sondern erst **viel später** beim Herausholen als String. Genau das sollen Typparameter verhindern. Darum: generische Klassen nie ohne Typargument benutzen und die Warnung „raw type“ ernst nehmen.' },

    { id: 'K05-S01-F03', sec: 'klasse', type: 'fill', wichtig: true, t: 'Eine generische Klasse ergänzen',
      prompt: 'Vervollständige die Klasse, sodass `Box<String> b = new Box<>("Hallo"); int n = b.get().length();` ohne Cast kompiliert.',
      code: `/**
 * eine Kiste, die genau ein Objekt aufbewahrt
 * @param <T> Typ des Inhalts
 */
public class Box[[0]] {
    private [[1]] inhalt;

    public Box(T inhalt) { this.inhalt = inhalt; }

    public [[2]] get() { return inhalt; }
}`,
      blanks: [
        { options: ['(T)', '<T>', '<?>', '[T]'], answer: 1,
          why: 'Der Typparameter wird direkt hinter dem Klassennamen in **spitzen Klammern** deklariert. `<?>` geht hier nicht: Eine Wildcard hat keinen Namen und kann später nicht als Typ benutzt werden.' },
        { options: ['Object', '<T>', 'T', '?'], answer: 2,
          why: 'Innerhalb der Klasse wird `T` wie ein normaler Typname **benutzt**, ohne spitze Klammern. Mit `Object` bräuchte `get()` wieder einen Cast.' },
        { options: ['T', 'Object', 'void', 'Box<T>'], answer: 0,
          why: 'Nur wenn `get` den Typ `T` liefert, weiß der Compiler bei `Box<String>`, dass ein `String` herauskommt, und `length()` ist ohne Cast erlaubt.' }
      ],
      explain: 'Deklariert wird `T` **einmal** hinter dem Klassennamen, benutzt wird es danach als Attribut-, Parameter- und Rückgabetyp. Die Zeile `@param <T> …` in der JavaDoc gehört bei deiner Dozentin dazu.' },

    { id: 'K05-S01-F04', sec: 'klasse', type: 'match', t: 'Was passiert an welcher Stelle?',
      prompt: 'Ordne jedem Codestück zu, was dort mit dem Typparameter passiert.',
      pairs: [
        ['`public class Paar<A, B>`', 'zwei Typparameter einer Klasse deklarieren'],
        ['`public static <T> T erstes(List<T> l)`', 'Typparameter einer Methode deklarieren'],
        ['`private A links;`', 'Typparameter als Typ benutzen'],
        ['`Paar<String, Integer> p = new Paar<>("a", 1);`', 'Typargumente für ein Objekt festlegen'],
        ['`int zaehle(Collection<?> c)`', 'irgendein Typ, der keinen Namen braucht']
      ],
      explain: 'Deklaration: hinter dem Klassennamen bzw. vor dem Rückgabetyp. Danach wird der Name wie ein Typ benutzt. Beim Erzeugen eines Objekts werden die Typargumente festgelegt (rechts genügt der Diamant `<>`). `?` deklariert nichts, es steht nur für einen unbekannten Typ.' },

    { id: 'K05-S01-F05', sec: 'klasse', type: 'input', wichtig: true, t: 'Box mit eigener Methode',
      prompt: 'Was gibt das Programm aus?',
      code: `class Box<T> {
    private T inhalt;
    Box(T inhalt) { this.inhalt = inhalt; }
    T get() { return inhalt; }
    <U> Box<U> umfuellen(U neu) { return new Box<>(neu); }
    @Override public String toString() { return "Box(" + inhalt + ")"; }
}

Box<String> b = new Box<>("Hallo");
Box<Integer> z = b.umfuellen(42);
System.out.println(b.get().length() + " " + z + " " + z.get() * 2);`,
      answers: ['5 Box(42) 84'],
      explain: '`b` ist eine `Box<String>`, `get()` liefert also einen String der Länge 5. `umfuellen` hat einen **eigenen** Typparameter `U`, der pro Aufruf festgelegt wird: Mit 42 ist `U = Integer`, das Ergebnis ist eine `Box<Integer>`. Deshalb darf man `z.get() * 2` ohne Cast rechnen.' },

    { id: 'K05-S01-F06', sec: 'klasse', type: 'input', t: 'Paar mit zwei Typparametern',
      prompt: 'Was gibt das Programm aus?',
      code: `class Paar<A, B> {
    private final A links;
    private final B rechts;
    Paar(A links, B rechts) { this.links = links; this.rechts = rechts; }
    A getLinks() { return links; }
    Paar<B, A> getauscht() { return new Paar<>(rechts, links); }
    @Override public String toString() { return "(" + links + ", " + rechts + ")"; }
}

Paar<String, Integer> p = new Paar<>("Anna", 3);
System.out.println(p + " " + p.getauscht() + " " + p.getauscht().getLinks() * 10);`,
      answers: ['(Anna, 3) (3, Anna) 30'],
      explain: '`getauscht()` liefert ein `Paar<B, A>`, hier also `Paar<Integer, String>`. Links steht dann die 3, und `getLinks()` hat den Typ `Integer`. Deshalb ist `* 10` ohne Cast erlaubt.' },

    { id: 'K05-S01-F07', sec: 'methode', type: 'mc', wichtig: true, t: 'Wo steht <T> bei einer Methode?',
      prompt: 'Welche Deklaration einer generischen Methode ist richtig?',
      options: [
        '`public static T <T> erstes(List<T> liste)`',
        '`public <T> static T erstes(List<T> liste)`',
        '`public static <T> T erstes(List<T> l)`',
        '`public static T erstes(List<T> l)`'
      ],
      answer: 2,
      explain: 'Der Typparameter steht **nach den Modifizierern und direkt vor dem Rückgabetyp**. Ohne `<T>` (`public static T erstes(…)`) ist `T` gar nicht deklariert, der Compiler meldet „cannot find symbol“. `<T>` vor `static` oder hinter dem Rückgabetyp ist ein Syntaxfehler.' },

    { id: 'K05-S01-F08', sec: 'methode', type: 'multi', wichtig: true, t: 'Aufruf mit und ohne explizites Typargument',
      prompt: 'Gegeben ist `static <T> T erstes(List<T> l)` in der Klasse `Main`. Welche Aufrufe (in einer statischen Methode von `Main`) kompilieren?',
      options: [
        '`String s = erstes(List.of("x", "y"));`',
        '`Integer i = Main.<Integer>erstes(List.of(7));`',
        '`Integer i = <Integer>erstes(List.of(7));`',
        '`String s = Main.<String>erstes(List.of(7));`',
        '`Object o = erstes(List.of(1, 2));`'
      ],
      answer: [0, 1, 4],
      explain: 'Meist **errät** der Compiler `T` aus den Argumenten (Inferenz). Explizit geht es nur mit etwas **vor dem Punkt**: Klassenname bei statischen, `this`/Objekt bei Instanzmethoden. Ein nacktes `<Integer>erstes(…)` ist ein Syntaxfehler. Mit `<String>` passt `List.of(7)` nicht mehr, Compilerfehler. Ein `Integer` darf man immer einer `Object`-Variablen zuweisen.' },

    { id: 'K05-S01-F09', sec: 'methode', type: 'mc', wichtig: true, t: 'Faustregel: eigenes T oder Wildcard?',
      prompt: 'Bei welcher Methode ist ein **eigener** Typparameter wirklich nötig?',
      options: [
        '`static int anzahl(List<?> l)`',
        '`static void ausgeben(Collection<?> c)`',
        '`static boolean leer(Map<?, ?> m)`',
        '`static <T> T letztes(List<T> l)`'
      ],
      answer: 3,
      explain: 'Faustregel: Ein eigener Typparameter ist nötig, wenn **derselbe** Typ an **mehreren Stellen** vorkommt. Bei `letztes` muss der Rückgabetyp zum Elementtyp der Liste passen. In den anderen Methoden kommt der Typ nur einmal vor, und welcher es ist, spielt keine Rolle: `?` reicht.' },

    { id: 'K05-S01-F10', sec: 'methode', type: 'mc', t: 'Gleicher Name, anderes T',
      prompt: 'Was passiert bei diesem Code?',
      code: `class Schatten<T> {
    <T> T zeige(T x) { return x; }
}

Schatten<String> s = new Schatten<>();
Integer i = s.zeige(5);
System.out.println(i);`,
      options: [
        'Compilerfehler, weil `T` für dieses Objekt `String` ist.',
        'Es kompiliert und gibt `5` aus.',
        'Es kompiliert, wirft aber eine `ClassCastException`.',
        'Compilerfehler, weil eine Klasse nur ein `T` haben darf.'
      ],
      answer: 1,
      explain: 'Das `<T>` vor dem Rückgabetyp deklariert einen **neuen** Typparameter der Methode, der das `T` der Klasse **verdeckt**. Für diesen Aufruf ist das Methoden-`T` gleich `Integer`. Es ist erlaubt, aber verwirrend: Gib einem Methoden-Typparameter einen anderen Namen (`U`).' },

    { id: 'K05-S01-F11', sec: 'wild', type: 'multi', wichtig: true, t: 'Was geht mit List<?>?',
      prompt: 'Gegeben `List<?> l = new ArrayList<String>();`. Welche Anweisungen kompilieren?',
      options: [
        '`l.add("a");`',
        '`l.add(null);`',
        '`Object o = l.get(0);`',
        '`int n = l.size();`',
        '`List<?> m = new ArrayList<?>();`',
        '`? x = l.get(0);`'
      ],
      answer: [1, 2, 3],
      explain: 'Bei `?` kennt der Compiler den echten Typ nicht. Darum kann er beim Hinzufügen nichts als passend erkennen, außer `null`. Lesen geht als `Object`, und Methoden, die nichts mit dem Elementtyp zu tun haben (`size`), sowieso. `?` darf nur **in spitzen Klammern einer Deklaration** stehen: nie hinter `new` und nie allein als Typ.' },

    { id: 'K05-S01-F12', sec: 'wild', type: 'mc', t: 'List<Object> als Parameter',
      prompt: 'Warum kompiliert `ausgeben(new ArrayList<String>())` nicht, wenn die Methode `static void ausgeben(List<Object> l)` deklariert ist?',
      options: [
        'Weil `String` keine Unterklasse von `Object` ist.',
        'Weil `List<String>` kein Untertyp von `List<Object>` ist.',
        'Weil man einer statischen Methode keine Liste übergeben darf.',
        'Weil `ArrayList` als Parameter immer `ArrayList` verlangt.'
      ],
      answer: 1,
      explain: 'Zwischen spitzen Klammern gibt es **keine Polymorphie**. Sonst könnte `ausgeben` mit `l.add(42)` eine Zahl in die String-Liste legen. Richtig ist `List<?>` (oder `List<? extends Object>`): Dann darf man lesen, aber nichts hinzufügen.' },

    { id: 'K05-S01-F13', sec: 'verbot', type: 'match', wichtig: true, t: 'Verbotenes mit T und die Meldung dazu',
      prompt: 'Ordne jedem Code in `class Klasse<T>` die Meldung des Compilers zu.',
      pairs: [
        ['`T t = new T();`', 'unexpected type'],
        ['`T[] feld = new T[5];`', 'generic array creation'],
        ['`static T zuletzt;`', 'non-static type variable T cannot be referenced from a static context'],
        ['`return o instanceof T;`', 'Object cannot be safely cast to T'],
        ['`class Fehler<T> extends Exception`', 'a generic class may not extend java.lang.Throwable']
      ],
      explain: 'Gemeinsamer Hintergrund: Der Compiler prüft die Typargumente und **entfernt** sie dann (Type Erasure). Zur Laufzeit weiß niemand, was `T` ist: kein Konstruktor, kein Array, kein `instanceof`. `T` gehört zum **Objekt**, deshalb nicht in statischen Teilen, und Exceptions dürfen nicht generisch sein. Statische Methoden dürfen aber ihr **eigenes** `<T>` haben.' },

    { id: 'K05-S01-F14', sec: 'verbot', type: 'input', t: 'Type Erasure sichtbar gemacht',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());
System.out.println(a.getClass().getSimpleName());`,
      answers: ['true\nArrayList'],
      explain: 'Zur Laufzeit gibt es nur **eine** Klasse `ArrayList`, die Typargumente sind „ausradiert“. Genau deshalb sind `new T()`, `new T[…]` und `instanceof List<Integer>` unmöglich: Die Information existiert zur Laufzeit nicht mehr.' },

    { id: 'K05-S01-F15', sec: 'verbot', type: 'mc', wichtig: true, t: 'Überladen mit T',
      prompt: 'Die Klasse hat `void methode(T p)` **und** `void methode(String p)`. Welcher Aufruf führt zu einem Compilerfehler?',
      code: `class Klasse<T> {
    void methode(T p) { System.out.println("T"); }
    void methode(String p) { System.out.println("String"); }
}`,
      options: [
        '`new Klasse<String>().methode("blub");`',
        '`new Klasse<Integer>().methode("blub");`',
        '`new Klasse<Integer>().methode(3);`',
        '`new Klasse<Object>().methode(3);`'
      ],
      answer: 0,
      explain: 'Bei `T = String` passen beide Methoden gleich gut: „reference to methode is ambiguous“. Und es gibt **keine** Schreibweise, mit der man eine von beiden auswählen könnte. Bei `Integer` und `Object` ist jeder Aufruf eindeutig. Lehre: solche Überladungen vermeiden.' },

    { id: 'K05-S01-F16', sec: 'klasse', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 6, t: 'Klasse Paar schreiben',
      prompt: 'Schreibe die unveränderliche generische Klasse `Paar` mit zwei beliebigen, voneinander unabhängigen Typen: Konstruktor, zwei Getter und eine Methode `getauscht()`, die ein neues Paar mit vertauschten Seiten liefert. Mit JavaDoc nach den Regeln deiner Dozentin (Konstruktor und Getter hier knapp).',
      model: 'Kernpunkte: (1) **zwei** Typparameter, weil die Seiten verschiedene Typen haben dürfen, mit Komma getrennt. (2) `@param <A>` und `@param <B>` in der Klassen-JavaDoc. (3) Attribute `private final` vom Typ `A` bzw. `B`. (4) `getauscht()` liefert `Paar<B, A>`, die Typparameter sind ebenfalls vertauscht. (5) Rechts reicht der Diamant `new Paar<>(…)`.',
      modelCode: `/**
 * ein unveränderliches Paar aus zwei Werten
 * @param <A> Typ des linken Werts
 * @param <B> Typ des rechten Werts
 */
public class Paar<A, B> {
    private final A links;
    private final B rechts;

    /**
     * erstellt ein Paar
     * @param links der linke Wert
     * @param rechts der rechte Wert
     */
    public Paar(A links, B rechts) {
        this.links = links;
        this.rechts = rechts;
    }

    /**
     * liefert den linken Wert
     * @return der linke Wert
     */
    public A getLinks() { return links; }

    /**
     * liefert den rechten Wert
     * @return der rechte Wert
     */
    public B getRechts() { return rechts; }

    /**
     * liefert ein neues Paar mit vertauschten Seiten
     * @return das vertauschte Paar
     */
    public Paar<B, A> getauscht() {
        return new Paar<>(rechts, links);
    }
}`,
      explain: 'Ein einziges `T` für beide Seiten wäre zu eng: `Paar<String, Integer>` ginge dann nicht. Weil `getauscht()` ein **neues** Objekt liefert, bleibt das Paar unveränderlich.' }
  ]
});
