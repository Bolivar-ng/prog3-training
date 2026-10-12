/* Kapitel 01 · Serie S01: Maven – Training
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben. */
P3.serie({
  id: 'K01-S01',
  kapitel: 'K01',
  titel: 'Maven – Training',
  beschreibung: 'Grundidee, GAV, Ordnerstruktur, pom.xml, Lebenszyklus, Scopes, Plugins und Goals, typische Fehlermeldungen.',
  neu: true,
  themen: [
    { id: 'grund', name: 'Grundidee und Begriffe' },
    { id: 'pom', name: 'pom.xml und Ordnerstruktur' },
    { id: 'zyklus', name: 'Lebenszyklus' },
    { id: 'dep', name: 'Dependencies und Scopes' },
    { id: 'plug', name: 'Plugins und Goals' },
    { id: 'fehler', name: 'Fehler und Weitergabe' }
  ],
  fragen: [
    /* ---------- Grundidee ---------- */
    { id: 'K01-S01-F01', sec: 'grund', type: 'mc', t: 'Konvention vor Konfiguration',
      prompt: 'Was bedeutet das Maven-Prinzip „Konvention vor Konfiguration“?',
      options: [
        'Jede Einstellung muss explizit in der pom.xml konfiguriert werden, Standards gibt es nicht.',
        'Maven setzt Standards (z. B. Quelltext in `src/main/java`, Tests heißen `…Test`). Wer sich daran hält, muss fast nichts konfigurieren; nur Abweichungen stehen in der pom.xml.',
        'Konventionen stehen in der IDE, Konfigurationen in der pom.xml.',
        'Maven übernimmt automatisch die Projekteinstellungen von Eclipse oder IntelliJ.'
      ],
      answer: 1,
      explain: 'Der Vorteil: Jedes Maven-Projekt sieht gleich aus, jeder findet sofort alles, und die pom.xml bleibt kurz. Abweichen ist möglich (z. B. ein anderer target-Ordner), sollte man aber nicht.' },

    { id: 'K01-S01-F02', sec: 'grund', type: 'match', t: 'Begriffe',
      prompt: 'Ordne jedem Maven-Begriff die passende Erklärung zu.',
      pairs: [
        ['Artefakt', 'das Zielprodukt, meist ein jar-Archiv'],
        ['POM', 'Konfigurationsdatei des Projekts, basiert auf der Super-POM'],
        ['Dependency', 'Zusatzbibliothek, die im Programmcode benutzt wird'],
        ['Plugin', 'Objekt, das eine Phase des Builds durchführt'],
        ['Goal', 'eine Methode eines Plugins, also ein konkreter Befehl'],
        ['Archetype', 'Projektvorlage, vor allem eine fertige pom.xml']
      ],
      explain: 'Besonders oft gefragt: Dependency (braucht dein Programm, steht in den imports) gegen Plugin (braucht der Build-Prozess, dein Code weiß nichts davon).' },

    { id: 'K01-S01-F03', sec: 'grund', type: 'mc', t: '-SNAPSHOT',
      prompt: 'Ein Projekt hat die Version `2.1-SNAPSHOT`. Was sagt das aus?',
      options: [
        'Es ist eine Sicherungskopie (Snapshot) der Version 2.1.',
        'Die Version 2.1 ist noch in Entwicklung und kann sich noch ändern.',
        'Version 2.1 ist fertig veröffentlicht und unveränderlich.',
        'Das Projekt enthält nur Testcode.'
      ],
      answer: 1,
      explain: 'Eine Version ohne `-SNAPSHOT` gilt als Release: einmal veröffentlicht, wird sie nie mehr geändert. Eine SNAPSHOT-Version darf sich ändern. Deshalb gibt es in Eclipse beim Update Project das Häkchen „Force Update of Snapshots/Releases“.' },

    /* ---------- pom.xml und Ordner ---------- */
    { id: 'K01-S01-F04', sec: 'pom', type: 'fill', t: 'Eine pom.xml vervollständigen',
      prompt: 'Vervollständige die pom.xml für das Bankprojekt mit Java 25 und JUnit.',
      code: `<project>
  <modelVersion>4.0.0</modelVersion>
  <[[0]]>de.htw.prog3</…>
  <artifactId>bankprojekt</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <[[1]]>25</…>
  </properties>

  <[[2]]>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>6.1.3</version>
      <scope>[[3]]</scope>
    </dependency>
  </…>
</project>`,
      blanks: [
        { options: ['groupId', 'packageId', 'companyId'], answer: 0, why: 'GAV: **g**roupId, **a**rtifactId, **v**ersion. Die groupId ist der Hersteller, meist die umgedrehte Domain.' },
        { options: ['maven.compiler.release', 'maven.compiler.source', 'java.version'], answer: 0, why: '`maven.compiler.release` legt die Java-Version fest. `source` und `target` sind veraltet und sollen nicht mehr verwendet werden.' },
        { options: ['dependencies', 'libraries', 'plugins'], answer: 0, why: 'Bibliotheken stehen als `<dependency>` innerhalb von `<dependencies>`. `<plugins>` gehört in `<build>` und ist für den Build-Prozess.' },
        { options: ['test', 'compile', 'runtime'], answer: 0, why: 'JUnit wird nur für den Testcode gebraucht. Mit `test` landet es weder im Hauptcode noch im fertigen Produkt.' }
      ],
      explain: 'Die schließenden Tags sind hier mit `</…>` abgekürzt. In der echten pom muss jedes schließende Tag genau zum öffnenden passen (`<groupId>…</groupId>`), sonst meldet Maven „Non-parseable POM“.' },

    { id: 'K01-S01-F05', sec: 'pom', type: 'mc', t: 'Wohin mit dem Bild?',
      prompt: 'Ein Programm soll ein Bild `logo.png` anzeigen und auch als jar auf anderen Rechnern funktionieren. Wohin gehört die Datei, und wie wird sie geladen?',
      options: [
        'Neben die Java-Datei nach `src/main/java`, geladen mit `new File("logo.png")`.',
        'Nach `src/main/resources`, geladen über den Classpath mit `getClass().getResource("/logo.png")`.',
        'Nach `target/classes`, damit sie gleich am richtigen Ort ist.',
        'Irgendwohin, im Programm steht der absolute Pfad `C:\\Users\\…\\logo.png`.'
      ],
      answer: 1,
      explain: '`process-resources` kopiert alles aus `src/main/resources` nach `target/classes`, und `package` packt es mit ins jar. Über den Classpath geladen funktioniert es überall. `target` wird von `mvn clean` gelöscht, und absolute Pfade gibt es nur auf deinem Rechner.' },

    { id: 'K01-S01-F06', sec: 'pom', type: 'review', t: 'Review einer Abgabe',
      prompt: 'Ein Kommilitone gibt sein Maven-Projekt als ZIP ab. Welche Befunde treffen zu?',
      code: `abgabe.zip
├── pom.xml
├── .classpath
├── .project
├── target/
│   ├── classes/...
│   └── bankprojekt-1.0-SNAPSHOT.jar
├── lib/
│   └── junit-jupiter-6.1.3.jar
└── src/
    ├── main/java/bankprojekt/basisdaten/Sparbuch.java
    ├── main/java/bankprojekt/basisdaten/SparbuchTest.java
    └── main/resources/logo.png`,
      findings: [
        { text: '`target` gehört nicht in die Abgabe.', correct: true, why: 'Das erzeugt Maven selbst neu. Weitergabe: nur `src` und `pom.xml`.' },
        { text: '`.classpath` und `.project` gehören nicht in die Abgabe.', correct: true, why: 'Das sind Eclipse-Einstellungen. Ein Maven-Projekt darf nicht von IDE-Einstellungen abhängen.' },
        { text: 'Das JUnit-jar im Ordner `lib` ist überflüssig und falsch gelöst.', correct: true, why: 'Bibliotheken kommen als Dependency in die pom, Maven lädt sie selbst. Keine Bibliotheken von Hand.' },
        { text: '`SparbuchTest.java` liegt im falschen Ordner.', correct: true, why: 'Tests gehören nach `src/test/java/bankprojekt/basisdaten/`. Unter `src/main/java` kompiliert der Test nicht einmal, weil JUnit mit Scope `test` dort unsichtbar ist.' },
        { text: '`logo.png` liegt im falschen Ordner.', correct: false, why: 'Genau richtig: Nicht-Quelltext-Dateien gehören nach `src/main/resources`.' },
        { text: 'Die `pom.xml` gehört nicht in die Abgabe.', correct: false, why: 'Doch, sie ist das Herzstück: Ohne pom weiß niemand, wie das Projekt gebaut wird.' }
      ],
      explain: 'Saubere Abgabe = `pom.xml` + `src` (mit `main/java`, `main/resources`, `test/java`). Alles andere erzeugt Maven oder die IDE selbst.' },

    /* ---------- Lebenszyklus ---------- */
    { id: 'K01-S01-F07', sec: 'zyklus', type: 'order', t: 'Phasen des default-Lebenszyklus',
      prompt: 'Bringe die Phasen des default-Lebenszyklus in die richtige Reihenfolge.',
      items: ['`process-resources`', '`compile`', '`test-compile`', '`test`', '`package`', '`verify`', '`install`', '`deploy`'],
      explain: 'Erst Ressourcen kopieren und Hauptcode übersetzen, dann Tests übersetzen und ausführen, erst danach packen. So entsteht nie ein jar aus ungetestetem Code. `install` legt das Paket ins lokale, `deploy` ins entfernte Repository.' },

    { id: 'K01-S01-F08', sec: 'zyklus', type: 'multi', t: 'Was läuft bei mvn test?',
      prompt: 'Du gibst `mvn test` ein. Welche Phasen werden ausgeführt?',
      options: ['`process-resources`', '`compile`', '`test-compile`', '`test`', '`package`', '`install`', '`clean`'],
      answer: [0, 1, 2, 3],
      explain: '`mvn <phase>` führt den default-Lebenszyklus **von Beginn an bis einschließlich** dieser Phase aus. `package` und `install` kommen danach. `clean` gehört zu einem eigenen Lebenszyklus und läuft nur, wenn man es angibt: `mvn clean test`.' },

    { id: 'K01-S01-F09', sec: 'zyklus', type: 'mc', t: 'Ein Test schlägt fehl',
      prompt: 'Im Projekt schlägt ein Test fehl. Du führst `mvn package` aus. Was passiert?',
      options: [
        'Das jar wird erzeugt, Maven gibt nur eine Warnung aus.',
        'Der Build bricht in der Phase `test` mit BUILD FAILURE ab, `package` wird nicht mehr ausgeführt, es entsteht kein neues jar.',
        'Maven überspringt den fehlerhaften Test und packt den Rest.',
        'Maven führt `package` zuerst aus und testet danach.'
      ],
      answer: 1,
      explain: 'Genau das ist der Sinn des Lebenszyklus: Niemand kann ungetesteten Code verpacken. Kleine Falle: Liegt von einem früheren Build noch ein jar in `target`, bleibt dieses alte jar liegen. Darum baut man oft mit `mvn clean package`.' },

    { id: 'K01-S01-F10', sec: 'zyklus', type: 'mc', t: 'install oder deploy?',
      prompt: 'Du willst dein Projekt `bankprojekt` als Bibliothek in einem anderen Projekt auf **deinem eigenen Rechner** als Dependency benutzen. Welche Phase brauchst du?',
      options: [
        '`package`: Das jar in `target` wird automatisch gefunden.',
        '`install`: Das Paket landet im lokalen Maven-Repository (`~/.m2/repository`) und kann über seine GAV eingebunden werden.',
        '`deploy`: Nur so kann ein anderes Projekt es finden.',
        '`verify`: Damit wird es freigegeben.'
      ],
      answer: 1,
      explain: 'Dependencies sucht Maven zuerst im lokalen Repository, dann im entfernten. `deploy` lädt in ein entferntes Repository hoch, damit **andere** es bekommen. Für den eigenen Rechner reicht `install`.' },

    /* ---------- Dependencies ---------- */
    { id: 'K01-S01-F11', sec: 'dep', type: 'match', t: 'Welcher Scope?',
      prompt: 'Ordne jeder Bibliothek den passenden Scope zu.',
      pairs: [
        ['JUnit, nur von den Testklassen benutzt', 'test'],
        ['Gson, im Hauptcode mit `import com.google.gson.Gson;` benutzt', 'compile'],
        ['JDBC-Treiber: Der Code benutzt nur `java.sql`, der Treiber wird erst beim Ausführen geladen', 'runtime']
      ],
      explain: '`compile` (Standard, wenn kein Scope dasteht): immer verfügbar. `test`: nur für `src/test`. `runtime`: zum Kompilieren nicht nötig, weil der Code nur die Schnittstellen aus dem JDK benutzt, aber beim Ausführen.' },

    { id: 'K01-S01-F12', sec: 'dep', type: 'mc', t: 'Test im falschen Ordner',
      prompt: 'Schwer: `SparbuchTest.java` liegt aus Versehen unter `src/main/java`. JUnit ist korrekt mit `<scope>test</scope>` eingetragen. Was passiert bei `mvn test`?',
      options: [
        'Der Test läuft ganz normal, Maven findet Tests überall.',
        'Der Test wird stillschweigend übersprungen, sonst läuft alles.',
        'Schon die Phase `compile` scheitert mit `package org.junit.jupiter.api does not exist`: Für den Hauptcode ist eine test-Dependency unsichtbar.',
        'Maven verschiebt die Datei automatisch nach `src/test/java`.'
      ],
      answer: 2,
      explain: 'Alles unter `src/main/java` übersetzt die Phase `compile`, und dort steht JUnit wegen des Scopes `test` nicht zur Verfügung. Genau das soll der Scope sicherstellen: Testbibliotheken landen nie im Produktivcode.' },

    /* ---------- Plugins ---------- */
    { id: 'K01-S01-F13', sec: 'plug', type: 'mc', t: 'Plugin, Goal, Konfiguration',
      prompt: 'Welche Analogie aus der Objektorientierung beschreibt Plugin, Goal und `<configuration>` richtig?',
      options: [
        'Plugin = Klasse, Goal = Attribut, Konfiguration = Konstruktor.',
        'Plugin = Objekt, Goal = Methode dieses Objekts, Konfiguration = Parameter der Methode.',
        'Plugin = Package, Goal = Klasse, Konfiguration = Import.',
        'Plugin = Methode, Goal = Rückgabewert, Konfiguration = Exception.'
      ],
      answer: 1,
      explain: 'Beispiel: Das Plugin `maven-assembly-plugin` hat das Goal `single`. Was es einpackt, steht in der `<configuration>`, so wie Parameter einer Methode sagen, womit sie arbeitet.' },

    { id: 'K01-S01-F14', sec: 'plug', type: 'fill', t: 'Ein Goal an eine Phase hängen',
      prompt: 'Das Assembly-Plugin soll beim Packen automatisch ein Archiv mit den Quelltexten bauen. Vervollständige die execution.',
      code: `<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-assembly-plugin</artifactId>
  <version>3.7.1</version>
  <[[0]]>
    <execution>
      <id>quelltexte</id>
      <[[1]]>package</…>
      <goals>
        <goal>[[2]]</goal>
      </goals>
    </execution>
  </…>
</plugin>`,
      blanks: [
        { options: ['executions', 'dependencies', 'phases'], answer: 0, why: 'Einzelne Ausführungen eines Plugins stehen als `<execution>` in `<executions>`.' },
        { options: ['phase', 'goal', 'scope'], answer: 0, why: '`<phase>` legt fest, **wann** das Goal läuft: hier beim Packen.' },
        { options: ['single', 'package', 'assembly'], answer: 0, why: 'Das Goal (die Methode) des Assembly-Plugins heißt `single`. `package` ist die Phase, nicht das Goal.' }
      ],
      explain: 'Schließende Tags sind mit `</…>` abgekürzt. Ohne `<phase>` müsste man das Goal von Hand aufrufen: `mvn assembly:single@quelltexte`. Laufen mehrere Goals in derselben Phase, entscheidet die Reihenfolge in der pom.xml.' },

    { id: 'K01-S01-F15', sec: 'plug', type: 'input', t: 'Nur JavaDoc erzeugen',
      prompt: 'In der pom ist das `maven-javadoc-plugin` eingetragen, ohne `<executions>`. Mit welchem Befehl führst du in der Konsole nur dessen Goal `javadoc` aus? Tippe den kürzesten Befehl.',
      code: `<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-javadoc-plugin</artifactId>
  <version>3.12.0</version>
  <configuration>
    <show>protected</show>
  </configuration>
</plugin>`,
      answers: ['mvn javadoc:javadoc', 'mvn org.apache.maven.plugins:maven-javadoc-plugin:3.12.0:javadoc', 'mvn org.apache.maven.plugins:maven-javadoc-plugin:javadoc'],
      explain: 'Allgemein: `mvn groupId:artifactId:version:goal@executionId`. Für Plugins von `org.apache.maven.plugins` gibt es die Kurzform `präfix:goal`, hier `javadoc:javadoc`. `@executionId` entfällt, weil es keine execution gibt. `<show>protected</show>` heißt: Dokumentiert wird alles ab protected.' },

    /* ---------- Fehler ---------- */
    { id: 'K01-S01-F16', sec: 'fehler', type: 'bug', t: 'Fehler in der pom.xml',
      prompt: 'Diese pom.xml funktioniert, ist aber nicht korrekt. Markiere die zwei Zeilen mit veralteten Angaben und die Zeile, nach der eine Angabe fehlt. Erkläre danach.',
      code: `<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>de.htw.prog3</groupId>
  <artifactId>bankprojekt</artifactId>
  <version>1.0-SNAPSHOT</version>
  <properties>
    <maven.compiler.source>25</maven.compiler.source>
    <maven.compiler.target>25</maven.compiler.target>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>6.1.3</version>
    </dependency>
  </dependencies>
</project>`,
      required: [7, 8, 14], extra: [15],
      model: `Zeilen 7 und 8: maven.compiler.source und maven.compiler.target sind veraltet. Richtig ist eine Zeile <maven.compiler.release>25</maven.compiler.release>.
Nach Zeile 14 fehlt <scope>test</scope>. Ohne Scope gilt compile: JUnit wäre auch im Hauptcode benutzbar und würde mit ausgeliefert, obwohl es nur für die Tests gebraucht wird.`,
      explain: 'Beides fällt beim Bauen nicht sofort auf, genau deshalb sind es typische Prüfungsfragen.' },

    { id: 'K01-S01-F17', sec: 'fehler', type: 'match', t: 'Fehlermeldung → Ursache',
      prompt: 'Ordne jeder Fehlermeldung die Ursache zu.',
      pairs: [
        ['`COMPILATION ERROR: package … does not exist`', 'Dependency fehlt in der pom.xml'],
        ['`Could not resolve dependencies`', 'GAV vertippt oder Version existiert nicht'],
        ['`Non-parseable POM`', 'XML kaputt: Tags falsch verschachtelt oder nicht geschlossen'],
        ['`release version 25 not supported`', 'Maven läuft mit einem älteren JDK als in der pom verlangt'],
        ['Tests werden nicht ausgeführt', 'Testklasse heißt nicht …Test oder liegt nicht unter src/test'],
        ['`ClassNotFoundException` beim javafx-Plugin', 'mainClass ohne Package, mit .java oder mit / angegeben']
      ],
      explain: 'Bei „release version 25 not supported“ in Eclipse: Unter *Installed JREs* steht oft noch das mitgelieferte Java 21 als Standard. Maven-Builds in Eclipse benutzen dieses JDK, nicht JAVA_HOME.' },

    { id: 'K01-S01-F18', sec: 'fehler', type: 'explain', t: 'Warum alles in die pom?',
      prompt: 'Laut Vorlesung dürfen in einem Maven-Projekt keine Bibliotheken über die IDE hinzugefügt und keine absoluten Pfade benutzt werden. Erkläre, warum, und was stattdessen gilt.',
      model: `Das Projekt muss auf jedem Rechner und in jeder IDE (oder ganz ohne IDE auf der Konsole) gleich gebaut werden können. Weitergegeben werden nur src und pom.xml. Eine Bibliothek, die über Eclipse eingebunden wurde, steht nur in den Eclipse-Dateien (.classpath) und fehlt bei allen anderen. Ein absoluter Pfad wie C:\\Users\\boliv\\… existiert auf keinem anderen Rechner.
Stattdessen: Bibliotheken als <dependency> mit GAV in die pom.xml (Maven lädt sie selbst), Einstellungen wie die Java-Version als <properties> in die pom.xml, Dateien relativ über die Konventionsordner (src/main/resources) und den Classpath laden.` }
  ]
});
