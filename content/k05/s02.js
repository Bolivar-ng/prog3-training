/* Kapitel 05 · Serie S02: Bounds – extends, super und die Faustregel
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K05-S02',
  kapitel: 'K05',
  titel: 'Bounds: extends, super und die Faustregel',
  beschreibung: 'Upper Bounds mit extends und &, Lower Bounds mit super, was man mit ? extends und ? super lesen und schreiben darf, Comparable<? super T> und java.time.',
  neu: true,
  themen: [
    { id: 'upper', name: 'Upper Bound: extends' },
    { id: 'wildb', name: 'Lesen und schreiben mit ? extends / ? super' },
    { id: 'pecs',  name: 'Faustregel: extends oder super?' },
    { id: 'comp',  name: 'Comparable<? super T>' }
  ],
  fragen: [

    { id: 'K05-S02-F01', sec: 'upper', type: 'mc', wichtig: true, t: 'Methode auf T aufrufen',
      prompt: 'Der Compiler meldet in Zeile 2 „cannot find symbol: method length()“. Wie behebt man das, wenn die Methode für Strings, StringBuilder und andere Zeichenfolgen funktionieren soll?',
      code: `static <T> int gesamtLaenge(List<T> liste) {
    int summe = 0;
    for (T x : liste) summe += x.length();
    return summe;
}`,
      options: [
        '`x` vor dem Aufruf mit `(String) x` casten.',
        'Den Typparameter als `<T extends CharSequence>` deklarieren.',
        'Den Parameter als `List<?>` deklarieren.',
        'Den Typparameter als `<T implements CharSequence>` deklarieren.'
      ],
      answer: 1,
      explain: 'Bei einem nackten `T` kennt der Compiler nur die Methoden von `Object`. Ein **Upper Bound** garantiert mehr: Jedes `T` ist dann eine `CharSequence` und hat `length()`. Der Cast wäre unsicher (ein StringBuilder ist kein String), `List<?>` hilft nicht, und es heißt **immer `extends`**, auch bei Interfaces.' },

    { id: 'K05-S02-F02', sec: 'upper', type: 'fill', wichtig: true, t: 'Das größte Element finden',
      prompt: 'Vervollständige die Methode, die das größte Element einer Liste liefert.',
      code: `static <T [[0]] Comparable<T>> T groesstes(List<T> liste) {
    T max = liste.get(0);
    for (T x : liste)
        if (x.[[1]](max) > 0)
            max = x;
    return max;
}`,
      blanks: [
        { options: ['implements', 'extends', 'super', '&'], answer: 1,
          why: 'Bounds bei Typparametern heißen immer `extends`, auch wenn danach ein Interface steht. `super` gibt es nur bei der Wildcard `?`.' },
        { options: ['compare', 'equals', 'compareTo', 'max'], answer: 2,
          why: 'Genau diese Methode garantiert der Bound `Comparable<T>`. `compare` gehört zum `Comparator` und hätte zwei Parameter.' }
      ],
      explain: 'Mit `List.of(3, 9, 4)` liefert die Methode 9, mit `List.of("kiwi", "apfel")` „kiwi“. Ohne Bound wäre `x.compareTo(…)` ein Compilerfehler. Wie man den Bound noch allgemeiner macht, zeigt das Thema `Comparable<? super T>`.' },

    { id: 'K05-S02-F03', sec: 'upper', type: 'mc', wichtig: true, t: 'Komma oder &?',
      prompt: 'Was deklariert `class Ablage<T extends Comparable<T>, Serializable>`?',
      options: [
        'Zwei Typparameter: `T` mit Bound und einen zweiten namens `Serializable`.',
        'Einen Typparameter `T`, der Comparable und Serializable sein muss.',
        'Nichts, das Komma ist an dieser Stelle ein Syntaxfehler.',
        'Einen Typparameter `T`, der wahlweise Comparable **oder** Serializable sein muss.'
      ],
      answer: 0,
      explain: 'Das Komma **trennt Typparameter**. Der zweite Name ist hier einfach ein weiterer Typparameter, der zufällig `Serializable` heißt und das echte Interface verdeckt. Darum verbindet man mehrere Bedingungen für **ein** `T` mit `&`: `<T extends Comparable<T> & Serializable>`, gelesen als „und außerdem“.' },

    { id: 'K05-S02-F04', sec: 'upper', type: 'multi', t: 'Welche Bounds kompilieren?',
      prompt: 'Welche Methodendeklarationen kompilieren?',
      options: [
        '`static <T extends Number & Comparable<T>> void m(T t)`',
        '`static <T extends Comparable<T> & Number> void m(T t)`',
        '`static <T implements Comparable<T>> void m(T t)`',
        '`static <T extends Runnable & Comparable<T>> void m(T t)`',
        '`static <T super Integer> void m(T t)`'
      ],
      answer: [0, 3],
      explain: 'Regeln für `&`: beliebig viele Interfaces, höchstens **eine Klasse**, und die muss **zuerst** stehen (sonst „interface expected here“). `implements` ist in spitzen Klammern ein Syntaxfehler. `super` gibt es nur bei der Wildcard `?`, nie bei einem benannten Typparameter.' },

    { id: 'K05-S02-F05', sec: 'upper', type: 'mc', t: 'Wohin gehört der Bound?',
      prompt: 'Welche Schreibweise ist richtig, damit `m` nur vergleichbare Objekte annimmt?',
      options: [
        '`public void m(T extends Comparable<T> param)`',
        '`public void <T extends Comparable<T>> m(T p)`',
        '`public <T extends Comparable<T>> void m(T p)`',
        '`public <T> void m(T extends Comparable<T> wert)`'
      ],
      answer: 2,
      explain: 'Der Bound steht dort, wo `T` **deklariert** wird: bei Methoden vor dem Rückgabetyp, bei Klassen hinter dem Klassennamen. Beim Parameter wird `T` nur noch benutzt, dort ist `extends` ein Syntaxfehler.' },

    { id: 'K05-S02-F06', sec: 'upper', type: 'bug', t: 'Wo muss man reparieren?',
      prompt: 'Der Compiler meldet einen Fehler in Zeile 4. Markiere die Zeile, die man **ändern** muss, und erkläre wie.',
      code: `static <T> T groesstes(List<T> liste) {
    T max = liste.get(0);
    for (T x : liste)
        if (x.compareTo(max) > 0)
            max = x;
    return max;
}`,
      required: [1],
      extra: [4],
      model: 'Zeile 4 ist nur die Stelle, an der der Fehler **auffällt** (`compareTo` gibt es auf einem nackten `T` nicht). Beheben muss man ihn bei der **Deklaration** in Zeile 1: `static <T extends Comparable<? super T>> T groesstes(List<T> liste)`. Dann garantiert der Compiler, dass jedes `T` ein `compareTo` hat. Ein Cast in Zeile 4 wäre die schlechte Lösung.',
      explain: 'Fehlermeldungen zeigen auf die **Benutzung**, die Ursache liegt oft bei der **Deklaration**.' },

    { id: 'K05-S02-F07', sec: 'wildb', type: 'multi', wichtig: true, t: 'Lesen und schreiben mit ? extends',
      prompt: 'Gegeben `List<? extends Number> l = new ArrayList<Integer>();`. Welche Anweisungen kompilieren?',
      options: [
        '`Number n = l.get(0);`',
        '`l.add(1);`',
        '`Integer i = l.get(0);`',
        '`l.add(null);`',
        '`l = new ArrayList<Double>();`',
        '`l = new ArrayList<Object>();`'
      ],
      answer: [0, 3, 4],
      explain: '`? extends Number` heißt: eine Liste von **irgendeinem** Untertyp von Number. Was herauskommt, ist sicher eine `Number`, also kann man als Number lesen. Ob es eine Integer- oder Double-Liste ist, weiß der Compiler nicht: kein Lesen als `Integer`, kein Hinzufügen (außer `null`). Zuweisen darf man jede Liste von Number oder Untertypen, `Object` ist kein Untertyp.' },

    { id: 'K05-S02-F08', sec: 'wildb', type: 'multi', wichtig: true, t: 'Lesen und schreiben mit ? super',
      prompt: 'Gegeben `List<? super Integer> l = new ArrayList<Number>();`. Welche Anweisungen kompilieren?',
      options: [
        '`l.add(5);`',
        '`Integer i = l.get(0);`',
        '`Object o = l.get(0);`',
        '`l = new ArrayList<Object>();`',
        '`l = new ArrayList<Double>();`',
        '`l.add(2.5);`'
      ],
      answer: [0, 2, 3],
      explain: '`? super Integer` heißt: eine Liste von Integer **oder einem Obertyp** (Number, Object …). Ein `Integer` passt in jede davon, also darf man Integer hinzufügen. Was herauskommt, kann aber irgendein Object sein: Lesen nur als `Object`. `Double` ist kein Obertyp von Integer, und `2.5` passt nicht sicher hinein.' },

    { id: 'K05-S02-F09', sec: 'wildb', type: 'input', wichtig: true, t: 'summe und fuelleBis',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `static double summe(Collection<? extends Number> c) {
    double s = 0;
    for (Number n : c) s += n.doubleValue();
    return s;
}
static void fuelleBis(List<? super Integer> liste, int n) {
    for (int i = 1; i <= n; i++) liste.add(i);
}

System.out.println(summe(List.of(1, 2)) + " " + summe(Set.of(2.5)) + " " + summe(List.<Number>of(1, 0.5)));
List<Number> zahlen = new ArrayList<>();
fuelleBis(zahlen, 3);
List<Object> gemischt = new ArrayList<>(List.of("a"));
fuelleBis(gemischt, 2);
System.out.println(zahlen + " " + gemischt);`,
      answers: ['3.0 2.5 1.5\n[1, 2, 3] [a, 1, 2]'],
      explain: '`summe` **liest** nur, darum `? extends Number`: Listen und Sets von Integer, Double oder Number passen. `doubleValue()` liefert immer ein `double`, daher `3.0`. `fuelleBis` **schreibt** Integer hinein, darum `? super Integer`: Eine Number- oder Object-Liste kann Integer aufnehmen. Eine `List<Double>` würde der Compiler hier ablehnen.' },

    { id: 'K05-S02-F10', sec: 'pecs', type: 'match', wichtig: true, t: 'Die passende Signatur',
      prompt: 'Ordne jeder Aufgabe den allgemeinsten passenden Parametertyp zu.',
      pairs: [
        ['Addiert alle Zahlen einer Sammlung', '`Collection<? extends Number>`'],
        ['Legt die Zahlen 1 bis n in eine Liste', '`List<? super Integer>`'],
        ['Zählt nur, wie viele Elemente es gibt', '`Collection<?>`'],
        ['Liest Elemente vom Typ T und schreibt sie in dieselbe Liste zurück', '`List<T>`'],
        ['Ein Vergleicher, dem man zwei T übergibt', '`Comparator<? super T>`']
      ],
      explain: 'Faustregel: Daten **kommen in deinen Code hinein** (du liest): `extends`. Daten **gehen hinaus** an den Parameter (du schreibst oder übergibst): `super`. Beides: ein fester Typ. Typ egal: `?`. Ein Comparator bekommt Elemente **übergeben**, er ist ein „Verbraucher“, darum `? super T`, wie bei `TreeSet(Comparator<? super E>)`.' },

    { id: 'K05-S02-F11', sec: 'pecs', type: 'fill', wichtig: true, t: 'kopiere(quelle, ziel)',
      prompt: 'Die Methode soll alle Elemente von `quelle` nach `ziel` kopieren, und zwar so allgemein wie möglich: z. B. Integer in eine `List<Object>`.',
      code: `static <T> void kopiere(Collection<[[0]]> quelle, Collection<[[1]]> ziel) {
    for (T x : quelle)
        ziel.add(x);
}`,
      blanks: [
        { options: ['? super T', '? extends T', '?', 'Object'], answer: 1,
          why: 'Aus der Quelle wird nur **gelesen**: Jedes Element ist mindestens ein `T`. Mit `?` wäre `T x : quelle` ein Compilerfehler, man bekäme nur `Object`.' },
        { options: ['? extends T', 'T', '? super T', '?'], answer: 2,
          why: 'Ins Ziel wird **geschrieben**: Es muss `T` aufnehmen können, also T oder ein Obertyp. Mit `? extends T` wäre `add` verboten, mit genau `T` ginge keine `List<Object>` als Ziel.' }
      ],
      explain: 'Das ist das Paradebeispiel für die Faustregel, genau so ist `Collections.copy(List<? super T> dest, List<? extends T> src)` deklariert. `kopiere(List.of(1, 2), new ArrayList<Object>())` kompiliert damit.' },

    { id: 'K05-S02-F12', sec: 'pecs', type: 'input', t: 'Comparator für den Obertyp',
      prompt: 'Was gibt das Programm aus?',
      code: `class Tier {
    final String name;
    Tier(String name) { this.name = name; }
    public String toString() { return name; }
}
class Hund extends Tier { Hund(String name) { super(name); } }

Comparator<Tier> nachName = Comparator.comparing(t -> t.name);
TreeSet<Hund> hunde = new TreeSet<>(nachName);
hunde.addAll(List.of(new Hund("Rex"), new Hund("Bello"), new Hund("Wuff")));
System.out.println(hunde);`,
      answers: ['[Bello, Rex, Wuff]'],
      explain: 'Der Konstruktor ist `TreeSet(Comparator<? super E> c)`. Für ein `TreeSet<Hund>` passt also auch ein `Comparator<Tier>`: Wer Tiere vergleichen kann, kann auch Hunde vergleichen. Mit einem Parametertyp `Comparator<E>` müsste man für jede Unterklasse einen eigenen Comparator schreiben.' },

    { id: 'K05-S02-F13', sec: 'comp', type: 'mc', wichtig: true, t: 'Hund ist Comparable<Tier>',
      prompt: '`Tier implements Comparable<Tier>`, `Hund extends Tier`. Was passiert bei `max(hunde)` mit einer `List<Hund> hunde`?',
      code: `static <T extends Comparable<T>> T max(List<T> liste) { … }`,
      options: [
        'Es kompiliert, weil `Hund` von `Tier` das `compareTo` erbt.',
        'Es kompiliert, wirft aber beim Vergleichen zur Laufzeit eine `ClassCastException`.',
        'Es kompiliert nur, wenn `Hund` selbst `compareTo` überschreibt.',
        'Compilerfehler: `Hund` ist `Comparable<Tier>`, nicht `Comparable<Hund>`.'
      ],
      answer: 3,
      explain: 'Für `T = Hund` verlangt der Bound `Comparable<Hund>`. Hund erbt aber `Comparable<Tier>`, und wegen fehlender Polymorphie in spitzen Klammern ist das etwas anderes. Auch Überschreiben ändert daran nichts. Die Lösung: `<T extends Comparable<? super T>>` erlaubt ein `compareTo`, das für T **oder einen Obertyp** definiert ist.' },

    { id: 'K05-S02-F14', sec: 'comp', type: 'mc', wichtig: true, t: 'LocalDate und Comparable',
      prompt: 'Warum lehnt der Compiler `max(List.of(LocalDate.now()))` ab, wenn `max` als `<T extends Comparable<T>> T max(List<T> l)` deklariert ist?',
      options: [
        '`LocalDate` implementiert `Comparable` gar nicht.',
        'Datumswerte lassen sich in Java nur mit einem `Comparator` vergleichen.',
        '`List.of` liefert eine unveränderliche Liste, die eine generische Methode wie `max` nicht lesen darf.',
        '`LocalDate` ist `Comparable<ChronoLocalDate>`, nicht `Comparable<LocalDate>`.'
      ],
      answer: 3,
      explain: '`LocalDate` implementiert das Interface `ChronoLocalDate`, und **dieses** erweitert `Comparable<ChronoLocalDate>`. Ein LocalDate vergleicht sich also mit dem Obertyp, genau wie der Hund mit dem Tier. Mit `<T extends Comparable<? super T>>` funktioniert es. Darum lohnt sich das Paket `java.time` zum Ausprobieren von Bounds.' },

    { id: 'K05-S02-F15', sec: 'comp', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 6, t: 'minimum so allgemein wie möglich',
      prompt: 'Schreibe eine statische Methode `minimum`, die das kleinste Element einer **beliebigen Collection** liefert. Sie soll mit `List<Hund>` (Hund erbt `Comparable<Tier>`), `Set<LocalDate>` und `List<Integer>` funktionieren. Bei einer leeren Collection wirft sie eine `NoSuchElementException`. Begründe jeden Bound in einem Satz.',
      model: 'Kernpunkte: (1) `<T extends Comparable<? super T>>`: T muss vergleichbar sein, das `compareTo` darf aber auch von einem **Obertyp** stammen (Hund/Tier, LocalDate/ChronoLocalDate). (2) Parameter `Collection<? extends T>`: Es wird nur **gelesen**, also darf es auch eine Collection eines Untertyps sein, und Collection statt List, weil keine Reihenfolge gebraucht wird. (3) Leere Collection vorher prüfen. (4) Rückgabe `T`. Darum braucht man ein eigenes T: Elementtyp und Rückgabetyp hängen zusammen.',
      modelCode: `/**
 * liefert das kleinste Element einer Collection
 * @param <T> Typ der Elemente
 * @param c die zu durchsuchende Collection
 * @return das kleinste Element
 * @throws NoSuchElementException wenn c leer ist
 */
