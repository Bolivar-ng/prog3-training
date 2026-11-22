/* Probetest T10: Mocking mit Mockito (35 Minuten)
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Eine Fallaufgabe mit Teilaufgaben plus Einzelfragen, wie in der Prüfung.
   Die Parkhaus-Logik wurde mit javac/java und Fakes ausgeführt (Preise geprüft);
   das Verhalten von Mockito entspricht der Mockito-Dokumentation. */
P3.serie({
  id: 'K90-T10',
  kapitel: 'K90',
  titel: 'Probetest 10: Mocking mit Mockito',
  beschreibung: 'Fallaufgabe Parkhaus mit drei gemockten Partnern (Situationen finden, Tests ergänzen und schreiben, fehlerhaften Test erkennen) und Einzelfragen zu mehreren Rückgaben, void-Methoden, Captor und Matchern. 35 Minuten.',
  neu: true,
  dauer: 35,
  themen: [
    { id: 'park',   name: 'Fallaufgabe Parkhaus' },
    { id: 'einzel', name: 'Einzelfragen Mockito' }
  ],
  faelle: [
    { id: 'P', titel: 'Parkhaus mit Kartenzahlung',
      text: `Beim Ausfahren aus einem **Parkhaus** wird die Parkdauer abgerechnet: Jede **angefangene Stunde** kostet 150 Cent. Der Betrag wird über einen **Zahlungsdienst** von der Karte abgebucht.

Klappt die Abbuchung, wird die Ausfahrt **zuerst** im **Protokoll** eingetragen und **danach** die **Schranke** geöffnet. Lehnt der Zahlungsdienst ab oder ist die Karte gesperrt, bleibt die Schranke zu, und es wird nichts protokolliert. Eine Parkdauer von 0 Minuten oder weniger ist ein Programmierfehler.

Die drei Partner bekommt das Parkhaus über den Konstruktor. Im Test werden sie durch Mocks ersetzt.`,
      code: `public class KarteGesperrtException extends Exception { }      // checked

public interface Zahlungsdienst {
    boolean abbuchen(String karte, int cent) throws KarteGesperrtException;
}
public interface Schranke {
    void oeffnen();
}
public interface Protokoll {
    void eintragen(Ausfahrt a);
}
public record Ausfahrt(String karte, int cent) { }

public class Parkhaus {
    public static final int CENT_PRO_STUNDE = 150;
    private final Zahlungsdienst zahlung;
    private final Schranke schranke;
    private final Protokoll protokoll;

    public Parkhaus(Zahlungsdienst zahlung, Schranke schranke, Protokoll protokoll) {
        this.zahlung = zahlung;
        this.schranke = schranke;
        this.protokoll = protokoll;
    }

    public boolean ausfahren(String karte, int minuten) {
        if (minuten <= 0)
            throw new IllegalArgumentException("Parkdauer muss positiv sein");
        int stunden = (minuten + 59) / 60;
        int preis = stunden * CENT_PRO_STUNDE;
        try {
            if (!zahlung.abbuchen(karte, preis))
                return false;
        } catch (KarteGesperrtException e) {
            return false;
        }
        protokoll.eintragen(new Ausfahrt(karte, preis));
        schranke.oeffnen();
        return true;
    }
}

// Testklasse: vor jedem Test frische Mocks
class ParkhausTest {
    private Zahlungsdienst zahlung;
    private Schranke schranke;
    private Protokoll protokoll;
    private Parkhaus parkhaus;

    @BeforeEach
    void setUp() {
        zahlung = Mockito.mock();
        schranke = Mockito.mock();
        protokoll = Mockito.mock();
        parkhaus = new Parkhaus(zahlung, schranke, protokoll);
    }
}` }
  ],
  fragen: [

    { id: 'K90-T10-F01', sec: 'park', fall: 'P', type: 'multi', wichtig: true, t: 'P1 · Echt oder Mock?',
      prompt: 'Welche Aussagen zur Testklasse `ParkhausTest` stimmen?',
      options: [
        '`Zahlungsdienst`, `Schranke` und `Protokoll` werden gemockt, sie sind nicht Gegenstand des Tests.',
        '`Parkhaus` wird gemockt, damit man das Ergebnis von `ausfahren` mit `when` festlegen kann.',
        '`Ausfahrt` darf echt bleiben: ein einfacher Record, den das Parkhaus selbst erzeugt.',
        'Ohne den Konstruktor mit drei Parametern könnte man die Mocks nicht ins Parkhaus bringen.',
        'Die Mocks könnten auch `static final` sein, weil sie in jedem Test gleich eingerichtet sind.'
      ],
      answer: [0, 2, 3],
      explain: 'Gemockt werden die Partner, die getestete Klasse bleibt echt. Ohne Dependency Injection, hier über den Konstruktor, käme kein Mock hinein. Mocks zählen Aufrufe mit und tragen Einrichtungen; geteilt zwischen Tests würden sich die Tests gegenseitig beeinflussen. Deshalb werden sie im `@BeforeEach` jedes Mal neu erzeugt.' },

    { id: 'K90-T10-F02', sec: 'park', fall: 'P', type: 'input', t: 'P2 · Welcher Betrag wird abgebucht?',
      prompt: 'Mit welchem Cent-Betrag ruft das Parkhaus `zahlung.abbuchen` auf, wenn jemand **61 Minuten** geparkt hat? Gib nur die Zahl ein.',
      code: `int stunden = (minuten + 59) / 60;
int preis = stunden * CENT_PRO_STUNDE;   // CENT_PRO_STUNDE = 150`,
      answers: ['300'],
      explain: '`(61 + 59) / 60 = 120 / 60 = 2` angefangene Stunden, also 2 · 150 = **300**. Bei 60 Minuten wären es `119 / 60 = 1` Stunde, also 150. Diesen Wert muss man kennen, um `abbuchen` im Test richtig einzurichten: Mit dem falschen Betrag passt `when` nicht, und das Mock liefert `false`.' },

    { id: 'K90-T10-F03', sec: 'park', fall: 'P', type: 'fill', wichtig: true, t: 'P3 · Test: erfolgreiche Ausfahrt',
      prompt: 'Ergänze den Test für eine erfolgreiche Ausfahrt nach 90 Minuten, einschließlich der vorgeschriebenen Reihenfolge.',
      code: `@Test
void ausfahrenKlappt() throws [[0]] {
    Mockito.when(zahlung.abbuchen("K1", 300)).thenReturn(true);

    boolean offen = parkhaus.ausfahren("K1", 90);

    assertTrue(offen);
    InOrder ablauf = Mockito.[[1]](protokoll, schranke);
    ablauf.verify(protokoll).eintragen([[2]]);
    ablauf.verify(schranke).oeffnen();
}`,
      blanks: [
        { options: ['IllegalArgumentException', 'NullPointerException', 'KarteGesperrtException', 'RuntimeException'], answer: 2,
          why: '`abbuchen` deklariert die **checked** `KarteGesperrtException`. Weil der Test `abbuchen` im `when` selbst aufruft, muss er sie weiterreichen, auch wenn sie nie fliegt.' },
        { options: ['inOrder', 'verify', 'when', 'order'], answer: 0,
          why: '`Mockito.inOrder(…)` erzeugt das `InOrder`-Objekt für die angegebenen Mocks.' },
        { options: ['new Ausfahrt("K1", 150)', 'new Ausfahrt("K1", 300)', 'Ausfahrt.class', 'ArgumentCaptor.forClass(Ausfahrt.class)'], answer: 1,
          why: '90 Minuten sind 2 angefangene Stunden, also 300 Cent. Weil `Ausfahrt` ein **Record** ist, vergleicht Mockito mit dem automatischen `equals`, und ein neu erzeugtes, gleiches Objekt passt.' }
      ],
      explain: 'Die Reihenfolge steht in der Aufgabe: erst protokollieren, dann öffnen. Ohne `InOrder` bliebe ein vertauschter Ablauf unbemerkt.' },

    { id: 'K90-T10-F04', sec: 'park', fall: 'P', type: 'mc', wichtig: true, t: 'P4 · Warum klappt verify mit new Ausfahrt?',
      prompt: 'Bei einer Klasse ohne `equals` braucht man einen ArgumentCaptor. Warum funktioniert hier `verify(protokoll).eintragen(new Ausfahrt("K1", 300))` direkt?',
      options: [
        'Weil Mockito bei `void`-Methoden die Parameter nur nach ihrem Typ vergleicht.',
        'Weil Mockito neue Objekte im `verify` automatisch durch `any()` ersetzt.',
        'Weil das Parkhaus dasselbe `Ausfahrt`-Objekt benutzt, das der Test erzeugt.',
        'Weil ein Record `equals` automatisch nach seinen Komponenten bekommt.'
      ],
      answer: 3,
      explain: 'Mockito vergleicht feste Parameter mit `equals`. Ein Record erzeugt `equals` und `hashCode` automatisch aus allen Komponenten, deshalb sind zwei `Ausfahrt("K1", 300)` gleich, obwohl es verschiedene Objekte sind. Bei einer normalen Klasse ohne `equals` würde nur dieselbe Referenz passen.' },

    { id: 'K90-T10-F05', sec: 'park', fall: 'P', type: 'multi', wichtig: true, t: 'P5 · Welche Situationen testen?',
      prompt: '„Wer testet, testet alles.“ Für welche Situationen braucht `ausfahren` einen **eigenen** Test?',
      options: [
        'Abbuchung klappt: true, erst protokolliert, dann Schranke offen.',
        'Zahlungsdienst lehnt ab (false): Rückgabe false, Schranke und Protokoll unberührt.',
        'Karte gesperrt (Exception): Rückgabe false, Schranke und Protokoll unberührt.',
        'Parkdauer 0: IllegalArgumentException, kein Partner wird angesprochen.',
        'Grenze 60/61 Minuten: Es werden 150 bzw. 300 Cent abgebucht.',
        'Nach dem Öffnen liefert das Schranken-Mock bei einer Abfrage „offen“ zurück.'
      ],
      answer: [0, 1, 2, 3, 4],
      explain: 'Jeder Zweig der Methode braucht einen Test, dazu die **Randwerte** der Preisberechnung, denn genau dort passieren Rechenfehler. Ein Mock hat keinen echten Zustand: Es „merkt“ sich nicht, dass es offen ist. Geprüft wird stattdessen der Aufruf `oeffnen()`.' },

    { id: 'K90-T10-F06', sec: 'park', fall: 'P', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 5, t: 'P6 · Test: gesperrte Karte',
      prompt: 'Schreibe den Test für eine gesperrte Karte (30 Minuten Parkdauer). Prüfe das Ergebnis und dass weder protokolliert noch geöffnet wurde.',
      model: 'Kernpunkte: (1) `when(zahlung.abbuchen("K1", 150)).thenThrow(new KarteGesperrtException())`. 30 Minuten sind eine angefangene Stunde, also 150 Cent. `thenThrow` mit einer checked Exception geht, weil `abbuchen` sie deklariert. (2) `throws KarteGesperrtException` an der Testmethode. (3) `assertFalse(…)`: Die Exception darf **nicht** aus `ausfahren` herauskommen, das Parkhaus fängt sie. (4) `verifyNoInteractions(protokoll, schranke)`.',
      modelCode: `@Test
void ausfahrenMitGesperrterKarte() throws KarteGesperrtException {
    Mockito.when(zahlung.abbuchen("K1", 150))
           .thenThrow(new KarteGesperrtException());

    boolean offen = parkhaus.ausfahren("K1", 30);

    assertFalse(offen);
    Mockito.verifyNoInteractions(protokoll, schranke);
}`,
      explain: 'Ein häufiger Fehler ist `assertThrows(KarteGesperrtException.class, …)`. Das Parkhaus fängt die Exception aber und meldet `false`, also wäre der Test rot. Erst die JavaDoc bzw. die Aufgabe lesen: Wird geworfen oder `false` geliefert?' },

    { id: 'K90-T10-F07', sec: 'park', fall: 'P', type: 'bug', wichtig: true, t: 'P7 · Ein fehlerhafter Test',
      prompt: 'Dieser Test soll den Fall „Zahlungsdienst lehnt ab“ prüfen. Er ist rot, obwohl `ausfahren` korrekt ist. Markiere die Zeile, die den Fehlschlag verursacht, und erkläre, was an Zeile 4 außerdem nicht stimmt.',
      code: `@Test
void ausfahrenAbgelehnt() throws KarteGesperrtException {
    boolean offen = parkhaus.ausfahren("K1", 30);
    Mockito.when(zahlung.abbuchen("K1", 150)).thenReturn(false);
    assertFalse(offen);
    Mockito.verify(schranke).oeffnen();
}`,
      required: [6],
      extra: [4],
      model: 'Zeile 6 verlangt, dass die Schranke **genau einmal** geöffnet wurde, also das Gegenteil. Richtig: `verify(schranke, never()).oeffnen()` oder `verifyNoInteractions(schranke, protokoll)`. Zeile 4 steht **nach** dem Aufruf und wirkt nicht mehr. Der Test funktioniert in Zeile 5 nur zufällig, weil ein nicht eingerichtetes `boolean` ohnehin `false` liefert. Die Zeile gehört vor Zeile 3.',
      explain: 'Zwei Klassiker in einem Test: Einrichten nach dem Aufruf und ein `verify` ohne `never()`. Lies jede Zeile als Satz („prüfe, dass geöffnet wurde“) und vergleiche ihn mit der Situation.' },

    { id: 'K90-T10-F08', sec: 'park', fall: 'P', type: 'mc', t: 'P8 · Ungültige Parkdauer',
      prompt: 'Nach `assertThrows(IllegalArgumentException.class, () -> parkhaus.ausfahren("K1", 0));` soll noch etwas geprüft werden. Was passt am besten?',
      options: [
        '`Mockito.verify(zahlung).abbuchen("K1", 0);`',
        '`Mockito.verifyNoInteractions(zahlung, schranke, protokoll);`',
        '`Mockito.verify(schranke, Mockito.times(0)).oeffnen();` allein reicht vollständig aus.',
        '`Mockito.when(zahlung.abbuchen("K1", 0)).thenReturn(false);`'
      ],
      answer: 1,
      explain: 'Bei einem Programmierfehler muss die Methode werfen, **bevor** irgendetwas passiert. Es darf also weder abgebucht noch protokolliert noch geöffnet werden. Das sagt `verifyNoInteractions` über alle drei Partner. Nur die Schranke zu prüfen, ließe eine fehlerhafte Abbuchung unbemerkt. Ein `when` gehört nicht in den Prüfteil.' },

    { id: 'K90-T10-F09', sec: 'einzel', type: 'input', t: 'Mehrere Rückgaben hintereinander',
      prompt: 'Was wird ausgegeben? (`interface Zaehler { int naechste(); }`)',
      code: `Zaehler z = Mockito.mock();
Mockito.when(z.naechste()).thenReturn(1, 2).thenThrow(new IllegalStateException());
for (int i = 0; i < 4; i++) {
    try {
        System.out.print(z.naechste() + " ");
    } catch (IllegalStateException e) {
        System.out.print("X ");
    }
}`,
      answers: ['1 2 X X', '1 2 X X '],
      explain: 'Die eingerichteten Antworten werden der Reihe nach verbraucht: 1, dann 2, dann die Exception. Danach wird die **letzte** Einrichtung wiederholt, also fliegt auch beim vierten Aufruf die Exception.' },

    { id: 'K90-T10-F10', sec: 'einzel', type: 'mc', wichtig: true, t: 'Exception bei einer void-Methode',
      prompt: 'Die Schranke soll im Test beim Öffnen eine `IllegalStateException` werfen. `oeffnen()` ist `void`. Welche Zeile kompiliert und tut das?',
      options: [
        '`Mockito.when(schranke.oeffnen()).thenThrow(new IllegalStateException());`',
        '`Mockito.when(schranke).oeffnen().thenThrow(new IllegalStateException());`',
        '`Mockito.verify(schranke).oeffnen(new IllegalStateException());`',
        '`Mockito.doThrow(new IllegalStateException()).when(schranke).oeffnen();`'
      ],
      answer: 3,
      explain: '`when(…)` braucht einen **Wert** als Parameter. Ein `void`-Aufruf liefert keinen, deshalb kompiliert `when(schranke.oeffnen())` nicht. Für `void` dreht man die Schreibweise um: erst das Verhalten (`doThrow`), dann `when(mock)`, dann die Methode.' },

    { id: 'K90-T10-F11', sec: 'einzel', type: 'mc', t: 'Captor bei zwei Aufrufen',
      prompt: 'Nach zwei erfolgreichen Ausfahrten, erst Karte `"K1"`, dann `"K2"`, steht im Test:\n`Mockito.verify(protokoll, Mockito.times(2)).eintragen(captor.capture());`\nWas liefert `captor.getValue()`?',
      options: [
        'Die Ausfahrt von `"K1"`, weil der Captor den ersten Wert festhält.',
        'Eine Liste mit beiden Ausfahrten in der Reihenfolge der Aufrufe.',
        'Die Ausfahrt von `"K2"`, also den zuletzt abgefangenen Wert.',
        'Eine Exception, weil bei mehreren Aufrufen nur `getAllValues()` erlaubt ist.'
      ],
      answer: 2,
      explain: '`getValue()` liefert den **zuletzt** abgefangenen Wert. Alle Werte in Aufrufreihenfolge bekommt man mit `getAllValues()`, z. B. `assertEquals("K1", captor.getAllValues().get(0).karte())`.' },

    { id: 'K90-T10-F12', sec: 'einzel', type: 'mc', wichtig: true, t: 'Matcher richtig ergänzen',
      prompt: '`Mockito.verify(zahlung).abbuchen(ArgumentMatchers.anyString(), 300);` führt zu einer Fehlermeldung. Welche Korrektur ist richtig?',
      options: [
        '`Mockito.verify(zahlung).abbuchen("K1", ArgumentMatchers.anyInt());`',
        '`Mockito.verify(zahlung).abbuchen(ArgumentMatchers.anyString(), ArgumentMatchers.eq(300));`',
        '`Mockito.verify(zahlung).abbuchen(ArgumentMatchers.anyString(), ArgumentMatchers.anyInt(300));`',
        '`Mockito.verify(zahlung).abbuchen(ArgumentMatchers.any(String.class), (Integer) 300);`'
      ],
      answer: 1,
      explain: 'Regel: **alle** Parameter Matcher oder **keiner**. Der feste Wert wird deshalb mit `eq(300)` zum Matcher. Mit `"K1"` und `anyInt()` wird wieder gemischt. `anyInt(300)` gibt es nicht. Ein Cast macht aus einem festen Wert keinen Matcher.' }
  ]
});
