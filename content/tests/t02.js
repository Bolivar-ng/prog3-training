/* Probetest T02: Code lesen und Fehler finden (Praxis), 40 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java (Java 25) geprüft. */
P3.serie({
  id: 'K90-T02',
  kapitel: 'K90',
  titel: 'Praxis: Code lesen und Fehler finden',
  beschreibung: 'Wie die E-Klausur: Ausgaben vorhersagen, Fehler markieren, Lücken füllen, Code reviewen. Polymorphie und Überladen aus Prog 2, dazu Exceptions, equals, Lambda und innere Klassen aus Prog 3.',
  neu: true,
  dauer: 40,
  themen: [
    { id: 'oop',    name: 'Vererbung & Polymorphie' },
    { id: 'exc',    name: 'Exceptions & equals' },
    { id: 'lambda', name: 'Lambda & innere Klassen' },
    { id: 'algo',   name: 'Sortieren & Tests' }
  ],
  fragen: [

    { id: 'K90-T02-F01', sec: 'oop', type: 'input', t: 'Dynamische Bindung',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `class Konto {
    public String art() { return "Konto"; }
    public static String info() { return "static Konto"; }
    public String beschreibe() { return art() + "/" + info(); }
}

class Girokonto extends Konto {
    @Override
    public String art() { return "Giro"; }
    public static String info() { return "static Giro"; }
}

// in main:
Konto k = new Girokonto();
System.out.println(k.art());
System.out.println(k.beschreibe());
System.out.println(Konto.info());`,
      answers: ['Giro\nGiro/static Konto\nstatic Konto'],
      explain: 'Objektmethoden werden **dynamisch** gebunden: Entscheidend ist der Typ des Objekts (Girokonto), also `art()` → `Giro`, auch innerhalb von `beschreibe()`. Statische Methoden werden **nicht** überschrieben, nur verdeckt: In `Konto.beschreibe()` ist `info()` fest `Konto.info()`.' },

    { id: 'K90-T02-F02', sec: 'oop', type: 'input', t: 'Überladen: statischer Typ',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `static void zeige(Object o) { System.out.println("Object"); }
static void zeige(String s) { System.out.println("String"); }

// in main:
Object o = "Hallo";
String s = "Hallo";
zeige(o);
zeige(s);
zeige((String) o);`,
      answers: ['Object\nString\nString'],
      explain: 'Welche **überladene** Methode genommen wird, entscheidet der Compiler anhand des **statischen** Typs der Variablen, nicht des Objekts. `o` hat den Typ `Object`, also `zeige(Object)`, obwohl ein String drinsteckt. Nach dem Cast ist der statische Typ `String`. Überladen = Compilezeit, Überschreiben = Laufzeit.' },

    { id: 'K90-T02-F03', sec: 'oop', type: 'input', t: 'Konstruktorkette',
      prompt: 'Was gibt `new Sparbuch();` aus? (drei Zeilen)',
      code: `class Konto {
    Konto() {
        this("ohne Inhaber");
        System.out.println("Konto()");
    }
    Konto(String inhaber) {
        System.out.println("Konto(" + inhaber + ")");
    }
}

class Sparbuch extends Konto {
    Sparbuch() {
        System.out.println("Sparbuch()");
    }
}`,
      answers: ['Konto(ohne Inhaber)\nKonto()\nSparbuch()'],
      explain: 'Ohne `super(...)` oder `this(...)` setzt Java als erste Zeile von `Sparbuch()` automatisch `super()` ein. `Konto()` ruft zuerst `this("ohne Inhaber")` auf, das gibt zuerst aus. Danach geht es in `Konto()` weiter, zuletzt im Rumpf von `Sparbuch()`. Oberklasse wird immer vor der Unterklasse fertig.' },

    { id: 'K90-T02-F04', sec: 'oop', type: 'mc', t: 'Down-Cast',
      prompt: '`Girokonto` und `Sparbuch` erben beide von `Konto`. Was passiert?',
      code: `Konto k = new Sparbuch();
Girokonto g = (Girokonto) k;
System.out.println("ok");`,
      options: [
        '`ClassCastException` in Zeile 2',
        'Ausgabe `ok`',
        'Compilerfehler in Zeile 2',
        '`NullPointerException` in Zeile 3'
      ],
      answer: 0,
      explain: 'Der Compiler erlaubt den Cast, weil eine `Konto`-Variable grundsätzlich auf ein Girokonto zeigen **könnte**. Erst zur Laufzeit stellt die JVM fest, dass es ein Sparbuch ist. Deshalb verlangt Frau Hubrich: Down-Casts vermeiden.' },

    { id: 'K90-T02-F05', sec: 'exc', type: 'input', t: 'try – catch – finally',
      prompt: 'Was gibt das Programm aus? (sieben Zeilen)',
      code: `static int teste(int x) {
    try {
        System.out.println("try");
        if (x < 0) throw new IllegalArgumentException("negativ");
        return 1;
    } catch (IllegalArgumentException e) {
        System.out.println("catch " + e.getMessage());
        return 2;
    } finally {
        System.out.println("finally");
    }
}

// in main:
System.out.println(teste(5));
System.out.println(teste(-5));`,
      answers: ['try\nfinally\n1\ntry\ncatch negativ\nfinally\n2'],
      explain: '`finally` läuft **immer**, auch nach einem `return`, aber **bevor** der Rückgabewert beim Aufrufer ankommt. Deshalb steht `finally` vor `1` bzw. vor `2`.' },

    { id: 'K90-T02-F06', sec: 'exc', type: 'input', t: 'equals mit falscher Signatur',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `class Kunde {
    private final String name;
    Kunde(String name) { this.name = name; }

    public boolean equals(Kunde k) {
        return k != null && name.equals(k.name);
    }
}

// in main:
List<Kunde> liste = new ArrayList<>();
liste.add(new Kunde("Anna"));
Kunde anna = new Kunde("Anna");
System.out.println(anna.equals(new Kunde("Anna")));
System.out.println(liste.contains(anna));`,
      answers: ['true\nfalse'],
      explain: '`equals(Kunde k)` **überlädt** `equals(Object)`, es überschreibt es nicht. Der direkte Aufruf mit einem `Kunde` findet die eigene Methode: `true`. `contains` ruft aber `equals(Object)` auf, also die Version von `Object` (Identität): `false`. Mit `@Override` hätte der Compiler den Fehler sofort gemeldet.' },

    { id: 'K90-T02-F07', sec: 'exc', type: 'bug', t: 'Exception-Unsinn',
      prompt: 'Markiere alle Zeilen, die gegen die Exception-Regeln von Frau Hubrich verstoßen.',
      code: `/**
 * hebt den Betrag ab
 * @param betrag abzuhebender Betrag
 * @throws GesperrtException wenn das Konto gesperrt ist
 */
public void abheben(Geldbetrag betrag) throws GesperrtException {
    try {
        if (this.gesperrt)
            throw new GesperrtException(this.nummer);
        this.kontostand = this.kontostand.minus(betrag);
    } catch (GesperrtException e) {
        e.printStackTrace();
    }
}`,
      required: [9, 11, 12],
      extra: [6],
      explain: 'Die Exception wird selbst geworfen (Zeile 9) und sofort selbst gefangen (Zeile 11): Der Aufrufer erfährt nie, dass das Konto gesperrt war. Nur `printStackTrace` (Zeile 12) ist keine Fehlerbehandlung. Außerdem stimmt dann das `throws` in Zeile 6 nicht mehr. Richtig: try/catch weglassen, die Exception an den Aufrufer weitergeben.' },

    { id: 'K90-T02-F08', sec: 'exc', type: 'fill', t: 'equals nach Kursstil',
      prompt: 'Vervollständige `equals` für `Kunde` (gleich bei gleichem Nachnamen und Geburtstag).',
      code: `@Override
public boolean equals(Object other) {
    if (this == other)
        return true;
    if (other == null || [[0]])
        return false;
    Kunde k = [[1]];
    return this.nachname.equals(k.nachname) && [[2]];
}`,
      blanks: [
        { options: ['this.getClass() != other.getClass()', '!(other instanceof Object)', 'this.hashCode() != other.hashCode()', 'other.equals(this)'], answer: 0,
          why: 'Wie in der Kunde-Klasse aus der Übung: Nur Objekte genau derselben Klasse können gleich sein. `other instanceof Object` ist immer true, und `other.equals(this)` ruft sich selbst endlos auf.' },
        { options: ['(Kunde) other', 'other', 'new Kunde(other)', '(Object) this'], answer: 0,
          why: 'Nach der Klassenprüfung ist der Cast sicher. Ohne Cast hat `other` den Typ `Object` und kennt `nachname` nicht.' },
        { options: ['this.geburtstag.equals(k.geburtstag)', 'this.geburtstag == k.geburtstag', 'this.geburtstag.compareTo(k.geburtstag) > 0', 'this.vorname.equals(k.vorname)'], answer: 0,
          why: '`LocalDate` ist ein Objekt: Inhalt mit `equals` vergleichen, nicht mit `==` (Identität). Der Vorname gehört laut Vorgabe nicht dazu, und `hashCode` muss dieselben Attribute benutzen.' }
      ],
      explain: 'Aufbau: Identität → null und Klasse → Cast → Attribute mit `equals` vergleichen. `hashCode` muss genau dieselben Attribute benutzen: `Objects.hash(nachname, geburtstag)`.' },

    { id: 'K90-T02-F09', sec: 'lambda', type: 'input', t: 'Lambda und Attribut',
      prompt: 'Was gibt `new Zaehler().los()` aus?',
      code: `public class Zaehler {
    private int zaehler = 0;

    public void los() {
        Runnable r = () -> zaehler++;
        r.run();
        r.run();
        Runnable s = new Runnable() {
            @Override
            public void run() { zaehler += 10; }
        };
        s.run();
        System.out.println(zaehler);
    }
}`,
      answers: ['12'],
      explain: '„Effektiv final“ gilt nur für **lokale** Variablen. `zaehler` ist ein Attribut, es wird über das äußere Objekt erreicht (eigentlich `Zaehler.this.zaehler`) und darf verändert werden. 0 + 1 + 1 + 10 = 12.' },

    { id: 'K90-T02-F10', sec: 'lambda', type: 'bug', t: 'Was kompiliert nicht?',
      prompt: 'Markiere alle Zeilen, die einen **Compilerfehler** verursachen.',
      code: `public class Ausfuehrung {
    private int faktor = 3;

    private static class Statisch implements Rechner {
        @Override
        public int rechne(int x) { return x * faktor; }
    }

    public void los() {
        int basis = 5;
        Rechner a = x -> x + basis;
        Rechner b = (int x) -> x * 2;
        Rechner c = (x, y) -> x + y;
        basis = 7;
    }
}
// interface Rechner { int rechne(int x); }`,
      required: [6, 11, 13],
      extra: [14],
      explain: 'Zeile 6: Eine **statische** innere Klasse kennt kein äußeres Objekt, also kein `faktor`. Zeile 11: `basis` wird in Zeile 14 geändert, ist also nicht effektiv final (javac meldet den Fehler beim Lambda). Zeile 13: `rechne` hat nur **einen** Parameter. Zeile 12 ist korrekt. Hinweis: javac meldet den Fehler in Zeile 11 erst, wenn die anderen beiden behoben sind, weil „effektiv final“ in einer späteren Compiler-Phase geprüft wird.' },

    { id: 'K90-T02-F11', sec: 'lambda', type: 'fill', t: 'Function übergeben',
      prompt: 'Vervollständige die Methode aus der Übung und ihren Aufruf so, dass jedes Datum im langen Format ausgegeben wird.',
      code: `public static void arrayAusgeben(LocalDate[] daten, [[0]] formatierung) {
    for (LocalDate datum : daten) {
        System.out.println(formatierung.[[1]](datum));
    }
}

// in main:
DateTimeFormatter df = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG);
arrayAusgeben(termine, [[2]]);`,
      blanks: [
        { options: ['Function<LocalDate, String>', 'Function<String, LocalDate>', 'Consumer<LocalDate>', 'Supplier<String>'], answer: 0,
          why: 'Aus einer `LocalDate` (T) wird ein `String` (R): `Function<T, R>`. Consumer gibt nichts zurück, Supplier hat keinen Parameter.' },
        { options: ['apply', 'accept', 'get', 'test'], answer: 0,
          why: 'Die abstrakte Methode von `Function` heißt `apply`. `accept` gehört zu Consumer, `get` zu Supplier, `test` zu Predicate.' },
        { options: ['d -> df.format(d)', 'df.format(d)', '(LocalDate d) -> { df.format(d); }', 'd -> { df.format(d) }'], answer: 0,
          why: 'Übergeben wird ein **Lambda**, nicht das Ergebnis. Mit geschweiften Klammern fehlt das `return`, die letzte Variante hat außerdem kein Semikolon.' }
      ],
      explain: 'Die Methode legt den Ablauf fest (Schleife, Ausgabe), das Detail „wie formatiere ich ein Datum“ kommt von außen. Genau die Idee von Interfaces.' },

    { id: 'K90-T02-F12', sec: 'algo', type: 'trace', t: 'BubbleSort verfolgen',
      prompt: 'BubbleSort aus der Vorlesung mit `x = {4, 1, 3, 2}`. Trage nach **jedem Durchlauf der while-Schleife** das Array und den Wert von `unsortiert` ein.',
      code: `boolean unsortiert = true;
while (unsortiert) {
    unsortiert = false;
    for (int i = 0; i < x.length - 1; i++) {
        if (x[i] > x[i + 1]) {
            int temp = x[i];
            x[i] = x[i + 1];
            x[i + 1] = temp;
            unsortiert = true;
        }
    }
}`,
      columns: ['x nach dem Durchlauf', 'unsortiert'],
      rows: [
        { label: 'Durchlauf 1', values: [['[1, 3, 2, 4]', '1, 3, 2, 4', '{1, 3, 2, 4}'], 'true'] },
        { label: 'Durchlauf 2', values: [['[1, 2, 3, 4]', '1, 2, 3, 4', '{1, 2, 3, 4}'], 'true'] },
        { label: 'Durchlauf 3', values: [['[1, 2, 3, 4]', '1, 2, 3, 4', '{1, 2, 3, 4}'], 'false'] }
      ],
      explain: 'Im ersten Durchlauf wandert die 4 ganz nach hinten. Im zweiten wird noch einmal getauscht (3 und 2), also bleibt `unsortiert` true. Erst ein Durchlauf **ohne** Tausch beendet die Schleife, das kostet einen dritten Durchlauf.' },

    { id: 'K90-T02-F13', sec: 'algo', type: 'fill', t: 'assertThrows mit Lambda',
      prompt: 'Vervollständige den Test: Abheben von einem gesperrten Konto soll eine `GesperrtException` werfen.',
      code: `@Test
void abhebenGesperrt() {
    Girokonto g = new Girokonto(kunde, 1234, new Geldbetrag(500));
    g.sperren();
    assertThrows([[0]], [[1]]);
}`,
      blanks: [
        { options: ['GesperrtException.class', 'new GesperrtException()', 'GesperrtException', '"GesperrtException"'], answer: 0,
          why: '`assertThrows` erwartet ein `Class`-Objekt der erwarteten Exception.' },
        { options: ['() -> g.abheben(new Geldbetrag(10))', 'g.abheben(new Geldbetrag(10))', 'g -> g.abheben(new Geldbetrag(10))', 'new Geldbetrag(10)'], answer: 0,
          why: 'Der zweite Parameter ist ein funktionales Interface (`Executable`, Methode `void execute()`, ohne Parameter). Also ein Lambda ohne Parameter. Ohne Lambda würde `abheben` sofort ausgeführt, die Exception flöge vor `assertThrows`.' }
      ],
      explain: 'Hier trifft Kapitel 2 auf das Testen: JUnit nimmt den Code, der werfen soll, als Lambda entgegen und führt ihn selbst in einem try/catch aus.' },

    { id: 'K90-T02-F14', sec: 'algo', type: 'review', t: 'Review: Vergleicher',
      prompt: 'Welche Befunde treffen auf diesen `KontoVergleicher` zu?',
      code: `public class KontoVergleicher implements Vergleicher {
    @Override
    public int vergleichen(Object a, Object b) {
        Konto ka = (Konto) a;
        Konto kb = (Konto) b;
        return (int) (ka.getKontostand().getCent() - kb.getKontostand().getCent());
    }
}`,
      findings: [
        { text: 'Die Subtraktion kann bei großen Beträgen überlaufen und ein falsches Vorzeichen liefern.', correct: true,
          why: 'Differenz von zwei `long` → Cast auf `int` schneidet ab. Besser `Long.compare` oder `compareTo` von Geldbetrag.' },
        { text: 'Bei zwei Sparbüchern wirft die Methode eine `ClassCastException`.', correct: false,
          why: 'Ein Sparbuch **ist** ein Konto, der Cast auf `Konto` klappt. Er scheitert nur bei Objekten, die gar keine Konten sind.' },
        { text: 'Laut JavaDoc von `Vergleicher` soll für Nicht-Konten eine `IllegalArgumentException` kommen, hier kommt eine `ClassCastException`.', correct: true,
          why: 'Die Lösung aus der Übung prüft deshalb mit Pattern-instanceof und wirft sonst selbst `IllegalArgumentException`.' },
        { text: 'Die Klasse kompiliert nicht, weil `sortiere` nicht implementiert ist.', correct: false,
          why: '`sortiere` ist eine **default**-Methode im Interface und muss nicht implementiert werden. Nur `vergleichen` ist abstrakt.' }
      ],
      explain: 'Das Interface ist ein Vertrag, und zur JavaDoc gehören auch die Exceptions. Dazu kommt der klassische Subtraktions-Fehler bei Vergleichen.' },

    { id: 'K90-T02-F15', sec: 'algo', type: 'explain', t: 'Wer testet, testet alles',
      prompt: 'Ein Kommilitone testet `Sparbuch.abheben` nur mit einem Aufruf: 100 € von einem Konto mit 500 € abheben, Ergebnis 400 €. Nenne mindestens **vier** weitere Testfälle, die fehlen, und begründe kurz, warum jeder nötig ist.',
      model: '1) Betrag größer als Kontostand → muss abgelehnt werden (Sparbuch hat keinen Dispo), Kontostand bleibt gleich. 2) Monatslimit: mehrere Abhebungen im selben Monat bis genau 2000 € erlaubt, 2000,01 € abgelehnt (Grenzwert). 3) Monatswechsel: Mit einem Test-Kalender in den nächsten Monat springen, das Limit muss zurückgesetzt sein. 4) Negativer Betrag → IllegalArgumentException (assertThrows). 5) `null` als Betrag → NullPointerException. 6) Gesperrtes Konto → GesperrtException, Kontostand unverändert. 7) Abheben von 0 €. Jeder Test prüft einen anderen Pfad im Code. Nur der „Normalfall“ lässt alle Fehlerfälle und Grenzen ungetestet.' },

    { id: 'K90-T02-F16', sec: 'oop', type: 'input', t: 'Unveränderlicher Geldbetrag',
      prompt: '`Geldbetrag` ist unveränderlich, `plus` liefert ein **neues** Objekt. Was wird ausgegeben? (drei Zeilen)',
      code: `Geldbetrag a = new Geldbetrag(1000);   // Cent
Geldbetrag b = new Geldbetrag(250);
a.plus(b);
System.out.println(a);
Geldbetrag c = a.plus(b);
System.out.println(c);
a = c.plus(c);
System.out.println(a);
// toString liefert z. B. "10,00 EUR"`,
      answers: ['10,00 EUR\n12,50 EUR\n25,00 EUR'],
      explain: 'Zeile 3 erzeugt ein neues Objekt und wirft es sofort weg, `a` bleibt 10,00 EUR. Bei unveränderlichen Klassen (wie String) muss man das Ergebnis immer zuweisen.' }
  ]
});
