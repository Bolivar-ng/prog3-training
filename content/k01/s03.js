/* Kapitel 01 · Serie S03: Übung 1 – JaCoCo, TestStub & Assembly
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben. */
P3.serie({
  id: 'K01-S03',
  kapitel: 'K01',
  titel: 'Übung 1: JaCoCo, TestStub & Assembly',
  beschreibung: 'Klausurübung zur Prog3-Abgabe: JaCoCo-Konfiguration, TestKalender als Test Stub, argLine, taglist-Plugin, Assembly-Descriptor und Maven clean. Gemischte Aufgabentypen.',
  neu: true,
  themen: [
    { id: 'jacoco',   name: 'JaCoCo & Coverage' },
    { id: 'teststub', name: 'TestKalender / Test Stub' },
    { id: 'assembly', name: 'Assembly & Abgabe-JAR' },
    { id: 'phasen',   name: 'Maven-Phasen & clean' }
  ],
  fragen: [

    /* ========== JaCoCo & Coverage ========== */

    { id: 'K01-S03-F01', sec: 'jacoco', type: 'fill', t: 'JaCoCo-Execution vervollständigen',
      prompt: 'Vervollständige die JaCoCo-Konfiguration für `prepare-agent`.',
      code: `<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.12</version>
  <executions>
    <execution>
      <goals><goal>[[0]]</goal></goals>
      <phase>[[1]]</phase>
    </execution>
  </executions>
</plugin>`,
      blanks: [
        { options: ['prepare-agent', 'report', 'check', 'instrument'], answer: 0,
          why: '`prepare-agent` instrumentiert den Bytecode und schreibt die JVM-Argumente in `\${argLine}`.' },
        { options: ['test-compile', 'test', 'compile', 'package'], answer: 0,
          why: 'Muss vor dem Start der Tests gebunden sein — `test-compile` kommt nach `compile`, aber vor `test`.' }
      ],
      explain: '`prepare-agent` muss vor `test` laufen (Phase `test-compile`), damit JaCoCo die JVM mit `-javaagent:...` starten kann, bevor Surefire die Tests ausführt.' },

    { id: 'K01-S03-F02', sec: 'jacoco', type: 'mc', t: 'Was macht prepare-agent?',
      prompt: 'Was genau schreibt `prepare-agent` in die Maven-Property `\${argLine}`?',
      options: [
        'Den Pfad zur `jacoco.exec`-Ausgabedatei als `-Xmx`-Flag.',
        'JVM-Startargumente für den Surefire-Agenten, damit JaCoCo den Bytecode zur Laufzeit messen kann.',
        'Die Liste aller zu testenden Klassen als Komma-getrennte `classpath`-Einträge.',
        'Den JUnit-5-Provider-Klassennamen für den Surefire-Runner.'
      ],
      answer: 1,
      explain: 'JaCoCo instrumentiert zur Laufzeit per Java-Agent (`-javaagent:path/to/jacocoagent.jar=...`). Surefire übergibt diesen Wert an die Test-JVM mit `<argLine>@{argLine}</argLine>`. Ohne diese Weitergabe misst JaCoCo gar nichts.' },

    { id: 'K01-S03-F03', sec: 'jacoco', type: 'order', t: 'Reihenfolge der JaCoCo-Phasen',
      prompt: 'Bringe die Schritte eines vollständigen JaCoCo-Builds in die richtige Reihenfolge.',
      items: [
        '`compile` (Produktionscode übersetzen)',
        '`test-compile` + JaCoCo `prepare-agent` (Bytecode instrumentieren)',
        '`test` — Surefire startet Test-JVM mit `@{argLine}`',
        'JaCoCo schreibt `jacoco.exec` (Rohdaten)',
        '`test` Phase Ende — JaCoCo `report` erzeugt HTML in `target/site/jacoco/`',
        '`package` — Assembly und taglist laufen'
      ],
      explain: '`prepare-agent` und `report` hängen beide am Lifecycle, aber an verschiedenen Phasen. Ohne `prepare-agent` gibt es keine `jacoco.exec`, ohne die kein Report.' },

    { id: 'K01-S03-F04', sec: 'jacoco', type: 'review', t: 'Surefire-Konfiguration prüfen',
      prompt: 'Welche Befunde treffen auf diese Surefire-Konfiguration zu?',
      code: `<plugin>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.5.2</version>
  <configuration>
    <argLine>\${argLine}</argLine>
  </configuration>
</plugin>`,
      findings: [
        { text: '`\${argLine}` sollte `@{argLine}` sein.', correct: true,
          why: '`\${argLine}` ist eine Maven-Property und wird beim POM-Parsen aufgelöst (vor JaCoCo). `@{argLine}` wird erst zur Laufzeit der Phase aufgelöst — wenn JaCoCo den Wert schon gesetzt hat.' },
        { text: 'Die `<version>` von Surefire fehlt — das führt zu einem Build-Fehler.', correct: false,
          why: 'Die Version ist angegeben (3.5.2). Fehlen würde sie auch nicht zum Fehler führen, Maven würde die Version aus der Super-POM nehmen.' },
        { text: 'Ohne `@{argLine}` misst JaCoCo keine Coverage, weil der Agent nie gestartet wird.', correct: true,
          why: 'Mit `\${argLine}` bekommt Surefire einen leeren String oder einen alten Wert. Der JaCoCo-Agent (`-javaagent:...`) wird nie an die Test-JVM übergeben.' },
        { text: 'Die `<groupId>` fehlt — der Build scheitert.', correct: false,
          why: '`maven-surefire-plugin` gehört zu `org.apache.maven.plugins` — die Standard-GroupId aus Mavens Super-POM. Sie kann weggelassen werden.' }
      ],
      explain: '`${}` vs `@{}` ist die häufigste JaCoCo-Falle. Ersteres: Maven löst beim Parsen auf — da ist `argLine` noch leer. Letzteres: Maven löst zur Ausführungszeit auf — nach `prepare-agent`.' },

    { id: 'K01-S03-F05', sec: 'jacoco', type: 'mc', t: 'Branch Coverage 85 %',
      prompt: 'JaCoCo meldet für `Sparbuch`: 85 % Branch Coverage, 16 Branches gesamt. Was fehlt noch?',
      options: [
        '15 Testmethoden fehlen noch.',
        'Ca. 2–3 Verzweigungspfade (ein `true`- oder `false`-Ast eines if/else) wurden nie ausgeführt.',
        '85 % der Zeilen wurden ausgeführt; 15 % sind tote Code-Zeilen.',
        'Der JaCoCo-Report ist unvollständig — es wurden nicht alle Klassen analysiert.'
      ],
      answer: 1,
      explain: 'Branch Coverage zählt jeden einzelnen Pfad einer Verzweigung: `if (x)` hat Pfad true UND Pfad false. 85 % von 16 = ~13,6 → 14 Pfade abgedeckt, ~2 fehlen. Ein Test, der `abheben()` aufruft ohne je eine Exception auszulösen, deckt den `catch`-Branch nie ab.' },

    /* ========== TestKalender / Test Stub ========== */

    { id: 'K01-S03-F06', sec: 'teststub', type: 'mc', t: 'Warum kein setDatum in Kalender?',
      prompt: 'Warum soll `setDatum(LocalDate d)` NICHT in die Produktionsklasse `Kalender` geschrieben werden?',
      options: [
        'Weil `Kalender` `final` ist und nicht erweitert werden kann.',
        'Weil `LocalDate` unveränderlich ist und keine Setter erlaubt.',
        'Weil Produktionscode keine Methoden enthalten soll, die nur für Tests existieren.',
        'Weil `setDatum` in Maven als reserviertes Keyword gilt.'
      ],
      answer: 2,
      explain: 'Separation of Concerns: `src/main/` weiß nicht, dass es getestet wird. Eine Methode, die nur existiert, damit ein Test das Datum manipulieren kann, gehört nicht in den Produktionscode. Die Lösung: `TestKalender` als Subklasse in `src/test/` — dort ist das legitim.' },

    { id: 'K01-S03-F07', sec: 'teststub', type: 'fill', t: 'TestKalender vervollständigen',
      prompt: 'Vervollständige `TestKalender`. Die Klasse liegt in `src/test/java/bankprojekt/tests/`.',
      code: `package bankprojekt.tests;
import java.time.LocalDate;
import bankprojekt.nuetzliches.Kalender;

public class TestKalender [[0]] Kalender {
    private LocalDate datum;

    public TestKalender(LocalDate datum) {
        [[1]].datum = datum;
    }

    @Override
    public LocalDate [[2]]() {
        return datum;
    }

    public void setDatum(LocalDate neuesDatum) {
        this.datum = [[3]];
    }
}`,
      blanks: [
        { options: ['extends', 'implements', 'import'], answer: 0,
          why: '`Kalender` ist eine Klasse, kein Interface — man verwendet `extends`, nicht `implements`.' },
        { options: ['this', 'super', 'datum'], answer: 0,
          why: 'Feld `datum` und Parameter `datum` heißen gleich → `this.datum` für das Feld, sonst Namensschatten.' },
        { options: ['getHeutigesDatum', 'getDatum', 'getDate'], answer: 0,
          why: '`getHeutigesDatum()` ist die Methode aus `Kalender`, die überschrieben werden soll.' },
        { options: ['neuesDatum', 'datum', 'this.datum'], answer: 0,
          why: 'Der Parameter heißt `neuesDatum` — genau der muss ins Feld geschrieben werden.' }
      ],
      explain: 'Die vier klassischen Fallen: extends vs implements, this. bei Namensschatten, korrekter Methodenname, und im Setter den Parameter (nicht das Feld) zuweisen.' },

    { id: 'K01-S03-F08', sec: 'teststub', type: 'bug', t: 'Fehler in SparbuchTest finden',
      prompt: 'Test 8 soll prüfen, dass das letzte Abhebungsdatum bei einer fehlgeschlagenen Abhebung NICHT überschrieben wird. Markiere die fehlerhafte(n) Zeile(n) und erkläre.',
      code: `@Test
void test8_datumNichtUeberschrieben() throws Exception {
    LocalDate tag1 = LocalDate.of(2024, 1, 1);
    LocalDate tag2 = LocalDate.of(2024, 1, 2);
    TestKalender k = new TestKalender(tag1);
    Sparbuch s = new Sparbuch(k, new Geldbetrag(1000));

    s.abheben(new Geldbetrag(100));          // Erfolg am tag1
    k.setDatum(tag1);                        // Zeile 8
    s.abheben(new Geldbetrag(10000));        // soll fehlschlagen

    assertEquals(tag1, s.getLetzteAbhebung());
}`,
      required: [7], extra: [],
      model: `Zeile 8: k.setDatum(tag1) setzt das Datum zurück auf tag1 statt auf tag2. Dadurch passieren beide Abhebungen am selben Tag — der Test kann nicht erkennen, ob die Implementierung das Datum fälschlich überschreibt oder nicht. Korrekt: k.setDatum(tag2).`,
      explain: 'Wenn beide Abhebungen am selben Tag stattfinden, ist `getLetzteAbhebung() == tag1` immer true — auch bei einer kaputten Implementierung. Mit tag2 für den zweiten Schritt schlägt der Test korrekt fehl, wenn das Datum fälschlich gesetzt wird.' },

    { id: 'K01-S03-F09', sec: 'teststub', type: 'review', t: 'TestKalender-Abgabe reviewen',
      prompt: 'Ein Kommilitone gibt diesen `TestKalender` ab. Welche Befunde treffen zu?',
      code: `package bankprojekt.nuetzliches;
import java.time.LocalDate;

public class TestKalender extends Kalender {
    LocalDate datum;

    TestKalender(LocalDate datum) {
        this.datum = datum;
    }

    @Override
    public LocalDate getHeutigesDatum() {
        return datum;
    }
}`,
      findings: [
        { text: 'Das Package ist falsch — `TestKalender` gehört nach `bankprojekt.tests`, nicht `bankprojekt.nuetzliches`.', correct: true,
          why: '`TestKalender` ist Test-Infrastruktur und gehört in das Test-Source-Tree (`src/test/`). Im Produktions-Package würde sie ohne JUnit-Dependency kompiliert und ins JAR gepackt.' },
        { text: '`datum` ist package-private statt `private` — kein echter Bug, aber schlechter Stil.', correct: true,
          why: 'Attribute sollen laut den Kurs-Konventionen `private` sein. Package-private ist hier kein Fehler, aber nicht regelkonform.' },
        { text: '`setDatum` fehlt — damit kann der Test das Datum nicht weiterschalten.', correct: true,
          why: 'Ohne `setDatum` kann Test 8 nicht prüfen, ob das Datum bei einer fehlgeschlagenen Abhebung korrekt bleibt (zwei verschiedene Tage).' },
        { text: 'Der Konstruktor sollte `public` sein.', correct: false,
          why: 'Weil `TestKalender` und `SparbuchTest` im selben Package wären (wenn das Package korrekt wäre), reicht package-private. Es ist kein Fehler — aber falsche Platzierung ist das eigentliche Problem.' }
      ],
      explain: 'Drei Probleme gleichzeitig: falsches Package (hätte nötigste Konsequenz), fehlendes Sichtbarkeitsmodifier, und fehlendes `setDatum`. In einer Klausur zählen alle drei.' },

    { id: 'K01-S03-F10', sec: 'teststub', type: 'mc', t: 'Wo liegt TestKalender im Projekt?',
      prompt: 'In welchem Ordner und Package liegt `TestKalender`?',
      options: [
        '`src/main/java/bankprojekt/nuetzliches/` — selbes Package wie `Kalender`.',
        '`src/test/java/bankprojekt/tests/` — selbes Package wie `SparbuchTest`.',
        '`src/test/java/bankprojekt/nuetzliches/` — gleiches Package wie `Kalender`, aber im Testbaum.',
        '`src/main/java/bankprojekt/tests/` — damit Maven sie in den classpath aufnimmt.'
      ],
      answer: 1,
      explain: '`TestKalender` ist Test-Infrastruktur → `src/test/`. Sie teilt das Package mit `SparbuchTest` (`bankprojekt.tests`), nicht mit `Kalender` (`bankprojekt.nuetzliches`). Das ist Konvention: Test-Stubs gehören zu den Tests, nicht zum Produktionscode.' },

    /* ========== Assembly & Abgabe-JAR ========== */

    { id: 'K01-S03-F11', sec: 'assembly', type: 'fill', t: 'Assembly-Descriptor vervollständigen',
      prompt: 'Vervollständige den Assembly-Descriptor für die Abgabe.',
      code: `<assembly>
  <id>abgabe</id>
  <formats><format>[[0]]</format></formats>
  <[[1]]>false</…>
  <fileSets>
    <fileSet>
      <directory>src</directory>
      <outputDirectory>[[2]]</outputDirectory>
    </fileSet>
    <fileSet>
      <directory>target/site/jacoco</directory>
      <outputDirectory>[[3]]</outputDirectory>
    </fileSet>
  </fileSets>
  <files>
    <file>
      <source>[[4]]</source>
      <outputDirectory>/</outputDirectory>
    </file>
  </files>
</assembly>`,
      blanks: [
        { options: ['jar', 'zip', 'tar.gz', 'war'], answer: 0,
          why: 'Die Aufgabe verlangt ein JAR als Abgabeformat.' },
        { options: ['includeBaseDirectory', 'baseDirectory', 'outputDirectory'], answer: 0,
          why: 'Ohne `false` legt Assembly alle Dateien in einen Unterordner mit dem Artefaktnamen.' },
        { options: ['src', 'source', 'main'], answer: 0,
          why: 'Der `src`-Ordner soll im JAR direkt als `src/` erscheinen.' },
        { options: ['jacoco', 'target/site/jacoco', 'coverage'], answer: 0,
          why: 'Die JaCoCo-HTML-Dateien sollen im JAR unter `jacoco/` liegen.' },
        { options: ['pom.xml', 'target/pom.xml', 'src/pom.xml'], answer: 0,
          why: 'Die `pom.xml` liegt im Projekt-Root und soll einzeln mit `<files>` ins JAR-Root kopiert werden.' }
      ],
      explain: 'Assembly-Descriptors sind präzise: `fileSets` für Verzeichnisse, `files` für einzelne Dateien. `includeBaseDirectory=false` verhindert den `projektname/`-Wrapper.' },

    { id: 'K01-S03-F12', sec: 'assembly', type: 'mc', t: 'descriptor vs descriptorRef',
      prompt: 'Warum wird `<descriptor>src/assembly/abgabe.xml</descriptor>` benutzt statt `<descriptorRef>jar-with-dependencies</descriptorRef>`?',
      options: [
        'Weil `descriptorRef` in neueren Maven-Versionen entfernt wurde.',
        'Weil `jar-with-dependencies` alle Dependencies ins JAR packt, aber keine `src/`-Ordner oder Reports.',
        'Weil `descriptor` schneller ausgeführt wird als `descriptorRef`.',
        'Weil `descriptorRef` nur für WAR-Archive funktioniert.'
      ],
      answer: 1,
      explain: '`descriptorRef` bietet vordefinierte Templates: `jar-with-dependencies`, `src`, `bin`. Keins davon passt zur Abgabe (Kombination aus `src/`, JaCoCo-Report, `taglist.html`, `pom.xml`). Ein eigener Descriptor ist die einzige Lösung.' },

    { id: 'K01-S03-F13', sec: 'assembly', type: 'match', t: 'Assembly-Elemente zuordnen',
      prompt: 'Ordne jedem Assembly-XML-Element seine Funktion zu.',
      pairs: [
        ['`<fileSets>`', 'Ganzes Verzeichnis ins JAR einbinden'],
        ['`<files>`', 'Einzelne benannte Datei einbinden'],
        ['`<includeBaseDirectory>false</includeBaseDirectory>`', 'Verhindert einen Wrapper-Ordner mit dem Artefaktnamen'],
        ['`<outputDirectory>jacoco</outputDirectory>`', 'Legt den Zielpfad im JAR fest'],
        ['`<id>abgabe</id>`', 'Bestimmt den Suffix im Dateinamen des erzeugten JARs']
      ],
      explain: 'Der `<id>`-Wert erscheint im Dateinamen: `bankprojekt-0.0.1-SNAPSHOT-abgabe.jar`. `outputDirectory` mit `/` bedeutet Wurzel des Archivs.' },

    { id: 'K01-S03-F14', sec: 'assembly', type: 'mc', t: 'taglist-Plugin — Phasenbindung',
      prompt: 'In welcher Phase läuft das `taglist-maven-plugin` und warum?',
      options: [
        '`compile` — damit Kommentare schon beim Übersetzen geprüft werden.',
        '`test` — damit auch Test-Quelltexte nach TODOs durchsucht werden.',
        '`package` — damit `taglist.html` im JAR landet, das in derselben Phase gebaut wird.',
        '`verify` — damit es nach dem JAR-Build läuft und das JAR nicht blockiert.'
      ],
      answer: 2,
      explain: '`taglist-maven-plugin` läuft in `package`, damit `taglist.html` existiert, wenn das Assembly-Plugin ebenfalls in `package` das Abgabe-JAR zusammenbaut. Würde es später laufen, fehlte die Datei im JAR.' },

    /* ========== Maven-Phasen & clean ========== */

    { id: 'K01-S03-F15', sec: 'phasen', type: 'order', t: 'mvn clean package — Reihenfolge',
      prompt: 'Bringe die Schritte von `mvn clean package` in die richtige Reihenfolge.',
      items: [
        '`clean`-Lifecycle: `target/` wird vollständig gelöscht',
        '`compile`: Produktionscode wird übersetzt',
        '`test-compile` + JaCoCo `prepare-agent`: Testcode übersetzen, Bytecode instrumentieren',
        '`test` + JaCoCo `report`: Tests laufen, Coverage-Report wird erzeugt',
        '`package`: Assembly-Plugin und taglist-Plugin laufen, JAR wird gebaut'
      ],
      explain: '`clean` und `package` sind zwei separate Lifecycles, die nacheinander ausgeführt werden. Clean läuft komplett durch, dann beginnt der Default-Lifecycle von vorne.' },

    { id: 'K01-S03-F16', sec: 'phasen', type: 'mc', t: 'Warum clean vor Abgabe?',
      prompt: 'Eine Klasse `AltHilfsmethode.java` wurde gelöscht. Du führst nur `mvn package` aus (ohne `clean`). Was passiert?',
      options: [
        'Maven bemerkt die gelöschte Datei und entfernt `AltHilfsmethode.class` automatisch.',
        '`AltHilfsmethode.class` bleibt in `target/` und landet im Abgabe-JAR — obwohl die Klasse längst entfernt wurde.',
        'Der Build schlägt fehl mit „ClassNotFoundException".',
        'Maven fragt nach, ob die `.class`-Datei gelöscht werden soll.'
      ],
      answer: 1,
      explain: 'Maven kompiliert nur geänderte Dateien neu — gelöschte `.java`-Dateien hinterlassen verwaiste `.class`-Dateien in `target/`. `mvn clean` löscht `target/` komplett, sodass der Build von einem sauberen Zustand startet. Deshalb: immer `mvn clean package` vor einer Abgabe.' },

    { id: 'K01-S03-F17', sec: 'phasen', type: 'multi', t: 'Was gehört in die Abgabe?',
      prompt: 'Welche der folgenden Dateien/Ordner gehören in das Abgabe-JAR?',
      options: [
        '`src/main/java/bankprojekt/basisdaten/Sparbuch.java`',
        '`target/classes/bankprojekt/basisdaten/Sparbuch.class`',
        '`target/site/jacoco/index.html`',
        '`pom.xml`',
        '`target/site/taglist/taglist.html`',
        '`.classpath` (Eclipse-Datei)',
        '`src/assembly/abgabe.xml`'
      ],
      answer: [0, 2, 3, 4, 6],
      explain: 'Das JAR enthält: Quellcode (`src/`), JaCoCo-Report (`target/site/jacoco/`), `pom.xml`, `taglist.html` — und den Descriptor selbst (`src/assembly/abgabe.xml`) weil er Teil von `src/` ist. Nicht enthalten: kompilierte `.class`-Dateien (Bytecode) und IDE-Dateien (`.classpath`).' },

    { id: 'K01-S03-F18', sec: 'phasen', type: 'mc', t: 'scope=test vs scope=provided',
      prompt: 'JUnit ist mit `scope=test`, Lombok mit `scope=provided` eingetragen. Was ist der entscheidende Unterschied?',
      options: [
        '`test` verhindert, dass die Dependency ins JAR gepackt wird; `provided` erlaubt es.',
        '`provided` ist im Produktionscode verfügbar, `test` nur im Testcode — beide landen nicht im JAR.',
        '`provided` bedeutet, die Dependency fehlt; Maven muss sie erst herunterladen.',
        '`test` und `provided` sind identisch — nur der Name unterscheidet sich historisch.'
      ],
      answer: 1,
      explain: 'Beide schließen die Dependency aus dem JAR aus, aber aus verschiedenen Gründen: `test` — nur für Testcode, nicht für Produktionscode. `provided` — für Produktionscode und Tests verfügbar, aber die Laufzeitumgebung liefert sie (JDK, Appserver). Lombok generiert Code beim Kompilieren; zur Laufzeit wird die JAR nicht mehr gebraucht.' },

    { id: 'K01-S03-F19', sec: 'phasen', type: 'explain', t: 'Warum @{argLine} statt ${argLine}?',
      prompt: 'In der pom.xml steht <argLine>@{argLine}</argLine> statt ${argLine}. Erklaere den Unterschied und warum die @{}-Variante hier noetig ist.',
      model: 'Maven loest ${}-Ausdruecke beim Parsen der pom.xml auf — noch bevor irgendeine Phase laeuft. ' +
             'Zu diesem Zeitpunkt hat JaCoCo prepare-agent die Property argLine noch nicht gesetzt. ' +
             'Ergebnis: Surefire bekommt einen leeren String, der Agent startet nicht, JaCoCo misst nichts.\n' +
             '@{}-Ausdruecke (late binding) werden erst zur Ausfuehrungszeit der Phase aufgeloest. ' +
             'Wenn Surefire in der test-Phase startet, hat prepare-agent in test-compile den JaCoCo-Agent-Aufruf ' +
             'bereits in argLine hinterlegt. So bekommt die Test-JVM den richtigen -javaagent:...-Flag.' },

    { id: 'K01-S03-F20', sec: 'phasen', type: 'mc', t: 'Welcher Befehl erzeugt das Abgabe-JAR?',
      prompt: 'Welcher Maven-Befehl erzeugt `bankprojekt-0.0.1-SNAPSHOT-abgabe.jar` mit vollständigem JaCoCo-Report und taglist?',
      options: [
        '`mvn test` — damit laufen Tests und JaCoCo-Report wird erzeugt.',
        '`mvn install` — damit wird das JAR ins lokale Repository kopiert.',
        '`mvn clean package` — clean leert target/, package führt Assembly und taglist aus.',
        '`mvn assembly:single` — ruft das Assembly-Goal direkt auf.'
      ],
      answer: 2,
      explain: '`mvn test` stoppt vor `package` — kein JAR. `mvn install` funktioniert, aber kopiert das JAR zusätzlich ins lokale Repository (unnötig für Abgabe). `mvn assembly:single` ohne voherigen `package`-Lauf würde `taglist.html` und den JaCoCo-Report nicht finden. `mvn clean package` ist der korrekte, saubere Befehl.' }

  ]
});
