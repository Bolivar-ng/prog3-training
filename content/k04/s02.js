/* Kapitel 04 · Serie S02: Set, Map und die Klasse Collections
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K04-S02',
  kapitel: 'K04',
  titel: 'Set, Map und Collections',
  beschreibung: 'HashSet gegen TreeSet (equals oder compareTo), null-Regeln, Map mit put, get und entrySet, die Sichten keySet, values und entrySet, Hilfsmethoden und unveränderbare Views.',
  neu: true,
  themen: [
    { id: 'set',   name: 'HashSet & TreeSet' },
    { id: 'map',   name: 'Map benutzen' },
    { id: 'views', name: 'Sichten (Views)' },
    { id: 'hilfe', name: 'Hilfsklasse Collections' }
  ],
  fragen: [

    /* ========== HashSet & TreeSet ========== */

    { id: 'K04-S02-F01', sec: 'set', type: 'input', wichtig: true, t: 'Wer ist ein Duplikat?',
      prompt: '`compareTo` vergleicht den Wert in Euro, `equals` und `hashCode` vergleichen Betrag und Währung. Was gibt das Programm aus? (zwei Zeilen)',
      code: `class Betrag implements Comparable<Betrag> {
    private final double wert;
    private final String waehrung;
    private final double kurs;

    Betrag(double wert, String waehrung, double kurs) { … }

    public int compareTo(Betrag o) {
        return Double.compare(wert / kurs, o.wert / o.kurs);
    }
    // equals und hashCode über wert und waehrung
}

Betrag euro  = new Betrag(100, "EUR", 1);
Betrag denar = new Betrag(6150, "MKD", 61.5);
Set<Betrag> hash = new HashSet<>(List.of(euro, denar));
Set<Betrag> tree = new TreeSet<>(List.of(euro, denar));
System.out.println(hash.size() + " " + tree.size());
System.out.println(tree.contains(denar) + " " + hash.contains(new Betrag(6150, "MKD", 61.5)));`,
      answers: ['2 1\ntrue true'],
      explain: 'Das HashSet entscheidet mit `hashCode`/`equals`: verschiedene Währung, also zwei Elemente. Das TreeSet entscheidet nur mit `compareTo`: beide sind 100 € wert, Ergebnis 0, das zweite wird **nicht** aufgenommen. `tree.contains(denar)` ist trotzdem true, weil `compareTo` mit dem gespeicherten Euro-Betrag 0 liefert. Genau deshalb muss `compareTo` konsistent mit `equals` sein.' },

    { id: 'K04-S02-F02', sec: 'set', type: 'match', t: 'Wer benutzt was?',
      prompt: 'Ordne jeder Klasse zu, womit sie entscheidet, ob zwei Elemente (bzw. Schlüssel) gleich sind.',
      pairs: [
        ['HashSet', 'hashCode und equals der Elemente'],
        ['TreeSet ohne Comparator', 'compareTo der Elemente'],
        ['TreeSet mit Comparator im Konstruktor', 'compare des übergebenen Comparators'],
        ['ArrayList bei contains', 'nur equals der Elemente']
      ],
      explain: 'Hash-Strukturen (HashSet, HashMap) brauchen passende `hashCode`- und `equals`-Methoden. Baum-Strukturen (TreeSet, TreeMap) sortieren und vergleichen mit `compareTo` bzw. einem Comparator. Eine Liste sucht bei `contains`/`indexOf` einfach mit `equals`.' },

    { id: 'K04-S02-F03', sec: 'set', type: 'multi', t: 'Wo ist null erlaubt?',
      prompt: 'Welche Anweisungen laufen **ohne Exception** durch? (mehrere)',
      options: [
        '`new ArrayList<String>().add(null);`',
        '`new TreeSet<String>().add(null);`',
        '`new HashSet<String>().add(null);`',
        '`new TreeMap<String, Integer>().put(null, 1);`',
        '`new HashMap<String, Integer>().put(null, 1);`',
        '`new LinkedList<String>().add(null);`'
      ],
      answer: [0, 2, 4, 5],
      explain: 'Die Baum-Strukturen müssen jedes neue Element mit `compareTo` vergleichen, mit `null` geht das nicht: `NullPointerException` bei TreeSet und bei einem null-**Schlüssel** in der TreeMap. Listen, HashSet und HashMap (als Schlüssel) erlauben `null`.' },

    { id: 'K04-S02-F04', sec: 'set', type: 'mc', t: 'TreeSet mit eigenen Objekten',
      prompt: 'Die Klasse `Konto` implementiert **nicht** `Comparable`. Was passiert bei `Set<Konto> s = new TreeSet<>(); s.add(new Girokonto());`?',
      options: [
        'Compilerfehler: TreeSet akzeptiert nur Comparable-Typen.',
        'Es klappt, das TreeSet sortiert nach dem Hashcode.',
        'Zur Laufzeit gibt es beim `add` eine `ClassCastException`.',
        'Es klappt, das Element wird einfach unsortiert am Ende eingefügt.'
      ],
      answer: 2,
      explain: 'Der Compiler lässt es durch, der Typparameter von TreeSet verlangt kein Comparable. Beim Einfügen versucht das TreeSet aber, das Element auf `Comparable` zu casten: `ClassCastException`. Abhilfe: `Konto` implementiert `Comparable<Konto>` oder man übergibt einen Comparator, z. B. `new TreeSet<>(new IbanVergleicher(blz))`.' },

    { id: 'K04-S02-F05', sec: 'set', type: 'input', t: 'TreeSet sortiert und filtert',
      prompt: 'Was gibt das Programm aus? (eine Zeile)',
      code: `Set<String> ts = new TreeSet<>(List.of("b", "a", "b", "c"));
System.out.println(ts + " " + ts.add("a"));`,
      answers: ['[a, b, c] false'],
      explain: 'Das doppelte „b“ wird nur einmal gespeichert, das TreeSet sortiert alphabetisch. `add("a")` liefert `false`, weil „a“ schon drin ist. Achtung: `println` wertet die Teile von links nach rechts aus, `ts` wird also vor dem `add` in einen String verwandelt.' },

    /* ========== Map benutzen ========== */

    { id: 'K04-S02-F06', sec: 'map', type: 'input', wichtig: true, t: 'put und get',
      prompt: 'Was gibt das Programm aus? (eine Zeile)',
      code: `Map<String, Integer> p = new HashMap<>();
System.out.println(p.put("k", 1) + " " + p.put("k", 2) + " " + p.get("k") + " " + p.get("x"));`,
      answers: ['null 1 2 null'],
      explain: '`put` liefert den **alten** Wert unter diesem Schlüssel: beim ersten Mal keinen (`null`), beim zweiten Mal 1, der dann durch 2 **überschrieben** wird. `get` mit einem Schlüssel, den es nicht gibt, liefert `null` und wirft keine Exception. Vorsicht beim Auspacken: `int x = p.get("x");` gäbe eine NullPointerException.' },

    { id: 'K04-S02-F07', sec: 'map', type: 'input', t: 'Wörter zählen',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `String[] woerter = { "konto", "bank", "konto", "geld", "konto", "bank" };
Map<String, Integer> zaehler = new TreeMap<>();
for (String w : woerter) {
    Integer alt = zaehler.get(w);
    zaehler.put(w, alt == null ? 1 : alt + 1);
}
System.out.println(zaehler);
System.out.println(zaehler.get("zins"));
System.out.println(zaehler.keySet() + " " + zaehler.values());`,
      answers: ['{bank=2, geld=1, konto=3}\nnull\n[bank, geld, konto] [2, 1, 3]'],
      explain: 'Beim ersten Auftreten liefert `get` null, also wird 1 gespeichert, danach jeweils `alt + 1` (put überschreibt). Die TreeMap sortiert nach den **Schlüsseln**. `values()` liefert die Werte in der Reihenfolge ihrer Schlüssel. „zins“ gibt es nicht: null.' },

    { id: 'K04-S02-F08', sec: 'map', type: 'fill', t: 'Über eine Map laufen',
      prompt: 'Alle Einträge einer `Map<String, BigDecimal> kurse` sollen als „Schlüssel: Wert“ ausgegeben werden.',
      code: `for ([[0]] e : kurse.[[1]]()) {
    System.out.println(e.[[2]]() + ": " + e.getValue());
}`,
      blanks: [
        { options: ['Map<String, BigDecimal>', 'Map.Entry<String, BigDecimal>', 'Entry', 'Set<String>'], answer: 1,
          why: 'Jeder Eintrag ist ein `Map.Entry` mit denselben zwei Typargumenten wie die Map. Ohne Typargumente wäre es ein roher Typ.' },
        { options: ['keySet', 'values', 'entrySet', 'iterator'], answer: 2,
          why: '`entrySet()` liefert alle Schlüssel-Wert-**Paare**. Mit `keySet()` hätte man nur die Schlüssel, mit `values()` nur die Werte.' },
        { options: ['getKey', 'getSchluessel', 'key', 'get'], answer: 0,
          why: 'Ein Entry hat `getKey()` und `getValue()`.' }
      ],
      explain: 'Die Map selbst ist nicht Iterable, man durchläuft eine ihrer Sichten. Für Schlüssel **und** Wert ist `entrySet()` die richtige.' },

    { id: 'K04-S02-F09', sec: 'map', type: 'multi', t: 'Map-Klassen',
      prompt: 'Welche Aussagen sind richtig? (mehrere)',
      options: [
        '`Map` erbt von `Collection`.',
        'Eine TreeMap hält ihre Schlüssel sortiert.',
        'Bei `Properties` sind Schlüssel und Werte Strings.',
        'In einer HashMap darf derselbe Wert unter mehreren Schlüsseln stehen.',
        'Bei einer HashMap ist die Reihenfolge die Einfügereihenfolge.',
        'Ein zweites `put` mit demselben Schlüssel erzeugt einen zweiten Eintrag.'
      ],
      answer: [1, 2, 3],
      explain: 'Map erbt **nicht** von Collection. Die HashMap ordnet nach Hashwerten, eine Reihenfolge ist nicht garantiert. Ein `put` mit vorhandenem Schlüssel **überschreibt** den Wert. `Properties` ist eine spezielle Map für Systemeigenschaften mit String-Schlüsseln und -Werten.' },

    /* ========== Sichten ========== */

    { id: 'K04-S02-F10', sec: 'views', type: 'mc', wichtig: true, t: 'values und keySet',
      prompt: 'Warum liefert `keySet()` ein `Set`, `values()` aber nur eine `Collection`?',
      options: [
        'Weil Methoden, deren Name auf „Set“ endet, ein Set liefern müssen.',
        'Weil Schlüssel eindeutig sind, Werte aber mehrfach vorkommen dürfen.',
        'Weil die Werte in einer Map immer sortiert sind.',
        'Ein Überbleibsel aus alten Java-Versionen, ohne jeden inhaltlichen Grund.'
      ],
      answer: 1,
      explain: 'Ein Set darf keine Duplikate enthalten. Die Schlüssel einer Map sind eindeutig, also passen sie in ein Set. Werte dürfen sich wiederholen (zwei Kunden mit gleichem Kontostand), darum reicht der allgemeinere Typ `Collection`.' },

    { id: 'K04-S02-F11', sec: 'views', type: 'input', t: 'Eine View ändert die Map',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `Map<String, Integer> m = new TreeMap<>();
m.put("Meier", 3);
m.put("August", 1);
m.put("Kar", 3);
m.keySet().remove("Kar");
System.out.println(m);
try {
    m.keySet().add("Abel");
} catch (UnsupportedOperationException e) {
    System.out.println("verboten");
}`,
      answers: ['{August=1, Meier=3}\nverboten'],
      explain: '`keySet()` ist keine Kopie, sondern eine **Sicht** auf die Map ohne eigenen Speicher. `remove` über die Sicht löscht den Eintrag auch aus der Map. `add` ist verboten: Zu einem neuen Schlüssel gäbe es keinen Wert. Das gilt genauso für `values()` und `entrySet()`.' },

    /* ========== Hilfsklasse Collections ========== */

    { id: 'K04-S02-F12', sec: 'hilfe', type: 'input', t: 'Statische Helfer',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `List<Integer> z = new ArrayList<>(List.of(3, 1, 3, 2));
System.out.println(Collections.frequency(z, 3) + " " + Collections.max(z)
        + " " + Collections.disjoint(z, List.of(5, 6)));
Collections.sort(z);
System.out.println(z);
Collections.reverse(z);
System.out.println(z);`,
      answers: ['2 3 true\n[1, 2, 3, 3]\n[3, 3, 2, 1]'],
      explain: '`frequency` zählt, wie oft 3 vorkommt: 2. `max` liefert das größte Element. `disjoint` ist true, wenn es **keine** gemeinsamen Elemente gibt: 5 und 6 kommen nicht vor. `sort` und `reverse` ändern die Liste selbst und liefern nichts zurück.' },

    { id: 'K04-S02-F13', sec: 'hilfe', type: 'input', t: 'Unveränderbare View',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `List<String> orig = new ArrayList<>(List.of("x"));
List<String> nurLesen = Collections.unmodifiableList(orig);
orig.add("y");
System.out.println(nurLesen);
try {
    nurLesen.add("z");
} catch (UnsupportedOperationException e) {
    System.out.println("verboten");
}`,
      answers: ['[x, y]\nverboten'],
      explain: '`unmodifiableList` erzeugt keine Kopie, sondern eine **Sicht**: Änderungen am Original sieht man darüber sofort. Ändernde Methoden über die Sicht werfen eine `UnsupportedOperationException`. Typischer Einsatz: ein Getter, der eine interne Liste nach außen gibt, ohne dass der Aufrufer sie verändern kann.' },

    { id: 'K04-S02-F14', sec: 'hilfe', type: 'explain', t: 'Collection oder Collections?',
      prompt: 'Erkläre den Unterschied zwischen `Collection` und `Collections` und nenne zu beiden ein Beispiel.',
      model: '`Collection<E>` ist ein **Interface**: das Ober-Interface von `List` und `Set` mit Methoden wie `add`, `remove`, `contains`, `size`, `removeIf`. Beispiel: `Collection<String> c = new HashSet<>();`. `Collections` (mit s) ist eine **Hilfsklasse** mit ausschließlich statischen Methoden, die mit Collections arbeiten, z. B. `Collections.sort(liste)`, `Collections.max(c)`, `Collections.frequency(c, o)` oder `Collections.unmodifiableList(liste)`. Von `Collections` erzeugt man keine Objekte. (Map gehört übrigens zu keinem von beiden, sie erbt nicht von Collection.)' },

    { id: 'K04-S02-F15', sec: 'hilfe', type: 'mc', wichtig: true, t: 'List oder Collection als Parameter?',
      prompt: 'In der Hilfsklasse `Collections` erwarten `sort`, `reverse`, `shuffle` und `copy` eine `List`, `min`, `max`, `frequency` und `disjoint` dagegen eine `Collection`. Woran liegt das?',
      options: [
        'Die Methoden mit `List` gibt es zusätzlich überladen für `Set`, nur nicht in der Doku.',
        'Wo die Reihenfolge der Elemente zählt, braucht man eine List, sonst reicht jede Collection.',
        'Ein Tippfehler in der Dokumentation, gemeint ist überall die Hilfsklasse `Collections`.',
        '`Collection` ist neuer als `List`, die alten Methoden wurden nie umgestellt.'
      ],
      answer: 1,
      explain: 'Sortieren, Umdrehen, Mischen und positionsgenaues Kopieren arbeiten mit **Positionen**, die ein Set nicht hat. Minimum, Maximum, Häufigkeit und gemeinsame Elemente hängen nicht von der Reihenfolge ab, darum reicht der allgemeinste Typ, und man kann auch ein Set übergeben. Prinzip: Parameter so allgemein wie möglich, so speziell wie nötig. `Collections.sort(meinSet)` ist ein Compilerfehler.' }
  ]
});