public static <T extends Comparable<? super T>> T minimum(Collection<? extends T> c) {
    if (c.isEmpty())
        throw new NoSuchElementException("Die Collection ist leer");
    T min = null;
    for (T x : c)
        if (min == null || x.compareTo(min) < 0)
            min = x;
    return min;
}`,
      explain: 'Genau so (mit derselben Bound-Idee) sind `Collections.min` und `Collections.sort` in der Java-Bibliothek deklariert. Mit `<T extends Comparable<T>>` und `List<T>` gingen weder die Hunde noch das Set von LocalDate.' },

    { id: 'K05-S02-F16', sec: 'pecs', type: 'review', t: 'Signaturen im Review',
      prompt: 'Eine Kommilitonin hat diese Signaturen geschrieben. Welche Befunde treffen zu?',
      code: `static double summe(List<Number> zahlen)
static <T> int anzahl(Collection<T> c)
static void sortiere(List<? extends Comparable> liste)
static <T extends Comparable<? super T>> void sortiere2(List<T> liste)`,
      findings: [
        { text: '`summe` kann keine `List<Integer>` annehmen, besser `Collection<? extends Number>`.', correct: true,
          why: '`List<Integer>` ist kein `List<Number>`. Da nur gelesen wird, ist `? extends Number` richtig, und Collection reicht, weil die Reihenfolge egal ist.' },
        { text: 'Bei `anzahl` ist das eigene `T` überflüssig, `Collection<?>` reicht.', correct: true,
          why: 'T kommt nur einmal vor. Faustregel: dann genügt die Wildcard.' },
        { text: 'In `sortiere` steckt ein roher Typ: `Comparable` ohne Typargument.', correct: true,
          why: 'Rohe Typen schalten die Typprüfung aus. Außerdem kann man in eine `? extends`-Liste beim Sortieren nicht zurückschreiben.' },
        { text: '`sortiere2` ist falsch, weil `? super` nur bei Rückgabetypen erlaubt ist.', correct: false,
          why: '`? super` ist innerhalb eines Bounds völlig korrekt. Genau so ist `Collections.sort` deklariert.' },
        { text: '`sortiere2` braucht `List<T>` und keine Wildcard, weil gelesen und zurückgeschrieben wird.', correct: true,
          why: 'Wer liest **und** schreibt, braucht einen festen Typ.' }
      ],
      explain: 'Drei echte Mängel (zu enger Typ, überflüssiges T, roher Typ) und eine korrekte Signatur. `sortiere2` ist das Vorbild.' }
  ]
});
