/* Kapitel 04 · Serie S04: Fallaufgaben – Klassen mit Collections bauen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   faelle: gemeinsame Ausgangslage mehrerer Teilaufgaben (Feld fall in der Frage).
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben, Traces und JUnit-Musterlösungen wurden mit javac/java geprüft. */
P3.serie({
  id: 'K04-S04',
  kapitel: 'K04',
  titel: 'Fallaufgaben: Klassen mit Collections bauen',
  beschreibung: 'Drei größere Aufgaben wie in der Prüfung: eine Ausgangslage mit vorgegebenem Code, dann Teilaufgaben zum Ergänzen, Vorhersagen, Fehlerfinden, Schreiben und Testen.',
  neu: true,
  minutenProFrage: 3,
  themen: [
    { id: 'bib',   name: 'Fall A: Bibliothek (Map, Sichten, TreeSet)' },
    { id: 'lager', name: 'Fall B: Lager (Exceptions, Reihenfolge, JUnit)' },
    { id: 'kurs',  name: 'Fall C: Kurse (List in Map, Records, Generics)' }
  ],
  faelle: [
    { id: 'A', titel: 'Bibliothek',
      text: `Eine Bibliothek verwaltet ihren **Bestand** und die **Ausleihen**. Jedes Buch hat eine eindeutige ISBN. Ein Buch kann höchstens an **einen** Leser gleichzeitig ausgeliehen sein; ein Leser darf mehrere Bücher haben.

Vorgegeben sind der Record \`Buch\` und das Gerüst der Klasse \`Bibliothek\`. Die Methoden sollen sich so verhalten:
- \`aufnehmen(b)\` nimmt ein Buch auf; \`false\`, wenn die ISBN schon im Bestand ist.
- \`ausleihen(isbn, leser)\` liefert \`false\`, wenn es das Buch nicht gibt oder es schon ausgeliehen ist.
- \`zurueckgeben(isbn)\` liefert \`true\`, wenn das Buch tatsächlich ausgeliehen war.
- \`leserEntfernen(leser)\` beendet alle Ausleihen eines Lesers und liefert ihre Anzahl.
- \`getBuecherVon(autor)\` liefert alle Bücher eines Autors, sortiert nach Erscheinungsjahr, bei gleichem Jahr nach Titel.`,
      code: `public record Buch(String isbn, String titel, String autor, int jahr) { }

public class Bibliothek {
    private final Map<String, Buch> bestand = new HashMap<>();      // ISBN -> Buch
    private final Map<String, String> ausgeliehen = new HashMap<>(); // ISBN -> Leser

    public boolean aufnehmen(Buch b) {
        if (b == null)
            throw new NullPointerException("Buch darf nicht null sein");
        if (bestand.containsKey(b.isbn()))
            return false;
        bestand.put(b.isbn(), b);
        return true;
    }

    public boolean ausleihen(String isbn, String leser) { /* Teilaufgabe */ }

    public boolean zurueckgeben(String isbn) {
        return ausgeliehen.remove(isbn) != null;
    }

    public Set<String> getAlleIsbn() {
        return bestand.keySet();
    }

    public int leserEntfernen(String leser) { /* Teilaufgabe */ }

    public SortedSet<Buch> getBuecherVon(String autor) { /* Teilaufgabe */ }
}` },
    { id: 'B', titel: 'Lager',
      text: `Ein Lager führt zu jedem Artikel eine **Stückzahl**. Ein Artikel mit Stückzahl 0 steht nicht mehr in der Map. Zwischen zwei Lagern soll man Ware **umbuchen** können. Dabei darf Ware weder verloren gehen noch aus dem Nichts entstehen.

Die Klasse ist bis auf \`umbuchen\` fertig. \`entnehmen\` wirft die **checked** Exception \`BestandZuKleinException\`, wenn nicht genug da ist. \`umbuchen\` soll \`true\` liefern, wenn umgebucht wurde, und \`false\`, wenn im Quelllager nicht genug vorhanden ist. Fehlerhafte Parameter (\`null\`, Menge ≤ 0) führen zu einer Exception.`,
      code: `public class BestandZuKleinException extends Exception {
    public BestandZuKleinException(String artikel, int fehlend) {
        super("Von " + artikel + " fehlen " + fehlend + " Stück");
    }
}

public class Lager {
    private final Map<String, Integer> bestand = new TreeMap<>();  // Artikel -> Stückzahl

    public void einlagern(String artikel, int menge) { /* Teilaufgabe */ }

    public void entnehmen(String artikel, int menge) throws BestandZuKleinException {
        if (artikel == null)
            throw new NullPointerException("Artikel fehlt");
        if (menge <= 0)
            throw new IllegalArgumentException("Menge muss positiv sein");
        int vorhanden = getMenge(artikel);
        if (vorhanden < menge)
            throw new BestandZuKleinException(artikel, menge - vorhanden);
        if (vorhanden == menge)
            bestand.remove(artikel);
        else
            bestand.put(artikel, vorhanden - menge);
    }

    public int getMenge(String artikel) {
        return bestand.getOrDefault(artikel, 0);
    }

    public Map<String, Integer> getBestand() {
        return Collections.unmodifiableMap(bestand);
    }

    public static boolean umbuchen(Lager von, Lager nach, String artikel, int menge) {
        /* Teilaufgabe */
    }
}` },
    { id: 'C', titel: 'Kursverwaltung',
      text: `Eine Hochschule verwaltet, wer in welchem Kurs angemeldet ist. Zu jedem Kursnamen gehört eine **Liste** der Teilnehmenden in Anmeldereihenfolge. Niemand darf zweimal im selben Kurs stehen.

Studierende sind als **Record** modelliert: Zwei \`Student\`-Objekte mit gleichem Namen und gleicher Matrikelnummer sind also gleich (\`equals\`). Nach außen gibt die Klasse die Teilnehmerlisten nur **lesbar** heraus.`,
      code: `public record Student(String name, int matrikel) { }

public class Kursverwaltung {
    private final Map<String, List<Student>> kurse = new HashMap<>();  // Kurs -> Teilnehmende

    public void anmelden(String kurs, Student s) { /* Teilaufgabe */ }

    public List<Student> getTeilnehmer(String kurs) {
        List<Student> liste = kurse.get(kurs);
        if (liste == null)
            return List.of();
        return Collections.unmodifiableList(liste);
    }

    // entfernt alle Studierenden, deren Matrikelnummer kleiner als grenze ist
    public void alteEntfernen(String kurs, int grenze) { /* siehe Teilaufgabe */ }

    // alle Kurse, in denen s angemeldet ist, alphabetisch sortiert
    public SortedSet<String> kurseVon(Student s) { /* Teilaufgabe */ }
}` }
  ],
  fragen: [

    /* ==================== Fall A: Bibliothek ==================== */

    { id: 'K04-S04-F01', sec: 'bib', fall: 'A', type: 'fill', wichtig: true, t: 'A1 · ausleihen ergänzen',
      prompt: 'Ergänze `ausleihen` so, wie es in der Ausgangslage beschrieben ist.',
      code: `public boolean ausleihen(String isbn, String leser) {
    if (![[0]] || [[1]])
        return false;
    [[2]];
    return true;
}`,
      blanks: [
        { options: ['bestand.containsKey(isbn)', 'ausgeliehen.containsKey(isbn)', 'bestand.containsValue(isbn)', 'bestand.get(isbn) == null'], answer: 0,
          why: 'Zuerst: Gibt es das Buch überhaupt? Das steht in `bestand`, und die ISBN ist dort der **Schlüssel**. Wegen des `!` davor wird bei einem unbekannten Buch `false` geliefert.' },
        { options: ['ausgeliehen.containsValue(leser)', 'ausgeliehen.containsKey(isbn)', 'ausgeliehen.get(leser) != null', 'bestand.containsKey(leser)'], answer: 1,
          why: 'Ist das Buch schon verliehen, steht seine ISBN als Schlüssel in `ausgeliehen`. Ob der **Leser** schon etwas ausgeliehen hat, spielt keine Rolle, er darf mehrere Bücher haben.' },
        { options: ['ausgeliehen.put(leser, isbn)', 'bestand.remove(isbn)', 'ausgeliehen.put(isbn, leser)', 'ausgeliehen.add(isbn)'], answer: 2,
          why: 'Schlüssel und Wert in der Reihenfolge der Deklaration `Map<String, String>` „ISBN -> Leser“. Mit `put(leser, isbn)` könnte ein Leser nur noch ein einziges Buch haben, weil jeder Schlüssel nur einmal vorkommt. `add` gibt es bei Maps nicht.' }
      ],
      explain: 'Beide Prüfungen laufen über **Schlüssel**: `containsKey` ist schnell, `containsValue` müsste alle Einträge durchsuchen. Aus dem Bestand wird beim Ausleihen nichts entfernt, das Buch gehört der Bibliothek ja weiterhin.' },

    { id: 'K04-S04-F02', sec: 'bib', fall: 'A', type: 'input', wichtig: true, t: 'A2 · Ausgabe vorhersagen',
      prompt: 'Was gibt das Programm aus? `ausleihen` ist wie in Teilaufgabe A1 implementiert. (drei Zeilen)',
      code: `Bibliothek bib = new Bibliothek();
System.out.println(bib.aufnehmen(new Buch("111", "Datenbanken heute", "Krause", 2021)));
System.out.println(bib.aufnehmen(new Buch("111", "Netze kompakt", "Ostrowski", 2019)));
bib.aufnehmen(new Buch("222", "Algorithmen kompakt", "Krause", 2019));
System.out.print(bib.ausleihen("111", "Ada") + " ");
System.out.print(bib.ausleihen("111", "Ben") + " ");
System.out.print(bib.ausleihen("999", "Ben") + " ");
System.out.println(bib.zurueckgeben("111") + " " + bib.zurueckgeben("111"));`,
      answers: ['true\nfalse\ntrue false false true false'],
      explain: 'Zeile 2: Die ISBN 111 ist schon im Bestand, also `false`; das zweite Buch wird **nicht** aufgenommen (es überschreibt auch nichts). Dann: Ada leiht 111 (`true`), Ben will dasselbe Buch (`false`, schon verliehen), 999 gibt es nicht (`false`). Die erste Rückgabe findet den Eintrag (`remove` liefert den Leser, also `true`), die zweite nicht mehr (`remove` liefert `null`, also `false`).' },

    { id: 'K04-S04-F03', sec: 'bib', fall: 'A', type: 'mc', wichtig: true, t: 'A3 · getAlleIsbn als Hintertür',
      prompt: 'Ein Aufrufer schreibt `bib.getAlleIsbn().remove("222");`. Was passiert, wenn `getAlleIsbn` wie vorgegeben `bestand.keySet()` zurückgibt?',
      options: [
        'Es fliegt eine `UnsupportedOperationException`, weil man aus `keySet()` nur lesen darf.',
        'Nur die zurückgegebene Menge verliert die 222, der Bestand bleibt unverändert.',
        'Das Buch 222 verschwindet aus dem Bestand, ohne dass die Bibliothek es merkt.',
        'Es passiert nichts, weil `remove` auf einer Sicht immer `false` liefert.'
      ],
      answer: 2,
      explain: '`keySet()` ist eine **Sicht** auf die Map, keine Kopie. Löschen über die Sicht löscht den Eintrag in der Map. Danach liefert z. B. `ausleihen("222", …)` `false`. Nur **hinzufügen** ist über `keySet()` verboten (`add` wirft `UnsupportedOperationException`). Abhilfe: `return new HashSet<>(bestand.keySet());` (Kopie) oder `Collections.unmodifiableSet(bestand.keySet())` (schreibgeschützte Sicht).' },

    { id: 'K04-S04-F04', sec: 'bib', fall: 'A', type: 'bug', wichtig: true, t: 'A4 · leserEntfernen: Fehler finden',
      prompt: 'Diese Implementierung von `leserEntfernen` ist falsch. Markiere die fehlerhafte Zeile und erkläre, was passiert und wie man es richtig macht.',
      code: `public int leserEntfernen(String leser) {
    int anzahl = 0;
    for (Map.Entry<String, String> e : ausgeliehen.entrySet()) {
        if (e.getValue().equals(leser)) {
            ausgeliehen.remove(e.getValue());
            anzahl++;
        }
    }
    return anzahl;
}`,
      required: [5],
      extra: [3],
      model: 'Zeile 5: `remove` erwartet den **Schlüssel** (die ISBN), übergeben wird aber der Wert (der Leser). Es wird nichts gelöscht, `anzahl` zählt trotzdem hoch. Hat Ada 3 Bücher, meldet die Methode 3, und alle 3 Ausleihen bestehen weiter. Mit `remove(e.getKey())` käme der nächste Fehler: Ändern der Map während der for-each-Schleife führt zur `ConcurrentModificationException`. Richtig: über eine Sicht löschen, z. B. `int vorher = ausgeliehen.size(); ausgeliehen.values().removeIf(l -> l.equals(leser)); return vorher - ausgeliehen.size();` oder mit einem `Iterator` und `it.remove()`.',
      explain: 'Zwei klassische Fallen in einer Methode: `Map.remove` mit dem Wert statt mit dem Schlüssel kompiliert (Parameter ist `Object`), tut aber nichts. Und strukturelle Änderungen während for-each sind verboten.' },

    { id: 'K04-S04-F05', sec: 'bib', fall: 'A', type: 'explain', wichtig: true, kind: 'Code schreiben', minuten: 6, t: 'A5 · getBuecherVon schreiben',
      prompt: 'Schreibe `getBuecherVon(String autor)`: alle Bücher des Autors als `SortedSet<Buch>`, aufsteigend nach Erscheinungsjahr, bei gleichem Jahr nach Titel. **Kein Buch darf verloren gehen**, auch nicht zwei verschiedene Bücher mit gleichem Jahr und Titel. Keine Streams.',
      model: 'Kernpunkte: (1) `TreeSet` mit einem **Comparator**, weil `Buch` nicht `Comparable` ist. (2) Vergleich zuerst nach `jahr` (`Integer.compare`), dann nach `titel`. (3) Ein **letzter Vergleich**, der verschiedene Bücher immer unterscheidet (die ISBN ist eindeutig), denn ein TreeSet behandelt `compare == 0` als Duplikat. (4) Über `bestand.values()` laufen, nur passende Autoren hinzufügen. (5) Neues Set zurückgeben, nichts Internes.',
      modelCode: `public SortedSet<Buch> getBuecherVon(String autor) {
    SortedSet<Buch> ergebnis = new TreeSet<>((b1, b2) -> {
        int erg = Integer.compare(b1.jahr(), b2.jahr());
        if (erg != 0)
            return erg;
        erg = b1.titel().compareTo(b2.titel());
        if (erg != 0)
            return erg;
        return b1.isbn().compareTo(b2.isbn());   // ISBN ist eindeutig
    });
    for (Buch b : bestand.values())
        if (b.autor().equals(autor))
            ergebnis.add(b);
    return ergebnis;
}`,
      explain: 'Ohne den ISBN-Vergleich würden zwei Ausgaben „Alpha“ von 2020 zu einem Eintrag verschmelzen. Kurzform mit Methodenreferenzen: `Comparator.comparingInt(Buch::jahr)`, dann `.thenComparing(Buch::titel)` und `.thenComparing(Buch::isbn)`.' },

    { id: 'K04-S04-F06', sec: 'bib', fall: 'A', type: 'multi', t: 'A6 · Was stimmt in der Bibliothek?',
      prompt: 'Welche Aussagen über die Klasse `Bibliothek` sind richtig?',
      options: [
        '`bestand.get("999")` liefert `null`, wenn es die ISBN nicht gibt.',
        '`ausgeliehen.values()` kann denselben Leser mehrfach enthalten.',
        '`bestand.keySet().add("333")` legt einen Eintrag ohne Buch an.',
        'Zwei `Buch`-Records mit gleichen Komponenten sind mit `equals` gleich.',
        'Eine `HashMap` liefert ihre Einträge in Einfügereihenfolge.',
        '`zurueckgeben` wirft eine Exception, wenn die ISBN unbekannt ist.'
      ],
      answer: [0, 1, 3],
      explain: '`get` und `remove` liefern bei fehlendem Schlüssel `null`, keine Exception, deshalb funktioniert `zurueckgeben` mit `!= null`. Werte einer Map dürfen sich wiederholen (Ada mit drei Büchern), Schlüssel nicht. `keySet().add` wirft `UnsupportedOperationException`. Records erzeugen `equals`/`hashCode` aus allen Komponenten. Eine `HashMap` garantiert **keine** Reihenfolge (Einfügereihenfolge: `LinkedHashMap`, sortiert: `TreeMap`).' },

    /* ==================== Fall B: Lager ==================== */

    { id: 'K04-S04-F07', sec: 'lager', fall: 'B', type: 'fill', t: 'B1 · einlagern ergänzen',
      prompt: 'Ergänze den Kern von `einlagern` (die Parameterprüfungen stehen schon davor). Ein neuer Artikel bekommt die Menge, ein vorhandener wird erhöht.',
      code: `Integer alt = bestand.[[0]](artikel);
if (alt == [[1]])
    bestand.put(artikel, menge);
else
    bestand.put(artikel, [[2]]);`,
      blanks: [
        { options: ['contains', 'get', 'remove', 'containsKey'], answer: 1,
          why: '`get` liefert den bisherigen Wert oder `null`. `remove` würde den Eintrag dabei löschen, `containsKey` liefert nur ein `boolean`.' },
        { options: ['0', 'null', 'false', '-1'], answer: 1,
          why: 'Für einen unbekannten Schlüssel liefert `get` **`null`**, nicht 0. Darum ist `alt` ein `Integer` und kein `int`: Beim Auspacken von `null` in ein `int` gäbe es eine `NullPointerException`.' },
        { options: ['menge', 'alt++', 'alt + menge', 'bestand.get(menge)'], answer: 2,
          why: '`put` mit einem vorhandenen Schlüssel **überschreibt** den alten Wert, also muss die neue Summe hinein. `alt++` würde nur um 1 erhöhen (und als Post-Inkrement sogar den alten Wert liefern).' }
      ],
      explain: 'Kurzform, die genau dasselbe tut: `bestand.merge(artikel, menge, Integer::sum);` Fehlt der Schlüssel, wird `menge` eingetragen, sonst alter und neuer Wert addiert. Dieses „Zählen oder Summieren in einer Map“ ist ein Standardmuster.' },

    { id: 'K04-S04-F08', sec: 'lager', fall: 'B', type: 'trace', wichtig: true, t: 'B2 · Inhalt der Map verfolgen',
      prompt: 'Trage nach jedem Schritt den Inhalt von `bestand` ein, so wie ihn `toString` ausgibt, z. B. `{A=1, B=2}`. `einlagern` ist wie in B1 implementiert.',
      code: `Lager a = new Lager();
a.einlagern("Schraube", 50);                 // Schritt 1
a.einlagern("Mutter", 20);                   // Schritt 2
a.einlagern("Schraube", 10);                 // Schritt 3
a.entnehmen("Mutter", 20);                   // Schritt 4
try {
    a.entnehmen("Schraube", 100);            // Schritt 5
} catch (BestandZuKleinException e) {
    System.out.println(e.getMessage());
}`,
      columns: ['bestand danach'],
      rows: [
        { label: 'Schritt 1', values: [['{Schraube=50}']] },
        { label: 'Schritt 2', values: [['{Mutter=20, Schraube=50}', '{Mutter=20,Schraube=50}']] },
        { label: 'Schritt 3', values: [['{Mutter=20, Schraube=60}', '{Mutter=20,Schraube=60}']] },
        { label: 'Schritt 4', values: [['{Schraube=60}']] },
        { label: 'Schritt 5', values: [['{Schraube=60}']] }
      ],
      explain: 'Eine `TreeMap` hält die Schlüssel **sortiert**: „Mutter“ steht vor „Schraube“, egal in welcher Reihenfolge eingefügt wurde. Schritt 3 überschreibt den Wert (50 + 10). In Schritt 4 wird genau alles entnommen, also verschwindet der Eintrag ganz (`remove`). In Schritt 5 fliegt die Exception **vor** jeder Änderung, der Bestand bleibt gleich; ausgegeben wird „Von Schraube fehlen 40 Stück“.' },

    { id: 'K04-S04-F09', sec: 'lager', fall: 'B', type: 'order', wichtig: true, t: 'B3 · umbuchen: die richtige Reihenfolge',
      prompt: 'Bringe die Schritte von `umbuchen` in die richtige Reihenfolge, sodass keine Ware verloren geht oder aus dem Nichts entsteht.',
      items: [
        'Parameter prüfen: Lager und Artikel nicht `null`, Menge positiv, sonst Exception',
        '`von.entnehmen(artikel, menge)` in einem `try`-Block aufrufen',
        'Bei `BestandZuKleinException`: `false` zurückgeben, im Ziellager hat sich nichts geändert',
        '`nach.einlagern(artikel, menge)` aufrufen',
        '`true` zurückgeben'
      ],
      explain: 'Faustregel: **Nichts verändern, bevor feststeht, dass alles klappt.** Das Entnehmen ist der Schritt, der scheitern kann, also kommt er zuerst. Erst wenn er gelungen ist, wird eingelagert. Umgekehrt (erst einlagern) entstünde bei zu wenig Bestand Ware aus dem Nichts. Die Parameterprüfung steht ganz vorne, damit auch bei Programmierfehlern nichts halb erledigt wird.' },

    { id: 'K04-S04-F10', sec: 'lager', fall: 'B', type: 'review', wichtig: true, t: 'B4 · Code-Review von umbuchen',
      prompt: 'Ein Kommilitone hat `umbuchen` so geschrieben. Welche Befunde treffen zu?',
      code: `public static boolean umbuchen(Lager von, Lager nach, String artikel, int menge) {
    nach.einlagern(artikel, menge);
    try {
        von.entnehmen(artikel, menge);
    } catch (Exception e) {
        System.out.println(e.getMessage());
        return false;
    }
    return true;
}`,
      findings: [
        { text: 'Scheitert das Entnehmen, liegt die Ware trotzdem schon im Ziellager.', correct: true,
          why: 'Zeile 2 läuft vor dem Entnehmen. Bei zu wenig Bestand entsteht Ware aus dem Nichts, und die Methode meldet auch noch `false`.' },
        { text: 'Gefangen werden sollte nur `BestandZuKleinException`, nicht `Exception`.', correct: true,
          why: '`catch (Exception e)` fängt auch Programmierfehler wie `NullPointerException` oder `IllegalArgumentException` ab und versteckt sie hinter einem `false`.' },
        { text: '`System.out.println` gehört nicht in eine Fachklasse wie `Lager`.', correct: true,
          why: 'Ein- und Ausgabe sind von der Logik zu trennen. Die Information steckt schon im Rückgabewert.' },
        { text: 'Ohne `throws BestandZuKleinException` in der Signatur kompiliert die Methode nicht.', correct: false,
          why: 'Die checked Exception wird im `catch` behandelt. Was gefangen wird, muss nicht deklariert werden.' },
        { text: '`static` ist falsch, weil die Methode mit zwei Lager-Objekten arbeitet.', correct: false,
          why: 'Die beiden Lager kommen als Parameter. Eine statische Methode darf Objekte, die sie übergeben bekommt, ganz normal benutzen.' },
        { text: 'Bei `menge = 0` bucht die Methode stillschweigend nichts um und liefert `true`.', correct: false,
          why: '`einlagern` wirft bei `menge <= 0` eine `IllegalArgumentException`, und zwar schon in Zeile 2, außerhalb des `try`.' }
      ],
      explain: 'Die drei echten Mängel: falsche Reihenfolge (Ware entsteht), zu breites `catch`, Ausgabe in der Fachklasse. Richtig: erst `entnehmen` im `try` mit `catch (BestandZuKleinException e) { return false; }`, danach `einlagern`, dann `return true`.' },

    { id: 'K04-S04-F11', sec: 'lager', fall: 'B', type: 'input', t: 'B5 · Unveränderliche Sicht',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `Lager l = new Lager();
l.einlagern("Kabel", 5);
Map<String, Integer> sicht = l.getBestand();
l.einlagern("Stecker", 3);
System.out.println(sicht);
try {
    sicht.put("Kabel", 1000);
    System.out.println("geändert");
} catch (UnsupportedOperationException e) {
    System.out.println("nicht erlaubt");
}
System.out.println(l.getMenge("Kabel"));`,
      answers: ['{Kabel=5, Stecker=3}\nnicht erlaubt\n5'],
      explain: '`Collections.unmodifiableMap` liefert keine Kopie, sondern eine **schreibgeschützte Sicht**: Der Stecker, der erst **nach** dem Holen der Sicht eingelagert wird, ist trotzdem sichtbar. Schreiben über die Sicht wirft `UnsupportedOperationException`, das Lager bleibt geschützt. Eine Momentaufnahme bekäme man mit `Map.copyOf(bestand)`.' },

    { id: 'K04-S04-F12', sec: 'lager', fall: 'B', type: 'explain', wichtig: true, kind: 'JUnit-Test schreiben', minuten: 8, t: 'B6 · Tests für umbuchen',
      prompt: 'Schreibe eine JUnit-5-Testklasse für `umbuchen`. Decke alle Fälle ab („wer testet, testet alles“): Teilmenge, gesamte Menge, zu viel, unbekannter Artikel, ungültige Menge, `null`. Prüfe jeweils **beide** Lager.',
      model: 'Kernpunkte: (1) `@BeforeEach` baut zwei frische Lager, damit die Tests unabhängig sind. (2) Erfolgsfälle: Rückgabe `true` **und** die Mengen in beiden Lagern. (3) Bei vollständigem Umbuchen verschwindet der Artikel aus dem Quelllager. (4) Fehlschlag: Rückgabe `false` **und** keines der beiden Lager hat sich verändert, das ist der eigentliche Kern der Aufgabe. (5) Ungültige Parameter mit `assertThrows`. (6) `getMenge` liefert ein `int`, also passt `assertEquals(int, int)` ohne Mehrdeutigkeit.',
      modelCode: `class LagerTest {
    private Lager von;
    private Lager nach;

    @BeforeEach
    void setUp() {
        von = new Lager();
        nach = new Lager();
        von.einlagern("Kabel", 10);
    }

    @Test
    void umbuchenTeilmenge() {
        assertTrue(Lager.umbuchen(von, nach, "Kabel", 4));
        assertEquals(6, von.getMenge("Kabel"));
        assertEquals(4, nach.getMenge("Kabel"));
    }

    @Test
    void umbuchenGesamteMenge() {
        assertTrue(Lager.umbuchen(von, nach, "Kabel", 10));
        assertFalse(von.getBestand().containsKey("Kabel"));
        assertEquals(10, nach.getMenge("Kabel"));
    }

    @Test
    void umbuchenZuVielAendertNichts() {
        assertFalse(Lager.umbuchen(von, nach, "Kabel", 11));
        assertEquals(10, von.getMenge("Kabel"));
        assertTrue(nach.getBestand().isEmpty());
    }

    @Test
    void umbuchenUnbekannterArtikel() {
        assertFalse(Lager.umbuchen(von, nach, "Stecker", 1));
        assertEquals(10, von.getMenge("Kabel"));
        assertTrue(nach.getBestand().isEmpty());
    }

    @Test
    void umbuchenMitNichtPositiverMenge() {
        assertThrows(IllegalArgumentException.class, () -> Lager.umbuchen(von, nach, "Kabel", 0));
        assertThrows(IllegalArgumentException.class, () -> Lager.umbuchen(von, nach, "Kabel", -3));
        assertEquals(10, von.getMenge("Kabel"));
    }

    @Test
    void umbuchenMitNull() {
        assertThrows(NullPointerException.class, () -> Lager.umbuchen(null, nach, "Kabel", 1));
        assertThrows(NullPointerException.class, () -> Lager.umbuchen(von, nach, null, 1));
    }
}`,
      explain: 'Der wichtigste Test ist „zu viel“: Nur wenn auch das **Ziellager** geprüft wird, fällt die falsche Reihenfolge aus B4 auf. Ein Test, der nur den Rückgabewert prüft, wäre mit der fehlerhaften Version ebenfalls grün.' },

    /* ==================== Fall C: Kursverwaltung ==================== */

    { id: 'K04-S04-F13', sec: 'kurs', fall: 'C', type: 'fill', wichtig: true, t: 'C1 · anmelden ergänzen',
      prompt: 'Ergänze `anmelden`. Gibt es den Kurs noch nicht, wird er mit einer leeren Liste angelegt. Niemand darf doppelt in einem Kurs stehen.',
      code: `public void anmelden(String kurs, Student s) {
    List<Student> liste = kurse.[[0]](kurs);
    if (liste == null) {
        liste = new ArrayList<>();
        kurse.[[1]](kurs, liste);
    }
    if (![[2]])
        liste.add(s);
}`,
      blanks: [
        { options: ['get', 'getOrDefault', 'values', 'containsKey'], answer: 0,
          why: '`get` liefert die vorhandene Liste oder `null`. `getOrDefault` bräuchte einen zweiten Parameter, `containsKey` liefert keine Liste.' },
        { options: ['add', 'set', 'put', 'putAll'], answer: 2,
          why: 'Neue Einträge kommen mit `put` in eine Map. Wichtig: Die Liste wird **vor** dem `add` eingetragen, und das ist richtig so. In der Map steht eine **Referenz** auf genau diese Liste, spätere `add`-Aufrufe landen also auch „in der Map“.' },
        { options: ['liste.contains(s)', 'kurse.containsValue(s)', 'liste.indexOf(s) > 0', 'liste == s'], answer: 0,
          why: '`contains` vergleicht mit `equals`, und ein Record vergleicht alle Komponenten. `indexOf(s) > 0` übersähe einen Treffer an Position 0. `containsValue` sucht nach einer ganzen Liste, nicht nach einem Studenten.' }
      ],
      explain: 'Das Muster „Liste zu einem Schlüssel holen, notfalls anlegen, dann hinzufügen“ heißt **Gruppieren**. Kurzform: `kurse.computeIfAbsent(kurs, k -> new ArrayList<>())` liefert die vorhandene oder eine neu eingetragene Liste.' },

    { id: 'K04-S04-F14', sec: 'kurs', fall: 'C', type: 'input', wichtig: true, t: 'C2 · Records in List und Set',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `Student a = new Student("Lina", 101);
Student b = new Student("Lina", 101);
List<Student> liste = new ArrayList<>(List.of(a, b));
Set<Student> menge = new HashSet<>(liste);
System.out.println(liste.size() + " " + menge.size() + " " + (a == b) + " " + a.equals(b));
System.out.println(liste.indexOf(b) + " " + liste.contains(new Student("Lina", 102)));`,
      answers: ['2 1 false true\n0 false'],
      explain: 'Eine Liste nimmt Duplikate auf (2), ein `HashSet` nicht (1), weil der Record `equals` und `hashCode` aus den Komponenten erzeugt. `a == b` vergleicht Referenzen: zwei `new`, also `false`. `indexOf(b)` sucht mit `equals` und findet schon `a` an Position 0. Mit anderer Matrikelnummer ist es ein anderer Student.' },

    { id: 'K04-S04-F15', sec: 'kurs', fall: 'C', type: 'input', t: 'C3 · Sicht oder Kopie?',
      prompt: 'Was gibt das Programm aus? `anmelden` ist wie in C1 implementiert. (drei Zeilen)',
      code: `Kursverwaltung kv = new Kursverwaltung();
kv.anmelden("Prog3", new Student("Lina", 101));
List<Student> sicht = kv.getTeilnehmer("Prog3");
List<Student> kopie = List.copyOf(sicht);
kv.anmelden("Prog3", new Student("Omar", 102));
kv.anmelden("Prog3", new Student("Lina", 101));
System.out.println(sicht.size() + " " + kopie.size());
System.out.println(kv.getTeilnehmer("Mathe").size());
try {
    sicht.add(new Student("Eve", 103));
    System.out.println("hinzugefügt");
} catch (UnsupportedOperationException e) {
    System.out.println("nicht erlaubt");
}`,
      answers: ['2 1\n0\nnicht erlaubt'],
      explain: '`unmodifiableList` ist eine **Sicht**: Omar ist darin sichtbar, die zweite Lina wird wegen `contains` nicht angemeldet, also 2. `List.copyOf` ist eine **Momentaufnahme** zum Zeitpunkt des Kopierens: 1. Für einen unbekannten Kurs liefert `getTeilnehmer` `List.of()` statt `null`, die Größe ist 0 und es gibt keine NPE. Über die Sicht darf man nicht schreiben.' },

    { id: 'K04-S04-F16', sec: 'kurs', fall: 'C', type: 'bug', wichtig: true, t: 'C4 · alteEntfernen überspringt jemanden',
      prompt: 'Im Kurs stehen Studierende mit den Matrikelnummern 90, 95 und 120. Nach `alteEntfernen("X", 100)` ist die 95 aber noch da. Markiere die Ursache und erkläre.',
      code: `public void alteEntfernen(String kurs, int grenze) {
    List<Student> liste = kurse.get(kurs);
    if (liste == null)
        return;
    for (int i = 0; i < liste.size(); i++) {
        if (liste.get(i).matrikel() < grenze)
            liste.remove(i);
    }
}`,
      required: [7],
      extra: [5],
      model: 'Nach `liste.remove(i)` rücken alle folgenden Elemente eine Position nach vorn: Die 95 steht jetzt auf Index 0. Das `i++` der Schleife springt aber zu Index 1, die 95 wird nie geprüft. Lösungen: `liste.removeIf(s -> s.matrikel() < grenze);` oder nach dem Entfernen `i--`, oder die Schleife von hinten laufen lassen (`for (int i = liste.size() - 1; i >= 0; i--)`). Eine `ConcurrentModificationException` gibt es hier nicht, weil kein Iterator benutzt wird. Der Fehler bleibt still.',
      explain: 'Mit Index-Schleifen gibt es zwar keine CME, dafür aber das „Überspring“-Problem. `removeIf` ist die sicherste Lösung.' },

    { id: 'K04-S04-F17', sec: 'kurs', fall: 'C', type: 'mc', t: 'C5 · Parameter für „irgendeine Liste“',
      prompt: 'Eine Hilfsmethode soll die Größe **jeder** Liste ausgeben können, sowohl `List<Student>` aus `getTeilnehmer` als auch `List<String>`. Welche Signatur funktioniert?',
      options: [
        '`static void drucke(List<Object> l)`',
        '`static void drucke(List<?> l)`',
        '`static void drucke(ArrayList<Object> l)`',
        '`static void drucke(List<Student> l)`'
      ],
      answer: 1,
      explain: 'Generics sind **nicht** polymorph: `List<Student>` ist **kein** `List<Object>`, auch wenn `Student` ein `Object` ist (sonst könnte man über die `List<Object>` einen String in die Studentenliste schmuggeln). Der Wildcard-Typ `List<?>` heißt „Liste von irgendwas“: Man kann lesen und `size()` aufrufen, aber nichts außer `null` hinzufügen. `ArrayList<…>` passt außerdem nicht zum Rückgabetyp `List`.' },

    { id: 'K04-S04-F18', sec: 'kurs', fall: 'C', type: 'explain', kind: 'Code schreiben', minuten: 5, t: 'C6 · kurseVon schreiben',
      prompt: 'Schreibe `kurseVon(Student s)`: alle Kursnamen, in denen `s` angemeldet ist, alphabetisch sortiert. Ist `s` nirgends angemeldet, kommt eine **leere** Menge zurück, nicht `null`.',
      model: 'Kernpunkte: (1) Ein `TreeSet<String>` sortiert Strings ohne Comparator alphabetisch (natürliche Ordnung). (2) Man braucht **Schlüssel und Wert** zusammen (Kursname und Liste), also `entrySet()` mit `Map.Entry`. (3) `contains` findet den Studenten über `equals` des Records. (4) Kein Treffer: das leere Set zurückgeben.',
      modelCode: `public SortedSet<String> kurseVon(Student s) {
    SortedSet<String> ergebnis = new TreeSet<>();
    for (Map.Entry<String, List<Student>> e : kurse.entrySet())
        if (e.getValue().contains(s))
            ergebnis.add(e.getKey());
    return ergebnis;
}`,
      explain: 'Ist Lina in „Prog3“, „Mathe“ und „Algo“ angemeldet, liefert die Methode `[Algo, Mathe, Prog3]`, für eine unbekannte Person `[]`. Wer nur über `keySet()` läuft, braucht in der Schleife zusätzlich `kurse.get(kurs)`: Das geht auch, ist aber ein Zugriff mehr pro Kurs.' }
  ]
});
