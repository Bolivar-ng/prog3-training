/* Kapitel 01 · Serie S02: PC-Übung – Vektor & Maven-Konvertierung
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben. */
P3.serie({
  id: 'K01-S02',
  kapitel: 'K01',
  titel: 'PC-Übung: Vektor & Maven-Konvertierung',
  beschreibung: 'Fragen zur PC-Übung: Vektor-Klasse (keine berechenbaren Attribute, equals/hashCode, Exceptions, atan2) und Umstieg eines bestehenden Projekts auf Maven (Dependency vs. Plugin, taglist, Lebenszyklus).',
  neu: true,
  themen: [
    { id: 'vektor', name: 'Vektor-Klasse' },
    { id: 'maven', name: 'Maven-Konvertierung' }
  ],
  fragen: [

    /* ========== Vektor-Klasse ========== */

    { id: 'K01-S02-F01', sec: 'vektor', type: 'mc', t: 'Keine berechenbaren Attribute',
      prompt: 'Du hast eine Klasse `Vektor` mit den Attributen `x` und `y`. Das Prinzip „keine berechenbaren Attribute“ bedeutet …',
      options: [
        'Man darf niemals Hilfsattribute anlegen, egal wie aufwendig die Berechnung ist.',
        'Werte, die aus anderen Attributen berechnet werden können (z. B. Betrag, Winkel), speichert man nicht als Attribut — man berechnet sie in der Getter-Methode.',
        'Man speichert alles als Attribut, damit Getter schneller sind.',
        'Berechnungen sind in Java verboten; man muss immer vorberechnete Werte übergeben.'
      ],
      answer: 1,
      explain: 'Wenn man `betrag` als Attribut speichert, muss man es bei jeder x/y-Änderung aktualisieren — eine mögliche Fehlerquelle. Stattdessen: `return Math.sqrt(x*x + y*y)` direkt in `getBetrag()`. Dann kann nichts inkonsistent werden.' },

    { id: 'K01-S02-F02', sec: 'vektor', type: 'mc', t: 'Ausnahme: zwei Konstruktoren',
      prompt: 'Wann ist es ausnahmsweise gerechtfertigt, `betrag` und `phi` als Attribute zu speichern, obwohl sie berechenbar wären?',
      options: [
        'Niemals — die Regel kennt keine Ausnahme.',
        'Immer, weil Attribute schneller sind als Berechnungen.',
        'Wenn die Klasse zwei Konstruktoren hat (kartesisch und polar), um doppelte Rundungsfehler zu vermeiden.',
        'Wenn der Betrag in einem Kommentar erklärt wird.'
      ],
      answer: 2,
      explain: 'Bei zwei Konstruktoren stellt sich die Frage: Was ist die „Wahrheit“? Wenn man nur x,y speichert, verliert man Genauigkeit beim polaren Konstruktor (betrag,phi → x,y → betrag). Wenn man alle vier speichert (`final double x, y, betrag, phi`), entsteht kein doppelter Rundungsfehler. Das muss man aber im JavaDoc erklären.' },

    { id: 'K01-S02-F03', sec: 'vektor', type: 'mc', t: 'getBetrag ohne gespeichertes Attribut',
      prompt: 'Wie implementiert man `getBetrag()` korrekt, wenn man sich an das Prinzip „keine berechenbaren Attribute“ hält?',
      options: [
        '`return this.betrag;`',
        '`return Math.abs(x + y);`',
        '`return Math.sqrt(x * x + y * y);`',
        '`return (x + y) / 2;`'
      ],
      answer: 2,
      explain: 'Der Betrag (Länge) eines Vektors ist nach dem Satz des Pythagoras: √(x² + y²). `Math.abs(x + y)` wäre komplett falsch. Das Attribut `this.betrag` gibt es gar nicht (außer im Ausnahmefall mit zwei Konstruktoren).' },

    { id: 'K01-S02-F04', sec: 'vektor', type: 'mc', t: 'getPhi ohne gespeichertes Attribut',
      prompt: 'Wie berechnet man den Winkel phi (in Bogenmaß) aus x und y?',
      options: [
        '`return Math.atan(y / x);`',
        '`return Math.atan2(y, x);`',
        '`return Math.sin(y / x);`',
        '`return x / y;`'
      ],
      answer: 1,
      explain: '`Math.atan(y/x)` hat zwei Probleme: (1) Division durch 0 wenn x=0, (2) kann den Quadranten nicht unterscheiden (atan gibt nur -90° bis 90° zurück). `Math.atan2(y, x)` kennt beide Parameter, gibt -180° bis 180° zurück und behandelt x=0 korrekt.' },

    { id: 'K01-S02-F05', sec: 'vektor', type: 'mc', t: 'atan vs. atan2',
      prompt: 'Warum ist `Math.atan2(y, x)` besser als `Math.atan(y/x)` für den Winkel eines Vektors?',
      options: [
        '`atan2` ist nur schneller, inhaltlich ist es dasselbe.',
        '`atan2` kennt den Quadranten und behandelt x=0, `atan(y/x)` nicht.',
        '`atan2` gibt das Ergebnis in Grad zurück, `atan` in Bogenmaß.',
        '`atan(y/x)` existiert in Java nicht.'
      ],
      answer: 1,
      explain: 'Vektor (-1, 0) und (1, 0) hätten bei `atan(y/x)` = `atan(0/±1)` = 0 — falsch für den ersten Fall. `atan2(0, -1)` gibt π zurück (180°), `atan2(0, 1)` gibt 0 zurück — korrekt. Außerdem wäre `atan(y/0)` eine Division durch 0.' },

    { id: 'K01-S02-F06', sec: 'vektor', type: 'mc', t: 'Double.compare in equals',
      prompt: 'Warum soll man in `equals()` für `double`-Attribute `Double.compare(a, b) == 0` statt `a == b` verwenden?',
      options: [
        '`==` für doubles ist in Java verboten.',
        'Fließkommazahlen können Rundungsfehler haben; `==` kann dann false liefern, obwohl die Werte „gleich“ sein sollten. `Double.compare` ist dafür besser geeignet.',
        '`Double.compare` ist schneller als `==`.',
        'Bei `double` gibt es keinen Unterschied zwischen beiden.'
      ],
      answer: 1,
      explain: 'Beispiel: `0.1 + 0.2 == 0.3` liefert `false` in Java! `Double.compare(0.1 + 0.2, 0.3) == 0` ist robuster (kein NaN-Problem). Besonders in `equals()` ist das wichtig, weil fehlerhafte Gleichheitsvergleiche subtile Bugs erzeugen.' },

    { id: 'K01-S02-F07', sec: 'vektor', type: 'mc', t: 'instanceof vs getClass in equals',
      prompt: 'Was ist der Unterschied zwischen `instanceof` und `getClass()` in `equals()`?',
      options: [
        '`instanceof` ist schneller, sonst kein Unterschied.',
        '`instanceof` gibt true auch für Unterklassen zurück; `getClass()` ist strenger und gibt nur true zurück, wenn es genau dieselbe Klasse ist.',
        '`getClass()` ist null-sicher, `instanceof` nicht.',
        '`instanceof` prüft nur zur Laufzeit, `getClass()` zur Kompilierzeit.'
      ],
      answer: 1,
      explain: 'Mit `instanceof`: Ein `SpezialVektor extends Vektor` wäre gleich einem `Vektor` — das kann problematisch sein. Mit `getClass()`: Nur genau dieselbe Klasse gilt als gleich. Pattern Matching (`instanceof Vektor o`) ist kürzer und wird akzeptiert. `instanceof` ist übrigens auch null-sicher (null instanceof X = false).' },

    { id: 'K01-S02-F08', sec: 'vektor', type: 'mc', t: 'IllegalStateException vs ArithmeticException',
      prompt: 'Die Methode `orthogonalerEinheitsvektor()` wirft eine Exception, wenn `this` der Nullvektor ist. Welche Exception ist die richtige Wahl?',
      options: [
        '`ArithmeticException`, weil intern eine Division durch 0 stattfindet.',
        '`NullPointerException`, weil der Vektor null ist.',
        '`IllegalStateException`, weil nicht die Parameter falsch sind, sondern der Zustand des Objekts (`this` ist der Nullvektor).',
        '`IllegalArgumentException`, weil das Argument falsch ist.'
      ],
      answer: 2,
      explain: '`orthogonalerEinheitsvektor()` hat gar keine Parameter — es kann also kein Argument falsch sein. Das Problem ist, dass `this` (der aktuelle Vektor) im falschen Zustand ist (Betrag = 0, Division unmöglich). Dafür ist `IllegalStateException` genau richtig. `ArithmeticException` ist für Operationen wie `5 / 0` gedacht, nicht für Objektzustände.' },

    { id: 'K01-S02-F09', sec: 'vektor', type: 'mc', t: 'Orthogonaler Einheitsvektor',
      prompt: 'Der Vektor `(x, y)` hat den Betrag > 0. Welche Formel liefert den orthogonalen Einheitsvektor (90° gegen den Uhrzeigersinn)?',
      options: [
        '`new Vektor(x / betrag, y / betrag)`',
        '`new Vektor(-y / betrag, x / betrag)`',
        '`new Vektor(y / betrag, -x / betrag)`',
        '`new Vektor(-x / betrag, -y / betrag)`'
      ],
      answer: 1,
      explain: 'Ein Vektor um 90° gegen den Uhrzeigersinn drehen: (x, y) → (-y, x). Dann durch den Betrag dividieren, um die Länge auf 1 zu normieren: (-y/|v|, x/|v|). Die andere Richtung (im Uhrzeigersinn) wäre (y/|v|, -x/|v|). Beide Versionen sind korrekt, sofern die Richtung dokumentiert ist.' },

    { id: 'K01-S02-F10', sec: 'vektor', type: 'review', t: 'equals-Implementierung prüfen',
      prompt: 'Prüfe diese `equals()`-Implementierung der Klasse `Vektor`. Welche Befunde treffen zu?',
      code: `@Override
public boolean equals(Object other)
{
    if (this == other) return true;
    if (!(other instanceof Vektor o)) return false;
    return this.x == o.x && this.y == o.y;
}`,
      findings: [
        { text: 'Die `double`-Vergleiche mit `==` sind problematisch; wegen Fließkommafehlern sollte man `Double.compare(this.x, o.x) == 0` benutzen.', correct: true, why: '`0.1 + 0.2 == 0.3` ist in Java `false`. `Double.compare` vergleicht robust und behandelt auch `NaN` sinnvoll.' },
        { text: 'Es fehlt ein passendes `hashCode()`.', correct: true, why: 'Vertrag: Aus `a.equals(b)` muss `a.hashCode() == b.hashCode()` folgen. Ohne `hashCode()` (z. B. `Objects.hash(x, y)`) bricht die Klasse in `HashSet`/`HashMap`.' },
        { text: 'Das Pattern Matching `instanceof Vektor o` ist ein Fehler; man muss `other` erst explizit casten.', correct: false, why: 'Pattern Matching ist seit Java 16 korrekt und wird empfohlen — kein Defekt. Es ist außerdem null-sicher.' },
        { text: 'Die Zeile `if (this == other) return true;` ist überflüssig und sollte entfernt werden.', correct: false, why: 'Sie ist eine korrekte, performante Identitätsprüfung (Kurzschluss für denselben Verweis) — gewollt, kein Fehler.' }
      ],
      explain: 'Zwei echte Mängel: `==` auf `double` und das fehlende `hashCode()`. Pattern Matching und die Identitätsprüfung sind dagegen gute, korrekte Praxis. Der Vertrag: Wenn `a.equals(b)`, dann muss `a.hashCode() == b.hashCode()`.' },

    { id: 'K01-S02-F11', sec: 'vektor', type: 'mc', t: 'toString Delegation',
      prompt: 'Die `Vektor`-Klasse hat `toString(int art)` (art=1: Polarform, art=2: kartesisch) und ein parameterloses `toString()`. Was gibt `toString()` sinnvollerweise zurück?',
      options: [
        'Nur die kartesische Form `(x; y)`.',
        'Nur die Polarform `(Betrag: b, Winkel: w)`.',
        'Die kartesische Form gefolgt von ` = ` gefolgt von der Polarform.',
        'Eine leere Zeichenkette — nur `toString(int)` liefert etwas.'
      ],
      answer: 2,
      explain: '`toString()` ruft `toString(2) + " = " + toString(1)` auf, also z. B. `"(1,00; 1,00) = (Betrag: 1,41, Winkel: 45,00°)"`. So hat man immer beide Darstellungen, wenn man ein Vektor-Objekt druckt. `toString()` delegiert an die parametrisierte Variante — das vermeidet Code-Duplizierung.' },

    /* ========== Maven-Konvertierung ========== */

    { id: 'K01-S02-F12', sec: 'maven', type: 'mc', t: 'Dependency vs. Plugin',
      prompt: 'Was ist der grundlegende Unterschied zwischen einer `<dependency>` und einem `<plugin>` in der pom.xml?',
      options: [
        'Es gibt keinen Unterschied — beides sind Bibliotheken.',
        '`<dependency>` braucht der Build-Prozess (Maven-Phase); `<plugin>` braucht dein Programmcode (import im Java-Code).',
        '`<dependency>` braucht dein Programmcode (taucht in imports auf); `<plugin>` braucht der Build-Prozess (führt Phasen durch).',
        '`<plugin>` wird zur Laufzeit geladen; `<dependency>` zur Kompilierzeit.'
      ],
      answer: 2,
      explain: 'Faustregel: Steht der Name in einem `import` in deiner Java-Datei? → Dependency. Wird es nur von Maven genutzt (taglist, JaCoCo, assembly, exec, javadoc)? → Plugin. Dein Programmcode weiß nichts von Plugins.' },

    { id: 'K01-S02-F13', sec: 'maven', type: 'mc', t: 'Scope "provided"',
      prompt: 'Lombok hat den Scope `provided`. Was bedeutet das?',
      options: [
        'Lombok wird nur für Tests benutzt.',
        'Lombok wird nur zur Kompilierzeit gebraucht (Code-Generierung); im fertigen JAR wird es nicht mitgepackt, weil der generierte Code schon drin ist.',
        'Lombok wird nur zur Laufzeit gebraucht, nicht zum Kompilieren.',
        '`provided` bedeutet, Maven lädt es nicht — man muss es selbst bereitstellen.'
      ],
      answer: 1,
      explain: 'Lombok ist ein Annotation-Prozessor: beim Kompilieren generiert es Getter, Setter, Konstruktoren usw. als Java-Code. Das fertige `.class`-File enthält schon den generierten Code — Lombok selbst ist nicht mehr nötig. Deshalb: `scope=provided`, nicht mitpacken.' },

    { id: 'K01-S02-F14', sec: 'maven', type: 'mc', t: 'taglist-Plugin: Zweck',
      prompt: 'Was macht das `taglist-maven-plugin`?',
      options: [
        'Es fügt Git-Tags zum Projekt hinzu.',
        'Es scannt den Quellcode nach Kommentaren mit einem bestimmten Stichwort (z. B. `// zu erledigen:`) und erstellt eine Liste aller Fundstellen.',
        'Es erstellt JavaDoc-Tags automatisch.',
        'Es prüft die Einrückung des Codes.'
      ],
      answer: 1,
      explain: 'Das Plugin durchsucht alle `.java`-Dateien nach konfigurierten Zeichenketten. Das Ergebnis (Dateiname, Zeilennummer, Kommentartext) landet in `target/taglist-reports/taglist.xml`. So sieht man auf einen Blick alle offenen TODOs, Bugs oder „zu erledigen:“-Punkte im Projekt.' },

    { id: 'K01-S02-F15', sec: 'maven', type: 'mc', t: 'taglist: richtige Phase',
      prompt: 'In welcher Phase soll das `taglist`-Goal des taglist-maven-plugin ausgeführt werden?',
      options: [
        '`compile` — damit man die Liste schon beim Kompilieren hat.',
        '`test` — damit man sieht, was noch getestet werden muss.',
        '`package` — nach dem Kompilieren, wenn alle Quelldateien fertig analysiert werden können.',
        '`deploy` — erst wenn alles fertig ist.'
      ],
      answer: 2,
      explain: 'Die Phase `package` ist Standard für Reports und Analysen. Bei `compile` ist der Quellcode zwar vorhanden, aber andere Analysen (Tests, Reports) laufen noch nicht. `package` stellt sicher, dass alles — Kompilierung und Tests — bereits passiert ist, bevor der Report erstellt wird.' },

    { id: 'K01-S02-F16', sec: 'maven', type: 'mc', t: 'taglist: Konfiguration',
      prompt: 'Welches XML-Element in der taglist-Konfiguration legt fest, nach welchem Stichwort gesucht wird? Gesucht ist das Element an der Stelle `???`.',
      code: `<configuration>
  <tagListOptions><tagClasses><tagClass>
    <tags><tag>
      <???>zu erledigen:</???>
      <matchType>ignoreCase</matchType>
    </tag></tags>
  </tagClass></tagClasses></tagListOptions>
</configuration>`,
      options: ['`matchString`', '`matchType`', '`searchText`', '`tagName`'],
      answer: 0,
      explain: '`<matchString>zu erledigen:</matchString>` ist der exakte Suchtext. `<matchType>ignoreCase</matchType>` bedeutet: Groß-/Kleinschreibung egal — `// Zu Erledigen:` und `// ZU ERLEDIGEN:` werden auch gefunden. Ohne `<tagListOptions>` und `<matchString>` sucht das Plugin nur nach seinen Default-Tags (TODO, FIXME).' },

    { id: 'K01-S02-F17', sec: 'maven', type: 'mc', t: 'Maven ohne Terminal in Eclipse',
      prompt: 'Wie führt man in Eclipse einen Maven-Build aus, wenn man kein Terminal hat?',
      options: [
        'Maven kann in Eclipse nicht ohne Terminal benutzt werden.',
        'Rechtsklick auf das Projekt → Run As → Maven build… → Goals-Feld ausfüllen (z. B. `package`) → Run.',
        'Datei → Build All → Maven.',
        'Man muss zuerst das Terminal-Plugin installieren.'
      ],
      answer: 1,
      explain: 'Eclipse hat Maven eingebaut. Rechtsklick auf das Projekt → „Run As“ → „Maven build…“ öffnet einen Dialog, in dem man das gewünschte Goal (z. B. `clean package`) eintippen kann — kein Terminal nötig. Nach Änderungen an der pom.xml: Rechtsklick → Maven → Update Project.' },

    { id: 'K01-S02-F18', sec: 'maven', type: 'mc', t: 'BUILD SUCCESS vs. WARNING',
      prompt: 'In der Maven-Ausgabe erscheinen mehrere `[WARNING]`-Zeilen, am Ende aber `BUILD SUCCESS`. Was bedeutet das?',
      options: [
        'Das Build ist eigentlich fehlgeschlagen — WARNING und SUCCESS schließen sich aus.',
        'Die Warnings sind kosmetische Hinweise (z. B. fehlende Encoding-Angabe). BUILD SUCCESS heißt: alle Phasen haben funktioniert. Nur `BUILD FAILURE` ist ein echtes Problem.',
        'Man muss alle Warnings beheben, bevor man das Projekt abgeben kann.',
        'Warnings bedeuten, dass Tests übersprungen wurden.'
      ],
      answer: 1,
      explain: 'Typische harmlose Warnings: `[WARNING] Using platform encoding (UTF-8)`, `[WARNING] No project URL defined`, jansi-Meldungen. Diese haben keinen Einfluss auf das Ergebnis. Bei `BUILD FAILURE` hingegen ist etwas schiefgelaufen — dann muss man den Fehler lesen und beheben.' },

    { id: 'K01-S02-F19', sec: 'maven', type: 'mc', t: 'Vorhandenes Projekt → Maven',
      prompt: 'Was sind die wesentlichen Schritte, um ein bestehendes Java-Projekt (z. B. Mathematik/Trigonometrie) auf Maven umzustellen?',
      options: [
        'Man erstellt einfach eine neue pom.xml und kopiert den Quellcode nach `src/main/java` — mehr braucht es nicht.',
        'Man löscht das alte Projekt und erstellt es neu mit einem Maven-Archetype.',
        'Man erstellt eine pom.xml mit GAV und Properties, legt die Maven-Ordnerstruktur an (`src/main/java`, `src/test/java`), verschiebt die Klassen in die richtigen Ordner, fügt Dependencies (JUnit) und Plugins (taglist etc.) hinzu und prüft mit `mvn package`.',
        'Bestandsprojekte können nicht auf Maven umgestellt werden.'
      ],
      answer: 2,
      explain: 'Die wichtigsten Schritte: (1) pom.xml anlegen mit GAV + `maven.compiler.release`, (2) Ordnerstruktur anlegen, (3) Java-Klassen nach `src/main/java/...` (Package-Ordner!), (4) Testklassen nach `src/test/java/...`, (5) Bibliotheken aus dem Build-Path entfernen und als `<dependency>` eintragen, (6) `mvn package` testen.' },

    { id: 'K01-S02-F20', sec: 'maven', type: 'order', t: 'Lebenszyklus bis package',
      prompt: 'Bringe die Maven-Phasen in die richtige Reihenfolge (von der ersten bis zu `package`).',
      items: ['`process-resources`', '`compile`', '`test-compile`', '`test`', '`package`'],
      explain: 'Reihenfolge: process-resources → compile → test-compile → test → package. Wenn man `mvn package` aufruft, laufen alle vorherigen Phasen automatisch zuerst durch — man kann Tests nicht überspringen (außer mit `-DskipTests`, was man aber nicht tun sollte).' }

  ]
});
