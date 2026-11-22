/* Kapitel 07 · Zusammenfassung Funktionale Interfaces (Vorbereitung auf Streams)
   Eigene Formulierungen und Beispiele, keine Folienkopien. Der Teil zu Streams folgt. */
P3.zusammenfassung('K07', 'K07 · Funktionale Interfaces und Streams', `
<p>Streams arbeiten fast nur mit <strong>Lambda-Ausdrücken</strong>, und jedes Lambda braucht als Typ ein <strong>funktionales Interface</strong>. Wer die wichtigsten funktionalen Interfaces der Standardbibliothek <strong>im Kopf</strong> hat, versteht später jede Stream-Methode auf einen Blick.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Typische Frage: „In einem Programm steht <code>x = …Lambda…;</code> Welchen Datentyp könnte <code>x</code> haben?“ Mehrere Antworten können richtig sein, auch „keiner davon“. Dafür musst du für jedes Interface wissen: <strong>Wie viele Parameter gehen rein, was kommt raus?</strong></div>

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

<h2>6. Ausblick: Streams</h2>
<p>Hier siehst du, warum diese Interfaces wichtig sind. Jede Stream-Methode erwartet eines davon:</p>
<table>
<tr><th>Stream-Methode</th><th>erwartet</th><th>Beispiel</th></tr>
<tr><td><code>filter</code></td><td>Predicate</td><td><code>filter(s -> s.startsWith("A"))</code></td></tr>
<tr><td><code>map</code></td><td>Function</td><td><code>map(s -> s.length())</code></td></tr>
<tr><td><code>sorted</code></td><td>Comparator</td><td><code>sorted((a, b) -> a.length() - b.length())</code></td></tr>
<tr><td><code>forEach</code></td><td>Consumer</td><td><code>forEach(s -> System.out.println(s))</code></td></tr>
<tr><td><code>reduce</code></td><td>BinaryOperator</td><td><code>reduce(0, (a, b) -> a + b)</code></td></tr>
<tr><td><code>Stream.generate</code></td><td>Supplier</td><td><code>Stream.generate(() -> "x")</code></td></tr>
</table>
<p><em>Der ausführliche Teil zu Streams folgt nach der Vorlesung.</em></p>

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
