/* Kapitel 02 · Serie S01: Interfaces – Grundlagen, Wege, compareTo, instanceof, Lambda
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K02-S01',
  kapitel: 'K02',
  titel: 'Interfaces: Grundlagen bis Lambda',
  beschreibung: 'Alles aus der Vorlesung zu Interfaces: verwenden, schreiben, die vier Wege, this, compareTo im Konto, instanceof und Lambda-Ausdrücke. Vorbereitung auf den Moodle-Test.',
  neu: true,
  themen: [
    { id: 'grund',    name: 'Interface schreiben & verwenden' },
    { id: 'wege',     name: 'Die Wege der Implementierung' },
    { id: 'compare',  name: 'Comparable & compareTo' },
    { id: 'inst',     name: 'instanceof' },
    { id: 'lambda',   name: 'Funktionale Interfaces & Lambda' }
  ],
  fragen: [

    /* ========== Interface schreiben & verwenden ========== */

    { id: 'K02-S01-F01', sec: 'grund', type: 'mc', t: 'Welche Zeile kompiliert nicht?',
      prompt: '`Konto` implementiert `Comparable<Konto>`. Welche Zeile führt zu einem **Compilerfehler**?',
      options: [
        '`Comparable<Konto> c = new Konto();`',
        '`Comparable<Konto> c = new Comparable<>();`',
        '`Object o = new Konto();`',
        '`Comparable<Konto> c = null;`'
      ],
      answer: 1,
      explain: 'Von einem Interface kann man kein Objekt mit `new` erzeugen, es hat keinen Konstruktor. Man braucht immer eine Klasse, die das Interface implementiert. Eine Variable vom Interface-Typ darf aber ein `Konto`-Objekt oder `null` aufnehmen.' },

    { id: 'K02-S01-F02', sec: 'grund', type: 'multi', t: 'Was gilt automatisch im Interface?',
      prompt: 'Welche Aussagen über die Mitglieder eines Interfaces sind **richtig**? (mehrere)',
      options: [
        '`int MAX = 5;` ist automatisch `public static final`.',
        '`void zeige();` ist automatisch `public abstract`.',
        'Ein Interface kann private Instanzattribute haben.',
        'Jede default-Methode muss überschrieben werden.',
        'Ein Interface darf mehrere Interfaces erweitern.'
      ],
      answer: [0, 1, 4],
      explain: 'Variablen in Interfaces sind automatisch Konstanten (`public static final`), es gibt also keine Instanzattribute. Abstrakte Methoden sind automatisch `public abstract`. default-Methoden **können** überschrieben werden, müssen aber nicht. Mit `extends A, B` darf ein Interface mehrere Interfaces erweitern.' },

    { id: 'K02-S01-F03', sec: 'grund', type: 'mc', t: 'Methode mit Interface-Parameter aufrufen',
      prompt: 'In der Doku steht: `public static void tutWasTolles(Interfacename parameter)`. `MeineKlasse` implementiert `Interfacename`. Welcher Aufruf ist richtig?',
      options: [
        '`Interfacename x = new Interfacename(); tutWasTolles(x);`',
        '`tutWasTolles((Interfacename) new Object());`',
        '`tutWasTolles(new MeineKlasse());`',
        '`tutWasTolles(Interfacename.class);`'
      ],
      answer: 2,
      explain: 'Gebraucht wird ein Objekt, das zum Interface-Typ passt, also ein Objekt einer implementierenden Klasse. `new Interfacename()` geht nicht (kein Konstruktor). Der Cast von `Object` kompiliert zwar, wirft aber zur Laufzeit eine `ClassCastException`. `Interfacename.class` ist ein `Class`-Objekt, kein `Interfacename`.' },

    { id: 'K02-S01-F04', sec: 'grund', type: 'input', t: 'default-Methode',
      prompt: 'Was gibt das Programm aus?',
      code: `interface Gruss {
    String name();

    default String hallo() {
        return "Hallo " + name() + "!";
    }
}

public class Test {
    public static void main(String[] args) {
        Gruss g = () -> "Welt";
        System.out.println(g.hallo());

        Gruss h = new Gruss() {
            @Override
            public String name() { return "Konto"; }

            @Override
            public String hallo() { return "Hi " + name(); }
        };
        System.out.println(h.hallo());
    }
}`,
      answers: ['Hallo Welt!\nHi Konto'],
      explain: '`Gruss` ist funktional (nur `name()` ist abstrakt), also geht ein Lambda. `g.hallo()` ist die default-Methode, die `name()` aufruft: `Hallo Welt!`. Die anonyme Klasse überschreibt `hallo()`, also wird ihre Version benutzt: `Hi Konto` (ohne Ausrufezeichen).' },

    /* ========== Die Wege der Implementierung ========== */

    { id: 'K02-S01-F05', sec: 'wege', type: 'match', t: 'Wer darf worauf zugreifen?',
      prompt: 'Ordne jeder Art von Klasse zu, worauf sie in der umgebenden Klasse `Ausfuehrung` zugreifen darf.',
      pairs: [
        ['Benannte Klasse in eigener Datei', 'auf keine privaten Elemente'],
        ['Innere statische Klasse', 'nur auf statische Elemente, auch private'],
        ['Innere nicht-statische Klasse', 'auf alle Elemente, auch private Instanzvariablen'],
        ['Anonyme Klasse in einer Methode', 'auf alle Elemente und effektiv finale lokale Variablen']
      ],
      explain: 'Je enger die Klasse an `Ausfuehrung` hängt, desto mehr sieht sie. Die statische innere Klasse hat kein äußeres Objekt, also keine Instanzvariablen. Die nicht-statische innere Klasse gehört zu einem Objekt und sieht alles. Die anonyme Klasse sieht zusätzlich lokale Variablen, aber nur effektiv finale.' },

    { id: 'K02-S01-F06', sec: 'wege', type: 'bug', t: 'Statische innere Klasse',
      prompt: 'Diese Klasse kompiliert nicht. Markiere die fehlerhafte Zeile.',
      code: `public class Ausfuehrung {
    private int faktor = 3;
    private static int zaehler = 0;

    private static class TutWas implements Rechner {
        @Override
        public int rechne(int x) {
            zaehler++;
            return x * faktor;
        }
    }
}`,
      required: [9],
      explain: '`TutWas` ist `static`, hat also kein `Ausfuehrung`-Objekt. Auf die Instanzvariable `faktor` kann sie nicht zugreifen (javac: „non-static variable faktor cannot be referenced from a static context“). Zeile 8 ist in Ordnung: `zaehler` ist statisch, und private ist für innere Klassen kein Hindernis.' },

    { id: 'K02-S01-F07', sec: 'wege', type: 'fill', t: 'Objekt einer inneren Klasse erzeugen',
      prompt: 'Vervollständige die Erzeugung eines `TutWas`-Objekts in einer anderen Klasse desselben Packages. `TutWas` ist eine **nicht-statische** innere Klasse von `Ausfuehrung`.',
      code: `Ausfuehrung a = new Ausfuehrung();
Rechner r = [[0]] TutWas();`,
      blanks: [
        { options: ['a.new', 'new Ausfuehrung.', 'Ausfuehrung.new', 'new a.'], answer: 0,
          why: 'Zu jedem `Ausfuehrung`-Objekt gehört eine eigene innere Klasse. Deshalb wird über das äußere Objekt erzeugt: `a.new TutWas()`. `new Ausfuehrung.TutWas()` ist die Schreibweise für eine **statische** innere Klasse.' }
      ],
      explain: 'Statisch: `new Ausfuehrung.TutWas()`. Nicht-statisch: `aeusseresObjekt.new TutWas()`. Innerhalb einer Instanzmethode von `Ausfuehrung` reicht `new TutWas()`, weil `this` das äußere Objekt ist.' },

    { id: 'K02-S01-F08', sec: 'wege', type: 'input', t: 'this und Aussen.this',
      prompt: 'Was gibt `new Aussen().los()` aus?',
      code: `interface Sprecher {
    String sag();
}

public class Aussen {
    private String name = "Aussen";

    public void los() {
        Sprecher s = new Sprecher() {
            private String name = "Anonym";

            @Override
            public String sag() {
                return this.name + "/" + Aussen.this.name;
            }
        };
        System.out.println(s.sag());
        System.out.println(name);
    }
}`,
      answers: ['Anonym/Aussen\nAussen'],
      explain: 'In der anonymen Klasse ist `this` das anonyme Objekt, also `this.name` = `Anonym`. `Aussen.this` ist das umgebende `Aussen`-Objekt: `Aussen`. Die zweite Ausgabe steht in `los()` selbst, dort gibt es nur das `name` von `Aussen`.' },

    { id: 'K02-S01-F09', sec: 'wege', type: 'bug', t: 'Effektiv final',
      prompt: 'Diese Methode kompiliert nicht. Markiere die Zeile, die man **entfernen** muss, damit sie kompiliert.',
      code: `public void starte() {
    int zaehler = 0;
    Runnable r = new Runnable() {
        @Override
        public void run() {
            System.out.println(zaehler);
        }
    };
    zaehler++;
    r.run();
}`,
      required: [9],
      extra: [6],
      explain: 'Eine anonyme Klasse darf nur effektiv finale lokale Variablen benutzen. Durch `zaehler++` in Zeile 9 ist `zaehler` nicht mehr effektiv final, auch wenn die Änderung **nach** der anonymen Klasse steht. javac meldet den Fehler in Zeile 6 („must be final or effectively final“), die Ursache ist aber Zeile 9.' },

    { id: 'K02-S01-F10', sec: 'wege', type: 'mc', t: 'Welchen Weg wählen?',
      prompt: 'Die Implementierung braucht die **private Instanzvariable** `kurs` von `Ausfuehrung`, hat zwei Methoden und wird in drei Methoden von `Ausfuehrung` gebraucht. Was passt am besten?',
      options: [
        'Eine benannte Klasse in einer eigenen Datei',
        'Eine innere statische Klasse',
        'Ein Lambda-Ausdruck pro Stelle',
        'Eine innere nicht-statische Klasse'
      ],
      answer: 3,
      explain: 'Nur innere nicht-statische (und anonyme) Klassen sehen private Instanzvariablen. Eine anonyme Klasse müsste an drei Stellen wiederholt werden. Ein Lambda scheidet aus, weil das Interface zwei Methoden hat, also nicht funktional ist. Die statische innere Klasse sieht `kurs` nicht, die eigene Datei auch nicht.' },

    /* ========== Comparable & compareTo ========== */

    { id: 'K02-S01-F11', sec: 'compare', type: 'mc', t: 'compareTo im Konto',
      prompt: '`Konto` hat das Attribut `private long nummer` und soll **aufsteigend nach Kontonummer** sortiert werden. Welche Implementierung von `compareTo(Konto k)` ist richtig?',
      options: [
        '`return Long.compare(k.nummer, this.nummer);`',
        '`return (int) (this.nummer - k.nummer);`',
        '`return Long.compare(this.nummer, k.nummer);`',
        '`return this.nummer < k.nummer ? -1 : 1;`'
      ],
      answer: 2,
      explain: 'Negativ, wenn `this` kleiner ist: genau das liefert `Long.compare(this.nummer, k.nummer)`. Mit vertauschten Argumenten wird absteigend sortiert. Die Subtraktion kann bei `long` überlaufen, und der Cast auf `int` schneidet ab, das Vorzeichen kann falsch sein. Die letzte Variante liefert nie 0, ist also nicht konsistent mit `equals`.' },

    { id: 'K02-S01-F12', sec: 'compare', type: 'multi', t: 'Richtige compareTo-Varianten',
      prompt: 'Welche Rümpfe von `compareTo(Konto k)` sortieren **korrekt aufsteigend** nach `long nummer`? (mehrere)',
      options: [
        '`if (nummer < k.nummer) return -1; if (nummer > k.nummer) return 1; return 0;`',
        '`return Long.valueOf(nummer).compareTo(k.nummer);`',
        '`return Long.compare(nummer, k.nummer);`',
        '`return Long.signum(k.nummer - nummer);`',
        '`return nummer == k.nummer ? 0 : 1;`'
      ],
      answer: [0, 1, 2],
      explain: 'Die if-Variante, `Long.valueOf(...).compareTo(...)` und `Long.compare` liefern alle negativ / 0 / positiv in der richtigen Richtung. `signum(k.nummer - nummer)` ist vertauscht (absteigend) und kann überlaufen. Die letzte Variante sagt nie „kleiner“, damit ist keine Sortierung möglich.' },

    { id: 'K02-S01-F13', sec: 'compare', type: 'input', t: 'Sortieren mit Comparator',
      prompt: 'Was gibt das Programm aus? (`List.sort` ist stabil: Gleiche Elemente behalten ihre Reihenfolge.)',
      code: `List<String> l = new ArrayList<>(List.of("Konto", "Bank", "Sparbuch", "Geld"));
l.sort((x, y) -> Integer.compare(x.length(), y.length()));
System.out.println(l);
l.sort((x, y) -> y.compareTo(x));
System.out.println(l);`,
      answers: ['[Bank, Geld, Konto, Sparbuch]\n[Sparbuch, Konto, Geld, Bank]'],
      explain: 'Erst nach Länge: `Bank` und `Geld` haben beide 4 Zeichen und bleiben in ihrer Reihenfolge, dann `Konto` (5), `Sparbuch` (8). Danach `y.compareTo(x)`: vertauschte Argumente, also alphabetisch **absteigend**.' },

    { id: 'K02-S01-F14', sec: 'compare', type: 'explain', t: 'Konsistent mit equals',
      prompt: 'Warum muss `compareTo` konsistent mit `equals` sein? Erkläre an einem Beispiel, was sonst schiefgeht.',
      model: 'Konsistent heißt: `a.equals(b)` ist genau dann `true`, wenn `a.compareTo(b) == 0`. Sortierte Strukturen wie `TreeSet` oder `TreeMap` benutzen nur `compareTo`, Hash-Strukturen wie `HashSet` nur `equals`/`hashCode`. Beispiel: `compareTo` vergleicht Konten nur nach Kontostand, `equals` nach Kontonummer. Zwei verschiedene Konten mit gleichem Kontostand gelten im `TreeSet` als gleich, das zweite wird nicht eingefügt. Im `HashSet` sind beide drin. Dieselben Objekte verhalten sich je nach Collection anders, das ist ein schwer zu findender Fehler.' },

    /* ========== instanceof ========== */

    { id: 'K02-S01-F15', sec: 'inst', type: 'input', t: 'instanceof und null',
      prompt: 'Was gibt das Programm aus?',
      code: `Object o = null;
System.out.println(o instanceof String);

Object k = "Konto";
if (k instanceof String s && s.length() > 3) {
    System.out.println(s.toUpperCase());
}

Object z = 42;
System.out.println(z instanceof Comparable);`,
      answers: ['false\nKONTO\ntrue'],
      explain: '`null instanceof X` ist immer `false`. Beim Pattern Matching ist `s` schon im Rest der Bedingung nach `&&` benutzbar. `42` wird zu einem `Integer`, und `Integer` implementiert `Comparable`. instanceof prüft auch Interfaces.' },

    { id: 'K02-S01-F16', sec: 'inst', type: 'review', t: 'instanceof im Bankprojekt',
      prompt: 'Welche Befunde treffen auf diesen Code zu?',
      code: `public double gebuehr(Konto k) {
    if (k instanceof Girokonto) {
        Girokonto g = (Girokonto) k;
        return g.getDispo() > 0 ? 5.0 : 2.0;
    } else if (k instanceof Sparbuch) {
        return 0.0;
    }
    return 1.0;
}`,
      findings: [
        { text: 'Die alte instanceof-Form mit eigenem Cast sollte nicht mehr verwendet werden.', correct: true,
          why: 'Mit Pattern Matching (`k instanceof Girokonto g`) entfällt der Cast in Zeile 3.' },
        { text: 'Besser wäre eine Methode `gebuehr()` in `Konto`, die die Unterklassen überschreiben.', correct: true,
          why: 'Das ist Polymorphie. Eine neue Kontoart müsste sonst auch diese Methode ändern.' },
        { text: 'Zeile 5 wirft eine `NullPointerException`, wenn `k` `null` ist.', correct: false,
          why: '`null instanceof X` liefert einfach `false`, es fliegt keine Exception. Die Methode gibt dann 1.0 zurück.' },
        { text: 'Der Cast in Zeile 3 kann eine `ClassCastException` werfen.', correct: false,
          why: 'Vorher wurde mit instanceof geprüft, der Cast ist hier sicher. Er ist nur überflüssig.' }
      ],
      explain: 'Frau Hubrichs Regel: instanceof möglichst vermeiden, lieber Polymorphie. Wenn es doch nötig ist, dann die neue Form mit Pattern Matching.' },

    /* ========== Funktionale Interfaces & Lambda ========== */

    { id: 'K02-S01-F17', sec: 'lambda', type: 'mc', t: 'Funktional oder nicht?',
      prompt: 'Welcher Typ ist ein **funktionales Interface**, sodass ein Lambda-Ausdruck möglich ist?',
      options: [
        'Ein Interface mit einer abstrakten und zwei default-Methoden',
        'Eine abstrakte Klasse mit genau einer abstrakten Methode',
        'Ein Interface mit zwei abstrakten Methoden',
        'Ein Interface ohne abstrakte Methode, aber mit `@FunctionalInterface`'
      ],
      answer: 0,
      explain: 'Funktional heißt: genau **eine** abstrakte Methode. default- und static-Methoden zählen nicht. Eine abstrakte Klasse ist nie ein funktionales Interface, auch mit nur einer abstrakten Methode. Ohne abstrakte Methode wäre die Annotation ein Compilerfehler.' },

    { id: 'K02-S01-F18', sec: 'lambda', type: 'multi', t: 'Gültige Lambda-Ausdrücke',
      prompt: 'Gegeben ist `interface Rechner { int rechne(int x); }`. Welche Zuweisungen `Rechner r = …;` **kompilieren**? (mehrere)',
      options: [
        '`x -> x + 1`',
        '`int x -> x + 1`',
        '`(x) -> { x + 1; }`',
        '`(int x) -> x + 1`',
        '`bla -> { return bla * 2; }`'
      ],
      answer: [0, 3, 4],
      explain: 'Mit Typ braucht der Parameter Klammern, also ist `int x -> …` falsch. Mit geschweiften Klammern braucht man `return` (`{ x + 1; }` ist keine Anweisung). Der Parametername ist frei wählbar, `bla` ist in Ordnung.' },

    { id: 'K02-S01-F19', sec: 'lambda', type: 'mc', t: 'var und Lambda',
      prompt: 'Warum kompiliert `var f = (int x) -> x + 1;` nicht?',
      options: [
        'Weil der Rückgabetyp `int` fehlt.',
        'Weil der Compiler das Interface nicht erraten kann.',
        'Weil `var` nur mit `new` erlaubt ist.',
        'Weil `x` keinen Namen haben darf.'
      ],
      answer: 1,
      explain: 'Ein Lambda-Ausdruck braucht einen Zieltyp: das funktionale Interface, das er implementiert. Den liest der Compiler aus dem Typ der Variablen oder des Parameters ab. Bei `var` gibt es keinen Typ, javac meldet „lambda expression needs an explicit target-type“.' },

    { id: 'K02-S01-F20', sec: 'lambda', type: 'match', t: 'Standard-Interfaces',
      prompt: 'Ordne jedem Interface aus `java.util.function` (bzw. `java.lang`) seine abstrakte Methode zu.',
      pairs: [
        ['Predicate<T>', 'boolean test(T t)'],
        ['Consumer<T>', 'void accept(T t)'],
        ['Function<T,R>', 'R apply(T t)'],
        ['Supplier<T>', 'T get()'],
        ['BinaryOperator<T>', 'T apply(T t1, T t2)'],
        ['Runnable', 'void run()']
      ],
      explain: 'Predicate prüft, Consumer verbraucht (kein Rückgabewert), Function wandelt um, Supplier liefert, BinaryOperator fasst zwei gleiche Werte zusammen, Runnable führt eine Aktion ohne Parameter aus.' }
  ]
});
