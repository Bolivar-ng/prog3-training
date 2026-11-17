/* Kapitel 06 · Serie S02: Fallaufgabe – ein Bonusprogramm mit Mocks testen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Die Java-Teile (Klassen und Testcode) wurden kompiliert; das Verhalten von Mockito entspricht der Mockito-Dokumentation. */
P3.serie({
  id: 'K06-S02',
  kapitel: 'K06',
  titel: 'Fallaufgabe: ein Bonusprogramm mit Mocks testen',
  beschreibung: 'Eine Klasse, die Punktekonten verwaltet, wird mit gemockten Konten getestet: Mocks einschleusen, alle Situationen abdecken, Fehler im Testcode finden, Tests selbst schreiben.',
  neu: true,
  minutenProFrage: 3,
  themen: [
    { id: 'fall', name: 'Fallaufgabe Bonusprogramm' }
  ],
  faelle: [
    { id: 'B', titel: 'Bonusprogramm mit Punktekonten',
      text: `Ein **Bonusprogramm** verwaltet Punktekonten unter fortlaufenden Nummern. Punkte können zwischen zwei Konten **übertragen** werden: Erst wird beim Quellkonto abgebucht, und nur wenn das klappt, wird beim Zielkonto gutgeschrieben.

Wie ein Konto intern rechnet, soll für das Bonusprogramm keine Rolle spielen (es könnte später neue Kontoarten geben). Deshalb sollen die Tests des Bonusprogramms mit **gemockten Punktekonten** arbeiten. Damit die Mocks überhaupt in das Programm gelangen, gibt es die Methode \`kontoEinfuegen\`.`,
      code: `public class GesperrtException extends Exception { … }   // checked

public interface Punktekonto {
    int getStand();
    boolean abbuchen(int punkte) throws GesperrtException;   // false: nicht genug Punkte
    void gutschreiben(int punkte);
}

public class Bonusprogramm {
    private final Map<Long, Punktekonto> konten = new HashMap<>();
    private long naechsteNummer = 1;

    public long kontoEinfuegen(Punktekonto k) {
        if (k == null)
            throw new NullPointerException("Konto fehlt");
        long nr = naechsteNummer++;
        konten.put(nr, k);
        return nr;
    }

    public int getStand(long nr) {
        Punktekonto k = konten.get(nr);
        if (k == null)
            throw new IllegalArgumentException("Kein Konto mit der Nummer " + nr);
        return k.getStand();
    }

    public boolean punkteUebertragen(long von, long nach, int punkte) {
        if (punkte <= 0)
            throw new IllegalArgumentException("Punkte müssen positiv sein");
        Punktekonto quelle = konten.get(von);
        Punktekonto ziel = konten.get(nach);
        if (quelle == null || ziel == null)
            return false;
        try {
            if (!quelle.abbuchen(punkte))
                return false;
        } catch (GesperrtException e) {
            return false;
        }
        ziel.gutschreiben(punkte);
        return true;
    }
}

// Testklasse: in jedem Test stehen zwei frische Mocks bereit
class BonusprogrammTest {
    private Bonusprogramm programm;
    private Punktekonto von;
    private Punktekonto nach;
    private long a;   // Nummer von "von"
    private long b;   // Nummer von "nach"

    @BeforeEach
    void setUp() {
        programm = new Bonusprogramm();
        von = Mockito.mock();
        nach = Mockito.mock();
        a = programm.kontoEinfuegen(von);
        b = programm.kontoEinfuegen(nach);
    }
}` }
  ],
  fragen: [

    { id: 'K06-S02-F01', sec: 'fall', fall: 'B', type: 'mc', wichtig: true, t: 'B1 · Wozu kontoEinfuegen?',
      prompt: 'Warum braucht das Bonusprogramm für die Tests eine Methode wie `kontoEinfuegen(Punktekonto k)`?',
      options: [
        'Weil Mockito Mocks nur über eine Methode namens `…Einfuegen` erzeugen kann.',
        'Weil ein Mock nur dann getestet werden kann, wenn es irgendwo in einer Map gespeichert ist.',
        'Weil die Mocks sonst nicht ins Programm kämen, wenn es alle Konten selbst erzeugt.',
        'Weil `Punktekonto` ein Interface ist und deshalb kein `new` zulässt.'
      ],
      answer: 2,
      explain: 'Das ist **Dependency Injection**: Die Abhängigkeit kommt von außen. Würde das Programm seine Konten nur selbst mit `new` erzeugen, könnte der Test sie nicht durch Mocks ersetzen. Die Methode verhält sich wie die anderen Erstell-Methoden: Sie vergibt eine Nummer und liefert sie zurück.' },

    { id: 'K06-S02-F02', sec: 'fall', fall: 'B', type: 'fill', wichtig: true, t: 'B2 · getStand testen',
      prompt: 'Ergänze den Test: Das Programm soll den Stand liefern, den das Konto meldet.',
      code: `@Test
void getStandLiefertStandDesKontos() {
    Mockito.[[0]](von.getStand()).thenReturn(120);
    [[1]](120, programm.getStand([[2]]));
}`,
      blanks: [
        { options: ['verify', 'when', 'mock', 'doReturn'], answer: 1,
          why: 'Das Mock muss **eingerichtet** werden: Wird `getStand()` aufgerufen, soll 120 kommen. Ohne das liefert es 0.' },
        { options: ['assertTrue', 'Mockito.verify', 'assertEquals', 'assertSame'], answer: 2,
          why: 'Geprüft wird der **Rückgabewert** des Programms, also eine normale JUnit-Prüfung. Mockito ersetzt JUnit nicht.' },
        { options: ['von', 'a', 'b', '1'], answer: 1,
          why: '`getStand` erwartet die **Nummer**, die `kontoEinfuegen` für `von` vergeben hat, also `a`. `1` würde zufällig auch passen, verlässt sich aber auf die Implementierung der Nummernvergabe.' }
      ],
      explain: 'Der Test prüft nur, ob das Programm den Wert des richtigen Kontos durchreicht. Ein zweiter Test gehört dazu: unbekannte Nummer, also `assertThrows(IllegalArgumentException.class, …)`.' },

    { id: 'K06-S02-F03', sec: 'fall', fall: 'B', type: 'multi', wichtig: true, t: 'B3 · Welche Situationen testen?',
      prompt: '„Eine Methode ist nur korrekt, wenn sie in **jeder** Situation korrekt reagiert.“ Welche Tests braucht `punkteUebertragen`?',
      options: [
        'Abbuchen klappt: Rückgabe true, beim Ziel wird genau dieser Betrag gutgeschrieben.',
        'Abbuchen liefert false: Rückgabe false, beim Ziel wird nichts gutgeschrieben.',
        'Quellkonto ist gesperrt (Exception): Rückgabe false, Ziel wird nicht angefasst.',
        'Eine Nummer ist unbekannt: Rückgabe false.',
        'Punkte ≤ 0: IllegalArgumentException, kein Konto wird angefasst.',
        'Nach dem Übertragen hat das Ziel-Mock einen um die Punkte höheren Stand.'
      ],
      answer: [0, 1, 2, 3, 4],
      explain: 'Jeder Zweig der Methode braucht einen Test. Die Option „Ziel-Mock hat danach einen höheren Stand“ ist der typische Denkfehler: Ein Mock hat **keinen echten Stand**, `getStand()` liefert weiter, was eingerichtet wurde (sonst 0). Statt der Auswirkung prüft man den **Aufruf**: `verify(nach).gutschreiben(30)`.' },

    { id: 'K06-S02-F04', sec: 'fall', fall: 'B', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 6, t: 'B4 · Test: erfolgreiche Übertragung',
      prompt: 'Schreibe den Test für eine erfolgreiche Übertragung von 30 Punkten von `a` nach `b`. Prüfe auch, dass **erst** abgebucht und **dann** gutgeschrieben wird.',
      model: 'Kernpunkte: (1) `abbuchen(30)` auf `true` einrichten, sonst liefert das Mock `false`. (2) Da `abbuchen` eine checked Exception deklariert, braucht die Testmethode `throws GesperrtException`, auch wenn sie nie fliegt. (3) Rückgabe mit `assertTrue` prüfen. (4) Reihenfolge mit `InOrder`: erst `von.abbuchen(30)`, dann `nach.gutschreiben(30)`. Damit fällt eine Implementierung auf, die erst gutschreibt.',
      modelCode: `@Test
void uebertragenKlappt() throws GesperrtException {
    Mockito.when(von.abbuchen(30)).thenReturn(true);

    boolean ok = programm.punkteUebertragen(a, b, 30);

    assertTrue(ok);
    InOrder reihenfolge = Mockito.inOrder(von, nach);
    reihenfolge.verify(von).abbuchen(30);
    reihenfolge.verify(nach).gutschreiben(30);
}`,
      explain: 'Ohne `InOrder` würden `verify(von).abbuchen(30)` und `verify(nach).gutschreiben(30)` auch dann bestehen, wenn die Reihenfolge vertauscht ist. Bei Geld oder Punkten ist das genau der gefährliche Fehler.' },

    { id: 'K06-S02-F05', sec: 'fall', fall: 'B', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 5, t: 'B5 · Tests für die Fehlerfälle',
      prompt: 'Schreibe zwei Tests: (1) `abbuchen` liefert `false`, (2) `abbuchen` wirft eine `GesperrtException`. Prüfe jeweils das Ergebnis und dass beim Ziel nichts passiert.',
      model: 'Kernpunkte: (1) Fall „nicht genug Punkte“: `when(von.abbuchen(30)).thenReturn(false)`, dann `assertFalse` und `verify(nach, never()).gutschreiben(anyInt())` bzw. `times(0)`. (2) Fall „gesperrt“: `when(von.abbuchen(30)).thenThrow(new GesperrtException())`. Das geht mit `when`, weil `abbuchen` einen Rückgabewert hat und die checked Exception deklariert. Danach `assertFalse` und `verifyNoInteractions(nach)`. (3) Die Exception darf **nicht** aus der Methode herauskommen, sie wird im Programm gefangen.',
      modelCode: `@Test
void uebertragenOhneDeckung() throws GesperrtException {
    Mockito.when(von.abbuchen(30)).thenReturn(false);

    assertFalse(programm.punkteUebertragen(a, b, 30));

    Mockito.verify(nach, Mockito.never()).gutschreiben(Mockito.anyInt());
}

@Test
void uebertragenVonGesperrtemKonto() throws GesperrtException {
    Mockito.when(von.abbuchen(30)).thenThrow(new GesperrtException());

    assertFalse(programm.punkteUebertragen(a, b, 30));

    Mockito.verifyNoInteractions(nach);
}`,
      explain: 'Eine checked Exception darf man mit `thenThrow` nur einrichten, wenn die Methode sie auch deklariert. Sonst meldet Mockito beim Einrichten einen Fehler („Checked exception is invalid for this method“).' },

    { id: 'K06-S02-F06', sec: 'fall', fall: 'B', type: 'bug', wichtig: true, t: 'B6 · Warum ist dieser Test rot?',
      prompt: 'Dieser Test schlägt fehl, obwohl `punkteUebertragen` korrekt ist. Markiere die Ursache und erkläre.',
      code: `@Test
void uebertragenKlappt() throws GesperrtException {
    Punktekonto quelle = Mockito.mock();
    Punktekonto ziel = Mockito.mock();
    long x = programm.kontoEinfuegen(quelle);
    long y = programm.kontoEinfuegen(ziel);
    boolean ok = programm.punkteUebertragen(x, y, 30);
    Mockito.when(quelle.abbuchen(30)).thenReturn(true);
    assertTrue(ok);
    Mockito.verify(ziel).gutschreiben(30);
}`,
      required: [8],
      model: 'Zeile 8 richtet das Mock erst **nach** dem Aufruf in Zeile 7 ein. Beim Aufruf war `abbuchen` also noch nicht eingerichtet und lieferte den Standardwert **false**. Das Programm gibt `false` zurück, und `assertTrue(ok)` in Zeile 9 schlägt fehl. Lösung: Zeile 8 vor Zeile 7 verschieben (SetUp vor Exercise).',
      explain: 'Ein Klassiker: Stubbing wirkt nur auf Aufrufe, die **danach** passieren. Das Ergebnis eines nicht eingerichteten `boolean`-Aufrufs ist `false`, ganz ohne Fehlermeldung.' },

    { id: 'K06-S02-F07', sec: 'fall', fall: 'B', type: 'multi', t: 'B7 · Ungültige Parameter',
      prompt: 'Test für `punkteUebertragen(a, b, -5)`. Welche Zeilen gehören in den Verify-Teil?',
      options: [
        '`assertThrows(IllegalArgumentException.class, () -> programm.punkteUebertragen(a, b, -5));`',
        '`Mockito.verifyNoInteractions(von, nach);`',
        '`Mockito.verify(von).abbuchen(-5);`',
        '`Mockito.when(von.abbuchen(-5)).thenReturn(false);`'
      ],
      answer: [0, 1],
      explain: 'Bei ungültigen Punkten muss die Methode eine `IllegalArgumentException` werfen, **bevor** ein Konto angefasst wird. Das zeigt `verifyNoInteractions`. `verify(von).abbuchen(-5)` würde das Gegenteil verlangen. Ein `when` gehört in den SetUp und ist hier überflüssig.' },

    { id: 'K06-S02-F08', sec: 'fall', fall: 'B', type: 'review', t: 'B8 · Review einer Testklasse',
      prompt: 'Ein Kommilitone zeigt diese Ideen für seine Testklasse. Welche Befunde treffen zu?',
      code: `// Idee 1: Bonusprogramm mocken, damit die Tests schneller laufen
Bonusprogramm programm = Mockito.mock();
// Idee 2: ein einziger Test für alle Fälle von punkteUebertragen
// Idee 3: Ziel-Mock nach dem Übertragen auf getStand() == 30 prüfen
// Idee 4: verify(nach).gutschreiben(anyInt()) statt gutschreiben(30)`,
      findings: [
        { text: 'Idee 1 ist falsch: Die getestete Klasse darf nie gemockt werden.', correct: true,
          why: 'Dann führt `punkteUebertragen` keinen echten Code aus, und kein Fehler im Programm könnte auffallen.' },
        { text: 'Idee 2 reicht nicht: Jede Situation (Erfolg, false, Exception, unbekannte Nummer, ungültige Punkte) braucht einen eigenen Test.', correct: true,
          why: 'Ein Test pro Situation mit aussagekräftigem Namen. Ein einzelner Test deckt nur einen Zweig ab.' },
        { text: 'Idee 3 funktioniert nicht: Ein Mock hat keinen echten Stand.', correct: true,
          why: '`getStand()` liefert, was eingerichtet wurde (sonst 0). Man prüft den Aufruf `gutschreiben(30)`.' },
        { text: 'Idee 4 ist genauer als `gutschreiben(30)`.', correct: false,
          why: 'Umgekehrt: `anyInt()` würde auch eine Gutschrift von 3 oder 300 durchgehen lassen. Wo man den Wert kennt, prüft man ihn genau.' }
      ],
      explain: 'Faustregel: echte getestete Klasse, gemockte Partner, ein Test pro Situation, Aufrufe statt Auswirkungen prüfen, und so genau wie möglich verifizieren.' }
  ]
});
