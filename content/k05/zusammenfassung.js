/* Kapitel 05 · Zusammenfassung Generische Klassen (eigene Formulierungen und Beispiele, keine Folienkopien)
   Alle Beispiele wurden mit javac/java geprüft. */
P3.zusammenfassung('K05', 'K05 · Generische Klassen und Methoden', `
<p>In K04 hast du generische Klassen <strong>benutzt</strong> (<code>List&lt;Kunde&gt;</code>, <code>Map&lt;Long, Konto&gt;</code>). Jetzt schreibst du sie <strong>selbst</strong>: Klassen und Methoden mit eigenen Typparametern, und du schränkst diese Typparameter mit <strong>Bounds</strong> ein.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Typische Fragen: Wo wird ein Typparameter deklariert, wo benutzt? Wann reicht <code>?</code>, wann braucht man ein eigenes <code>T</code>? Welche Zuweisung kompiliert mit <code>? extends</code> bzw. <code>? super</code>? Warum <code>Comparable&lt;? super T&gt;</code> statt <code>Comparable&lt;T&gt;</code>? Was ist mit Typparametern verboten (<code>new T()</code>, <code>new T[]</code>, <code>static T</code>, <code>instanceof</code>)? Warum <code>&amp;</code> statt Komma?</div>

<h2>1. Wozu Typparameter?</h2>
<p>Ohne Typparameter müsste man überall <code>Object</code> verwenden und beim Herausholen casten. Ein falscher Typ fiele erst <strong>zur Laufzeit</strong> auf (<code>ClassCastException</code>), womöglich beim Kunden. Mit Typparametern prüft der <strong>Compiler</strong> die Typen: Casts und <code>instanceof</code>-Prüfungen entfallen, fehlerhafter Code lässt sich gar nicht erst übersetzen.</p>
<pre><code>List roh = new ArrayList&lt;String&gt;();   // roher Typ: Compiler warnt nur
roh.add(5);                            // geht durch!
List&lt;String&gt; texte = roh;
String s = texte.get(0);               // erst HIER: ClassCastException</code></pre>

<h2>2. Eine generische Klasse schreiben</h2>
<pre><code>/**
 * eine Kiste, die genau ein Objekt aufbewahrt
 * @param &lt;T&gt; Typ des Inhalts
 */
public class Box&lt;T&gt; {                  // Deklaration von T
    private T inhalt;                  // Benutzung als Attributtyp
    public Box(T inhalt) { this.inhalt = inhalt; }
    public T get() { return inhalt; }  // Benutzung als Rückgabetyp
}

Box&lt;String&gt; b = new Box&lt;&gt;("Hallo");    // für dieses Objekt ist T = String
int n = b.get().length();              // kein Cast nötig</code></pre>
<ul>
<li><strong>Name:</strong> ein großer Buchstabe (<code>T</code> Typ, <code>E</code> Element, <code>K</code>/<code>V</code> Schlüssel/Wert). Mehrere Typparameter mit Komma: <code>class Paar&lt;A, B&gt;</code>.</li>
<li><strong>JavaDoc:</strong> <code>@param &lt;T&gt; Bedeutung</code> gehört zu jeder generischen Klasse und Methode.</li>
<li><code>T</code> gilt nur <strong>innerhalb</strong> der Klasse. Außerhalb hat <code>T</code> keine oder eine ganz andere Bedeutung.</li>
<li><strong>Jedes Objekt</strong> hat seinen eigenen Wert für <code>T</code>. Er muss beim Erzeugen angegeben werden, mindestens als Diamant <code>&lt;&gt;</code>.</li>
<li>Typargumente sind immer <strong>Referenztypen</strong>: <code>Box&lt;Integer&gt;</code>, nie <code>Box&lt;int&gt;</code>.</li>
</ul>

<h2>3. Eine generische Methode schreiben</h2>
<pre><code>/**
 * liefert das erste Element einer Liste
 * @param &lt;T&gt; Typ der Elemente
 * @param liste die Liste
 * @return das erste Element
 */
public static &lt;T&gt; T erstes(List&lt;T&gt; liste) {   // &lt;T&gt; VOR dem Rückgabetyp
    return liste.get(0);
}</code></pre>
<ul>
<li>Der Typparameter wird <strong>zwischen Modifizierern und Rückgabetyp</strong> deklariert und kann dann als Rückgabe-, Parameter- und Variablentyp benutzt werden.</li>
<li><strong>Jeder Aufruf</strong> hat seinen eigenen Wert für <code>T</code>.</li>
<li>Meist <strong>errät</strong> ihn der Compiler aus den Argumenten oder der Zielvariablen und nimmt den speziellsten Typ, der überall passt: <code>erstes(List.of("x"))</code> ergibt <code>T = String</code>.</li>
<li><strong>Explizit</strong> geht es auch, dann aber immer mit etwas vor dem Punkt: <code>Main.&lt;Integer&gt;erstes(liste)</code> bzw. <code>objekt.&lt;String&gt;methode(…)</code>. Ein nacktes <code>&lt;String&gt;erstes(…)</code> ist ein Syntaxfehler.</li>
<li>Eine Methode in einer generischen Klasse kann <strong>eigene</strong> Typparameter haben: <code>&lt;U&gt; Box&lt;U&gt; umfuellen(U neu)</code>. Heißt dieser auch <code>T</code>, verdeckt er das <code>T</code> der Klasse, also lieber anders nennen.</li>
<li>Statische Methoden dürfen <strong>ihren eigenen</strong> Typparameter haben (<code>static &lt;T&gt; …</code>), aber nicht das <code>T</code> der Klasse benutzen.</li>
</ul>

<h2>4. Wildcard <code>?</code></h2>
<pre><code>static int zaehle(Collection&lt;?&gt; c) { return c.size(); }   // jede Collection</code></pre>
<ul>
<li><code>?</code> heißt „irgendein Typ, ist mir egal“. Es steht <strong>nur in spitzen Klammern</strong>, nie allein (<code>? x;</code>) und nie hinter <code>new</code> (<code>new ArrayList&lt;?&gt;()</code>).</li>
<li>Elemente kann man nur als <code>Object</code> lesen. Hinzufügen geht nicht (außer <code>null</code>).</li>
</ul>
<div class="box merke"><b>Faustregel 1: T oder ?</b>Ein eigener Typparameter ist nötig, wenn <strong>derselbe</strong> beliebige Typ an <strong>mehreren Stellen</strong> vorkommt (z. B. Parameter und Rückgabe in <code>&lt;T&gt; T erstes(List&lt;T&gt; l)</code>). Kommt er nur einmal vor, reicht <code>?</code> bzw. <code>Object</code>.</div>

<h2>5. Upper Bound: <code>extends</code></h2>
<p>Mit einem nackten <code>T</code> darf man nur die Methoden von <code>Object</code> aufrufen: <code>x.length()</code> auf einem <code>T</code> ergibt „cannot find symbol“. Ein Bound verlangt mehr vom Typ und erlaubt dafür mehr:</p>
<pre><code>static &lt;T extends Comparable&lt;T&gt;&gt; T groesstes(List&lt;T&gt; liste) {
    T max = liste.get(0);
    for (T x : liste)
        if (x.compareTo(max) &gt; 0)      // erlaubt: T ist garantiert Comparable
            max = x;
    return max;
}
// groesstes(List.of(3, 9, 4)) → 9     groesstes(List.of("kiwi", "apfel")) → kiwi</code></pre>
<ul>
<li><code>T extends X</code>: T ist X oder ein Untertyp. Es heißt <strong>immer <code>extends</code></strong>, auch bei Interfaces (<code>implements</code> ist hier ein Syntaxfehler).</li>
<li>Mehrere Bedingungen mit <strong><code>&amp;</code></strong>: <code>&lt;T extends Number &amp; Comparable&lt;T&gt;&gt;</code>. Höchstens <strong>eine Klasse</strong>, und die steht <strong>zuerst</strong>. Das Komma geht nicht, weil es mehrere Typparameter trennt.</li>
<li>Der Bound steht bei der <strong>Deklaration</strong> (<code>class Name&lt;T extends …&gt;</code> bzw. <code>&lt;T extends …&gt; void m(T p)</code>), nicht beim Parameter.</li>
<li>Ein unpassendes Typargument meldet der Compiler: <code>Box&lt;Integer&gt;</code> bei <code>class Box&lt;T extends CharSequence&gt;</code> ergibt „not within bounds“.</li>
</ul>
<p>Bei der Wildcard: <code>List&lt;? extends Number&gt;</code> passt zu <code>List&lt;Integer&gt;</code>, <code>List&lt;Double&gt;</code>, <code>List&lt;Number&gt;</code>. Man kann <strong>lesen</strong> (als <code>Number</code>), aber <strong>nicht hinzufügen</strong>: Es könnte ja eine Double-Liste sein.</p>

<h2>6. Lower Bound: <code>super</code></h2>
<pre><code>static void fuelleBis(List&lt;? super Integer&gt; liste, int n) {
    for (int i = 1; i &lt;= n; i++)
        liste.add(i);                  // Integer hinzufügen: erlaubt
}
// geht mit List&lt;Integer&gt;, List&lt;Number&gt;, List&lt;Object&gt;
// Integer x = liste.get(0);  ✗ es könnte eine Object-Liste sein, lesen nur als Object</code></pre>
<ul>
<li><code>? super Unter</code>: Unter selbst oder ein Obertyp.</li>
<li><strong>Nur bei der Wildcard</strong>. <code>&lt;T super Integer&gt;</code> ist ein Syntaxfehler.</li>
</ul>

<h2>7. Faustregel 2: extends oder super?</h2>
<table>
<tr><th>Die Daten …</th><th>nimm</th><th>Beispiel</th></tr>
<tr><td>kommen aus dem Parameter <strong>in deinen Code hinein</strong> (du liest)</td><td><code>? extends</code> / <code>T extends</code></td><td><code>double summe(Collection&lt;? extends Number&gt; c)</code></td></tr>
<tr><td>gehen aus deinem Code <strong>an den Parameter hinaus</strong> (du schreibst hinein oder übergibst sie ihm)</td><td><code>?</code> / <code>? super</code></td><td><code>void fuelleBis(List&lt;? super Integer&gt; l, int n)</code></td></tr>
<tr><td>beides</td><td>fester Typ</td><td><code>List&lt;T&gt;</code></td></tr>
</table>
<pre><code>static &lt;T&gt; void kopiere(Collection&lt;? extends T&gt; quelle, Collection&lt;? super T&gt; ziel) {
    for (T x : quelle)                 // aus der Quelle lesen   → extends
        ziel.add(x);                   // ins Ziel schreiben     → super
}
// kopiere(List.of(1, 2), new ArrayList&lt;Object&gt;())  ✓</code></pre>
<p>Englische Eselsbrücke: <strong>PECS</strong>, Producer Extends, Consumer Super. Auch ein <code>Comparator</code> oder ein Prüf-Interface, dem man Elemente <strong>übergibt</strong>, ist ein „Consumer“: darum <code>TreeSet(Comparator&lt;? super E&gt; c)</code>. Ein <code>Comparator&lt;Tier&gt;</code> kann so auch Hunde sortieren.</p>

<h2>8. <code>Comparable&lt;? super T&gt;</code>: das wichtigste Muster</h2>
<pre><code>class Tier implements Comparable&lt;Tier&gt; { … }
class Hund extends Tier { }            // Hund ist Comparable&lt;Tier&gt;, NICHT Comparable&lt;Hund&gt;

&lt;T extends Comparable&lt;T&gt;&gt;          T max(List&lt;T&gt; l)               // max(hunde) ✗ Compilerfehler
&lt;T extends Comparable&lt;? super T&gt;&gt;  T max(Collection&lt;? extends T&gt; c) // max(hunde) ✓</code></pre>
<p>Eine Unterklasse erbt das <code>compareTo</code> der Oberklasse. Sie vergleicht sich also mit einem <strong>Obertyp</strong>. Dasselbe gilt in der Java-Bibliothek: <code>LocalDate</code> implementiert <code>Comparable&lt;ChronoLocalDate&gt;</code> (über das Interface <code>ChronoLocalDate</code>), nicht <code>Comparable&lt;LocalDate&gt;</code>. Mit <code>T extends Comparable&lt;T&gt;</code> lässt sich deshalb keine Liste von <code>LocalDate</code> verarbeiten, mit <code>? super T</code> schon. So ist z. B. <code>Collections.sort</code> deklariert: <code>&lt;T extends Comparable&lt;? super T&gt;&gt; void sort(List&lt;T&gt; list)</code>.</p>

<h2>9. Das geht nicht</h2>
<table>
<tr><th>Code in <code>class Klasse&lt;T&gt;</code></th><th>Compiler sagt</th><th>Grund</th></tr>
<tr><td><code>new T()</code></td><td>unexpected type</td><td>Zur Laufzeit ist T unbekannt, welcher Konstruktor wäre gemeint?</td></tr>
<tr><td><code>new T[5]</code></td><td>generic array creation</td><td>keine Arrays vom Typparameter</td></tr>
<tr><td><code>o instanceof T</code>, <code>o instanceof List&lt;Integer&gt;</code></td><td>cannot be safely cast</td><td>Typargumente gibt es zur Laufzeit nicht mehr (nur <code>List&lt;?&gt;</code> ist prüfbar)</td></tr>
<tr><td><code>static T x</code> / <code>static T m()</code></td><td>non-static type variable T cannot be referenced from a static context</td><td>T gehört zum Objekt, Statisches hat kein Objekt</td></tr>
<tr><td><code>class Klasse&lt;T&gt; extends Exception</code></td><td>a generic class may not extend Throwable</td><td>keine generischen Exceptions</td></tr>
</table>
<p>Hintergrund: Der Compiler prüft die Typargumente und <strong>entfernt</strong> sie danach (Type Erasure). Zur Laufzeit sind <code>ArrayList&lt;String&gt;</code> und <code>ArrayList&lt;Integer&gt;</code> dieselbe Klasse: <code>a.getClass() == b.getClass()</code> ist <code>true</code>.</p>

<h2>10. Das geht, aber vermeiden</h2>
<pre><code>class Klasse&lt;T&gt; {
    void methode(T p) { … }
    void methode(String p) { … }
}
new Klasse&lt;String&gt;().methode("blub");    // ✗ reference to methode is ambiguous
new Klasse&lt;Integer&gt;().methode("blub");   // ✓ hier eindeutig</code></pre>
<p>Für <code>T = String</code> passen beide Methoden gleich gut, und es gibt keine Schreibweise, die das auflöst. Solche Überladungen deshalb vermeiden.</p>

<div class="box achtung"><b>Keine Polymorphie zwischen spitzen Klammern (Wiederholung aus K04)</b><code>Box&lt;Integer&gt;</code> ist <strong>kein</strong> <code>Box&lt;Number&gt;</code>, und <code>List&lt;String&gt;</code> lässt sich nicht an einen Parameter <code>List&lt;Object&gt;</code> übergeben. Wer „irgendeine Liste“ annehmen will, schreibt <code>List&lt;?&gt;</code>. Wer „Liste von Number oder Untertypen“ will, schreibt <code>List&lt;? extends Number&gt;</code>.</div>

<h2>Spickzettel</h2>
<table>
<tr><th></th><th>Typparameter der Klasse</th><th>Typparameter der Methode</th><th>Wildcard</th></tr>
<tr><td>Deklaration</td><td><code>class K&lt;T extends …&gt;</code></td><td><code>&lt;T extends …&gt; R m(…)</code></td><td>keine, steht direkt im Typ</td></tr>
<tr><td>Wert festgelegt</td><td>pro Objekt, immer hinschreiben (<code>&lt;&gt;</code>)</td><td>pro Aufruf, meist geraten</td><td>nie bekannt</td></tr>
<tr><td>Bounds</td><td><code>extends</code> (mit <code>&amp;</code>)</td><td><code>extends</code> (mit <code>&amp;</code>)</td><td><code>extends</code> oder <code>super</code></td></tr>
<tr><td>Wann?</td><td colspan="2">wenn derselbe Typ an mehreren Stellen gebraucht wird</td><td>wenn der Typ keinen Namen braucht</td></tr>
</table>
`);
