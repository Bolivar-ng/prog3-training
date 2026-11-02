/* Kapitel 04 · Serie S01: Generics und Listen
   Format: siehe README.md. Frage-IDs niemals ändern oder neu vergeben.
   wichtig: true = Etikett „prüfungsrelevant“.
   Alle Ausgaben und Compilerfehler wurden mit javac/java geprüft. */
P3.serie({
  id: 'K04-S01',
  kapitel: 'K04',
  titel: 'Generics und Listen',
  beschreibung: 'Typparameter richtig benutzen, keine Polymorphie zwischen spitzen Klammern, Wildcard, die Interfaces des Frameworks, Array durch List ersetzen, for-each, Iterator und removeIf.',
  neu: true,
  themen: [
    { id: 'generics', name: 'Typparameter & Wildcard' },
    { id: 'framework', name: 'List, Set, Map im Überblick' },
    { id: 'liste', name: 'Mit Listen arbeiten' },
    { id: 'durchlauf', name: 'for-each & Iterator' }
  ],
  fragen: [

    /* ========== Typparameter & Wildcard ========== */

    { id: 'K04-S01-F01', sec: 'generics', type: 'multi', wichtig: true, t: 'Was lässt der Compiler zu?',
      prompt: 'Welche Anweisungen **kompilieren**? (mehrere)',
      options: [
        '`List<String> a = new ArrayList<>();`',
        '`Map<String, Integer> e = new HashSet<String>();`',
        '`Collection<String> b = new LinkedList<>();`',
        '`List<String> d = new List<>();`',
        '`Collection<String> c = new HashSet<>();`',
        '`TreeMap<String, Integer> f = new Map<>();`',
        '`Collection<String> h = new HashMap<>();`'
      ],
      answer: [0, 2, 4],
      explain: 'Rechts muss eine **Klasse** stehen, die zum Typ links passt. `List` und `Map` sind Interfaces, `new` geht nicht. Eine `HashSet` ist keine Map, und eine `HashMap` ist keine Collection: **Map erbt nicht von Collection**. `LinkedList` (eine List) und `HashSet` (ein Set) sind beide Collections.' },

    { id: 'K04-S01-F02', sec: 'generics', type: 'multi', t: 'Polymorphie in spitzen Klammern?',
      prompt: '`Integer` ist eine Unterklasse von `Number`. Welche Zuweisungen **kompilieren**? (mehrere)',
      options: [
        '`List<Number> a = new ArrayList<Number>();`',
        '`List<Number> b = new ArrayList<Integer>();`',
        '`Collection<Number> c = new ArrayList<>();`',
        '`List<Object> d = new ArrayList<String>();`',
        '`List<?> e = new ArrayList<String>();`',
        '`List<int> f = new ArrayList<>();`'
      ],
      answer: [0, 2, 4],
      explain: 'Polymorphie gilt für die Klasse **vor** den Klammern (`ArrayList` ist eine `List`/`Collection`), aber **nicht** für das Typargument: Eine Liste von Integer ist keine Liste von Number, sonst könnte man über `b` ein Double hineinlegen. `List<?>` passt zu jeder Ausprägung. Primitive Typen wie `int` sind als Typargument verboten, man nimmt `Integer`.' },

    { id: 'K04-S01-F03', sec: 'generics', type: 'bug', t: 'Wildcard',
      prompt: 'Markiere alle Zeilen, an denen javac einen **Compilerfehler** meldet.',
      code: `import java.util.*;

public class Wild {
    public static void main(String[] args) {
        List<Integer> zahlen = new ArrayList<>(List.of(4, 8));
        List<?> x = zahlen;
        Object erstes = x.get(0);
        int zahl = (Integer) x.get(1);
        x.add(15);
        x.add(null);
        List<?> y = new ArrayList<?>();
        System.out.println(erstes + " " + zahl + " " + x.size());
    }
}`,
      required: [9, 11],
      explain: 'Zeile 9: Über `List<?>` weiß der Compiler nicht, welcher Typ wirklich drinsteckt, 15 passt nicht sicher dazu. Zeile 10 geht: `null` passt zu jedem Typ. Zeile 11: `?` gibt es nur in Deklarationen, nicht beim Konstruktoraufruf („unexpected type“). Lesen geht als `Object` (Zeile 7), der Cast in Zeile 8 kompiliert, aber die Verantwortung trägt der Programmierer.' },

    { id: 'K04-S01-F04', sec: 'generics', type: 'input', t: 'Ein verbotener Cast',
      prompt: 'Was gibt das Programm aus? Die zweite Zeile kommt aus dem `catch`-Block.',
      code: `List<Integer> intList = new ArrayList<>();
intList.add(15);

List<?> wild = intList;
List<String> strList = (List<String>) wild;
strList.add("Hallo");

System.out.println(strList);
try {
    String s = strList.get(0);
} catch (ClassCastException e) {
    System.out.println("CCE");
}`,
      answers: ['[15, Hallo]\nCCE'],
      explain: 'Der Cast schaltet die Typprüfung aus (nur eine Warnung). Danach steckt in **derselben** Liste eine Zahl und ein String. `println` funktioniert noch, der Fehler kommt erst beim Lesen: `strList.get(0)` ist die 15 und kein String. Darum die Regel: **Niemals bei generischen Typen casten.** Der Fehler zeigt sich weit weg von seiner Ursache.' },

    /* ========== List, Set, Map im Überblick ========== */

    { id: 'K04-S01-F05', sec: 'framework', type: 'match', wichtig: true, t: 'Dasselbe Objekt mehrfach?',
      prompt: 'Ordne zu: Wie oft kann **dasselbe** Objekt gespeichert werden?',
      pairs: [
        ['List', 'beliebig oft'],
        ['Set', 'höchstens einmal'],
        ['Map', 'mehrfach als Wert, nur einmal als Schlüssel']
      ],
      explain: 'Eine List speichert Positionen, Duplikate sind erlaubt. Ein Set ist eine Menge, `add` liefert `false`, wenn das Element schon drin ist. In einer Map ist jeder Schlüssel eindeutig (ein `put` mit vorhandenem Schlüssel überschreibt), Werte dürfen sich wiederholen.' },

    { id: 'K04-S01-F06', sec: 'framework', type: 'mc', wichtig: true, t: 'LinkedList oder HashSet einsetzen?',
      prompt: 'In einem Programm steht `List<String> liste = new ArrayList<>();`, danach wird mit `add`, `size`, `get(i)` und `set(2, …)` gearbeitet. Welcher Austausch ist **ohne weitere Änderungen** möglich?',
      options: [
        '`Set<String> liste = new HashSet<>();`',
        'Beide Austausche funktionieren ohne Änderung.',
        'Keiner von beiden, man müsste jedes `get` anpassen.',
        '`List<String> liste = new LinkedList<>();`'
      ],
      answer: 3,
      explain: '`LinkedList` implementiert dasselbe Interface `List`, der restliche Code merkt den Tausch nicht (nur die Geschwindigkeit ändert sich). Ein `Set` hat keinen Index: `get(i)` und `set(2, …)` gibt es dort nicht. Das ist der Vorteil, links das Interface zu schreiben.' },

    { id: 'K04-S01-F07', sec: 'framework', type: 'mc', t: 'ArrayList oder LinkedList?',
      prompt: 'Ein Programm greift sehr oft mit `get(i)` auf beliebige Positionen einer langen Liste zu, fügt aber fast nie etwas ein. Welche Klasse passt besser, und warum?',
      options: [
        '`LinkedList`, weil Einfügen und Löschen dort schnell gehen.',
        '`ArrayList`, weil der direkte Zugriff auf eine Position schnell ist.',
        '`LinkedList`, weil sie im Gegensatz zur ArrayList auch null-Werte erlaubt.',
        'Beide sind gleich schnell, weil beide `List` implementieren.'
      ],
      answer: 1,
      explain: 'Die ArrayList arbeitet intern mit einem Array: `get(i)` springt direkt zur Position. Die LinkedList muss von Element zu Element laufen. Dafür ist sie beim Einfügen und Löschen schneller. null erlauben beide. Das gleiche Interface sagt nichts über die Geschwindigkeit.' },

    /* ========== Mit Listen arbeiten ========== */

    { id: 'K04-S01-F08', sec: 'liste', type: 'fill', t: 'Array durch List ersetzen',
      prompt: 'Das Array `String[] a = new String[3]; a[0] = "Hallo"; … a[2] = "Studierende";` soll durch eine Liste ersetzt werden. Vervollständige.',
      code: `List<String> liste = new ArrayList<>();
liste.[[0]]("Hallo");
liste.add("liebe");
liste.add("Studenten");
for (int i = 0; i < liste.[[1]]; i++) {
    String wert = liste.[[2]];
    System.out.print(wert + " ");
}
liste.[[3]];`,
      blanks: [
        { options: ['put', 'add', 'set', 'insert'], answer: 1,
          why: '`add` hängt hinten an. Die Liste wächst von selbst, eine Größe muss man nicht angeben. `put` gehört zur Map.' },
        { options: ['length', 'length()', 'size()', 'size'], answer: 2,
          why: 'Bei Listen ist die Anzahl eine **Methode**: `size()`. `length` ohne Klammern gibt es nur bei Arrays.' },
        { options: ['get(i)', '[i]', 'get[i]', 'element(i)'], answer: 0,
          why: 'Der Zugriff auf eine Position geht über `get(i)`. Dank `<String>` ist kein Cast nötig.' },
        { options: ['add(2, "Studierende")', 'set(2, "Studierende")', 'put(2, "Studierende")', 'get(2) = "Studierende"'], answer: 1,
          why: '`set` **überschreibt** Position 2. `add(2, …)` würde einfügen, die Liste hätte danach 4 Elemente.' }
      ],
      explain: 'Übersetzung: `new String[3]` → `new ArrayList<>()`, `a[i] = x` (befüllen) → `add(x)`, `a.length` → `size()`, `a[i]` → `get(i)`, `a[i] = x` (überschreiben) → `set(i, x)`.' },

    { id: 'K04-S01-F09', sec: 'liste', type: 'input', t: 'add, set und zweimal remove',
      prompt: 'Was gibt das Programm aus? (eine Zeile)',
      code: `List<Integer> l = new ArrayList<>(List.of(10, 20, 30));
l.add(1, 15);
l.set(0, 5);
l.remove(2);
l.remove(Integer.valueOf(30));
l.add(15);
System.out.println(l + " " + l.indexOf(15) + " " + l.size());`,
      answers: ['[5, 15, 15] 1 3'],
      explain: '`add(1, 15)` fügt ein: [10, 15, 20, 30]. `set(0, 5)` überschreibt: [5, 15, 20, 30]. `remove(2)` mit einem `int` entfernt die **Position** 2: [5, 15, 30]. `remove(Integer.valueOf(30))` entfernt das **Element** 30: [5, 15]. `add(15)`: [5, 15, 15]. `indexOf` liefert das **erste** Vorkommen: 1.' },

    { id: 'K04-S01-F10', sec: 'liste', type: 'mc', t: 'Studentenliste als Map',
      prompt: 'Das Dekanat will Studenten über ihre Matrikelnummer (eine ganze Zahl) finden. Welche Deklaration ist korrekt?',
      options: [
        '`Map<Student> studenten;`',
        '`Map<int, Student> studenten;`',
        '`Map<Integer, Student> studenten;`',
        '`Map<Matrikelnummer, Student> studenten;`'
      ],
      answer: 2,
      wichtig: true,
      explain: 'Eine Map braucht **zwei** Typargumente: erst den Schlüssel, dann den Wert. `int` ist primitiv und als Typargument verboten, man nimmt die Wrapper-Klasse `Integer`. Einen Typ `Matrikelnummer` gibt es nicht, die Nummer ist eine ganze Zahl.' },

    { id: 'K04-S01-F11', sec: 'liste', type: 'mc', wichtig: true, t: 'for-each über eine Map?',
      prompt: '`studenten` ist eine `Map<Integer, Student>`. Was passiert bei `for (Student s : studenten) { System.out.println(s); }`?',
      options: [
        'Alle Studenten werden in der Reihenfolge der Matrikelnummern ausgegeben.',
        'Es kompiliert, wirft aber zur Laufzeit eine `ClassCastException`.',
        'Es werden die Schlüssel ausgegeben, nicht die Studenten.',
        'Es kompiliert nicht, weil eine Map nicht `Iterable` ist.'
      ],
      answer: 3,
      explain: 'Die for-each-Schleife geht nur über Arrays und `Iterable`-Objekte. Map erbt nicht von Collection und ist nicht Iterable („for-each not applicable to expression type“). Richtig wäre `for (Student s : studenten.values())`.' },

    /* ========== for-each & Iterator ========== */

    { id: 'K04-S01-F12', sec: 'durchlauf', type: 'fill', t: 'Iterator von Hand',
      prompt: 'Die Schleife soll alle Namen mit genau drei Buchstaben aus der Liste löschen. Vervollständige.',
      code: `List<String> namen = new ArrayList<>(List.of("Meier", "Kar", "Abel", "Kim"));
Iterator<String> it = namen.[[0]]();
while (it.[[1]]()) {
    String n = it.[[2]]();
    if (n.length() == 3) {
        it.remove();
    }
}
System.out.println(namen);   // [Meier, Abel]`,
      blanks: [
        { options: ['iterator', 'getIterator', 'next', 'stream'], answer: 0,
          why: 'Jede Collection liefert mit `iterator()` einen Iterator, der vor dem ersten Element steht.' },
        { options: ['next', 'hasNext', 'isEmpty', 'hasMore'], answer: 1,
          why: '`hasNext()` prüft, ob noch ein Element kommt, also ob man am Ende ist.' },
        { options: ['get', 'hasNext', 'current', 'next'], answer: 3,
          why: '`next()` liefert das aktuelle Element **und** setzt den Iterator weiter.' }
      ],
      explain: '`it.remove()` löscht das zuletzt mit `next()` gelieferte Element, ohne dass Iterator und Liste auseinanderlaufen. So arbeitet auch die for-each-Schleife intern, nur ohne `remove`.' },

    { id: 'K04-S01-F13', sec: 'durchlauf', type: 'mc', wichtig: true, t: 'Löschen in der for-each-Schleife',
      prompt: '`liste` enthält [a, b, c, d]. Was passiert bei `for (String s : liste) { if (s.equals("a")) liste.remove(s); }`?',
      options: [
        'Die Schleife bricht mit einer `ConcurrentModificationException` ab.',
        '„a“ wird entfernt, die Schleife läuft normal weiter.',
        'Es kompiliert nicht, `remove` ist innerhalb von for-each grundsätzlich verboten.',
        'Es entsteht eine Endlosschleife.'
      ],
      answer: 0,
      explain: 'Die for-each-Schleife arbeitet intern mit einem Iterator. Wird die Liste an ihm vorbei verändert, passen Iterator und Liste nicht mehr zusammen: Beim nächsten `next()` kommt die `ConcurrentModificationException`. Der Compiler merkt davon nichts. Lösung: `liste.removeIf(s -> s.equals("a"));`.' },

    { id: 'K04-S01-F14', sec: 'durchlauf', type: 'fill', t: 'removeIf',
      prompt: 'Alle gesperrten Konten sollen aus `List<Konto> konten` entfernt werden, ohne Schleife und ohne Exception.',
      code: `konten.[[0]](k -> [[1]]);`,
      blanks: [
        { options: ['remove', 'removeAll', 'removeIf', 'filter'], answer: 2,
          why: '`removeIf` aus `Collection` nimmt ein `Predicate` und entfernt jedes Element, für das es `true` liefert.' },
        { options: ['k.isGesperrt()', '!k.isGesperrt()', 'k.remove()', 'konten.isGesperrt()'], answer: 0,
          why: 'Das Predicate liefert `true` für die Elemente, die **weg** sollen, also die gesperrten.' }
      ],
      explain: 'Hier treffen sich Kapitel 2 und 4: `removeIf(Predicate<? super E> filter)` erwartet ein funktionales Interface, man übergibt ein Lambda. Intern arbeitet die Methode sicher mit dem Iterator.' },

    { id: 'K04-S01-F15', sec: 'generics', type: 'explain', t: 'Warum ist List<Integer> keine List<Number>?',
      prompt: '`Integer` erbt von `Number`. Warum ist trotzdem `List<Number> l = new ArrayList<Integer>();` ein Compilerfehler? Nutze ein Beispiel.',
      model: 'Wäre die Zuweisung erlaubt, könnte man über die Variable `l` alles hineinlegen, was eine Number ist, zum Beispiel `l.add(2.5)` (ein Double). Das Objekt ist aber eine Liste von Integer: Wer sie über eine `List<Integer>`-Variable liest, bekäme plötzlich ein Double und eine `ClassCastException`. Darum gilt: keine Polymorphie zwischen spitzen Klammern. Polymorphie gibt es nur für die Klasse davor (`ArrayList<Number>` ist eine `List<Number>`). Wer jede Ausprägung annehmen will, nimmt die Wildcard `List<?>`, darf dann aber nichts außer `null` hinzufügen.' }
  ]
});
