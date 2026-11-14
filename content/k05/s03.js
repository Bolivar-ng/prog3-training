/* Kapitel 05 · Serie S03: Fallaufgaben – eigene generische Klassen bauen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   faelle: gemeinsame Ausgangslage mehrerer Teilaufgaben (Feld fall in der Frage).
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K05-S03',
  kapitel: 'K05',
  titel: 'Fallaufgaben: eigene generische Klassen bauen',
  beschreibung: 'Zwei größere Aufgaben wie in der Prüfung: eine sortierte Rangliste mit Zulassungsregel und eine Hilfsklasse mit generischen Methoden. Ergänzen, vorhersagen, Fehler finden, Signaturen wählen, Code schreiben.',
  neu: true,
  minutenProFrage: 3,
  themen: [
    { id: 'rang',  name: 'Fall A: Rangliste<T> mit Regel' },
    { id: 'stat',  name: 'Fall B: generische Hilfsmethoden' }
  ],
  faelle: [
    { id: 'A', titel: 'Rangliste mit Zulassungsregel',
      text: `Eine **Rangliste** hält ihre Elemente immer **aufsteigend sortiert** (natürliche Ordnung über \`compareTo\`). Beim Erzeugen bekommt sie eine **Regel**: Nur Elemente, die die Regel erfüllen, werden aufgenommen.

Die Rangliste soll für möglichst viele Typen funktionieren, auch für Unterklassen, die ihr \`compareTo\` von einer Oberklasse erben (z. B. \`Hund extends Tier\`, \`Tier implements Comparable<Tier>\`), und für \`LocalDate\`. Eine Regel für einen **Obertyp** (z. B. \`Regel<Object>\`, „alles erlaubt“) soll auch für eine Rangliste eines Untertyps verwendbar sein.`,
      code: `@FunctionalInterface
public interface Regel<X> {
    boolean passt(X x);
}

public class Rangliste<T extends Comparable<? super T>> {
    private final List<T> elemente = new ArrayList<>();
    private final Regel<? super T> zulassung;

    public Rangliste(Regel<? super T> zulassung) {
        if (zulassung == null)
            throw new NullPointerException("Regel fehlt");
        this.zulassung = zulassung;
    }

    // fügt neu an der richtigen Stelle ein, wenn die Regel erfüllt ist
    public boolean einfuegen(T neu) {
        if (neu == null)
            throw new NullPointerException("Element fehlt");
        if (!zulassung.passt(neu))
            return false;
        int i = 0;
        while (i < elemente.size() && elemente.get(i).compareTo(neu) <= 0)
            i++;
        elemente.add(i, neu);
        return true;
    }

    public T getErstes() { /* liefert das kleinste Element */ }
    public int zaehleWenn(/* Teilaufgabe */) { … }
    public void uebertrageIn(Collection<? super T> ziel) { /* Teilaufgabe */ }

    @Override
    public String toString() { return elemente.toString(); }
}

