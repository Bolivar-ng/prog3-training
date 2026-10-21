/* Probetest T03: Gemischt mit Prog-2-Wiederholung, 35 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java (Java 25) geprüft. */
P3.serie({
  id: 'K90-T03',
  kapitel: 'K90',
  titel: 'Gemischt: Bankprojekt und Prog-2-Wiederholung',
  beschreibung: 'Theorie und Praxis gemischt: abstrakte Klassen, Überschreiben nach Liskov, Generics, Stapel, Wrapper- und String-Fallen aus Prog 2, dazu Maven, static, switch und Bankprojekt aus Prog 3.',
  neu: true,
  dauer: 35,
  themen: [
    { id: 'oop',     name: 'Vererbung & Überschreiben' },
    { id: 'prog2',   name: 'Prog-2-Fallen & Generics' },
    { id: 'bank',    name: 'Bankprojekt & static' },
    { id: 'maven',   name: 'Maven' }
  ],
  fragen: [

    { id: 'K90-T03-F01', sec: 'oop', type: 'mc', t: 'Abstrakte Klasse',
      prompt: '`Konto` ist im Bankprojekt `abstract`. Welche Zeile kompiliert **nicht**?',
      options: [
        '`Konto k = new Girokonto(kunde, 1234, dispo);`',
        '`Konto[] konten = new Konto[10];`',
        '`Konto k = new Konto(kunde, 1234);`',
        '`List<Konto> liste = new ArrayList<>();`'
      ],
      answer: 2,
      explain: 'Von einer abstrakten Klasse kann man kein Objekt erzeugen („Konto is abstract; cannot be instantiated“). Als Datentyp für Variablen, Arrays und Listen ist sie dagegen erlaubt: Das Array enthält nur Referenzen, noch keine Konto-Objekte.' },

    { id: 'K90-T03-F02', sec: 'oop', type: 'multi', t: 'Regeln beim Überschreiben',
      prompt: '`Konto` hat `public void abheben(Geldbetrag b)` (ohne throws) und `protected Konto kopie()`. Welche Überschreibungen in `Girokonto` sind **erlaubt**? (mehrere)',
      options: [
        '`@Override public Girokonto kopie()`',
        '`@Override void abheben(Geldbetrag b)`',
        '`@Override public void abheben(Geldbetrag b) throws GesperrtException` (checked)',
        '`@Override public Konto kopie()`',
        '`@Override public void abheben(Geldbetrag b) throws IllegalStateException`'
      ],
      answer: [0, 3, 4],
      explain: 'Erlaubt: Sichtbarkeit **erweitern** (protected → public) und einen spezielleren Rückgabetyp liefern (kovariant). Verboten: Sichtbarkeit einschränken (public → paketweit) und **neue checked** Exceptions werfen. Unchecked Exceptions darf man immer deklarieren. Das ist Liskov: Ein Girokonto muss überall funktionieren, wo ein Konto erwartet wird.' },

    { id: 'K90-T03-F03', sec: 'oop', type: 'mc', t: 'protected',
      prompt: 'Wer darf auf ein `protected`-Attribut von `Konto` (Package `bankprojekt.basisdaten`) zugreifen?',
      options: [
        'nur `Konto` selbst und ihre Unterklassen im selben Package',
        'alle Klassen, die `Konto` importieren',
        'nur Unterklassen, auch die im selben Package nicht',
        'alle Klassen im selben Package und alle Unterklassen'
      ],
      answer: 3,
      explain: '`protected` = paketweit **plus** Unterklassen in anderen Packages. Es ist also offener als die Standard-Sichtbarkeit (ohne Schlüsselwort). Deshalb gilt bei Frau Hubrich: Attribute immer `private`, auch nicht `protected`.' },

    { id: 'K90-T03-F04', sec: 'prog2', type: 'input', t: 'Integer-Cache',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println(x == y);
System.out.println(p == q);
System.out.println(p.equals(q));`,
      answers: ['true\nfalse\ntrue'],
      explain: '`==` vergleicht bei Objekten die **Referenzen**. Java hält Integer-Objekte von −128 bis 127 in einem Cache, deshalb zeigen `x` und `y` zufällig auf dasselbe Objekt. 128 liegt außerhalb, also zwei verschiedene Objekte. Für den Inhalt immer `equals`.' },

    { id: 'K90-T03-F05', sec: 'prog2', type: 'input', t: 'String-Vergleich',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `String s1 = "Konto";
String s2 = "Konto";
String s3 = new String("Konto");
System.out.println(s1 == s2);
System.out.println(s1 == s3);
System.out.println(s1.equals(s3));`,
      answers: ['true\nfalse\ntrue'],
      explain: 'Gleiche String-**Literale** teilt sich Java (String-Pool), also dieselbe Referenz. `new String` erzeugt immer ein neues Objekt. Gleiche Regel wie oben: Inhalt mit `equals`.' },

    { id: 'K90-T03-F06', sec: 'prog2', type: 'input', t: 'Stapel (Stack)',
      prompt: 'Was gibt das Programm aus? (eine Zeile, ohne Leerzeichen)',
      code: `Deque<String> stapel = new ArrayDeque<>();
stapel.push("A");
stapel.push("B");
stapel.push("C");
System.out.print(stapel.pop());
stapel.push("D");
System.out.print(stapel.pop());
System.out.print(stapel.peek());
System.out.println(stapel.size());`,
      answers: ['CDB2'],
      explain: 'Ein Stapel arbeitet LIFO: Das zuletzt Eingelegte kommt zuerst heraus. `pop` entfernt C, dann wird D eingelegt und wieder entfernt. `peek` zeigt B, **ohne** es zu entfernen. Übrig sind A und B, also Größe 2.' },

    { id: 'K90-T03-F07', sec: 'prog2', type: 'mc', t: 'Leerer Stapel',
      prompt: 'Eure eigene Stapel-Klasse aus Prog 2 bekommt `pop()` aufgerufen, obwohl sie leer ist. Welche Exception passt am besten?',
      options: [
        '`IllegalStateException`',
        '`NullPointerException`',
        '`IllegalArgumentException`',
        '`ArrayIndexOutOfBoundsException`'
      ],
      answer: 0,
      explain: '`pop()` hat gar kein Argument, das falsch sein könnte. Der **Zustand** des Objekts (leer) passt nicht zur Operation, also IllegalStateException. Eine ArrayIndexOutOfBoundsException würde das Innenleben (ein Array) nach außen verraten.' },

    { id: 'K90-T03-F08', sec: 'prog2', type: 'mc', t: 'Löschen in der for-each-Schleife',
      prompt: 'Was passiert?',
      code: `List<String> l = new ArrayList<>(List.of("Anna", "Ben", "Cem"));
for (String s : l) {
    if (s.equals("Anna"))
        l.remove(s);
}
System.out.println(l);`,
      options: [
        'Ausgabe `[Ben, Cem]`',
        '`ConcurrentModificationException`',
        'Ausgabe `[Anna, Ben, Cem]`',
        'Compilerfehler: In einer for-each-Schleife darf man nicht `remove` aufrufen'
      ],
      answer: 1,
      explain: 'Die for-each-Schleife benutzt intern einen Iterator. Ändert man die Liste an ihm vorbei, merkt er das beim nächsten `next()` und wirft die Exception. Richtig: `l.removeIf(s -> s.equals("Anna"));`, wieder ein Lambda (Predicate).' },

    { id: 'K90-T03-F09', sec: 'prog2', type: 'fill', t: 'Generische Methode',
      prompt: 'Vervollständige eine generische Methode, die das größere von zwei vergleichbaren Objekten liefert. `max("Birne", "Apfel")` soll `Birne` liefern, `max(3, 7)` soll `7` liefern.',
      code: `public static [[0]] T max(T a, T b) {
    return [[1]] ? a : b;
}`,
      blanks: [
        { options: ['<T extends Comparable<T>>', '<T implements Comparable<T>>', '<Comparable T>', '<T>'], answer: 0,
          why: 'Eine Schranke für Typparameter schreibt man immer mit `extends`, auch bei Interfaces. Mit nur `<T>` kennt der Compiler `compareTo` nicht.' },
        { options: ['a.compareTo(b) >= 0', 'a > b', 'a.equals(b)', 'a.compareTo(b) < 0'], answer: 0,
          why: '`>` gibt es nur für primitive Zahlen. Positiv oder 0 heißt: a ist mindestens so groß wie b. Mit `< 0` würde das Minimum herauskommen.' }
      ],
      explain: 'Mit Typparametern wäre der `Vergleicher` aus der Übung ohne `Object` und ohne instanceof ausgekommen. Darauf weist Frau Hubrich im Kommentar ausdrücklich hin („leider haben wir noch keine Typparameter kennengelernt“).' },

    { id: 'K90-T03-F10', sec: 'bank', type: 'input', t: 'static-Zähler',
      prompt: 'Was gibt das Programm aus? (eine Zeile)',
      code: `class Konto {
    private static int anzahl = 0;
    private final int nummer;

    Konto() {
        anzahl++;
        nummer = anzahl;
    }
}

// in main (gleiche Datei, Zugriff erlaubt):
Konto a = new Konto();
Konto b = new Konto();
Konto c = b;
System.out.println(a.nummer + " " + b.nummer + " " + c.nummer + " " + Konto.anzahl);`,
      answers: ['1 2 2 2'],
      explain: '`anzahl` ist statisch: **eine** Variable für die ganze Klasse, sie zählt die erzeugten Objekte. `c = b` erzeugt kein neues Konto, sondern kopiert nur die Referenz. Also zwei Objekte, `c` und `b` sind dasselbe.' },

    { id: 'K90-T03-F11', sec: 'bank', type: 'input', t: 'Moderner switch',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `enum Kontoart { GIRO, SPARBUCH, FESTGELD }

static String gebuehr(Kontoart art) {
    return switch (art) {
        case GIRO -> "5 EUR";
        case SPARBUCH, FESTGELD -> {
            String s = "keine";
            yield s + " Gebuehr";
        }
    };
}

// in main:
System.out.println(gebuehr(Kontoart.GIRO));
System.out.println(gebuehr(Kontoart.FESTGELD));`,
      answers: ['5 EUR\nkeine Gebuehr'],
      explain: 'Mit `->` gibt es kein Durchfallen und kein `break`. Mehrere Fälle trennt man mit Komma. In einem Block liefert `yield` den Wert des switch-Ausdrucks. Weil alle enum-Werte abgedeckt sind, braucht man kein `default`.' },

    { id: 'K90-T03-F12', sec: 'bank', type: 'review', t: 'Review: Klasse Kunde',
      prompt: 'Welche Befunde treffen auf diesen Ausschnitt zu?',
      code: `public class Kunde {
    public String vorname;
    private LocalDate geburtstag;

    public Kunde(String vorname, LocalDate geburtstag) {
        this.vorname = vorname;
        this.geburtstag = geburtstag;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Kunde k)) return false;
        return vorname.equals(k.vorname) && geburtstag.equals(k.geburtstag);
    }
}`,
      findings: [
        { text: '`vorname` müsste `private` sein.', correct: true,
          why: 'Attribute immer private. Sonst kann jeder den Namen ändern, auch auf `null`.' },
        { text: '`equals` ist überschrieben, `hashCode` nicht: In einem `HashSet` werden gleiche Kunden doppelt gespeichert.', correct: true,
          why: 'Der Hashcode von Object hängt an der Identität. Gleiche Kunden landen meist in verschiedenen Buckets.' },
        { text: 'Der Konstruktor prüft nicht auf `null`, später kann `equals` eine NullPointerException werfen.', correct: true,
          why: 'Keine ungültigen Werte in Attributen: Die Kunde-Klasse aus der Übung wirft deshalb schon im Konstruktor eine NullPointerException.' },
        { text: 'Pattern-instanceof in `equals` kompiliert erst ab Java 25.', correct: false,
          why: 'Pattern Matching für instanceof gibt es seit Java 16.' },
        { text: 'Es fehlt JavaDoc für Klasse und Konstruktor.', correct: true,
          why: 'JavaDoc ist Pflicht für alles, was sichtbarer als private ist.' }
      ],
      explain: 'Typische Klausur-Review: Sichtbarkeit, equals/hashCode als Paar, ungültige Werte schon beim Erzeugen abfangen, JavaDoc.' },

    { id: 'K90-T03-F13', sec: 'bank', type: 'explain', t: 'Warum ist Geldbetrag unveränderlich?',
      prompt: '`Geldbetrag` ist im Bankprojekt unveränderlich (immutable). Erkläre zwei Vorteile und nenne zwei Merkmale im Code, die das sicherstellen.',
      model: 'Vorteile: 1) Man kann eine Referenz bedenkenlos weitergeben (z. B. per Getter `getKontostand()`), niemand kann den Betrag eines Kontos von außen verändern. Bei einer veränderlichen Klasse müsste man Kopien zurückgeben. 2) Er ist sicher als Schlüssel in HashMap/HashSet und in sortierten Strukturen, weil sich `hashCode` und `compareTo` nie mehr ändern. (Weitere: threadsicher, einfacher zu verstehen.) Merkmale: Attribute `private final`, keine Setter, Rechenmethoden wie `plus` und `minus` liefern ein **neues** Objekt statt `this` zu ändern, die Klasse ist `final` (oder hat einen privaten Konstruktor), damit keine Unterklasse sie veränderlich macht.' },

    { id: 'K90-T03-F14', sec: 'maven', type: 'order', t: 'Lebenszyklus',
      prompt: 'Bringe die Phasen des default-Lebenszyklus in die richtige Reihenfolge.',
      items: ['`process-resources`', '`compile`', '`test-compile`', '`test`', '`package`', '`install`'],
      explain: 'Erst Ressourcen kopieren und den Hauptcode übersetzen, dann den Testcode, dann testen, dann packen, dann ins lokale Repository (`~/.m2`) installieren. Jede Phase führt alle davor mit aus.' },

    { id: 'K90-T03-F15', sec: 'maven', type: 'mc', t: 'Programm mit Maven starten',
      prompt: 'Das Bankprojekt soll später eine JavaFX-Oberfläche bekommen. Womit startet man `spielereien.KontenSpielereien` am besten aus Maven heraus?',
      options: [
        '`mvn exec:java` mit dem exec-maven-plugin',
        '`mvn package`, danach startet das jar automatisch',
        '`mvn javafx:run` mit dem javafx-maven-plugin',
        '`mvn compile` mit `<mainClass>` im compiler-plugin'
      ],
      answer: 2,
      explain: 'Beide Plugins starten eine Klasse mit `main`. `exec:java` läuft aber in der JVM von Maven und legt alles auf den Classpath. JavaFX ist seit Java 11 nicht mehr im JDK und braucht den Modulpfad, das erledigt das javafx-Plugin selbst. Darauf hat Frau Hubrich in der Übung hingewiesen. `<mainClass>` vollqualifiziert mit Punkten.' },

    { id: 'K90-T03-F16', sec: 'maven', type: 'mc', t: 'Assembly ohne eigene Datei',
      prompt: 'Wie schreibt man den Assembly-Descriptor für die Abgabe direkt in die pom, statt eine eigene Datei `src/assembly/abgabe.xml` anzulegen?',
      options: [
        '`<descriptors><descriptor>…</descriptor></descriptors>` mit dem ganzen XML als Text darin',
        '`<inlineDescriptors><inlineDescriptor>…</inlineDescriptor></inlineDescriptors>`',
        '`<descriptorRefs><descriptorRef>abgabe</descriptorRef></descriptorRefs>`',
        'gar nicht, der Descriptor muss immer eine eigene Datei sein'
      ],
      answer: 1,
      explain: 'Seit maven-assembly-plugin 3.2.0 gibt es `<inlineDescriptors>`. In `<inlineDescriptor>` steht derselbe Inhalt wie sonst in `<assembly>` (id, formats, fileSets). `<descriptor>` erwartet einen Dateipfad, `<descriptorRef>` nur die vordefinierten Descriptoren wie `jar-with-dependencies`.' }
  ]
});
