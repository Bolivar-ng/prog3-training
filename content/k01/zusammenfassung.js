/* Kapitel 01 · Zusammenfassung Maven (eigene Formulierungen, keine Folienkopien) */
P3.zusammenfassung('K01', 'K01 · Maven', `
<p><strong>Maven</strong> ist ein Build-Management-Tool. Es automatisiert die Schritte vom Quelltext zum fertigen Produkt: <strong>Anlegen → Kompilieren → Testen → Packen → Verteilen</strong>. Diese feste Abfolge heißt <strong>Lebenszyklus</strong>.</p>

<div class="box merke"><b>Grundidee: Konvention vor Konfiguration</b>Wer sich an die Standards hält (Ordnerstruktur, Testnamen …), muss fast nichts einstellen. Alles, was abweicht, steht in der <code>pom.xml</code>, nie in der IDE.</div>

<h2>Warum Maven?</h2>
<ul>
<li>Alles liegt immer am gleichen Ort, niemand muss suchen.</li>
<li>Kein Schritt kann vergessen werden: <code>mvn package</code> führt die Tests <strong>immer</strong> vorher aus.</li>
<li>Alle Einstellungen stehen zentral im Projekt, nicht lokal auf einem Rechner. Das Projekt läuft in Eclipse, IntelliJ und auf der Konsole gleich.</li>
</ul>

<h2>Einrichtung</h2>
<ul>
<li>Maven <strong>mindestens 3.9.2</strong> (auf dem Mac nicht 3.9.7). Ältere Versionen finden z. B. keine JUnit-5/6-Tests.</li>
<li><code>JAVA_HOME</code> zeigt auf den JDK-Ordner (z. B. <code>C:\\Program Files\\Java\\jdk-25</code>), nicht auf <code>bin</code>.</li>
<li>Für die Konsole: Maven-Ordner <code>bin</code> in den PATH. <code>mvn -v</code> zeigt Maven-Version <strong>und</strong> das benutzte Java.</li>
<li>Eclipse: <em>Preferences → Maven → Installations</em> (eigene Maven-Version) und <em>Java → Installed JREs</em> (JDK 25 als Standard). Maven-Builds in Eclipse benutzen das JDK aus Eclipse, nicht JAVA_HOME.</li>
</ul>

<h2>Projekt anlegen: Archetype und GAV</h2>
<p>Ein <strong>Archetype</strong> ist eine Projektvorlage (vor allem eine fertige pom.xml). Konsole: <code>mvn archetype:generate</code>, einfachste Vorlage: <code>maven-archetype-quickstart</code>. In Eclipse: <em>New → Maven Project</em>, ggf. „Create a simple project“.</p>
<table>
<tr><th>GAV</th><th>Bedeutung</th><th>Beispiel</th></tr>
<tr><td>groupId</td><td>Hersteller, meist umgedrehte Domain</td><td><code>de.htw.prog3</code></td></tr>
<tr><td>artifactId</td><td>Name des Produkts</td><td><code>bankprojekt</code></td></tr>
<tr><td>version</td><td>Versionsnummer</td><td><code>1.0-SNAPSHOT</code></td></tr>
</table>
<p>Die drei Angaben zusammen identifizieren ein Projekt, eine Bibliothek oder ein Plugin <strong>eindeutig</strong>. <code>-SNAPSHOT</code> heißt: noch in Entwicklung, kann sich ändern.</p>

<h2>Ordnerstruktur</h2>
<pre><code>projekt/
├── pom.xml
├── src/main/java        Quelltext
├── src/main/resources   andere Dateien (Bilder, Texte, Konfiguration)
├── src/test/java        Testklassen
└── target/              nur Maven schreibt hier (classes/, das jar)</code></pre>
<ul>
<li><code>target</code> wird von Maven erzeugt und von <code>mvn clean</code> gelöscht. Nie von Hand ändern, nie abgeben.</li>
<li>Bilder usw. gehören nach <code>src/main/resources</code>. Die Phase <code>process-resources</code> kopiert sie nach <code>target/classes</code>; im Programm lädt man sie über den Classpath: <code>getClass().getResource("/bild.jpg")</code>.</li>
<li>Testklassen liegen unter <code>src/test/java</code>, im selben Package wie die getestete Klasse, und heißen <code>…Test</code>.</li>
</ul>

<h2>Die pom.xml</h2>
<pre><code>&lt;project&gt;
  &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
  &lt;groupId&gt;de.htw.prog3&lt;/groupId&gt;
  &lt;artifactId&gt;bankprojekt&lt;/artifactId&gt;
  &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;

  &lt;properties&gt;
    &lt;maven.compiler.release&gt;25&lt;/maven.compiler.release&gt;
    &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
  &lt;/properties&gt;

  &lt;dependencies&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
      &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
      &lt;version&gt;6.1.3&lt;/version&gt;
      &lt;scope&gt;test&lt;/scope&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;

  &lt;build&gt;&lt;plugins&gt; … &lt;/plugins&gt;&lt;/build&gt;
&lt;/project&gt;</code></pre>
<ul>
<li>Jede pom erbt von der <strong>Super-POM</strong> (Standard-Plugins, zentrales Repository). Man schreibt nur, was abweicht.</li>
<li><code>maven.compiler.release</code> legt die Java-Version fest. <code>maven.compiler.source</code>/<code>target</code> sind <strong>veraltet</strong>.</li>
<li>Ohne Angabe kompiliert Maven für eine sehr alte Java-Version. Moderner Code (<code>switch</code> mit <code>-&gt;</code>, Pattern-instanceof, <code>_</code> als Variable) kompiliert dann nicht mehr.</li>
<li>Eigene Properties: <code>&lt;meinWert&gt;42&lt;/meinWert&gt;</code>, verwendbar als <code>\${meinWert}</code>.</li>
</ul>

<h2>Der Lebenszyklus</h2>
<table>
<tr><th>Phase (default)</th><th>Was passiert</th></tr>
<tr><td><code>process-resources</code></td><td>kopiert <code>src/main/resources</code> nach <code>target/classes</code></td></tr>
<tr><td><code>compile</code></td><td>übersetzt den Quelltext</td></tr>
<tr><td><code>test-compile</code></td><td>übersetzt die Tests</td></tr>
<tr><td><code>test</code></td><td>führt die Tests aus</td></tr>
<tr><td><code>package</code></td><td>verpackt, z. B. als jar</td></tr>
<tr><td><code>verify</code></td><td>weitere Qualitätsprüfungen</td></tr>
<tr><td><code>install</code></td><td>ins <strong>lokale</strong> Repository (<code>~/.m2/repository</code>)</td></tr>
<tr><td><code>deploy</code></td><td>in ein <strong>entferntes</strong> Repository, für andere zugänglich</td></tr>
</table>
<div class="box achtung"><b>Wichtigste Regel</b><code>mvn &lt;phase&gt;</code> führt den default-Lebenszyklus <strong>von Beginn an bis einschließlich dieser Phase</strong> aus. Scheitert ein Test, bricht der Build ab: Bei <code>mvn package</code> entsteht dann kein neues jar.</div>
<p>Zwei weitere Lebenszyklen: <code>clean</code> (löscht <code>target</code>) und <code>site</code> (Dokumentation). Mehrere Angaben hintereinander sind möglich: <code>mvn clean package</code>.</p>

<h2>Dependencies</h2>
<p>Ohne Maven: jar selbst herunterladen und bei <code>javac</code> und <code>java</code> mit <code>-classpath .;bibliothek.jar</code> angeben, dem ganzen Team Bescheid sagen. Mit Maven: GAV in die pom, Maven lädt die Bibliothek aus dem zentralen Repository (Maven Central) und setzt alle Pfade.</p>
<table>
<tr><th>Scope</th><th>Wann gebraucht</th><th>Beispiel</th></tr>
<tr><td><code>compile</code> (Standard)</td><td>immer</td><td>Bibliothek, die der Hauptcode importiert (Gson, JavaFX)</td></tr>
<tr><td><code>test</code></td><td>nur für Testcode</td><td>JUnit, Mockito</td></tr>
<tr><td><code>runtime</code></td><td>nur zur Laufzeit, nicht zum Kompilieren</td><td>JDBC-Treiber</td></tr>
</table>
<p><code>junit-jupiter</code> = <code>junit-jupiter-api</code> (Annotationen, Assertions) + <code>-params</code> (parametrisierte Tests) + <code>-engine</code> (führt die Tests aus).</p>
<div class="box merke"><b>Merke</b>Keine Bibliotheken mehr „von Hand“ in den Classpath, immer als Dependency in die pom.xml. <strong>Dependency</strong> = braucht dein Programm (taucht im Code auf). <strong>Plugin</strong> = braucht der Build-Prozess.</div>

<h2>Plugins und Goals</h2>
<ul>
<li><strong>Plugin</strong> = Teilprogramm, das eine Phase durchführt; genau: ein <strong>Objekt</strong> einer Klasse.</li>
<li><strong>Goal</strong> = ein Befehl an das Plugin; genau: eine <strong>Methode</strong> dieses Objekts. Die <code>&lt;configuration&gt;</code> sind ihre Parameter.</li>
<li>In der pom kann man Standard-Plugins anders einstellen, durch andere Versionen ersetzen oder zusätzliche Plugins in Phasen einhängen.</li>
</ul>
<pre><code>&lt;plugin&gt;
  &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
  &lt;artifactId&gt;maven-assembly-plugin&lt;/artifactId&gt;
  &lt;version&gt;3.7.1&lt;/version&gt;
  &lt;configuration&gt; … &lt;/configuration&gt;     für alle executions
  &lt;executions&gt;
    &lt;execution&gt;
      &lt;id&gt;quelltexte&lt;/id&gt;
      &lt;phase&gt;package&lt;/phase&gt;              WANN
      &lt;goals&gt;&lt;goal&gt;single&lt;/goal&gt;&lt;/goals&gt;   WELCHE Methode
    &lt;/execution&gt;
  &lt;/executions&gt;
&lt;/plugin&gt;</code></pre>
<p>Mehrere Goals in derselben Phase laufen in der Reihenfolge der pom.xml.</p>
<table>
<tr><th>Plugin</th><th>Goal</th><th>Zweck</th></tr>
<tr><td><code>maven-assembly-plugin</code></td><td><code>single</code></td><td>packt gewünschte Dateien zu einem Archiv (z. B. <code>src</code> + <code>pom.xml</code> als zip)</td></tr>
<tr><td><code>javafx-maven-plugin</code> (<code>org.openjfx</code>)</td><td><code>run</code></td><td>startet die Klasse aus <code>&lt;mainClass&gt;</code>, vollqualifiziert mit Punkten: <code>spielereien.KontenSpielereien</code></td></tr>
<tr><td><code>maven-javadoc-plugin</code></td><td><code>javadoc</code></td><td>erzeugt die JavaDoc, <code>&lt;show&gt;protected&lt;/show&gt;</code> = ab protected</td></tr>
</table>

<h2>Aufrufen</h2>
<ul>
<li><code>mvn compile</code>, <code>mvn test</code>, <code>mvn package</code>: default-Lebenszyklus bis zu dieser Phase.</li>
<li><code>mvn clean</code>, <code>mvn site</code>: die anderen Lebenszyklen.</li>
<li><code>mvn groupId:artifactId:version:goal@executionId</code>: ein einzelnes Goal. Meist abgekürzt: <code>mvn javadoc:javadoc</code>. <code>@executionId</code> entfällt, wenn es keine passende execution gibt.</li>
<li>Eclipse: <em>Run As → Maven build…</em>, unter „Goals“ eintragen. Nach pom-Änderungen: <em>Maven → Update Project</em>.</li>
<li>IntelliJ: Maven-Fenster rechts. Die echte Fehlermeldung erst durch Klick auf den fehlgeschlagenen Schritt.</li>
</ul>

<h2>Weitergabe und Abgabe</h2>
<p>Keine IDE-spezifischen Einstellungen, keine Bibliotheken über die IDE, keine absoluten Pfade. <strong>Alles gehört in die pom.xml. Weitergabe: nur <code>src</code> und <code>pom.xml</code>.</strong></p>

<h2>Typische Fehler</h2>
<table>
<tr><th>Meldung / Symptom</th><th>Ursache</th></tr>
<tr><td><code>package … does not exist</code></td><td>Dependency fehlt in der pom (oder Testbibliothek wird im Hauptcode benutzt)</td></tr>
<tr><td>Tests werden nicht ausgeführt</td><td>nicht unter <code>src/test</code>, Klasse heißt nicht <code>…Test</code>, Maven älter als 3.9.2</td></tr>
<tr><td><code>Could not resolve dependencies</code></td><td>GAV vertippt, Version existiert nicht</td></tr>
<tr><td><code>Non-parseable POM</code></td><td>XML kaputt: Tags falsch verschachtelt oder nicht geschlossen</td></tr>
<tr><td><code>release version 25 not supported</code></td><td>Maven läuft mit älterem JDK als in der pom verlangt</td></tr>
<tr><td><code>ClassNotFoundException</code> (JavaFX-Plugin)</td><td><code>mainClass</code> falsch: ohne Package, mit <code>.java</code>/<code>.class</code>, mit <code>/</code>, mit <code>src/main/java</code></td></tr>
<tr><td><code>class file version 55.0 … up to 52.0</code></td><td>altes Java (52 = Java 8) im PATH bzw. JAVA_HOME</td></tr>
<tr><td><code>maven.compiler.release</code> wirkt nicht</td><td>Maven älter als 3.9.2</td></tr>
<tr><td><code>NoClassDefFoundError: …doxia…</code></td><td>Maven älter als 3.9.2</td></tr>
</table>
`);
