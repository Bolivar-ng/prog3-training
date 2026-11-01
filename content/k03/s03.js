/* Kapitel 03 · Serie S03: Praxis – Währungen, Record Geldbetrag, Enums aus java.time, switch über Enums
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K03-S03',
  kapitel: 'K03',
  titel: 'Praxis: Währungen, Geldbetrag, java.time',
  beschreibung: 'Enums und Records im Bankprojekt: Geldbetrag mit Währung als Record, Umrechnen und Vergleichen, Währungswechsel im Konto, Month und DayOfWeek, switch über Enums und die Decimal4J-Dependency.',
  neu: true,
  themen: [
    { id: 'geld',   name: 'Record Geldbetrag' },
    { id: 'konto',  name: 'Währungswechsel im Konto' },
    { id: 'jdk',    name: 'Enums aus java.time' },
    { id: 'switch', name: 'switch über Enums' },
    { id: 'maven',  name: 'Bibliothek einbinden' }
  ],
  fragen: [

    /* ========== Record Geldbetrag ========== */

    { id: 'K03-S03-F01', sec: 'geld', type: 'fill', t: 'Geldbetrag wird ein Record',
      prompt: 'Die Klasse `Geldbetrag` soll ein Record mit Betrag und Währung werden. Der gespeicherte Betrag wird auf zwei Nachkommastellen gerundet, `new Geldbetrag(100)` muss weiter funktionieren. Vervollständige.',
      code: `public [[0]] Geldbetrag(double betrag, Waehrung waehrung)
        implements Comparable<Geldbetrag> {

    public Geldbetrag {
        if (!Double.isFinite(betrag))
            throw new IllegalArgumentException("Betrag ungültig");
        if (waehrung == null)
            throw new NullPointerException("Währung fehlt");
        [[1]] = round(betrag, 2);
    }

    public Geldbetrag(double betrag) {
        [[2]];
    }

    public double getBetrag() {
        return betrag;
    }
}`,
      blanks: [
        { options: ['class', 'record', 'enum', 'final class'], answer: 1,
          why: 'Mit `record` und den Komponenten im Kopf erzeugt der Compiler Attribute, kanonischen Konstruktor, `betrag()`, `waehrung()`, `equals`, `hashCode` und `toString`.' },
        { options: ['this.betrag', 'betrag', 'Geldbetrag.betrag', 'betrag()'], answer: 1,
          why: 'Im kompakten Konstruktor ändert man den **Parameter**. Die Zuweisung an das Attribut ergänzt der Compiler am Ende. `this.betrag = …` wäre ein Compilerfehler.' },
        { options: ['this.betrag = betrag', 'this(betrag, Waehrung.EUR)', 'super(betrag)', 'new Geldbetrag(betrag, Waehrung.EUR)'], answer: 1,
          why: 'Ein zusätzlicher Konstruktor muss als erste Anweisung einen vorhandenen mit `this(...)` aufrufen. So läuft auch der Euro-Betrag durch Prüfung und Rundung.' }
      ],
      explain: '`getBetrag()` bleibt zusätzlich zu `betrag()` stehen, weil die Schnittstelle der Klasse unverändert bleiben soll: Andere Klassen im Projekt rufen ihn auf.' },

    { id: 'K03-S03-F02', sec: 'geld', type: 'input', t: 'Rechnen in zwei Währungen',
      prompt: 'Was gibt das Programm aus? (vier Zeilen)',
      code: `enum Waehrung {
    EUR(1), MKD(61.5);
    private final double kurs;
    Waehrung(double kurs) { this.kurs = kurs; }
    public double getKurs() { return kurs; }
}

record Geldbetrag(double betrag, Waehrung waehrung) {
    public Geldbetrag {
        betrag = Math.round(betrag * 100) / 100.0;
    }
    public Geldbetrag(double betrag) {
        this(betrag, Waehrung.EUR);
    }
    public Geldbetrag umrechnen(Waehrung ziel) {
        return new Geldbetrag(betrag / waehrung.getKurs() * ziel.getKurs(), ziel);
    }
    public Geldbetrag plus(Geldbetrag g) {
        return new Geldbetrag(betrag + g.umrechnen(waehrung).betrag, waehrung);
    }
}

public class Test {
    public static void main(String[] args) {
        Geldbetrag e = new Geldbetrag(10.005);
        Geldbetrag m = new Geldbetrag(123, Waehrung.MKD);
        System.out.println(e);
        System.out.println(e.plus(m));
        System.out.println(m.plus(e).betrag());
        System.out.println(e.equals(new Geldbetrag(10.01, Waehrung.EUR)));
    }
}`,
      answers: ['Geldbetrag[betrag=10.01, waehrung=EUR]\nGeldbetrag[betrag=12.01, waehrung=EUR]\n738.62\ntrue'],
      explain: 'Der kompakte Konstruktor rundet 10,005 auf 10.01. `e.plus(m)`: 123 Ден sind 123 / 61,5 = 2 €, das Ergebnis bleibt in der Währung von `e`: 12.01 €. `m.plus(e)`: 10,01 € sind 615,615 → gerundet 615.62 Ден, plus 123 = 738.62 Ден. Das erzeugte `equals` vergleicht Betrag **und** Währung: beide gleich, also `true`.' },

    { id: 'K03-S03-F03', sec: 'geld', type: 'mc', t: 'equals und hashCode im Record',
      prompt: 'Die alte Klasse `Geldbetrag` hatte eigene `equals`- und `hashCode`-Methoden, die nur den Betrag verglichen. Was macht man damit beim Umbau zum Record mit Betrag und Währung?',
      options: [
        'Man behält beide, sonst ändert sich die Schnittstelle der Klasse.',
        'Man behält `equals`, löscht aber `hashCode`, das erzeugt der Record.',
        'Man löscht beide, der Record erzeugt sie über Betrag und Währung.',
        'Man löscht beide, danach gibt es kein `equals` mehr außer dem von Object.'
      ],
      answer: 2,
      explain: 'Der Record erzeugt `equals` und `hashCode` über **alle** Komponenten. Genau das ist richtig: 100 € und 100 Ден sind verschieden. Die Schnittstelle bleibt gleich, die Methoden existieren weiter, nur vom Compiler erzeugt. Die alten Versionen hätten die Währung ignoriert.' },

    { id: 'K03-S03-F04', sec: 'geld', type: 'trace', t: 'compareTo über Währungen',
      prompt: '`compareTo` vergleicht bei verschiedenen Währungen den Wert in Euro und bei Gleichstand die Reihenfolge der Währungen in der Enum (EUR vor MKD). Trage das **Vorzeichen** des Ergebnisses ein: `negativ`, `0` oder `positiv`.',
      code: `public int compareTo(Geldbetrag o) {
    if (this.waehrung == o.waehrung)
        return Double.compare(this.betrag, o.betrag);
    int ergebnis = Double.compare(this.betrag / this.waehrung.getKurs(),
                                  o.betrag / o.waehrung.getKurs());
    if (ergebnis != 0)
        return ergebnis;
    return this.waehrung.compareTo(o.waehrung);
}
// Kurse: EUR = 1, MKD = 61.5`,
      columns: ['Vorzeichen'],
      rows: [
        { label: '100 € mit 6150 Ден', values: [['negativ', 'Negativ', '-', '<0', '-1']] },
        { label: '6150 Ден mit 100 €', values: [['positiv', 'Positiv', '+', '>0', '1']] },
        { label: '50 € mit 6150 Ден', values: [['negativ', 'Negativ', '-', '<0', '-1']] },
        { label: '200 Ден mit 3 €', values: [['positiv', 'Positiv', '+', '>0', '1']] },
        { label: '7 € mit 7.00 €', values: [['0']] }
      ],
      explain: '100 € und 6150 Ден sind gleich viel wert (6150 / 61,5 = 100). Darum entscheidet die Enum-Reihenfolge: EUR steht vor MKD, also negativ, umgekehrt positiv. So liefert `compareTo` nur bei gleichem Betrag **und** gleicher Währung 0, konsistent mit `equals`. 200 Ден sind ≈ 3,25 € und damit mehr als 3 €.' },

    /* ========== Währungswechsel im Konto ========== */

    { id: 'K03-S03-F05', sec: 'konto', type: 'bug', t: 'Währungswechsel mit Fehlern',
      prompt: 'Der Code kompiliert, rechnet aber falsch. Markiere die beiden Zeilen mit dem **logischen** Fehler.',
      code: `public abstract class Konto {
    private Geldbetrag kontostand;

    public void waehrungswechsel(Waehrung neu) {
        kontostand.umrechnen(neu);
    }
}

public class Girokonto extends Konto {
    private Geldbetrag dispo;

    @Override
    public void waehrungswechsel(Waehrung neu) {
        dispo = dispo.umrechnen(neu);
    }
}`,
      required: [5, 14],
      extra: [13],
      explain: 'Zeile 5: `Geldbetrag` ist ein Record und damit unveränderlich. `umrechnen` liefert ein **neues** Objekt, das hier weggeworfen wird. Richtig: `kontostand = kontostand.umrechnen(neu);` (bzw. über `setKontostand`). Zeile 14: Die Überschreibung rechnet nur den Dispo um, der Aufruf `super.waehrungswechsel(neu);` fehlt. Der Kontostand eines Girokontos bliebe in der alten Währung.' },

    { id: 'K03-S03-F06', sec: 'konto', type: 'mc', t: 'Wohin mit dem Dispo?',
      prompt: 'Beim Währungswechsel muss im Girokonto auch der Dispo umgerechnet werden. `Konto` kennt keinen Dispo. Welche Lösung ist die beste?',
      options: [
        'In `Konto` prüfen: `if (this instanceof Girokonto g)` und dann `g.setDispo(…)` aufrufen.',
        '`waehrungswechsel` in `Girokonto` überschreiben: `super.waehrungswechsel(neu)`, dann den Dispo umrechnen.',
        'Den Dispo als `protected` Attribut nach `Konto` verschieben, damit alle Konten ihn umrechnen können.',
        'Eine eigene Methode `dispoWechseln` in `Girokonto`, die der Aufrufer nach dem Wechsel zusätzlich aufrufen muss.'
      ],
      answer: 1,
      explain: 'Polymorphie: Jede Klasse kümmert sich um ihre eigenen Attribute. `super.…` übernimmt den Kontostand ohne Copy & Paste, und kommt `null`, fliegt die Exception, bevor der Dispo angefasst wird. `instanceof` mit Down-Cast soll man vermeiden, ein Dispo im Sparbuch ergibt keinen Sinn, und eine zweite Methode, die man nicht vergessen darf, ist eine Fehlerquelle.' },

    { id: 'K03-S03-F07', sec: 'konto', type: 'review', t: 'Und das Sparbuch?',
      prompt: 'Im Sparbuch steht `private Geldbetrag bereitsAbgehoben = Geldbetrag.NULL_EURO;`. Beim Abheben: `bereitsAbgehoben.plus(betrag).compareTo(ABHEBESUMME) <= 0` und danach `bereitsAbgehoben = bereitsAbgehoben.plus(betrag);`. `ABHEBESUMME` ist `new Geldbetrag(2000)`. `plus` rechnet den Summanden in die Währung von `this` um, `compareTo` vergleicht über den Euro-Wert. Welche Befunde treffen zu?',
      findings: [
        { text: '`bereitsAbgehoben` bleibt immer in Euro, egal in welcher Währung das Konto geführt wird.', correct: true,
          why: 'Es startet in Euro, und `plus` liefert das Ergebnis in der Währung von `this`.' },
        { text: 'Das Sparbuch muss `waehrungswechsel` nicht überschreiben.', correct: true,
          why: 'Der Zähler gehört nicht zur Kontowährung, und alle Vergleiche funktionieren über Währungen hinweg.' },
        { text: 'Nach einem Wechsel nach MKD vergleicht die Grenze 2000 Ден statt 2000 €.', correct: false,
          why: '`ABHEBESUMME` ist und bleibt ein Euro-Betrag, und `compareTo` rechnet über den Euro-Wert.' },
        { text: 'Kleine Rundungsdifferenzen im Cent-Bereich sind möglich, weil jeder Betrag beim Umrechnen gerundet wird.', correct: true,
          why: 'Jede Umrechnung rundet auf zwei Nachkommastellen. Über viele Abhebungen können sich Cents summieren.' }
      ],
      explain: 'Merke: Ein Attribut muss nur mitwechseln, wenn es zur **Kontowährung** gehört (wie Kontostand und Dispo). Ein interner Zähler mit fester Währung darf bleiben.' },

    { id: 'K03-S03-F08', sec: 'konto', type: 'order', t: 'Was passiert bei new Geldbetrag(100)?',
      prompt: '`Geldbetrag` hat einen kompakten Konstruktor (prüft, rundet) und den Konstruktor `Geldbetrag(double betrag) { this(betrag, Waehrung.EUR); }`. Bringe die Schritte bei `new Geldbetrag(100)` in die richtige Reihenfolge.',
      items: [
        'Der Konstruktor `Geldbetrag(double)` wird aufgerufen.',
        '`this(betrag, Waehrung.EUR)` ruft den kompakten Konstruktor auf.',
        'Der kompakte Konstruktor prüft Betrag und Währung.',
        'Der Parameter `betrag` wird gerundet.',
        'Der Compiler-Code weist `this.betrag` und `this.waehrung` zu.',
        'Der restliche Code nach `this(...)` im Euro-Konstruktor läuft (hier: keiner).'
      ],
      explain: 'Jeder Weg zum Objekt endet im kompakten Konstruktor. Darum gehören Prüfung und Rundung genau dorthin, nicht in den Euro-Konstruktor. Die Zuweisungen an die Attribute stehen unsichtbar am **Ende** des kompakten Konstruktors.' },

    /* ========== Enums aus java.time ========== */

    { id: 'K03-S03-F09', sec: 'jdk', type: 'input', t: 'Month und DayOfWeek',
      prompt: 'Was gibt das Programm aus? (fünf Zeilen) Der 2. November 2026 ist ein Montag.',
      code: `import java.time.*;

public class Test {
    public static void main(String[] args) {
        System.out.println(Month.FEBRUARY.maxLength() + " " + Month.FEBRUARY.minLength());
        System.out.println(Month.MARCH.getValue() + " " + Month.MARCH.ordinal());
        System.out.println(Month.DECEMBER.plus(2));
        System.out.println(LocalDate.of(2026, 11, 2).getDayOfWeek());
        System.out.println(DayOfWeek.SUNDAY.getValue());
    }
}`,
      answers: ['29 28\n3 2\nFEBRUARY\nMONDAY\n7'],
      explain: '`maxLength` berücksichtigt Schaltjahre (29), `minLength` nicht (28). `getValue()` ist die übliche Nummer (März = 3), `ordinal()` die Position in der Enum ab 0 (2). `plus` rechnet im Kreis: Dezember + 2 = Februar. Ausgegeben wird `toString()`, also der Konstantenname in Großbuchstaben. In `DayOfWeek` ist Montag 1 und Sonntag 7.' },

    { id: 'K03-S03-F10', sec: 'jdk', type: 'fill', t: 'Datum auf Gültigkeit prüfen',
      prompt: 'Tag und Monat werden eingegeben (ohne Jahr). `gueltig` soll true sein, wenn es dieses Datum in irgendeinem Jahr gibt. Vervollständige mit der Enum `java.time.Month`.',
      code: `boolean gueltig = false;
if (monat >= 1 && monat <= 12) {
    Month m = [[0]](monat);
    gueltig = tag >= 1 && tag <= m.[[1]]();
}`,
      blanks: [
        { options: ['Month.valueOf', 'Month.of', 'Month.values()', 'new Month'], answer: 1,
          why: '`Month.of(int)` liefert die Konstante zur Monatsnummer 1 bis 12. `valueOf` erwartet den **Namen** als String („MARCH“), `values()` ist ein Array, und `new` ist bei Enums verboten.' },
        { options: ['minLength', 'getValue', 'maxLength', 'ordinal'], answer: 2,
          why: 'Ohne Jahr ist der 29.2. möglich (in Schaltjahren). `maxLength()` liefert für den Februar 29, `minLength()` nur 28.' }
      ],
      explain: 'Die Prüfung `monat >= 1 && monat <= 12` steht **vorher**, weil `Month.of(13)` eine `DateTimeException` wirft. Selbst prüfen ist hier besser, als eine Exception zu werfen und sofort wieder zu fangen.' },

    { id: 'K03-S03-F11', sec: 'jdk', type: 'mc', t: 'Month.values()[monat]?',
      prompt: 'Ein Kommilitone schreibt `Month m = Month.values()[monat];` statt `Month.of(monat)`. Was passiert bei der Eingabe `monat = 12`?',
      options: [
        'Es klappt, `m` ist `DECEMBER`.',
        'Es gibt eine `DateTimeException`.',
        '`m` ist `JANUARY`, weil der Index im Kreis zählt.',
        'Es gibt eine `ArrayIndexOutOfBoundsException`.'
      ],
      answer: 3,
      explain: '`values()` liefert ein Array mit 12 Einträgen, Index 0 bis 11. Index 12 gibt es nicht. Bei allen anderen Eingaben wäre `m` um einen Monat verschoben (Eingabe 3 → APRIL), weil der Index bei 0 beginnt, die Monatsnummer aber bei 1. Das ist der Unterschied zwischen `ordinal()` und `getValue()`.' },

    /* ========== switch über Enums ========== */

    { id: 'K03-S03-F12', sec: 'switch', type: 'input', t: 'switch-Ausdruck mit yield',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `enum Kontoart { GIRO, SPAR, FESTGELD, DEPOT }

public class Test {
    static int gebuehr(Kontoart art) {
        return switch (art) {
            case GIRO -> 5;
            case SPAR, FESTGELD -> 0;
            case DEPOT -> {
                int grund = 10;
                yield grund * 2;
            }
        };
    }

    public static void main(String[] args) {
        int summe = 0;
        for (Kontoart k : Kontoart.values()) {
            summe += gebuehr(k);
        }
        System.out.println(summe);
        System.out.println(gebuehr(Kontoart.valueOf("FESTGELD")));
    }
}`,
      answers: ['25\n0'],
      explain: 'GIRO 5 + SPAR 0 + FESTGELD 0 + DEPOT 20 = 25. Mit `->` gibt es kein Durchfallen, mehrere Konstanten stehen mit Komma in einem `case`. Im Block liefert `yield` den Wert. Ein `default` ist nicht nötig, weil alle vier Konstanten abgedeckt sind.' },

    { id: 'K03-S03-F13', sec: 'switch', type: 'bug', t: 'switch über eine Ampel',
      prompt: 'Markiere alle Zeilen, an denen javac einen **Compilerfehler** meldet. (javac meldet sie nacheinander, wenn man jeweils den vorigen Fehler behebt.)',
      code: `enum Ampel { ROT, GELB, GRUEN }

public class Test {
    static String text(Ampel a) {
        return switch (a) {
            case ROT -> "Stopp";
            case GELB -> {
                System.out.println("Achtung");
                return "Warten";
            }
        };
    }
}`,
      required: [5, 9],
      explain: 'Zeile 9: In einem switch-**Ausdruck** liefert `yield` den Wert. `return` würde die ganze Methode verlassen („attempt to return out of a switch expression“). Zeile 5: `GRUEN` fehlt. Ein switch-Ausdruck muss alle Werte abdecken („does not cover all possible input values“). Lösung: `case GRUEN -> "Fahren";` ergänzen. Bei einer Enum reicht es, alle Konstanten aufzuzählen, `default` ist dann nicht nötig.' },

    /* ========== Bibliothek einbinden ========== */

    { id: 'K03-S03-F14', sec: 'maven', type: 'multi', t: 'Decimal4J einbinden',
      prompt: 'In einer vorgegebenen Enum steht `import static org.decimal4j.util.DoubleRounder.*;`. Eclipse meldet „The import org.decimal4j cannot be resolved“. Welche Aussagen sind richtig? (mehrere)',
      options: [
        'Die Bibliothek fehlt als Dependency in der `pom.xml`.',
        'Man muss die jar-Datei von Hand in den Ordner `src/main/java` kopieren und dort entpacken.',
        'Ohne Angabe eines Scopes gilt `compile`, das ist hier richtig.',
        'Mit `<scope>test</scope>` würde der Hauptcode weiterhin nicht kompilieren.',
        'Nach dem Ändern der pom hilft in Eclipse „Maven → Update Project“.',
        'Der Fehler verschwindet, wenn man `static` aus dem Import entfernt.'
      ],
      answer: [0, 2, 3, 4],
      explain: 'Ein Import, der nicht mit `java.` beginnt und „cannot be resolved“ meldet, deutet fast immer auf eine fehlende Dependency. Maven lädt die jar selbst herunter. Der Scope `test` macht die Bibliothek nur für `src/test/java` sichtbar, die Enum liegt aber im Hauptcode. `import static` holt die statischen Methoden wie `round` ohne Klassennamen, mit dem Fehler hat das nichts zu tun.' },

    { id: 'K03-S03-F15', sec: 'geld', type: 'explain', t: 'Warum nie 0 bei verschiedener Währung?',
      prompt: '100 € und 6150 Ден sind gleich viel wert. Warum darf `compareTo` für diese beiden Geldbeträge trotzdem **nicht** 0 liefern? Was könnte sonst schiefgehen?',
      model: '`compareTo` muss konsistent mit `equals` sein: 0 genau dann, wenn `equals` true liefert. Das erzeugte `equals` des Records vergleicht Betrag **und** Währung, für 100 € und 6150 Ден also `false`. Lieferte `compareTo` 0, wären sie für sortierte Strukturen (z. B. `TreeSet`, `TreeMap`) gleich, für Hash-Strukturen und `equals` verschieden. Ein `TreeSet` würde den zweiten Betrag nicht aufnehmen, ein `HashSet` schon. Darum entscheidet bei gleichem Wert die Währung, z. B. über die Reihenfolge in der Enum (`waehrung.compareTo(o.waehrung)`).' }
  ]
});
