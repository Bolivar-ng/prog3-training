/* Probetest T01: Moodle-Generalprobe (Theorie), 30 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Aussagen über Ausgaben und Compilerfehler wurden mit javac/java (Java 25) geprüft. */
P3.serie({
  id: 'K90-T01',
  kapitel: 'K90',
  titel: 'Moodle-Generalprobe: Theorie',
  beschreibung: 'Simulation des Moodle-Tests: nur automatisch bewertete Fragen zu Kapitel 0 bis 2 (Qualitätsregeln, equals/hashCode, Exceptions, Maven, Interfaces, Lambda). Genau so wenig Zeit wie im echten Test.',
  neu: true,
  dauer: 30,
  themen: [
    { id: 'regeln',  name: 'Qualitätsregeln & Grundlagen' },
    { id: 'exc',     name: 'Exceptions' },
    { id: 'maven',   name: 'Maven' },
    { id: 'iface',   name: 'Interfaces' },
    { id: 'lambda',  name: 'Lambda & innere Klassen' }
  ],
  fragen: [

    { id: 'K90-T01-F01', sec: 'regeln', type: 'multi', t: 'Regelverstöße erkennen',
      prompt: 'Welche Zeilen verstoßen gegen die Code-Regeln von Frau Hubrich? (mehrere)',
      options: [
        '`public double kontostand;` in der Klasse `Konto`',
        '`private static final int MAX_BETRAG = 2000;` in der Klasse `Sparbuch`',
        '`System.out.println("Abgehoben!");` in `Konto.abheben`',
        '`public long getnummer() { return nummer; }`',
        '`catch (GesperrtException e) { e.printStackTrace(); }`'
      ],
      answer: [0, 2, 3, 4],
      explain: 'Attribute sind immer `private` (nur statische Konstanten dürfen öffentlich sein). Verarbeitung und Ausgabe werden getrennt: Kein `println` in einer Fachklasse. Getter heißen `getNummer` mit großem N. Nur `printStackTrace` im catch ist „Exception-Unsinn“. Die Konstante ist korrekt benannt und deklariert.' },

    { id: 'K90-T01-F02', sec: 'regeln', type: 'mc', t: 'equals und hashCode',
      prompt: 'Welche Aussage über den Vertrag von `equals` und `hashCode` ist **richtig**?',
      options: [
        'Haben zwei Objekte denselben Hashcode, sind sie laut `equals` gleich.',
        'Verschiedene Objekte müssen immer verschiedene Hashcodes haben.',
        'Wer `hashCode` überschreibt, muss `compareTo` ebenfalls überschreiben.',
        'Sind zwei Objekte laut `equals` gleich, haben sie denselben Hashcode.'
      ],
      answer: 3,
      explain: 'Die Richtung ist nur: gleich ⇒ gleicher Hashcode. Umgekehrt nicht: Verschiedene Objekte dürfen denselben Hashcode haben (Kollision), das macht eine HashMap nur langsamer, nicht falsch. Mit `compareTo` hat der Vertrag nichts zu tun.' },

    { id: 'K90-T01-F03', sec: 'regeln', type: 'mc', t: 'TreeSet vs. HashSet',
      prompt: '`Kunde`: `equals`/`hashCode` vergleichen Nachname **und** Geburtsjahr, `compareTo` nur den Nachnamen. Man fügt `Müller, 1990` und `Müller, 2001` in ein `TreeSet` und in ein `HashSet` ein. Welche Größen haben die Mengen?',
      options: [
        'TreeSet 2, HashSet 2',
        'TreeSet 2, HashSet 1',
        'TreeSet 1, HashSet 1',
        'TreeSet 1, HashSet 2'
      ],
      answer: 3,
      explain: 'Das `TreeSet` benutzt nur `compareTo`: Beide heißen Müller, also 0, also „gleich“, und das zweite Objekt wird nicht eingefügt. Das `HashSet` benutzt `equals`/`hashCode`: verschieden, also beide drin. Genau deshalb muss `compareTo` konsistent mit `equals` sein.' },

    { id: 'K90-T01-F04', sec: 'regeln', type: 'mc', t: 'final und Referenzen',
      prompt: 'Welche Zeile führt zu einem **Compilerfehler**?',
      code: `final Konto k = new Konto();
k.einzahlen(100);          // Zeile A
k = new Konto();           // Zeile B
Konto j = k;               // Zeile C
j.einzahlen(50);           // Zeile D`,
      options: ['Zeile A', 'Zeile B', 'Zeile C', 'Zeile D'],
      answer: 1,
      explain: '`final` heißt: Die **Referenz** `k` darf nicht neu zugewiesen werden. Das Objekt selbst darf sich aber verändern, `einzahlen` ist also erlaubt. `j` ist eine zweite, nicht-finale Referenz auf dasselbe Objekt.' },

    { id: 'K90-T01-F05', sec: 'exc', type: 'mc', t: 'checked Exception',
      prompt: '`GesperrtException extends Exception`. Eine Methode `sperre()` wirft sie mit `throw new GesperrtException();`, hat aber kein `throws` und kein try/catch. Was passiert?',
      options: [
        'Es kompiliert nicht: Die Exception muss gefangen oder deklariert werden.',
        'Es kompiliert, die Exception fliegt erst zur Laufzeit.',
        'Es kompiliert, Java ergänzt `throws` automatisch.',
        'Es kompiliert nicht, weil man eigene Exceptions nicht mit `new` erzeugt.'
      ],
      answer: 0,
      explain: 'Unterklassen von `Exception`, die nicht von `RuntimeException` erben, sind **checked**: Der Compiler verlangt `throws GesperrtException` in der Signatur oder ein try/catch („unreported exception … must be caught or declared to be thrown“). Bei `UngueltigeKontonummerException` (unchecked) wäre das nicht nötig.' },

    { id: 'K90-T01-F06', sec: 'exc', type: 'match', t: 'Welche Exception passt?',
      prompt: 'Ordne jeder Situation die passende Exception zu.',
      pairs: [
        ['`abheben` bekommt einen negativen Betrag', 'IllegalArgumentException'],
        ['`pop()` auf einem leeren Stapel', 'IllegalStateException'],
        ['Konstruktor von `Kunde` bekommt `null` als Name', 'NullPointerException'],
        ['`(Girokonto) k`, aber `k` ist ein Sparbuch', 'ClassCastException'],
        ['`int`-Division durch 0', 'ArithmeticException']
      ],
      explain: 'Falsches Argument → IllegalArgumentException. Das Argument ist in Ordnung, aber das **Objekt** ist im falschen Zustand → IllegalStateException. Für `null` nimmt die Java-Bibliothek (und das Bankprojekt) NullPointerException. ClassCastException und ArithmeticException kommen von der JVM selbst.' },

    { id: 'K90-T01-F07', sec: 'maven', type: 'mc', t: 'mvn package',
      prompt: 'Welche Phasen laufen bei `mvn package` unter anderem? (Auswahl, in Reihenfolge)',
      options: [
        '`compile` → `package` (Tests nur mit `mvn test`)',
        '`compile` → `test` → `package` → `install`',
        '`clean` → `compile` → `test` → `package`',
        '`compile` → `test-compile` → `test` → `package`'
      ],
      answer: 3,
      explain: 'Eine Phase führt immer alle Phasen **davor** im Lebenszyklus aus, also auch die Tests. `install` kommt erst nach `package`. `clean` gehört zu einem eigenen Lebenszyklus und läuft nur, wenn man es angibt (`mvn clean package`).' },

    { id: 'K90-T01-F08', sec: 'maven', type: 'mc', t: 'Scope test',
      prompt: 'JUnit steht mit `<scope>test</scope>` in der pom. Eine Klasse unter `src/main/java` importiert `org.junit.jupiter.api.Assertions`. Was passiert bei `mvn compile`?',
      options: [
        'Fehler „package org.junit.jupiter.api does not exist“',
        'Es kompiliert, nur die Tests werden beim Build übersprungen',
        'Maven lädt JUnit automatisch mit Scope compile nach',
        'Es kompiliert, aber das jar enthält JUnit'
      ],
      answer: 0,
      explain: 'Scope `test` heißt: Die Bibliothek ist **nur** beim Kompilieren und Ausführen der Tests (`src/test/java`) auf dem Classpath. Der Hauptcode sieht sie nicht.' },

    { id: 'K90-T01-F09', sec: 'maven', type: 'match', t: 'Maven-Begriffe',
      prompt: 'Ordne jedem Begriff seine Bedeutung zu.',
      pairs: [
        ['GAV', 'groupId, artifactId und version identifizieren ein Projekt eindeutig'],
        ['-SNAPSHOT', 'Version ist noch in Entwicklung und kann sich ändern'],
        ['Super-POM', 'Standardeinstellungen, von denen jede pom erbt'],
        ['Goal', 'eine einzelne Aufgabe eines Plugins, z. B. javadoc:javadoc'],
        ['Phase', 'ein Schritt im Lebenszyklus, an den Goals gebunden werden']
      ],
      explain: 'Phasen (compile, test, package …) sind der Ablauf, Goals sind die Arbeit der Plugins. Ein Goal wird an eine Phase gebunden, z. B. JaCoCo `report` an `test`.' },

    { id: 'K90-T01-F10', sec: 'iface', type: 'mc', t: 'Abstrakte Klasse vs. Interface',
      prompt: 'Was kann eine abstrakte Klasse, ein Interface aber **nicht**?',
      options: [
        'Methoden mit Rumpf enthalten',
        'Als Datentyp einer Variablen dienen',
        'Statische Methoden enthalten',
        'Instanzattribute besitzen'
      ],
      answer: 3,
      explain: 'Variablen in einem Interface sind automatisch `public static final`, also Konstanten. Methoden mit Rumpf hat ein Interface über `default`- und `static`-Methoden. Beide können Datentyp sein, aber von keinem kann man ein Objekt mit `new` erzeugen.' },

    { id: 'K90-T01-F11', sec: 'iface', type: 'mc', t: 'Statische Interface-Methode',
      prompt: '`Vergleicher` hat die statische Methode `static String hilfe()`. `KontoVergleicher implements Vergleicher`. Welcher Aufruf kompiliert?',
      options: [
        '`Vergleicher.hilfe()`',
        '`KontoVergleicher.hilfe()`',
        '`new KontoVergleicher().hilfe()`',
        'alle drei'
      ],
      answer: 0,
      explain: 'Statische Methoden eines Interfaces werden **nicht** vererbt und nur über den Interfacenamen aufgerufen. Über ein Objekt meldet javac „illegal static interface method call“, über die Klasse „cannot find symbol“. Bei Klassen wäre beides erlaubt, bei Interfaces nicht.' },

    { id: 'K90-T01-F12', sec: 'iface', type: 'mc', t: 'Zwei gleiche default-Methoden',
      prompt: '`Namenskonflikte implements KannWasTolles, KannWasAnderes`. Beide Interfaces haben `default void machWasTolles()`. Wie ruft `Namenskonflikte` in ihrer überschriebenen Methode die Version von `KannWasTolles` auf?',
      options: [
        '`super.machWasTolles();`',
        '`KannWasTolles.this.machWasTolles();`',
        '`KannWasTolles.super.machWasTolles();`',
        '`((KannWasTolles) this).machWasTolles();`'
      ],
      answer: 2,
      explain: 'Die Klasse **muss** die Methode überschreiben, sonst kompiliert sie nicht. Eine bestimmte default-Version erreicht man mit `Interfacename.super.methode()`. `super` allein meint die Oberklasse (`Object`). Der Cast ruft wegen der dynamischen Bindung wieder die eigene Methode auf, also eine Endlosrekursion.' },

    { id: 'K90-T01-F13', sec: 'iface', type: 'mc', t: 'compareTo für Kontonummern',
      prompt: 'Konten sollen nach `long nummer` **absteigend** sortiert werden. Welcher Rumpf von `compareTo(Konto k)` ist richtig?',
      options: [
        '`return Long.compare(this.nummer, k.nummer);`',
        '`return Long.compare(k.nummer, this.nummer);`',
        '`return (int) (k.nummer - this.nummer);`',
        '`return this.nummer > k.nummer ? 1 : -1;`'
      ],
      answer: 1,
      explain: 'Vertauschte Argumente drehen die Reihenfolge um, also absteigend. Die Subtraktion kann bei `long` überlaufen, der `int`-Cast schneidet ab. Die letzte Variante liefert nie 0 und sortiert außerdem aufsteigend.' },

    { id: 'K90-T01-F14', sec: 'lambda', type: 'multi', t: 'Funktionale Interfaces',
      prompt: 'Welche dieser Typen sind **funktionale Interfaces**, sodass man ihnen einen Lambda-Ausdruck zuweisen kann? (mehrere)',
      options: [
        '`Comparable<T>`',
        '`Runnable`',
        '`List<T>`',
        '`Comparator<T>`',
        'eine abstrakte Klasse mit genau einer abstrakten Methode'
      ],
      answer: [0, 1, 3],
      explain: '`Comparable` (`compareTo`) und `Runnable` (`run`) haben genau eine abstrakte Methode. `Comparator` deklariert zusätzlich `boolean equals(Object)`, aber Methoden von `Object` zählen nicht mit, er bleibt funktional. `List` hat viele abstrakte Methoden. Eine abstrakte **Klasse** ist nie ein funktionales Interface.' },

    { id: 'K90-T01-F15', sec: 'lambda', type: 'multi', t: 'Gültige Lambdas',
      prompt: 'Gegeben `BiFunction<Integer, Integer, Integer> f = …;`. Welche rechten Seiten **kompilieren**? (mehrere)',
      options: [
        '`(a, b) -> a + b`',
        '`(Integer a, Integer b) -> a + b`',
        '`(Integer a, b) -> { return a + b; }`',
        '`a, b -> a + b`',
        '`(a, b) -> { return a + b; }`'
      ],
      answer: [0, 1, 4],
      explain: 'Typen gibt man für **alle oder keinen** Parameter an. Bei mehr als einem Parameter sind die runden Klammern Pflicht. Mit geschweiften Klammern braucht man `return`.' },

    { id: 'K90-T01-F16', sec: 'lambda', type: 'mc', t: 'Effektiv final',
      prompt: 'Warum kompiliert dieser Code nicht?',
      code: `int grenze = 10;
Predicate<Integer> p = z -> z > grenze;
grenze = 20;`,
      options: [
        '`grenze` wird später geändert, ist also nicht effektiv final',
        '`Predicate` braucht einen `int`, kein `Integer`',
        'Ein Lambda darf überhaupt keine lokalen Variablen der Methode verwenden',
        'Die Zuweisung muss vor dem Lambda stehen'
      ],
      answer: 0,
      explain: 'Lambdas (und anonyme Klassen) dürfen lokale Variablen nur benutzen, wenn sie effektiv final sind, also nur einmal zugewiesen werden. Die Änderung **nach** dem Lambda reicht schon. Lösung wie in der Übung: eine zweite Variable, die nie geändert wird.' },

    { id: 'K90-T01-F17', sec: 'lambda', type: 'mc', t: 'Innere Klassen erzeugen',
      prompt: '`Ausfuehrung` enthält die **nicht-statische** innere Klasse `TutWas`. Wie erzeugt man in einer anderen Klasse ein `TutWas`-Objekt?',
      options: [
        '`new Ausfuehrung.TutWas()`',
        '`Ausfuehrung.new TutWas()`',
        '`new Ausfuehrung.TutWas(new Ausfuehrung())`',
        '`new Ausfuehrung().new TutWas()`'
      ],
      answer: 3,
      explain: 'Eine nicht-statische innere Klasse gehört zu einem Objekt der äußeren Klasse, also erzeugt man über ein solches Objekt: `aussen.new TutWas()`, hier mit einem frisch erzeugten. `new Ausfuehrung.TutWas()` ist die Schreibweise für eine **statische** innere Klasse.' },

    { id: 'K90-T01-F18', sec: 'lambda', type: 'match', t: 'Standard-Interfaces einsetzen',
      prompt: 'Welches Standard-Interface passt zu welcher Aufgabe im Bankprojekt?',
      pairs: [
        ['prüfen, ob ein Konto gesperrt ist', 'Predicate<Konto>'],
        ['jedes Konto auf der Konsole ausgeben', 'Consumer<Konto>'],
        ['aus einem Konto die formatierte Kontonummer machen', 'Function<Konto, String>'],
        ['zwei Konten nach Kontostand vergleichen', 'Comparator<Konto>'],
        ['ein neues Testkonto liefern', 'Supplier<Konto>']
      ],
      explain: 'Predicate: `boolean test(T)`. Consumer: `void accept(T)`. Function: `R apply(T)`. Comparator: `int compare(T, T)`. Supplier: `T get()`, ohne Parameter.' }
  ]
});
