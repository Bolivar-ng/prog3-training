/* Kapitel 06 · Zusammenfassung Mocking mit Mockito (eigene Formulierungen und Beispiele, keine Folienkopien) */
P3.zusammenfassung('K06', 'K06 · Mocking mit Mockito', `
<p>Mockito ist eine <strong>Ergänzung zu JUnit</strong>, kein Ersatz. Damit testet man eine Klasse <strong>unabhängig</strong> von den Klassen, die sie benutzt: Die Partnerobjekte werden durch <strong>Mock-Objekte</strong> (Attrappen) ersetzt.</p>

<div class="box pruefung"><b>Für die Prüfung</b>Typische Fragen: Wozu Mocks? Welche Eigenschaften hat ein Mock-Objekt? Was liefert eine nicht eingerichtete Methode? Wie richtet man eine <code>void</code>-Methode zum Werfen ein? Was prüft <code>verify(mock).methode(x)</code> genau? Was ist an gemischten ArgumentMatchern falsch? Warum muss eine Abhängigkeit von außen gesetzt werden können? Warum mockt man nie die getestete Klasse?</div>

<h2>1. Das Problem: Abhängigkeiten</h2>
<p>Eine gute Klasse ist für <strong>eine</strong> Aufgabe zuständig und gibt alles andere an andere Objekte weiter. Beim Testen heißt das: Schlägt ein Test fehl, ist unklar, ob der Fehler in der getesteten Klasse oder in einem Partner steckt.</p>
<ul>
<li><strong>Konto → Kunde:</strong> Konto speichert den Kunden nur, rechnet aber nicht mit ihm. Das ist unproblematisch.</li>
<li><strong>Bank → Konto:</strong> <code>geldAbheben</code>, <code>geldUeberweisen</code> … stimmen nur, wenn <code>Konto.abheben</code> stimmt. Das ist problematisch.</li>
</ul>
<p>Weitere Gründe für ein Mock: Der Partner ist <strong>noch nicht fertig</strong>, <strong>langsam</strong> (Datenbank, Netz), liefert <strong>nicht reproduzierbare</strong> Ergebnisse (Zufall, aktuelles Datum) oder würde <strong>echte Dinge tun</strong>, die ein Test nicht darf.</p>

<h2>2. Was ist ein Mock-Objekt?</h2>
<p><em>to mock</em> = vortäuschen. Ein Mock ist wie ein <strong>Stuntman</strong>: sieht aus wie das Original, ist es aber nicht.</p>
<table>
<tr><th>Eigenschaft</th><th>Bedeutung</th></tr>
<tr><td>gleiche Schnittstelle</td><td>dieselben Methoden wie das echte Objekt, hat dessen Typ und passt überall, wo es verlangt wird</td></tr>
<tr><td>kein echter Code</td><td>die Methoden tun nichts Echtes</td></tr>
<tr><td>vordefinierte Werte</td><td>liefert die Rückgaben, die der <strong>Test</strong> festlegt</td></tr>
<tr><td>protokolliert</td><td>merkt sich, welche Methoden mit welchen Parametern wie oft aufgerufen wurden</td></tr>
</table>

<h2>3. Aufbau eines Tests</h2>
<pre><code>@Test
void situationsbeschreibung() {   // aussagekräftiger Name
    // SetUp:    Testobjekt + Mocks so einrichten, wie die Situation es braucht
    // Exercise: die zu testende Methode aufrufen (mit echten Werten)
    // Verify:   Rückgabewerte UND Nebeneffekte (auf den Mocks) prüfen
    // TearDown: ggf. aufräumen
}</code></pre>
<p>Testcode soll einfach sein: keine unnötigen Schleifen oder Verzweigungen.</p>

<h2>4. Das Beispiel für alles Weitere</h2>
<pre><code>public interface Kasse {
    int getKontostand();
    void auszahlen(int betrag);
}
public class Automat {
    private final Kasse kasse;
    public Automat(Kasse kasse) { this.kasse = kasse; }      // Abhängigkeit von außen
    public boolean rueckgeld(int b) {
        if (kasse.getKontostand() &lt; b) return false;
        kasse.auszahlen(b);
        return true;
    }
}</code></pre>

<h2>5. Mock erzeugen</h2>
<p>Dependency in der pom.xml: <code>org.mockito : mockito-core</code>, <code>&lt;scope&gt;test&lt;/scope&gt;</code>.</p>
<pre><code>Kasse kasse = Mockito.mock();          // Typ kommt aus der Variablen links

// oder mit Annotation:
@Mock private Kasse kasse;
@BeforeEach void setUp() { MockitoAnnotations.openMocks(this); }   // erzeugt alle @Mock-Attribute</code></pre>

<h2>6. Mock einrichten (Stubbing)</h2>
<p>Den <strong>Zustand</strong> eines Objekts erkennt man nur an den Rückgabewerten seiner Methoden. Legt man sie fest, simuliert man jeden gewünschten Zustand.</p>
<pre><code>Mockito.when(kasse.getKontostand()).thenReturn(42);          // immer 42
Mockito.when(kasse.getKontostand()).thenReturn(50, 20, 0);   // 50, dann 20, dann (immer) 0
Mockito.when(kasse.getKontostand()).thenThrow(new IllegalStateException());

Mockito.doThrow(new IllegalStateException()).when(kasse).auszahlen(10);   // void-Methode!</code></pre>
<ul>
<li><strong>Nicht eingerichtete Methoden</strong> liefern <code>0</code>, <code>0.0</code>, <code>false</code>, <code>null</code> oder eine <strong>leere Collection</strong>.</li>
<li>Bei <code>void</code>-Methoden geht <code>when(mock.methode())</code> nicht, weil <code>when</code> einen Rückgabewert als Argument braucht. Also umgekehrt: erst <code>doThrow(…)</code>, dann <code>.when(mock)</code>, dann <code>.methode(…)</code>.</li>
<li><code>thenAnswer(…)</code> führt beim Aufruf eigenen Code aus (selten nötig).</li>
</ul>

<h2>7. Aufrufe prüfen (Verifikation)</h2>
<p>Bei Mocks prüft man nicht die <strong>Auswirkung</strong> („ist der Kontostand kleiner?“, den gibt es ja nicht), sondern <strong>ob der Aufruf stattfand</strong>: richtige Methode, richtige Parameter, richtige Anzahl.</p>
<pre><code>Mockito.verify(kasse).auszahlen(10);                          // genau 1-mal, genau mit 10
Mockito.verify(kasse, Mockito.times(2)).getKontostand();      // genau 2-mal
Mockito.verify(kasse, Mockito.atLeast(1)).getKontostand();    // mindestens 1-mal
Mockito.verify(kasse, Mockito.atMost(3)).getKontostand();     // höchstens 3-mal
Mockito.verify(kasse, Mockito.times(0)).auszahlen(10);        // nie (auch: Mockito.never())
Mockito.verify(kasse, Mockito.only()).getKontostand();        // nur diese eine Methode
Mockito.verifyNoInteractions(kasse);       // überhaupt nichts aufgerufen
Mockito.verifyNoMoreInteractions(kasse);   // außer den bereits verifizierten nichts</code></pre>
<p>JUnit-Prüfungen (<code>assertEquals</code>, <code>assertThrows</code> …) bleiben dazu nötig.</p>

<h2>8. ArgumentMatchers</h2>
<pre><code>Mockito.when(kasse.pruefe(ArgumentMatchers.anyInt())).thenReturn(true);   // für jede Zahl
Mockito.verify(kasse).auszahlen(ArgumentMatchers.anyInt());               // mit irgendeiner Zahl?</code></pre>
<p>Beispiele: <code>anyInt()</code>, <code>anyBoolean()</code> …, <code>anyList()</code>, <code>anyMap()</code> …, <code>anyString()</code>, <code>contains("x")</code>, <code>startsWith</code>, <code>endsWith</code>, <code>matches("Regex")</code>, <code>any()</code>, <code>isNull()</code>, <code>isNotNull()</code>, <code>isA(K.class)</code>, <code>eq(wert)</code>, eigene Prüfung mit <code>argThat(m)</code>.</p>
<div class="box achtung"><b>Alle Parameter mit Matchern oder keiner!</b><code>verify(bank).ueberweisen(anyLong(), 500)</code> ist falsch, richtig ist <code>verify(bank).ueberweisen(anyLong(), eq(500))</code>. Nur dafür gibt es <code>eq</code>.</div>

<h2>9. ArgumentCaptor</h2>
<p><code>verify(mock).methode(any())</code> sagt nur, <strong>dass</strong> aufgerufen wurde. Will man prüfen, <strong>womit</strong>, und erzeugt der getestete Code das Parameterobjekt erst selbst, fängt man es ein:</p>
<pre><code>ArgumentCaptor&lt;Geldbetrag&gt; captor = ArgumentCaptor.forClass(Geldbetrag.class);
Mockito.verify(konto).abheben(captor.capture());
assertEquals(new Geldbetrag(100), captor.getValue());</code></pre>
<p>Matcher und Captor nur beim Einrichten und Prüfen, <strong>nie in der Exercise-Phase</strong>.</p>

<h2>10. Reihenfolge</h2>
<pre><code>InOrder order = Mockito.inOrder(von, nach);
order.verify(von).abheben(…);      // erst das …
order.verify(nach).einzahlen(…);   // … dann das, sonst schlägt der Test fehl</code></pre>
<p>Selten gebraucht: <code>Mockito.mock(Mockito.withSettings().extraInterfaces(I.class))</code> erzeugt ein Mock, das zusätzlich ein Interface implementiert.</p>

<h2>11. Voraussetzung: Dependency Injection</h2>
<p>Ein Mock lässt sich nur unterschieben, wenn die Klasse ihre Abhängigkeit <strong>von außen</strong> bekommt: über Konstruktor, Setter oder eine Einfüge-Methode. Erzeugt sie sie selbst (<code>new EchteKasse()</code>), ist sie so nicht mit Mocks testbar.</p>
<ul>
<li>Lockere Bindung: Partnerobjekte sollen austauschbar sein.</li>
<li>Eine Klasse soll nur <strong>einen</strong> Grund haben, sich zu ändern.</li>
<li>Gegen ein <strong>Interface</strong> programmieren, nicht gegen eine konkrete Klasse.</li>
</ul>

<h2>12. Typische Fallen</h2>
<table>
<tr><th>Falle</th><th>Was passiert</th><th>Richtig</th></tr>
<tr><td><code>when</code> nach dem Aufruf</td><td>wirkt nicht mehr, das Mock lieferte schon den Standardwert</td><td>erst einrichten, dann aufrufen</td></tr>
<tr><td>„unbekannt“ nicht eingerichtet</td><td><code>int</code>-Methode liefert <strong>0</strong>, nicht <code>-1</code></td><td>Sonderwerte ausdrücklich mit <code>thenReturn</code> setzen</td></tr>
<tr><td><code>when</code> auf dem echten Testobjekt</td><td>Fehlermeldung, <code>when</code> braucht einen Mock-Aufruf</td><td>getestete Klasse aufrufen und Ergebnis prüfen</td></tr>
<tr><td><code>verify(m).x()</code> für „nichts passiert“</td><td>prüft genau <strong>einmal</strong>, also das Gegenteil</td><td><code>verify(m, never()).x(any…)</code> oder <code>verifyNoInteractions(m)</code></td></tr>
<tr><td><code>never()</code> mit festem Wert</td><td>prüft nur diesen einen Wert</td><td><code>never()</code> zusammen mit Matchern wie <code>anyInt()</code></td></tr>
<tr><td>Objekt ohne <code>equals</code> im <code>verify</code></td><td>nur dieselbe Referenz passt, der Test ist rot</td><td><strong>ArgumentCaptor</strong> und die Werte einzeln prüfen (Records haben <code>equals</code>)</td></tr>
<tr><td>Mocks als <code>static</code>-Konstante</td><td>Aufrufe aus anderen Tests zählen mit</td><td>Mocks im <code>@BeforeEach</code> frisch erzeugen</td></tr>
</table>
<pre><code>ArgumentCaptor&lt;Bon&gt; captor = ArgumentCaptor.forClass(Bon.class);
Mockito.verify(drucker).drucken(captor.capture());   // fängt den echten Bon ab
assertEquals(570, captor.getValue().getSumme());      // getValue = letzter Wert, getAllValues = alle</code></pre>
<p>Ein Mock einer <strong>Klasse</strong> ist ein Objekt einer Unterklasse: Ein <code>Sparbuch</code>-Mock ist ein <code>Konto</code>, aber kein <code>UeberweisungsfaehigesKonto</code>. So testet man, dass eine Methode bestimmte Kontoarten ablehnt. Das Einrichten im <code>setUp</code> zählt <strong>nicht</strong> als Interaktion für <code>verifyNoInteractions</code>.</p>
<div class="box merke"><b>Merke</b>Ein roter Test heißt nicht automatisch, dass der Code falsch ist: Lies jede <code>verify</code>-Zeile als Satz („prüfe, dass … einmal aufgerufen wurde“) und vergleiche ihn mit der Situation. Und: Gute Tests prüfen auch die <strong>Nebeneffekte</strong>. Erst <code>verifyNoInteractions</code> zeigt, dass trotz richtiger Rückgabe schon Ware entnommen oder Geld abgebucht wurde.</div>

<h2>Spickzettel: die 5 Schritte</h2>
<ol>
<li><strong>Erzeugen:</strong> <code>Kasse m = Mockito.mock();</code></li>
<li><strong>Einrichten:</strong> <code>when(m.x()).thenReturn(…)</code> bzw. <code>doThrow(…).when(m).x()</code></li>
<li><strong>Übergeben:</strong> <code>new Automat(m)</code></li>
<li><strong>Aufrufen:</strong> <code>automat.rueckgeld(10)</code></li>
<li><strong>Prüfen:</strong> <code>verify(m).auszahlen(10)</code> + JUnit-Asserts</li>
</ol>
<div class="box merke"><b>Merke</b>Gemockt wird, was <strong>nicht</strong> getestet wird und worauf man sich nicht verlassen kann (z. B. Konten mit künftigen Unterklassen). Einfache Wertklassen wie <code>Geldbetrag</code> darf man echt verwenden. <strong>Nie die Klasse mocken, die man testet</strong>, sonst testet man nur das Mock.</div>
`);
