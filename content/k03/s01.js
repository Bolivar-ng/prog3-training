/* Kapitel 03 · Serie S01: Enums
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K03-S01',
  kapitel: 'K03',
  titel: 'Enums',
  beschreibung: 'Einsatzzweck, Typ der Konstanten, Konstruktor und Attribute, geschenkte Methoden, Vergleich mit ==, switch, values() und Konstanten mit eigener Implementierung.',
  neu: true,
  themen: [
    { id: 'einsatz',  name: 'Einsatz & Typ' },
    { id: 'aufbau',   name: 'Konstruktor, Attribute, Methoden' },
    { id: 'methoden', name: 'Geschenkte Methoden' },
    { id: 'nutzen',   name: 'Vergleich, switch, values' }
  ],
  fragen: [

    /* ========== Einsatz & Typ ========== */

    { id: 'K03-S01-F01', sec: 'einsatz', type: 'multi', wichtig: true, t: 'Sinnvoller Einsatz',
      prompt: 'Für welche dieser Sammlungen ist eine Enum **sinnvoll**? (mehrere)',
      options: [
        '`enum Himmelsrichtung`',
        '`enum Mitarbeiter`',
        '`enum Kartenfarbe` (Kreuz, Pik, Herz, Karo)',
        '`enum Produktkategorie` eines Onlineshops',
        '`enum Ampelphase`',
        '`enum BundesligaVerein`',
        '`enum Schachfigur`',
        '`enum Monat`',
        '`enum Schulferien` eines Bundeslands mit Beginn und Ende'
      ],
      answer: [0, 2, 4, 6, 7],
      explain: 'Eine Enum passt für kleine, **abgeschlossene** Mengen, die sich nie ändern. Mitarbeiter kommen und gehen, ein Shop ändert sein Sortiment, Vereine steigen auf und ab, Ferientermine werden jedes Jahr neu festgelegt. Für solche Daten braucht man Klassen, Listen oder eine Datenbank, sonst müsste man bei jeder Änderung den Quelltext neu übersetzen.' },

    { id: 'K03-S01-F02', sec: 'einsatz', type: 'mc', wichtig: true, t: 'Typ der Konstanten',
      prompt: 'Gegeben ist `public enum Ampel { ROT, GELB, GRUEN; }`. Welchen Datentyp hat `GELB`?',
      options: [
        '`int`, nämlich den Wert 1',
        '`String` mit dem Inhalt "GELB"',
        '`Ampel`',
        'gar keinen, es ist nur ein Name'
      ],
      answer: 2,
      explain: 'Jede Konstante ist ein `public static final`-Objekt vom Typ der Enum selbst: `Ampel`. Anders als in C steckt keine Zahl dahinter. Die Position liefert erst `ordinal()` (hier 1), den Namen als String erst `name()`.' },

    { id: 'K03-S01-F03', sec: 'einsatz', type: 'mc', wichtig: true, t: 'Enum erweitern',
      prompt: 'Es gibt schon `enum Zahlweise { BAR, KARTE; }`. Sie brauchen eine zweite Enum mit denselben Werten und zusätzlich `UEBERWEISUNG`. Wie geht das?',
      options: [
        '`enum ZahlweiseNeu extends Zahlweise { UEBERWEISUNG; }`',
        'Die neue Enum komplett neu schreiben, ohne Verbindung zur alten',
        '`enum ZahlweiseNeu { Zahlweise, UEBERWEISUNG; }` übernimmt alle alten Werte',
        'Eine dritte Enum mit `UEBERWEISUNG` anlegen und von beiden erben'
      ],
      answer: 1,
      explain: 'Eine Enum erbt schon von `java.lang.Enum`, mehr als eine Oberklasse gibt es in Java nicht. Beerben kann man sie auch nicht, ihr Konstruktor ist privat. Ein „Einschließen“ anderer Enums gibt es nicht. Eine Verbindung ist höchstens über ein gemeinsames Interface möglich.' },

    /* ========== Konstruktor, Attribute, Methoden ========== */

    { id: 'K03-S01-F04', sec: 'aufbau', type: 'multi', wichtig: true, t: 'Was ist in Enums erlaubt?',
      prompt: 'Welche dieser Elemente sind in einer Enum **erlaubt**? (mehrere)',
      options: [
        'ein `protected` Konstruktor',
        'eine statische Methode',
        'zwei überladene Konstruktoren',
        'ein Instanzattribut',
        'eine überschriebene `name()`-Methode',
        'eine abstrakte Methode',
        'eine überschriebene `toString()`-Methode',
        'ein Konstruktor, der als erste Anweisung `super()` aufruft'
      ],
      answer: [1, 2, 3, 5, 6],
      explain: 'Der Konstruktor ist immer privat, `protected` meldet javac als „modifier protected not allowed here“, und `super()` ist verboten. `name()` ist final und darf nicht überschrieben werden, `toString()` schon. Eine abstrakte Methode ist erlaubt, wenn jede Konstante sie in ihrem eigenen Rumpf implementiert.' },

    { id: 'K03-S01-F05', sec: 'aufbau', type: 'mc', wichtig: true, t: 'Prüfung im Konstruktor',
      prompt: 'Im Konstruktor der Enum `Kontoart` steht `if (gebuehr < 0) throw new IllegalArgumentException();`. Die Konstanten lauten `GIRO(5.0)` und `SPAR(0.0)`. Wie bewerten Sie diese Prüfung?',
      options: [
        'Nötig, weil `valueOf` den Konstruktor mit Benutzereingaben aufruft.',
        'Guter Stil, Parameter sollte man in jedem Konstruktor prüfen.',
        'Nötig, weil andere Klassen `new Kontoart(-1)` schreiben könnten.',
        'Überflüssig, nur die eigenen Konstanten rufen den Konstruktor auf.'
      ],
      answer: 3,
      explain: 'Der Enum-Konstruktor ist privat und wird ausschließlich von den Konstanten aufgerufen, die der Entwickler selbst in dieselbe Datei schreibt. Von außen kann niemand einen falschen Wert übergeben, auch `valueOf` erzeugt nichts Neues, sondern sucht nur die vorhandene Konstante.' },

    { id: 'K03-S01-F06', sec: 'aufbau', type: 'mc', wichtig: true, t: 'protected in einer Enum',
      prompt: 'Ein Instanzattribut einer Enum wird mit `protected` deklariert. Welcher Sichtbarkeit entspricht das hier tatsächlich?',
      options: [
        '`private`',
        'packageweit (ohne Modifizierer)',
        '`public`',
        'keiner, das ist ein Compilerfehler'
      ],
      answer: 1,
      explain: '`protected` heißt „Package plus Unterklassen“. Von einer Enum kann man nicht erben, die einzigen Unterklassen sind die Konstantenrümpfe, und die stehen in derselben Datei. Der Teil „plus Unterklassen“ bringt also nichts, es bleibt die packageweite Sichtbarkeit.' },

    { id: 'K03-S01-F07', sec: 'aufbau', type: 'bug', t: 'Fehler in der Enum',
      prompt: 'Datei `Kontoart.java`. Markiere alle Zeilen, an denen javac einen **Compilerfehler** meldet.',
      code: `public enum Kontoart {
    GIRO(5.0),
    SPAR(0.0);

    private final double gebuehr;

    public Kontoart(double gebuehr) {
        super();
        this.gebuehr = gebuehr;
    }

    public double getGebuehr() {
        return gebuehr;
    }

    public static Kontoart neu() {
        return new Kontoart(3.0);
    }
}`,
      required: [7, 8, 17],
      explain: 'Zeile 7: Ein Enum-Konstruktor darf nicht `public` sein („modifier public not allowed here“). Zeile 8: `super()` ist im Enum-Konstruktor verboten. Zeile 17: Von einer Enum kann man keine Objekte mit `new` erzeugen, auch nicht innerhalb der Enum („enum classes may not be instantiated“). Die übrigen Zeilen sind korrekt, `final` beim Attribut ist sogar empfehlenswert.' },

    { id: 'K03-S01-F08', sec: 'aufbau', type: 'input', t: 'Konstanten mit eigenem Rumpf',
      prompt: 'Was gibt das Programm aus? (vier Zeilen)',
      code: `enum Rechenart {
    PLUS("+") {
        @Override
        public int rechne(int a, int b) { return a + b; }
    },
    MINUS("-") {
        @Override
        public int rechne(int a, int b) { return a - b; }
    },
    MAL("*") {
        @Override
        public int rechne(int a, int b) { return a * b; }
        @Override
        public String toString() { return "x"; }
    };

    private final String zeichen;

    Rechenart(String zeichen) { this.zeichen = zeichen; }

    public String getZeichen() { return zeichen; }

    public abstract int rechne(int a, int b);
}

public class Test {
    public static void main(String[] args) {
        for (Rechenart r : Rechenart.values()) {
            System.out.println(r + " " + r.getZeichen() + " " + r.rechne(6, 3));
        }
        System.out.println(Rechenart.MAL.name());
    }
}`,
      answers: ['PLUS + 9\nMINUS - 3\nx * 18\nMAL'],
      explain: 'Jede Konstante hat ihre eigene Version von `rechne`. Bei `MAL` ist zusätzlich `toString()` überschrieben, darum steht dort `x` statt `MAL`. `name()` ist final und liefert immer den echten Namen der Konstanten: `MAL`.' },

    { id: 'K03-S01-F09', sec: 'aufbau', type: 'mc', t: 'Warum die abstrakte Methode?',
      prompt: 'Jede Konstante von `Rechenart` implementiert `rechne` in ihrem eigenen Rumpf. Wozu steht dann zusätzlich `public abstract int rechne(int a, int b);` in der Enum?',
      options: [
        'Damit der Compiler weiß, dass jedes `Rechenart`-Objekt `rechne` hat, und den Aufruf zulässt.',
        'Gar nicht nötig, man kann die Zeile ohne Folgen weglassen.',
        'Weil Unterklassen nur vorhandene Methoden überschreiben, aber keine neuen hinzufügen dürfen.',
        'Weil `values()` sonst die Konstanten mit eigenem Rumpf nicht findet.'
      ],
      answer: 0,
      explain: 'Der Compiler prüft einen Aufruf über den **statischen Typ**, und der ist `Rechenart`. Ohne die abstrakte Methode gäbe es `rechne` nur in den namenlosen Unterklassen, `Rechenart.PLUS.rechne(6, 3)` wäre ein Compilerfehler. Neue Methoden in Unterklassen sind übrigens durchaus erlaubt, man sieht sie nur über den Oberklassentyp nicht. `values()` hat damit nichts zu tun.' },

    /* ========== Geschenkte Methoden ========== */

    { id: 'K03-S01-F10', sec: 'methoden', type: 'input', t: 'name, ordinal, values, valueOf',
      prompt: 'Was gibt das Programm aus? (fünf Zeilen)',
      code: `enum Ampel { ROT, GELB, GRUEN }

public class Test {
    public static void main(String[] args) {
        Ampel a = Ampel.valueOf("GELB");
        System.out.println(a.name() + " " + a.ordinal());
        System.out.println(a.compareTo(Ampel.ROT) > 0);
        System.out.println(Ampel.GRUEN);
        Ampel[] alle = Ampel.values();
        alle[0] = null;
        System.out.println(Ampel.values()[0]);
        try {
            Ampel.valueOf("Rot");
        } catch (IllegalArgumentException e) {
            System.out.println("Fehler");
        }
    }
}`,
      answers: ['GELB 1\ntrue\nGRUEN\nROT\nFehler'],
      explain: '`ordinal()` zählt ab 0, also 1 für GELB. `compareTo` vergleicht nach der Definitionsreihenfolge: GELB steht nach ROT, Ergebnis positiv. `toString()` liefert standardmäßig den Namen. `values()` gibt bei jedem Aufruf eine **neue Kopie** zurück, das Überschreiben von `alle[0]` ändert die Enum nicht. `valueOf` unterscheidet Groß- und Kleinschreibung, „Rot“ gibt es nicht: `IllegalArgumentException`.' },

    { id: 'K03-S01-F11', sec: 'methoden', type: 'match', t: 'Welche Methode?',
      prompt: 'Ordne jeder Beschreibung die passende Methode einer Enum zu.',
      pairs: [
        ['liefert die Position der Konstanten, beginnend bei 0', '`ordinal()`'],
        ['die einzige geerbte Methode, die man überschreiben darf', '`toString()`'],
        ['statisch, liefert ein Array mit allen Konstanten', '`values()`'],
        ['statisch, wirft bei unbekanntem Namen eine IllegalArgumentException', '`valueOf(String)`'],
        ['final, liefert immer den Namen aus dem Quelltext', '`name()`'],
        ['vergleicht nach der Reihenfolge der Definition', '`compareTo(…)`']
      ],
      explain: '`name()`, `ordinal()`, `compareTo`, `equals` und `hashCode` sind final. `toString()` liefert ohne Überschreiben dasselbe wie `name()`. `values()` und `valueOf()` erzeugt der Compiler als statische Methoden für jede Enum.' },

    { id: 'K03-S01-F12', sec: 'methoden', type: 'mc', t: 'ordinal speichern?',
      prompt: 'Ein Programm speichert die Kontoart jedes Kontos als `art.ordinal()` in einer Datei. Später wird in der Enum eine neue Konstante **vor** `SPAR` eingefügt. Was passiert beim Einlesen alter Dateien?',
      options: [
        'Nichts, `ordinal()` bleibt für jede Konstante dauerhaft gleich, egal wo sie steht.',
        'Gespeicherte Sparbücher werden falsch als die neue Kontoart erkannt.',
        'Beim Einlesen wird eine `IllegalArgumentException` geworfen.',
        'Der Compiler verhindert das Einfügen einer neuen Konstanten.'
      ],
      answer: 1,
      explain: '`ordinal()` ist nur die aktuelle Position. Rückt `SPAR` von 1 auf 2, steht an Position 1 die neue Konstante, und alle gespeicherten Einsen werden falsch gedeutet, ganz ohne Fehlermeldung. Wer etwas speichert, nimmt besser `name()` und liest mit `valueOf()` wieder ein, oder ein eigenes Attribut.' },

    /* ========== Vergleich, switch, values ========== */

    { id: 'K03-S01-F13', sec: 'nutzen', type: 'mc', wichtig: true, t: 'Sicher vergleichen',
      prompt: 'Die Variable `art` vom Typ `Kontoart` kann auch `null` sein. Welche Prüfung, ob sie `GIRO` enthält, funktioniert **in jedem Fall** korrekt?',
      options: [
        '`art.equals(Kontoart.GIRO)`',
        '`art.toString().equals("GIRO")`',
        '`art.name().equals(Kontoart.GIRO.name())`',
        '`art == Kontoart.GIRO`'
      ],
      answer: 3,
      explain: 'Pro Konstante gibt es genau ein Objekt, darum ist `==` korrekt und liefert bei `null` einfach `false`. Die drei anderen rufen eine Methode auf `art` auf: bei `null` eine `NullPointerException`. `toString` ist zusätzlich unsicher, weil es überschrieben sein kann.' },

    { id: 'K03-S01-F14', sec: 'nutzen', type: 'fill', t: 'switch und values',
      prompt: 'Vervollständige die Methoden in der Enum `Kontoart` (Konstanten `GIRO`, `SPAR`, Attribut `bezeichnung`).',
      code: `public String beschreibung() {
    return switch (this) {
        case [[0]] -> "für den Alltag";
        case SPAR -> "zum Sparen";
    };
}

public static Kontoart zuBezeichnung(String text) {
    for (Kontoart k : [[1]]) {
        if (k.bezeichnung.equals(text)) {
            return k;
        }
    }
    throw new IllegalArgumentException("unbekannt: " + text);
}`,
      blanks: [
        { options: ['Kontoart.GIRO', 'GIRO', '"GIRO"', 'GIRO()'], answer: 1,
          why: 'In einem switch über eine Enum steht im `case` nur der Konstantenname, ohne den Enum-Namen davor. Ein String passt nicht zum Typ `Kontoart`.' },
        { options: ['Kontoart', 'values', 'values()', 'Kontoart.valueOf()'], answer: 2,
          why: '`values()` liefert das Array aller Konstanten. Innerhalb der Enum reicht der Aufruf ohne `Kontoart.` davor. `valueOf` sucht nur eine Konstante nach ihrem Namen.' }
      ],
      explain: '`valueOf` findet eine Konstante nur über ihren **Namen** (z. B. "GIRO"). Soll über ein **Attribut** gesucht werden, durchläuft man `values()`. In einem switch-Ausdruck über alle Konstanten braucht man kein `default`, der Compiler prüft die Vollständigkeit.' },

    { id: 'K03-S01-F15', sec: 'nutzen', type: 'explain', t: '== bei Enums, aber nicht bei String',
      prompt: 'Warum darf man Enum-Konstanten mit `==` vergleichen, zwei `String`-Objekte aber nicht?',
      model: '`==` vergleicht Referenzen, also ob es **dasselbe Objekt** ist. Von jeder Enum-Konstanten gibt es genau ein Objekt: Der Konstruktor ist privat, `new` ist verboten, und `valueOf` liefert immer das vorhandene Objekt. Gleicher Wert bedeutet also immer dasselbe Objekt. Strings dagegen kann man beliebig oft erzeugen (`new String`, Einlesen, Zusammensetzen). Zwei Strings mit gleichem Inhalt können verschiedene Objekte sein, `==` liefert dann `false`. Für den Inhalt braucht man bei Strings `equals`. Bonus: `==` ist bei Enums null-sicher, `equals` nicht.' }
  ]
});
