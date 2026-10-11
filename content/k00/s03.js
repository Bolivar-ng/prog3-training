/* Kapitel 00 · Serie S03: Vielfalt-Training
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben, sonst geht der Fortschritt verloren. */
P3.serie({
  "id": "K00-S03",
  "kapitel": "K00",
  "titel": "Vielfalt-Training",
  "beschreibung": "Comparable, equals/hashCode, Object, moderner switch, Bankprojekt im Detail, Stack Trace – mit Lückentext, Reihenfolge, Zuordnen und Ausgabe eintippen.",
  "themen": [
    {
      "id": "cmp",
      "name": "Comparable und compareTo"
    },
    {
      "id": "eq",
      "name": "equals und hashCode"
    },
    {
      "id": "obj",
      "name": "Object, Annotationen, Bindung"
    },
    {
      "id": "sw",
      "name": "Moderner switch"
    },
    {
      "id": "bank",
      "name": "Bankprojekt im Detail"
    },
    {
      "id": "exc",
      "name": "Exceptions und Stack Trace"
    },
    {
      "id": "mix",
      "name": "Fehler finden und Erklären"
    }
  ],
  "fragen": [
    {
      "id": "K00-S03-F01",
      "sec": "cmp",
      "type": "input",
      "t": "Double.compare",
      "prompt": "Was gibt dieser Code aus? Tippe die Ausgabe genau ein.",
      "code": "System.out.println(Double.compare(2.5, 7.0) < 0);",
      "answers": [
        "true"
      ],
      "explain": "`Double.compare(a, b)` ist negativ, wenn a < b. 2.5 < 7.0, also ist das Ergebnis negativ und `< 0` ergibt `true`."
    },
    {
      "id": "K00-S03-F02",
      "sec": "cmp",
      "type": "input",
      "t": "Die Subtraktions-Falle",
      "prompt": "Was gibt dieser Code aus?",
      "code": "System.out.println((int) (10.3 - 10.1));",
      "answers": [
        "0"
      ],
      "explain": "10.3 − 10.1 ≈ 0.2, und der Cast nach int schneidet die Nachkommastellen ab: 0. Ein `compareTo`, das so rechnet, hielte 10,30 € und 10,10 € für gleich. Deshalb benutzt Geldbetrag `Double.compare`."
    },
    {
      "id": "K00-S03-F03",
      "sec": "cmp",
      "type": "fill",
      "t": "compareTo vervollständigen",
      "prompt": "Vervollständige Geldbetrag so, wie es im Bankprojekt steht.",
      "code": "public class Geldbetrag implements [[0]]<Geldbetrag> {\n\n    @Override\n    public int compareTo([[1]] o) {\n        return Double.[[2]](this.betrag, o.betrag);\n    }\n}",
      "blanks": [
        {
          "options": [
            "Comparable",
            "Comparator",
            "Cloneable"
          ],
          "answer": 0,
          "why": "`Comparable` legt die natürliche Ordnung einer Klasse fest. Ein `Comparator` ist ein separates Vergleichsobjekt, `Cloneable` hat mit Vergleichen nichts zu tun."
        },
        {
          "options": [
            "Geldbetrag",
            "Object",
            "double"
          ],
          "answer": 0,
          "why": "Wegen `Comparable<Geldbetrag>` bekommt compareTo direkt einen Geldbetrag, also ist kein Down-Cast nötig."
        },
        {
          "options": [
            "compare",
            "equals",
            "minus"
          ],
          "answer": 0,
          "why": "`Double.compare` liefert negativ/0/positiv. `equals` liefert nur boolean, und eine Subtraktion hätte die int-Falle."
        }
      ],
      "explain": "So steht es im Bankprojekt."
    },
    {
      "id": "K00-S03-F04",
      "sec": "cmp",
      "type": "mc",
      "t": "Comparable mit fremdem Typ",
      "prompt": "`public class Girokonto implements Comparable<Geldbetrag>` – was gilt?",
      "options": [
        "Kompilierfehler: Comparable muss immer den eigenen Typ haben.",
        "Es kompiliert, aber der Vergleich funktioniert nur in eine Richtung, und eine Liste von Girokonten lässt sich damit nicht sortieren.",
        "Ideal, so vergleicht man Kontostände.",
        "Es kompiliert und Collections.sort(List<Girokonto>) funktioniert."
      ],
      "answer": 1,
      "explain": "`giro.compareTo(betrag)` geht, `betrag.compareTo(giro)` nicht: Die Symmetrie des Vertrags ist verletzt. Zum Sortieren müssen Girokonten untereinander vergleichbar sein."
    },
    {
      "id": "K00-S03-F05",
      "sec": "cmp",
      "type": "mc",
      "t": "Girokonto mit Sparbuch vergleichen",
      "prompt": "Girokonten und Sparbücher sollen nach Kontostand vergleichbar sein, auch gemischt. Beste Lösung?",
      "options": [
        "Girokonto implements Comparable<Sparbuch> und Sparbuch implements Comparable<Girokonto>",
        "Konto implements Comparable<Konto>",
        "Girokonto implements Comparable<Girokonto>, Comparable<Sparbuch>",
        "Unmöglich in Java."
      ],
      "answer": 1,
      "explain": "Über die gemeinsame Oberklasse sind alle Konten untereinander vergleichbar, symmetrisch und sortierbar. Zwei Comparable-Varianten in einer Klasse kompilieren nicht."
    },
    {
      "id": "K00-S03-F06",
      "sec": "cmp",
      "type": "input",
      "t": "Division durch 0 bei double",
      "prompt": "Was gibt dieser Code aus?",
      "code": "System.out.println(1.0 / 0);",
      "answers": [
        "Infinity"
      ],
      "explain": "Bei double wirft die Division durch 0 keine Exception, sondern liefert `Infinity`. Genau solche Werte schließt `Double.isFinite` im Konstruktor von Geldbetrag aus."
    },
    {
      "id": "K00-S03-F07",
      "sec": "cmp",
      "type": "mc",
      "t": "Und bei int?",
      "prompt": "Was passiert bei `System.out.println(1 / 0);`?",
      "options": [
        "Ausgabe Infinity",
        "Ausgabe 0",
        "ArithmeticException zur Laufzeit",
        "Ausgabe NaN"
      ],
      "answer": 2,
      "explain": "Bei ganzen Zahlen gibt es kein Infinity: `1 / 0` wirft eine `ArithmeticException`. Nur Gleitkommazahlen (double, float) kennen Infinity und NaN."
    },
    {
      "id": "K00-S03-F08",
      "sec": "eq",
      "type": "fill",
      "t": "equals vervollständigen",
      "prompt": "Vervollständige equals von Konto.",
      "code": "@Override\npublic boolean equals([[0]] other) {\n    if (this [[1]] other)\n        return true;\n    if (other == [[2]])\n        return false;\n    if (this.getClass() != other.[[3]]())\n        return false;\n    return this.nummer == (([[4]]) other).nummer;\n}",
      "blanks": [
        {
          "options": [
            "Object",
            "Konto",
            "Girokonto"
          ],
          "answer": 0,
          "why": "equals aus Object hat den Parameter Object. Mit Konto würde die Methode nur überladen, und @Override meldet einen Fehler."
        },
        {
          "options": [
            "==",
            ".equals(",
            "!="
          ],
          "answer": 0,
          "why": "Erster Schritt: dieselbe Referenz? Dafür braucht man `==`. equals hier aufzurufen wäre eine Endlosrekursion."
        },
        {
          "options": [
            "null",
            "0",
            "this"
          ],
          "answer": 0,
          "why": "Laut Vertrag ist `a.equals(null)` immer false."
        },
        {
          "options": [
            "getClass",
            "hashCode",
            "toString"
          ],
          "answer": 0,
          "why": "`getClass()` liefert die tatsächliche Klasse, so ist ein Girokonto nie gleich einem Sparbuch."
        },
        {
          "options": [
            "Konto",
            "Object",
            "Kunde"
          ],
          "answer": 0,
          "why": "Erst nach der Klassenprüfung ist der Down-Cast auf Konto sicher."
        }
      ],
      "explain": "Dieser Aufbau ist das Standardmuster für equals."
    },
    {
      "id": "K00-S03-F09",
      "sec": "eq",
      "type": "order",
      "t": "Ablauf von equals",
      "prompt": "Bringe die Schritte von equals in die richtige Reihenfolge.",
      "items": [
        "Gleiche Referenz (`this == other`)? → true",
        "`other == null`? → false",
        "Unterschiedliche Klasse (`getClass()`)? → false",
        "Casten und Attribute vergleichen"
      ],
      "explain": "Erst die billigen Abkürzungen, dann die Sicherheitsprüfungen, und erst zum Schluss der Cast. Ohne null- und Klassenprüfung könnte der Cast scheitern."
    },
    {
      "id": "K00-S03-F10",
      "sec": "eq",
      "type": "mc",
      "t": "Der Bruch-Fall",
      "prompt": "Eine Klasse Bruch hält 1/2 und 2/4 laut equals für gleich (über Kreuzmultiplikation). Wo liegt das Problem?",
      "code": "public class Bruch {\n    private int zaehler;\n    private int nenner;\n\n    // equals: gleich, wenn zaehler * o.nenner == o.zaehler * nenner\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(zaehler, nenner);\n    }\n}",
      "options": [
        "Kein Problem.",
        "Vertrag verletzt: 1/2 und 2/4 sind gleich, haben aber verschiedene hashCodes. Lösung: Brüche im Konstruktor kürzen.",
        "hashCode darf nur ein Attribut benutzen.",
        "equals darf nicht multiplizieren."
      ],
      "answer": 1,
      "explain": "Gleiche Objekte müssen denselben hashCode haben. Objects.hash(1, 2) und Objects.hash(2, 4) unterscheiden sich, also könnte ein HashSet beide enthalten. Werden Brüche beim Erzeugen gekürzt, sind die gespeicherten Attribute gleich und alles passt."
    },
    {
      "id": "K00-S03-F11",
      "sec": "eq",
      "type": "mc",
      "t": "Nur equals überschrieben",
      "prompt": "Eine Klasse überschreibt equals (vergleicht die Nummer), aber NICHT hashCode. Was gibt der Code (praktisch immer) aus?",
      "code": "Set<Konto> set = new HashSet<>();\nset.add(new Girokonto(kunde, 123, dispo));\nset.add(new Girokonto(kunde, 123, dispo));\nSystem.out.println(set.size());",
      "options": [
        "1",
        "2",
        "0",
        "Kompilierfehler"
      ],
      "answer": 1,
      "explain": "Ohne eigenen hashCode bekommen die Objekte verschiedene Fachnummern. Das HashSet schaut gar nicht erst mit equals nach und speichert beide."
    },
    {
      "id": "K00-S03-F12",
      "sec": "eq",
      "type": "multi",
      "t": "hashCode-Regeln",
      "prompt": "Welche Aussagen stimmen?",
      "options": [
        "Wenn `a.equals(b)`, dann muss `a.hashCode() == b.hashCode()` sein.",
        "Wenn die hashCodes gleich sind, ist `a.equals(b)` immer true.",
        "Wenn die hashCodes verschieden sind, sind die Objekte verschieden.",
        "Der Wert des hashCodes beschreibt das Objekt inhaltlich.",
        "hashCode sollte dieselben Attribute benutzen wie equals."
      ],
      "answer": [
        0,
        2,
        4
      ],
      "explain": "Gleicher hashCode heißt nur gleiches Fach (Kollisionen sind erlaubt). Der Wert selbst hat keine Bedeutung."
    },
    {
      "id": "K00-S03-F13",
      "sec": "eq",
      "type": "mc",
      "t": "assertSame",
      "prompt": "Zwei mit `new` erzeugte Girokonten mit derselben Nummer. Welche Assertion schlägt fehl?",
      "options": [
        "assertEquals(a, b)",
        "assertEquals(a.hashCode(), b.hashCode())",
        "assertSame(a, b)",
        "assertNotSame(a, b)"
      ],
      "answer": 2,
      "explain": "`assertSame` prüft `a == b`, also dieselbe Referenz. Zwei new erzeugen zwei Objekte, also schlägt es fehl. Inhaltlich sind sie trotzdem gleich."
    },
    {
      "id": "K00-S03-F14",
      "sec": "obj",
      "type": "match",
      "t": "Methoden aus Object",
      "prompt": "Ordne jeder Methode aus Object ihren Zweck zu.",
      "pairs": [
        [
          "`toString()`",
          "Text-Darstellung des Objekts"
        ],
        [
          "`getClass()`",
          "liefert die tatsächliche Klasse, final"
        ],
        [
          "`clone()`",
          "Kopie erzeugen, protected, braucht Cloneable"
        ],
        [
          "`hashCode()`",
          "Fachnummer für HashSet und HashMap"
        ],
        [
          "`notifyAll()`",
          "weckt alle wartenden Threads"
        ],
        [
          "`finalize()`",
          "veraltet, lief vor dem Garbage Collector"
        ]
      ],
      "explain": "toString, equals und hashCode überschreibt man oft. getClass, wait, notify und notifyAll sind final."
    },
    {
      "id": "K00-S03-F15",
      "sec": "obj",
      "type": "multi",
      "t": "Nicht überschreibbar",
      "prompt": "Welche Methoden aus Object kann man NICHT überschreiben?",
      "options": [
        "`getClass()`",
        "`wait()`",
        "`notify()`",
        "`toString()`",
        "`equals(Object)`",
        "`clone()`"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explain": "getClass, wait, notify und notifyAll sind final. clone ist protected und darf überschrieben werden."
    },
    {
      "id": "K00-S03-F16",
      "sec": "obj",
      "type": "mc",
      "t": "@Override als Wächter",
      "prompt": "Was passiert beim Kompilieren?",
      "code": "public class Kunde {\n\n    @Override\n    public boolean equals(Kunde other) {\n        return this.nachname.equals(other.nachname);\n    }\n}",
      "options": [
        "Kompiliert, equals ist überschrieben.",
        "Kompilierfehler: Die Methode überschreibt nichts, denn equals aus Object hat den Parameter Object.",
        "Kompiliert, aber @Override wird ignoriert.",
        "Laufzeitfehler."
      ],
      "answer": 1,
      "explain": "Genau dafür gibt es @Override: Der Compiler prüft, ob wirklich überschrieben wird. Ohne die Annotation hätte man still eine zweite, überladene equals-Methode, die HashSet und Co. nie aufrufen."
    },
    {
      "id": "K00-S03-F17",
      "sec": "obj",
      "type": "match",
      "t": "Annotationen",
      "prompt": "Ordne jeder Annotation ihre Bedeutung zu.",
      "pairs": [
        [
          "`@Override`",
          "Compiler prüft, dass wirklich überschrieben wird"
        ],
        [
          "`@Test`",
          "JUnit erkennt die Methode als Test"
        ],
        [
          "`@Deprecated`",
          "veraltet, nicht mehr benutzen"
        ],
        [
          "`@FunctionalInterface`",
          "genau eine abstrakte Methode, für Lambdas"
        ]
      ],
      "explain": "Annotationen sind Zusatzinformationen für Compiler und Werkzeuge; sie ändern den Code selbst nicht."
    },
    {
      "id": "K00-S03-F18",
      "sec": "obj",
      "type": "input",
      "t": "Dynamische Bindung",
      "prompt": "Was gibt dieser Code aus?",
      "code": "class Tier {\n    String laut() {\n        return \"...\";\n    }\n\n    String vorstellen() {\n        return \"Ich sage \" + laut();\n    }\n}\n\nclass Hund extends Tier {\n    @Override\n    String laut() {\n        return \"Wuff\";\n    }\n}\n\n// in main:\nTier t = new Hund();\nSystem.out.println(t.vorstellen());",
      "answers": [
        "Ich sage Wuff"
      ],
      "explain": "`vorstellen` steht nur in Tier, ruft aber `laut()` auf. Das Objekt ist ein Hund, also läuft Hund.laut(). Genau so ruft `ausgebenAufDerKonsole()` in Konto das toString() von Girokonto auf."
    },
    {
      "id": "K00-S03-F19",
      "sec": "obj",
      "type": "input",
      "t": "Statische Initialisierung",
      "prompt": "Was gibt dieser Code aus? (Format: zwei Zahlen mit Leerzeichen)",
      "code": "class A {\n    static int x = 5;\n\n    static {\n        x = x * 2;\n    }\n\n    static int y = x + 1;\n}\n\n// in main:\nSystem.out.println(A.x + \" \" + A.y);",
      "answers": [
        "10 11"
      ],
      "explain": "Statische Initialisierungen laufen einmal, in der Reihenfolge im Code: x = 5, dann der Block (x = 10), dann y = 10 + 1 = 11."
    },
    {
      "id": "K00-S03-F20",
      "sec": "obj",
      "type": "mc",
      "t": "toString automatisch",
      "prompt": "`System.out.println(\"Inhaber: \" + kunde);` – was passiert mit `kunde`?",
      "options": [
        "Kompilierfehler, ein Objekt kann man nicht an einen String hängen.",
        "Java ruft automatisch `kunde.toString()` auf.",
        "Es wird immer die Speicheradresse ausgegeben.",
        "Es wird `kunde.hashCode()` angehängt."
      ],
      "answer": 1,
      "explain": "Bei `+` mit einem String ruft Java automatisch toString() auf. Kunde überschreibt toString, deshalb erscheint „Vorname Nachname wohnt in …“."
    },
    {
      "id": "K00-S03-F21",
      "sec": "sw",
      "type": "input",
      "t": "switch-Ausdruck",
      "prompt": "Was gibt dieser Code aus?",
      "code": "int monat = 2;\nString jahreszeit = switch (monat) {\n    case 12, 1, 2 -> \"Winter\";\n    case 3, 4, 5 -> \"Frühling\";\n    default -> \"Rest\";\n};\nSystem.out.println(jahreszeit);",
      "answers": [
        "Winter"
      ],
      "explain": "Mehrere Werte pro case sind erlaubt. Der switch liefert direkt den Wert."
    },
    {
      "id": "K00-S03-F22",
      "sec": "sw",
      "type": "input",
      "t": "Alter switch, Fall-through",
      "prompt": "Was gibt dieser Code aus?",
      "code": "int x = 1;\nswitch (x) {\n    case 1:\n        System.out.print(\"A\");\n    case 2:\n        System.out.print(\"B\");\n        break;\n    case 3:\n        System.out.print(\"C\");\n}",
      "answers": [
        "AB"
      ],
      "explain": "Nach case 1 fehlt ein break, also läuft Java in case 2 weiter (Fall-through) bis zum break. Mit der Pfeil-Schreibweise `->` gäbe es das nicht."
    },
    {
      "id": "K00-S03-F23",
      "sec": "sw",
      "type": "fill",
      "t": "yield und default",
      "prompt": "Vervollständige den switch-Ausdruck.",
      "code": "String text = switch (note) {\n    case 1, 2 -> \"gut\";\n    case 3, 4 -> {\n        String t = \"bestanden\";\n        [[0]] t;\n    }\n    [[1]] -> \"durchgefallen\";\n}[[2]]",
      "blanks": [
        {
          "options": [
            "yield",
            "return",
            "break"
          ],
          "answer": 0,
          "why": "In einem Block liefert `yield` den Wert des switch. `return` würde die ganze Methode verlassen."
        },
        {
          "options": [
            "default",
            "else",
            "otherwise"
          ],
          "answer": 0,
          "why": "Ein switch-Ausdruck über int muss alle Fälle abdecken, also braucht er `default`."
        },
        {
          "options": [
            ";",
            "(nichts)",
            ":"
          ],
          "answer": 0,
          "why": "Der switch ist hier Teil einer Zuweisung, deshalb endet die Anweisung mit einem Semikolon."
        }
      ],
      "explain": "Ein switch-Ausdruck ist ein Wert: Zuweisung, yield in Blöcken und vollständige Abdeckung."
    },
    {
      "id": "K00-S03-F24",
      "sec": "sw",
      "type": "mc",
      "t": "Enum ohne default",
      "prompt": "Ein switch-Ausdruck deckt alle Werte von `enum Waehrung { EUR, BGN, LTL }` ohne default ab. Jemand ergänzt `USD`. Was passiert?",
      "options": [
        "Nichts, USD liefert automatisch 0.",
        "Der switch-Ausdruck kompiliert nicht mehr, bis USD behandelt wird.",
        "Zur Laufzeit kommt NullPointerException.",
        "USD wird wie EUR behandelt."
      ],
      "answer": 1,
      "explain": "Ein switch-Ausdruck muss vollständig sein. Ohne default zeigt der Compiler jede Stelle, die einen neuen Enum-Wert noch nicht kennt. Das ist ein Vorteil gegenüber default."
    },
    {
      "id": "K00-S03-F25",
      "sec": "sw",
      "type": "mc",
      "t": "Reihenfolge bei Typ-Patterns",
      "prompt": "Was passiert beim Kompilieren?",
      "code": "String text = switch (konto) {\n    case Konto k -> \"Konto\";\n    case Girokonto g -> \"Girokonto\";\n    default -> \"?\";\n};",
      "options": [
        "Kompiliert, Girokonten ergeben „Girokonto“.",
        "Kompilierfehler: `case Girokonto g` ist nie erreichbar, weil `case Konto k` schon jedes Girokonto abfängt.",
        "Kompiliert, aber Girokonten ergeben „?“.",
        "Laufzeitfehler."
      ],
      "answer": 1,
      "explain": "Patterns werden von oben nach unten geprüft. Das speziellere (Girokonto) muss vor dem allgemeineren (Konto) stehen, sonst meldet der Compiler einen dominierten case."
    },
    {
      "id": "K00-S03-F26",
      "sec": "sw",
      "type": "mc",
      "t": "when",
      "prompt": "Was bedeutet `case Girokonto g when g.getDispo().isNegativ() ->`?",
      "options": [
        "g wird negativ gemacht.",
        "Der Fall greift nur, wenn das Objekt ein Girokonto ist UND die Bedingung nach when zutrifft.",
        "when ist ein Schleifen-Schlüsselwort.",
        "Das ist Pseudocode, kein Java."
      ],
      "answer": 1,
      "explain": "`when` ist eine Zusatzbedingung (Guard) für ein Typ-Pattern, seit Java 21."
    },
    {
      "id": "K00-S03-F27",
      "sec": "bank",
      "type": "multi",
      "t": "Wer darf setKontostand?",
      "prompt": "`setKontostand` ist protected in `bankprojekt.basisdaten.Konto`. Welche Klassen dürfen es aufrufen?",
      "options": [
        "Girokonto (Unterklasse)",
        "Kunde (gleiches Package bankprojekt.basisdaten)",
        "spielereien.KontenSpielereien",
        "Geldbetrag (gleiches Package bankprojekt.basisdaten)"
      ],
      "answer": [
        0,
        1,
        3
      ],
      "explain": "protected heißt in Java: Unterklassen UND alle Klassen im selben Package. Nur KontenSpielereien liegt in einem anderen Package und ist keine Unterklasse."
    },
    {
      "id": "K00-S03-F28",
      "sec": "bank",
      "type": "order",
      "t": "IBAN berechnen",
      "prompt": "Bringe die Schritte von `getIban(long blz)` in die richtige Reihenfolge.",
      "items": [
        "BLZ prüfen (höchstens 8 Stellen, nicht negativ)",
        "BLZ (8 Stellen) + Kontonummer (10 Stellen) + \"131400\" zusammensetzen",
        "als BigInteger den Rest modulo 97 berechnen",
        "Prüfziffern = 98 − Rest",
        "IBAN „DE“ + Prüfziffern + BLZ + Kontonummer formatieren"
      ],
      "explain": "131400 steht für „DE00“ (D = 13, E = 14). BigInteger ist nötig, weil die 24-stellige Zahl nicht in einen long passt."
    },
    {
      "id": "K00-S03-F29",
      "sec": "bank",
      "type": "match",
      "t": "Format-Angaben",
      "prompt": "Ordne zu: Was liefert `String.format(…, 42)`? (␣ steht für ein Leerzeichen.)",
      "pairs": [
        [
          "`\"%d\"`",
          "42"
        ],
        [
          "`\"%5d\"`",
          "␣␣␣42"
        ],
        [
          "`\"%05d\"`",
          "00042"
        ],
        [
          "`\"%08d\"`",
          "00000042"
        ]
      ],
      "explain": "Die Zahl gibt die Mindestbreite an. Eine führende 0 füllt mit Nullen auf, sonst mit Leerzeichen. Deshalb sieht `getKontonummerFormatiert()` (%10d) anders aus als die IBAN (%010d)."
    },
    {
      "id": "K00-S03-F30",
      "sec": "bank",
      "type": "mc",
      "t": "LocalDate.parse ohne Formatter",
      "prompt": "Was passiert bei `LocalDate.parse(\"20.06.2006\")` ohne Formatter?",
      "options": [
        "Liefert den 20. Juni 2006.",
        "DateTimeParseException, denn ohne Formatter wird das ISO-Format „2006-06-20“ erwartet.",
        "Liefert null.",
        "Kompilierfehler."
      ],
      "answer": 1,
      "explain": "Ohne Formatter versteht parse nur ISO (Jahr-Monat-Tag). Für „20.06.06“ braucht man einen Formatter, wie im Kunde-Konstruktor mit FormatStyle.SHORT, dessen Format aber von der Region abhängt."
    },
    {
      "id": "K00-S03-F31",
      "sec": "bank",
      "type": "mc",
      "t": "abstrakte Methode",
      "prompt": "Was passiert bei dieser Klasse?",
      "code": "public class Konto {\n    public abstract boolean abheben(Geldbetrag betrag) throws GesperrtException;\n}",
      "options": [
        "Kompiliert.",
        "Kompilierfehler: Eine Klasse mit abstrakter Methode muss selbst abstract sein.",
        "Kompiliert, abheben liefert immer false.",
        "Laufzeitfehler bei new Konto()."
      ],
      "answer": 1,
      "explain": "Eine abstrakte Methode hat keinen Rumpf. Könnte man ein Objekt erzeugen, wüsste Java nicht, was abheben tun soll. Deshalb: `public abstract class Konto`."
    },
    {
      "id": "K00-S03-F32",
      "sec": "bank",
      "type": "mc",
      "t": "{@return …}",
      "prompt": "Was ist der Unterschied zwischen `{@return Kontonummer}` und `@return Kontonummer`?",
      "options": [
        "Keiner, beides ist dasselbe Block-Tag.",
        "`{@return …}` ist ein Inline-Tag und erzeugt Beschreibungssatz und @return-Eintrag zugleich; `@return` ist ein Block-Tag am Ende.",
        "`{@return …}` ist Java-Code.",
        "`@return` ist veraltet."
      ],
      "answer": 1,
      "explain": "Die Kurzform (seit Java 16) lohnt sich bei einfachen Gettern."
    },
    {
      "id": "K00-S03-F33",
      "sec": "bank",
      "type": "mc",
      "t": "final ohne Wert",
      "prompt": "`private static final String ANREDE;` hat keinen Wert. Warum kompiliert Kunde trotzdem?",
      "options": [
        "final-Attribute brauchen nie einen Wert.",
        "Der statische Block weist ANREDE in jedem Zweig (if und else) genau einmal einen Wert zu, und das prüft der Compiler.",
        "ANREDE ist automatisch \"\".",
        "Weil ANREDE private ist."
      ],
      "answer": 1,
      "explain": "Fehlte der else-Zweig, könnte ANREDE ohne Wert bleiben, und der Compiler würde abbrechen."
    },
    {
      "id": "K00-S03-F34",
      "sec": "bank",
      "type": "mc",
      "t": "Warum eine Klasse Kalender?",
      "prompt": "Warum ruft Sparbuch nicht direkt `LocalDate.now()` auf, sondern benutzt einen Kalender?",
      "options": [
        "Weil LocalDate.now() falsch rechnet.",
        "Damit man das Datum im Test durch einen Ersatz austauschen kann (Mocking).",
        "Weil Kalender schneller ist.",
        "Wegen der Namenskonventionen."
      ],
      "answer": 1,
      "explain": "Mit einem eigenen Kalender lässt sich im Test ein festes Datum simulieren. Mocking ist auf der Folie schon als späteres Thema angekündigt."
    },
    {
      "id": "K00-S03-F35",
      "sec": "exc",
      "type": "order",
      "t": "Stack Trace lesen",
      "prompt": "Aus diesem Stack Trace: In welcher Reihenfolge wurden die Methoden tatsächlich aufgerufen?",
      "code": "GesperrtException: Zugriff auf gesperrtes Konto mit Kontonummer 99887766\n    at Girokonto.abheben(Girokonto.java:92)\n    at StackDemo.gebuehrAbbuchen(StackDemo.java:18)\n    at StackDemo.monatsabschluss(StackDemo.java:10)\n    at StackDemo.main(StackDemo.java:24)",
      "items": [
        "`main`",
        "`monatsabschluss`",
        "`gebuehrAbbuchen`",
        "`Girokonto.abheben` (hier wird geworfen)"
      ],
      "explain": "Der Stack Trace steht von oben (Entstehungsort) nach unten (Anfang). Die tatsächliche Aufrufreihenfolge liest man von unten nach oben."
    },
    {
      "id": "K00-S03-F36",
      "sec": "exc",
      "type": "mc",
      "t": "Wo geworfen?",
      "prompt": "Welche Zeile eines Stack Traces zeigt, wo die Exception entstanden ist?",
      "options": [
        "die letzte „at“-Zeile",
        "die erste „at“-Zeile direkt unter der Nachricht",
        "die Zeile mit main",
        "Das steht nicht im Stack Trace."
      ],
      "answer": 1,
      "explain": "Ganz oben steht der Ort des throw, darunter die Aufrufer, unten main."
    },
    {
      "id": "K00-S03-F37",
      "sec": "exc",
      "type": "match",
      "t": "Unsinn → Lösung",
      "prompt": "Ordne jedem Exception-Unsinn die richtige Lösung zu.",
      "pairs": [
        [
          "Unsinn 1: selbst werfen und fangen",
          "im if beheben oder ohne try nach außen werfen"
        ],
        [
          "Unsinn 2: throws und catch derselben Exception",
          "entweder fangen oder weiterwerfen"
        ],
        [
          "Unsinn 3: @throws für Unmögliches",
          "intern fangen, leerer catch mit Kommentar"
        ],
        [
          "Unsinn 4: nackte RuntimeException",
          "mit throws unverändert weitergeben"
        ],
        [
          "Unsinn 5: nur printStackTrace()",
          "echt reagieren, z. B. merken und zurückgeben"
        ]
      ],
      "explain": "Gemeinsamer Kern: Die Nachricht „Ich konnte meine Aufgabe nicht erledigen“ muss vollständig beim richtigen Empfänger ankommen."
    },
    {
      "id": "K00-S03-F38",
      "sec": "exc",
      "type": "mc",
      "t": "Wohin schreibt printStackTrace?",
      "prompt": "Auf welchen Kanal schreibt `e.printStackTrace()`?",
      "options": [
        "System.out",
        "System.err (in Eclipse rot)",
        "in eine Logdatei",
        "gar nicht, es wirft die Exception erneut"
      ],
      "answer": 1,
      "explain": "System.err ist der Fehlerkanal. Weil er getrennt von System.out läuft, kann die Reihenfolge auf der Konsole gemischt wirken."
    },
    {
      "id": "K00-S03-F39",
      "sec": "exc",
      "type": "mc",
      "t": "getMessage",
      "prompt": "Was liefert `e.getMessage()` bei der GesperrtException oben?",
      "options": [
        "den kompletten Stack Trace",
        "nur den Text „Zugriff auf gesperrtes Konto mit Kontonummer 99887766“",
        "den Klassennamen",
        "null"
      ],
      "answer": 1,
      "explain": "getMessage liefert nur die Nachricht, toString liefert Typ + Nachricht, printStackTrace gibt alles samt Pfad aus."
    },
    {
      "id": "K00-S03-F40",
      "sec": "mix",
      "type": "bug",
      "t": "Produkt mit equals",
      "prompt": "Markiere die 2 Fehlerzeilen.",
      "code": "public class Produkt {\n    private String name;\n    private double preis;\n\n    @Override\n    public boolean equals(Produkt other) {\n        return this.name == other.name;\n    }\n}",
      "required": [
        6,
        7
      ],
      "extra": [],
      "explain": "Zeile 6: Parameter muss Object sein, sonst wird nur überladen (und @Override meldet einen Fehler). Zeile 7: Strings mit `==` vergleichen prüft Referenzen, nicht den Text; richtig ist `equals`. Außerdem fehlen null- und Klassenprüfung, und hashCode ist nicht überschrieben."
    },
    {
      "id": "K00-S03-F41",
      "sec": "mix",
      "type": "bug",
      "t": "Wochenende",
      "prompt": "Für `tag = 6` steht am Ende „Sonntag“ in text. Markiere die Zeile, nach der etwas fehlt.",
      "code": "String text;\nswitch (tag) {\n    case 6:\n        text = \"Samstag\";\n    case 7:\n        text = \"Sonntag\";\n        break;\n    default:\n        text = \"Werktag\";\n}",
      "required": [
        4
      ],
      "extra": [
        5
      ],
      "explain": "Nach Zeile 4 fehlt `break;`. Ohne break läuft der Code in case 7 weiter und überschreibt text. Moderne Lösung: `text = switch (tag) { case 6 -> \"Samstag\"; case 7 -> \"Sonntag\"; default -> \"Werktag\"; };`"
    },
    {
      "id": "K00-S03-F42",
      "sec": "mix",
      "type": "explain",
      "t": "hashCode und equals",
      "prompt": "Erkläre, warum hashCode dieselben Attribute benutzen muss wie equals.",
      "model": "Gleiche Objekte (equals true) müssen denselben hashCode haben, sonst landen sie in HashSet/HashMap in verschiedenen Fächern und equals wird nie aufgerufen. Benutzt hashCode andere oder zusätzliche Attribute, können zwei laut equals gleiche Objekte verschiedene hashCodes bekommen (siehe Bruch 1/2 und 2/4). Mit denselben Attributen ist der Vertrag automatisch erfüllt."
    },
    {
      "id": "K00-S03-F43",
      "sec": "mix",
      "type": "explain",
      "t": "Dynamische Bindung",
      "prompt": "Erkläre, warum `ausgebenAufDerKonsole()` (nur in Konto definiert) bei einem Girokonto „-- GIROKONTO --“ ausgibt.",
      "model": "Die Methode ruft `this.toString()` auf. Welche Version läuft, entscheidet Java zur Laufzeit nach der Klasse des Objekts (dynamische Bindung). this ist ein Girokonto, also läuft Girokonto.toString(), die „-- GIROKONTO --“ ausgibt und mit super.toString() den Teil aus Konto ergänzt."
    },
    {
      "id": "K00-S03-F44",
      "sec": "mix",
      "type": "explain",
      "t": "Unveränderlicher Geldbetrag",
      "prompt": "Warum ist es sinnvoll, dass Geldbetrag unveränderlich ist? Nenne mindestens zwei Gründe.",
      "model": "Objekte können gefahrlos geteilt werden: Alle neuen Konten zeigen auf dasselbe NULL_EURO, ohne dass eine Einzahlung bei einem Konto die anderen verändert. Außerdem bleibt der hashCode stabil (ein veränderbares Objekt in einem HashSet würde nach einer Änderung im falschen Fach liegen). Und Rechenoperationen wie plus haben keine Nebenwirkungen auf das Original."
    }
  ]
});
