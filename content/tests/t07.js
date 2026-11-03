/* Probetest T07: Collections – prüfungsnah, 30 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K90-T07',
  kapitel: 'K90',
  titel: 'Collections',
  beschreibung: 'Generics, List, Set und Map im Prüfungsformat: Zuweisungen, Ausgaben, Sichten, Comparator im TreeSet, Löschen beim Durchlaufen und typische Fehler beim Verwalten von Konten.',
  neu: true,
  dauer: 30,
  themen: [
    { id: 'generics', name: 'Generics' },
    { id: 'listset',  name: 'List & Set' },
    { id: 'map',      name: 'Map & Sichten' },
    { id: 'bank',     name: 'Konten verwalten' }
  ],
  fragen: [

    /* ========== Generics ========== */

    { id: 'K90-T07-F01', sec: 'generics', type: 'multi', t: 'Möglich oder Compilerfehler?',
      prompt: 'Welche Deklarationen **kompilieren**? (mehrere)',
      options: [
        '`Collection<Integer> a = new ArrayList<>();`',
        '`Set<Number> c = new TreeSet<Integer>(List.of(1, 2));`',
        '`SortedSet<String> e = new TreeSet<>();`',
        '`SortedSet<String> f = new HashSet<>();`',
        '`List<?> g = new ArrayList<Double>();`',
        '`Map<String> h = new HashMap<>();`',
        '`List<double> i = new ArrayList<>();`',
        '`Collection<String> j = Map.of("a", "b").values();`'
      ],
      answer: [0, 2, 4, 7],
      explain: 'Keine Polymorphie in den Klammern: Ein `TreeSet<Integer>` ist kein `Set<Number>`. Ein `HashSet` ist nicht sortiert, also kein `SortedSet`. Eine Map braucht zwei Typargumente, primitive Typen sind verboten. `values()` liefert eine `Collection` und passt deshalb.' },

    { id: 'K90-T07-F02', sec: 'generics', type: 'multi', t: 'Korrekt oder falsch',
      prompt: 'Welche Aussagen sind **korrekt**? (mehrere)',
      options: [
        'Ein Cast wie `(List<String>)` schaltet die Typprüfung aus.',
        'Bei `new ArrayList<>()` leitet der Compiler den Typ aus der linken Seite ab.',
        'Über eine `List<?>` darf man beliebige Objekte hinzufügen, weil `?` für jeden Typ steht.',
        'Map erbt von Collection und kann deshalb mit for-each durchlaufen werden.',
        'Ein TreeSet braucht vergleichbare Elemente oder einen Comparator.',
        'Ein HashSet erkennt Duplikate mit `compareTo`.'
      ],
      answer: [0, 1, 4],
      explain: 'Über `List<?>` darf man nur `null` hinzufügen, der echte Typ ist unbekannt. Map erbt **nicht** von Collection und ist nicht Iterable. Das HashSet benutzt `hashCode` und `equals`, das TreeSet `compareTo` bzw. `compare`.' },

    /* ========== List & Set ========== */

    { id: 'K90-T07-F03', sec: 'listset', type: 'input', t: 'Liste und TreeSet',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `List<String> l = new ArrayList<>(List.of("Giro", "Spar", "Depot"));
l.add(0, "Fest");
l.remove("Spar");
l.set(1, "Giro2");
l.add("Giro");
System.out.println(l + " " + l.indexOf("Giro") + " " + l.contains("Spar"));
Set<String> s = new TreeSet<>(l);
System.out.println(s + " " + s.add("Fest") + " " + s.size());`,
      answers: ['[Fest, Giro2, Depot, Giro] 3 false\n[Depot, Fest, Giro, Giro2] false 4'],
      explain: '`add(0, …)` fügt vorne ein, `remove("Spar")` entfernt das Element, `set(1, …)` überschreibt „Giro“ mit „Giro2“, `add` hängt hinten an. „Giro“ steht jetzt an Position 3. Das TreeSet sortiert alphabetisch („Giro“ vor „Giro2“, weil das kürzere Wort bei gleichem Anfang vorne steht). „Fest“ ist schon drin: `add` liefert false.' },

    { id: 'K90-T07-F04', sec: 'listset', type: 'input', t: 'Comparator nur nach Vorname',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `record Kunde(String vorname, String nachname) { }

SortedSet<Kunde> kunden = new TreeSet<>((k1, k2) -> k1.vorname().compareTo(k2.vorname()));
kunden.add(new Kunde("Kind", "Klein"));
kunden.add(new Kunde("Mama", "Erna"));
kunden.add(new Kunde("Kind", "Groß"));
kunden.add(new Kunde("Anna", "Zander"));
System.out.println(kunden.size());
System.out.println(kunden.first().nachname() + " " + kunden.last().nachname());`,
      answers: ['3\nZander Erna'],
      explain: 'Das TreeSet hält zwei Elemente für gleich, wenn der **Comparator** 0 liefert, und der vergleicht nur Vornamen. „Kind Groß“ wird deshalb nicht aufgenommen, obwohl `equals` des Records ihn als verschieden ansehen würde. Wer nach Vorname sortieren will, ohne Kunden zu verlieren, braucht bei Gleichstand ein weiteres Kriterium (z. B. Nachname). `first`/`last` liefern das kleinste und größte Element.' },

    { id: 'K90-T07-F05', sec: 'listset', type: 'mc', t: 'Löschen während des Durchlaufs',
      prompt: 'Aus `List<Konto> konten` sollen alle Konten mit Kontostand 0 entfernt werden (`…` steht für diese Bedingung). Welche Lösung ist **richtig**?',
      options: [
        '`for (Konto k : konten) { if (…) konten.remove(k); }`',
        '`for (int i = 0; i < konten.size(); i++) { if (…) konten.remove(i); }`',
        '`konten.removeIf(k -> k.getKontostand().getBetrag() == 0);`',
        '`for (Konto k : konten) { if (…) k = null; }`'
      ],
      answer: 2,
      explain: '`removeIf` entfernt sicher über den Iterator. Die for-each-Variante wirft eine `ConcurrentModificationException`. Die Index-Schleife überspringt nach jedem Löschen ein Element, weil alles nachrückt, `i` aber trotzdem weiterzählt. `k = null` ändert nur die Schleifenvariable, nicht die Liste.' },

    { id: 'K90-T07-F06', sec: 'listset', type: 'match', t: 'Welche Struktur passt?',
      prompt: 'Ordne jeder Anforderung die passendste Struktur zu.',
      pairs: [
        ['Zu einer Kontonummer schnell das Konto finden', 'HashMap<Long, Konto>'],
        ['Alle Kunden ohne Duplikate, sortiert ausgeben', 'TreeSet<Kunde>'],
        ['Kontoauszug: Buchungen in zeitlicher Reihenfolge, auch gleiche Beträge', 'ArrayList<Buchung>'],
        ['Nur prüfen, ob eine IBAN schon vergeben ist', 'HashSet<String>']
      ],
      explain: 'Zugriff über einen Schlüssel → Map. Keine Duplikate und sortiert → TreeSet. Reihenfolge und Duplikate → List. Nur „ist das schon drin?“ ohne Reihenfolge → HashSet, das ist dafür am schnellsten.' },

    /* ========== Map & Sichten ========== */

    { id: 'K90-T07-F07', sec: 'map', type: 'input', t: 'put, get, remove',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `Map<String, Integer> punkte = new HashMap<>();
punkte.put("Meier", 10);
punkte.put("Kar", 7);
Integer alt = punkte.put("Meier", 12);
System.out.println(alt + " " + punkte.get("Meier") + " " + punkte.size());
System.out.println(punkte.containsKey("Kar") + " " + punkte.containsValue(10) + " " + punkte.get("Abel"));
System.out.println(punkte.remove("Kar") + " " + punkte.remove("Kar"));`,
      answers: ['10 12 2\ntrue false null\n7 null'],
      explain: '`put` mit vorhandenem Schlüssel überschreibt und liefert den alten Wert (10), die Größe bleibt 2. Die 10 ist danach weg, `containsValue(10)` ist false. `get` und `remove` liefern null, wenn der Schlüssel fehlt, statt eine Exception zu werfen.' },

    { id: 'K90-T07-F08', sec: 'map', type: 'fill', t: 'Über eine Map laufen',
      prompt: 'Für eine `Map<Long, Konto> konten` soll jede Zeile „Nummer: Kontostand“ ausgegeben werden.',
      code: `for ([[0]] e : konten.[[1]]()) {
    System.out.println(e.getKey() + ": " + e.[[2]]().getKontostand());
}`,
      blanks: [
        { options: ['Map<Long, Konto>', 'Map.Entry<Long, Konto>', 'Konto', 'Long'], answer: 1,
          why: 'Ein Eintrag der Map ist ein `Map.Entry` mit denselben Typargumenten.' },
        { options: ['values', 'keySet', 'entrySet', 'iterator'], answer: 2,
          why: '`entrySet()` liefert die Paare aus Schlüssel und Wert. Mit `values()` fehlte die Nummer, mit `keySet()` müsste man für jedes Konto noch einmal `get` aufrufen.' },
        { options: ['getValue', 'get', 'value', 'getKonto'], answer: 0,
          why: 'Der Wert eines Entry kommt mit `getValue()`, der Schlüssel mit `getKey()`.' }
      ],
      explain: 'Die Map selbst ist nicht Iterable. Für Schlüssel und Wert zusammen ist `entrySet()` die passende Sicht.' },

    { id: 'K90-T07-F09', sec: 'map', type: 'input', t: 'Sicht oder Kopie?',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `List<Integer> z = new ArrayList<>(List.of(4, 1, 3));
List<Integer> sicht = Collections.unmodifiableList(z);
Set<Integer> kopie = new HashSet<>(z);
Collections.sort(z);
z.add(9);
System.out.println(sicht + " " + kopie.size());
Collections.reverse(z);
System.out.println(sicht.get(0) + " " + Collections.max(kopie));`,
      answers: ['[1, 3, 4, 9] 3\n9 4'],
      explain: '`unmodifiableList` ist eine **Sicht**: Sortieren, Hinzufügen und Umdrehen am Original sieht man darüber sofort. Ändern darf man nur über `sicht` nicht. `new HashSet<>(z)` ist dagegen eine **Kopie** vom Zeitpunkt des Anlegens: Die 9 kommt dort nie an, das Maximum bleibt 4.' },

    /* ========== Konten verwalten ========== */

    { id: 'K90-T07-F10', sec: 'bank', type: 'input', t: 'Ein gefährlicher Getter',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `class Bank {
    private final Map<Long, String> konten =
            new TreeMap<>(Map.of(1L, "Giro", 2L, "Spar", 3L, "Giro"));

    public Set<Long> getAlleKontonummern() {
        return konten.keySet();
    }

    public int anzahl() { return konten.size(); }
}

Bank bank = new Bank();
Set<Long> nummern = bank.getAlleKontonummern();
nummern.remove(2L);
System.out.println(bank.anzahl());
try {
    nummern.add(4L);
} catch (UnsupportedOperationException e) {
    System.out.println("add verboten");
}`,
      answers: ['2\nadd verboten'],
      explain: '`keySet()` ist eine Sicht auf die private Map. Wer den Getter aufruft, kann darüber Konten **löschen**, obwohl `konten` private ist: Die Kapselung ist durchbrochen. Besser liefert der Getter eine Kopie (`new TreeSet<>(konten.keySet())`) oder eine unveränderbare Sicht (`Collections.unmodifiableSet(…)`).' },

    { id: 'K90-T07-F11', sec: 'bank', type: 'mc', t: 'Wie speichert die Bank ihre Konten?',
      prompt: 'Eine Bank vergibt Kontonummern selbst und muss bei fast jeder Methode zu einer Nummer das Konto finden (abheben, einzahlen, löschen, Kontostand). Welches Attribut ist am geeignetsten?',
      options: [
        '`private List<Konto> konten = new ArrayList<>();`',
        '`private Set<Konto> konten = new HashSet<>();`',
        '`private Map<Long, Konto> konten = new HashMap<>();`',
        '`private Konto[] konten = new Konto[1000];` mit der Nummer als Index'
      ],
      answer: 2,
      explain: 'Der Zugriff läuft immer über die Kontonummer, sie ist eindeutig: genau das ist ein Map-Schlüssel. `get(nummer)` findet das Konto direkt, `containsKey` prüft die Existenz, `remove(nummer)` löscht. Mit List oder Set müsste man jedes Mal alle Konten durchsuchen, ein Array hat eine feste Größe.' },

    { id: 'K90-T07-F12', sec: 'bank', type: 'multi', t: 'Was kann bei einer Überweisung schiefgehen?',
      prompt: 'Eine Bank überweist bankintern von Konto `von` nach Konto `nach`. Welche Fälle muss die Methode abfangen, damit **kein Geld verschwindet**? (mehrere)',
      options: [
        'Das Zielkonto existiert gar nicht.',
        'Eines der beiden Konten kann keine Überweisungen (z. B. ein Sparbuch).',
        'Das Absenden klappt nicht, weil der Kontostand bzw. Dispo nicht reicht.',
        'Der Verwendungszweck ist länger als 20 Zeichen.',
        'Vom Konto `von` wird abgebucht, bevor feststeht, dass `nach` existiert.',
        'Beide Konten haben denselben Inhaber.'
      ],
      answer: [0, 1, 2, 4],
      explain: 'Geld verschwindet, wenn auf einer Seite abgebucht wird und auf der anderen nichts ankommt. Darum zuerst **alles prüfen** (beide Konten vorhanden, beide überweisungsfähig) und erst danach buchen. Ob das Absenden geklappt hat, liefert ein Rückgabewert, nur dann wird gutgeschrieben. Ein langer Verwendungszweck oder derselbe Inhaber sind kein Grund, Geld zu verlieren.' },

    { id: 'K90-T07-F13', sec: 'bank', type: 'mc', t: 'Kunden nach Vornamen sortiert',
      prompt: 'Eine Methode soll alle Kunden der Bank als `SortedSet<Kunde>` **nach Vorname sortiert** liefern. `Kunde` ist `Comparable`, aber nach Nachname. Was ist richtig?',
      options: [
        '`new TreeSet<>()` reicht, das TreeSet sortiert Kunden automatisch nach dem ersten Attribut.',
        'Man muss `compareTo` von Kunde auf Vornamen umstellen.',
        '`new HashSet<>()` und am Ende `Collections.sort` aufrufen.',
        'Ein TreeSet mit Comparator nach Vorname, bei Gleichstand nach einem weiteren Kriterium.'
      ],
      answer: 3,
      explain: 'Die natürliche Ordnung (Nachname) bleibt, die besondere Sortierung kommt von außen: Comparator im TreeSet-Konstruktor. Wichtig ist das zweite Kriterium. Sonst gelten alle Kunden mit gleichem Vornamen als Duplikat und verschwinden aus der Menge. `Collections.sort` gibt es nur für Listen, und `compareTo` umzustellen würde jede andere Sortierung im Projekt mitändern.' },

    { id: 'K90-T07-F14', sec: 'listset', type: 'explain', t: 'HashSet gegen TreeSet',
      prompt: 'Erkläre, wie HashSet und TreeSet entscheiden, ob ein Element schon enthalten ist, und warum `compareTo` deshalb konsistent mit `equals` sein sollte.',
      model: 'Das HashSet berechnet mit `hashCode()` das Fach für ein Element und vergleicht dort mit `equals()`. Das TreeSet sortiert in einem Baum und gilt ein Element als enthalten, wenn `compareTo` (bzw. `compare` des Comparators) 0 liefert, `equals` benutzt es gar nicht. Sind `compareTo` und `equals` nicht konsistent, verhalten sich beide Sets mit denselben Objekten verschieden: Liefert `compareTo` 0 für zwei Objekte, die laut `equals` verschieden sind, nimmt das TreeSet das zweite nicht auf, das HashSet schon. Dann hängt das Ergebnis davon ab, welche Set-Klasse jemand gewählt hat.' },

    { id: 'K90-T07-F15', sec: 'map', type: 'mc', t: 'Wort zählen',
      prompt: 'In `Map<String, Integer> anzahl` soll gezählt werden, wie oft jedes Wort vorkommt. Welche Zeile ist für ein Wort `w` richtig, auch wenn `w` zum ersten Mal kommt?',
      options: [
        '`anzahl.put(w, anzahl.get(w) == null ? 0 : anzahl.get(w) + 1);`',
        '`anzahl.add(w, 1);`',
        '`anzahl.put(w, anzahl.get(w) == null ? 1 : anzahl.get(w) + 1);`',
        '`anzahl.get(w)++;`'
      ],
      answer: 2,
      explain: 'Beim ersten Vorkommen liefert `get` null. Die erste Variante setzt dann 0 statt 1, jedes Wort wäre um eins zu niedrig gezählt. Ohne null-Prüfung (`get(w) + 1`) gäbe es eine NullPointerException beim Auspacken. Eine Map hat kein `add`, und `get(w)++` kompiliert nicht: `get` liefert einen Wert, keine Variable, die man hochzählen könnte. Die dritte Variante setzt beim ersten Mal 1, danach den alten Wert plus 1 (`put` überschreibt).' }
  ]
});
