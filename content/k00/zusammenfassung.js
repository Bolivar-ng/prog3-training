/* Kapitel 00 · Zusammenfassung (eigene Formulierungen, keine Folienkopien) */
P3.zusammenfassung('K00', 'K00 · Grundlagen und Wiederholung', `
<p>Kapitel 00 frischt Prog 1 und 2 auf und legt die <strong>Qualitätsregeln</strong> fest, nach denen das ganze Semester bewertet wird. Begleitet wird alles vom <strong>Bankprojekt</strong> (Konto, Girokonto, Sparbuch, Geldbetrag, Kunde). Die Übung 0 wendet das an: eine fehlerhafte Klasse <code>Vektor</code> korrigieren und <code>Sparbuch.abheben</code> mit JUnit 5 testen.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Moodle-Test (Theorie, 30 Minuten, 10 %) und E-Klausur (120 Minuten, 90 %) fragen genau diese Dinge ab: Regel erkennen, Fehler finden, Ausgabe vorhersagen, Entscheidung begründen. Auswendig gelernte Sätze reichen nicht, du musst jede Regel an einem Codebeispiel begründen können.</div>

<h2>Qualitätsregeln für Code</h2>
<table>
<tr><th>Regel</th><th>Was das konkret heißt</th></tr>
<tr><td>JavaDoc</td><td>Für alles mit mehr als <code>private</code> Sichtbarkeit: Klasse, statische Konstanten, Konstruktoren, jede Methode, auch Getter und Setter. Nicht für Testmethoden. Überschriebene Methoden erben die JavaDoc der Oberklasse.</td></tr>
<tr><td>@throws</td><td>Jede Exception, die eine Methode werfen kann, wird dokumentiert, <strong>auch RuntimeExceptions</strong> (z. B. <code>@throws NullPointerException wenn betrag null ist</code>).</td></tr>
<tr><td>Attribute private</td><td>Immer. Einzige Ausnahme: statische Konstanten (<code>public static final</code>).</td></tr>
<tr><td>Keine ungültigen Werte</td><td>Konstruktoren und Setter prüfen ihre Parameter und werfen bei ungültigen Werten eine Exception. Attribute sind nie in einem unsinnigen Zustand, auch nicht direkt nach der Initialisierung.</td></tr>
<tr><td>Schnittstelle nicht ändern</td><td>Was nach außen sichtbar ist (Methodennamen, Parameter, Rückgabetypen), bleibt. Andere Klassen verlassen sich darauf.</td></tr>
<tr><td>Kein Copy&amp;Paste</td><td>Doppelter Code wird in eine Methode ausgelagert oder wiederverwendet (z. B. <code>toString()</code> ruft <code>toString(int)</code> auf).</td></tr>
<tr><td>Einheitliche Fehlerbehandlung</td><td>Gleiche Fehlersituationen werden überall gleich behandelt.</td></tr>
<tr><td>Ein-/Ausgabe trennen</td><td>Kein <code>System.out.println</code> in Verarbeitungsklassen wie Konto. Die Klasse liefert Ergebnisse, Ausgaben macht eine eigene Klasse (im Bankprojekt <code>EinAusgabe</code>).</td></tr>
<tr><td>Down-Casts vermeiden</td><td>Ein Cast auf eine Unterklasse ist meist ein Zeichen für fehlende Polymorphie. Ausnahme: <code>equals</code> nach der Typprüfung.</td></tr>
<tr><td>Liskov</td><td>Eine Unterklasse darf überall dort stehen, wo die Oberklasse erwartet wird, ohne dass sich für den Aufrufer etwas Unerwartetes ändert.</td></tr>
</table>

<h3>Namenskonventionen</h3>
<ul>
<li>Packages: klein, ein Wort (<code>mathematik</code>, nicht <code>Mathematik</code>).</li>
<li>Klassen: UpperCamelCase. Exceptions enden auf <code>Exception</code>. Testklassen: Klassenname + <code>Test</code> (<code>SparbuchTest</code>).</li>
<li>Statische Konstanten: <code>GROSS_MIT_UNTERSTRICH</code> (<code>NULL_EURO</code>, <code>ABHEBESUMME</code>).</li>
<li>Alles andere: lowerCamelCase. Getter <code>getX()</code>, bei boolean <code>isX()</code>, Setter <code>setX()</code>, und der Name dahinter passt genau zum Attribut.</li>
</ul>
<div class="box achtung"><b>Achtung</b><code>getnummer()</code> statt <code>getNummer()</code> ist ein echter Regelverstoß, kein Schönheitsfehler. Lokale Variablen beginnen klein: <code>double Betrag</code> ist falsch.</div>

<h2>Referenzen und Unveränderlichkeit</h2>
<p>Eine Objektvariable speichert eine <strong>Referenz</strong>, nicht das Objekt. <code>k2 = k1</code> kopiert nur die Referenz: Danach zeigen beide auf dasselbe Objekt. Java übergibt Parameter immer als Kopie (bei Objekten: Kopie der Referenz). <code>k = null</code> in einer Methode ändert also nichts beim Aufrufer, <code>k.einzahlen(...)</code> aber schon.</p>
<ul>
<li><code>==</code> bei Objekten: dieselbe Referenz? <code>equals</code>: gleicher Inhalt?</li>
<li><strong>Unveränderliche</strong> Klassen (Geldbetrag, LocalDate, String, Winkel): Attribute <code>private final</code>, keine Setter, Operationen liefern ein <strong>neues</strong> Objekt (<code>g.plus(h)</code> ändert g nicht). <code>d.plusDays(1);</code> ohne Zuweisung bewirkt also nichts.</li>
<li>Vorteil: Objekte können gefahrlos geteilt werden. Alle neuen Konten zeigen auf dasselbe <code>Geldbetrag.NULL_EURO</code>, und der hashCode bleibt stabil.</li>
</ul>

<h2>equals, hashCode, Comparable</h2>
<pre><code>@Override
public boolean equals(Object other) {
    if (this == other) return true;              // gleiche Referenz
    if (other == null) return false;             // Vertrag: nie gleich null
    if (this.getClass() != other.getClass()) return false;
    return this.nummer == ((Konto) other).nummer; // erst jetzt casten
}

@Override
public int hashCode() {
    return Objects.hash(this.nummer);            // dieselben Attribute wie equals
}</code></pre>
<ul>
<li>Parameter ist <code>Object</code>. Mit <code>equals(Konto k)</code> würde nur <strong>überladen</strong>, <code>@Override</code> meldet dann zum Glück einen Fehler.</li>
<li>Vertrag: <code>a.equals(b)</code> ⇒ <code>a.hashCode() == b.hashCode()</code>. Umgekehrt nicht: gleicher hashCode heißt nur „gleiches Fach“.</li>
<li>Wer equals überschreibt, muss hashCode überschreiben, sonst speichert ein <code>HashSet</code> gleiche Objekte doppelt.</li>
<li><code>Comparable&lt;Geldbetrag&gt;</code> legt die natürliche Ordnung fest. <code>compareTo</code> mit <code>Double.compare(a, b)</code>, nie mit <code>(int)(a - b)</code>: (int)(10.3 − 10.1) ist 0.</li>
</ul>
<h3>double-Fallen</h3>
<ul>
<li><code>1.0 / 0</code> ist <code>Infinity</code>, <code>0.0 / 0</code> ist <code>NaN</code>, keine Exception. Nur <code>1 / 0</code> (int) wirft <code>ArithmeticException</code>.</li>
<li><code>Double.isFinite(x)</code> schließt NaN und ±Infinity aus. Damit prüfen Konstruktoren wie Geldbetrag und Winkel.</li>
<li><code>0.1 + 0.2</code> ist <code>0.30000000000000004</code>. Berechnete double-Werte nie mit <code>==</code> vergleichen, in Tests mit Toleranz: <code>assertEquals(0.3, x, 1e-9)</code>.</li>
</ul>

<h2>static</h2>
<ul>
<li>Statische Attribute gehören der Klasse, nicht dem Objekt: ein gemeinsamer Zähler für alle Objekte.</li>
<li>Statische Initialisierung läuft <strong>einmal</strong> beim Laden der Klasse, in der Reihenfolge im Quelltext (Attribut-Initialisierer und <code>static { … }</code>-Blöcke von oben nach unten).</li>
<li>Ein <code>static final</code>-Attribut ohne Wert muss im statischen Block in <strong>jedem</strong> Zweig genau einmal gesetzt werden, das prüft der Compiler.</li>
<li>Wirft die statische Initialisierung eine Exception, kommt <code>ExceptionInInitializerError</code>, und die ganze Klasse ist unbenutzbar (Beispiel: <code>Vektor.NULL</code> mit <code>atan(0.0/0.0)</code>).</li>
</ul>

<h2>Exceptions</h2>
<h3>Wann werfen, und was?</h3>
<ol>
<li>Kann die Methode ihre Aufgabe erfüllen? Dann keine Exception.</li>
<li>Ist das Scheitern ein <strong>normaler, erwartbarer Ausgang</strong>? Dann über den Rückgabewert melden: <code>abheben</code> liefert <code>false</code>, wenn das Geld nicht reicht.</li>
<li>Hat der <strong>Aufrufer etwas falsch gemacht</strong>, das er hätte vermeiden können (null, negativer Betrag)? Dann eine unchecked Exception (RuntimeException).</li>
<li>Liegt es an <strong>Umständen, die der Aufrufer nicht verhindern kann</strong> und auf die er reagieren soll (Konto gesperrt)? Dann eine checked Exception mit <code>throws</code> (<code>GesperrtException</code>).</li>
</ol>
<table>
<tr><th>Situation</th><th>Exception</th></tr>
<tr><td>Parameter ist <code>null</code></td><td><code>NullPointerException</code></td></tr>
<tr><td>Parameter hat einen ungültigen Wert</td><td><code>IllegalArgumentException</code></td></tr>
<tr><td>Objekt ist im falschen Zustand für diese Methode</td><td><code>IllegalStateException</code></td></tr>
<tr><td>int-Division durch 0</td><td><code>ArithmeticException</code> (von Java selbst)</td></tr>
</table>
<h3>Die fünf Arten von Exception-Unsinn</h3>
<ol>
<li><strong>Selbst werfen und sofort fangen</strong>: Das ist ein verkapptes if. Problem direkt im if behandeln oder die Exception nach außen werfen.</li>
<li><strong>throws deklarieren und trotzdem fangen</strong>: Entweder fangen oder weiterwerfen, nicht beides.</li>
<li><strong>@throws für etwas, das nie passieren kann</strong>: Intern fangen; ein leerer catch ist hier erlaubt, aber mit Kommentar, warum.</li>
<li><strong>Checked Exception in eine nackte RuntimeException verpacken</strong>: Der Aufrufer verliert die Information. Besser mit throws weitergeben.</li>
<li><strong>Nur <code>e.printStackTrace()</code> im catch</strong>: Das Programm läuft weiter, als wäre nichts passiert. Echt reagieren oder weiterwerfen.</li>
</ol>
<div class="box merke"><b>Merke</b>Gemeinsamer Kern: Die Nachricht „Ich konnte meine Aufgabe nicht erledigen“ muss vollständig beim richtigen Empfänger ankommen.</div>
<h3>Stack Trace lesen</h3>
<p>Oberste <code>at</code>-Zeile: dort wurde geworfen. Darunter die Aufrufer, ganz unten <code>main</code>. Die tatsächliche Aufrufreihenfolge liest man also von unten nach oben. <code>getMessage()</code> liefert nur den Text, <code>printStackTrace()</code> schreibt alles auf <code>System.err</code>.</p>
<p><code>finally</code> läuft immer, auch nach einem <code>return</code> im try oder catch.</p>

<h2>Vererbung und Object</h2>
<ul>
<li>Eine Klasse mit abstrakter Methode muss selbst <code>abstract</code> sein (<code>public abstract class Konto</code>).</li>
<li><strong>Dynamische Bindung</strong>: Welche überschriebene Methode läuft, entscheidet die Klasse des Objekts zur Laufzeit, nicht der Variablentyp. <code>ausgebenAufDerKonsole()</code> aus Konto ruft bei einem Girokonto dessen <code>toString()</code> auf.</li>
<li><code>protected</code>: Unterklassen <strong>und</strong> alle Klassen im selben Package.</li>
<li>Methoden aus Object: <code>toString</code>, <code>equals</code>, <code>hashCode</code> (oft überschrieben); <code>getClass</code>, <code>wait</code>, <code>notify</code>, <code>notifyAll</code> sind final; <code>clone</code> ist protected.</li>
<li><code>@Override</code> lässt den Compiler prüfen, dass wirklich überschrieben wird.</li>
</ul>

<h2>Moderner switch</h2>
<pre><code>String text = switch (note) {
    case 1, 2 -> "gut";
    case 3, 4 -> {
        String t = "bestanden";
        yield t;               // Wert aus einem Block
    }
    default -> "durchgefallen";
};                             // Semikolon: es ist eine Zuweisung</code></pre>
<ul>
<li>Pfeil-Schreibweise: kein Durchfallen (fall-through), kein <code>break</code> nötig.</li>
<li>Ein switch-<em>Ausdruck</em> muss alle Fälle abdecken. Bei einem Enum ohne default meldet der Compiler jeden vergessenen neuen Wert.</li>
<li>Typ-Patterns: <code>case Girokonto g when g.getDispo()… -></code>. Spezielle Typen vor allgemeinen, sonst „dominierter case“.</li>
</ul>

<h2>Das Bankprojekt</h2>
<table>
<tr><th>Package</th><th>Klassen</th></tr>
<tr><td><code>bankprojekt.basisdaten</code></td><td><code>Konto</code> (abstrakt) ← <code>UeberweisungsfaehigesKonto</code> (abstrakt) ← <code>Girokonto</code> (mit Dispo); <code>Konto</code> ← <code>Sparbuch</code> (Zinssatz, Monatslimit 2000 €, Mindeststand 0,50 €, Kalender); <code>Kunde</code>; <code>Geldbetrag</code> (unveränderlich, <code>Comparable</code>, plus/minus/mal)</td></tr>
<tr><td><code>bankprojekt.exceptions</code></td><td><code>GesperrtException</code> (checked), <code>UngueltigeKontonummerException</code> (unchecked)</td></tr>
<tr><td><code>bankprojekt.nuetzliches</code></td><td><code>Kalender</code>: liefert das heutige Datum, im Test austauschbar</td></tr>
</table>
<p><code>abheben(Geldbetrag)</code> ist abstrakt in Konto, liefert <code>false</code>, wenn die Regeln des Kontotyps es verbieten, und wirft <code>GesperrtException</code> bei gesperrtem Konto.</p>

<h2>Übung 0 in Kürze</h2>
<h3>a) Vektor und Winkel</h3>
<ul>
<li>Polar → kartesisch: <code>x = r · cos φ</code>, <code>y = r · sin φ</code>, φ im <strong>Bogenmaß</strong> (<code>getWinkelImBogenmass()</code>).</li>
<li>Kartesisch → Winkel: <code>Math.atan2(y, x)</code>, nicht <code>atan(y / x)</code> (kennt den Quadranten nicht, NaN bei (0, 0)).</li>
<li>Unveränderlich: <code>private final</code>, <code>addieren</code> gibt einen neuen Vektor zurück.</li>
<li>Nullvektor hat keinen orthogonalen Einheitsvektor: <code>IllegalStateException</code>.</li>
<li>equals mit hashCode (<code>Objects.hash(x, y)</code>), toString() überschreiben.</li>
</ul>
<h3>b) Sparbuch testen</h3>
<ul>
<li>Der Fehler: Der Monats-Reset kam erst <strong>nach</strong> dem Hochzählen von <code>bereitsAbgehoben</code>. Die erste Abhebung eines Monats wurde dadurch wieder gelöscht, mehr als 2000 € pro Monat waren möglich. Lösung: Datum holen und zurücksetzen ganz an den Anfang.</li>
<li>Tests nach <strong>Arrange – Act – Assert</strong>, ein Verhalten pro Test, Grenzfälle (genau 2000 €, knapp darüber, Monats- und Jahreswechsel).</li>
<li>Ein Test muss an genau der zu prüfenden Regel scheitern können: Ohne vorheriges Einzahlen ist „2500 € abheben → false“ grün aus dem falschen Grund.</li>
<li>Exceptions testen: <code>assertThrows(IllegalArgumentException.class, () -&gt; s.abheben(new Geldbetrag(-1)));</code></li>
<li>Eclipse-Fehler „not accessible“ bei JUnit: <code>module-info.java</code> löschen, JUnit 5 auf den Classpath.</li>
</ul>
<div class="box merke"><b>So begründest du es in der Übung</b>Jede Änderung mit Regel + Folge: „Attribute private, sonst kann jede Klasse im Package den Vektor verändern und die Konstante NULL kaputtmachen.“</div>
`);
