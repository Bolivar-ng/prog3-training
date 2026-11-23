/* Kapitel 07 · Zusammenfassung Funktionale Interfaces und Streams
   Eigene Formulierungen und Beispiele, keine Folienkopien. Alle Ausgaben mit Java geprüft. */
P3.zusammenfassung('K07', 'K07 · Funktionale Interfaces und Streams', `
<p>Streams arbeiten fast nur mit <strong>Lambda-Ausdrücken</strong>, und jedes Lambda braucht als Typ ein <strong>funktionales Interface</strong>. Wer die wichtigsten funktionalen Interfaces der Standardbibliothek <strong>im Kopf</strong> hat, versteht später jede Stream-Methode auf einen Blick.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Typische Frage: „In einem Programm steht <code>x = …Lambda…;</code> Welchen Datentyp könnte <code>x</code> haben?“ Mehrere Antworten können richtig sein, auch „keiner davon“. Dafür musst du für jedes Interface wissen: <strong>Wie viele Parameter gehen rein, was kommt raus?</strong> Bei Streams: Ist eine Methode intermediate oder terminal? Was gibt eine Kette aus (lazy, Element für Element)? Was liefert <code>reduce</code> bzw. ein Collector?</div>

<h2>1. Wiederholung: Interface</h2>
<p>Ein <strong>Interface</strong> ist ein Vertrag: Es legt fest, <strong>welche</strong> Methoden ein Objekt hat (Signatur + JavaDoc), aber nicht, <strong>wie</strong> sie arbeiten. Eine Klasse, die das Interface implementiert, liefert den Code dazu. Variablen und Parameter können den Interface-Typ haben. Dann passt jedes Objekt hinein, das den Vertrag erfüllt.</p>

<h2>2. Was ist ein funktionales Interface?</h2>
<p>Ein Interface mit <strong>genau einer abstrakten Methode</strong>. Nur dann kann ein Lambda es implementieren: Das Lambda <em>ist</em> der Rumpf dieser einen Methode.</p>
<ul>
<li><code>default</code>- und <code>static</code>-Methoden dürfen zusätzlich dabei sein, sie zählen nicht mit.</li>
<li>Abstrakte Methoden, die es schon in <code>Object</code> gibt (z. B. <code>equals</code> in <code>Comparator</code>), zählen auch nicht mit.</li>
<li><code>@FunctionalInterface</code> ist freiwillig: Der Compiler meldet dann einen Fehler, wenn es nicht genau eine abstrakte Methode gibt.</li>
</ul>
<pre><code>@FunctionalInterface
public interface Pruefer {
    boolean pruefe(String s);                 // die eine abstrakte Methode
    default Pruefer nicht() { return s -> !pruefe(s); }   // zählt nicht mit
}
Pruefer leer = s -> s.isEmpty();              // das Lambda wird zu pruefe(...)
System.out.println(leer.pruefe(""));          // true</code></pre>

<h2>3. Die wichtigsten Interfaces aus <code>java.util.function</code></h2>
<table>
<tr><th>Interface</th><th>Methode</th><th>rein → raus</th><th>Beispiel</th></tr>
<tr><td><code>Runnable</code> (java.lang)</td><td><code>run()</code></td><td>nichts → nichts</td><td><code>() -> System.out.println("los")</code></td></tr>
<tr><td><code>Supplier&lt;T&gt;</code></td><td><code>get()</code></td><td>nichts → T</td><td><code>() -> "Hallo"</code></td></tr>
<tr><td><code>Consumer&lt;T&gt;</code></td><td><code>accept(t)</code></td><td>T → nichts</td><td><code>s -> System.out.println(s)</code></td></tr>
<tr><td><code>Function&lt;T, R&gt;</code></td><td><code>apply(t)</code></td><td>T → R</td><td><code>s -> s.length()</code></td></tr>
<tr><td><code>Predicate&lt;T&gt;</code></td><td><code>test(t)</code></td><td>T → boolean</td><td><code>s -> s.isEmpty()</code></td></tr>
<tr><td><code>UnaryOperator&lt;T&gt;</code></td><td><code>apply(t)</code></td><td>T → T</td><td><code>s -> s.trim()</code></td></tr>
<tr><td><code>BinaryOperator&lt;T&gt;</code></td><td><code>apply(a, b)</code></td><td>T, T → T</td><td><code>(a, b) -> a + b</code></td></tr>
<tr><td><code>Comparator&lt;T&gt;</code> (java.util)</td><td><code>compare(a, b)</code></td><td>T, T → int</td><td><code>(a, b) -> a.length() - b.length()</code></td></tr>
</table>
<p>Dazu gibt es <strong>Bi-Varianten</strong> mit zwei Parametern verschiedener Typen: <code>BiFunction&lt;T, U, R&gt;</code>, <code>BiPredicate&lt;T, U&gt;</code>, <code>BiConsumer&lt;T, U&gt;</code>. Für <strong>drei</strong> Parameter gibt es kein Standard-Interface.</p>
<div class="box merke"><b>Merke</b><code>UnaryOperator&lt;T&gt;</code> ist eine <code>Function&lt;T, T&gt;</code>, und <code>BinaryOperator&lt;T&gt;</code> ist eine <code>BiFunction&lt;T, T, T&gt;</code>, also Spezialfälle mit „alles derselbe Typ“.</div>

<h2>4. So findest du den passenden Typ in 3 Schritten</h2>
<ol>
<li><strong>Parameter zählen:</strong> 0 → Runnable/Supplier · 1 → Consumer/Function/Predicate/UnaryOperator · 2 → BinaryOperator/Comparator/Bi… · 3 → keiner.</li>
<li><strong>Rückgabe ansehen:</strong> nichts (<code>println</code>) · boolean (<code>a > b</code>, <code>startsWith</code>) · int (<code>a - b</code>, <code>length()</code>) · derselbe Typ wie die Parameter · ein anderer Typ.</li>
<li><strong>Typparameter prüfen:</strong> Passen die Typen in den spitzen Klammern? <code>s.concat(t)</code> liefert String, also <code>BinaryOperator&lt;String&gt;</code>, aber nicht <code>Comparator&lt;String&gt;</code> (der will <code>int</code>).</li>
</ol>
<pre><code>(s, t) -> s.length() - t.length()   // 2 Strings → int      → Comparator&lt;String&gt;
s -> s.startsWith("A")              // String → boolean     → Predicate&lt;String&gt;, Function&lt;String, Boolean&gt;
(a, b) -> a - b                     // 2 Integer → int      → Comparator&lt;Integer&gt;, BinaryOperator&lt;Integer&gt;
(a, b) -> a > b                     // 2 Integer → boolean  → BiPredicate (Comparator/BinaryOperator nicht!)</code></pre>
<p>Ein Lambda kann zu <strong>mehreren</strong> Typen passen. Welcher es wird, entscheidet die Variable links („Zieltyp“). Ohne Zieltyp geht es nicht: <code>var x = s -> s.trim();</code> kompiliert nicht.</p>

<div class="box achtung"><b>Consumer nur bei „nichts zurück“</b>Streng genommen akzeptiert der Compiler auch <code>Consumer&lt;String&gt; c = s -> s.toLowerCase();</code>, weil das Ergebnis eines Methodenaufrufs einfach verworfen werden darf. In den Übungsaufgaben zählt das aber als <strong>falsch</strong>: Gemeint ist der Typ, der zur Absicht des Lambdas passt. <strong>Consumer und Runnable nur, wenn das Lambda nichts liefert</strong>, z. B. <code>println</code>.</div>

<h2>5. Lambda aufrufen</h2>
<p>Ein Lambda ist ein Objekt. Man ruft es über die <strong>Methode des Interfaces</strong> auf, nicht über den Variablennamen:</p>
<pre><code>Function&lt;String, Integer&gt; laenge = s -> s.length();
Predicate&lt;Integer&gt; gross = n -> n > 3;
System.out.println(laenge.apply("Java"));            // 4
System.out.println(gross.test(laenge.apply("Hi")));   // false</code></pre>
<p>Kurzform <strong>Methodenreferenz</strong>: Ruft ein Lambda nur eine Methode auf, kann man <code>String::toLowerCase</code> statt <code>s -> s.toLowerCase()</code> schreiben, oder <code>System.out::println</code> statt <code>s -> System.out.println(s)</code>.</p>

<h2>6. Streams: die Idee</h2>
<p>Ein <strong>Stream</strong> ist ein Fließband für die Elemente einer Collection. Man stellt Stationen auf (filtern, umwandeln, sortieren …) und am Ende <strong>eine</strong> Station, die ein Ergebnis liefert. Streams <strong>ersetzen Schleifen</strong>: Man schreibt nur noch, was mit <em>einem</em> Element passiert.</p>
<pre><code>// Schleife                               // Stream
List&lt;String&gt; erg = new ArrayList&lt;&gt;();     List&lt;String&gt; erg = namen.stream()
for (String s : namen)                          .filter(s -&gt; s.length() &gt; 3)   // Predicate
    if (s.length() &gt; 3)                         .map(s -&gt; s.toUpperCase())     // Function
        erg.add(s.toUpperCase());               .toList();</code></pre>
<table>
<tr><th>Art</th><th>liefert</th><th>Beispiele</th></tr>
<tr><td><strong>intermediate</strong></td><td>wieder einen <code>Stream</code> → weiterketten</td><td><code>filter</code>, <code>map</code>, <code>flatMap</code>, <code>sorted</code>, <code>distinct</code>, <code>limit</code>, <code>skip</code>, <code>takeWhile</code>, <code>dropWhile</code></td></tr>
<tr><td><strong>terminal</strong></td><td>etwas anderes → Ende der Kette</td><td><code>forEach</code>, <code>count</code>, <code>toList</code>, <code>anyMatch</code>, <code>findFirst</code>, <code>max</code>, <code>reduce</code>, <code>collect</code></td></tr>
</table>
<div class="box merke"><b>Faustregel</b>Rückgabetyp <code>Stream</code> → intermediate, alles andere → terminal.</div>

<h2>7. Stream erzeugen</h2>
<pre><code>liste.stream()                        // Normalfall, aus jeder Collection
liste.parallelStream()                // auf mehreren Prozessoren gleichzeitig
Stream.of("a", "b", "c")
Stream.iterate(1, n -&gt; n * 2)          // 1, 2, 4, 8 … unendlich → limit!
Stream.generate(() -&gt; "x")            // Supplier, unendlich → limit!
Stream.empty()</code></pre>

<h2>8. Intermediate Operations</h2>
<table>
<tr><th>Methode</th><th>erwartet</th><th>macht</th></tr>
<tr><td><code>filter(p)</code></td><td>Predicate</td><td>behält alle, die <code>p</code> erfüllen</td></tr>
<tr><td><code>distinct()</code></td><td>–</td><td>ohne Doppelte (vergleicht mit <code>equals</code>)</td></tr>
<tr><td><code>takeWhile(p)</code></td><td>Predicate</td><td>Anfangsstück, <strong>solange</strong> <code>p</code> gilt, dann Schluss</td></tr>
<tr><td><code>dropWhile(p)</code></td><td>Predicate</td><td>wirft das Anfangsstück weg, der Rest bleibt komplett</td></tr>
<tr><td><code>map(f)</code></td><td>Function</td><td>jedes Element → <code>f(element)</code>, der Typ darf sich ändern</td></tr>
<tr><td><code>flatMap(f)</code></td><td>Function → Stream</td><td>jedes Element → mehrere, alles in <strong>einen</strong> Stream</td></tr>
<tr><td><code>sorted()</code> / <code>sorted(c)</code></td><td>– / Comparator</td><td>natürliche Ordnung bzw. nach Comparator</td></tr>
<tr><td><code>limit(n)</code> / <code>skip(n)</code></td><td>–</td><td>nur die ersten n / ohne die ersten n</td></tr>
</table>
<pre><code>Stream.of(5, 8, 12, 3, 20, 7).filter(n -&gt; n &gt; 4)     // [5, 8, 12, 20, 7]
Stream.of(5, 8, 12, 3, 20, 7).takeWhile(n -&gt; n &gt; 4)  // [5, 8, 12]   stoppt bei 3!
Stream.of(5, 8, 12, 3, 20, 7).dropWhile(n -&gt; n &gt; 4)  // [3, 20, 7]</code></pre>
<p>In der echten API steht bei den Parametern <code>? super T</code>, z. B. <code>filter(Predicate&lt;? super T&gt; p)</code>, nach der PECS-Regel aus K05.</p>

<h2>9. Terminal Operations</h2>
<table>
<tr><th>Methode</th><th>erwartet</th><th>liefert</th></tr>
<tr><td><code>forEach(c)</code></td><td>Consumer</td><td><code>void</code></td></tr>
<tr><td><code>anyMatch</code> / <code>allMatch</code> / <code>noneMatch</code></td><td>Predicate</td><td><code>boolean</code></td></tr>
<tr><td><code>findFirst()</code> / <code>findAny()</code></td><td>–</td><td><code>Optional&lt;T&gt;</code></td></tr>
<tr><td><code>max(c)</code> / <code>min(c)</code></td><td>Comparator</td><td><code>Optional&lt;T&gt;</code></td></tr>
<tr><td><code>count()</code></td><td>–</td><td><strong><code>long</code></strong> (nicht <code>int</code>!)</td></tr>
<tr><td><code>toList()</code> / <code>toArray()</code></td><td>–</td><td>Liste / Array</td></tr>
<tr><td><code>reduce(start, op)</code></td><td>BinaryOperator</td><td>ein Wert vom Typ T</td></tr>
<tr><td><code>collect(c)</code></td><td>Collector</td><td>beliebiges R</td></tr>
</table>
<p><strong>Optional</strong> ist eine Schachtel, die leer sein kann. <code>findFirst</code> findet vielleicht nichts und liefert dann <code>Optional.empty</code> statt <code>null</code>. <code>.orElse(ersatz)</code> liefert den Inhalt oder den Ersatz, <code>.get()</code> auf eine leere Schachtel wirft eine Exception.</p>

<h2>10. Die drei Regeln der Ausführung</h2>
<ol>
<li><strong>Verbraucht:</strong> Nach der terminal Operation ist der Stream geschlossen. Ein zweiter Aufruf wirft eine <code>IllegalStateException</code>. Für jede Auswertung einen neuen Stream mit <code>stream()</code> erzeugen.</li>
<li><strong>Lazy:</strong> Ohne terminal Operation passiert <strong>nichts</strong>. Es wird nur so viel gerechnet, wie für das Ergebnis nötig ist (<code>findFirst</code>, <code>anyMatch</code>, <code>limit</code> brechen früh ab).</li>
<li><strong>Element für Element:</strong> Ein Element läuft durch die ganze Kette, bevor das nächste startet. Ausnahme: <code>sorted</code> muss erst alle Elemente kennen.</li>
</ol>
<pre><code>Stream.of(1, 2, 3)
      .filter(n -&gt; { print("f" + n); return n != 2; })
      .map(n -&gt; { print("m" + n); return n * 10; })
      .forEach(n -&gt; print(n));
// f1 m1 10 f2 f3 m3 30   ← die 2 erreicht map nie</code></pre>

<h2>11. reduce und collect</h2>
<table>
<tr><th></th><th>reduce</th><th>collect</th></tr>
<tr><td>in der Schleife</td><td><code>alle = alle + b;</code> → Zuweisung, jedes Mal ein <strong>neues</strong> Objekt</td><td><code>alle.append(b);</code> → Methodenaufruf, <strong>dasselbe</strong> Objekt wächst</td></tr>
<tr><td>passt für</td><td>Zahlen, unveränderliche Werte</td><td>Listen, StringBuilder, Maps</td></tr>
</table>
<pre><code>Stream.of(5, 1, 4).reduce(0, (a, b) -&gt; a + b)   // a = bisheriges Ergebnis, b = nächstes: 0+5=5, 5+1=6, 6+4=10
Stream.of("a", "b", "c").collect(Collectors.joining(", "))   // "a, b, c"</code></pre>
<p><strong>Collectors</strong> liefert fertige Collector-Objekte: <code>toList</code>, <code>toSet</code>, <code>toMap</code>, <code>toCollection</code>, <code>joining</code>, <code>counting</code>, <code>groupingBy</code>, <code>partitioningBy</code>, <code>maxBy</code>, <code>minBy</code>, <code>averagingDouble</code> …</p>
<pre><code>.collect(Collectors.groupingBy(s -&gt; s.length()))       // {3=[Ida, Lea], 5=[Jonas]}
.collect(Collectors.partitioningBy(n -&gt; n % 2 == 0))   // {false=[1, 3, 5], true=[2, 4]}</code></pre>

<h2>12. Collector selbst bauen</h2>
<p><code>collect(Collector&lt;T, A, R&gt;)</code>: <strong>T</strong> = Elementtyp, <strong>A</strong> = Zwischenspeicher, <strong>R</strong> = Ergebnistyp. <code>Collector.of</code> zerlegt die Sammel-Schleife in Lambdas:</p>
<table>
<tr><th>Teil</th><th>Interface</th><th>Aufgabe</th></tr>
<tr><td>Start</td><td><code>Supplier&lt;A&gt;</code></td><td>leerer Zwischenspeicher</td></tr>
<tr><td>Hinzufüger (Akkumulator)</td><td><code>BiConsumer&lt;A, T&gt;</code></td><td>ein Element hinein</td></tr>
<tr><td>Kombinierer (Combiner)</td><td><code>BiConsumer&lt;A, A&gt;</code></td><td>Teilergebnisse paralleler Prozessoren zusammen</td></tr>
<tr><td>Umwandler (Finisher, optional)</td><td><code>Function&lt;A, R&gt;</code></td><td>aus dem Speicher das Endergebnis</td></tr>
</table>
<pre><code>Collector&lt;String, StringBuilder, String&gt; c = Collector.of(
        () -&gt; new StringBuilder(),     // Start
        (sb, e) -&gt; sb.append(e),       // Hinzufüger
        (a, b) -&gt; a.append(b),         // Kombinierer
        sb -&gt; sb.toString());          // Umwandler
Stream.of("Ja", "va").collect(c);      // "Java"</code></pre>

<h2>13. Spielregeln für die Lambdas</h2>
<ul>
<li><strong>non-interfering:</strong> Die Lambdas dürfen die Quelle (die Collection) <strong>nicht verändern</strong>.</li>
<li><strong>stateless:</strong> Sie sollen nicht von Variablen außerhalb abhängen, die sich während der Verarbeitung ändern.</li>
</ul>
<p>Grund: Bei <code>parallelStream()</code> greifen mehrere Prozessoren gleichzeitig zu. Daten gehen verloren oder tauchen doppelt auf, die Reihenfolge ist zufällig, und der gemeinsame Zustand bremst. Erlaubt, aber mit Vorsicht: <code>peek</code>, <code>forEach</code>, <code>forEachOrdered</code>, <code>iterate</code>, <code>generate</code>.</p>
<pre><code>List&lt;String&gt; neu = new LinkedList&lt;&gt;();
liste.stream().forEach(e -&gt; neu.add(e));      // ✗ Zustand außerhalb, parallel gefährlich
List&lt;String&gt; neu = liste.stream().toList();   // ✓</code></pre>
<div class="box achtung"><b>Klausurfallen</b><code>count()</code> ist <code>long</code> · <code>takeWhile</code> ≠ <code>filter</code> · <code>findFirst</code> liefert <code>Optional</code> · Stream zweimal benutzen → <code>IllegalStateException</code> · ohne terminal Operation passiert nichts · Ausgaben laufen Element für Element · <code>generate</code>/<code>iterate</code> ohne <code>limit</code> laufen endlos.</div>

<h2>Spickzettel</h2>
<pre><code>Runnable          ()      -> nichts        run()
Supplier&lt;T&gt;       ()      -> T             get()
Consumer&lt;T&gt;       T       -> nichts        accept(t)
Function&lt;T,R&gt;     T       -> R             apply(t)
Predicate&lt;T&gt;      T       -> boolean       test(t)
UnaryOperator&lt;T&gt;  T       -> T             apply(t)
BinaryOperator&lt;T&gt; T, T    -> T             apply(a, b)
Comparator&lt;T&gt;     T, T    -> int           compare(a, b)</code></pre>
`);
