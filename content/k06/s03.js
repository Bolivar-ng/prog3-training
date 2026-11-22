/* Kapitel 06 · Serie S03: Fortgeschritten – Fehler finden mit Mocks, ArgumentCaptor, Reihenfolge, typische Fallen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Die Java-Teile wurden kompiliert und die Kassenlogik mit Fakes ausgeführt;
   das Verhalten von Mockito entspricht der Mockito-Dokumentation. */
P3.serie({
  id: 'K06-S03',
  kapitel: 'K06',
  titel: 'Fortgeschritten: Fehler finden, Captor, Reihenfolge, Fallen',
  beschreibung: 'Eine Kantinenkasse mit drei gemockten Partnern: Tests, die echte Fehler aufdecken, ArgumentCaptor für Objekte ohne equals, InOrder. Dazu die typischen Fallen beim Verifizieren und Einrichten.',
  neu: true,
  minutenProFrage: 2.5,
  themen: [
    { id: 'fall',  name: 'Fallaufgabe Kantinenkasse' },
    { id: 'falle', name: 'Typische Fallen' }
  ],
  faelle: [
    { id: 'K', titel: 'Kantinenkasse mit drei Partnern',
      text: `Eine **Kantinenkasse** rechnet eine Liste von Artikeln ab. Sie arbeitet mit drei Partnern zusammen, die sie über den **Konstruktor** bekommt: einer **Preisliste**, einem **Bondrucker** und dem **Warenbestand**.

Laut JavaDoc soll \`abrechnen\` so arbeiten: Sind **alle** Artikel bekannt, wird jeder Artikel einmal aus dem Bestand entnommen und **danach genau ein Bon** mit allen Posten und der Summe gedruckt. Ist ein Artikel unbekannt (Preis \`-1\`) oder die Liste leer, wird **nichts entnommen und nichts gedruckt**, und die Methode liefert \`-1\`.

Die Implementierung unten hält sich nicht in jedem Fall an diesen Vertrag. Gute Tests sollen genau das aufdecken.`,
      code: `public interface Preisliste {
    int preisVon(String artikel);        // Preis in Cent, -1 = unbekannt
}
public interface Bondrucker {
    void drucken(Bon bon);
}
public interface Warenbestand {
    void entnehmen(String artikel);
}

public class Bon {                        // einfache Datenklasse, KEIN equals/hashCode
    private final List<String> posten;
    private final int summe;
    public Bon(List<String> posten, int summe) {
        this.posten = List.copyOf(posten);
        this.summe = summe;
    }
    public List<String> getPosten() { return posten; }
    public int getSumme() { return summe; }
}

public class Kantinenkasse {
    private final Preisliste preise;
    private final Bondrucker drucker;
    private final Warenbestand bestand;

    public Kantinenkasse(Preisliste preise, Bondrucker drucker, Warenbestand bestand) {
        this.preise = preise;
        this.drucker = drucker;
        this.bestand = bestand;
    }

    public int abrechnen(List<String> artikel) {
        int summe = 0;
        List<String> posten = new ArrayList<>();
        for (String a : artikel) {
            int preis = preise.preisVon(a);
            if (preis < 0)
                return -1;
            summe += preis;
            posten.add(a);
            bestand.entnehmen(a);
        }
        drucker.drucken(new Bon(posten, summe));
        return summe;
    }
}` }
  ],
  fragen: [

    { id: 'K06-S03-F01', sec: 'fall', fall: 'K', type: 'multi', wichtig: true, t: 'K1 · Was wird gemockt?',
      prompt: 'Die `Kantinenkasse` soll getestet werden. Welche Objekte ersetzt man im Test durch Mocks?',
      options: [
        '`Preisliste`: Der Test will selbst festlegen, welcher Artikel was kostet.',
        '`Bondrucker`: Am Aufruf von `drucken` sieht man, ob und welcher Bon entsteht.',
        '`Warenbestand`: Man prüft, welche Artikel entnommen werden.',
        '`Kantinenkasse`: Dann läuft `abrechnen` im Test schneller ab.',
        '`Bon`: Dann kann man `getSumme()` mit `when` auf einen Wert festlegen.'
      ],
      answer: [0, 1, 2],
      explain: 'Gemockt werden die **Partner**, die nicht getestet werden. Die Kasse selbst ist die getestete Klasse und muss echt bleiben, sonst läuft kein echter Code. `Bon` ist eine einfache Datenklasse, die die Kasse selbst erzeugt: Ein Mock davon käme gar nicht in die Kasse hinein.' },

    { id: 'K06-S03-F02', sec: 'fall', fall: 'K', type: 'fill', wichtig: true, t: 'K2 · Die Testklasse einrichten',
      prompt: 'Ergänze das `setUp`. In allen Tests soll eine Suppe 250 Cent kosten.',
      code: `private Preisliste preise;
private Bondrucker drucker;
private Warenbestand bestand;
private Kantinenkasse kasse;

@BeforeEach
void setUp() {
    preise = Mockito.[[0]]();
    drucker = Mockito.mock();
    bestand = Mockito.mock();
    kasse = [[1]];
    Mockito.when(preise.preisVon("Suppe")).[[2]](250);
}`,
      blanks: [
        { options: ['spy', 'mock', 'when', 'verify'], answer: 1,
          why: '`Mockito.mock()` erzeugt das Mock. Der Typ ergibt sich aus der Variablen links (`Preisliste`).' },
        { options: ['Mockito.mock()', 'new Kantinenkasse()', 'new Kantinenkasse(preise, drucker, bestand)', 'Mockito.spy(Kantinenkasse.class)'], answer: 2,
          why: 'Die getestete Klasse ist **echt**, und die Mocks kommen über den Konstruktor hinein (Dependency Injection).' },
        { options: ['doReturn', 'returns', 'thenAnswer', 'thenReturn'], answer: 3,
          why: '`when(mock.methode(…)).thenReturn(wert)` richtet die Rückgabe ein.' }
      ],
      explain: 'Das `setUp` läuft vor **jedem** Test. Jeder Test bekommt also frische Mocks, die noch keine Aufrufe gezählt haben.' },

    { id: 'K06-S03-F03', sec: 'fall', fall: 'K', type: 'mc', wichtig: true, t: 'K3 · Unbekannt ist nicht 0',
      prompt: 'Ein Test ruft `kasse.abrechnen(List.of("Kuchen"))` auf, **ohne** `preisVon("Kuchen")` einzurichten. Er erwartet, dass nichts gedruckt wird. Was passiert wirklich?',
      options: [
        'Das Mock liefert `-1`, weil Kuchen nicht eingerichtet ist, und die Kasse bricht ab.',
        'Mockito wirft eine Exception, weil `preisVon("Kuchen")` nicht eingerichtet wurde.',
        'Das Mock liefert `0`: Die Kasse hält Kuchen für gratis und druckt einen Bon.',
        'Das Mock liefert `null`, und beim Rechnen fliegt eine NullPointerException.'
      ],
      answer: 2,
      explain: 'Eine nicht eingerichtete `int`-Methode liefert **0**, ohne Fehlermeldung. Für die Kasse ist Kuchen dann ein Artikel für 0 Cent: Sie entnimmt ihn und druckt einen Bon über 0 Cent. Wer „unbekannt“ testen will, muss es ausdrücklich einrichten: `when(preise.preisVon("Kuchen")).thenReturn(-1)`.' },

    { id: 'K06-S03-F04', sec: 'fall', fall: 'K', type: 'mc', wichtig: true, t: 'K4 · Warum findet verify den Bon nicht?',
      prompt: 'Nach `kasse.abrechnen(List.of("Suppe"))` schlägt diese Zeile fehl, obwohl genau so ein Bon gedruckt wurde:\n`Mockito.verify(drucker).drucken(new Bon(List.of("Suppe"), 250));`\nWarum?',
      options: [
        '`verify` vergleicht die Parameter mit `equals`; `Bon` hat keins, also zählt nur dieselbe Referenz.',
        'In `verify` dürfen keine neuen Objekte stehen, nur feste Werte und ArgumentMatchers.',
        'Bei `void`-Methoden wie `drucken` prüft `verify` grundsätzlich keine Parameter.',
        'Der Bon im Test ist jünger als der gedruckte, Mockito vergleicht die Erzeugungszeit.'
      ],
      answer: 0,
      explain: 'Mockito prüft feste Parameter mit `equals`. Ohne eigenes `equals` gilt das geerbte aus `Object`, also **Identität**. Der Bon im Test ist ein anderes Objekt als der Bon in der Kasse. Lösung: den tatsächlich übergebenen Bon mit einem **ArgumentCaptor** abfangen und seine Werte prüfen. Bei einem `record` wäre das kein Problem, der hat `equals` automatisch.' },

    { id: 'K06-S03-F05', sec: 'fall', fall: 'K', type: 'fill', wichtig: true, t: 'K5 · Den Bon mit einem Captor prüfen',
      prompt: 'Ergänze den Test: Er fängt den gedruckten Bon ab und prüft Posten und Summe. (Suppe = 250 kommt aus dem `setUp`.)',
      code: `@Test
void bonEnthaeltAllePosten() {
    Mockito.when(preise.preisVon("Salat")).thenReturn(320);
    kasse.abrechnen(List.of("Suppe", "Salat"));

    ArgumentCaptor<Bon> captor = ArgumentCaptor.[[0]](Bon.class);
    Mockito.verify(drucker).drucken(captor.[[1]]());
    Bon bon = captor.[[2]]();
    assertEquals(List.of("Suppe", "Salat"), bon.getPosten());
    assertEquals(570, bon.getSumme());
}`,
      blanks: [
        { options: ['of', 'capture', 'forClass', 'mock'], answer: 2,
          why: '`ArgumentCaptor.forClass(Bon.class)` erzeugt einen Captor für Parameter vom Typ `Bon`.' },
        { options: ['capture', 'getValue', 'any', 'forClass'], answer: 0,
          why: 'Im `verify` steht `captor.capture()` an der Stelle des Parameters. Es wirkt wie ein Matcher und merkt sich den echten Wert.' },
        { options: ['capture', 'getAllValues', 'get', 'getValue'], answer: 3,
          why: '`getValue()` liefert den abgefangenen Wert (bei mehreren Aufrufen den letzten). `getAllValues()` liefert eine Liste.' }
      ],
      explain: 'Der Captor löst das `equals`-Problem: Man vergleicht nicht den Bon als Ganzes, sondern seine **Werte**. `List.of(…)` und die Liste im Bon sind mit `equals` gleich, weil Listen nach Inhalt verglichen werden. `verify` prüft hier gleichzeitig, dass **genau ein** Bon gedruckt wurde.' },

    { id: 'K06-S03-F06', sec: 'fall', fall: 'K', type: 'order', wichtig: true, t: 'K6 · Erst entnehmen, dann drucken',
      prompt: 'Der Test soll prüfen: Erst werden Suppe und Salat entnommen, **danach** wird gedruckt. Die Zeile `InOrder ablauf = Mockito.inOrder(bestand, drucker);` steht direkt vor den Prüfungen. Bringe die Zeilen in die richtige Reihenfolge.',
      items: [
        'Mockito.when(preise.preisVon("Salat")).thenReturn(320);',
        'kasse.abrechnen(List.of("Suppe", "Salat"));',
        'ablauf.verify(bestand).entnehmen("Suppe");',
        'ablauf.verify(bestand).entnehmen("Salat");',
        'ablauf.verify(drucker).drucken(ArgumentMatchers.any());'
      ],
      explain: 'Einrichten **vor** dem Aufruf, prüfen **danach**. Bei `InOrder` muss auch die Reihenfolge der `verify`-Zeilen dem erwarteten Ablauf entsprechen. Ein `InOrder` über **zwei** Mocks prüft die Reihenfolge auch zwischen ihnen.' },

    { id: 'K06-S03-F07', sec: 'fall', fall: 'K', type: 'multi', wichtig: true, t: 'K7 · Welche Tests decken einen Fehler auf?',
      prompt: 'Diese Tests werden gegen die gezeigte `abrechnen`-Implementierung ausgeführt. Welche werden **rot** und zeigen damit einen Fehler im Code? (Unbekannte Artikel sind jeweils mit `-1` eingerichtet.)',
      options: [
        'Suppe und Salat: Rückgabe 570, genau ein Bon mit beiden Posten.',
        'Suppe, dann Kuchen (unbekannt): Rückgabe -1 und `verify(bestand, never()).entnehmen(anyString())`.',
        'Leere Liste: Rückgabe -1 und `verifyNoInteractions(drucker, bestand)`.',
        'Nur Kuchen (unbekannt): Rückgabe -1 und `verifyNoInteractions(drucker, bestand)`.',
        'Suppe und Salat: mit `InOrder` erst beide `entnehmen`, dann `drucken`.'
      ],
      answer: [1, 2],
      explain: '**Fehler 1:** Die Kasse entnimmt jeden Artikel **sofort** in der Schleife. Bei Suppe und Kuchen ist die Suppe schon entnommen, wenn der Kuchen als unbekannt auffällt. **Fehler 2:** Bei einer leeren Liste läuft die Schleife gar nicht; die Kasse druckt einen leeren Bon und liefert 0 statt -1. Steht der unbekannte Artikel an **erster** Stelle, bricht die Kasse ab, bevor sie etwas entnimmt. Dieser Test bleibt grün und findet den Fehler deshalb nicht. Darum testet man auch „unbekannt an späterer Stelle“.' },

    { id: 'K06-S03-F08', sec: 'fall', fall: 'K', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 6, t: 'K8 · Test schreiben und Code korrigieren',
      prompt: 'Schreibe den Test „Suppe, dann unbekannter Kuchen“: Rückgabe -1, nichts entnommen, nichts gedruckt. Erkläre dann, wie `abrechnen` geändert werden muss, damit dieser Test **und** der Test für die leere Liste grün werden.',
      model: 'Test: (1) Kuchen ausdrücklich auf -1 einrichten, sonst liefert das Mock 0. (2) Rückgabe mit `assertEquals(-1, …)` prüfen. (3) `verifyNoInteractions(bestand, drucker)`: Der Bestand darf nicht angefasst werden. Die Preisliste darf dagegen gefragt werden, sie gehört nicht in diese Prüfung. Korrektur: zuerst **alle** Preise ermitteln und prüfen, erst danach in einer zweiten Schleife entnehmen; eine leere Liste gleich zu Beginn mit -1 ablehnen. Erst dann wird gedruckt.',
      modelCode: `@Test
void unbekannterArtikelAnZweiterStelle() {
    Mockito.when(preise.preisVon("Kuchen")).thenReturn(-1);

    int summe = kasse.abrechnen(List.of("Suppe", "Kuchen"));

    assertEquals(-1, summe);
    Mockito.verifyNoInteractions(bestand, drucker);
}

// korrigierte Methode
public int abrechnen(List<String> artikel) {
    if (artikel.isEmpty())
        return -1;
    int summe = 0;
    for (String a : artikel) {          // 1. nur prüfen und rechnen
        int preis = preise.preisVon(a);
        if (preis < 0)
            return -1;
        summe += preis;
    }
    for (String a : artikel)            // 2. erst jetzt entnehmen
        bestand.entnehmen(a);
    drucker.drucken(new Bon(artikel, summe));
    return summe;
}`,
      explain: 'Das ist der Sinn von Tests mit Mocks: Sie prüfen nicht nur das Ergebnis, sondern auch die **Nebeneffekte**. Die alte Version lieferte bei „Suppe, Kuchen“ korrekt -1. Nur das `verifyNoInteractions` macht sichtbar, dass trotzdem schon Ware entnommen wurde.' },

    { id: 'K06-S03-F09', sec: 'falle', type: 'mc', wichtig: true, t: 'when auf einem echten Objekt',
      prompt: '`bank` ist eine **echte** `Bank` (kein Mock). Was passiert bei\n`Mockito.when(bank.getBankleitzahl()).thenReturn(5L);`?',
      options: [
        'Ab dieser Zeile liefert die echte Bank für `getBankleitzahl()` immer 5.',
        'Die Zeile wird ohne Wirkung übergangen, die Bank liefert weiter ihren echten Wert.',
        'Der Test wird an dieser Stelle grün, weil `thenReturn` den Wert gleich mitprüft.',
        'Mockito bricht mit einer Fehlermeldung ab: `when` braucht einen Aufruf auf einem Mock.'
      ],
      answer: 3,
      explain: '`when` kann nur Methoden eines **Mocks** einrichten. Bei einem echten Objekt läuft die Methode ganz normal, und Mockito findet keinen Mock-Aufruf. Es meldet dann eine `MissingMethodInvocationException`. Die getestete Klasse richtet man nie ein, man ruft sie auf und prüft ihr Ergebnis.' },

    { id: 'K06-S03-F10', sec: 'falle', type: 'mc', wichtig: true, t: 'Nichts gutgeschrieben, aber wie?',
      prompt: '`nach` ist ein gemocktes Punktekonto mit `void gutschreiben(int punkte)`. Ein Test soll zeigen: Bei abgelehnter Abbuchung wird **gar nichts** gutgeschrieben. Welche Zeile prüft genau das?',
      options: [
        '`Mockito.verify(nach, Mockito.times(1)).gutschreiben(Mockito.anyInt());`',
        '`Mockito.verify(nach).gutschreiben(Mockito.anyInt());`',
        '`Mockito.verify(nach, Mockito.never()).gutschreiben(Mockito.anyInt());`',
        '`Mockito.verify(nach, Mockito.never()).gutschreiben(30);`'
      ],
      answer: 2,
      explain: '`verify(nach)` ohne Angabe bedeutet **genau einmal**, wie `times(1)`. Das ist das Gegenteil von dem, was der Test zeigen soll. `never()` mit festem Wert `30` prüft nur, dass nie **30** gutgeschrieben wurde; eine Gutschrift von 5 bliebe unbemerkt. Erst `never()` zusammen mit `anyInt()` heißt: nie, egal mit welchem Wert.' },

    { id: 'K06-S03-F11', sec: 'falle', type: 'match', t: 'Vier Arten, „nichts“ zu prüfen',
      prompt: 'Ordne jeder Prüfung zu, was sie genau verlangt.',
      pairs: [
        ['`verifyNoInteractions(m)`', 'Mit `m` wurde überhaupt nichts gemacht.'],
        ['`verifyNoMoreInteractions(m)`', 'Alle Aufrufe auf `m` wurden vorher schon mit `verify` geprüft.'],
        ['`verify(m, never()).x()`', '`x()` wurde nie aufgerufen, andere Methoden von `m` vielleicht schon.'],
        ['`verify(m, only()).x()`', '`x()` wurde genau einmal aufgerufen, und sonst nichts auf `m`.']
      ],
      explain: '`verifyNoInteractions` ist die stärkste Aussage („Finger weg von diesem Konto“) und passt, wenn eine Methode früh abbrechen muss. `verifyNoMoreInteractions` steht **nach** anderen `verify`-Zeilen und meldet jeden Aufruf, der noch nicht geprüft wurde.' },

    { id: 'K06-S03-F12', sec: 'falle', type: 'mc', t: 'Zählt das Einrichten als Aufruf?',
      prompt: 'Im `setUp` steht `Mockito.when(von.getInhaber()).thenReturn(anna);`. Ein Test endet mit `Mockito.verifyNoInteractions(von);`, und die getestete Methode hat `von` nicht benutzt. Wie geht der Test aus?',
      options: [
        'Rot: `getInhaber()` wurde im `setUp` aufgerufen, und das zählt als Interaktion.',
        'Grün: Das Einrichten mit `when` zählt nicht als Aufruf des getesteten Codes.',
        'Rot: `verifyNoInteractions` ist für eingerichtete Mocks grundsätzlich verboten.',
        'Grün, aber nur, wenn man vor dem Prüfen zusätzlich `Mockito.reset(von)` aufruft.'
      ],
      answer: 1,
      explain: 'Mockito merkt sich beim Einrichten, dass dieser Aufruf nur zum Stubbing gehört, und nimmt ihn aus dem Protokoll. Gezählt wird nur, was nach dem Einrichten passiert, also das, was der getestete Code tut. `reset` braucht man dafür nicht und sollte es in Tests meiden.' },

    { id: 'K06-S03-F13', sec: 'falle', type: 'mc', wichtig: true, t: 'Mock einer Klasse und instanceof',
      prompt: '`Sparbuch` erbt von `Konto`, aber **nicht** von `UeberweisungsfaehigesKonto`. Was liefert der Vergleich?\n`Konto k = Mockito.mock(Sparbuch.class);`\n`boolean b = k instanceof UeberweisungsfaehigesKonto;`',
      options: [
        '`true`: Ein Mock implementiert alle Typen, damit er überall einsetzbar ist.',
        '`false`: Das Mock ist ein Objekt einer Unterklasse von `Sparbuch`.',
        '`true`, sobald man mindestens eine Methode des Mocks mit `when` einrichtet.',
        'Die Zeile kompiliert nicht, weil `instanceof` mit Mocks nicht erlaubt ist.'
      ],
      answer: 1,
      explain: 'Mockito erzeugt für ein Mock eine Unterklasse des gemockten Typs. Ein Sparbuch-Mock ist also ein `Sparbuch` und ein `Konto`, aber kein `UeberweisungsfaehigesKonto`. Genau deshalb kann man mit einem Sparbuch-Mock testen, dass eine Bank Überweisungen von oder zu Sparbüchern ablehnt.' },

    { id: 'K06-S03-F14', sec: 'falle', type: 'mc', wichtig: true, t: 'Konstante oder setUp?',
      prompt: '`BETRAG = new Geldbetrag(100)` darf eine `private static final`-Konstante der Testklasse sein. Warum gilt das **nicht** für die Mocks?',
      options: [
        'Weil Konstanten in Testklassen nur für Zahlen und Strings erlaubt sind.',
        'Weil `Mockito.mock()` ausschließlich innerhalb einer Methode aufrufbar ist.',
        'Weil ein Mock alle Aufrufe mitzählt: Geteilt sähe `verify` auch Aufrufe anderer Tests.',
        'Weil JUnit statische Attribute nach jedem einzelnen Test automatisch auf `null` zurücksetzt.'
      ],
      answer: 2,
      explain: 'Ein **unveränderliches** Objekt wie ein Geldbetrag-Record kann kein Test kaputt machen, deshalb darf es eine Konstante sein. Ein Mock hat dagegen **Zustand**: eingerichtete Rückgaben und das Aufrufprotokoll. Er muss in jedem Test frisch sein, darum gehört er ins `@BeforeEach`.' },

    { id: 'K06-S03-F15', sec: 'falle', type: 'bug', wichtig: true, t: 'Ein Test, der falsch prüft',
      prompt: 'Die korrigierte Kasse druckt bei einem unbekannten Artikel nichts. Trotzdem ist dieser Test rot. Markiere die fehlerhafte Zeile und erkläre.',
      code: `@Test
void nichtsGedrucktBeiUnbekanntemArtikel() {
    Mockito.when(preise.preisVon("Kuchen")).thenReturn(-1);
    int summe = kasse.abrechnen(List.of("Kuchen"));
    assertEquals(-1, summe);
    Mockito.verify(drucker).drucken(ArgumentMatchers.any());
}`,
      required: [6],
      model: 'Zeile 6 verlangt, dass **genau einmal** gedruckt wurde, also das Gegenteil von „nichts gedruckt“. Weil die Kasse korrekt nichts druckt, meldet Mockito „Wanted but not invoked“. Richtig: `Mockito.verify(drucker, Mockito.never()).drucken(ArgumentMatchers.any());` oder gleich `Mockito.verifyNoInteractions(drucker, bestand);`.',
      explain: 'Ein roter Test heißt nicht automatisch, dass der Code falsch ist. Auch der **Test** kann den Fehler enthalten. Lies jede `verify`-Zeile als Satz: „Prüfe, dass `drucken` **einmal** aufgerufen wurde.“ Passt der Satz nicht zur Situation, ist die Zeile falsch.' }
  ]
});
