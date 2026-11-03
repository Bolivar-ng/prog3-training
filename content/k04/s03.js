/* Kapitel 04 · Serie S03: Praxis – Mengen und Maps im Bankprojekt
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K04-S03',
  kapitel: 'K04',
  titel: 'Praxis: Mengen und Maps im Bankprojekt',
  beschreibung: 'Winkel im TreeSet, eine Familie als Menge, Namenssuche, Konten nach Inhaber gruppieren, unveränderliche Maps, Löschen beim Durchlaufen und die Helfer aus Collections.',
  neu: true,
  themen: [
    { id: 'winkel',  name: 'TreeSet mit eigener Klasse' },
    { id: 'familie', name: 'Kunden als Menge' },
    { id: 'gruppe',  name: 'Maps füllen und gruppieren' },
    { id: 'aendern', name: 'Maps verändern' }
  ],
  fragen: [

    /* ========== TreeSet mit eigener Klasse ========== */

    { id: 'K04-S03-F01', sec: 'winkel', type: 'input', wichtig: true, t: 'Winkel in Hash- und TreeSet',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen) Der Konstruktor bringt jeden Winkel in den Bereich 0° bis unter 360°.',
      code: `final class Winkel {
    private final double grad;

    Winkel(double grad) {
        double w = grad % 360;
        this.grad = w < 0 ? w + 360 : w;
    }

    double getGrad() { return grad; }

    @Override
    public boolean equals(Object o) {
        return o instanceof Winkel w && w.grad == grad;
    }

    @Override
    public int hashCode() { return Double.hashCode(grad); }
}

public class Test {
    public static void main(String[] args) {
        List<Winkel> drei = List.of(new Winkel(90), new Winkel(-20), new Winkel(45));
        Set<Winkel> hash = new HashSet<>(drei);
        hash.add(new Winkel(450));
        System.out.println(hash.size() + " " + hash.contains(new Winkel(-270)));
        try {
            Set<Winkel> tree = new TreeSet<>(drei);
            System.out.println(tree.size());
        } catch (ClassCastException e) {
            System.out.println("ClassCastException");
        }
    }
}`,
      answers: ['3 true\nClassCastException'],
      explain: '450° wird zu 90°, also ein Duplikat: Größe 3. −270° wird ebenfalls zu 90°, `contains` findet ihn über `hashCode`/`equals`. Das TreeSet muss sortieren, `Winkel` ist aber nicht `Comparable` und es gibt keinen Comparator: Beim Einfügen fliegt eine `ClassCastException`. Der Compiler merkt das nicht, `TreeSet<E>` verlangt beim Typparameter kein Comparable.' },

    { id: 'K04-S03-F02', sec: 'winkel', type: 'fill', t: 'TreeSet mit Comparator',
      prompt: 'Die Klasse `Winkel` soll **unverändert** bleiben. Das TreeSet soll die Winkel trotzdem aufsteigend nach Grad sortieren. Vervollständige.',
      code: `Set<Winkel> winkel = new TreeSet<>([[0]] -> Double.[[1]](w1.getGrad(), w2.getGrad()));
winkel.add(beta);
winkel.add(gamma);
winkel.add(alpha);`,
      blanks: [
        { options: ['(Winkel w1)', '(w1, w2)', 'w1, w2', '()'], answer: 1,
          why: '`Comparator<Winkel>` hat die Methode `compare(w1, w2)` mit zwei Parametern. Den Typ leitet der Compiler aus `Set<Winkel>` ab (Zieltyp).' },
        { options: ['compareTo', 'equals', 'compare', 'max'], answer: 2,
          why: '`Double.compare(a, b)` ist die statische Vergleichsmethode für `double`. `compareTo` ruft man auf einem Objekt auf, nicht statisch.' }
      ],
      explain: 'Der Konstruktor `TreeSet(Comparator<? super E> c)` nimmt die Sortierregel von außen. Ab dann fragt das TreeSet bei jedem `add` den Comparator und nicht `compareTo`. Ergebnis für 90°, −20° und 45°: [45°, 90°, 340°].' },

    { id: 'K04-S03-F03', sec: 'winkel', type: 'mc', t: 'Comparable oder Comparator für Winkel?',
      prompt: '`Winkel` ist eine vorgegebene Klasse aus einem fremden Package. Sie wird nur an einer Stelle sortiert gebraucht. Was ist die beste Lösung?',
      options: [
        '`Winkel` muss `Comparable` implementieren, sonst gibt es in Java keine Sortierung.',
        'Statt eines TreeSets ein HashSet nehmen, denn das sortiert automatisch nach `hashCode`.',
        'Dem TreeSet einen Comparator mitgeben, die vorgegebene Klasse bleibt dann unverändert.',
        'Die Winkel vor jedem `add` selbst in die richtige Reihenfolge bringen.'
      ],
      answer: 2,
      explain: 'Ein Comparator legt die Ordnung von außen fest, ohne die Klasse anzufassen, und steht genau dort, wo sortiert wird. `Comparable` lohnt sich, wenn die Klasse dir gehört und eine natürliche Ordnung hat, die überall gelten soll. Eine HashSet sortiert gar nicht, und die Einfügereihenfolge ist einem TreeSet egal.' },

    { id: 'K04-S03-F04', sec: 'winkel', type: 'mc', t: 'compareTo passend zu equals',
      prompt: '`Winkel.equals` vergleicht mit `w.grad == grad`. Der Konstruktor speichert bei `new Winkel(-0.0)` den Wert −0,0. Für `==` sind −0,0 und 0,0 gleich, `Double.compare(-0.0, 0.0)` liefert aber −1. Welches `compareTo` ist **in jedem Fall** konsistent mit diesem `equals`?',
      options: [
        '`return Double.compare(this.grad, o.grad);`',
        '`return (int) (this.grad - o.grad);`',
        '`return this.grad > o.grad ? 1 : this.grad < o.grad ? -1 : 0;`',
        '`return Double.valueOf(this.grad).compareTo(Double.valueOf(o.grad));`'
      ],
      answer: 2,
      explain: 'Konsistent heißt: 0 genau dann, wenn `equals` true liefert. `equals` benutzt `==`, also muss auch `compareTo` mit `>`, `<` arbeiten: Dann sind −0,0 und 0,0 auch hier gleich. `Double.compare` und `Double.compareTo` unterscheiden −0,0 und 0,0. Der Cast auf `int` schneidet ab: 90,5 und 90,1 wären „gleich“.' },

    /* ========== Kunden als Menge ========== */

    { id: 'K04-S03-F05', sec: 'familie', type: 'input', wichtig: true, t: 'Die Familie als Menge',
      prompt: '`Kunde.equals` und `hashCode` vergleichen Vorname, Nachname und Geburtsjahr, **nicht** die Adresse. Der Record `KundeR` hat dieselben Daten als Komponenten. Was gibt das Programm aus? (drei Zeilen)',
      code: `Set<Kunde> familie = new HashSet<>(List.of(
        new Kunde("Papa", "Hugo", "zuhause", 1983),
        new Kunde("Papa", "Hugo", "ganz woanders", 1983),
        new Kunde("Mama", "Erna", "zuhause", 1984),
        new Kunde("Kind", "Klein", "zuhause", 2018)));
System.out.println(familie.size());
System.out.println(familie.contains(new Kunde("Papa", "Hugo", "egal", 1983)));

record KundeR(String vorname, String nachname, String adresse, int jahr) { }
Set<KundeR> rec = new HashSet<>(List.of(
        new KundeR("Papa", "Hugo", "zuhause", 1983),
        new KundeR("Papa", "Hugo", "ganz woanders", 1983)));
System.out.println(rec.size());`,
      answers: ['3\ntrue\n2'],
      explain: 'Die beiden „Papa Hugo“ unterscheiden sich nur in der Adresse, und die zählt in `equals` nicht: Das HashSet behält einen, Größe 3. Auch der Kunde mit Adresse „egal“ gilt als enthalten. Beim **Record** vergleicht das erzeugte `equals` **alle** Komponenten, also auch die Adresse: zwei verschiedene Elemente. Wer gleich ist, entscheidet immer `equals`/`hashCode` (bzw. `compareTo` beim TreeSet).' },

    { id: 'K04-S03-F06', sec: 'familie', type: 'mc', t: 'Warum eine andere Reihenfolge?',
      prompt: 'Dieselben Kunden werden einmal in ein `HashSet` und einmal in ein `TreeSet` (natürliche Ordnung nach Nachname) gesteckt. Beim Ausgeben erscheinen sie in verschiedener Reihenfolge. Warum?',
      options: [
        'Das HashSet gibt die Elemente immer genau in der Reihenfolge aus, in der sie eingefügt wurden, das TreeSet nicht.',
        'Das HashSet ordnet nach Hashwerten ohne garantierte Reihenfolge, das TreeSet sortiert mit `compareTo`.',
        'Das TreeSet sortiert nach `hashCode`, das HashSet nach `equals`.',
        'Beide sortieren gleich, die Ausgabe von `toString` ist aber zufällig.'
      ],
      answer: 1,
      explain: 'Das HashSet verteilt die Elemente über ihren `hashCode` auf interne Fächer und gibt sie in dieser Fach-Reihenfolge aus, eine Ordnung ist nicht garantiert (auch nicht die Einfügereihenfolge). Das TreeSet hält sie in einem Baum, der beim Einfügen mit `compareTo` sortiert. Wie viele Elemente drin sind, ist bei konsistentem `equals`/`compareTo` trotzdem gleich.' },

    { id: 'K04-S03-F07', sec: 'familie', type: 'fill', t: 'Kunden nach Namen suchen',
      prompt: '`gesucht` ist ein mit dem Scanner eingelesener Name. Gesammelt werden sollen alle Kunden, deren **Vor- oder Nachname** gleich `gesucht` ist, Groß- und Kleinschreibung egal.',
      code: `List<Kunde> treffer = new ArrayList<>();
for (Kunde k : kunden) {
    if (k.getVorname().[[0]](gesucht) [[1]] k.getNachname().equalsIgnoreCase(gesucht)) {
        treffer.[[2]](k);
    }
}`,
      blanks: [
        { options: ['==', 'equals', 'equalsIgnoreCase', 'contains'], answer: 2,
          why: '`equalsIgnoreCase` vergleicht den Inhalt ohne Rücksicht auf Groß-/Kleinschreibung. `==` vergleicht Referenzen, ein eingelesener String ist aber immer ein neues Objekt. `contains` würde auch Teilwörter finden.' },
        { options: ['&&', '||', '&', '+'], answer: 1,
          why: 'Vor- **oder** Nachname: `||`. Mit `&&` müssten beide gleich sein.' },
        { options: ['put', 'set', 'add', 'append'], answer: 2,
          why: 'Eine Liste füllt man mit `add`, sie wächst von selbst. `put` gehört zur Map, `set` überschreibt eine Position.' }
      ],
      explain: 'Test mit der Familie: „kind“ findet „Kind Klein“ und „Kind Groß“. Gibt man „HUGO“ ein, gibt es nur einen Treffer, wenn `kunden` ein Set ist, in dem die beiden „Papa Hugo“ als gleich gelten.' },

    /* ========== Maps füllen und gruppieren ========== */

    { id: 'K04-S03-F08', sec: 'gruppe', type: 'input', wichtig: true, t: 'Konten nach Inhaber gruppieren',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `String[][] konten = { {"1", "Mama"}, {"2", "Mama"}, {"3", "Papa"},
                      {"4", "Opa"}, {"5", "Papa"}, {"8", "Mama"} };
Map<String, List<String>> proInhaber = new TreeMap<>();
for (String[] k : konten) {
    List<String> nummern = proInhaber.get(k[1]);
    if (nummern == null) {
        nummern = new ArrayList<>();
        proInhaber.put(k[1], nummern);
    }
    nummern.add(k[0]);
}
System.out.println(proInhaber);
System.out.println(proInhaber.get("Mama").size() + " " + proInhaber.get("Oma"));`,
      answers: ['{Mama=[1, 2, 8], Opa=[4], Papa=[3, 5]}\n3 null'],
      explain: 'Das Muster zum Gruppieren: Liste holen, wenn noch keine da ist (`get` liefert null) eine neue anlegen und mit `put` eintragen, dann hinzufügen. Weil in der Map eine **Referenz** auf die Liste steht, landet das `add` auch nach dem `put` in der Map. Die TreeMap sortiert nach den Schlüsseln. „Oma“ gibt es nicht: null.' },

    { id: 'K04-S03-F09', sec: 'gruppe', type: 'bug', t: 'Gruppieren mit Fehler',
      prompt: 'Nach der Schleife ist `proInhaber` **leer**. Markiere die Zeile, die den Fehler verursacht.',
      code: `Map<String, List<String>> proInhaber = new TreeMap<>();
for (String[] k : konten) {
    List<String> nummern = proInhaber.get(k[1]);
    if (nummern == null) {
        nummern = new ArrayList<>();
    }
    nummern.add(k[0]);
}`,
      required: [5],
      extra: [6],
      explain: 'Die neue Liste wird angelegt und gefüllt, aber nie in die Map eingetragen. Nach `nummern = new ArrayList<>();` fehlt `proInhaber.put(k[1], nummern);`. Darum liefert `get` jedes Mal wieder null, und jede Liste geht nach dem Schleifendurchlauf verloren.' },

    { id: 'K04-S03-F10', sec: 'gruppe', type: 'order', t: 'Schritte beim Gruppieren',
      prompt: 'Eine `Map<Kunde, List<Konto>>` soll jedem Inhaber seine Konten zuordnen. Bringe die Schritte **für ein einzelnes Konto** in die richtige Reihenfolge.',
      items: [
        'Den Inhaber des Kontos mit `getInhaber()` holen.',
        'Mit `get(inhaber)` die Liste dieses Inhabers aus der Map holen.',
        'Prüfen, ob das Ergebnis `null` ist.',
        'Falls ja: eine neue `ArrayList` anlegen und mit `put` unter dem Inhaber eintragen.',
        'Das Konto mit `add` zur Liste hinzufügen.'
      ],
      explain: 'Wichtig ist die Reihenfolge von `put` und `add`: Beides geht, weil die Map nur eine Referenz auf die Liste speichert. Vergessen darf man das `put` aber nicht. Gleiche Inhaber (laut `equals`/`compareTo`) landen automatisch in derselben Liste.' },

    { id: 'K04-S03-F11', sec: 'gruppe', type: 'explain', t: 'Warum zwei Konten für Papa?',
      prompt: 'In der Familie gibt es „Papa Hugo, zuhause“ mit einem Sparbuch und den nicht verwandten „Papa Hugo, ganz woanders“ mit gleichem Geburtstag und einem eigenen Sparbuch. Nach dem Gruppieren in einer `TreeMap<Kunde, List<Konto>>` hat „Papa Hugo“ **zwei** Konten. Erkläre, warum, und was man ändern müsste.',
      model: 'Die TreeMap entscheidet über `compareTo`, ob zwei Schlüssel gleich sind (eine HashMap über `equals`/`hashCode`). `compareTo` und `equals` von Kunde vergleichen nur Nachname, Vorname und Geburtstag, nicht die Adresse. Für die Map sind beide also derselbe Schlüssel, und beide Sparbücher landen in einer Liste. Abhilfe: Kunden brauchen ein Merkmal, das wirklich eindeutig ist (z. B. eine Kundennummer), und `equals`, `hashCode` und `compareTo` müssen sich darauf stützen. Nur die Adresse aufzunehmen wäre unsicher, weil Adressen sich ändern.' },

    /* ========== Maps verändern ========== */

    { id: 'K04-S03-F12', sec: 'aendern', type: 'input', wichtig: true, t: 'Map.of und removeIf',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `Map<Long, String> konten = Map.of(1L, "Giro", 2L, "Spar", 3L, "Giro", 4L, "Spar", 5L, "Giro");
try {
    konten.put(6L, "Giro");
} catch (UnsupportedOperationException e) {
    System.out.println("unveränderlich");
}
Map<Long, String> kopie = new TreeMap<>(konten);
kopie.values().removeIf(art -> art.equals("Spar"));
System.out.println(kopie.keySet());
System.out.println(konten.size());`,
      answers: ['unveränderlich\n[1, 3, 5]\n5'],
      explain: '`Map.of` liefert eine **unveränderliche** Map, jedes `put` oder `remove` wirft eine `UnsupportedOperationException`. Die Kopie in eine TreeMap ist veränderbar. `values()` ist eine Sicht: `removeIf` darauf entfernt die passenden Einträge aus der Kopie. Das Original bleibt unberührt.' },

    { id: 'K04-S03-F13', sec: 'aendern', type: 'input', t: 'Löschen beim Durchlaufen',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `Map<String, Integer> stand = new HashMap<>(Map.of("A", 0, "B", 50, "C", 0, "D", 20));
try {
    for (String k : stand.keySet()) {
        if (stand.get(k) == 0) {
            stand.remove(k);
        }
    }
} catch (ConcurrentModificationException e) {
    System.out.println("CME");
}
Map<String, Integer> stand2 = new TreeMap<>(Map.of("A", 0, "B", 50, "C", 0, "D", 20));
stand2.values().removeIf(v -> v == 0);
System.out.println(stand2);`,
      answers: ['CME\n{B=50, D=20}'],
      explain: 'Die for-each-Schleife über `keySet()` arbeitet mit einem Iterator. Wird die Map dabei direkt mit `stand.remove` verändert, passen Iterator und Map nicht mehr zusammen: `ConcurrentModificationException`. Sicher geht es über die Sicht: `values().removeIf(…)` (oder `keySet().removeIf`, `entrySet().removeIf`).' },

    { id: 'K04-S03-F14', sec: 'aendern', type: 'trace', t: 'Map Schritt für Schritt',
      prompt: 'Trage nach jeder Zeile `m.size()` und `m.get("Giro")` ein. Für einen fehlenden Wert schreibe `null`.',
      code: `Map<String, Integer> m = new TreeMap<>();
m.put("Giro", 3);
m.put("Spar", 1);
m.put("Giro", 5);
m.keySet().remove("Spar");
m.values().clear();`,
      columns: ['size()', 'get("Giro")'],
      rows: [
        { label: 'nach `put("Giro", 3)`', values: ['1', '3'] },
        { label: 'nach `put("Spar", 1)`', values: ['2', '3'] },
        { label: 'nach `put("Giro", 5)`', values: ['2', '5'] },
        { label: 'nach `keySet().remove("Spar")`', values: ['1', '5'] },
        { label: 'nach `values().clear()`', values: ['0', 'null'] }
      ],
      explain: 'Ein zweites `put` mit demselben Schlüssel überschreibt, die Größe bleibt 2. `keySet()` und `values()` sind Sichten: Löschen darüber verändert die Map selbst. `values().clear()` leert also die ganze Map.' },

    { id: 'K04-S03-F15', sec: 'aendern', type: 'input', t: 'Statistik mit Collections',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `List<String> inhaber = List.of("Mama", "Mama", "Papa", "Opa", "Papa", "Opa", "Oma", "Mama", "Kind");
System.out.println(Collections.frequency(inhaber, "Mama") + " " + Collections.frequency(inhaber, "Tante"));
System.out.println(Collections.max(inhaber) + " " + Collections.min(inhaber));
System.out.println(Collections.disjoint(inhaber, List.of("Oma", "Tante")) + " " + new HashSet<>(inhaber).size());`,
      answers: ['3 0\nPapa Kind\nfalse 5'],
      explain: '`frequency` zählt Vorkommen (0 bei unbekannt). `max`/`min` nach natürlicher Ordnung der Strings: „Papa“ ist alphabetisch am größten, „Kind“ am kleinsten. `disjoint` ist false, weil „Oma“ in beiden vorkommt. Ein HashSet aus der Liste entfernt Duplikate: 5 verschiedene Inhaber.' }
  ]
});
