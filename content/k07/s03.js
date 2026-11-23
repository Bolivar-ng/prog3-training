/* Kapitel 07 · Serie S03: Streams – lazy, Reihenfolge, reduce, collect, Collector, Spielregeln
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben wurden mit javac/java ausgeführt und geprüft. */
P3.serie({
  id: 'K07-S03',
  kapitel: 'K07',
  titel: 'Streams: lazy, reduce, collect und Collector',
  beschreibung: 'Ausführungsreihenfolge und Laziness als Ausgabe-Aufgaben, verbrauchte Streams, reduce Schritt für Schritt, reduce gegen collect, Collectors (joining, groupingBy, partitioningBy, counting), Collector.of, stateless und non-interfering.',
  neu: true,
  minutenProFrage: 2,
  themen: [
    { id: 'lazy',    name: 'Lazy und Reihenfolge' },
    { id: 'reduce',  name: 'reduce' },
    { id: 'collect', name: 'collect und Collector' },
    { id: 'regeln',  name: 'Spielregeln' }
  ],
  fragen: [

    { id: 'K07-S03-F01', sec: 'lazy', type: 'input', wichtig: true, t: 'Ohne terminal Operation',
      prompt: 'Was wird ausgegeben?',
      code: `Stream<String> s = Stream.of("a", "b")
        .map(x -> { System.out.print(x); return x; });
System.out.print("!");`,
      answers: ['!'],
      explain: 'Es fehlt eine terminal Operation. Das `map`-Lambda wird deshalb **nie** ausgeführt, nur das `!` erscheint. Mit `s.forEach(x -> {})` danach käme `!ab` heraus.' },

    { id: 'K07-S03-F02', sec: 'lazy', type: 'input', wichtig: true, t: 'Element für Element',
      prompt: 'Was wird ausgegeben? (alles in einer Zeile)',
      code: `Stream.of(1, 2, 3)
      .filter(n -> { System.out.print("f" + n + " "); return n != 2; })
      .map(n -> { System.out.print("m" + n + " "); return n * 10; })
      .forEach(n -> System.out.print(n + " "));`,
      answers: ['f1 m1 10 f2 f3 m3 30'],
      explain: 'Ein Stream arbeitet **Element für Element**, nicht Station für Station: Die 1 läuft durch filter, map und forEach, bevor die 2 überhaupt geprüft wird. Die 2 fällt im filter heraus und erreicht map nie. Falsch wäre „f1 f2 f3 m1 m3 10 30“.' },

    { id: 'K07-S03-F03', sec: 'lazy', type: 'input', wichtig: true, t: 'findFirst hört früh auf',
      prompt: 'Was wird ausgegeben?',
      code: `int r = Stream.of(4, 7, 9, 12)
        .filter(n -> { System.out.print(n + " "); return n % 3 == 0; })
        .findFirst().get();
System.out.print("-> " + r);`,
      answers: ['4 7 9 -> 9'],
      explain: '`findFirst` braucht nur **ein** Ergebnis. Sobald die 9 den Filter passiert, ist die Arbeit getan, und die 12 wird nie geprüft. Das ist „lazy“: Es wird nur gerechnet, was für das Ergebnis nötig ist.' },

    { id: 'K07-S03-F04', sec: 'lazy', type: 'input', t: 'Unendlich, aber begrenzt',
      prompt: 'Was wird ausgegeben?',
      code: `Stream.iterate(1, n -> n * 3)
      .map(n -> { System.out.print(n + " "); return n; })
      .limit(3)
      .forEach(n -> { });`,
      answers: ['1 3 9'],
      explain: '`iterate` erzeugt 1, 3, 9, 27 … unendlich viele Werte. Weil Elemente einzeln durchlaufen und `limit(3)` nach drei Elementen abbricht, wird die 27 gar nicht mehr erzeugt. Ohne `limit` liefe das Programm endlos.' },

    { id: 'K07-S03-F05', sec: 'lazy', type: 'input', t: 'sorted muss alle kennen',
      prompt: 'Was wird ausgegeben? (alles in einer Zeile)',
      code: `Stream.of(3, 1, 2)
      .map(n -> { System.out.print("m" + n + " "); return n; })
      .sorted()
      .forEach(n -> System.out.print("e" + n + " "));`,
      answers: ['m3 m1 m2 e1 e2 e3'],
      explain: 'Ausnahme von „Element für Element“: `sorted` kann das kleinste Element erst weitergeben, wenn es **alle** gesehen hat. Deshalb laufen erst alle drei durch `map`, danach kommen sie sortiert bei `forEach` an.' },

    { id: 'K07-S03-F06', sec: 'lazy', type: 'multi', wichtig: true, t: 'Aussagen zu lazy',
      prompt: 'Welche Aussagen stimmen?',
      options: [
        'Intermediate Operations allein bewirken nichts.',
        'Erst die terminal Operation startet die Verarbeitung.',
        'Jede intermediate Operation läuft erst über alle Elemente, bevor die nächste beginnt.',
        '`findFirst` und `anyMatch` können aufhören, bevor alle Elemente geprüft sind.',
        'Ein Stream verändert die Collection, aus der er erzeugt wurde.'
      ],
      answer: [0, 1, 3],
      explain: 'Die Verarbeitung läuft Element für Element (Ausnahme: `sorted`, das alle sammeln muss). Short-circuit-Operationen wie `findFirst`, `anyMatch` oder `limit` brechen ab, sobald das Ergebnis feststeht. Die Quelle bleibt immer unverändert, ein Stream liefert ein **neues** Ergebnis.' },

    { id: 'K07-S03-F07', sec: 'lazy', type: 'bug', wichtig: true, t: 'Stream zweimal benutzt',
      prompt: 'Welche Zeile wirft zur Laufzeit eine Exception? Markiere sie und erkläre.',
      code: `Stream<String> lang = namen.stream().filter(n -> n.length() > 3);
long anzahl = lang.count();
List<String> liste = lang.toList();
System.out.println(anzahl + " " + liste);`,
      required: [3],
      model: 'Zeile 3: `count()` in Zeile 2 ist eine terminal Operation, danach ist der Stream **verbraucht**. Ein zweiter Aufruf wirft eine IllegalStateException („stream has already been operated upon or closed“). Lösung: für jede Auswertung einen neuen Stream erzeugen oder zuerst die Liste bilden und `liste.size()` nehmen.',
      explain: 'Den Stream in einer Variablen zu speichern, ist erlaubt, aber selten sinnvoll. Ketten schreibt man meist in einem Zug von `stream()` bis zur terminal Operation.' },

    { id: 'K07-S03-F08', sec: 'reduce', type: 'trace', wichtig: true, t: 'reduce Schritt für Schritt',
      prompt: 'Trage für `Stream.of(5, 1, 4).reduce(0, (a, b) -> a + b)` die Werte bei jedem Aufruf des Lambdas ein.',
      code: `int summe = Stream.of(5, 1, 4).reduce(0, (a, b) -> a + b);`,
      columns: ['a', 'b', 'Ergebnis'],
      rows: [
        { label: '1. Aufruf', values: ['0', '5', '5'] },
        { label: '2. Aufruf', values: ['5', '1', '6'] },
        { label: '3. Aufruf', values: ['6', '4', '10'] }
      ],
      explain: '`a` ist das **bisherige Ergebnis** (am Anfang der Startwert 0), `b` das **nächste Element**. Das Ergebnis wird zum neuen `a`. Wie die Schleife `summe = summe + b`.' },

    { id: 'K07-S03-F09', sec: 'reduce', type: 'input', t: 'reduce mit Multiplikation',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of(2, 3, 4).reduce(1, (a, b) -> a * b));`,
      answers: ['24'],
      explain: '1·2 = 2, 2·3 = 6, 6·4 = 24. Der Startwert muss zur Operation passen: Bei der Multiplikation ist es 1. Mit 0 wäre das Ergebnis immer 0.' },

    { id: 'K07-S03-F10', sec: 'reduce', type: 'input', t: 'reduce mit Strings',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of("x", "y", "z").reduce("", (a, b) -> b + a));`,
      answers: ['zyx'],
      explain: 'Achtung, `b + a`: Das neue Element kommt **vor** das bisherige Ergebnis. "" → "x" → "yx" → "zyx". Der String wird also umgedreht.' },

    { id: 'K07-S03-F11', sec: 'reduce', type: 'mc', wichtig: true, t: 'reduce oder collect?',
      prompt: 'Die Elemente sollen in einem `StringBuilder` gesammelt werden, an den nur `append` angehängt wird. Was passt laut Vorlesung?',
      options: [
        '`reduce`, weil bei jedem Schritt eine neue Zuweisung an die Ergebnisvariable passiert.',
        '`collect`, weil dasselbe Ergebnisobjekt durch einen Methodenaufruf erweitert wird.',
        '`forEach`, weil man den StringBuilder außerhalb anlegen und darin sammeln soll.',
        '`count`, weil man vorher wissen muss, wie viele Elemente angehängt werden.'
      ],
      answer: 1,
      explain: 'Die Unterscheidung lautet: `alle = alle + b` (Zuweisung, jedes Mal ein **neues** Objekt) → `reduce`. `alle.append(b)` (Methodenaufruf, **dasselbe** Objekt wächst) → `collect`. `forEach` mit einem Objekt außerhalb verletzt die Regel „stateless“.' },

    { id: 'K07-S03-F12', sec: 'collect', type: 'input', wichtig: true, t: 'Collectors.joining',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of("rot", "grün", "blau").sorted().collect(Collectors.joining(", ")));`,
      answers: ['blau, grün, rot'],
      explain: '`joining(", ")` setzt die Elemente mit Trennzeichen **zwischen** sie zusammen, ohne Komma am Ende. Das ist effizienter und sauberer als `reduce("", (a, b) -> a + b + ", ")`.' },

    { id: 'K07-S03-F13', sec: 'collect', type: 'input', wichtig: true, t: 'Collectors.groupingBy',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(
    Stream.of("Ida", "Jonas", "Lea", "Maximilian")
        .collect(Collectors.groupingBy(s -> s.length())));`,
      answers: ['{3=[Ida, Lea], 5=[Jonas], 10=[Maximilian]}'],
      explain: '`groupingBy(f)` liefert eine `Map`: Schlüssel ist `f(element)` (hier die Länge), Wert die **Liste** aller Elemente mit diesem Schlüssel, in der Stream-Reihenfolge.' },

    { id: 'K07-S03-F14', sec: 'collect', type: 'input', t: 'Collectors.partitioningBy',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of(1, 2, 3, 4, 5).collect(Collectors.partitioningBy(n -> n % 2 == 0)));`,
      answers: ['{false=[1, 3, 5], true=[2, 4]}'],
      explain: '`partitioningBy` erwartet ein **Predicate** und teilt in genau zwei Gruppen: `false` und `true`. Es ist ein Spezialfall von `groupingBy` mit boolean-Schlüssel.' },

    { id: 'K07-S03-F15', sec: 'collect', type: 'match', t: 'Welcher Collector?',
      prompt: 'Ordne jedem Ziel den passenden Collector aus der Klasse `Collectors` zu.',
      pairs: [
        ['alle Elemente als `Set`', '`Collectors.toSet()`'],
        ['Strings mit Trennzeichen verbinden', '`Collectors.joining(", ")`'],
        ['Anzahl der Elemente', '`Collectors.counting()`'],
        ['nach einem Merkmal in Gruppen teilen', '`Collectors.groupingBy(…)`'],
        ['in genau zwei Gruppen (ja/nein)', '`Collectors.partitioningBy(…)`']
      ],
      explain: 'Weitere aus der Vorlesung: `toList`, `toMap`, `toCollection`, `maxBy`, `minBy`, `averagingDouble`. Alle werden an `collect(…)` übergeben.' },

    { id: 'K07-S03-F16', sec: 'collect', type: 'mc', t: 'Was ist A in Collector<T, A, R>?',
      prompt: '`collect` erwartet einen `Collector<T, A, R>`. Wofür steht **A**?',
      options: [
        'für den Typ der Elemente, die im Stream ankommen',
        'für den Typ des Endergebnisses, das `collect` zurückgibt',
        'für die Anzahl der Prozessoren bei einem parallelen Stream',
        'für den Zwischenspeicher, in dem gesammelt wird'
      ],
      answer: 3,
      explain: '**T** = Typ der Stream-Elemente, **A** = Zwischenspeicher (z. B. ein `StringBuilder`), **R** = Typ des Ergebnisses (z. B. `String`). Ohne Finisher sind A und R derselbe Typ.' },

    { id: 'K07-S03-F17', sec: 'collect', type: 'match', wichtig: true, t: 'Die vier Teile von Collector.of',
      prompt: 'Ordne jedem Teil von `Collector.of(…)` sein funktionales Interface zu.',
      pairs: [
        ['Start (leerer Zwischenspeicher)', '`Supplier<A>`'],
        ['Hinzufüger / Akkumulator (Element hinein)', '`BiConsumer<A, T>`'],
        ['Kombinierer / Combiner (Teilergebnisse zusammen)', '`BiConsumer<A, A>`'],
        ['Umwandler / Finisher (Endergebnis bilden)', '`Function<A, R>`']
      ],
      explain: 'So liest es sich wie eine Schleife: Start = Variable vor der Schleife, Hinzufüger = Schleifenrumpf, Kombinierer = Teilergebnisse paralleler Prozessoren zusammenfügen, Finisher = nach der Schleife das Ergebnis erzeugen (optional).' },

    { id: 'K07-S03-F18', sec: 'collect', type: 'fill', wichtig: true, t: 'Collector.of selbst schreiben',
      prompt: 'Der Collector soll alle Strings ohne Trennzeichen aneinanderhängen. `Stream.of("Ja", "va").collect(c)` liefert dann `"Java"`. Ergänze.',
      code: `Collector<String, StringBuilder, String> c = Collector.of(
        [[0]],
        [[1]],
        (a, b) -> a.append(b),
        [[2]]);`,
      blanks: [
        { options: ['() -> new StringBuilder()', '() -> ""', 'sb -> new StringBuilder()', 'new StringBuilder()'], answer: 0,
          why: 'Der Start ist ein **Supplier**: keine Parameter, liefert den leeren Zwischenspeicher. `new StringBuilder()` ohne Lambda wäre nur ein Objekt, kein Supplier.' },
        { options: ['(sb, e) -> sb + e', '(sb, e) -> sb.append(e)', 'e -> sb.append(e)', '(sb, e) -> e.append(sb)'], answer: 1,
          why: 'Der Hinzufüger ist ein **BiConsumer<A, T>**: Speicher und Element rein, das Element wird an den Speicher angehängt.' },
        { options: ['sb -> sb.toString()', '() -> sb.toString()', '(sb, e) -> sb.toString()', 'sb -> sb'], answer: 0,
          why: 'Der Finisher ist eine **Function<A, R>**: aus dem `StringBuilder` wird der `String`.' }
      ],
      explain: 'Der Kombinierer `(a, b) -> a.append(b)` wird nur bei parallelen Streams gebraucht, um die Teil-StringBuilder zu vereinigen. Für dieses Ziel gibt es fertig `Collectors.joining()`.' },

    { id: 'K07-S03-F19', sec: 'regeln', type: 'multi', wichtig: true, t: 'Welche Lambdas verletzen die Regeln?',
      prompt: 'Welche dieser Stream-Aufrufe verletzen die Regeln **non-interfering** oder **stateless**?',
      options: [
        '`liste.stream().forEach(e -> liste.remove(e));`',
        '`liste.stream().forEach(e -> neu.add(e));` (neu ist eine Liste außerhalb)',
        '`liste.stream().map(s -> s.trim()).toList();`',
        '`liste.stream().filter(s -> s.length() > GRENZE).count();` (GRENZE ist eine Konstante)',
        '`liste.stream().map(s -> zaehler[0]++ + s).toList();` (zaehler ist ein Array außerhalb)'
      ],
      answer: [0, 1, 4],
      explain: 'Das erste **verändert die Quelle** (non-interfering verletzt). Bei einer ArrayList fliegt eine ConcurrentModificationException. Das zweite und das letzte ändern **Zustand außerhalb** des Lambdas (stateless verletzt), parallel gehen dabei Daten verloren oder die Reihenfolge ist zufällig. `trim` und der Vergleich mit einer Konstanten hängen nur vom Element ab und sind unbedenklich.' },

    { id: 'K07-S03-F20', sec: 'regeln', type: 'mc', t: 'Warum ist Zustand gefährlich?',
      prompt: '`liste.parallelStream().forEach(e -> neu.add(e));` mit `neu` als `ArrayList`. Was kann passieren?',
      options: [
        'Elemente können fehlen oder doppelt sein, die Reihenfolge ist zufällig.',
        'Nichts, denn `parallelStream` sorgt automatisch für die richtige Reihenfolge.',
        'Der Compiler verbietet `add` in einem Lambda auf ein Objekt von außerhalb.',
        '`forEach` wird bei parallelen Streams einfach übersprungen und tut nichts.'
      ],
      answer: 0,
      explain: 'Mehrere Prozessoren greifen **gleichzeitig** auf dieselbe Liste zu. Ohne Absicherung gehen Einträge verloren, tauchen doppelt auf oder es fliegt eine Exception, und die Reihenfolge ist nicht mehr fest. Außerdem wird der gemeinsame Zustand zum Flaschenhals. Richtig: `List<…> neu = liste.parallelStream().toList();`.' },

    { id: 'K07-S03-F21', sec: 'regeln', type: 'review', t: 'Review eines Stream-Codes',
      prompt: 'Welche Befunde zu diesem Code treffen zu?',
      code: `List<String> lang = new ArrayList<>();
namen.stream().filter(s -> s.length() > 4).forEach(s -> lang.add(s));
int anzahl = namen.stream().count();
String alle = namen.stream().reduce("", (a, b) -> a + b + ", ");`,
      findings: [
        { text: 'Zeile 2 sollte `toList()` statt `forEach` mit `add` verwenden.', correct: true,
          why: '`forEach` mit einer Liste außerhalb ist nicht stateless. `namen.stream().filter(…).toList()` ist kürzer und auch parallel sicher.' },
        { text: 'Zeile 3 kompiliert nicht, weil `count()` `long` liefert.', correct: true,
          why: 'Ohne Cast passt `long` nicht in `int`. Richtig: `long anzahl = …` oder einfach `namen.size()`.' },
        { text: 'Zeile 4 liefert ein Komma am Ende und ist ineffizient; besser `collect(Collectors.joining(", "))`.', correct: true,
          why: 'Jede Verkettung erzeugt einen neuen String. `joining` sammelt in einem Zwischenspeicher und setzt das Trennzeichen nur **zwischen** die Elemente.' },
        { text: 'Die Zeilen 2 bis 4 verbrauchen denselben Stream mehrfach und werfen eine IllegalStateException.', correct: false,
          why: 'Jede Zeile ruft `namen.stream()` neu auf, es sind also drei verschiedene Streams. Das ist erlaubt.' }
      ],
      explain: 'Typische Stream-Fehler: Zustand außerhalb, falscher Rückgabetyp bei `count`, `reduce` für Strings statt `joining`, und ein Stream, der zweimal benutzt wird.' },

    { id: 'K07-S03-F22', sec: 'collect', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 5, t: 'Schleifen durch Streams ersetzen',
      prompt: 'Ersetze beide Schleifen durch je einen Stream.\n(1) `int summe = 0; for (String s : namen) summe += s.length();`\n(2) Eine `Map<Integer, List<String>>`, die jede Länge auf die Namen dieser Länge abbildet.',
      model: '(1) Jeder Name wird zu seiner Länge (`map`), dann werden die Längen mit `reduce(0, (a, b) -> a + b)` addiert. Die Schleife macht eine Zuweisung `summe += …`, deshalb passt `reduce`. (2) Gruppieren nach einem Merkmal ist genau `Collectors.groupingBy` mit der Länge als Schlüssel. Für `[Ida, Jonas, Lea, Maximilian]`: (1) 21, (2) `{3=[Ida, Lea], 5=[Jonas], 10=[Maximilian]}`.',
      modelCode: `int summe = namen.stream()
        .map(s -> s.length())
        .reduce(0, (a, b) -> a + b);

Map<Integer, List<String>> nachLaenge = namen.stream()
        .collect(Collectors.groupingBy(s -> s.length()));`,
      explain: 'Vorgehen beim Umschreiben: Was passiert mit **einem** Element? (umwandeln → `map`, aussortieren → `filter`.) Wie entsteht das **Ergebnis**? (Zuweisung → `reduce`, Sammelbehälter → `collect`.)' }
  ]
});
