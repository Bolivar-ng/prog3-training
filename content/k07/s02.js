/* Kapitel 07 · Serie S02: Streams – Operationen und Ketten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben wurden mit javac/java ausgeführt und geprüft. */
P3.serie({
  id: 'K07-S02',
  kapitel: 'K07',
  titel: 'Streams: Operationen und Ketten',
  beschreibung: 'intermediate oder terminal, welches Interface jede Stream-Methode erwartet, filter/takeWhile/dropWhile, map und flatMap, sorted, limit/skip, Match-Methoden, Optional, count als long, Schleifen in Streams umschreiben.',
  neu: true,
  minutenProFrage: 1.5,
  themen: [
    { id: 'art',  name: 'intermediate oder terminal' },
    { id: 'ops',  name: 'Die Operationen' },
    { id: 'code', name: 'Ketten schreiben' }
  ],
  fragen: [

    { id: 'K07-S02-F01', sec: 'art', type: 'multi', wichtig: true, t: 'Welche sind intermediate?',
      prompt: 'Welche dieser Stream-Methoden sind **intermediate** Operations?',
      options: ['`filter`', '`count`', '`sorted`', '`forEach`', '`map`', '`toList`', '`distinct`', '`anyMatch`', '`limit`'],
      answer: [0, 2, 4, 6, 8],
      explain: 'Intermediate Operations liefern wieder einen **Stream**: `filter`, `sorted`, `map`, `distinct`, `limit` (auch `skip`, `takeWhile`, `dropWhile`, `flatMap`). `count` liefert `long`, `forEach` `void`, `toList` eine Liste, `anyMatch` `boolean`: alles terminal.' },

    { id: 'K07-S02-F02', sec: 'art', type: 'mc', wichtig: true, t: 'Woran erkennt man terminal?',
      prompt: 'Du kennst eine Stream-Methode nicht. Woran erkennst du sicher, ob sie terminal ist?',
      options: [
        'Ihr Rückgabetyp ist kein `Stream`, sondern z. B. `long`, `List` oder `void`.',
        'Sie erwartet ein Lambda als Parameter, intermediate Methoden erwarten dagegen keins.',
        'Ihr Name ist ein Verb, die Namen von intermediate Methoden sind dagegen Substantive.',
        'Sie steht in der Kette immer an zweiter Stelle, direkt nach dem Aufruf von `stream()`.'
      ],
      answer: 0,
      explain: 'Die Definition hängt am **Rückgabetyp**: liefert die Methode einen `Stream`, ist sie intermediate und man kann weiterketten. Liefert sie etwas anderes, ist sie terminal und beendet die Kette. Lambdas erwarten beide Arten (`filter` und `forEach`).' },

    { id: 'K07-S02-F03', sec: 'art', type: 'match', wichtig: true, t: 'Welches Interface erwartet die Methode?',
      prompt: 'Ordne jeder Stream-Methode das funktionale Interface zu, das sie als Parameter erwartet.',
      pairs: [
        ['`filter`', '`Predicate`'],
        ['`map`', '`Function`'],
        ['`forEach`', '`Consumer`'],
        ['`sorted(…)`', '`Comparator`'],
        ['`reduce(start, …)`', '`BinaryOperator`'],
        ['`Stream.generate`', '`Supplier`']
      ],
      explain: '`filter` fragt „behalten?“, also boolean → Predicate. `map` wandelt um → Function. `forEach` tut etwas ohne Ergebnis → Consumer. `sorted` vergleicht zwei → Comparator. `reduce` fasst zwei gleiche zu einem zusammen → BinaryOperator. `generate` liefert ohne Eingabe → Supplier.' },

    { id: 'K07-S02-F04', sec: 'art', type: 'mc', t: 'Was passiert hier?',
      prompt: '`liste.stream().filter(s -> s.length() > 3).map(s -> s.trim());`\nEs folgt keine weitere Zeile. Was bewirkt diese Anweisung?',
      options: [
        'Sie filtert und kürzt alle Elemente der Liste direkt in der Liste selbst.',
        'Sie erzeugt eine neue gefilterte Liste, die aber nirgends gespeichert wird.',
        'Sie wirft eine IllegalStateException, weil die terminal Operation am Ende fehlt.',
        'Nichts: Ohne terminal Operation läuft keines der beiden Lambdas.'
      ],
      answer: 3,
      explain: 'Streams sind **lazy**: Intermediate Operations werden nur vorgemerkt. Erst eine terminal Operation (`toList`, `forEach`, `count` …) startet die Verarbeitung. Ein Stream verändert außerdem nie die Quelle, die Liste bleibt so oder so unverändert.' },

    { id: 'K07-S02-F05', sec: 'ops', type: 'input', wichtig: true, t: 'Eine Kette Schritt für Schritt',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(
    List.of("Kiwi", "apfel", "Birne", "Apfel", "kiwi", "Mango").stream()
        .map(s -> s.toLowerCase())
        .distinct()
        .sorted()
        .toList());`,
      answers: ['[apfel, birne, kiwi, mango]'],
      explain: 'Nach `map`: kiwi, apfel, birne, apfel, kiwi, mango. `distinct` entfernt die zweiten „apfel“ und „kiwi“ (Vergleich mit `equals`). `sorted` sortiert alphabetisch. Ohne das `map` vorher wären „Apfel“ und „apfel“ verschieden geblieben.' },

    { id: 'K07-S02-F06', sec: 'ops', type: 'input', wichtig: true, t: 'takeWhile',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of(5, 8, 12, 3, 20, 7).takeWhile(n -> n > 4).toList());`,
      answers: ['[5, 8, 12]'],
      explain: '`takeWhile` nimmt Elemente vom **Anfang**, solange die Bedingung gilt, und hört beim ersten Fehlschlag (3) endgültig auf. 20 und 7 sind zwar größer als 4, kommen aber nach der 3.' },

    { id: 'K07-S02-F07', sec: 'ops', type: 'input', wichtig: true, t: 'dropWhile',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of(5, 8, 12, 3, 20, 7).dropWhile(n -> n > 4).toList());`,
      answers: ['[3, 20, 7]'],
      explain: '`dropWhile` ist das Gegenstück: Es **wirft** den Anfang weg, solange die Bedingung gilt. Ab dem ersten Fehlschlag (3) bleibt **alles** erhalten, auch 20 und 7, obwohl sie die Bedingung erfüllen.' },

    { id: 'K07-S02-F08', sec: 'ops', type: 'input', t: 'Zum Vergleich: filter',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of(5, 8, 12, 3, 20, 7).filter(n -> n > 4).toList());`,
      answers: ['[5, 8, 12, 20, 7]'],
      explain: '`filter` prüft **jedes** Element einzeln und hört nie vorzeitig auf. Nur die 3 fällt heraus. Merke: filter = alle prüfen, takeWhile = bis zum ersten Fehlschlag.' },

    { id: 'K07-S02-F09', sec: 'ops', type: 'input', t: 'skip und limit',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of("a", "b", "c", "d", "e", "f").skip(2).limit(3).toList());`,
      answers: ['[c, d, e]'],
      explain: '`skip(2)` lässt a und b weg, `limit(3)` nimmt danach die nächsten drei: c, d, e. Die Reihenfolge der beiden Aufrufe zählt: `limit(3).skip(2)` ergäbe nur `[c]`.' },

    { id: 'K07-S02-F10', sec: 'ops', type: 'mc', wichtig: true, t: 'map ändert den Typ',
      prompt: '`woerter` ist eine `List<String>`. Welchen Typ hat `woerter.stream().map(s -> s.length())`?',
      options: ['`Stream<String>`', '`Stream<Integer>`', '`ArrayList<Integer>`', '`Stream<Object>`'],
      answer: 1,
      explain: '`map` ist intermediate, liefert also einen Stream. Der Elementtyp ist der Rückgabetyp der Function: `length()` liefert `int`, im Stream wird daraus `Integer`. Eine Liste entsteht erst mit `toList()`.' },

    { id: 'K07-S02-F11', sec: 'ops', type: 'input', t: 'flatMap',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(
    List.of("a b", "c d e").stream()
        .flatMap(s -> Stream.of(s.split(" ")))
        .count());`,
      answers: ['5'],
      explain: 'Jeder String wird in einen Stream seiner Wörter zerlegt (2 bzw. 3 Wörter). `flatMap` klopft diese Streams zu **einem** Stream flach: a, b, c, d, e. Mit `map` statt `flatMap` hätte man einen Stream aus 2 Streams und `count()` wäre 2.' },

    { id: 'K07-S02-F12', sec: 'ops', type: 'input', t: 'sorted mit Comparator',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(
    Stream.of("Ei", "Brot", "Mehl", "Zucker")
        .sorted((a, b) -> b.length() - a.length())
        .toList());`,
      answers: ['[Zucker, Brot, Mehl, Ei]'],
      explain: '`b.length() - a.length()` sortiert **absteigend** nach Länge (b und a vertauscht). Brot und Mehl sind gleich lang; `sorted` ist stabil, gleich große Elemente behalten ihre ursprüngliche Reihenfolge.' },

    { id: 'K07-S02-F13', sec: 'ops', type: 'input', wichtig: true, t: 'anyMatch, allMatch, noneMatch',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(Stream.of(3, 6, 9).anyMatch(n -> n > 9) + " "
        + Stream.of(3, 6, 9).allMatch(n -> n % 3 == 0) + " "
        + Stream.of(3, 6, 9).noneMatch(n -> n == 6));`,
      answers: ['false true false'],
      explain: '`anyMatch`: gibt es eines größer als 9? Nein (9 ist nicht größer). `allMatch`: sind alle durch 3 teilbar? Ja. `noneMatch`: ist keines gleich 6? Falsch, die 6 ist dabei. Für jeden Wert braucht man einen neuen Stream, weil ein Stream nach der terminal Operation verbraucht ist.' },

    { id: 'K07-S02-F14', sec: 'ops', type: 'mc', wichtig: true, t: 'Was liefert findFirst ohne Treffer?',
      prompt: 'Was liefert `Stream.of("x", "y").filter(s -> s.equals("z")).findFirst()`?',
      options: [
        '`null`, weil kein Element gefunden wurde.',
        'Eine NoSuchElementException direkt beim Aufruf von `findFirst`.',
        'Den leeren String `""` als Ersatz für das fehlende Element.',
        'Ein leeres `Optional`, ausgegeben als `Optional.empty`.'
      ],
      answer: 3,
      explain: '`findFirst` liefert immer ein `Optional`, also eine Schachtel, die leer sein kann. Sie ist nie `null`. Erst wer auf die leere Schachtel `.get()` aufruft, bekommt eine NoSuchElementException. Sicher geht es mit `.orElse(ersatz)`.' },

    { id: 'K07-S02-F15', sec: 'ops', type: 'input', t: 'orElse',
      prompt: 'Was wird ausgegeben?',
      code: `String a = Stream.of("Ali", "Bea", "Carla").filter(s -> s.length() > 3).findFirst().orElse("-");
String b = Stream.of("Ali", "Bea", "Carla").filter(s -> s.length() > 5).findFirst().orElse("-");
System.out.println(a + " " + b);`,
      answers: ['Carla -'],
      explain: 'Nur „Carla“ hat mehr als 3 Buchstaben, also ist `a` = Carla. Kein Name hat mehr als 5 Buchstaben, das Optional ist leer, und `orElse` liefert den Ersatzwert „-“.' },

    { id: 'K07-S02-F16', sec: 'ops', type: 'input', t: 'max mit Comparator',
      prompt: 'Was wird ausgegeben?',
      code: `System.out.println(
    Stream.of("Bus", "Fahrrad", "Auto").max((a, b) -> a.length() - b.length()).get());`,
      answers: ['Fahrrad'],
      explain: '`max` erwartet einen Comparator und liefert das größte Element als `Optional`. Verglichen wird hier nach Länge, also Fahrrad (7). Ohne Comparator gibt es `max` nicht, Stream kennt keine „natürliche“ Größe.' },

    { id: 'K07-S02-F17', sec: 'ops', type: 'mc', wichtig: true, t: 'Was liefert count?',
      prompt: '`int n = liste.stream().count();` Was passiert?',
      options: [
        'Compilerfehler: `count()` liefert `long`, das passt ohne Cast nicht in `int`.',
        'Es kompiliert, und `n` enthält danach ganz normal die Anzahl der Elemente.',
        'Es kompiliert, aber `n` ist immer 0, weil der Stream lazy ist und nichts zählt.',
        'Laufzeitfehler, aber nur wenn die Liste mehr als 2³¹ Elemente enthält.'
      ],
      answer: 0,
      explain: '`count()` hat den Rückgabetyp **long**. Von `long` nach `int` wandelt Java nicht automatisch um, weil Werte verloren gehen könnten. Richtig: `long n = …count();` oder bewusst `(int) …count()`. Die Klausur fragt gern nach diesem Rückgabetyp.' },

    { id: 'K07-S02-F18', sec: 'ops', type: 'mc', t: 'Unendliche Streams',
      prompt: 'Was passiert bei `List<String> l = Stream.generate(() -> "x").toList();`?',
      options: [
        'Die Liste enthält genau ein `"x"`, weil der Supplier nur einmal aufgerufen wird.',
        'Die Liste ist leer, weil `generate` ohne `limit` nichts erzeugt.',
        'Das Programm läuft endlos weiter, bis der Speicher voll ist (OutOfMemoryError).',
        'Compilerfehler, weil `generate` nur zusammen mit `limit` aufgerufen werden darf.'
      ],
      answer: 2,
      explain: '`generate` (und `iterate` ohne Abbruchbedingung) erzeugt einen **unendlichen** Stream. `toList` will alle Elemente sammeln und hört nie auf. Richtig ist z. B. `Stream.generate(() -> "x").limit(3).toList()` → `[x, x, x]`. Der Compiler merkt davon nichts.' },

    { id: 'K07-S02-F19', sec: 'ops', type: 'mc', t: 'distinct und equals',
      prompt: '`Punkt` ist eine Klasse **ohne** eigenes `equals`. Was liefert `Stream.of(new Punkt(1, 2), new Punkt(1, 2)).distinct().count()`?',
      options: [
        '`1`, weil beide Punkte dieselben Koordinaten haben und deshalb gleich sind.',
        '`0`, weil `distinct` alle Elemente entfernt, die mehr als einmal vorkommen.',
        'Eine Exception, weil `distinct` nur für Strings und Zahlen funktioniert.',
        '`2`: `distinct` nutzt `equals`, ohne eigenes `equals` zählt nur Identität.'
      ],
      answer: 3,
      explain: '`distinct` benutzt `equals` (und `hashCode`). Ohne eigene Implementierung gilt das geerbte `equals` aus `Object`: zwei verschiedene Objekte sind nie gleich. Wäre `Punkt` ein **Record**, käme 1 heraus, weil Records `equals` automatisch haben.' },

    { id: 'K07-S02-F20', sec: 'code', type: 'fill', wichtig: true, t: 'Schleife als Stream',
      prompt: 'Die Schleife sammelt alle Preise über 10, erhöht um 19 %, in einer neuen Liste. Ergänze den gleichwertigen Stream.',
      code: `// for (double p : preise)
//     if (p > 10)
//         erg.add(p * 1.19);

List<Double> erg = preise.[[0]]()
        .[[1]](p -> p > 10)
        .[[2]](p -> p * 1.19)
        .[[3]]();`,
      blanks: [
        { options: ['iterator', 'stream', 'forEach', 'of'], answer: 1,
          why: '`stream()` aus dem Interface Collection macht aus der Liste einen Stream.' },
        { options: ['map', 'takeWhile', 'filter', 'anyMatch'], answer: 2,
          why: 'Das `if` wird zu `filter` mit einem Predicate. `takeWhile` würde beim ersten Preis ≤ 10 aufhören.' },
        { options: ['map', 'forEach', 'reduce', 'sorted'], answer: 0,
          why: 'Jeder Preis wird **umgewandelt** → `map` mit einer Function.' },
        { options: ['collect', 'count', 'toList', 'get'], answer: 2,
          why: '`toList()` sammelt das Ergebnis in einer Liste (terminal). `count` würde nur zählen.' }
      ],
      explain: 'Faustregel zum Umschreiben: `if` → `filter`, Umrechnen → `map`, „in Liste sammeln“ → `toList()`, „zählen“ → `count()`, „ausgeben“ → `forEach`.' },

    { id: 'K07-S02-F21', sec: 'code', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 4, t: 'Zwei Streams schreiben',
      prompt: '`List<String> namen` ist gegeben. Schreibe je eine Anweisung mit einem Stream:\n(1) Wie viele Namen haben mehr als 4 Buchstaben?\n(2) Eine Liste der ersten 3 Namen in Großbuchstaben.',
      model: '(1) `filter` mit Predicate, dann `count()`. Das Ergebnis ist `long`. (2) `limit(3)`, dann `map` mit `toUpperCase`, dann `toList()`. Die Reihenfolge `limit` vor `map` spart Arbeit; umgekehrt ist es auch richtig. Für `namen = [Ida, Jonas, Lea, Maximilian]` ergibt (1) `2` und (2) `[IDA, JONAS, LEA]`.',
      modelCode: `long lang = namen.stream()
        .filter(s -> s.length() > 4)
        .count();

List<String> ersteDrei = namen.stream()
        .limit(3)
        .map(s -> s.toUpperCase())
        .toList();`,
      explain: 'Für jede Frage einen **neuen** Stream mit `namen.stream()` erzeugen. Einen Stream nach `count()` noch einmal zu benutzen, würde eine IllegalStateException werfen.' }
  ]
});
