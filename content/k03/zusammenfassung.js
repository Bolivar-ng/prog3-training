/* Kapitel 03 · Zusammenfassung Enums und Records (eigene Formulierungen, keine Folienkopien) */
P3.zusammenfassung('K03', 'K03 · Enums und Records', `
<p>Beide sparen viel Standardcode, aber für <strong>verschiedene Zwecke</strong>: Eine <strong>Enum</strong> ist eine feste, abgeschlossene Menge von Konstanten. Ein <strong>Record</strong> ist ein unveränderliches Datenobjekt, von dem man beliebig viele erzeugen kann.</p>

<table>
<tr><th></th><th>Enum</th><th>Record</th></tr>
<tr><td>Zweck</td><td>kleine Sammlung, die sich nie ändert</td><td>unveränderliche Daten bündeln</td></tr>
<tr><td>Objekte</td><td>genau die aufgezählten, kein <code>new</code></td><td>beliebig viele mit <code>new</code></td></tr>
<tr><td>erbt von</td><td><code>java.lang.Enum</code></td><td><code>java.lang.Record</code></td></tr>
<tr><td>beerbbar?</td><td>nein</td><td>nein (<code>final</code>)</td></tr>
<tr><td><code>implements</code>?</td><td>ja</td><td>ja</td></tr>
<tr><td>Beispiel</td><td><code>Kontoart</code>, <code>Wochentag</code></td><td><code>Geldbetrag</code>, <code>Punkt</code></td></tr>
</table>

<div class="box pruefung"><b>Für die Prüfung</b>Typische Fragen: Wofür ist eine Enum sinnvoll? Welchen Typ haben die Konstanten? Was ist in Enums bzw. Records erlaubt? Wie vergleicht man Enum-Konstanten sicher? Was gibt ein kompakter Konstruktor aus? Die Fragen mit dem Etikett <strong>prüfungsrelevant</strong> in den Serien decken genau diese Punkte ab.</div>

<h2>Enums</h2>
<h3>Wann eine Enum?</h3>
<p>Wenn die Menge <strong>klein, abgeschlossen und dauerhaft gleich</strong> ist: Wochentage, Monate, Himmelsrichtungen, Farben beim Kartenspiel, Temperatureinheiten. <strong>Keine</strong> Enum, wenn sich die Menge mit der Zeit ändert: angebotene Produkte, Feiertage (je Bundesland verschieden, neue kommen dazu), Fernsehsender, Mitarbeiter.</p>

<h3>Was der Compiler daraus macht</h3>
<pre><code>public enum Kontoart { GIRO, SPAR; }

// entspricht ungefähr:
public final class Kontoart extends Enum&lt;Kontoart&gt; {
    public static final Kontoart GIRO = new Kontoart();
    public static final Kontoart SPAR = new Kontoart();
    private Kontoart() { }
}</code></pre>
<ul>
<li>Jede Konstante ist ein <strong>Objekt vom Typ der Enum</strong> (hier <code>Kontoart</code>), kein <code>int</code> und kein <code>String</code>.</li>
<li>Die Konstanten sind <code>public static final</code>: Zugriff über den Enum-Namen, <code>Kontoart.GIRO</code>.</li>
<li>Es gibt pro Konstante <strong>genau ein</strong> Objekt. <code>new Kontoart()</code> ist ein Compilerfehler, auch innerhalb der Enum.</li>
<li>Eine Variable vom Enum-Typ darf leider auch <code>null</code> sein.</li>
</ul>

<h3>Attribute, Konstruktor, Methoden</h3>
<pre><code>public enum Kontoart {
    GIRO("Girokonto", 5.0),          // Konstante definieren = Konstruktor aufrufen
    SPAR("Sparbuch", 0.0);           // ; ist Pflicht, wenn danach noch etwas kommt

    private final String bezeichnung;
    private final double gebuehr;

    Kontoart(String bezeichnung, double gebuehr) {    // immer privat
        this.bezeichnung = bezeichnung;
        this.gebuehr = gebuehr;
    }

    public String getBezeichnung() { return bezeichnung; }
}</code></pre>
<ul>
<li>Der Konstruktor ist <strong>immer privat</strong>: ohne Modifizierer = automatisch privat, <code>public</code> oder <code>protected</code> = Compilerfehler.</li>
<li><code>super(...)</code> darf im Konstruktor <strong>nicht</strong> aufgerufen werden. Mehrere (überladene) Konstruktoren sind erlaubt.</li>
<li>Parameter im Konstruktor zu prüfen ist <strong>überflüssig</strong>: Aufgerufen wird er nur von den Konstanten, die man selbst in dieselbe Datei schreibt.</li>
<li>Attribute fast immer <code>final</code>, eine Konstante soll sich nicht ändern.</li>
<li>Erlaubt sind außerdem statische Methoden, normale Instanzmethoden, <code>toString()</code> überschreiben und abstrakte Methoden.</li>
<li>Weil man von einer Enum nicht erben kann, wirkt <code>protected</code> bei Attributen genau wie <strong>packageweit</strong>.</li>
</ul>

<h3>Jede Konstante mit eigener Implementierung</h3>
<pre><code>public enum Rechenart {
    PLUS  { @Override public int rechne(int a, int b) { return a + b; } },
    MINUS { @Override public int rechne(int a, int b) { return a - b; } };

    public abstract int rechne(int a, int b);    // gemeinsame Signatur
}</code></pre>
<p>Jeder Konstantenrumpf ist eine anonyme Unterklasse. Die abstrakte Methode in der Enum ist nötig, damit der Compiler <code>Rechenart.PLUS.rechne(…)</code> überhaupt zulässt: Er prüft den Aufruf über den statischen Typ <code>Rechenart</code>. Ohne sie wäre die Methode nur in der namenlosen Unterklasse vorhanden und von außen nicht aufrufbar.</p>

<h3>Geschenkte Methoden</h3>
<table>
<tr><th>Methode</th><th>Liefert</th><th>Hinweis</th></tr>
<tr><td><code>name()</code></td><td>Name der Konstanten, z. B. <code>"GIRO"</code></td><td>final</td></tr>
<tr><td><code>ordinal()</code></td><td>Position, <strong>ab 0</strong></td><td>final, ändert sich beim Umsortieren</td></tr>
<tr><td><code>compareTo(…)</code></td><td>Vergleich nach Definitionsreihenfolge</td><td>final, jede Enum ist <code>Comparable</code></td></tr>
<tr><td><code>equals</code>, <code>hashCode</code></td><td>wie <code>==</code></td><td>final</td></tr>
<tr><td><code>toString()</code></td><td>standardmäßig wie <code>name()</code></td><td>die <strong>einzige</strong>, die man überschreiben darf</td></tr>
<tr><td><code>getDeclaringClass()</code></td><td>die Enum-Klasse</td><td>auch bei Konstanten mit eigenem Rumpf</td></tr>
<tr><td><code>static valueOf(String)</code></td><td>Konstante zum Namen</td><td>unbekannter Name → <code>IllegalArgumentException</code></td></tr>
<tr><td><code>static values()</code></td><td>Array aller Konstanten</td><td>jeder Aufruf liefert eine <strong>neue Kopie</strong></td></tr>
</table>

<h3>Vergleichen und durchlaufen</h3>
<pre><code>if (art == Kontoart.GIRO) { … }          // == ist richtig und null-sicher

String text = switch (art) {
    case GIRO -> "laufend";                // im case ohne "Kontoart."
    case SPAR -> "sparen";
};

for (Kontoart k : Kontoart.values()) { … }</code></pre>
<div class="box achtung"><b>Achtung</b><code>art.equals(Kontoart.GIRO)</code>, <code>art.name().equals(…)</code> und <code>art.toString().equals(…)</code> werfen eine <code>NullPointerException</code>, wenn <code>art</code> null ist. Bei <code>toString</code> kommt hinzu, dass es überschrieben sein kann.</div>
<div class="box merke"><b>Merke</b>Eine Enum kann weder erben noch beerbt werden. Braucht man eine Enum, die nur eine Konstante mehr hat, schreibt man sie komplett neu. Gemeinsamkeiten höchstens über ein Interface.</div>

<h2>Records</h2>
<h3>Aufbau</h3>
<pre><code>/**
 * Geldbetrag in einer Währung
 * @param betrag Höhe des Betrags
 * @param waehrung Währungskürzel, z. B. EUR
 */
public record Geldbetrag(double betrag, String waehrung) { }</code></pre>
<p><code>betrag</code> und <code>waehrung</code> heißen <strong>Komponenten</strong>. Die JavaDoc beschreibt sie mit <code>@param</code> direkt am Record.</p>

<h3>Was der Compiler erzeugt</h3>
<ul>
<li><code>public final class Geldbetrag extends Record</code>: kein Erben möglich.</li>
<li>Für jede Komponente ein <code>private final</code>-Attribut.</li>
<li>Den <strong>kanonischen Konstruktor</strong> mit allen Komponenten als Parametern.</li>
<li>Zugriffsmethoden <strong>ohne get</strong>: <code>betrag()</code>, <code>waehrung()</code>.</li>
<li><code>equals</code> und <code>hashCode</code> über alle Komponenten, <code>toString</code> im Format <code>Geldbetrag[betrag=2.5, waehrung=EUR]</code>.</li>
</ul>
<p>Es gibt <strong>keinen</strong> parameterlosen Konstruktor und <strong>keine</strong> Setter.</p>

<h3>Was in den geschweiften Klammern erlaubt ist</h3>
<table>
<tr><th>erlaubt</th><th>verboten</th></tr>
<tr><td>statische Konstanten und Attribute (auch veränderliche)</td><td>weitere <strong>Instanzattribute</strong></td></tr>
<tr><td>statische Methoden und Instanzmethoden</td><td>abstrakte Methoden</td></tr>
<tr><td>weitere Konstruktoren (beliebige Sichtbarkeit)</td><td>Setter, die ein Attribut ändern</td></tr>
<tr><td>erzeugte Methoden ersetzen (mit <code>@Override</code>)</td><td><code>extends</code></td></tr>
<tr><td><code>implements</code> beliebig vieler Interfaces</td><td></td></tr>
</table>

<h3>Kompakter Konstruktor</h3>
<pre><code>public Geldbetrag {                          // keine Klammern, keine Parameterliste
    if (Double.isNaN(betrag)) {
        throw new IllegalArgumentException("Betrag ungültig");
    }
    if (waehrung == null) {
        waehrung = "EUR";                    // Parameter ändern ist erlaubt
    }
}                                            // HIER ergänzt der Compiler die Zuweisungen</code></pre>
<ul>
<li>Er ersetzt den kanonischen Konstruktor. Die Parameter heißen automatisch wie die Komponenten.</li>
<li>Sichtbarkeit mindestens wie der Record selbst.</li>
<li>Die Zuweisungen an die Attribute kommen automatisch <strong>am Ende</strong>. Darum gilt im kompakten Konstruktor: <code>betrag</code> ist der Parameter, <code>betrag()</code> liefert noch den Standardwert (0.0 bzw. null), <code>this.betrag</code> lesen ist ein Compilerfehler.</li>
</ul>

<h3>Weitere Konstruktoren</h3>
<pre><code>public Geldbetrag(double betrag) {
    this(betrag, "EUR");          // Pflicht: zuerst einen vorhandenen Konstruktor aufrufen
}</code></pre>
<p><code>this.betrag = …</code> direkt zuzuweisen ist verboten.</p>

<h3>Unveränderlich, aber nur flach</h3>
<p>Die Attribute sind final, auch Reflection kann sie nicht ändern. Ist eine Komponente aber selbst veränderlich (z. B. eine <code>List</code>), kann man deren Inhalt trotzdem ändern. Deshalb die Datentypen der Komponenten passend wählen. Eine Klasse mit Settern (wie <code>Kunde</code>) oder einem Zustand, der sich ändert (wie <code>Konto</code>), ist kein Fall für einen Record.</p>
`);
