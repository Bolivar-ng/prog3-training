/* Kapitel 02 · Zusammenfassung Interfaces (eigene Formulierungen, keine Folienkopien) */
P3.zusammenfassung('K02', 'K02 · Interfaces', `
<p>Ein <strong>Interface</strong> ist ein Vertrag: Es legt fest, <strong>was</strong> ein Objekt können muss (Methodensignaturen + JavaDoc), aber nicht, <strong>wie</strong> es das macht.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Moodle-Test vom 22. bis 24.10. (30 Minuten, ein Versuch, nur im Safe Exam Browser). Typische Fragen: Wie ruft man eine Methode mit Interface-Parameter auf? Welche Implementierung von <code>compareTo</code> ist richtig? Auf was hat welche Art von Klasse Zugriff? Welcher Lambda-Ausdruck ist gültig?</div>

<h2>Wozu Interfaces?</h2>
<p>Ein Algorithmus (z. B. Sortieren) ist fertig bis auf ein kleines Detail, das von den Objekten abhängt (z. B. „Wer ist kleiner?“). Dieses Detail wird als Methode in ein Interface ausgelagert (z. B. <code>compareTo</code>), und in der JavaDoc steht genau, was sie tun muss.</p>
<ul>
<li>Der Algorithmus arbeitet nur mit dem Interface-Typ, er kennt keine konkrete Klasse.</li>
<li>Jede neue Klasse implementiert nur das Detail und kann den fertigen Algorithmus sofort benutzen.</li>
</ul>
<div class="box merke"><b>Merke</b>Algorithmen so allgemein wie möglich schreiben: „Wenn die Objekte diese Fähigkeit (Methode) haben, dann geht es so …“</div>

<h2>Ein Interface schreiben</h2>
<pre><code>/**
 * Beschreibt Objekte, die ... koennen.
 */
public interface Interfacename extends AnderesInterface {
    int KONSTANTE = 10;               // automatisch public static final
    void methode();                   // automatisch public abstract
    static void hilfsmethode() { }    // statische Methode
    default void algorithmus() {      // darf ueberschrieben werden, muss aber nicht
        methode();
    }
}</code></pre>
<ul>
<li>Alle Mitglieder sind automatisch <code>public</code>.</li>
<li>Variablen sind automatisch <code>static final</code>, es gibt also <strong>keine Instanzattribute</strong>.</li>
<li><strong>default-Methoden</strong> enthalten Algorithmen, die auf den abstrakten Methoden aufbauen.</li>
<li>Ein Interface kann mehrere andere Interfaces erweitern (<code>extends A, B</code>).</li>
<li>Bei Interfaces ist die <strong>JavaDoc Pflicht</strong>: Sie ist der eigentliche Vertrag.</li>
</ul>

<h2>Ein Interface verwenden</h2>
<p>Der Interfacename ist ein ganz normaler Datentyp: für Parameter, Rückgabewerte, Variablen und Attribute.</p>
<pre><code>Interfacename v = new ImplementierendeKlasse();   // richtig
Interfacename v = new Interfacename();            // Compilerfehler</code></pre>
<p>Steht in der Doku <code>public static void tutWas(Interfacename p)</code>, dann braucht man ein Objekt einer Klasse, die das Interface implementiert:</p>
<pre><code>Interfacename v = new ImplementierendeKlasse();
tutWas(v);</code></pre>
<div class="box achtung"><b>Achtung</b>Will man ein Objekt einer <strong>eigenen</strong> Klasse übergeben, muss diese Klasse das Interface implementieren. Sonst passt der Typ nicht.</div>

<h2>Ein Interface implementieren: die Wege</h2>
<table>
<tr><th>Weg</th><th>Zugriff auf die umgebende Klasse</th><th>Bemerkung</th></tr>
<tr><td>Benannte Klasse, eigene Datei</td><td>keiner</td><td>viele Klassen, viele Dateien</td></tr>
<tr><td>Zweite Klasse ohne <code>public</code> in derselben Datei</td><td>keiner</td><td>weniger Dateien, aber unordentlich</td></tr>
<tr><td>Innere <strong>statische</strong> Klasse</td><td>nur <strong>statische</strong> Elemente (auch private)</td><td>Name: <code>Ausfuehrung.TutWas</code></td></tr>
<tr><td>Innere (nicht-statische) Klasse</td><td><strong>alle</strong> Elemente (auch private)</td><td>Erzeugung: <code>a.new TutWas()</code></td></tr>
<tr><td>Anonyme Klasse</td><td>alle Elemente + <strong>effektiv finale</strong> lokale Variablen</td><td>Erzeugen und Implementieren in einem Schritt</td></tr>
<tr><td>Lambda-Ausdruck</td><td>wie anonyme Klasse</td><td>nur bei funktionalen Interfaces</td></tr>
</table>

<h3>Innere (nicht-statische) Klasse</h3>
<pre><code>public class Ausfuehrung {
    private int faktor = 5;

    private class TutWas implements Rechner {
        @Override
        public int rechne(int x) {
            return x * faktor;     // private Instanzvariable: erlaubt
        }
    }
}

Ausfuehrung a = new Ausfuehrung();
Rechner r = a.new TutWas();      // braucht ein Objekt der aeusseren Klasse</code></pre>
<p>Zu jedem Objekt von <code>Ausfuehrung</code> gehört eine eigene <code>TutWas</code>-Klasse. Deshalb wird über das äußere Objekt erzeugt.</p>
<div class="box achtung"><b>Folie vs. aktuelles Java</b>Die Folie sagt: statische Mitglieder in inneren Klassen sind verboten. Das galt bis Java 15. Seit Java 16 kompiliert <code>static int z;</code> in einer inneren Klasse. Wenn der Moodle-Test nach der Regel der Folie fragt, antworte nach der Folie.</div>

<h3>Anonyme Klasse und effektiv final</h3>
<pre><code>int grenze = 100;                    // wird danach nie mehr geaendert: effektiv final
Pruefer p = new Pruefer() {
    @Override
    public boolean pruefe(int x) {
        return x &gt; grenze;           // erlaubt
    }
};                                   // Semikolon!</code></pre>
<p>Wird <code>grenze</code> irgendwo in der Methode noch einmal verändert (auch <strong>nach</strong> der anonymen Klasse), ist sie nicht mehr effektiv final, und die Zeile mit dem Zugriff kompiliert nicht.</p>

<h3>this in inneren und anonymen Klassen</h3>
<ul>
<li><code>this</code> ist das Objekt der inneren bzw. anonymen Klasse.</li>
<li><code>Aussen.this</code> ist das Objekt der umgebenden Klasse <code>Aussen</code>.</li>
</ul>

<h2>Comparable und compareTo</h2>
<table>
<tr><th>Ergebnis von <code>a.compareTo(b)</code></th><th>Bedeutung</th></tr>
<tr><td>negativ</td><td>a ist kleiner als b</td></tr>
<tr><td>0</td><td>gleich</td></tr>
<tr><td>positiv</td><td>a ist größer als b</td></tr>
</table>
<pre><code>@Override
public int compareTo(Konto anderes) {
    return Long.compare(this.nummer, anderes.nummer);
}</code></pre>
<ul>
<li>Die Variante mit <code>if (…) return -1; if (…) return 1; return 0;</code> ist ebenfalls richtig.</li>
<li><strong>Nicht</strong> subtrahieren und auf <code>int</code> casten: Bei großen Werten entsteht ein Überlauf und das Vorzeichen stimmt nicht mehr.</li>
<li>Reihenfolge der Argumente beachten: <code>Long.compare(anderes.nummer, this.nummer)</code> sortiert absteigend.</li>
</ul>
<div class="box achtung"><b>Achtung</b><code>compareTo</code> muss <strong>konsistent mit equals</strong> sein: gleich laut <code>equals</code> genau dann, wenn <code>compareTo</code> 0 liefert. Sonst verhalten sich z. B. <code>TreeSet</code> und <code>HashSet</code> mit denselben Objekten unterschiedlich.</div>

<h2>instanceof</h2>
<p>Prüft, ob ein Objekt zuweisungskompatibel zu einer Klasse oder einem Interface ist (eigene Klasse, alle Oberklassen, alle implementierten Interfaces). <code>null instanceof X</code> ist immer <code>false</code>.</p>
<pre><code>// alte Form: nicht mehr verwenden
if (o instanceof Girokonto) { Girokonto g = (Girokonto) o; ... }

// neue Form: Pattern Matching
if (o instanceof Girokonto g) { ... }</code></pre>
<div class="box merke"><b>Regel von Frau Hubrich</b>instanceof (und der Vergleich von Class-Objekten) möglichst vermeiden. Wer es braucht, hat meist den Datentyp schlecht gewählt: besser Polymorphie oder Typparameter. Erlaubt nur, wenn der Code dadurch sonst nicht mögliche Verallgemeinerung gewinnt.</div>

<h2>Funktionale Interfaces und Lambdas</h2>
<p>Ein <strong>funktionales Interface</strong> hat <strong>genau eine abstrakte Methode</strong> (default- und static-Methoden zählen nicht). Meist mit <code>@FunctionalInterface</code> annotiert, Pflicht ist das nicht. Eine abstrakte <strong>Klasse</strong> mit einer abstrakten Methode ist <strong>kein</strong> funktionales Interface.</p>
<pre><code>Rechner r = (int x) -&gt; { return x + 1; };   // Vollform
Rechner r = x -&gt; x + 1;                      // Kurzform</code></pre>
<ul>
<li>Der Lambda-Ausdruck hat als Typ das Interface. Die Klasse des erzeugten Objekts ist anonym.</li>
<li>Der Compiler muss das Interface aus dem Ziel <strong>erraten</strong> können: aus dem Typ der Variablen oder des Parameters. <code>var f = (int x) -&gt; x + 1;</code> kompiliert deshalb nicht.</li>
</ul>
<table>
<tr><th>Verkürzung</th><th>Beispiel</th></tr>
<tr><td>Parametertypen weglassen, <strong>alle oder keinen</strong></td><td><code>(int a, int b)</code> → <code>(a, b)</code></td></tr>
<tr><td>Genau ein Parameter ohne Typ: Klammern weg</td><td><code>(x)</code> → <code>x</code></td></tr>
<tr><td>Körper nur <code>{ return wert; }</code></td><td>→ <code>wert</code></td></tr>
<tr><td>void-Methode mit genau einer Anweisung</td><td><code>{ tuWas(); }</code> → <code>tuWas()</code></td></tr>
</table>
<p>Der Parametername im Lambda muss nicht zum Namen im Interface passen.</p>

<h2>Wichtige Standard-Interfaces</h2>
<table>
<tr><th>Interface</th><th>Methode</th><th>Zweck</th></tr>
<tr><td><code>Comparable&lt;T&gt;</code></td><td><code>int compareTo(T t)</code></td><td>natürliche Ordnung, in der Klasse selbst</td></tr>
<tr><td><code>Comparator&lt;T&gt;</code></td><td><code>int compare(T t1, T t2)</code></td><td>Vergleich von außen</td></tr>
<tr><td><code>Predicate&lt;T&gt;</code></td><td><code>boolean test(T t)</code></td><td>prüfen</td></tr>
<tr><td><code>Consumer&lt;T&gt;</code></td><td><code>void accept(T t)</code></td><td>Aktion mit t</td></tr>
<tr><td><code>Function&lt;T,R&gt;</code></td><td><code>R apply(T t)</code></td><td>T in R umwandeln</td></tr>
<tr><td><code>BinaryOperator&lt;T&gt;</code></td><td><code>T apply(T t1, T t2)</code></td><td>zwei Werte zusammenfassen</td></tr>
<tr><td><code>Supplier&lt;T&gt;</code></td><td><code>T get()</code></td><td>Objekte liefern</td></tr>
<tr><td><code>Runnable</code></td><td><code>void run()</code></td><td>(nebenläufige) Aktion</td></tr>
</table>
`);
