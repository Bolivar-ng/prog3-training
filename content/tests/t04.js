/* Probetest T04: Moodle-Themen gezielt, 30 Minuten
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K90-T04',
  kapitel: 'K90',
  titel: 'Moodle-Themen gezielt',
  beschreibung: '14 Fragen genau zu den angekündigten Themen: neuer switch, System.out.println, anonyme Klassen, instanceof und getClass, Pakete und import, Interfaces, Maven-Plugins.',
  neu: true,
  dauer: 30,
  themen: [
    { id: 'switch',  name: 'switch alt und neu' },
    { id: 'system',  name: 'System.out.println' },
    { id: 'anonym',  name: 'Anonyme Klassen' },
    { id: 'inst',    name: 'instanceof & getClass' },
    { id: 'paket',   name: 'Pakete & import' },
    { id: 'iface',   name: 'Interfaces' },
    { id: 'maven',   name: 'Maven-Plugins' }
  ],
  fragen: [

    { id: 'K90-T04-F01', sec: 'switch', type: 'input', t: 'Altes switch: Durchfallen',
      prompt: 'Was gibt das Programm aus? (zwei Zeilen)',
      code: `int monat = 2;
String s = "";
switch (monat) {
    case 1: s += "Jan ";
    case 2: s += "Feb ";
    case 3: s += "Mar ";
        break;
    case 4: s += "Apr ";
    default: s += "? ";
}
System.out.println(s.trim());

int tage = switch (monat) {
    case 4, 6, 9, 11 -> 30;
    case 2 -> {
        int t = 28;
        yield t;
    }
    default -> 31;
};
System.out.println(tage);`,
      answers: ['Feb Mar\n28'],
      explain: 'Im alten switch springt Java zu `case 2` und läuft **ohne break** einfach weiter in `case 3` (Durchfallen), erst das `break` stoppt. Im neuen switch mit `->` gibt es kein Durchfallen. Ein Block liefert seinen Wert mit `yield`.' },

    { id: 'K90-T04-F02', sec: 'switch', type: 'fill', t: 'Alt in neu überführen',
      prompt: 'Überführe das alte switch in einen switch-**Ausdruck** mit gleichem Verhalten.',
      code: `// alt:
// switch (art) {
//     case GIRO:     gebuehr = 5; break;
//     case SPARBUCH:
//     case FESTGELD: gebuehr = 0; break;
//     default:       gebuehr = 1;
// }

int gebuehr = switch (art) {
    case GIRO [[0]] 5;
    case [[1]] -> 0;
    default -> 1;
}[[2]]`,
      blanks: [
        { options: ['->', ':', '=>', '='], answer: 0,
          why: 'Der neue switch benutzt den Pfeil `->`. Mit `:` wäre es wieder die alte Form mit Durchfallen.' },
        { options: ['SPARBUCH, FESTGELD', 'SPARBUCH: case FESTGELD', 'SPARBUCH | FESTGELD', 'SPARBUCH && FESTGELD'], answer: 0,
          why: 'Mehrere Fälle mit gleichem Ergebnis stehen durch Komma getrennt in **einem** `case`.' },
        { options: [';', 'nichts', 'break;', '.'], answer: 0,
          why: 'Ein switch-**Ausdruck** ist Teil einer Zuweisung, also endet die ganze Anweisung mit `;`.' }
      ],
      explain: 'Neu: Pfeil statt Doppelpunkt, kein `break`, mehrere Fälle mit Komma, der switch liefert den Wert direkt zurück.' },

    { id: 'K90-T04-F03', sec: 'switch', type: 'multi', t: 'Regeln des neuen switch',
      prompt: 'Welche Aussagen über den neuen switch mit `->` sind **richtig**? (mehrere)',
      options: [
        'Nach einem Fall mit `->` läuft das Programm nicht in den nächsten Fall weiter.',
        'Ein switch-Ausdruck muss alle möglichen Werte abdecken, sonst Compilerfehler.',
        'In einem Block `{ … }` liefert `return` den Wert des switch-Ausdrucks an die Variable zurück.',
        'Mehrere Fälle schreibt man als `case 1, 2, 3 ->`.',
        'Am Ende jedes Falls muss `break;` stehen.'
      ],
      answer: [0, 1, 3],
      explain: 'Kein Durchfallen, deshalb kein `break`. Der Wert eines Blocks kommt mit `yield`, `return` würde die ganze Methode verlassen. Fehlt bei einem `int`-switch der `default`, meldet javac: „the switch expression does not cover all possible input values“.' },

    { id: 'K90-T04-F04', sec: 'system', type: 'match', t: 'System.out.println zerlegen',
      prompt: 'Ordne jedem Teil von `System.out.println("Hallo")` zu, was er ist.',
      pairs: [
        ['System', 'eine Klasse aus java.lang'],
        ['out', 'ein statisches Attribut vom Typ PrintStream'],
        ['println', 'eine Instanzmethode der Klasse PrintStream'],
        ['"Hallo"', 'das Argument der Methode']
      ],
      explain: '`System` ist eine Klasse (deshalb großgeschrieben, aus `java.lang`, ohne import). `out` ist ein `public static final PrintStream`-Attribut von System, ohne Klammern, also keine Methode. `println` wird auf dem **Objekt** `out` aufgerufen.' },

    { id: 'K90-T04-F05', sec: 'system', type: 'mc', t: 'Warum kein import für System?',
      prompt: 'Warum braucht man für `System.out.println` keine `import`-Anweisung?',
      options: [
        'Weil Maven beim Kompilieren alle Klassen des JDK automatisch in jede Quelldatei importiert.',
        'Weil `println` eine statische Methode ist und keinen import braucht.',
        'Weil `out` als Schlüsselwort der Sprache Java fest eingebaut ist.',
        'Weil `System` im Paket `java.lang` liegt, das automatisch importiert wird.'
      ],
      answer: 3,
      explain: 'Nur `java.lang` (String, System, Math, Integer, Object …) ist automatisch importiert. `println` ist eine Instanzmethode, `out` ein normales Attribut. Maven hat mit imports nichts zu tun.' },

    { id: 'K90-T04-F06', sec: 'anonym', type: 'input', t: 'Anonyme Klasse mit Zustand',
      prompt: 'Was gibt `new Bank().los()` aus? (vier Zeilen)',
      code: `interface Gruss { String text(); }

public class Bank {
    private String name = "Bank";

    void los() {
        String ort = "Berlin";
        Gruss g = new Gruss() {
            private int zaehler = 0;

            @Override
            public String text() {
                zaehler++;
                return name + " " + ort + " " + zaehler;
            }
        };
        System.out.println(g.text());
        System.out.println(g.text());
        System.out.println(g.getClass() == Gruss.class);
        System.out.println(g instanceof Gruss);
    }
}`,
      answers: ['Bank Berlin 1\nBank Berlin 2\nfalse\ntrue'],
      explain: 'Eine anonyme Klasse darf eigene Attribute haben (`zaehler`), deshalb zählt sie hoch. Sie sieht das Attribut `name` der äußeren Klasse und die effektiv finale lokale Variable `ort`. Ihre Klasse ist eine **eigene** namenlose Klasse, nicht `Gruss`, also ist `getClass() == Gruss.class` false. Sie implementiert aber Gruss, also ist `instanceof` true.' },

    { id: 'K90-T04-F07', sec: 'anonym', type: 'multi', t: 'Was gilt für anonyme Klassen?',
      prompt: 'Welche Aussagen über anonyme Klassen sind **richtig**? (mehrere)',
      options: [
        'Sie können ein Interface implementieren oder von einer Klasse erben.',
        'Sie können mehr als eine Methode überschreiben.',
        'Sie dürfen jede lokale Variable der umgebenden Methode lesen und auch verändern.',
        'In ihnen meint `this` das Objekt der umgebenden Klasse.',
        'Sie werden im selben Schritt definiert und erzeugt.'
      ],
      answer: [0, 1, 4],
      explain: '`new Kalender() { … }` erbt von einer Klasse, `new Gruss() { … }` implementiert ein Interface. Anders als ein Lambda darf sie mehrere Methoden haben. Lokale Variablen nur lesen, wenn sie effektiv final sind. `this` ist das anonyme Objekt, das äußere erreicht man mit `Aussen.this`.' },

    { id: 'K90-T04-F08', sec: 'inst', type: 'multi', t: 'instanceof und getClass',
      prompt: 'Gegeben: `interface Ueberweisbar {}`, `class Konto {}`, `class Girokonto extends Konto implements Ueberweisbar {}`, `class Sparbuch extends Konto {}` und `Konto k = new Girokonto();`. Welche Ausdrücke liefern **true**? (mehrere)',
      options: [
        '`k instanceof Konto`',
        '`k instanceof Ueberweisbar`',
        '`k instanceof Sparbuch`',
        '`k.getClass() == Konto.class`',
        '`k.getClass() == Girokonto.class`',
        '`k instanceof Object`',
        '`k.getClass() == Ueberweisbar.class`'
      ],
      answer: [0, 1, 4, 5],
      explain: '`instanceof` fragt nach **Zuweisungskompatibilität**: eigene Klasse, alle Oberklassen (auch Object), alle implementierten Interfaces. `getClass()` liefert die **genaue** Klasse des Objekts, hier Girokonto. Der Typ der Variablen (Konto) spielt keine Rolle. Sparbuch ist nur eine Geschwisterklasse, und `getClass()` liefert nie ein Interface.' },

    { id: 'K90-T04-F09', sec: 'inst', type: 'mc', t: 'instanceof, das nicht kompiliert',
      prompt: '`Girokonto` und `Sparbuch` erben beide von `Konto`. Welche Zeile führt zu einem **Compilerfehler**?',
      options: [
        '`Konto k = new Sparbuch(); boolean istGiro = k instanceof Girokonto;`',
        '`Girokonto g = new Girokonto(); boolean b = g instanceof Sparbuch;`',
        '`Object o = "Hallo"; boolean istZahl = o instanceof Integer;`',
        '`Konto k = null; boolean b = k instanceof Konto;`'
      ],
      answer: 1,
      explain: 'Eine Variable vom Typ `Girokonto` kann **nie** auf ein Sparbuch zeigen, das weiß schon der Compiler („incompatible types: Girokonto cannot be converted to Sparbuch“). In allen anderen Fällen ist es grundsätzlich möglich, sie kompilieren und liefern zur Laufzeit false.' },

    { id: 'K90-T04-F10', sec: 'paket', type: 'fill', t: 'Klasse aus anderem Paket benutzen',
      prompt: '`Konto` liegt im Paket `bank` und hat einen öffentlichen Konstruktor `Konto()`, die Instanzmethode `einzahlen(int)` und die statische Methode `info()`. Vervollständige die Klasse im Paket `app`.',
      code: `package app;

[[0]]

public class Test {
    void t() {
        Konto k = [[1]];
        [[2]];
        String s = [[3]];
    }
}`,
      blanks: [
        { options: ['import bank.Konto;', 'import Konto;', 'package bank.Konto;', 'import bank.*.Konto;'], answer: 0,
          why: 'import mit dem vollständigen Namen „Paket.Klasse“. `import bank.*;` ginge auch, `package` deklariert nur das eigene Paket.' },
        { options: ['new Konto()', 'Konto()', 'Konto.new()', 'new bank()'], answer: 0,
          why: 'Konstruktoraufruf immer mit `new` und dem Klassennamen.' },
        { options: ['k.einzahlen(5)', 'Konto.einzahlen(5)', 'einzahlen(k, 5)', 'new Konto().einzahlen'], answer: 0,
          why: 'Eine **Instanzmethode** ruft man auf einem Objekt auf. Über den Klassennamen geht es nur bei statischen Methoden.' },
        { options: ['Konto.info()', 'info()', 'k.info', 'bank.info()'], answer: 0,
          why: 'Statische Methoden ruft man über den Klassennamen auf. `info()` allein geht nur innerhalb der Klasse Konto.' }
      ],
      explain: 'Ohne import müsste man überall den vollen Namen `bank.Konto` schreiben. Instanzmethode → Objekt, statische Methode → Klasse.' },

    { id: 'K90-T04-F11', sec: 'paket', type: 'multi', t: 'Sichtbarkeit über Paketgrenzen',
      prompt: '`Konto` im Paket `bank` hat die Attribute `int intern;`, `protected int geschuetzt;` und `public int offen;`. Welche Zugriffe kompilieren in einer Klasse des Pakets `app`? (mehrere)',
      options: [
        '`k.offen` in einer beliebigen Klasse',
        '`k.intern` in einer beliebigen Klasse',
        '`k.geschuetzt` in einer beliebigen Klasse',
        '`this.geschuetzt` in einer Unterklasse `class Test3 extends Konto`',
        '`this.intern` in einer Unterklasse `class Test3 extends Konto` im Paket app'
      ],
      answer: [0, 3],
      explain: 'Ohne Schlüsselwort (package-private) ist ein Attribut **nur im eigenen Paket** sichtbar, auch nicht in Unterklassen anderer Pakete. `protected` erlaubt zusätzlich den Zugriff in Unterklassen, aber nicht in beliebigen Klassen anderer Pakete. Im Kurs sind Attribute ohnehin immer private.' },

    { id: 'K90-T04-F12', sec: 'iface', type: 'multi', t: 'Welche Deklarationen sind möglich?',
      prompt: 'Gegeben `interface Konto2 { void abheben(double b); }`. Welche Zeilen **kompilieren**? (mehrere)',
      options: [
        '`Konto2 a = new Konto2();`',
        '`Konto2 b = new Konto2() { public void abheben(double x) {} };`',
        '`Konto2 c = x -> {};`',
        '`Konto2[] alle = new Konto2[5];`',
        '`Konto2 d = Konto2();`',
        '`Konto2 e = new Konto2() { void abheben(double betrag) { /* leer */ } };`'
      ],
      answer: [1, 2, 3],
      explain: 'Von einem Interface erzeugt man kein Objekt („Konto2 is abstract; cannot be instantiated“), aber eine anonyme Klasse oder ein Lambda (genau eine abstrakte Methode) geht. Ein **Array** vom Interface-Typ ist erlaubt: Es enthält nur Referenzen, noch keine Objekte. `Konto2()` ohne `new` ist gar kein gültiger Ausdruck. Die letzte Zeile scheitert, weil `abheben` ohne `public` überschrieben wird: Interface-Methoden sind public, und beim Überschreiben darf die Sichtbarkeit nicht kleiner werden („attempting to assign weaker access privileges“).' },

    { id: 'K90-T04-F13', sec: 'iface', type: 'mc', t: 'Was darf in ein Interface?',
      prompt: 'Welche Zeile ist innerhalb eines Interfaces **nicht** erlaubt?',
      options: [
        '`double ZINS = 0.5;`',
        '`private void log() { }`',
        '`protected void abheben(double b);`',
        '`static Konto2 standard() { return b -> { }; }`'
      ],
      answer: 2,
      explain: 'Methoden in Interfaces sind `public` oder (seit Java 9, als Hilfsmethode für default-Methoden) `private`. `protected` meldet javac: „modifier protected not allowed here“. Konstanten (`public static final`) und statische Methoden sind erlaubt.' },

    { id: 'K90-T04-F14', sec: 'maven', type: 'match', t: 'Maven-Plugins',
      prompt: 'Ordne jedem Plugin seine Aufgabe im Bankprojekt zu.',
      pairs: [
        ['maven-compiler-plugin', 'übersetzt den Quelltext, z. B. mit Lombok als Annotation-Processor'],
        ['maven-surefire-plugin', 'führt in der Phase test die JUnit-Tests aus'],
        ['jacoco-maven-plugin', 'misst die Testabdeckung und erstellt den Bericht'],
        ['maven-assembly-plugin', 'packt die Abgabe als jar mit Quelltexten und pom'],
        ['exec-maven-plugin', 'startet eine Klasse mit main-Methode aus Maven heraus']
      ],
      explain: 'Plugins sind Werkzeuge **von Maven** (`<build><plugins>`), Dependencies sind Bibliotheken **deines Codes** (`<dependencies>`). Für Plugins aus `org.apache.maven.plugins` darf man die groupId weglassen.' }
  ]
});
