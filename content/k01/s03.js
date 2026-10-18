/* Kapitel 01 · Serie S03: Übung 1 – JaCoCo, Tests & Assembly
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben. */
P3.serie({
  id: 'K01-S03',
  kapitel: 'K01',
  titel: 'Übung 1: JaCoCo, TestStub & Assembly',
  beschreibung: 'Klausurübung zur Prog3-Abgabe: JaCoCo-Konfiguration, TestKalender als Test Stub, Surefire argLine, taglist-Plugin, Assembly-Descriptor und Maven clean. Gemischte Aufgabentypen: MC, Code-Review, Code schreiben.',
  neu: true,
  themen: [
    { id: 'jacoco',    name: 'JaCoCo & Coverage' },
    { id: 'teststub',  name: 'TestKalender / Test Stub' },
    { id: 'assembly',  name: 'Assembly & Abgabe-JAR' },
    { id: 'phasen',    name: 'Maven-Phasen & clean' }
  ],
  fragen: [

    /* ========== JaCoCo & Coverage ========== */

    { id: 'K01-S03-F01', sec: 'jacoco', type: 'mc', t: 'prepare-agent — Zweck',
      prompt: 'Was macht das Goal `prepare-agent` des JaCoCo-Plugins?',
      options: [
        'Es generiert den HTML-Coverage-Report in `target/site/jacoco/`.',
        'Es instrumentiert den kompilierten Bytecode und schreibt JVM-Argumente in die Maven-Property `${argLine}`.',
        'Es startet die JUnit-Tests mit dem Surefire-Plugin.',
        'Es packt den Bytecode in ein JAR-Archiv.'
      ],
      answer: 1,
      explain: '`prepare-agent` fügt JaCoCo-Hooks in den Bytecode ein (Instrumentierung) und hinterlegt die nötigen JVM-Startargumente in der Maven-Property `argLine`. Surefire muss diese dann mit `<argLine>@{argLine}</argLine>` weitergeben — sonst misst JaCoCo nichts.' },

    { id: 'K01-S03-F02', sec: 'jacoco', type: 'mc', t: 'Phasenbindung prepare-agent',
      prompt: 'An welche Maven-Phase wird `prepare-agent` in der Aufgabenstellung gebunden — und warum genau diese?',
      options: [
        '`compile` — weil JaCoCo Zugriff auf den Quellcode braucht.',
        '`test` — weil die Tests schon laufen müssen, bevor JaCoCo starten kann.',
        '`test-compile` — weil der Bytecode kompiliert sein muss, aber die Tests noch nicht gestartet wurden.',
        '`package` — weil JaCoCo ins finale JAR eingebaut wird.'
      ],
      answer: 2,
      explain: '`test-compile` kommt nach `compile`, aber vor `test`. Zu diesem Zeitpunkt ist der Bytecode fertig (instrumentierbar), aber die Tests laufen noch nicht. JaCoCo muss die JVM-Argumente setzen, BEVOR Surefire die Tests startet — sonst greift die Messung nicht.' },

    { id: 'K01-S03-F03', sec: 'jacoco', type: 'mc', t: 'Branch Coverage verstehen',
      prompt: 'Der JaCoCo-Report zeigt 85 % Branch Coverage für `Sparbuch`. Was bedeutet das?',
      options: [
        '85 % der Zeilen wurden ausgeführt.',
        '85 % der Methoden wurden aufgerufen.',
        'Ca. 3 von 16 Verzweigungspfaden (if/else true+false) wurden nicht durch Tests abgedeckt.',
        'Alle Branches wurden getestet; 15 % der Tests schlugen fehl.'
      ],
      answer: 2,
      explain: 'Branch Coverage misst, ob jeder Zweig einer Verzweigung (if true UND if false) mindestens einmal ausgeführt wurde. 85 % bei 16 Branches = ~14 von 16 Pfaden abgedeckt, ~2-3 fehlen. Ein Test, der eine Methode aufruft, aber nie den else-Pfad betritt, zählt nicht.' },

    { id: 'K01-S03-F04', sec: 'jacoco', type: 'mc', t: '@{argLine} in Eclipse',
      prompt: 'Beim Starten der Tests direkt aus Eclipse erscheint die Warnung: `could not open \'{argLine}\'`. Was ist die Ursache — und was sollte man tun?',
      options: [
        'Die pom.xml ist fehlerhaft. Man muss `<argLine>` entfernen.',
        'Eclipse kennt die Maven-Property `@{argLine}` nicht. Der Fehler ist harmlos — `mvn test` funktioniert einwandfrei.',
        'JaCoCo ist nicht installiert. Man muss `mvn install` ausführen.',
        'Man muss `test-compile` in `initialize` umbenennen.'
      ],
      answer: 1,
      explain: 'Eclipse führt Tests direkt über JUnit aus, nicht über Maven. Die Property `@{argLine}` existiert nur im Maven-Lifecycle — Eclipse kann sie nicht auflösen. Das Ergebnis ist eine harmlose Warnung. Der vollständige Build mit `mvn test` oder `mvn package` funktioniert korrekt.' },

    { id: 'K01-S03-F05', sec: 'jacoco', type: 'mc', t: 'JaCoCo includes — Zweck',
      prompt: 'In der Aufgabe wird JaCoCo so konfiguriert:\n```xml\n<includes>\n  <include>bankprojekt/basisdaten/Sparbuch.class</include>\n</includes>\n```\nWas bewirkt diese Konfiguration?',
      options: [
        'Nur die Datei `Sparbuch.java` wird kompiliert.',
        'Der Coverage-Report enthält ausschließlich die Klasse `Sparbuch` — alle anderen Klassen werden ignoriert.',
        'JaCoCo testet nur den Konstruktor von `Sparbuch`.',
        'Die Klasse `Sparbuch` wird aus dem JAR ausgeschlossen.'
      ],
      answer: 1,
      explain: 'Mit `<includes>` filtert man, welche Klassen im Report erscheinen. Ohne Filter würde JaCoCo alle kompilierten Klassen des Projekts analysieren — das wäre für eine Übung unübersichtlich. Hier soll nur die Coverage von `Sparbuch` bewertet werden.' },

    /* ========== TestKalender / Test Stub ========== */

    { id: 'K01-S03-F06', sec: 'teststub', type: 'mc', t: 'Warum kein setDatum in Kalender?',
      prompt: 'Warum darf man `setDatum(LocalDate d)` NICHT direkt in die Produktionsklasse `Kalender` schreiben?',
      options: [
        'Weil `LocalDate` immutable ist.',
        'Weil `Kalender` `final` ist und nicht verändert werden darf.',
        'Weil Produktionscode keine Test-Infrastruktur enthalten soll — `src/main/` weiß nie, dass es getestet wird.',
        'Weil `setDatum` in Maven reserviert ist.'
      ],
      answer: 2,
      explain: 'Separation of Concerns: Produktionscode (`src/main/`) soll keine Methoden enthalten, die ausschließlich für Tests gebraucht werden. Ein `setDatum` in `Kalender` wäre tote API im Produktionsbetrieb — und ein Zeichen, dass die Architektur nicht testbar gestaltet wurde. Die Lösung ist ein Test Stub (`TestKalender`) in `src/test/`.' },

    { id: 'K01-S03-F07', sec: 'teststub', type: 'mc', t: 'Test Stub — Definition',
      prompt: 'Was ist ein Test Stub im Sinne von Clean Testing?',
      options: [
        'Eine JUnit-Annotation, die einen Test als unvollständig markiert.',
        'Eine Unterklasse (oder Implementierung), die eine Methode mit kontrolliertem Rückgabewert überschreibt, damit Tests deterministisch werden.',
        'Eine Klasse, die alle Methoden des Originals mit `throw new UnsupportedOperationException()` überschreibt.',
        'Ein Maven-Plugin, das Testdaten generiert.'
      ],
      answer: 1,
      explain: 'Ein Test Stub ersetzt eine schwer kontrollierbare Abhängigkeit (hier: `LocalDate.now()`) durch eine kontrollierbare Variante. `TestKalender` überschreibt `getHeutigesDatum()` und gibt ein festes Datum zurück. So werden Tests wiederholbar und unabhängig vom echten Systemdatum.' },

    { id: 'K01-S03-F08', sec: 'teststub', type: 'mc', t: 'Wo liegt TestKalender?',
      prompt: 'In welchem Verzeichnis und Package liegt `TestKalender`?',
      options: [
        '`src/main/java/bankprojekt/nuetzliches/` — selbes Package wie `Kalender`.',
        '`src/test/java/bankprojekt/tests/` — selbes Package wie `SparbuchTest`, anderes Package als `Kalender`.',
        '`src/test/java/bankprojekt/nuetzliches/` — selbes Package wie `Kalender`.',
        '`src/main/java/bankprojekt/tests/` — damit Maven sie findet.'
      ],
      answer: 1,
      explain: '`TestKalender` ist Test-Infrastruktur → gehört nach `src/test/`. Sie muss im selben Package (`bankprojekt.tests`) wie `SparbuchTest` liegen, damit package-private Sichtbarkeit funktioniert. `Kalender` liegt in `bankprojekt.nuetzliches` — einem anderen Package.' },

    { id: 'K01-S03-F09', sec: 'teststub', type: 'coderev', t: 'Bug in setDatum finden',
      prompt: 'Finde den Bug im folgenden `setDatum`:\n```java\npublic void setDatum(LocalDate neuesDatum) {\n    this.datum = datum;\n}\n```',
      options: [
        'Die Methode ist `public` — sie sollte `private` sein.',
        '`this.datum = datum` kopiert das Feld in sich selbst. Der Parameter `neuesDatum` wird ignoriert. Korrekt: `this.datum = neuesDatum`.',
        'Der Parameter müsste `LocalDate.now()` sein.',
        'Es fehlt ein `return`-Statement.'
      ],
      answer: 1,
      explain: '`datum` (ohne `this.`) bezieht sich im Scope auf das Feld `datum` selbst — der Parameter `neuesDatum` wird nie verwendet. Das `setDatum` tut nichts Sinnvolles. Richtig: `this.datum = neuesDatum;` — der Parametername und der Feldname müssen unterschiedlich sein, oder man benutzt explizit `this.` für das Feld und den vollen Namen für den Parameter.' },

    { id: 'K01-S03-F10', sec: 'teststub', type: 'mc', t: 'Warum ist Test 7 ohne TestKalender schwach?',
      prompt: 'Test 7 führt erst eine erfolgreiche Abhebung durch, dann eine fehlgeschlagene — alles am selben Tag. Warum ist dieser Test methodisch schwach?',
      options: [
        'Weil man mindestens 3 Abhebungen testen muss.',
        'Weil der Test auch dann bestehen würde, wenn die Implementierung das Datum bei fehlgeschlagener Abhebung fälschlicherweise überschreibt — da beide Daten gleich sind.',
        'Weil `assertEquals` für Datumsvergleiche nicht geeignet ist.',
        'Weil `GesperrtException` nicht abgefangen wird.'
      ],
      answer: 1,
      explain: 'Wenn erfolgreiche und fehlgeschlagene Abhebung am selben Tag passieren, ist `vorher == heute` immer wahr — egal ob die Implementierung das Datum setzt oder nicht. Der Test unterscheidet die Fälle nicht. Mit `TestKalender` stellt man den zweiten Tag ein: dann schlägt der Test wirklich fehl, wenn das Datum fälschlich überschrieben wird.' },

    { id: 'K01-S03-F11', sec: 'teststub', type: 'code', t: 'TestKalender schreiben',
      prompt: 'Schreibe die vollständige Klasse `TestKalender` (ohne JavaDoc). Sie soll:\n- `Kalender` erweitern\n- ein festes `LocalDate` zurückgeben\n- einen Konstruktor mit `LocalDate datum` haben\n- eine Methode `setDatum(LocalDate neuesDatum)` haben',
      options: [
        'class TestKalender extends Kalender {\n    private LocalDate datum;\n    public TestKalender(LocalDate datum) { this.datum = datum; }\n    @Override\n    public LocalDate getHeutigesDatum() { return datum; }\n    public void setDatum(LocalDate neuesDatum) { this.datum = neuesDatum; }\n}',
        'class TestKalender implements Kalender {\n    private LocalDate datum;\n    public TestKalender(LocalDate d) { datum = d; }\n    public LocalDate getHeutigesDatum() { return datum; }\n}',
        'class TestKalender extends Kalender {\n    @Override\n    public LocalDate getHeutigesDatum() { return LocalDate.now(); }\n}',
        'class TestKalender {\n    private LocalDate datum;\n    public LocalDate getDatum() { return datum; }\n}'
      ],
      answer: 0,
      explain: '`TestKalender` muss `extends Kalender` verwenden (kein `implements` — `Kalender` ist eine Klasse, kein Interface). `getHeutigesDatum()` wird mit `@Override` überschrieben und gibt das gespeicherte `datum` zurück. `setDatum` nimmt `neuesDatum` als Parameter und schreibt ihn in `this.datum` — nicht `this.datum = datum` (das wäre der Bug).' },

    /* ========== Assembly & Abgabe-JAR ========== */

    { id: 'K01-S03-F12', sec: 'assembly', type: 'mc', t: 'descriptor vs descriptorRef',
      prompt: 'Das Assembly-Plugin wird mit `<descriptor>src/assembly/abgabe.xml</descriptor>` konfiguriert, nicht mit `<descriptorRef>`. Warum?',
      options: [
        'Weil `descriptorRef` veraltet und in neueren Maven-Versionen entfernt wurde.',
        '`descriptorRef` zeigt auf vordefinierte Templates (z. B. `jar-with-dependencies`). Keines davon passt zur gewünschten Kombination aus `src/`, `jacoco/`, `pom.xml` und `taglist.html` — daher braucht man einen eigenen Descriptor.',
        'Weil `descriptor` schneller ist als `descriptorRef`.',
        'Weil `descriptorRef` nur für ZIP-Archive funktioniert.'
      ],
      answer: 1,
      explain: 'Maven Assembly kennt einige Standard-Descriptors (z. B. `jar-with-dependencies` fügt alle Dependencies in ein FAT-JAR). Unsere Abgabe ist aber maßgeschneidert: `src/`-Ordner, JaCoCo-Report, `taglist.html`, `pom.xml`. Für eine solche individuelle Zusammensetzung schreibt man einen eigenen XML-Descriptor.' },

    { id: 'K01-S03-F13', sec: 'assembly', type: 'mc', t: 'includeBaseDirectory false',
      prompt: 'Was bewirkt `<includeBaseDirectory>false</includeBaseDirectory>` im Assembly-Descriptor?',
      options: [
        'Das Basis-Verzeichnis des Projekts wird aus dem Classpath entfernt.',
        'Die Dateien liegen direkt im JAR-Root ohne einen übergeordneten Ordner wie `bankprojekt-0.0.1-SNAPSHOT/`.',
        'Der `src/`-Ordner wird nicht ins JAR eingebunden.',
        'Das Zielformat ändert sich von JAR zu ZIP.'
      ],
      answer: 1,
      explain: 'Ohne `false` legt Maven Assembly standardmäßig alle Dateien in einen Unterordner mit dem Artifaktnamen (z. B. `bankprojekt-0.0.1-SNAPSHOT/src/...`). Mit `false` landen die Dateien direkt im JAR-Root: `src/`, `jacoco/`, `pom.xml`. Das ist die erwartete Struktur für die Abgabe.' },

    { id: 'K01-S03-F14', sec: 'assembly', type: 'mc', t: 'fileSets vs files',
      prompt: 'Der Descriptor enthält sowohl `<fileSets>` als auch `<files>`. Was ist der Unterschied?',
      options: [
        '`fileSets` kopiert einzelne Dateien, `files` kopiert ganze Verzeichnisse.',
        '`fileSets` kopiert ganze Verzeichnisse; `files` kopiert einzelne benannte Dateien.',
        '`fileSets` ist für Binärdateien, `files` für Textdateien.',
        '`fileSets` und `files` sind Synonyme — man kann beides beliebig verwenden.'
      ],
      answer: 1,
      explain: '`<fileSets>` → Verzeichnis-Einträge (z. B. `src/`, `target/site/jacoco`). `<files>` → einzelne, explizit benannte Dateien (z. B. `pom.xml`). Man braucht beide, weil `pom.xml` im Projekt-Root liegt und kein ganzes Verzeichnis dazu kopiert werden soll.' },

    { id: 'K01-S03-F15', sec: 'assembly', type: 'coderev', t: 'groupId fehlt beim assembly-Plugin',
      prompt: 'Folgende Plugin-Konfiguration wird so in der Aufgabe angegeben:\n```xml\n<plugin>\n  <artifactId>maven-assembly-plugin</artifactId>\n  <version>3.8.0</version>\n  ...\n</plugin>\n```\nWarum fehlt `<groupId>`?',
      options: [
        'Das ist ein Fehler — ohne `groupId` schlägt der Build fehl.',
        'Weil `maven-assembly-plugin` kein Apache-Plugin ist und keine `groupId` hat.',
        'Weil `org.apache.maven.plugins` der Standard-GroupId in Mavens Super-POM ist — Maven ergänzt sie automatisch.',
        'Weil `groupId` nur bei Dependencies, nicht bei Plugins benötigt wird.'
      ],
      answer: 2,
      explain: 'Mavens Super-POM definiert `org.apache.maven.plugins` als Standard-`groupId` für Plugins. Lässt man `groupId` weg, ergänzt Maven diesen Wert automatisch. Das ist eine Maven-Konvention für Official-Apache-Plugins — spart Schreibarbeit und gilt nur für diese Gruppe.' },

    { id: 'K01-S03-F16', sec: 'assembly', type: 'mc', t: 'taglist-maven-plugin — Zweck',
      prompt: 'Was macht das `taglist-maven-plugin` in dieser Übung?',
      options: [
        'Es erstellt Git-Tags für jeden Build.',
        'Es scannt alle Quelldateien nach Kommentaren mit dem Text `zu erledigen:` und erzeugt daraus eine `taglist.html` mit einer Liste aller offenen TODOs.',
        'Es generiert JavaDoc-HTML aus den Quellkommentaren.',
        'Es fügt automatisch `// TODO`-Kommentare an nicht getestete Methoden.'
      ],
      answer: 1,
      explain: '`taglist-maven-plugin` sucht nach konfigurierten Schlagwörtern (hier: `zu erledigen:`) in allen Quelldateien und listet alle Fundstellen in einer HTML-Seite (`taglist.html`) auf. Diese Datei wird vom Assembly-Plugin ins Abgabe-JAR eingebunden, damit die Betreuerin sieht, welche Punkte noch offen sind.' },

    /* ========== Maven-Phasen & clean ========== */

    { id: 'K01-S03-F17', sec: 'phasen', type: 'mc', t: 'mvn clean package — was passiert?',
      prompt: 'Du führst `mvn clean package` aus. In welcher Reihenfolge passiert was?',
      options: [
        '`package` → `compile` → `test` → `clean`',
        '`clean` löscht `target/`, dann: `compile` → `test-compile` (+ JaCoCo prepare-agent) → `test` (+ JaCoCo report) → `package` (+ taglist + assembly)',
        '`clean` und `package` laufen parallel.',
        '`clean` löscht nur die `.class`-Dateien, nicht den JaCoCo-Report.'
      ],
      answer: 1,
      explain: '`clean` und `package` gehören zu zwei verschiedenen Maven-Lifecycles, die hintereinander ausgeführt werden. `clean` leert zuerst `target/` komplett. Dann startet der Default-Lifecycle: compile → test-compile → test → package. An `test-compile` hängt JaCoCo `prepare-agent`, an `test` hängt JaCoCo `report`, an `package` hängen taglist und assembly.' },

    { id: 'K01-S03-F18', sec: 'phasen', type: 'mc', t: 'Warum mvn clean vor Abgabe?',
      prompt: 'Warum sollte man vor der finalen Abgabe `mvn clean package` statt nur `mvn package` ausführen?',
      options: [
        'Weil `mvn package` alleine keinen JaCoCo-Report erzeugt.',
        'Weil umbenannte oder gelöschte Klassen als veraltete `.class`-Dateien in `target/` verbleiben und ohne `clean` fälschlicherweise ins JAR gelangen könnten.',
        'Weil `clean` die pom.xml validiert.',
        'Weil `mvn package` ohne `clean` keine Tests ausführt.'
      ],
      answer: 1,
      explain: 'Wenn man eine Klasse umbenennt oder löscht, bleibt die alte `.class`-Datei in `target/` — Maven kompiliert nur neu geänderte Dateien. `clean` löscht `target/` komplett, sodass der Build garantiert von einem sauberen Zustand startet. Für die Abgabe ist das wichtig: kein veralteter Code im JAR.' },

    { id: 'K01-S03-F19', sec: 'phasen', type: 'mc', t: 'scope=test vs scope=provided',
      prompt: 'JUnit hat `scope=test`, Lombok hat `scope=provided`. Was ist der Unterschied in der Praxis?',
      options: [
        'Beide werden nicht ins JAR eingebunden — der Unterschied ist nur dokumentarisch.',
        '`scope=test` bedeutet: Dependency ist nur beim Kompilieren von Tests verfügbar; `scope=provided` bedeutet: Dependency ist bei Compile + Test verfügbar, aber nicht im finalen JAR, weil die Laufzeitumgebung sie bereitstellt.',
        '`scope=provided` lädt die Dependency aus dem Internet; `scope=test` aus dem lokalen Maven-Repository.',
        '`scope=test` und `scope=provided` sind Synonyme seit Maven 3.'
      ],
      answer: 1,
      explain: '`scope=test`: nur im Testcode verfügbar, nicht im Produktionscode, nicht im JAR. `scope=provided`: im Produktionscode und Testcode verfügbar (zum Kompilieren), aber NICHT ins JAR gepackt — weil die Laufzeitumgebung (JDK, Appserver) die Dependency bereitstellt. Lombok erzeugt Code zur Compile-Zeit; die JVM braucht die Lombok-Klassen zur Laufzeit nicht mehr.' },

    { id: 'K01-S03-F20', sec: 'phasen', type: 'mc', t: 'Welcher Befehl erzeugt das Abgabe-JAR?',
      prompt: 'Welcher Maven-Befehl erzeugt das Abgabe-JAR `bankprojekt-0.0.1-SNAPSHOT-abgabe.jar` mit allen geforderten Inhalten?',
      options: [
        '`mvn test`',
        '`mvn compile`',
        '`mvn package` (oder `mvn clean package`)',
        '`mvn install`'
      ],
      answer: 2,
      explain: '`mvn package` führt alle Phasen bis einschließlich `package` aus. Erst in der `package`-Phase laufen Assembly-Plugin und taglist-Plugin. `mvn test` stoppt davor. `mvn install` führt zusätzlich noch `install` aus (kopiert das JAR ins lokale Repository) — nicht nötig für die Abgabe.' }

  ]
});
