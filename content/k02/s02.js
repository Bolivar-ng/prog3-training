/* Kapitel 02 · Serie S02: Interfaces in der Praxis – default-Konflikte, Comparator, Standard-Interfaces, Transfer
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K02-S02',
  kapitel: 'K02',
  titel: 'Interfaces in der Praxis',
  beschreibung: 'Zweite Runde mit neuen Aufgaben: default-Methoden und Namenskonflikte, Comparable und Comparator wie in Übung 2, die Standard-Interfaces, Lambdas mit Zustand und Transfer auf unbekannte Bibliotheksmethoden.',
  neu: true,
  themen: [
    { id: 'default',   name: 'default, static & Konflikte' },
    { id: 'vergleich', name: 'Comparable & Comparator' },
    { id: 'wege',      name: 'Wege & Aufruf' },
    { id: 'funktion',  name: 'Standard-Interfaces & Lambda' },
    { id: 'transfer',  name: 'Transfer: unbekannte Methoden' }
  ],
  fragen: [

    /* ========== default, static & Konflikte ========== */

    { id: 'K02-S02-F01', sec: 'default', type: 'multi', t: 'Korrekt oder falsch: Interfaces',
      prompt: 'Welche Aussagen sind **korrekt**? (mehrere)',
      options: [
        'Eine Klasse kann mehrere Interfaces implementieren, aber nur von einer Klasse erben.',
        'Eine statische Interface-Methode wird an die implementierenden Klassen vererbt.',
        'Ein Interface kann Konstanten enthalten, aber keine Instanzattribute.',
        'Eine default-Methode darf `equals` aus `Object` überschreiben.',
        'Wer eine abstrakte Interface-Methode implementiert, muss sie `public` machen.',
        'Eine abstrakte Klasse, die ein Interface implementiert, muss nicht alle Methoden implementieren.',
        'Von einem Interface erzeugt man mit `new Name()` ein leeres Objekt, dessen Methoden zunächst nichts tun.'
      ],
      answer: [0, 2, 4, 5],
      explain: 'Statische Interface-Methoden werden **nicht** vererbt, man ruft sie nur über den Interface-Namen auf. Eine default-Methode, die eine Methode von `Object` überschreibt, ist ein Compilerfehler (die Klasse gewinnt sowieso immer). Beim Implementieren darf die Sichtbarkeit nicht kleiner werden, deshalb `public`. Eine abstrakte Klasse darf Methoden offen lassen, erst die erste konkrete Unterklasse muss alles füllen. `new Name()` geht bei Interfaces nie.' },

    { id: 'K02-S02-F02', sec: 'default', type: 'input', t: 'Wer gewinnt?',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `interface Konto {
    default String art() { return "Konto"; }
}
interface Giro extends Konto {
    default String art() { return "Giro"; }
}
class Basis {
    public String art() { return "Basis"; }
}
class A implements Konto, Giro { }
class B extends Basis implements Giro { }
class C implements Giro {
    public String art() { return "C+" + Giro.super.art(); }
}

public class Test {
    public static void main(String[] args) {
        Konto[] k = { new A(), new B(), new C() };
        for (Konto x : k) {
            System.out.println(x.art());
        }
    }
}`,
      answers: ['Giro\nBasis\nC+Giro'],
      explain: '`A`: Beide Interfaces liefern `art()`, aber `Giro` erweitert `Konto`, das **spezifischere** Interface gewinnt: `Giro`. `B`: Eine Methode aus einer **Klasse** (hier die Oberklasse `Basis`) geht jeder default-Methode vor: `Basis`. `C` überschreibt selbst und ruft mit `Giro.super.art()` die default-Version auf: `C+Giro`.' },

    { id: 'K02-S02-F03', sec: 'default', type: 'bug', t: 'Namenskonflikt und static',
      prompt: 'Markiere alle Zeilen, die javac als **Compilerfehler** meldet.',
      code: `interface Tolles {
    default String mach() { return "Tolles"; }
    static String info() { return "Info"; }
}
interface Anderes {
    default String mach() { return "Anderes"; }
}
class Beides implements Tolles, Anderes {
}
public class Test {
    public static void main(String[] args) {
        Beides b = new Beides();
        System.out.println(Tolles.info());
        System.out.println(b.info());
    }
}`,
      required: [8, 14],
      explain: 'Zeile 8: `Beides` erbt zwei gleichrangige default-Methoden `mach()`. Keine Regel entscheidet, also muss `Beides` `mach()` selbst überschreiben (javac: „types Tolles and Anderes are incompatible“). Zeile 14: Statische Interface-Methoden werden nicht vererbt, `b.info()` findet nichts. Zeile 13 ist richtig: Aufruf über den Interface-Namen.' },

    { id: 'K02-S02-F04', sec: 'default', type: 'fill', t: 'Konflikt auflösen',
      prompt: '`Beides` soll beide default-Versionen von `mach()` hintereinander verwenden. Vervollständige.',
      code: `class Beides implements Tolles, Anderes {
    @Override
    public String mach() {
        return [[0]].mach() + " und " + [[1]].mach();
    }
}`,
      blanks: [
        { options: ['Tolles.super', 'super', 'Tolles.this', 'this'], answer: 0,
          why: 'Die Syntax ist `Interfacename.super.methode()`. Nur `super` wäre die Oberklasse (hier `Object`), die kein `mach()` hat.' },
        { options: ['Anderes.this', 'Anderes', 'Anderes.super', 'super.Anderes'], answer: 2,
          why: 'Genauso für das zweite Interface. `Anderes.mach()` würde eine statische Methode suchen.' }
      ],
      explain: 'Ergebnis: `Tolles und Anderes`. `Interface.super.m()` ist nur für **direkt** implementierte Interfaces erlaubt.' },

    { id: 'K02-S02-F05', sec: 'default', type: 'mc', t: 'Wozu default-Methoden?',
      prompt: 'Mit Java 8 bekam `Iterable` die Methode `forEach(Consumer<? super T> action)` als **default**-Methode. Warum nicht als normale abstrakte Methode?',
      options: [
        'Weil abstrakte Methoden in Interfaces seit Java 8 grundsätzlich nicht mehr erlaubt sind.',
        'Damit `forEach` schneller läuft als eine for-each-Schleife.',
        'Weil Lambdas nur an default-Methoden übergeben werden dürfen.',
        'Sonst hätte jede vorhandene Klasse mit `Iterable` nicht mehr kompiliert.'
      ],
      answer: 3,
      explain: 'Eine neue abstrakte Methode müssten **alle** bestehenden Klassen implementieren, die das Interface implementieren. Tausende Programme wären kaputt gewesen. Die default-Methode bringt eine fertige Implementierung mit (sie benutzt nur `iterator()`), alte Klassen bekommen sie geschenkt. Das nennt man Interface-Evolution.' },

    { id: 'K02-S02-F06', sec: 'default', type: 'input', t: 'Vergleicher mit default sortiere',
      prompt: 'Der `Vergleicher` aus der Übung, diesmal mit Lambda. Was gibt das Programm aus? (zwei Zeilen)',
      code: `interface Vergleicher {
    int vergleiche(Object a, Object b);

    default boolean isGroesser(Object a, Object b) {
        return vergleiche(a, b) > 0;
    }

    default void sortiere(Object[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - 1 - i; j++) {
                if (isGroesser(array[j], array[j + 1])) {
                    Object hilf = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = hilf;
                }
            }
        }
    }
}

public class Test {
    public static void main(String[] args) {
        Vergleicher laenge = (a, b) -> a.toString().length() - b.toString().length();
        String[] w = { "Sparbuch", "Bank", "Konto", "Zins" };
        laenge.sortiere(w);
        System.out.println(String.join(",", w));
        System.out.println(laenge.isGroesser("Bank", "Zins"));
    }
}`,
      answers: ['Bank,Zins,Konto,Sparbuch'+'\nfalse'],
      explain: '`Vergleicher` ist funktional (nur `vergleiche` ist abstrakt), das Lambda liefert den Vergleich nach Länge, `sortiere` und `isGroesser` kommen geschenkt. BubbleSort tauscht nur bei **echt größer**, darum bleiben `Bank` und `Zins` (beide 4) in ihrer Reihenfolge. `isGroesser("Bank", "Zins")`: 4 − 4 = 0, nicht > 0, also `false`.' },

    /* ========== Comparable & Comparator ========== */

    { id: 'K02-S02-F07', sec: 'vergleich', type: 'fill', t: 'compareTo für Kunde',
      prompt: 'Kunden sollen natürlich nach **Nachname**, bei Gleichstand nach **Vorname** sortiert werden. Vervollständige.',
      code: `public class Kunde implements [[0]] {
    private String vorname;
    private String nachname;

    @Override
    public int compareTo(Kunde other) {
        int erg = this.nachname.compareTo(other.nachname);
        if ([[1]]) {
            erg = this.vorname.compareTo(other.vorname);
        }
        return erg;
    }
}`,
      blanks: [
        { options: ['Comparator<Kunde>', 'Comparable', 'Comparable<Kunde>', 'Comparable<Object>'], answer: 2,
          why: 'Natürliche Ordnung = `Comparable`, mit Typparameter `<Kunde>`, damit `compareTo(Kunde other)` die richtige Signatur hat. Mit rohem `Comparable` müsste der Parameter `Object` sein.' },
        { options: ['erg != 0', 'erg == 0', 'erg < 0', 'erg > 0'], answer: 1,
          why: 'Das zweite Kriterium zählt nur bei **Gleichstand** des ersten, also wenn `compareTo` 0 liefert.' }
      ],
      explain: 'Muster für mehrere Kriterien: erstes vergleichen, nur bei 0 das nächste. Danach `Arrays.sort(kunden)` ohne Comparator, weil die Ordnung in der Klasse selbst steckt.' },

    { id: 'K02-S02-F08', sec: 'vergleich', type: 'input', t: 'Geburtstagskalender',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen) `Kunde` hat `getName()`, `getGeburtstag()` und `toString()` liefert den Namen.',
      code: `Kunde[] kunden = {
    new Kunde("Meier",  LocalDate.of(1990, 12, 3)),
    new Kunde("August", LocalDate.of(2001, 3, 21)),
    new Kunde("Kar",    LocalDate.of(1975, 3, 8)) };

Arrays.sort(kunden, new Comparator<Kunde>() {
    @Override
    public int compare(Kunde k1, Kunde k2) {
        int erg = k1.getGeburtstag().getMonthValue() - k2.getGeburtstag().getMonthValue();
        if (erg == 0) {
            erg = k1.getGeburtstag().getDayOfMonth() - k2.getGeburtstag().getDayOfMonth();
        }
        return erg;
    }
});
System.out.println(Arrays.toString(kunden));

Arrays.sort(kunden, (k1, k2) -> k1.getGeburtstag().compareTo(k2.getGeburtstag()));
System.out.println(Arrays.toString(kunden));`,
      answers: ['[Kar, August, Meier]\n[Kar, Meier, August]'],
      explain: 'Die anonyme Klasse ignoriert das Jahr: erst Monat (März vor Dezember), bei gleichem Monat der Tag (8. vor 21.). Das ist ein Geburtstagskalender. Das Lambda vergleicht das **ganze Datum** (`LocalDate` ist `Comparable`): 1975, 1990, 2001. Hier ist die Subtraktion übrigens unproblematisch, weil Monate und Tage klein sind.' },

    { id: 'K02-S02-F09', sec: 'vergleich', type: 'review', t: 'Review: IbanVergleicher',
      prompt: 'Konten mit der Bankleitzahl `blz` sollen **vor** allen anderen stehen, innerhalb einer Gruppe nach Kontonummer. Welche Befunde treffen zu?',
      code: `public class IbanVergleicher implements Comparator<Konto> {
    private long blz;

    public IbanVergleicher(long blz) {
        this.blz = blz;
    }

    @Override
    public int compare(Konto k1, Konto k2) {
        boolean eigen1 = k1.getBlz() == blz;
        boolean eigen2 = k2.getBlz() == blz;
        if (eigen1 && !eigen2) {
            return 1;
        }
        if (!eigen1 && eigen2) {
            return -1;
        }
        return (int) (k1.getNummer() - k2.getNummer());
    }
}`,
      findings: [
        { text: 'Die Vorzeichen in Zeile 13 und 16 sind vertauscht: eigene Konten landen hinten.', correct: true,
          why: 'Positiv heißt „k1 kommt nach k2“. Ein eigenes `k1` soll aber nach vorne, also muss dort −1 stehen.' },
        { text: 'Zeile 18 kann bei großen Kontonummern ein falsches Vorzeichen liefern.', correct: true,
          why: 'Die Differenz zweier `long` passt nicht immer in `int`, der Cast schneidet ab. Richtig: `Long.compare(k1.getNummer(), k2.getNummer())`.' },
        { text: '`blz` sollte `final` sein, weil der Wert sich nach dem Konstruktor nie ändert.', correct: true,
          why: 'Ein Comparator, dessen Regel sich mitten im Sortieren ändern könnte, wäre gefährlich. `private final long blz` macht das unmöglich.' },
        { text: 'Die Klasse kompiliert nicht, weil `equals` aus `Comparator` fehlt.', correct: false,
          why: '`equals` erbt jede Klasse schon von `Object`. Darum zählt es auch nicht als abstrakte Methode, `Comparator` bleibt funktional.' },
        { text: 'Statt eines Konstruktors müsste `blz` eine statische Konstante sein.', correct: false,
          why: 'Gerade der Konstruktor macht den Vergleicher flexibel: `new IbanVergleicher(12030000)` für eine beliebige Bank.' }
      ],
      explain: 'Eine benannte Comparator-Klasse kann **Zustand** haben, der beim Erzeugen übergeben wird. Das ist ein Vorteil gegenüber einem Lambda, das nur effektiv finale lokale Variablen einfangen kann.' },

    { id: 'K02-S02-F10', sec: 'vergleich', type: 'explain', t: 'Comparable oder Comparator?',
      prompt: 'Im Bankprojekt implementiert `Kunde` `Comparable<Kunde>`, und trotzdem gibt es zusätzlich Comparatoren für Kunden. Erkläre den Unterschied zwischen beiden Interfaces und wann man welches benutzt.',
      model: '`Comparable<T>` (java.lang) wird von der Klasse **selbst** implementiert, Methode `compareTo(T other)`. Es legt die **eine natürliche Ordnung** fest, z. B. Kunden nach Nachname, Vorname, Geburtstag. `Arrays.sort(kunden)` benutzt sie automatisch. `Comparator<T>` (java.util) wird von einer **anderen** Klasse, einer anonymen Klasse oder einem Lambda implementiert, Methode `compare(T a, T b)`. Davon kann es **beliebig viele** geben, z. B. nach Geburtstag im Jahr oder absteigend. Man übergibt ihn: `Arrays.sort(kunden, comparator)`. Comparator braucht man auch, wenn man die Klasse nicht ändern kann (z. B. `String` anders sortieren). Beide liefern negativ / 0 / positiv.' },

    /* ========== Wege & Aufruf ========== */

    { id: 'K02-S02-F11', sec: 'wege', type: 'match', t: 'Welcher Weg passt?',
      prompt: 'Ordne jeder Situation den passenden Weg zu, das Interface zu implementieren.',
      pairs: [
        ['Ein Comparator, den viele Klassen in verschiedenen Packages brauchen', 'benannte Klasse in eigener Datei'],
        ['Braucht nur statische Hilfsdaten der umgebenden Klasse', 'innere statische Klasse'],
        ['Braucht ein privates Instanzattribut und wird mehrfach erzeugt', 'innere nicht-statische Klasse'],
        ['Einmalig, Interface mit zwei abstrakten Methoden', 'anonyme Klasse'],
        ['Einmalig, funktionales Interface, ein kurzer Ausdruck', 'Lambda-Ausdruck']
      ],
      explain: 'Wiederverwendung überall → eigene Datei. Nur statische Elemente → `static` innen. Zugriff auf den Zustand des äußeren Objekts → nicht-statisch innen. Einmalig, aber nicht funktional → anonyme Klasse (ein Lambda geht nur bei genau einer abstrakten Methode). Einmalig und funktional → Lambda.' },

    { id: 'K02-S02-F12', sec: 'wege', type: 'trace', t: 'Anonyme Klasse mit Zustand',
      prompt: 'Trage die Werte der Variablen nach dem Ablauf ein.',
      code: `Supplier<Integer> nummern = new Supplier<Integer>() {
    private int naechste = 100;

    @Override
    public Integer get() {
        naechste = naechste + 10;
        return naechste;
    }
};
int a = nummern.get();
int b = nummern.get();
Supplier<Integer> fest = () -> 100 + 10;
int c = fest.get();
int d = nummern.get();`,
      columns: ['Wert'],
      rows: [
        { label: '`a`', values: ['110'] },
        { label: '`b`', values: ['120'] },
        { label: '`c`', values: ['110'] },
        { label: '`d`', values: ['130'] }
      ],
      explain: 'Die anonyme Klasse hat ein **eigenes Attribut**, das zwischen den Aufrufen erhalten bleibt: 110, 120, später 130. `fest` ist ein Lambda, es hat keinen Zustand und liefert immer 110. Ein Lambda kann kein Attribut deklarieren, das ist einer der Gründe, eine anonyme Klasse zu wählen.' },

    { id: 'K02-S02-F13', sec: 'wege', type: 'bug', t: 'Was darf ein Lambda einfangen?',
      prompt: 'Markiere die Zeilen, an denen javac einen **Compilerfehler** meldet.',
      code: `public class Test {
    private int zaehler = 0;

    public void los(List<String> namen) {
        List<Runnable> aufgaben = new ArrayList<>();
        for (String n : namen) {
            aufgaben.add(() -> System.out.println(n));
        }
        for (int i = 0; i < namen.size(); i++) {
            aufgaben.add(() -> System.out.println(i));
        }
        aufgaben.add(() -> zaehler++);
        String gruss = "Hallo";
        aufgaben.add(() -> System.out.println(gruss));
        gruss = "Hi";
    }
}`,
      required: [10, 14],
      extra: [9, 15],
      explain: 'Zeile 7 ist erlaubt: In der for-each-Schleife ist `n` in **jedem Durchlauf eine neue** Variable, die nie geändert wird, also effektiv final. Zeile 10: `i` wird durch `i++` verändert, nicht effektiv final. Zeile 12 ist erlaubt: `zaehler` ist ein **Attribut**, die Regel gilt nur für lokale Variablen. Zeile 14: Durch die Zuweisung in Zeile 15 ist `gruss` nicht mehr effektiv final. javac meldet 10 und 14, die Ursachen stehen in 9 und 15.' },

    /* ========== Standard-Interfaces & Lambda ========== */

    { id: 'K02-S02-F14', sec: 'funktion', type: 'multi', t: 'Möglich oder Compilerfehler?',
      prompt: 'Welche Zuweisungen **kompilieren**? (mehrere)',
      options: [
        '`Predicate<String> a = s -> s.isEmpty();`',
        '`Supplier<Integer> b = x -> 5;`',
        '`Consumer<String> c = s -> s.length();`',
        '`Runnable e = () -> { return; };`',
        '`Comparator<String> f = (x, y) -> x.length() > y.length();`',
        '`UnaryOperator<String> g = s -> s + "!";`',
        '`Supplier<List<String>> h = () -> new ArrayList<>();`'
      ],
      answer: [0, 2, 3, 5, 6],
      explain: '`Supplier.get()` hat **keinen** Parameter, `x -> 5` passt nicht. `compare` muss einen `int` liefern, nicht `boolean`. Überraschend, aber richtig: `Consumer` erlaubt `s -> s.length()`, weil ein Methodenaufruf auch als Anweisung stehen darf, das Ergebnis wird verworfen. `() -> { return; }` ist ein void-Rumpf mit leerem return, passt zu `run()`.' },

    { id: 'K02-S02-F15', sec: 'funktion', type: 'input', t: 'Predicate kombinieren',
      prompt: 'Was gibt das Programm aus? (vier Zeilen)',
      code: `Predicate<Integer> positiv = x -> x > 0;
Predicate<Integer> gerade  = x -> x % 2 == 0;

System.out.println(positiv.and(gerade).test(-4));
System.out.println(positiv.or(gerade).test(-4));
System.out.println(positiv.negate().and(gerade.negate()).test(-3));
System.out.println(gerade.negate().test(0));`,
      answers: ['false\ntrue\ntrue\nfalse'],
      explain: '−4 ist gerade, aber nicht positiv: `and` → false, `or` → true. −3 ist nicht positiv **und** nicht gerade (in Java ist `-3 % 2` gleich −1): true. 0 ist gerade, verneint: false. `and`, `or`, `negate` sind default-Methoden von `Predicate`.' },

    { id: 'K02-S02-F16', sec: 'funktion', type: 'fill', t: 'arrayAusgeben generisch',
      prompt: 'Die Ausgabemethode aus Übung 2 soll für jeden Elementtyp funktionieren. Vervollständige.',
      code: `public static [[0]] void arrayAusgeben(T[] array, [[1]] format) {
    for (T element : array) {
        System.out.println([[2]]);
    }
}

arrayAusgeben(kunden, k -> k.getNachname() + ", " + k.getVorname());`,
      blanks: [
        { options: ['T', '<T>', '<Object>', 'Generic'], answer: 1,
          why: 'Der Typparameter einer **Methode** steht in spitzen Klammern **vor** dem Rückgabetyp.' },
        { options: ['Consumer<T>', 'Function<String, T>', 'Function<T, String>', 'Supplier<String>'], answer: 2,
          why: 'Rein kommt ein Element vom Typ T, raus ein String: `Function<T, String>`. Die Reihenfolge der Typparameter ist Eingabe, dann Ergebnis.' },
        { options: ['format(element)', 'format.apply(element)', 'format.accept(element)', 'element.apply(format)'], answer: 1,
          why: 'Ein Lambda wird über die Methode seines Interfaces aufgerufen, bei `Function` heißt sie `apply`. `accept` gehört zu `Consumer`.' }
      ],
      explain: 'Beim Aufruf mit `kunden` wird T zu `Kunde`, darum kennt das Lambda `getNachname()`. Mit `Integer[]` und `x -> "#" + (x * 2)` würde dieselbe Methode `#6`, `#20` … ausgeben.' },

    { id: 'K02-S02-F17', sec: 'funktion', type: 'mc', t: 'Welches Interface für diese Methode?',
      prompt: 'Eine Methode soll bei Bedarf ein **neues Testkonto erzeugen**, ohne dass man ihr etwas übergibt. Welcher Parametertyp passt?',
      options: [
        '`Supplier<Konto>`',
        '`Function<Konto, Konto>`',
        '`Consumer<Konto>`',
        '`Predicate<Konto>`'
      ],
      answer: 0,
      explain: 'Nichts rein, ein Konto raus: `Supplier<Konto>` mit `get()`, z. B. `() -> new Girokonto()`. `Consumer` nimmt ein Konto und liefert nichts, `Function` braucht ein Konto als Eingabe, `Predicate` liefert boolean.' },

    { id: 'K02-S02-F18', sec: 'funktion', type: 'order', t: 'Vom Interface zum Lambda',
      prompt: 'Bringe die Entwicklungsstufen „alle Kunden ausgeben, die eine Bedingung erfüllen“ in die richtige Reihenfolge, von der starrsten zur flexibelsten Lösung.',
      items: [
        'Je Bedingung eine eigene Methode, z. B. `druckeGesperrte()`',
        'Eigenes Interface `KundenTest` und eine benannte Klasse, die es implementiert',
        'Dieselbe Methode, der Test als anonyme Klasse übergeben',
        'Der Test als Lambda `k -> k.isGesperrt()`',
        'Eigenes Interface ersetzt durch `Predicate<Kunde>`',
        'Generische Methode mit `Predicate<T>`, `Function<T, R>` und `Consumer<R>`'
      ],
      explain: 'Erst wird die Bedingung aus der Methode herausgezogen (Interface als Parameter). Dann wird das Übergeben immer kürzer: benannte Klasse, anonyme Klasse, Lambda. Danach merkt man, dass das eigene Interface schon als Standard-Interface existiert, und zuletzt macht man alles generisch. Der nächste Schritt wären Streams.' },

    { id: 'K02-S02-F19', sec: 'funktion', type: 'explain', t: 'Target Typing',
      prompt: 'Dasselbe Lambda `k -> k.isGesperrt()` kann einmal einem `Predicate<Kunde>` und einmal einem eigenen `KundenTest` zugewiesen werden. Erkläre, wie der Compiler entscheidet, was das Lambda ist, und warum `var t = (Kunde k) -> k.isGesperrt();` nicht kompiliert.',
      model: 'Ein Lambda hat keinen eigenen Typ. Der Compiler nimmt den **Zieltyp** aus dem Zusammenhang: Typ der Variablen, des Methodenparameters, des return oder eines Casts. Der Zieltyp muss ein funktionales Interface sein. Aus dessen einziger abstrakter Methode ergeben sich Parametertypen und Rückgabetyp, gegen die das Lambda geprüft wird. Deshalb passt dasselbe Lambda zu `Predicate<Kunde>` (`test`) und zu `KundenTest` (`pruefe`), beide nehmen einen Kunden und liefern boolean. Bei `var` gibt es keinen Zieltyp, aus dem Lambda allein kann der Compiler kein Interface ableiten, also Fehler.' },

    /* ========== Transfer ========== */

    { id: 'K02-S02-F20', sec: 'transfer', type: 'input', t: 'Transfer: Map.forEach und removeIf',
      prompt: 'Aus der Dokumentation: `Map<K,V>` hat `default void forEach(BiConsumer<? super K, ? super V> action)`, `BiConsumer<T,U>` hat `void accept(T t, U u)`. `Collection<E>` hat `default boolean removeIf(Predicate<? super E> filter)`. Eine `TreeMap` hält ihre Schlüssel sortiert. Was gibt das Programm aus? (drei Zeilen)',
      code: `Map<Long, String> konten = new TreeMap<>();
konten.put(2002L, "Meier");
konten.put(1001L, "August");
konten.forEach((nr, inhaber) -> System.out.println(nr + ": " + inhaber));

List<String> arten = new ArrayList<>(List.of("Giro", "", "Spar", ""));
arten.removeIf(s -> s.isEmpty());
System.out.println(arten);`,
      answers: ['1001: August\n2002: Meier\n[Giro, Spar]'],
      explain: '`BiConsumer` hat zwei Parameter, deshalb `(nr, inhaber) -> …`. Die `TreeMap` liefert die Schlüssel aufsteigend. `removeIf` ruft das Predicate für jedes Element auf und entfernt alle, für die es `true` liefert, hier die leeren Strings. Beides sind default-Methoden, die erst mit Java 8 dazukamen.' },

    { id: 'K02-S02-F21', sec: 'transfer', type: 'fill', t: 'Transfer: Thread mit Runnable',
      prompt: 'Aus der Dokumentation: `Thread` hat den Konstruktor `Thread(Runnable task)` und die Methode `void start()`, die `run()` des Runnable in einem eigenen Ablauf ausführt. Starte einen Thread, der „Zinsen berechnet“ ausgibt, mit einem **Lambda**.',
      code: `Thread t = new Thread([[0]]);
t.[[1]];`,
      blanks: [
        { options: ['() -> System.out.println("Zinsen berechnet")', '(String s) -> System.out.println("Zinsen berechnet")', 'new Runnable()', 'run -> "Zinsen berechnet"'], answer: 0,
          why: '`run()` hat keinen Parameter und keinen Rückgabewert, also `() -> Anweisung`. Ein Parameter `s` passt nicht, `new Runnable()` ohne Rumpf geht bei Interfaces nicht, ein String als Ergebnis passt nicht zu void.' },
        { options: ['run()', 'start()', 'accept()', 'get()'], answer: 1,
          why: 'Laut Doku startet `start()` den Thread. `t.run()` würde den Code einfach im aktuellen Ablauf ausführen, ohne neuen Thread.' }
      ],
      explain: 'Transfer-Muster: In der Doku nachsehen, welcher Parametertyp verlangt wird, prüfen, ob er ein funktionales Interface ist, und dann dessen einzige abstrakte Methode als Lambda schreiben.' },

    { id: 'K02-S02-F22', sec: 'transfer', type: 'mc', t: 'Transfer: List.sort',
      prompt: '`List<E>` hat `default void sort(Comparator<? super E> c)`. Wird `null` übergeben, gilt die **natürliche Ordnung**. `konten` ist eine `List<Konto>`, `Konto` implementiert `Comparable<Konto>` (nach Kontonummer). Was sortiert nach Kontostand **absteigend**?',
      options: [
        '`konten.sort(null);`',
        '`konten.sort((a, b) -> Double.compare(b.getKontostand(), a.getKontostand()));`',
        '`konten.sort((a, b) -> a.compareTo(b));`',
        '`konten.sort((a, b) -> Double.compare(a.getKontostand(), b.getKontostand()));`'
      ],
      answer: 1,
      explain: 'Absteigend heißt: Argumente vertauscht, also erst `b`, dann `a`. Die letzte Variante sortiert aufsteigend nach Kontostand. `null` und `a.compareTo(b)` benutzen beide die natürliche Ordnung, also Kontonummer.' }
  ]
});
