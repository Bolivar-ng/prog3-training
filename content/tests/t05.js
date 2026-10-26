/* Probetest T05: Prüfungsnah – lange Aufgaben und Transfer, 40 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K90-T05',
  kapitel: 'K90',
  titel: 'Prüfungsnah: lange Aufgaben und Transfer',
  beschreibung: 'Lange Aufgabentexte, Korrekt/Falsch-Listen, Lückentexte und Transfer auf unbekannte Java-Klassen. Dazu Grundlagen, die gern nebenbei abgefragt werden.',
  neu: true,
  dauer: 40,
  themen: [
    { id: 'regeln',   name: 'Konventionen & Grundlagen' },
    { id: 'typen',    name: 'Typen & Zuweisungen' },
    { id: 'transfer', name: 'Transfer: unbekannte Klassen' },
    { id: 'oop',      name: 'Vererbung & Konstruktoren' },
    { id: 'iface',    name: 'Interfaces & Lombok' },
    { id: 'maven',    name: 'Maven' }
  ],
  fragen: [

    { id: 'K90-T05-F01', sec: 'regeln', type: 'multi', t: 'Namenskonventionen',
      prompt: 'Welche Aussagen zu den Namenskonventionen in Java sind **korrekt**? (mehrere)',
      options: [
        'Getter für eine Eigenschaft vom Typ boolean heißen isEigenschaft.',
        'Der Name einer Testklasse besteht aus dem Namen der getesteten Klasse und der Endung Test.',
        'Alle Variablen, die mit final deklariert sind, werden komplett in Großbuchstaben geschrieben.',
        'Packagenamen werden kleingeschrieben und bestehen aus einem Wort.',
        'Der Name einer eigenen Exception-Klasse beginnt mit dem Wort Exception.',
        'Parameter werden wie Klassen im Upper Camel Case geschrieben.'
      ],
      answer: [0, 1, 3],
      explain: 'Großbuchstaben mit Unterstrich gelten nur für **statische** Konstanten (`static final`), nicht für jede finale Variable. Exception-Klassen **enden** auf Exception (Suffix, kein Präfix). Parameter, Variablen, Attribute und Methoden schreibt man im lower Camel Case.' },

    { id: 'K90-T05-F02', sec: 'regeln', type: 'input', t: 'Ganzzahlarithmetik',
      prompt: 'Was gibt das Programm aus? (drei Zeilen)',
      code: `System.out.println(7 / 2 * 2 + 7 % 2);
System.out.println(7 / 2.0);
System.out.println((double) (7 / 2));`,
      answers: ['7\n3.5\n3.0'],
      explain: '`7 / 2` ist Ganzzahldivision: 3, mal 2 gibt 6, dazu `7 % 2` = 1 ergibt 7. Ist **ein** Operand ein double, wird in double gerechnet: 3.5. In der dritten Zeile wird zuerst ganzzahlig geteilt (3), erst danach in double umgewandelt: 3.0.' },

    { id: 'K90-T05-F03', sec: 'typen', type: 'multi', t: 'Möglich oder Compilerfehler?',
      prompt: 'Welche Zuweisungen sind **möglich** (kompilieren)? Hinweis: `Number` ist eine abstrakte Klasse, `Integer` erbt von ihr. `String` und `StringBuilder` implementieren `CharSequence`, `Thread` implementiert `Runnable`. (mehrere)',
      options: [
        '`Number n = Integer.valueOf(5);`',
        '`Integer i = new Number();`',
        '`Comparable<String> c = "abc";`',
        '`CharSequence cs = new StringBuilder();`',
        '`StringBuilder kontoauszug = "Kontostand";`',
        '`Object[] o = new String[2];`',
        '`String[] s = new Object[2];`',
        '`Runnable r = new Thread();`'
      ],
      answer: [0, 2, 3, 5, 7],
      explain: 'Regel: Links darf der allgemeinere Typ stehen (Oberklasse, implementiertes Interface), rechts der speziellere. Von der abstrakten Klasse Number gibt es kein `new`. Ein String-Literal ist ein String und kein StringBuilder. Arrays verhalten sich genauso: `String[]` passt in `Object[]`, umgekehrt nicht.' },

    { id: 'K90-T05-F04', sec: 'transfer', type: 'fill', t: 'Transfer: TimerTask',
      prompt: 'Ein Programm soll nach einer Sekunde eine Erinnerung ausgeben. Aus der Dokumentation: Die Klasse `Timer` hat die Methode `void schedule(TimerTask task, long delay)`. `TimerTask` ist eine **abstrakte Klasse** mit der abstrakten Methode `void run()`. Vervollständige den Code mit einer **anonymen Klasse**.',
      code: `Timer timer = new Timer();
TimerTask aufgabe = [[0]] {
    [[1]]
    public void [[2]] {
        System.out.println("Erinnerung");
    }
}[[3]]
timer.schedule([[4]], 1000);`,
      blanks: [
        { options: ['new TimerTask()', 'new TimerTask', 'new TimerTask() implements Runnable', 'TimerTask()'], answer: 0,
          why: 'Anonyme Klasse = `new` + Typ + **runde Klammern** (Konstruktoraufruf) + Rumpf. Ein `implements` gibt es bei anonymen Klassen nie.' },
        { options: ['@Override', '@Overwrite', '@Implements', '@FunctionalInterface'], answer: 0,
          why: 'Die abstrakte Methode run wird überschrieben, das kennzeichnet `@Override`. Die anderen Annotationen gibt es so nicht bzw. gehören an ein Interface.' },
        { options: ['run()', 'run', 'schedule()', 'start()'], answer: 0,
          why: 'Implementiert wird genau die abstrakte Methode aus der Dokumentation: `void run()` ohne Parameter.' },
        { options: [';', 'nichts', ')', '};'], answer: 0,
          why: 'Die anonyme Klasse steht in einer Zuweisung, also endet die Anweisung nach der schließenden geschweiften Klammer mit `;`.' },
        { options: ['aufgabe', 'timer', 'new TimerTask()', 'run()'], answer: 0,
          why: '`schedule` erwartet ein TimerTask-Objekt, und das ist `aufgabe`.' }
      ],
      explain: 'Ein Lambda wäre hier **nicht** möglich: TimerTask ist eine abstrakte **Klasse**, kein funktionales Interface. Bei einer Klasse bleibt nur eine Unterklasse, benannt oder anonym. Das Prinzip ist dasselbe wie bei Interfaces, nur mit `extends` bzw. anonymer Unterklasse.' },

    { id: 'K90-T05-F05', sec: 'transfer', type: 'fill', t: 'Transfer: for-each für eigene Klassen',
      prompt: 'Sie möchten Objekte Ihrer Klasse `Kontoliste` direkt in einer for-each-Schleife durchlaufen: `for (Konto k : liste)`. Aus der Dokumentation: Die for-each-Schleife funktioniert mit allen Objekten vom Typ `Iterable<T>`. Dieses Interface hat die einzige abstrakte Methode `Iterator<T> iterator()`. Vervollständige den Text.',
      code: `Die Klasse [[0]] muss das Interface [[1]] implementieren,
d. h. im Kopf der Klasse steht dafür ein implements.

Die Methode iterator() muss [[2]] zurückgeben.

Iterator<Konto> ist [[3]], deshalb liefert man meist einfach
den Iterator einer intern gespeicherten Liste zurück.`,
      blanks: [
        { options: ['Kontoliste', 'Konto', 'Iterator', 'ArrayList'], answer: 0,
          why: 'Die Schleife läuft über ein Kontoliste-Objekt, also muss **diese** Klasse den Vertrag erfüllen.' },
        { options: ['Iterable<Konto>', 'Iterator<Konto>', 'Comparable<Konto>', 'List<Konto>'], answer: 0,
          why: 'Laut Dokumentation verlangt die Schleife ein `Iterable`. Der Typparameter ist der Typ der Elemente, also Konto.' },
        { options: ['ein Objekt vom Typ Iterator<Konto>', 'eine Liste aller Konten', 'true, wenn es weitere Konten gibt', 'das nächste Konto'], answer: 0,
          why: 'So steht es in der Signatur: Rückgabetyp `Iterator<T>`. Mit T = Konto also `Iterator<Konto>`.' },
        { options: ['auch ein Interface', 'eine abstrakte Klasse', 'eine finale Klasse', 'ein primitiver Datentyp'], answer: 0,
          why: 'Iterator ist ein Interface (`hasNext`, `next`). Man muss es nicht selbst implementieren, wenn man den Iterator einer vorhandenen Liste weitergibt: `return konten.iterator();`.' }
      ],
      explain: 'Transfer-Aufgabe: Die Klassen sind neu, das Prinzip ist bekannt. Eine Methode verlangt einen Interface-Typ, also muss die eigene Klasse dieses Interface implementieren und **alle** abstrakten Methoden so umsetzen, wie es in der Dokumentation steht. Geprüft: `class Kontoliste implements Iterable<Konto>` mit `return konten.iterator();` kompiliert, und die for-each-Schleife funktioniert.' },

    { id: 'K90-T05-F06', sec: 'oop', type: 'input', t: 'super und dynamische Bindung',
      prompt: 'Was gibt `A a = new B(); a.m1();` aus? (drei Zeilen)',
      code: `class A {
    void m1() {
        System.out.println("A1");
        m2();
    }
    void m2() {
        System.out.println("A2");
    }
}

class B extends A {
    @Override
    void m1() {
        System.out.println("B1");
        super.m1();
    }
    @Override
    void m2() {
        System.out.println("B2");
    }
}`,
      answers: ['B1\nA1\nB2'],
      explain: 'Das Objekt ist ein B, also läuft `B.m1()`: „B1“. `super.m1()` ruft gezielt die Version aus A auf: „A1“. Darin steht `m2()`, also `this.m2()`, und `this` ist immer noch das B-Objekt. Deshalb wird **`B.m2()`** aufgerufen: „B2“. `super` gilt nur für den einen Aufruf, nicht für alles, was darin passiert.' },

    { id: 'K90-T05-F07', sec: 'iface', type: 'multi', t: 'Erlaubt in einem Interface?',
      prompt: 'Welche Deklarationen sind **innerhalb eines Interfaces** erlaubt? (mehrere)',
      options: [
        '`private static void hilfe() { }`',
        '`protected abstract void pruefeKontostand();`',
        '`final default void zeige() { }`',
        '`int MAX = 5;`',
        '`static int zaehler;`',
        '`default String text() { return "x"; }`',
        '`abstract static void erzeuge();`',
        '`private void log() { }`'
      ],
      answer: [0, 3, 5, 7],
      explain: 'Erlaubt: Konstanten (automatisch `public static final`, deshalb muss `MAX` einen Wert haben), default-Methoden und seit Java 9 private Hilfsmethoden, statisch oder nicht. Verboten: `protected`; `final` bei default-Methoden (sie sollen überschreibbar sein); eine Variable ohne Wert (`zaehler`), weil sie automatisch final wäre; `abstract static`, weil sich statische Methoden nicht überschreiben lassen.' },

    { id: 'K90-T05-F08', sec: 'regeln', type: 'multi', t: 'Statischer Import',
      prompt: 'Welche Zeilen sind gültige **statische Imports**? (mehrere)',
      options: [
        '`import static java.lang.Math.sqrt;`',
        '`static import java.lang.Math.sqrt;`',
        '`import static java.lang.Math.*;`',
        '`import static java.lang.Math;`',
        '`import java.lang.Math.sqrt;`'
      ],
      answer: [0, 2],
      explain: 'Die Reihenfolge ist `import static`, nicht `static import`. Importiert wird ein **statisches Element** (`Math.sqrt`) oder alle (`Math.*`), nie die Klasse allein. Danach kann man `sqrt(2)` statt `Math.sqrt(2)` schreiben, also ohne den Klassennamen. Ein normaler import kann keine Methode importieren.' },

    { id: 'K90-T05-F09', sec: 'oop', type: 'input', t: 'Statischer Block',
      prompt: 'Was gibt `main` aus? (vier Zeilen)',
      code: `class Zaehler {
    private static int anzahl;

    static {
        anzahl = 10;
        System.out.println("statisch " + anzahl);
    }

    Zaehler() {
        anzahl++;
        System.out.println("Objekt " + anzahl);
    }
}

// in main:
System.out.println("Start");
new Zaehler();
new Zaehler();`,
      answers: ['Start\nstatisch 10\nObjekt 11\nObjekt 12'],
      explain: 'Der statische Block läuft **genau einmal**, wenn die Klasse zum ersten Mal benutzt wird, also erst beim ersten `new Zaehler()`, nach „Start“. Beim zweiten Objekt läuft er nicht noch einmal. `anzahl` ist statisch, beide Objekte zählen dieselbe Variable hoch.' },

    { id: 'K90-T05-F10', sec: 'oop', type: 'multi', t: 'this(...) im Konstruktor',
      prompt: 'Welche Aussagen über `this(...)` und `super(...)` in Konstruktoren sind **korrekt**? (mehrere)',
      options: [
        '`this(...)` ruft einen anderen Konstruktor derselben Klasse auf.',
        '`this(...)` und `super(...)` können nicht beide im selben Konstruktor aufgerufen werden.',
        '`this(...)` darf in jeder Instanzmethode aufgerufen werden, um einen Konstruktor erneut auszuführen.',
        '`this(...)` erzeugt ein zusätzliches neues Objekt.',
        'Steht weder `this(...)` noch `super(...)` im Konstruktor, fügt der Compiler `super()` ein.'
      ],
      answer: [0, 1, 4],
      explain: '`this(...)` gibt es nur in Konstruktoren und erzeugt **kein** neues Objekt: Derselbe Aufbau wird an einen anderen Konstruktor weitergereicht. Beide Aufrufe wollen die Konstruktorkette bestimmen, deshalb nur einer von beiden (javac: „call to this must be first statement in constructor“). Fehlt beides, ergänzt der Compiler `super()`.' },

    { id: 'K90-T05-F11', sec: 'iface', type: 'fill', t: 'Lombok richtig einsetzen',
      prompt: 'In `Buch` soll Lombok die Getter und Setter erzeugen. In `titel` darf nie `null` stehen. `seiten` soll von außen nur gelesen werden können.',
      code: `public class Buch {
    @Getter
    [[0]]
    private String titel;

    [[1]]
    private int seiten;
}`,
      blanks: [
        { options: ['@Setter(onParam_ = {@NonNull})', '@Setter(onParam = {@NonNull})', '@Setter(@NonNull)', '@Setter'], answer: 0,
          why: 'Mit `onParam_` (Unterstrich!) bekommt der Parameter des Setters `@NonNull`, und Lombok erzeugt eine null-Prüfung (NullPointerException). Ohne Unterstrich und `@Setter(@NonNull)` kompilieren gar nicht, `@Setter` allein lässt null durch (alles geprüft).' },
        { options: ['@Getter', '@Getter @Setter', '@Setter', '@NonNull'], answer: 0,
          why: 'Nur lesen = nur ein Getter, kein Setter.' }
      ],
      explain: 'Lombok erzeugt die Methoden beim Kompilieren. Damit das auch mit Maven und Java 25 funktioniert, braucht man eine aktuelle Lombok-Version und `annotationProcessorPaths` im maven-compiler-plugin.' },

    { id: 'K90-T05-F12', sec: 'maven', type: 'mc', t: 'Plugin mit execution aufrufen',
      prompt: 'In der pom steht das `maven-javadoc-plugin`. Seine Konfiguration steht **innerhalb** einer `<execution>` mit `<id>doku</id>`, das Goal heißt `javadoc`. Mit welchem Befehl führt man genau diese Konfiguration aus?',
      options: [
        '`mvn javadoc:doku@javadoc`',
        '`mvn javadoc@doku`',
        '`mvn maven-javadoc-plugin:doku`',
        '`mvn javadoc:javadoc@doku`'
      ],
      answer: 3,
      explain: 'Aufbau: `mvn plugin-präfix:goal@executionId`. Ohne `@doku` würde das Goal laufen, aber ohne die Konfiguration aus der execution. Das ist dasselbe Muster wie `mvn javafx:run@starten`.' },

    { id: 'K90-T05-F13', sec: 'maven', type: 'multi', t: 'Lebenszyklen',
      prompt: 'Welche der folgenden Begriffe sind **eingebaute Lebenszyklen** von Maven (und nicht nur Phasen)? (mehrere)',
      options: [
        '`default`',
        '`clean`',
        '`site`',
        '`test`',
        '`package`',
        '`install`'
      ],
      answer: [0, 1, 2],
      explain: 'Maven hat drei eingebaute Lebenszyklen: `default` (Bauen: compile, test, package, install, deploy …), `clean` (aufräumen) und `site` (Projektdokumentation erzeugen). `test`, `package` und `install` sind **Phasen** im default-Lebenszyklus.' },

    { id: 'K90-T05-F14', sec: 'iface', type: 'bug', t: 'Drei Compilerfehler',
      prompt: 'Diese Klasse kompiliert nicht. Markiere die **drei** Zeilen, die man ändern muss.',
      code: `interface Bewertbar {
    int bewerte(String kriterium);
}

public class Produkt implements Bewertbar, Comparable<Produkt> {
    private final String name;
    private int punkte;

    public Produkt(String name) {
        this.name = name;
    }

    int bewerte(String kriterium) {
        return punkte;
    }

    @Override
    public int compareTo(Object o) {
        return Integer.compare(punkte, ((Produkt) o).punkte);
    }

    public void setName(String n) {
        name = n;
    }
}`,
      required: [13, 18, 23],
      extra: [5, 17],
      explain: 'Zeile 13: Interface-Methoden sind public, beim Implementieren darf die Sichtbarkeit nicht kleiner werden („cannot implement … weaker access“). Zeile 18: `Comparable<Produkt>` verlangt `compareTo(Produkt o)`, mit `Object` wird nichts überschrieben (javac meldet deshalb auch Zeile 5 und das `@Override` in Zeile 17). Zeile 23: `name` ist `final` und wurde im Konstruktor schon gesetzt.' },

    { id: 'K90-T05-F15', sec: 'transfer', type: 'explain', t: 'Transfer: eigener Log-Handler',
      prompt: 'Ein Logger hat die Methode `void addHandler(Handler handler)`. Aus der Dokumentation: `Handler` ist eine **abstrakte Klasse** mit den abstrakten Methoden `void publish(LogRecord record)`, `void flush()` und `void close() throws SecurityException`. Sie wollen ein Objekt Ihrer eigenen Klasse `Protokoll` übergeben. Beschreibe, was Sie tun müssen, und schreibe den Klassenkopf und den Aufruf.',
      model: 'Weil Handler eine **Klasse** ist (kein Interface), muss Protokoll von ihr erben: `public class Protokoll extends Handler`. Dann müssen **alle drei** abstrakten Methoden überschrieben werden (mit @Override): publish, flush, close. Was jede genau tun soll, steht in der Dokumentation von Handler, die muss man lesen (der Vertrag), statt nur leere Methoden zu erzeugen. SecurityException ist unchecked, das throws darf also stehen bleiben oder entfallen. Aufruf: `logger.addHandler(new Protokoll());`. Ein Lambda oder `implements` geht hier nicht, weil Handler eine abstrakte Klasse mit mehreren abstrakten Methoden ist. (Geprüft: kompiliert, und `logger.info("hallo")` landet in publish.)' },

    { id: 'K90-T05-F16', sec: 'regeln', type: 'input', t: 'String-Verkettung',
      prompt: 'Was gibt diese Zeile aus?',
      code: `System.out.println(1 + 2 + "3" + 4 + 5);`,
      answers: ['3345'],
      explain: 'Ausgewertet wird von links nach rechts. `1 + 2` sind zwei Zahlen: 3. Ab dem ersten String wird verkettet: `3 + "3"` ergibt „33“, dann „334“, dann „3345“. Die 4 und die 5 werden nicht mehr addiert.' }
  ]
});
