/* Kapitel 07 · Serie S01: Funktionale Interfaces – welcher Typ passt zum Lambda?
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Lambdas, Zuweisungen und Ausgaben wurden mit javac/java geprüft.
   Konvention wie in den Übungsaufgaben: Consumer/Runnable nur, wenn das Lambda nichts liefert. */
P3.serie({
  id: 'K07-S01',
  kapitel: 'K07',
  titel: 'Funktionale Interfaces: Welcher Typ passt?',
  beschreibung: 'Die wichtigsten funktionalen Interfaces im Kopf: Zu einem Lambda alle passenden Typen finden, Methoden und Signaturen zuordnen, Lambdas aufrufen, Compilerfehler erkennen, Methodenreferenzen.',
  neu: true,
  minutenProFrage: 1,
  themen: [
    { id: 'typ',   name: 'Welcher Typ passt?' },
    { id: 'grund', name: 'Grundlagen und Aufruf' }
  ],
  fragen: [

    {
          "id": "K07-S01-F01",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Ein Lambda",
          "prompt": "In einem Programm steht:\n`x = s -> s.toLowerCase();`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                5
          ],
          "explain": "Ein `String` rein, ein `String` raus: das ist `Function<String, String>` mit `apply`. **Nicht Consumer:** Das Lambda liefert ein Ergebnis, ein Consumer liefert nichts. Der Compiler würde das Ergebnis zwar wegwerfen, gemeint ist aber Function."
    },

    {
          "id": "K07-S01-F02",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Ohne Parameter, mit Wert",
          "prompt": "In einem Programm steht:\n`x = () -> \"Hallo Welt\";`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                0
          ],
          "explain": "Nichts rein, ein `String` raus: `Supplier<String>` mit `get()`. **Nicht Runnable:** `run()` liefert nichts, und `\"Hallo Welt\"` allein ist keine Anweisung, die man ohne Ergebnis ausführen könnte."
    },

    {
          "id": "K07-S01-F03",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Ohne Parameter, ohne Wert",
          "prompt": "In einem Programm steht:\n`x = () -> System.out.println(\"lambda!\");`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                6
          ],
          "explain": "Nichts rein, nichts raus: `Runnable` mit `run()`. **Nicht Supplier:** `println` liefert `void`, also gibt es nichts, was `get()` zurückgeben könnte."
    },

    {
          "id": "K07-S01-F04",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Zwei Strings verbinden",
          "prompt": "In einem Programm steht:\n`x = (s,t) -> s.concat(t);`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                3
          ],
          "explain": "Zwei `String` rein, ein `String` raus, alles derselbe Typ: `BinaryOperator<String>` mit `apply(a, b)`. **Nicht Comparator:** `compare` muss ein `int` liefern, `concat` liefert einen String."
    },

    {
          "id": "K07-S01-F05",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Ein String, ein boolean",
          "prompt": "In einem Programm steht:\n`x = (s) -> s.startsWith(\"A\");`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, Boolean>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                1,
                5
          ],
          "explain": "Ein `String` rein, `boolean` raus: das ist genau `Predicate<String>` mit `test`. Auch `Function<String, Boolean>` passt, das `boolean` wird automatisch zu `Boolean` geboxt. Nicht Consumer, denn das Lambda liefert einen Wert."
    },

    {
          "id": "K07-S01-F06",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Etwas ausgeben",
          "prompt": "In einem Programm steht:\n`x = (s) -> System.out.println(s);`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                4
          ],
          "explain": "Ein `String` rein, nichts raus: `Consumer<String>` mit `accept`. **Nicht Function:** `println` liefert `void`, `apply` muss aber einen `String` liefern."
    },

    {
          "id": "K07-S01-F07",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Enthält …?",
          "prompt": "In einem Programm steht:\n`x = (s) -> s.contains(\"X\");`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                1
          ],
          "explain": "`String` rein, `boolean` raus: `Predicate<String>`. **Nicht `Function<String, String>`:** Ein `boolean` ist kein `String`. Nicht Consumer, denn das Lambda liefert einen Wert."
    },

    {
          "id": "K07-S01-F08",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Zwei Zahlen vergleichen",
          "prompt": "In einem Programm steht:\n`x = (a, b) -> a > b;`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<Integer>`",
                "`Predicate<Integer>`",
                "keiner davon",
                "`BinaryOperator<Integer>`",
                "`Consumer<Integer>`",
                "`Function<Integer, Integer>`",
                "`Runnable`",
                "`Comparator<Integer>`"
          ],
          "answer": [
                2
          ],
          "explain": "Zwei Parameter, Ergebnis `boolean`. **Comparator** muss `int` liefern, **BinaryOperator** muss `Integer` liefern, beides passt nicht. Richtig wäre `BiPredicate<Integer, Integer>`, das steht aber nicht in der Liste, also **keiner davon**."
    },

    {
          "id": "K07-S01-F09",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Drei Parameter",
          "prompt": "In einem Programm steht:\n`x = (a, b, c) -> a + b + c;`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<Integer>`",
                "`Predicate<Integer>`",
                "keiner davon",
                "`BinaryOperator<Integer>`",
                "`Consumer<Integer>`",
                "`Function<Integer, Integer>`",
                "`Runnable`",
                "`Comparator<Integer>`"
          ],
          "answer": [
                2
          ],
          "explain": "**Drei** Parameter: Kein Interface aus der Liste (und keins aus `java.util.function`) hat eine Methode mit drei Parametern. Dafür müsste man ein eigenes funktionales Interface schreiben."
    },

    {
          "id": "K07-S01-F10",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Zwei Zahlen subtrahieren",
          "prompt": "In einem Programm steht:\n`x = (a, b) -> a - b;`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<Integer>`",
                "`Predicate<Integer>`",
                "keiner davon",
                "`BinaryOperator<Integer>`",
                "`Consumer<Integer>`",
                "`Function<Integer, Integer>`",
                "`Runnable`",
                "`Comparator<Integer>`"
          ],
          "answer": [
                3,
                7
          ],
          "explain": "Zwei `Integer` rein, `int` raus. Das passt zu `Comparator<Integer>`: `compare` liefert `int` (negativ, 0 oder positiv). Es passt auch zu `BinaryOperator<Integer>`: Das `int` wird zu `Integer` geboxt."
    },

    {
          "id": "K07-S01-F11",
          "sec": "typ",
          "type": "multi",
          "wichtig": true,
          "t": "Zwei Längen vergleichen",
          "prompt": "In einem Programm steht:\n`x = (s,t) -> s.length() - t.length();`\nWelchen Datentyp könnte `x` haben? (Mehrere Antworten möglich)",
          "options": [
                "`Supplier<String>`",
                "`Predicate<String>`",
                "keiner davon",
                "`BinaryOperator<String>`",
                "`Consumer<String>`",
                "`Function<String, String>`",
                "`Runnable`",
                "`Comparator<String>`"
          ],
          "answer": [
                7
          ],
          "explain": "Zwei `String` rein, `int` raus: `Comparator<String>`, er sortiert nach der Länge. **Nicht BinaryOperator<String>:** Der müsste einen `String` liefern, kein `int`."
    },

    { id: 'K07-S01-F12', sec: 'grund', type: 'match', wichtig: true, t: 'Interface und Methode',
      prompt: 'Ordne jedem Interface seine abstrakte Methode mit „rein → raus“ zu.',
      pairs: [
        ['`Runnable`', '`run()`: nichts → nichts'],
        ['`Supplier<T>`', '`get()`: nichts → T'],
        ['`Consumer<T>`', '`accept(t)`: T → nichts'],
        ['`Function<T, R>`', '`apply(t)`: T → R'],
        ['`Predicate<T>`', '`test(t)`: T → boolean'],
        ['`Comparator<T>`', '`compare(a, b)`: T, T → int']
      ],
      explain: 'Diese Tabelle solltest du auswendig können. Mit ihr löst du jede „Welcher Typ passt?“-Frage: Parameter zählen, Rückgabe ansehen, Zeile suchen.' },

    { id: 'K07-S01-F13', sec: 'grund', type: 'mc', wichtig: true, t: 'Was macht ein Interface funktional?',
      prompt: 'Wann ist ein Interface ein **funktionales Interface**, sodass man es mit einem Lambda implementieren kann?',
      options: [
        'Nur wenn es mit `@FunctionalInterface` markiert ist, sonst ist es nie funktional.',
        'Wenn es genau eine abstrakte Methode hat (default und static zählen nicht).',
        'Wenn alle seine Methoden `default`-Methoden mit fertigem Code sind.',
        'Wenn es im Paket `java.util.function` liegt und mindestens einen Typparameter hat.'
      ],
      answer: 1,
      explain: 'Entscheidend ist **genau eine abstrakte Methode**: Das Lambda wird zu ihrem Rumpf. `@FunctionalInterface` ist freiwillig, der Compiler prüft damit nur die Regel. Auch eigene Interfaces und z. B. `Comparator` aus `java.util` sind funktional.' },

    { id: 'K07-S01-F14', sec: 'grund', type: 'multi', t: 'Funktional oder nicht?',
      prompt: 'Welche dieser Interfaces sind funktional?',
      code: `interface A { void los(); }
interface B { int wert(); default int doppelt() { return 2 * wert(); } }
interface C { void start(); void stopp(); }
interface D { boolean gleich(String s); boolean equals(Object o); }
interface E { static E leer() { return null; } }`,
      options: ['`A`', '`B`', '`C`', '`D`', '`E`'],
      answer: [0, 1, 3],
      explain: '`A`: eine abstrakte Methode. `B`: eine abstrakte plus eine `default`-Methode, die nicht zählt. `C`: zwei abstrakte Methoden, ein Lambda wüsste nicht, welche es implementiert. `D`: `equals` gibt es schon in `Object`, es zählt nicht mit, also bleibt eine abstrakte Methode (wie bei `Comparator`). `E`: **keine** abstrakte Methode, also auch nicht funktional.' },

    { id: 'K07-S01-F15', sec: 'grund', type: 'fill', wichtig: true, t: 'Das Lambda aufrufen',
      prompt: 'Ein Lambda ruft man über die Methode seines Interfaces auf. Ergänze die Methodennamen.',
      code: `Supplier<String> gruss = () -> "Hallo";
Consumer<String> zeige = s -> System.out.println(s);
Predicate<String> leer = s -> s.isEmpty();
Function<String, Integer> laenge = s -> s.length();

zeige.[[0]](gruss.[[1]]());
boolean b = leer.[[2]]("");
int n = laenge.[[3]]("Java");`,
      blanks: [
        { options: ['apply', 'accept', 'run', 'test'], answer: 1, why: '`Consumer` hat `accept(t)`: Er nimmt etwas an und liefert nichts.' },
        { options: ['get', 'apply', 'supply', 'call'], answer: 0, why: '`Supplier` hat `get()`: Er liefert etwas, ohne Parameter.' },
        { options: ['apply', 'check', 'accept', 'test'], answer: 3, why: '`Predicate` hat `test(t)` und liefert `boolean`.' },
        { options: ['test', 'get', 'apply', 'compare'], answer: 2, why: '`Function` hat `apply(t)` und liefert das Ergebnis vom Typ R.' }
      ],
      explain: '`zeige(…)` oder `gruss()` direkt aufzurufen geht nicht: Die Variable ist ein Objekt, man muss seine Methode aufrufen.' },

    { id: 'K07-S01-F16', sec: 'grund', type: 'input', t: 'Was wird ausgegeben?',
      prompt: 'Was gibt das Programm aus?',
      code: `Function<String, Integer> f = s -> s.length();
Predicate<Integer> p = n -> n > 3;
System.out.println(f.apply("Java") + " " + p.test(f.apply("Hi")));`,
      answers: ['4 false'],
      explain: '`f.apply("Java")` liefert 4. `f.apply("Hi")` liefert 2, und `p.test(2)` prüft `2 > 3`, also `false`. Ausgabe: `4 false`.' },

    { id: 'K07-S01-F17', sec: 'grund', type: 'mc', wichtig: true, t: 'Das passende Standard-Interface',
      prompt: '`(a, b) -> a > b` passt weder zu `Comparator<Integer>` noch zu `BinaryOperator<Integer>`. Welches Interface aus `java.util.function` passt?',
      options: [
        '`Predicate<Integer>`, weil das Ergebnis ein `boolean` ist.',
        '`BiFunction<Integer, Integer, Integer>`, weil zwei Integer hineingehen.',
        '`BiPredicate<Integer, Integer>`: zwei Parameter, Ergebnis boolean.',
        '`UnaryOperator<Boolean>`, weil das Ergebnis immer ein Wahrheitswert ist.'
      ],
      answer: 2,
      explain: '`BiPredicate<T, U>` hat `test(t, u)` und liefert `boolean`, genau das Lambda. `Predicate` hat nur **einen** Parameter. `BiFunction<…, Integer>` müsste einen `Integer` liefern. Genauso gibt es `BiFunction` und `BiConsumer` für zwei Parameter.' },

    { id: 'K07-S01-F18', sec: 'grund', type: 'bug', wichtig: true, t: 'Welche Zeilen kompilieren nicht?',
      prompt: 'Markiere alle Zeilen, die einen Compilerfehler haben.',
      code: `Supplier<String> gruss = x -> "Hallo";
Function<Integer, Integer> doppelt = n -> n * 2;
Predicate<String> lang = s -> s.length();
Runnable start = () -> { return 5; };
Consumer<String> zeige = s -> System.out.println(s);`,
      required: [1, 3, 4],
      model: 'Zeile 1: `get()` hat **keinen** Parameter, das Lambda hat aber einen (`x`). Zeile 3: `test` muss `boolean` liefern, `length()` liefert `int`. Zeile 4: `run()` ist `void`, ein `return 5` ist nicht erlaubt. Zeilen 2 und 5 sind korrekt.',
      explain: 'Prüfe bei jedem Lambda zuerst die **Anzahl** der Parameter, dann den **Rückgabetyp**. Passt eines davon nicht zur Methode des Interfaces, gibt es einen Compilerfehler.' },

    { id: 'K07-S01-F19', sec: 'grund', type: 'match', t: 'Kurzform: Methodenreferenz',
      prompt: 'Ordne jeder Methodenreferenz das gleichwertige Lambda zu.',
      pairs: [
        ['`String::toLowerCase`', '`s -> s.toLowerCase()`'],
        ['`System.out::println`', '`s -> System.out.println(s)`'],
        ['`String::length`', '`s -> s.length()`'],
        ['`Integer::compare`', '`(a, b) -> Integer.compare(a, b)`']
      ],
      explain: 'Ruft ein Lambda nur **eine** Methode mit seinen Parametern auf, kann man es als Methodenreferenz `Klasse::methode` bzw. `objekt::methode` schreiben. Bei Streams sieht man das ständig, z. B. `forEach(System.out::println)`.' }
  ]
});