class Tier implements Comparable<Tier> {
    private final String name;
    Tier(String name) { this.name = name; }
    String getName() { return name; }
    public int compareTo(Tier o) { return name.compareTo(o.name); }
    public String toString() { return name; }
}
class Hund extends Tier { Hund(String name) { super(name); } }` },
    { id: 'B', titel: 'Hilfsklasse Statistik',
      text: `Die Klasse \`Statistik\` enthält nur **statische generische Methoden**, die mit beliebigen Collections arbeiten. Jede Methode soll so **allgemein wie möglich** sein: Sie soll alle Collections annehmen, bei denen sie sinnvoll funktioniert, und darf dabei keine unsicheren Casts benutzen.`,
      code: `public final class Statistik {
    private Statistik() { }   // keine Objekte

    public static <T extends Comparable<? super T>> T maximum(Collection<? extends T> c) {
        if (c.isEmpty())
            throw new NoSuchElementException("leer");
        T max = null;
        for (T x : c)
            if (max == null || x.compareTo(max) > 0)
                max = x;
        return max;
    }

    public static double summe(/* Teilaufgabe */) { … }

    public static <T> void kopiere(Collection<? extends T> quelle, Collection<? super T> ziel) {
        for (T x : quelle)
            ziel.add(x);
    }

    public static /* Teilaufgabe */ sortierteKopie(/* Teilaufgabe */) { … }
}` }
  ],
  fragen: [

    /* ==================== Fall A: Rangliste ==================== */

    { id: 'K05-S03-F01', sec: 'rang', fall: 'A', type: 'mc', wichtig: true, t: 'A1 · Warum ? super T im Bound?',
      prompt: 'Warum ist die Klasse als `Rangliste<T extends Comparable<? super T>>` deklariert und nicht einfacher als `Rangliste<T extends Comparable<T>>`?',
      options: [
        'Mit `Comparable<T>` dürfte die Liste keine Duplikate enthalten.',
        'Mit `Comparable<T>` gäbe es keine `Rangliste<Hund>` und keine `Rangliste<LocalDate>`.',
        'Mit `Comparable<T>` müsste jede übergebene Regel zwingend vom Typ `Regel<T>` sein, nie `Regel<Object>`.',
        'Weil `Comparable<T>` nur bei Interfaces erlaubt ist, nicht bei Klassen.'
      ],
      answer: 1,
      explain: '`Hund` erbt `compareTo` von `Tier` und ist damit `Comparable<Tier>`, `LocalDate` ist `Comparable<ChronoLocalDate>`. Mit `Comparable<T>` meldet der Compiler bei `Rangliste<Hund>` „type argument Hund is not within bounds“. `? super T` erlaubt ein `compareTo`, das für einen **Obertyp** definiert ist. Mit der Regel hat das nichts zu tun, die hat ihren eigenen Typ.' },

    { id: 'K05-S03-F02', sec: 'rang', fall: 'A', type: 'multi', wichtig: true, t: 'A2 · Welche Regeln passen?',
      prompt: 'Welche Zeilen kompilieren? Gegeben sind `Regel<Object> alles`, `Regel<Tier> kurz`, `Regel<Hund> hundRegel` und `Regel<String> leer`.',
      options: [
        '`new Rangliste<Hund>(alles)`',
        '`new Rangliste<Hund>(kurz)`',
        '`new Rangliste<Hund>(hundRegel)`',
        '`new Rangliste<Hund>(leer)`',
        '`new Rangliste<String>(alles)`'
      ],
      answer: [0, 1, 2, 4],
      explain: 'Der Konstruktor verlangt `Regel<? super T>`. Für `T = Hund` passen Regeln für Hund **und alle Obertypen** (Tier, Object): Wer Tiere prüfen kann, kann auch Hunde prüfen. Eine `Regel<String>` passt nicht („Regel<String> cannot be converted to Regel<? super Hund>“). Mit `Regel<Hund>` als Parametertyp ginge dagegen nur `hundRegel`.' },

    { id: 'K05-S03-F03', sec: 'rang', fall: 'A', type: 'input', wichtig: true, t: 'A3 · Ausgabe vorhersagen',
      prompt: 'Was gibt das Programm aus? (drei Zeilen) `zaehleWenn` zählt die Elemente, die die übergebene Regel erfüllen.',
      code: `Regel<Object> alles = x -> true;
Regel<Tier> kurzerName = t -> t.getName().length() <= 4;

Rangliste<Hund> hunde = new Rangliste<>(kurzerName);
System.out.println(hunde.einfuegen(new Hund("Rex")) + " "
        + hunde.einfuegen(new Hund("Brutus")) + " "
        + hunde.einfuegen(new Hund("Bea")));
System.out.println(hunde + " " + hunde.getErstes());

Rangliste<String> woerter = new Rangliste<>(s -> !s.isEmpty());
for (String w : List.of("kiwi", "", "apfel", "Zebra", "kiwi"))
    woerter.einfuegen(w);
System.out.println(woerter + " " + woerter.zaehleWenn(alles) + " " + woerter.zaehleWenn(s -> s.startsWith("k")));`,
      answers: ['true false true\n[Bea, Rex] Bea\n[Zebra, apfel, kiwi, kiwi] 4 2'],
      explain: '„Brutus“ hat 6 Buchstaben und wird von der Tier-Regel abgelehnt. Die Liste ist sortiert, also steht „Bea“ vorn. Bei den Wörtern scheitert der leere String an der Regel. Großbuchstaben kommen in der String-Ordnung **vor** Kleinbuchstaben, darum steht „Zebra“ vor „apfel“. Duplikate sind in einer Liste erlaubt: zweimal „kiwi“. `zaehleWenn(alles)` zeigt, dass eine `Regel<Object>` auch für eine `Rangliste<String>` passt.' },

    { id: 'K05-S03-F04', sec: 'rang', fall: 'A', type: 'bug', wichtig: true, t: 'A4 · Vier verbotene Zeilen',
      prompt: 'Ein Kommilitone hat die Rangliste um einige Methoden erweitert. Markiere alle Zeilen, die der Compiler ablehnt, und begründe jeweils.',
      code: `public class Rangliste<T extends Comparable<? super T>> {
    private static Regel<T> standardRegel;
    private final List<T> elemente = new ArrayList<>();
    public T[] alsArray() {
        T[] feld = new T[elemente.size()];
        for (int i = 0; i < feld.length; i++)
            feld[i] = elemente.get(i);
        return feld;
    }
    public T neuesLeeresElement() {
        return new T();
    }
    public boolean enthaeltTyp(Object o) {
        return o instanceof T;
    }
    public T kleinstes() {
        T min = elemente.get(0);
        for (T x : elemente)
            if (x.compareTo(min) < 0)
                min = x;
        return min;
    }
}`,
      required: [2, 5, 11, 14],
      model: 'Zeile 2: `T` gehört zu einem **Objekt** der Klasse, ein statisches Attribut hat keins („non-static type variable T cannot be referenced from a static context“). Zeile 5: Arrays vom Typparameter kann man nicht erzeugen („generic array creation“), stattdessen eine `List<T>` zurückgeben. Zeile 11: `new T()` geht nicht, zur Laufzeit ist T unbekannt („unexpected type“). Zeile 14: `instanceof T` ist nicht prüfbar („Object cannot be safely cast to T“). Grund für 5, 11 und 14: Type Erasure. Die Methode `kleinstes` ist dagegen korrekt: Der Bound erlaubt `compareTo`.',
      explain: 'Die vier Klassiker aus „Das geht nicht“ in einer Klasse. `T[] feld` als **Variablentyp** wäre erlaubt, nur das Erzeugen mit `new T[…]` nicht.' },

    { id: 'K05-S03-F05', sec: 'rang', fall: 'A', type: 'fill', t: 'A5 · zaehleWenn ergänzen',
      prompt: 'Ergänze `zaehleWenn`, die zählt, wie viele Elemente die übergebene Regel erfüllen. Sie soll auch mit einer `Regel<Object>` funktionieren.',
      code: `public int zaehleWenn(Regel<[[0]]> r) {
    int anzahl = 0;
    for ([[1]] x : elemente)
        if (r.[[2]](x))
            anzahl++;
    return anzahl;
}`,
      blanks: [
        { options: ['T', '? extends T', '? super T', '?'], answer: 2,
          why: 'Die Regel **bekommt** Elemente übergeben (Verbraucher): `? super T`. Mit `T` ginge keine `Regel<Object>`, mit `?` dürfte man der Regel gar nichts übergeben.' },
        { options: ['Object', 'T', '?', 'Comparable'], answer: 1,
          why: 'Die Elemente der Liste sind vom Typ `T`. `?` ist als Variablentyp nicht erlaubt.' },
        { options: ['passt', 'isOk', 'test', 'compareTo'], answer: 0,
          why: 'Das funktionale Interface `Regel` hat genau eine Methode: `passt`.' }
      ],
      explain: 'Faustregel angewendet: Die Daten **gehen aus dem Code hinaus** an die Regel, darum `super`. Genauso ist der Konstruktorparameter deklariert.' },

    { id: 'K05-S03-F06', sec: 'rang', fall: 'A', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 5, t: 'A6 · uebertrageIn und getErstes schreiben',
      prompt: 'Schreibe (1) `getErstes()`: liefert das kleinste Element, bei leerer Liste `NoSuchElementException`. (2) `uebertrageIn(Collection<? super T> ziel)`: fügt alle Elemente der Rangliste in `ziel` ein. Erkläre, warum `ziel` als `Collection<? super T>` deklariert ist und welche Aufrufe dadurch möglich sind.',
      model: 'Kernpunkte: (1) Die Liste ist sortiert, das kleinste Element steht an Index 0. (2) Leere Liste vorher prüfen und die Exception dokumentieren. (3) `uebertrageIn` **schreibt** T-Objekte ins Ziel. Das Ziel muss also T aufnehmen können: T oder ein Obertyp, `? super T`. (4) Dadurch geht z. B. `hunde.uebertrageIn(new ArrayList<Tier>())` oder `uebertrageIn(new ArrayList<Object>())`. Mit `Collection<T>` ginge nur eine `Collection<Hund>`, mit `? extends T` wäre `add` verboten.',
      modelCode: `/**
 * liefert das kleinste Element der Rangliste
 * @return das erste (kleinste) Element
 * @throws NoSuchElementException wenn die Rangliste leer ist
 */
public T getErstes() {
    if (elemente.isEmpty())
        throw new NoSuchElementException("Die Rangliste ist leer");
    return elemente.get(0);
}

/**
 * fügt alle Elemente dieser Rangliste in ziel ein
 * @param ziel die Collection, die die Elemente aufnimmt
 */
public void uebertrageIn(Collection<? super T> ziel) {
    for (T x : elemente)
        ziel.add(x);
}`,
      explain: 'Ausprobiert: `hunde.uebertrageIn(tiere)` mit einer `List<Tier>`, die schon „Ara“ enthält, ergibt `[Ara, Bea, Rex]`.' },

    /* ==================== Fall B: Statistik ==================== */

    { id: 'K05-S03-F07', sec: 'stat', fall: 'B', type: 'mc', wichtig: true, t: 'B1 · Parameter für summe',
      prompt: '`summe` soll die Summe aller Zahlen liefern, egal ob sie in einer `List<Integer>`, einem `Set<Double>` oder einer `List<Number>` stehen. Welcher Parameter ist richtig?',
      options: [
        '`Collection<Number> zahlen`',
        '`List<? super Number> zahlen`',
        '`Collection<? extends Number> zahlen`',
        '`<T> Collection<T extends Number> zahlen`'
      ],
      answer: 2,
      explain: 'Die Methode **liest** nur: `? extends Number`, und jedes gelesene Element ist sicher eine `Number` mit `doubleValue()`. `Collection` statt `List`, weil Sets auch gehen sollen. `Collection<Number>` nähme keine `List<Integer>`, `? super Number` nur Number- oder Object-Listen. Die letzte Option ist keine gültige Syntax.' },

    { id: 'K05-S03-F08', sec: 'stat', fall: 'B', type: 'input', wichtig: true, t: 'B2 · Ausgabe vorhersagen',
      prompt: 'Was gibt das Programm aus? (drei Zeilen) `summe` ist wie in B1 deklariert und addiert mit `doubleValue()`. `Hund` und `Tier` sind wie in Fall A.',
      code: `System.out.println(Statistik.maximum(List.of(new Hund("Rex"), new Hund("Wuff"), new Hund("Ali")))
        + " " + Statistik.maximum(Set.of(LocalDate.of(2026, 5, 1), LocalDate.of(2025, 12, 31))));
System.out.println(Statistik.summe(List.of(1, 2, 3)) + " " + Statistik.summe(List.of(0.5, 0.25)));
List<Number> ziel = new ArrayList<>(List.of(9.5));
Statistik.kopiere(List.of(1, 2), ziel);
System.out.println(ziel);`,
      answers: ['Wuff 2026-05-01\n6.0 0.75\n[9.5, 1, 2]'],
      explain: '`maximum` funktioniert mit Hunden (Comparable über Tier) und mit `LocalDate` (Comparable über ChronoLocalDate), dank `Comparable<? super T>`. Die Summen sind `double`, also `6.0`. `kopiere` liest Integer aus der Quelle (`? extends T`) und schreibt sie in eine `List<Number>` (`? super T`), mit `T = Integer`.' },

    { id: 'K05-S03-F09', sec: 'stat', fall: 'B', type: 'multi', t: 'B3 · Welche kopiere-Aufrufe kompilieren?',
      prompt: 'Welche Aufrufe von `kopiere(Collection<? extends T> quelle, Collection<? super T> ziel)` kompilieren?',
      options: [
        '`kopiere(List.of(1, 2), new ArrayList<Object>())`',
        '`kopiere(List.of(1, 2), new ArrayList<Number>())`',
        '`kopiere(List.of(1.5), new ArrayList<Integer>())`',
        '`kopiere(Set.of("a"), new TreeSet<String>())`',
        '`kopiere(List.of(new Hund("Rex")), new ArrayList<Tier>())`'
      ],
      answer: [0, 1, 3, 4],
      explain: 'Der Compiler sucht ein `T`, für das die Quelle aus T (oder Untertypen) besteht **und** das Ziel T (oder Obertypen) aufnehmen kann. Für Integer in Object oder Number passt `T = Integer`, für Hund in Tier `T = Hund`. Ein `Double` passt aber in keine Integer-Liste, dafür gibt es kein `T`.' },

    { id: 'K05-S03-F10', sec: 'stat', fall: 'B', type: 'fill', wichtig: true, t: 'B4 · Signatur von sortierteKopie',
      prompt: '`sortierteKopie` soll eine **neue**, aufsteigend sortierte `List` mit allen Elementen einer beliebigen Collection liefern (auch für Hunde und LocalDate). Ergänze die Signatur.',
      code: `public static <T extends Comparable<[[0]]>> [[1]] sortierteKopie(Collection<[[2]]> c) {
    List<T> ergebnis = new ArrayList<>(c);
    Collections.sort(ergebnis);
    return ergebnis;
}`,
      blanks: [
        { options: ['T', '? super T', '? extends T', '?'], answer: 1,
          why: 'Das `compareTo` darf von einem Obertyp stammen (Hund/Tier, LocalDate/ChronoLocalDate). Genau so verlangt es auch `Collections.sort`.' },
        { options: ['List<?>', 'List<T>', 'Collection<T>', 'T'], answer: 1,
          why: 'Zurück kommt eine Liste, deren Elementtyp der Aufrufer kennt. Mit `List<?>` könnte er die Elemente nur als `Object` lesen.' },
        { options: ['T', '? super T', '? extends T', 'Object'], answer: 2,
          why: 'Aus `c` wird nur **gelesen** (kopiert): `? extends T`. Der Konstruktor `new ArrayList<>(Collection<? extends E>)` akzeptiert genau das.' }
      ],
      explain: 'Ausprobiert: `sortierteKopie(Set.of(3, 1, 2))` ergibt `[1, 2, 3]`, mit Hunden „Zorro“ und „Ali“ `[Ali, Zorro]`. Die übergebene Collection bleibt unverändert.' },

    { id: 'K05-S03-F11', sec: 'stat', fall: 'B', type: 'mc', t: 'B5 · Warum hier ein eigenes T?',
      prompt: 'Bei `maximum` reicht kein `Collection<?>`, man braucht ein eigenes `T`. Warum?',
      options: [
        'Weil der Rückgabetyp zum Elementtyp passen muss und `compareTo` gebraucht wird.',
        'Weil `?` in statischen Methoden grundsätzlich verboten ist.',
        'Weil statische Methoden in einer Hilfsklasse immer einen eigenen Typparameter brauchen.',
        'Weil man sonst keine leere Collection erkennen könnte.'
      ],
      answer: 0,
      explain: 'Faustregel: Derselbe Typ kommt an **mehreren Stellen** vor (Elemente und Rückgabe), und er braucht einen **Bound** für `compareTo`. Mit `?` könnte man nur `Object` zurückgeben und hätte kein `compareTo`. Statische Methoden dürfen `?` ganz normal benutzen, und `isEmpty` funktioniert immer.' },

    { id: 'K05-S03-F12', sec: 'stat', fall: 'B', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 6, t: 'B6 · anzahlGroesser schreiben',
      prompt: 'Ergänze `Statistik` um `anzahlGroesser(c, grenze)`: wie viele Elemente aus `c` größer als `grenze` sind. Sie soll z. B. mit `List<Hund>` und einer `Tier`-Grenze funktionieren, ebenso mit `Set<LocalDate>` und einem `LocalDate`. Wähle die Typparameter so allgemein wie möglich und begründe sie.',
      model: 'Kernpunkte: (1) Verglichen wird `x.compareTo(grenze)`. `grenze` muss also zu dem Typ passen, den `compareTo` erwartet. (2) Mit `<T extends Comparable<? super T>>`, `grenze` vom Typ `T` und der Collection als `Collection<? extends T>` passt alles: Für Hunde und eine Tier-Grenze wird `T = Tier`, und die Hunde sind `? extends Tier`. (3) Es wird nur gelesen, also `? extends T`. (4) Rückgabe `int`, `grenze` auf `null` prüfen.',
      modelCode: `/**
 * zählt die Elemente, die größer als grenze sind
 * @param <T> Typ der Grenze und Obertyp der Elemente
 * @param c die zu durchsuchenden Elemente
 * @param grenze der Vergleichswert
 * @return die Anzahl der Elemente größer als grenze
 * @throws NullPointerException wenn grenze null ist
 */
public static <T extends Comparable<? super T>> int anzahlGroesser(Collection<? extends T> c, T grenze) {
    if (grenze == null)
        throw new NullPointerException("Grenze fehlt");
    int anzahl = 0;
    for (T x : c)
        if (x.compareTo(grenze) > 0)
            anzahl++;
    return anzahl;
}`,
      explain: 'Mit nur `Collection<T>` müssten Elemente und Grenze **genau** denselben Typ haben. Durch `? extends T` darf die Collection einen Untertyp enthalten, und der Compiler wählt für `T` den gemeinsamen Typ.' }
  ]
});
