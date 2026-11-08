/* Probetest T08: Fallaufgaben Collections (40 Minuten)
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Eine Fallaufgabe mit mehreren Teilaufgaben plus Einzelfragen, wie in der Prüfung.
   Alle Ausgaben und die JUnit-Musterlösung wurden mit javac/java geprüft. */
P3.serie({
  id: 'K90-T08',
  kapitel: 'K90',
  titel: 'Probetest 8: Fallaufgabe Collections',
  beschreibung: 'Eine Vereinsverwaltung als große Aufgabe (ergänzen, vorhersagen, Fehler finden, testen) und dazu Einzelfragen zu Listen, Mengen und Iteratoren. 40 Minuten.',
  neu: true,
  dauer: 40,
  themen: [
    { id: 'verein', name: 'Fallaufgabe Vereinsverwaltung' },
    { id: 'listen', name: 'Listen, Mengen, Iteratoren' }
  ],
  faelle: [
    { id: 'V', titel: 'Vereinsverwaltung',
      text: `Ein Sportverein vergibt bei der Aufnahme eine fortlaufende **Mitgliedsnummer** (1, 2, 3 …). Mitglieder können sich in beliebig viele **Abteilungen** eintragen (Schach, Laufen …), in jede aber nur einmal.

Tritt jemand aus, verschwindet er aus dem Verein **und** aus allen Abteilungen; eine Abteilung ohne Mitglieder wird gelöscht. \`getGroessen()\` liefert zu jeder Abteilung die Zahl ihrer Mitglieder, alphabetisch nach Abteilung.`,
      code: `public record Mitglied(String name, int geburtsjahr) { }

public class Verein {
    private final Map<Integer, Mitglied> mitglieder = new HashMap<>();       // Nummer -> Mitglied
    private final Map<String, Set<Integer>> abteilungen = new TreeMap<>();  // Abteilung -> Nummern
    private int naechsteNummer = 1;

    public int aufnehmen(Mitglied m) {
        if (m == null)
            throw new NullPointerException("Mitglied fehlt");
        int nr = naechsteNummer++;
        mitglieder.put(nr, m);
        return nr;
    }

    public boolean eintragen(int nr, String abteilung) {
        if (!mitglieder.containsKey(nr))
            return false;
        Set<Integer> nummern = abteilungen.get(abteilung);
        if (nummern == null) {
            nummern = new TreeSet<>();
            abteilungen.put(abteilung, nummern);
        }
        return nummern.add(nr);
    }

    public boolean istMitglied(int nr) {
        return mitglieder.containsKey(nr);
    }

    public boolean austreten(int nr) { /* Teilaufgabe */ }

    public Map<String, Integer> getGroessen() {
        Map<String, Integer> groessen = new TreeMap<>();
        for (Map.Entry<String, Set<Integer>> e : abteilungen.entrySet())
            groessen.put(e.getKey(), e.getValue().size());
        return groessen;
    }
}` }
  ],
  fragen: [

    /* ========== Fallaufgabe ========== */

    { id: 'K90-T08-F01', sec: 'verein', fall: 'V', type: 'mc', wichtig: true, t: 'V1 · Warum eine Map für die Mitglieder?',
      prompt: 'Warum speichert der Verein die Mitglieder in einer `Map<Integer, Mitglied>` und nicht in einer `List<Mitglied>`?',
      options: [
        'Weil eine `List` keine Records aufnehmen kann.',
        'Weil eine `Map` ihre Einträge automatisch nach Nummer sortiert.',
        'Weil eine `List` keine zwei gleichen Mitglieder speichern darf.',
        'Weil man ein Mitglied direkt über seine Nummer findet, ohne zu suchen.'
      ],
      answer: 3,
      explain: 'Fast jede Methode bekommt eine **Nummer**. Mit der Map ist `get`/`containsKey`/`remove` ein direkter Zugriff. In einer Liste müsste man alle Mitglieder durchlaufen, und die Nummer müsste zusätzlich im Mitglied stehen. Außerdem bleiben Nummern beim Austreten stabil, Listenindizes würden sich verschieben. Eine `HashMap` sortiert **nicht**; Listen nehmen Records und Duplikate problemlos auf.' },

    { id: 'K90-T08-F02', sec: 'verein', fall: 'V', type: 'input', wichtig: true, t: 'V2 · Ausgabe vorhersagen',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `Verein v = new Verein();
int a = v.aufnehmen(new Mitglied("Tom", 2001));
int b = v.aufnehmen(new Mitglied("Ida", 1999));
int c = v.aufnehmen(new Mitglied("Tom", 2001));
System.out.println(a + " " + b + " " + c);
System.out.print(v.eintragen(a, "Schach") + " ");
System.out.print(v.eintragen(a, "Schach") + " ");
System.out.print(v.eintragen(b, "Laufen") + " ");
System.out.print(v.eintragen(c, "Schach") + " ");
System.out.println(v.eintragen(9, "Laufen"));
System.out.println(v.getGroessen());`,
      answers: ['1 2 3\ntrue false true true false\n{Laufen=1, Schach=2}'],
      explain: 'Die Nummern kommen aus dem Zähler-Attribut: 1, 2, 3. Die zwei Toms sind als Records zwar gleich, bekommen aber verschiedene Nummern, denn der **Schlüssel** ist die Nummer. `Set.add` liefert `false`, wenn das Element schon drin ist (zweites Schach für 1). Nummer 9 gibt es nicht. Die `TreeMap` sortiert die Abteilungen alphabetisch: Laufen vor Schach.' },

    { id: 'K90-T08-F03', sec: 'verein', fall: 'V', type: 'fill', wichtig: true, t: 'V3 · austreten ergänzen',
      prompt: 'Ergänze `austreten` so, wie es in der Ausgangslage beschrieben ist. Rückgabe `false`, wenn es die Nummer nicht gab.',
      code: `public boolean austreten(int nr) {
    if (mitglieder.[[0]](nr) == null)
        return false;
    for (Set<Integer> nummern : abteilungen.[[1]]())
        nummern.remove(nr);
    abteilungen.values().[[2]](Set::isEmpty);
    return true;
}`,
      blanks: [
        { options: ['get', 'remove', 'containsKey', 'put'], answer: 1,
          why: '`remove` löscht **und** liefert den alten Wert oder `null`: Prüfen und Löschen in einem Schritt. Mit `get` wäre das Mitglied danach noch im Verein.' },
        { options: ['keySet', 'entrySet', 'values', 'size'], answer: 2,
          why: 'Gebraucht werden nur die Mengen, nicht die Abteilungsnamen: `values()`. Über diese Sicht kommt man an die echten Set-Objekte in der Map heran, `remove` darauf ändert also wirklich die Abteilungen.' },
        { options: ['removeAll', 'removeIf', 'remove', 'clear'], answer: 1,
          why: '`removeIf` nimmt eine Bedingung (hier die Methodenreferenz `Set::isEmpty`) und löscht über die Sicht alle passenden Einträge aus der Map, ohne `ConcurrentModificationException`.' }
      ],
      explain: 'Falle in Zeile 5: `nummern.remove(nr)` mit einem `int`. Ein `Set` hat nur `remove(Object)`, `nr` wird zu `Integer` gepackt, und das richtige Element wird entfernt. Bei einer `List<Integer>` wäre `remove(nr)` dagegen das Entfernen an **Index** `nr`. Würde man die leeren Abteilungen in einer for-each-Schleife mit `abteilungen.remove(...)` löschen, gäbe es eine CME.' },

    { id: 'K90-T08-F04', sec: 'verein', fall: 'V', type: 'bug', wichtig: true, t: 'V4 · Mitglieder nach Alter',
      prompt: 'Diese zusätzliche Methode soll **alle** Mitglieder nach Geburtsjahr sortiert liefern. Bei den Mitgliedern Tom (2001), Ida (1999) und Eva (1999) kommen aber nur zwei heraus. Markiere die Ursache und erkläre.',
      code: `public SortedSet<Mitglied> nachAlter() {
    SortedSet<Mitglied> s = new TreeSet<>((m1, m2) -> m1.geburtsjahr() - m2.geburtsjahr());
    s.addAll(mitglieder.values());
    return s;
}`,
      required: [2],
      model: 'Der Comparator vergleicht **nur** das Geburtsjahr. Ida und Eva liefern `compare == 0`, und ein TreeSet hält sie damit für dasselbe Element, Eva wird beim `addAll` nicht aufgenommen. Abhilfe: bei Gleichheit weiter vergleichen, z. B. nach Name. Aber Vorsicht: Zwei Mitglieder können als Record **völlig gleich** sein (zwei Toms von 2001), dann hilft auch das nicht. Wer wirklich alle haben will, sortiert eine **Liste**: `List<Mitglied> l = new ArrayList<>(mitglieder.values()); l.sort(Comparator.comparingInt(Mitglied::geburtsjahr));` Außerdem ist `Integer.compare` sauberer als die Subtraktion.',
      explain: 'Im TreeSet entscheidet `compare`, nicht `equals`, über Duplikate. Ein Set ist die falsche Struktur, wenn gleiche Elemente erhalten bleiben müssen.' },

    { id: 'K90-T08-F05', sec: 'verein', fall: 'V', type: 'multi', t: 'V5 · Was stimmt?',
      prompt: 'Welche Aussagen über die Klasse `Verein` sind richtig?',
      options: [
        '`eintragen(nr, "Schach")` mit einer unbekannten Nummer legt keine Abteilung an.',
        'Die Mitglieder einer Abteilung sind nach Nummer aufsteigend sortiert.',
        '`getGroessen()` gibt eine Sicht zurück: Spätere Eintragungen ändern sie mit.',
        'Nach einem Austritt kann die frei gewordene Nummer neu vergeben werden.',
        'Wer `getGroessen().put("Golf", 99)` aufruft, ändert die Abteilungen nicht.'
      ],
      answer: [0, 1, 4],
      explain: 'Die Prüfung `containsKey` kommt **vor** dem Anlegen der Menge. Die Nummern liegen in einem `TreeSet<Integer>`, also aufsteigend. `getGroessen()` baut bei jedem Aufruf eine **neue** `TreeMap`: eine Momentaufnahme, die man sogar verändern darf, ohne den Verein zu berühren. Der Zähler wird nie zurückgesetzt, Nummern werden nicht wiederverwendet.' },

    { id: 'K90-T08-F06', sec: 'verein', fall: 'V', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 7, t: 'V6 · Tests für austreten',
      prompt: 'Schreibe JUnit-5-Tests für `austreten`. Ausgangszustand: Tom ist in Schach und Laufen, Ida nur in Laufen. Teste den normalen Austritt (alle Abteilungen), das Verschwinden leerer Abteilungen, eine unbekannte Nummer und doppeltes Austreten.',
      model: 'Kernpunkte: (1) `@BeforeEach` mit dem beschriebenen Ausgangszustand, die Nummern aus `aufnehmen` merken. (2) Nach dem Austritt: Rückgabe `true`, kein Mitglied mehr (`istMitglied`) **und** die Abteilungsgrößen stimmen. (3) Schach ist danach leer, also nicht mehr in `getGroessen()`. (4) Unbekannte Nummer: `false` und nichts hat sich verändert. (5) Zweiter Austritt derselben Nummer: `false`. Vergleich ganzer Maps mit `assertEquals(Map.of(...), …)` geht, weil `equals` von Maps die Einträge vergleicht, nicht die Klasse.',
      modelCode: `class VereinTest {
    private Verein verein;
    private int tom;
    private int ida;

    @BeforeEach
    void setUp() {
        verein = new Verein();
        tom = verein.aufnehmen(new Mitglied("Tom", 2001));
        ida = verein.aufnehmen(new Mitglied("Ida", 1999));
        verein.eintragen(tom, "Schach");
        verein.eintragen(tom, "Laufen");
        verein.eintragen(ida, "Laufen");
    }

    @Test
    void austretenEntferntAusAllenAbteilungen() {
        assertTrue(verein.austreten(tom));
        assertFalse(verein.istMitglied(tom));
        assertEquals(Map.of("Laufen", 1), verein.getGroessen());
    }

    @Test
    void leereAbteilungVerschwindet() {
        verein.austreten(tom);
        assertFalse(verein.getGroessen().containsKey("Schach"));
    }

    @Test
    void austretenUnbekannteNummer() {
        assertFalse(verein.austreten(99));
        assertEquals(Map.of("Laufen", 2, "Schach", 1), verein.getGroessen());
    }

    @Test
    void zweimalAustreten() {
        assertTrue(verein.austreten(ida));
        assertFalse(verein.austreten(ida));
    }
}`,
      explain: 'Gut getestet ist ein Fehlschlag erst, wenn man auch prüft, dass **nichts** verändert wurde. `Map.of(...)` ist dabei bequem: Eine `TreeMap` mit denselben Einträgen ist gleich.' },

    /* ========== Einzelfragen ========== */

    { id: 'K90-T08-F07', sec: 'listen', type: 'input', wichtig: true, t: 'remove bei List<Integer>',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `List<Integer> zahlen = new ArrayList<>(List.of(3, 1, 4, 1, 5));
zahlen.remove(1);
System.out.println(zahlen);
zahlen.remove(Integer.valueOf(1));
System.out.println(zahlen);`,
      answers: ['[3, 4, 1, 5]\n[3, 4, 5]'],
      explain: '`List` hat zwei `remove`: `remove(int index)` und `remove(Object o)`. Mit dem `int`-Literal 1 passt `remove(int)` ohne Umwandlung, also wird **Index** 1 entfernt (die erste 1). Mit `Integer.valueOf(1)` passt `remove(Object)`: Das **erste Vorkommen** des Werts 1 wird entfernt.' },

    { id: 'K90-T08-F08', sec: 'listen', type: 'input', t: 'Helfer aus Collections',
      prompt: 'Was gibt das Programm aus?',
      code: `List<String> w = new ArrayList<>(List.of("kiwi", "apfel", "kiwi", "birne"));
Collections.sort(w);
System.out.println(w + " " + Collections.frequency(w, "kiwi") + " " + Collections.max(w));`,
      answers: ['[apfel, birne, kiwi, kiwi] 2 kiwi'],
      explain: '`Collections.sort` sortiert Strings alphabetisch (natürliche Ordnung) und behält Duplikate. `frequency` zählt mit `equals`: 2. `max` liefert das größte Element nach `compareTo`, hier „kiwi“. Mit `List.of` direkt (ohne `new ArrayList<>`) wäre `sort` eine `UnsupportedOperationException`.' },

    { id: 'K90-T08-F09', sec: 'listen', type: 'mc', t: 'Set.of mit Duplikat',
      prompt: 'Was passiert bei `Set<String> s = Set.of("a", "b", "a");`?',
      options: [
        'Es fliegt zur Laufzeit eine `IllegalArgumentException`.',
        '`s` enthält „a“ und „b“, das zweite „a“ wird ignoriert.',
        'Der Compiler meldet einen Fehler wegen des doppelten Werts.',
        '`s` enthält dreimal ein Element, weil `Set.of` nicht prüft.'
      ],
      answer: 0,
      explain: '`Set.of` behandelt ein Duplikat als Programmierfehler und wirft eine `IllegalArgumentException` (bei `null` eine `NullPointerException`). Der Compiler prüft keine Werte. Nur `add` auf einem normalen Set ignoriert Duplikate still (Rückgabe `false`).' },

    { id: 'K90-T08-F10', sec: 'listen', type: 'multi', wichtig: true, t: 'Wann gibt es eine ConcurrentModificationException?',
      prompt: 'Welche Ausschnitte enden mit einer `ConcurrentModificationException`? Ausgangslage jeweils neu: `l = new ArrayList<>(List.of("a", "b", "c"))` und `m = new HashMap<>(Map.of("x", 1, "y", 2, "z", 3))`.',
      options: [
        '`for (String s : l) if (s.equals("a")) l.remove(s);`',
        '`for (String s : l) if (s.equals("b")) l.remove(s);`',
        '`for (String k : m.keySet()) m.put(k, m.get(k) * 10);`',
        '`for (String k : m.keySet()) m.put(k + "!", 0);`',
        '`Iterator<String> it = l.iterator(); while (it.hasNext()) if (it.next().equals("a")) it.remove();`'
      ],
      answer: [0, 3],
      explain: 'A: Nach dem Entfernen läuft die Schleife weiter, der Iterator merkt die Änderung: CME. B ist die berühmte Ausnahme: „b“ ist das **vorletzte** Element; danach ist die Größe 2 und `hasNext()` liefert schon `false`, die Schleife endet ohne CME, „c“ wird aber nie geprüft. Auf so einen Zufall baut man nicht. C: `put` mit **vorhandenem** Schlüssel ändert nur einen Wert, keine Struktur, also erlaubt. D: neue Schlüssel = strukturelle Änderung, CME. E: `it.remove()` ist die erlaubte Art. (Alle Fälle mit Java ausprobiert.)' },

    { id: 'K90-T08-F11', sec: 'listen', type: 'fill', t: 'Löschen mit dem Iterator',
      prompt: 'Entferne aus der Liste alle leeren Strings, ohne `removeIf` und ohne `ConcurrentModificationException`.',
      code: `Iterator<String> it = woerter.[[0]]();
while (it.[[1]]()) {
    if (it.next().isEmpty())
        [[2]];
}`,
      blanks: [
        { options: ['iterator', 'listIterator(0).next', 'stream', 'values'], answer: 0,
          why: 'Jede Collection liefert mit `iterator()` einen Iterator, der genau einmal über die Elemente läuft.' },
        { options: ['next', 'hasNext', 'isEmpty', 'remove'], answer: 1,
          why: '`hasNext()` fragt, ob noch ein Element kommt. `next()` in der Bedingung würde bei jedem Durchlauf ein Element verschlucken.' },
        { options: ['woerter.remove(it.next())', 'it.remove()', 'woerter.remove(it)', 'it.next().remove()'], answer: 1,
          why: '`it.remove()` löscht das zuletzt mit `next()` gelieferte Element und hält den Iterator dabei konsistent. Ein `remove` direkt auf der Liste führt zur CME, ein zweites `next()` würde außerdem ein Element überspringen.' }
      ],
      explain: 'Kurzform mit gleichem Ergebnis: `woerter.removeIf(String::isEmpty);` Intern macht `removeIf` genau das Gleiche, nur sicher verpackt.' },

    { id: 'K90-T08-F12', sec: 'listen', type: 'match', t: 'Rückgabe bei fehlendem Element',
      prompt: 'Was liefert der Aufruf, wenn der Schlüssel bzw. Index **nicht** vorhanden ist? Ordne zu (`m` ist eine `HashMap<String, Integer>`, `l` eine `ArrayList<String>` mit 2 Elementen).',
      pairs: [
        ['`m.get("x")`', '`null`'],
        ['`m.containsKey("x")`', '`false`'],
        ['`m.getOrDefault("x", 0)`', '`0`'],
        ['`l.get(5)`', '`IndexOutOfBoundsException`'],
        ['`l.indexOf("x")`', '`-1`']
      ],
      explain: 'Maps antworten bei fehlenden Schlüsseln still (`null`, `false`, Ersatzwert), Listen werfen bei ungültigen Indizes eine Exception. `indexOf` sucht einen **Wert** und meldet „nicht gefunden“ mit −1.' }
  ]
});
