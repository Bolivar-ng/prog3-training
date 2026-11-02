/* Kapitel 04 · Zusammenfassung Collections (eigene Formulierungen, keine Folienkopien) */
P3.zusammenfassung('K04', 'K04 · Collections', `
<p>Das Collection-Framework liefert fertige Datenstrukturen: <strong>Listen</strong> (Reihenfolge, Duplikate erlaubt), <strong>Mengen</strong> (keine Duplikate) und <strong>Maps</strong> (Schlüssel → Wert). Alle sind <strong>generisch</strong>: Der Elementtyp wird in spitzen Klammern angegeben.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Typische Fragen: Was darf zwischen die spitzen Klammern? Welche Zuweisungen kompiliert der Compiler? Darf in List, Set, Map dasselbe Objekt mehrfach vorkommen? Was passiert beim Löschen in der for-each-Schleife? Woran erkennen HashSet und TreeSet Duplikate? Was liefert <code>get</code> bei einem fehlenden Schlüssel? Die Fragen mit dem Etikett <strong>prüfungsrelevant</strong> decken diese Punkte ab.</div>

<h2>Generische Klassen benutzen</h2>
<pre><code>public class Klasse&lt;T&gt; {          // T = Typparameter, beim Schreiben der Klasse offen
    private T einAttribut;
}
Klasse&lt;Integer&gt; eins = new Klasse&lt;Integer&gt;();   // im Objekt eins ist T = Integer
Klasse&lt;Integer&gt; zwei = new Klasse&lt;&gt;();          // Diamantoperator: Typ wird von links übernommen</code></pre>
<ul>
<li>In der API steht z. B. <code>Collection&lt;E&gt;</code>, <code>Map&lt;K, V&gt;</code>: E = Element, K = Schlüssel, V = Wert.</li>
<li><strong>Nur Klassen</strong> als Typargument, keine primitiven Typen: <code>List&lt;Integer&gt;</code>, nicht <code>List&lt;int&gt;</code>. Das Ein- und Auspacken (Autoboxing) passiert automatisch.</li>
<li>Jedes Objekt hat seinen eigenen Wert für T, festgelegt beim Konstruktoraufruf.</li>
</ul>

<h3>Keine Polymorphie zwischen spitzen Klammern</h3>
<pre><code>List&lt;Number&gt; a = new ArrayList&lt;Number&gt;();     // ✓ Unterklasse der generischen KLASSE geht
Collection&lt;Number&gt; b = new ArrayList&lt;&gt;();     // ✓
List&lt;Number&gt; c = new ArrayList&lt;Integer&gt;();    // ✗ Unterklasse des TYPPARAMETERS geht nicht
List&lt;Object&gt; d = new ArrayList&lt;String&gt;();     // ✗ auch nicht umgekehrt</code></pre>
<p>Polymorphie gilt für die Klasse vor den Klammern, nicht für das, was in den Klammern steht. Integer ist eine Number, aber eine Liste von Integer ist keine Liste von Number: Sonst könnte man über <code>c</code> ein <code>Double</code> in eine Integer-Liste legen.</p>

<h3>Wildcard <code>?</code></h3>
<pre><code>List&lt;?&gt; x = new LinkedList&lt;Integer&gt;();   // passt zu jeder Ausprägung
int zahl = (Integer) x.get(0);            // Lesen nur als Object, Cast = eigene Verantwortung
x.add(7);                                 // ✗ Compilerfehler: 7 passt nicht sicher zum echten Typ
x.add(null);                              // ✓ null passt zu jedem Typ</code></pre>
<p><code>?</code> nur in Deklarationen, nie beim Konstruktoraufruf.</p>

<div class="box achtung"><b>Zwei NIEMALS-Regeln</b>1. Generische Klassen nie ohne Typargument benutzen (roher Typ, Compilerwarnung „raw type“ ernst nehmen). 2. Nie bei generischen Typen casten. Beides schaltet die Typprüfung des Compilers aus. Beispiel: Über <code>(List&lt;String&gt;) wild</code> landet „Hallo“ in einer Integer-Liste, der Fehler kommt erst viel später als <code>ClassCastException</code>.</div>

<h2>Das Collection-Framework</h2>
<table>
<tr><th>Interface</th><th>Eigenschaft</th><th>Klassen</th></tr>
<tr><td><code>Collection&lt;E&gt;</code></td><td>Ober-Interface von List und Set: <code>add</code>, <code>remove(Object)</code>, <code>contains</code>, <code>size</code>, <code>clear</code>, <code>removeIf</code></td><td>–</td></tr>
<tr><td><code>List&lt;E&gt;</code></td><td>Reihenfolge, Index, <strong>Duplikate erlaubt</strong>: <code>get(i)</code>, <code>set(i, e)</code>, <code>remove(int)</code>, <code>indexOf</code></td><td>ArrayList, LinkedList</td></tr>
<tr><td><code>Set&lt;E&gt;</code></td><td>Menge, <strong>keine Duplikate</strong>, kein Index</td><td>HashSet, TreeSet</td></tr>
<tr><td><code>Map&lt;K, V&gt;</code></td><td>Schlüssel → Wert, Schlüssel eindeutig, Werte dürfen doppelt sein. <strong>Erbt nicht von Collection!</strong></td><td>HashMap, TreeMap, Properties</td></tr>
</table>
<p>Typisch: links das Interface, rechts die Klasse: <code>List&lt;Konto&gt; konten = new ArrayList&lt;&gt;();</code>. Der Tausch gegen <code>LinkedList</code> ändert dann am restlichen Code nichts.</p>

<h3>ArrayList oder LinkedList?</h3>
<table>
<tr><th></th><th>ArrayList</th><th>LinkedList</th></tr>
<tr><td>intern</td><td>Array ohne feste Grenze</td><td>verkettete Elemente</td></tr>
<tr><td>Zugriff <code>get(i)</code></td><td>schnell</td><td>langsam (man muss hinlaufen)</td></tr>
<tr><td>Einfügen/Löschen</td><td>langsamer (verschieben)</td><td>schnell</td></tr>
<tr><td>null</td><td>erlaubt</td><td>erlaubt</td></tr>
</table>

<h3>Array → List</h3>
<table>
<tr><th>Array</th><th>List</th></tr>
<tr><td><code>new String[3]</code></td><td><code>new ArrayList&lt;String&gt;()</code></td></tr>
<tr><td><code>a[0] = "x"</code> (befüllen)</td><td><code>l.add("x")</code></td></tr>
<tr><td><code>a.length</code></td><td><code>l.size()</code></td></tr>
<tr><td><code>a[i]</code></td><td><code>l.get(i)</code></td></tr>
<tr><td><code>a[2] = "y"</code> (überschreiben)</td><td><code>l.set(2, "y")</code> – <code>add(2, "y")</code> würde einfügen!</td></tr>
</table>

<h2>Durchlaufen: for-each und Iterator</h2>
<pre><code>for (String t : meineListe) { … }          // für Arrays und alles, was Iterable ist

Iterator&lt;String&gt; iter = meineListe.iterator();   // so arbeitet for-each intern
while (iter.hasNext()) {
    String t = iter.next();                // aktuelles Element holen + weitersetzen
}</code></pre>
<div class="box achtung"><b>Achtung</b>Die Liste in der for-each-Schleife verändern (add/remove) führt zur <code>ConcurrentModificationException</code>: Iterator und Liste passen nicht mehr zusammen. Lösung: <code>liste.removeIf(e -&gt; Bedingung)</code> (ein Predicate aus Kapitel 2), selten <code>iter.remove()</code>.</div>
<p>Eine Map ist <strong>nicht</strong> Iterable: <code>for (Student s : map)</code> kompiliert nicht. Man durchläuft eine ihrer Sichten (siehe unten).</p>

<h2>Set: wann sind zwei Elemente gleich?</h2>
<table>
<tr><th></th><th>HashSet</th><th>TreeSet</th></tr>
<tr><td>Gleichheit</td><td><code>hashCode</code> + <code>equals</code></td><td><code>compareTo</code> bzw. <code>compare</code> (Ergebnis 0)</td></tr>
<tr><td>Reihenfolge</td><td>keine feste</td><td>sortiert</td></tr>
<tr><td>Voraussetzung</td><td>equals/hashCode passend</td><td>Elemente <code>Comparable</code> oder Comparator im Konstruktor, sonst <code>ClassCastException</code></td></tr>
<tr><td>null</td><td>erlaubt</td><td>verboten (<code>NullPointerException</code>)</td></tr>
</table>
<p>Darum muss <code>compareTo</code> konsistent mit <code>equals</code> sein: Sonst behalten HashSet und TreeSet bei denselben Objekten verschieden viele Elemente. <code>add</code> liefert <code>false</code>, wenn das Element schon drin war.</p>

<h2>Map</h2>
<pre><code>Map&lt;Integer, Student&gt; studenten = new HashMap&lt;&gt;();   // Matrikelnummer → Student
studenten.put(4711, s);        // einfügen oder ÜBERSCHREIBEN, liefert den alten Wert (sonst null)
studenten.get(4711);           // Wert zum Schlüssel – null, wenn der Schlüssel fehlt!
studenten.containsKey(4711);  studenten.remove(4711);  studenten.size();

for (Map.Entry&lt;Integer, Student&gt; e : studenten.entrySet()) {
    … e.getKey() … e.getValue() …
}</code></pre>
<table>
<tr><th>Klasse</th><th>Schlüssel</th><th>null</th></tr>
<tr><td>HashMap</td><td>Reihenfolge über Hashwert</td><td>als Schlüssel erlaubt</td></tr>
<tr><td>TreeMap</td><td>sortiert</td><td>als Schlüssel verboten</td></tr>
<tr><td>Properties</td><td>Schlüssel und Werte sind Strings (Systemeigenschaften)</td><td>verboten</td></tr>
</table>

<h3>Die drei Sichten (View Collections)</h3>
<ul>
<li><code>keySet()</code> → <strong>Set</strong> (Schlüssel sind eindeutig), <code>values()</code> → <strong>Collection</strong> (Werte dürfen doppelt sein), <code>entrySet()</code> → Set von Schlüssel-Wert-Paaren.</li>
<li>Eine View ist nur eine andere Sicht ohne eigenen Speicher: <code>remove</code> über die View löscht auch aus der Map, <code>add</code> ist verboten (<code>UnsupportedOperationException</code>).</li>
</ul>

<h2>Hilfsklasse <code>Collections</code> (mit s!)</h2>
<p>Statische Methoden: <code>sort</code>, <code>reverse</code>, <code>shuffle</code>, <code>min</code>, <code>max</code>, <code>frequency(c, o)</code> (wie oft), <code>disjoint(a, b)</code> (keine gemeinsamen Elemente?), <code>copy(ziel, quelle)</code>.</p>
<p><code>unmodifiableList/Set/Map/Collection</code> liefern eine unveränderbare <strong>View</strong>: Ändernde Methoden werfen <code>UnsupportedOperationException</code>, Änderungen am Original sieht man aber weiterhin.</p>
<div class="box merke"><b>Merke</b><code>Collection</code> = Interface, Oberbegriff von List und Set. <code>Collections</code> = Hilfsklasse mit statischen Methoden.</div>
`);
