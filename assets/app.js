/* Prog3-Training – Anwendung: Inhalte laden, Routen, Ansichten, Lern- und Prüfungsmodus */
'use strict';

(function (P3) {
  const { h, rich, inhalt, fortschritt, gemerkt, notizen, einstellungen, verlauf, speicher } = P3;
  const app = document.getElementById('app');
  const subbar = document.getElementById('subbar');
  let aufraeumen = [];  // Timer usw. der aktuellen Ansicht

  /* ================= Laden ================= */
  function skript(src) {
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => { inhalt.fehler.push('Datei nicht gefunden: ' + src.split('?')[0]); resolve(false); };
      document.head.append(s);
    });
  }

  // Inhalte immer frisch laden (Zeitstempel je Minute), damit nach einem Update
  // keine alten oder als „nicht gefunden“ gemerkten Dateien aus dem Browser-Cache kommen.
  const frisch = src => src + '?t=' + Math.floor(Date.now() / 60000);

  async function laden() {
    await skript(frisch('content/inhalt.js'));
    for (const k of inhalt.kapitel) {
      const ordner = 'content/' + (k.ordner || k.id.toLowerCase()) + '/';
      if (k.zusammenfassung) await skript(frisch(ordner + 'zusammenfassung.js'));
      for (const s of k.serien) await skript(frisch(ordner + s + '.js'));
    }
  }

  /* ================= Abfragen ================= */
  const serienVon = kid => {
    const k = inhalt.kapitel.find(x => x.id === kid);
    if (!k) return [];
    return k.serien.map(s => inhalt.serien.get(kid + '-' + s.toUpperCase())).filter(Boolean);
  };
  const fragenVon = kid => serienVon(kid).flatMap(s => s.fragen);
  const alleFragen = () => [...inhalt.fragen.values()];

  function statistik(fragen) {
    const f = fortschritt.alle();
    let ok = 0, bad = 0, half = 0;
    fragen.forEach(q => {
      const e = f[q.id];
      if (!e || e.last == null) return;
      if (e.last === 1) ok++; else if (e.last === 0) bad++; else half++;
    });
    return { n: fragen.length, ok, bad, half, offen: fragen.length - ok - bad - half };
  }
  const fehlerFragen = () => { const f = fortschritt.alle(); return alleFragen().filter(q => f[q.id] && f[q.id].last != null && f[q.id].last < 1); };
  const gemerkteFragen = () => gemerkt.liste().map(id => inhalt.fragen.get(id)).filter(Boolean);

  function balken(st) {
    const w = x => (st.n ? (x / st.n) * 100 : 0) + '%';
    return h('div', {},
      h('div', { class: 'bar', role: 'img', 'aria-label': `${st.ok} richtig, ${st.bad + st.half} falsch oder teilweise, ${st.offen} offen` },
        h('i', { class: 'b-ok', style: 'width:' + w(st.ok) }),
        h('i', { class: 'b-bad', style: 'width:' + w(st.bad + st.half) })),
      h('div', { class: 'barlabel', text: `${st.ok} von ${st.n} zuletzt richtig · ${st.bad + st.half} falsch · ${st.offen} noch nie beantwortet` }));
  }

  /* ================= Frage-Karte (für alle Modi) =================
     modus: 'lernen' | 'pruefung' | 'auswertung'
     opt: { nummer, antwort, punkte, onBuchung(q, p), onAenderung(q, r), onSelbst(q, p) } */
  function frageKarte(q, modus, opt) {
    const typ = P3.typen[q.type];
    const art = h('article', { class: 'q', id: 'q-' + q.id, 'data-thema': q.sec || '' });
    const head = h('div', { class: 'q-head' },
      h('span', { class: 'q-num', text: String(opt.nummer) }),
      h('span', { class: 'q-kind', text: P3.typLabel(q) }),
      h('span', { class: 'q-id', text: q.id }));
    if (modus === 'lernen') {
      const e = fortschritt.von(q.id);
      if (e && e.last != null) {
        head.append(h('span', {
          class: 'q-last ' + (e.last === 1 ? 'ok' : e.last === 0 ? 'bad' : 'half'),
          text: 'zuletzt ' + (e.last === 1 ? 'richtig' : e.last === 0 ? 'falsch' : 'teilweise')
        }));
      }
    }
    const tools = h('span', { class: 'q-tools' });
    const star = h('button', { type: 'button', class: 'iconbtn star', 'aria-pressed': String(gemerkt.hat(q.id)), title: 'Frage merken' });
    const drawStar = () => { const on = gemerkt.hat(q.id); star.setAttribute('aria-pressed', String(on)); star.textContent = on ? '★ gemerkt' : '☆ merken'; };
    drawStar();
    star.addEventListener('click', () => { gemerkt.umschalten(q.id); drawStar(); navZaehler(); });
    const noteBtn = h('button', { type: 'button', class: 'iconbtn note', 'aria-expanded': 'false', text: '✎ Notiz' });
    tools.append(star, noteBtn);
    head.append(tools);
    art.append(head);
    if (q.t) art.append(h('p', { class: 'q-title', text: q.t }));
    art.append(h('p', { class: 'q-prompt' }, rich(q.prompt)));

    // Notiz
    const noteTa = h('textarea', { class: 'ta', rows: '3', placeholder: 'Deine Notiz zu dieser Frage (wird nur in diesem Browser gespeichert) …', 'aria-label': 'Notiz' });
    noteTa.value = notizen.von(q.id);
    const noteBox = h('div', { class: 'notebox', hidden: true }, noteTa);
    const drawNote = () => noteBtn.setAttribute('data-has', notizen.von(q.id) ? '1' : '0');
    drawNote();
    noteTa.addEventListener('input', () => { notizen.setzen(q.id, noteTa.value); drawNote(); });
    noteBtn.addEventListener('click', () => {
      noteBox.hidden = !noteBox.hidden;
      noteBtn.setAttribute('aria-expanded', String(!noteBox.hidden));
      if (!noteBox.hidden) noteTa.focus();
    });

    const fb = h('div', { class: 'fb', hidden: true, 'aria-live': 'polite' });
    let ctrl;
    const aenderung = () => {
      if (modus === 'lernen') check.disabled = !ctrl.fertig();
      if (modus === 'pruefung' && opt.onAenderung) opt.onAenderung(q, ctrl.get(), ctrl.fertig());
    };
    ctrl = typ.render(q, aenderung);
    art.append(ctrl.el);
    const check = h('button', { type: 'button', class: 'btn', text: q.type === 'explain' ? 'Musterlösung zeigen' : 'Antwort prüfen', disabled: true });

    function aufloesen(antwort, punkteBekannt) {
      ctrl.sperren();
      const extra = ctrl.zeigen(antwort);
      const b = typ.bewerten(q, antwort);
      const punkte = punkteBekannt !== undefined ? punkteBekannt : b.punkte;
      fb.hidden = false;
      const teile = [];
      const verdict = h('p', { class: 'fb-verdict' });
      teile.push(verdict);
      if (extra) teile.push(extra);
      if (q.explain) teile.push(h('p', {}, rich(q.explain)));
      if (q.model) teile.push(h('p', { class: 'fb-verdict', text: 'Musterlösung' }), h('p', { class: 'model' }, rich(q.model)));
      fb.replaceChildren(...teile);

      const setzeUrteil = p => {
        fb.className = 'fb ' + (p === 1 ? 'fb-ok' : p === 0 ? 'fb-bad' : p == null ? '' : 'fb-half');
        verdict.textContent = p === 1 ? 'Richtig. +1 Punkt'
          : p === 0 ? (q.type === 'bug' && q.model && T_bugZeilenOk(q, antwort) ? 'Zeilen richtig, Erklärung nicht ausreichend. 0 Punkte' : 'Nicht richtig. 0 Punkte')
          : p == null ? (q.type === 'bug' ? 'Zeilen richtig markiert. Jetzt deine Erklärung bewerten:' : 'Vergleiche mit der Musterlösung und bewerte dich ehrlich:')
          : 'Teilweise richtig. +0,5 Punkte';
      };
      setzeUrteil(punkte);

      if (b.selbst && punkte == null) {
        const self = h('div', { class: 'self' }, h('span', { text: 'Deine Selbstbewertung:' }));
        [[1, 'Alle Kernpunkte', 'btn'], [0.5, 'Teilweise', 'btn ghost'], [0, 'Nicht getroffen', 'btn ghost']].forEach(([p, label, cls]) => {
          const bt = h('button', { type: 'button', class: cls + ' small', text: label });
          bt.addEventListener('click', () => {
            self.remove();
            setzeUrteil(p);
            if (modus === 'lernen' && opt.onBuchung) opt.onBuchung(q, p);
            if (modus === 'auswertung' && opt.onSelbst) opt.onSelbst(q, p);
          });
          self.append(bt);
        });
        fb.append(self);
      }
      return b;
    }

    if (modus === 'lernen') {
      check.addEventListener('click', () => {
        check.disabled = true;
        check.hidden = true;
        const b = aufloesen(ctrl.get());
        if (!b.selbst || b.punkte != null) opt.onBuchung && opt.onBuchung(q, b.punkte);
      });
      art.append(h('div', { class: 'actions' }, check));
    } else if (modus === 'pruefung') {
      if (opt.antwort !== undefined) ctrl.set(opt.antwort);
    } else if (modus === 'auswertung') {
      if (opt.antwort !== undefined && opt.antwort !== null) ctrl.set(opt.antwort);
      aufloesen(opt.antwort, opt.punkte === undefined ? undefined : opt.punkte);
    }
    art.append(noteBox, fb);
    return art;
  }
  function T_bugZeilenOk(q, r) { return P3.typen.bug.zeilenOk(q, r); }

  /* ================= Kopf ================= */
  function navZaehler() {
    const f = document.getElementById('n-fehler');
    const g = document.getElementById('n-gemerkt');
    if (f) f.textContent = String(fehlerFragen().length);
    if (g) g.textContent = String(gemerkteFragen().length);
  }
  function navAktiv(route) {
    document.querySelectorAll('.nav a').forEach(a => {
      const r = a.getAttribute('href').slice(2).split('/')[0];
      if (route !== null && r === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function seite(titel, ...kinder) {
    document.title = titel ? titel + ' – Prog3-Training' : 'Prog3-Training';
    app.replaceChildren(...kinder.filter(k => k != null && k !== false));  // null = „nichts anzeigen“, nicht den Text null
    window.scrollTo({ top: 0 });
  }

  function chips(liste, aktiv, onWahl) {
    subbar.replaceChildren(...liste.map(c => {
      const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(c.id === aktiv), text: c.name });
      b.addEventListener('click', () => { onWahl(c.id); chips(liste, c.id, onWahl); });
      return b;
    }));
  }

  /* ================= Startseite ================= */
  function viewStart() {
    navAktiv('');
    const alle = alleFragen();
    const st = statistik(alle);
    const laufend = speicher.lesen('laufend', null);
    const kinder = [h('h1', { text: 'Programmieren 3 – Training' }),
      h('p', { class: 'lead' }, 'Pro Kapitel eine Zusammenfassung und mehrere Trainingsserien. ', h('strong', { text: 'Lernmodus' }), ': sofortige Rückmeldung nach jeder Antwort. ', h('strong', { text: 'Prüfungsmodus' }), ': mit Timer, Auflösung erst am Ende, mit Note.')];
    if (inhalt.fehler.length) kinder.push(h('div', { class: 'banner' }, h('span', {}, h('strong', { text: 'Ladefehler: ' }), inhalt.fehler.join(' · '))));
    if (laufend) kinder.push(laufendBanner(laufend));
    kinder.push(h('div', { class: 'stats' },
      stat(st.n, 'Fragen insgesamt'), stat(st.ok, 'zuletzt richtig'), stat(st.bad + st.half, 'im Fehlertraining'),
      stat(gemerkt.liste().length, 'gemerkt'), stat(verlauf.liste().length, 'Prüfungen geschrieben')));
    kinder.push(h('h2', { text: 'Kapitel' }));
    kinder.push(h('div', { class: 'cards' }, inhalt.kapitel.filter(k => !istTestbereich(k)).map(k => {
      const fr = fragenVon(k.id);
      return h('div', { class: 'card' },
        h('h3', {}, h('span', { class: 'kz', text: k.id }), k.titel),
        h('p', { text: k.beschreibung || '' }),
        h('p', { text: `${serienVon(k.id).length} Serien · ${fr.length} Fragen` }),
        balken(statistik(fr)),
        h('div', { class: 'actions' }, h('a', { class: 'btn teal', href: '#/k/' + k.id, text: 'Öffnen' })));
    })));
    kinder.push(h('h2', { text: 'Gezielt üben' }));
    kinder.push(h('div', { class: 'cards' },
      kachel('Fehlertraining', `${fehlerFragen().length} Fragen, die du zuletzt falsch oder nur teilweise hattest. Richtig beantwortet fallen sie heraus.`, '#/fehler', 'Starten'),
      kachel('Gemerkt', `${gemerkt.liste().length} Fragen mit Stern.`, '#/gemerkt', 'Öffnen'),
      kachel('Große Prüfung', 'Zufällige Fragen aus mehreren Kapiteln, mit Timer und Note, wie eine Klausur.', '#/grosse-pruefung', 'Einrichten'),
      kachel('Verlauf', 'Alle geschriebenen Prüfungen mit Punkten und Note, jederzeit nachlesbar.', '#/verlauf', 'Ansehen')));
    // Probetests ganz unten: Kapitel und gezieltes Üben stehen im Vordergrund
    const testKapitel = inhalt.kapitel.filter(istTestbereich);
    if (testKapitel.length) kinder.push(testzone(testKapitel));
    seite('', ...kinder);
  }
  /* Bereich „Probetests“: eigene Farbe, jeder Test direkt startbar */
  function istTestbereich(k) { return k.bereich === 'tests'; }

  function testMeta(s) {
    const typen = new Set(s.fragen.map(q => q.type));
    const praxis = ['input', 'bug', 'fill', 'trace', 'review', 'explain'].some(t => typen.has(t));
    const theorie = ['mc', 'multi', 'match', 'order'].some(t => typen.has(t));
    const art = praxis && theorie ? 'Theorie + Praxis' : praxis ? 'Praxis' : 'Theorie';
    return `${s.fragen.length} Fragen · ${s.dauer || vorschlagMinuten(s.fragen, s)} Minuten · ${art}`;
  }

  function besterVersuch(sid) {
    const versuche = verlauf.liste().filter(e => e.quelle === sid);
    if (!versuche.length) return null;
    const beste = versuche.reduce((m, e) => Math.max(m, e.prozent || 0), 0);
    return `${versuche.length}× geschrieben · beste: ${P3.zahl(beste)} % (Note ${P3.note(beste)})`;
  }

  function testzone(liste) {
    const karten = liste.flatMap(k => serienVon(k.id)).map(s => {
      const best = besterVersuch(s.id);
      return h('div', { class: 'card testcard' },
        h('h3', {}, h('span', { class: 'kz', text: s.id.split('-')[1] }), s.titel, s.neu ? h('span', { class: 'tag test', text: 'neu' }) : null),
        h('p', { class: 'tz-meta', text: testMeta(s) }),
        h('p', { text: s.beschreibung || '' }),
        best ? h('p', { class: 'barlabel', text: best }) : h('p', { class: 'barlabel', text: 'noch nicht geschrieben' }),
        h('div', { class: 'actions' },
          h('a', { class: 'btn test', href: '#/pruefung/' + s.id, text: 'Test starten' }),
          h('a', { class: 'btn ghost', href: '#/lernen/' + s.id, text: 'Lernmodus' })));
    });
    return h('section', { class: 'testzone', 'aria-labelledby': 'tz-titel' },
      h('span', { class: 'tz-badge', text: 'Probetests' }),
      h('h2', { id: 'tz-titel', text: 'Probetests: wie im echten Test' }),
      h('p', { class: 'tz-lead', text: 'Feste Zeit, keine Rückmeldung bis zur Abgabe, danach Auswertung mit Note. Stoff aus allen bisherigen Kapiteln und Wiederholung aus Prog 2.' }),
      h('div', { class: 'cards' }, karten));
  }

  function stat(n, label) { return h('div', { class: 'stat' }, h('b', { text: String(n) }), h('span', { text: label })); }
  function kachel(titel, text, href, knopf) {
    return h('div', { class: 'card' }, h('h3', { text: titel }), h('p', { text: text }), h('div', { class: 'actions' }, h('a', { class: 'btn ghost', href, text: knopf })));
  }
  function laufendBanner(l) {
    const rest = l.ende ? Math.max(0, Math.round((l.ende - Date.now()) / 1000)) : null;
    return h('div', { class: 'banner' },
      h('span', {}, h('strong', { text: 'Laufende Prüfung: ' }), l.titel, rest != null ? ` · noch ${P3.uhr(rest)} Min.` : ''),
      h('a', { class: 'btn', href: '#/pruefung/laufend', text: 'Fortsetzen' }));
  }

  /* ================= Kapitel ================= */
  function viewKapitel(kid) {
    navAktiv(null);
    const k = inhalt.kapitel.find(x => x.id === kid);
    if (!k) return viewNichtGefunden();
    const vl = verlauf.liste();
    const kinder = [
      inhalt.fehler.length ? h('div', { class: 'banner' }, h('span', {}, h('strong', { text: 'Ladefehler: ' }), inhalt.fehler.join(' · '), ' – Seite mit Strg + F5 neu laden.')) : null,
      h('p', { class: 'crumbs' }, h('a', { href: '#/', text: 'Start' }), ' / ', k.id),
      istTestbereich(k) ? h('span', { class: 'tz-badge', text: 'Probetests' }) : null,
      h('h1', { text: istTestbereich(k) ? k.titel : k.id + ' · ' + k.titel }),
      h('p', { class: 'lead', text: k.beschreibung || '' }),
      balken(statistik(fragenVon(kid)))
    ];
    const z = inhalt.zusammenfassungen.get(kid);
    kinder.push(h('div', { class: 'actions' },
      z ? h('a', { class: 'btn teal', href: '#/k/' + kid + '/zusammenfassung', text: 'Zusammenfassung lesen' }) : null,
      h('a', { class: 'btn ghost', href: '#/lernen/' + kid, text: 'Ganzes Kapitel im Lernmodus' }),
      h('a', { class: 'btn ghost', href: '#/pruefung/' + kid, text: 'Ganzes Kapitel als Prüfung' })));
    kinder.push(h('h2', { text: 'Serien' }));
    kinder.push(h('ul', { class: 'serien' }, serienVon(kid).map(s => {
      const versuche = vl.filter(e => e.quelle === s.id);
      const beste = versuche.reduce((m, e) => Math.max(m, e.prozent || 0), -1);
      return h('li', { class: 'serie' },
        h('div', {},
          h('h3', {}, s.id.split('-')[1] + ' · ' + s.titel, s.neu ? h('span', { class: 'tag', text: 'neu' }) : null),
          h('p', { text: (s.beschreibung || '') + (s.dauer ? ` (${s.fragen.length} Fragen, ${s.dauer} Minuten)` : ` (${s.fragen.length} Fragen)`) }),
          balken(statistik(s.fragen)),
          versuche.length ? h('p', { class: 'barlabel', text: `${versuche.length} Prüfung(en), beste: ${P3.zahl(beste)} % (Note ${P3.note(beste)})` }) : null),
        h('div', { class: 'actions' },
          h('a', { class: 'btn', href: '#/lernen/' + s.id, text: 'Lernmodus' }),
          h('a', { class: istTestbereich(k) ? 'btn test' : 'btn ghost', href: '#/pruefung/' + s.id, text: istTestbereich(k) ? 'Test starten' : 'Prüfungsmodus' })));
    })));
    seite(k.titel, ...kinder);
  }

  function viewZusammenfassung(kid) {
    navAktiv(null);
    const k = inhalt.kapitel.find(x => x.id === kid);
    const z = inhalt.zusammenfassungen.get(kid);
    if (!k || !z) return viewNichtGefunden();
    const prose = h('div', { class: 'prose', html: z.html });
    // Inhaltsverzeichnis aus den h2-Überschriften
    const h2s = [...prose.querySelectorAll('h2')];
    h2s.forEach((x, i) => { x.id = 'z-' + (i + 1); });
    const toc = h('nav', { class: 'toc', 'aria-label': 'Inhalt' }, h('strong', { text: 'Inhalt' }),
      h('ol', {}, h2s.map(x => h('li', {}, h('a', { href: '#/k/' + kid + '/zusammenfassung', 'data-ziel': x.id, text: x.textContent })))));
    toc.addEventListener('click', e => {
      const a = e.target.closest('a[data-ziel]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.dataset.ziel).scrollIntoView();
    });
    seite('Zusammenfassung ' + k.id,
      h('p', { class: 'crumbs' }, h('a', { href: '#/', text: 'Start' }), ' / ', h('a', { href: '#/k/' + kid, text: k.id }), ' / Zusammenfassung'),
      h('h1', { text: z.titel || k.titel }),
      toc, prose,
      h('div', { class: 'actions' }, h('a', { class: 'btn teal', href: '#/k/' + kid, text: 'Zu den Serien' })));
  }

  /* ================= Lernmodus ================= */
  function fragenSet(quelle) {
    if (quelle === 'gemerkt') return { titel: 'Gemerkte Fragen', fragen: gemerkteFragen(), zurueck: '#/', gruppen: 'serie' };
    if (quelle === 'fehler') return { titel: 'Fehlertraining', fragen: fehlerFragen(), zurueck: '#/', gruppen: 'serie' };
    const s = inhalt.serien.get(quelle);
    if (s) return { titel: s.titel, serie: s, fragen: s.fragen, zurueck: '#/k/' + s.kapitel, gruppen: 'thema' };
    const k = inhalt.kapitel.find(x => x.id === quelle);
    if (k) return { titel: k.id + ' komplett', fragen: fragenVon(k.id), zurueck: '#/k/' + k.id, gruppen: 'serie' };
    return null;
  }

  function gruppenVon(set) {
    if (set.gruppen === 'thema') {
      return set.serie.themen.map(t => ({ id: t.id, name: t.name, fragen: set.fragen.filter(q => q.sec === t.id) })).filter(g => g.fragen.length);
    }
    const ids = [...new Set(set.fragen.map(q => q.serie))];
    return ids.map(id => {
      const s = inhalt.serien.get(id);
      return { id, name: id + ' · ' + s.titel, fragen: set.fragen.filter(q => q.serie === id) };
    });
  }

  function viewLernen(quelle) {
    const set = fragenSet(quelle);
    if (!set) return viewNichtGefunden();
    navAktiv(quelle === 'gemerkt' ? 'gemerkt' : quelle === 'fehler' ? 'fehler' : null);
    if (!set.fragen.length) {
      return seite(set.titel, h('h1', { text: set.titel }),
        h('p', { class: 'empty-state', text: quelle === 'gemerkt' ? 'Noch nichts gemerkt. Markiere Fragen mit ☆ merken.' : quelle === 'fehler' ? 'Keine offenen Fehler. Stark! Neue Fehler landen automatisch hier.' : 'Diese Serie hat keine Fragen.' }),
        h('a', { class: 'btn ghost', href: '#/', text: 'Zur Startseite' }));
    }
    const gruppen = gruppenVon(set);
    const sitzung = new Map(); // id -> punkte
    const buchungen = [];
    const main = h('div', { class: 'main' },
      h('p', { class: 'crumbs' }, h('a', { href: '#/', text: 'Start' }), ' / ', h('a', { href: set.zurueck, text: 'zurück' }), ' / Lernmodus'),
      h('h1', { text: set.titel }),
      h('p', { class: 'lead' }, h('strong', { text: 'Lernmodus: ' }), 'Nach jeder Antwort siehst du sofort, ob sie stimmt, und warum. Alles wird in deinem Fortschritt gebucht.'));
    let nr = 0;
    const nummern = new Map();
    gruppen.forEach(g => {
      const sec = h('section', { class: 'sec', 'data-gruppe': g.id }, h('h2', { text: g.name }));
      g.fragen.forEach(q => {
        nummern.set(q.id, ++nr);
        sec.append(frageKarte(q, 'lernen', { nummer: nr, onBuchung: buchen }));
      });
      main.append(sec);
    });

    const bal = h('span', { class: 'bigbal', text: '0' });
    const meta = h('p', { class: 'meta', text: 'Noch keine Buchungen in dieser Sitzung' });
    const book = h('ul', { class: 'book' });
    const tbody = h('tbody');
    const side = h('aside', { class: 'statement', 'aria-label': 'Kontoauszug' },
      h('h2', { text: 'Kontoauszug dieser Sitzung' }), meta,
      h('div', {}, bal, h('small', { text: ` von ${set.fragen.length} Punkten` })),
      book,
      h('table', { class: 'topics' }, h('thead', {}, h('tr', {}, h('th', { text: set.gruppen === 'thema' ? 'Thema' : 'Serie' }), h('th', { class: 'n', text: 'richtig' }))), tbody),
      h('button', { type: 'button', class: 'btn ghost', text: 'Neu beginnen', onclick: () => viewLernen(quelle) }),
      set.serie ? h('a', { class: 'btn ghost', href: '#/pruefung/' + set.serie.id, text: 'Zum Prüfungsmodus' }) : null);

    function buchen(q, p) {
      fortschritt.buchen(q.id, p);
      sitzung.set(q.id, p);
      buchungen.unshift({ q, p });
      zeichnen();
      navZaehler();
    }
    function zeichnen() {
      const summe = [...sitzung.values()].reduce((a, b) => a + b, 0);
      bal.textContent = P3.zahl(summe);
      meta.textContent = sitzung.size ? `${sitzung.size} von ${set.fragen.length} beantwortet, ${P3.zahl(summe)} Punkte` : 'Noch keine Buchungen in dieser Sitzung';
      book.replaceChildren(...(buchungen.length ? buchungen.map(b => h('li', {},
        h('a', { href: '#/lernen/' + quelle, 'data-ziel': 'q-' + b.q.id, text: `${nummern.get(b.q.id)}. ${b.q.t || b.q.id}` }),
        h('span', { class: 'amt ' + (b.p === 1 ? 'plus' : b.p === 0 ? 'zero' : 'half'), text: b.p === 1 ? '+1' : b.p === 0 ? '0' : '+0,5' })))
        : [h('li', { class: 'empty', text: 'Beantworte die erste Frage.' })]));
      tbody.replaceChildren(...gruppen.map(g => {
        const r = g.fragen.filter(q => sitzung.get(q.id) === 1).length;
        return h('tr', {}, h('td', { text: g.name }), h('td', { class: 'n', text: `${r} / ${g.fragen.length}` }));
      }));
    }
    book.addEventListener('click', e => {
      const a = e.target.closest('a[data-ziel]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.dataset.ziel).scrollIntoView();
    });
    zeichnen();

    if (gruppen.length > 1) {
      chips([{ id: 'alle', name: 'Alle' }, ...gruppen.map(g => ({ id: g.id, name: g.name }))], 'alle', id => {
        main.querySelectorAll('.sec').forEach(s => { s.hidden = id !== 'alle' && s.dataset.gruppe !== id; });
        window.scrollTo({ top: 0 });
      });
    }
    seite(set.titel + ' · Lernmodus', h('div', { class: 'layout' }, main, side));
  }

  /* ================= Prüfungsmodus ================= */
  const ZEITEN = [10, 15, 20, 30, 45, 60, 90, 120];

  function vorschlagMinuten(fragen, serie) {
    if (serie && serie.dauer && fragen.length === serie.fragen.length) return serie.dauer;
    const proFrage = (serie && serie.minutenProFrage) || 1.5;
    const roh = fragen.reduce((s, q) => s + (q.minuten || (q.type === 'explain' || q.model ? 3 : q.type === 'trace' || q.type === 'review' ? 2.5 : proFrage)), 0);
    return Math.max(5, Math.ceil(roh / 5) * 5);
  }

  function viewPruefungSetup(quelle) {
    if (quelle === 'laufend') return viewPruefungLaufend();
    const set = fragenSet(quelle);
    if (!set || !set.fragen.length) return viewNichtGefunden();
    navAktiv(null);
    const laufend = speicher.lesen('laufend', null);
    const vorschlag = vorschlagMinuten(set.fragen, set.serie);
    const zeit = h('select', { id: 'zeit' },
      h('option', { value: String(vorschlag), text: `${vorschlag} Minuten (Vorschlag)` }),
      ZEITEN.filter(z => z !== vorschlag).map(z => h('option', { value: String(z), text: z + ' Minuten' })),
      h('option', { value: '0', text: 'ohne Zeitlimit' }));
    const mischen = h('input', { type: 'checkbox' });
    const start = h('button', { type: 'button', class: 'btn teal', text: 'Prüfung starten' });
    start.addEventListener('click', () => {
      const fragen = mischen.checked ? P3.mischen(set.fragen) : set.fragen;
      starten({ quelle, titel: set.titel, fragen: fragen.map(q => q.id), minuten: Number(zeit.value) });
    });
    const kinder = [
      h('p', { class: 'crumbs' }, h('a', { href: '#/', text: 'Start' }), ' / ', h('a', { href: set.zurueck, text: 'zurück' }), ' / Prüfungsmodus'),
      h('h1', { text: set.titel + ' · Prüfung' }),
      h('p', { class: 'lead' }, `${set.fragen.length} Fragen. Du siehst während der Prüfung `, h('strong', { text: 'keine' }), ' Rückmeldung. Erst nach dem Abgeben (oder wenn die Zeit abläuft) kommt die Auswertung mit Note. Deine Antworten werden laufend gespeichert, du kannst die Seite schließen und später fortsetzen; die Zeit läuft aber weiter.')
    ];
    if (laufend) kinder.push(laufendBanner(laufend), h('p', { class: 'hint', text: 'Startest du eine neue Prüfung, wird die laufende verworfen.' }));
    kinder.push(h('div', { class: 'form' },
      h('label', {}, 'Zeit', zeit),
      h('div', { class: 'checks' }, h('label', {}, mischen, 'Fragen in zufälliger Reihenfolge')),
      h('p', { class: 'hint' }, 'Bewertung: jede Frage 1 Punkt, nur vollständig richtig zählt. Erklär-Aufgaben bewertest du nach der Abgabe selbst (1 / 0,5 / 0). Bestanden ab ', h('strong', { text: einstellungen.lesen().bestehen + ' %' }), ' (in den Einstellungen änderbar).'),
      h('div', { class: 'actions' }, start)));
    seite(set.titel + ' · Prüfung', ...kinder);
  }

  function starten({ quelle, titel, fragen, minuten }) {
    const jetzt = Date.now();
    speicher.schreiben('laufend', {
      id: 'P' + jetzt.toString(36), quelle, titel, fragen, antworten: {}, beantwortet: {},
      start: jetzt, ende: minuten ? jetzt + minuten * 60000 : null, minuten
    });
    if (location.hash === '#/pruefung/laufend') route(); else location.hash = '#/pruefung/laufend';
  }

  function viewPruefungLaufend() {
    navAktiv(null);
    const l = speicher.lesen('laufend', null);
    if (!l) { location.hash = '#/'; return; }
    if (l.ende && Date.now() >= l.ende) return abgeben(l, true);
    const fragen = l.fragen.map(id => inhalt.fragen.get(id)).filter(Boolean);
    const main = h('div', { class: 'main' },
      h('h1', { text: l.titel + ' · Prüfung' }),
      h('p', { class: 'lead', text: 'Beantworte die Fragen in beliebiger Reihenfolge. Keine Rückmeldung bis zur Abgabe.' }));
    const nav = h('div', { class: 'qnav' });
    const navLinks = new Map();
    fragen.forEach((q, i) => {
      main.append(frageKarte(q, 'pruefung', {
        nummer: i + 1, antwort: l.antworten[q.id],
        onAenderung(q, r, fertig) {
          l.antworten[q.id] = r;
          l.beantwortet[q.id] = fertig;
          speicher.schreiben('laufend', l);
          zaehlen();
        }
      }));
      const a = h('a', { href: '#/pruefung/laufend', text: String(i + 1), 'data-ziel': 'q-' + q.id });
      navLinks.set(q.id, a);
      nav.append(a);
    });
    nav.addEventListener('click', e => {
      const a = e.target.closest('a[data-ziel]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.dataset.ziel).scrollIntoView();
    });
    const uhr = h('div', { class: 'timer', 'aria-live': 'off' });
    const uhrKlein = h('strong', { class: 'timer-klein' });
    const stand = h('p', { class: 'meta' });
    const standKlein = h('span', { class: 'barlabel' });
    const abgebenBtn = h('button', { type: 'button', class: 'btn teal', text: 'Abgeben' });
    const abgebenKlein = h('button', { type: 'button', class: 'btn teal small', text: 'Abgeben' });
    const bestaetigung = h('div', { class: 'confirm', hidden: true });
    const fragen2 = () => fragen.filter(q => !l.beantwortet[q.id]).length;
    const zeigeBestaetigung = () => {
      const offen = fragen2();
      bestaetigung.hidden = false;
      bestaetigung.replaceChildren(
        h('strong', { text: 'Wirklich abgeben?' }),
        h('div', { text: offen ? `${offen} Frage(n) sind noch unbeantwortet und zählen 0 Punkte.` : 'Alle Fragen sind beantwortet.' }),
        h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn danger', text: 'Ja, abgeben', onclick: () => abgeben(l, false) }),
          h('button', { type: 'button', class: 'btn ghost', text: 'Weiter bearbeiten', onclick: () => { bestaetigung.hidden = true; } })));
      bestaetigung.scrollIntoView({ block: 'nearest' });
    };
    abgebenBtn.addEventListener('click', zeigeBestaetigung);
    abgebenKlein.addEventListener('click', () => { side.scrollIntoView(); zeigeBestaetigung(); });
    const verwerfen = h('button', { type: 'button', class: 'btn ghost', text: 'Prüfung abbrechen' });
    verwerfen.addEventListener('click', () => {
      bestaetigung.hidden = false;
      bestaetigung.replaceChildren(h('strong', { text: 'Abbrechen ohne Wertung?' }), h('div', { text: 'Deine Antworten werden verworfen, nichts landet im Verlauf.' }),
        h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn danger', text: 'Ja, verwerfen', onclick: () => { speicher.loeschen('laufend'); location.hash = '#/'; } }),
          h('button', { type: 'button', class: 'btn ghost', text: 'Nein', onclick: () => { bestaetigung.hidden = true; } })));
    });
    const side = h('aside', { class: 'statement', 'aria-label': 'Prüfungsstand' },
      h('h2', { text: l.ende ? 'Restzeit' : 'Bearbeitungszeit' }), uhr, stand, nav, abgebenBtn, verwerfen, bestaetigung);
    subbar.replaceChildren(h('span', {}, '⏱ ', uhrKlein), standKlein, abgebenKlein);

    function zaehlen() {
      let n = 0;
      fragen.forEach(q => { const d = !!l.beantwortet[q.id]; if (d) n++; navLinks.get(q.id).classList.toggle('done', d); });
      stand.textContent = `${n} von ${fragen.length} beantwortet`;
      standKlein.textContent = `${n}/${fragen.length}`;
    }
    function tick() {
      const jetzt = Date.now();
      const sek = l.ende ? (l.ende - jetzt) / 1000 : (jetzt - l.start) / 1000;
      uhr.textContent = uhrKlein.textContent = P3.uhr(sek);
      const low = l.ende && sek <= 60;
      uhr.classList.toggle('low', !!low);
      uhrKlein.classList.toggle('low', !!low);
      if (l.ende && sek <= 0) abgeben(speicher.lesen('laufend', l), true);
    }
    zaehlen();
    tick();
    const iv = setInterval(tick, 1000);
    aufraeumen.push(() => clearInterval(iv));
    seite(l.titel + ' · Prüfung', h('div', { class: 'layout' }, main, side));
  }

  function abgeben(l, zeitAbgelaufen) {
    aufraeumen.forEach(f => f()); aufraeumen = [];
    const jetzt = Date.now();
    const punkte = {};
    l.fragen.forEach(id => {
      const q = inhalt.fragen.get(id);
      if (!q) return;
      const r = l.antworten[id];
      if (!l.beantwortet[id] || r === undefined) {
        punkte[id] = 0; // unbeantwortet: 0 Punkte, aber nicht ins Fehlertraining
      } else {
        const b = P3.typen[q.type].bewerten(q, r);
        punkte[id] = b.punkte; // null = Selbstbewertung offen
        if (punkte[id] != null) fortschritt.buchen(id, punkte[id]);
      }
    });
    const eintrag = {
      id: l.id, quelle: l.quelle, titel: l.titel, fragen: l.fragen, antworten: l.antworten,
      punkte, start: l.start, abgegeben: Math.min(jetzt, l.ende || jetzt), minuten: l.minuten, zeitAbgelaufen
    };
    rechnen(eintrag);
    verlauf.speichern(eintrag);
    speicher.loeschen('laufend');
    navZaehler();
    location.hash = '#/ergebnis/' + l.id;
  }

  function rechnen(e) {
    const werte = Object.values(e.punkte);
    e.max = e.fragen.length;
    e.summe = werte.reduce((a, b) => a + (b || 0), 0);
    e.offen = werte.filter(v => v == null).length;
    e.prozent = P3.prozent(e.summe, e.max);
    e.note = P3.note(e.prozent);
  }

  /* ================= Ergebnis ================= */
  function viewErgebnis(id) {
    navAktiv('verlauf');
    const e = verlauf.liste().find(x => x.id === id);
    if (!e) return viewNichtGefunden();
    rechnen(e);
    const kopf = h('div', { class: 'result' });
    const zeichneKopf = () => {
      rechnen(e);
      const pass = e.note !== '5,0';
      const dauer = Math.round((e.abgegeben - e.start) / 60000);
      kopf.replaceChildren(
        h('div', {}, h('div', { class: 'grade ' + (pass ? 'pass' : 'fail'), text: e.note }), h('div', { class: 'barlabel', text: e.offen ? 'vorläufige Note' : (pass ? 'bestanden' : 'nicht bestanden') })),
        h('div', { class: 'info' },
          h('div', {}, h('b', { text: `${P3.zahl(e.summe)} von ${e.max} Punkten` }), ` · ${P3.zahl(e.prozent)} %`),
          h('div', { text: `${P3.datum(e.start)} · ${dauer} Min. bearbeitet` + (e.minuten ? ` von ${e.minuten}` : '') + (e.zeitAbgelaufen ? ' · automatisch abgegeben (Zeit abgelaufen)' : '') }),
          e.offen ? h('div', {}, h('strong', { text: `${e.offen} Erklärung(en) noch selbst bewerten` }), ' – erst dann steht die Note fest.') : null));
      navAktivNummern();
    };
    const nav = h('div', { class: 'qnav' });
    const navLinks = new Map();
    const navAktivNummern = () => e.fragen.forEach(qid => {
      const a = navLinks.get(qid);
      if (!a) return;
      const p = e.punkte[qid];
      a.className = p == null ? 'r-open' : p === 1 ? 'r-ok' : p === 0 ? 'r-bad' : 'r-half';
    });
    const main = h('div', { class: 'main' },
      h('p', { class: 'crumbs' }, h('a', { href: '#/', text: 'Start' }), ' / ', h('a', { href: '#/verlauf', text: 'Verlauf' }), ' / Ergebnis'),
      h('h1', { text: e.titel + ' · Ergebnis' }), kopf);
    e.fragen.forEach((qid, i) => {
      const q = inhalt.fragen.get(qid);
      if (!q) { main.append(h('p', { class: 'hint', text: `Frage ${qid} gibt es nicht mehr.` })); return; }
      const karte = frageKarte(q, 'auswertung', {
        nummer: i + 1,
        antwort: e.antworten[qid],
        punkte: e.punkte[qid],
        onSelbst(q, p) {
          e.punkte[q.id] = p;
          fortschritt.buchen(q.id, p);
          rechnen(e);
          verlauf.speichern(e);
          zeichneKopf();
          navZaehler();
        }
      });
      karte.dataset.status = e.punkte[qid] == null ? 'offen' : e.punkte[qid] === 1 ? 'ok' : 'falsch';
      main.append(karte);
      const a = h('a', { href: '#/ergebnis/' + id, text: String(i + 1), 'data-ziel': 'q-' + qid });
      navLinks.set(qid, a);
      nav.append(a);
    });
    nav.addEventListener('click', ev => {
      const a = ev.target.closest('a[data-ziel]');
      if (!a) return;
      ev.preventDefault();
      document.getElementById(a.dataset.ziel).scrollIntoView();
    });
    const nochmal = inhalt.serien.get(e.quelle) || inhalt.kapitel.find(k => k.id === e.quelle);
    const side = h('aside', { class: 'statement' },
      h('h2', { text: 'Übersicht' }), h('p', { class: 'meta', text: 'grün richtig · rot falsch · gelb teilweise oder offen' }), nav,
      nochmal ? h('a', { class: 'btn', href: '#/pruefung/' + e.quelle, text: 'Prüfung wiederholen' }) : null,
      h('a', { class: 'btn ghost', href: '#/fehler', text: 'Fehler trainieren' }));
    zeichneKopf();
    chips([{ id: 'alle', name: 'Alle' }, { id: 'falsch', name: 'Nur falsche' }, { id: 'offen', name: 'Selbst bewerten' }], 'alle', f => {
      main.querySelectorAll('.q').forEach(k => {
        const st = e.punkte[k.id.slice(2)];
        const status = st == null ? 'offen' : st === 1 ? 'ok' : 'falsch';
        k.hidden = f !== 'alle' && status !== f;
      });
    });
    seite(e.titel + ' · Ergebnis', h('div', { class: 'layout' }, main, side));
  }

  /* ================= Große Prüfung ================= */
  function viewGross() {
    navAktiv('grosse-pruefung');
    const boxen = inhalt.kapitel.map(k => {
      const cb = h('input', { type: 'checkbox', value: k.id, checked: !istTestbereich(k) });
      return { cb, el: h('label', {}, cb, `${k.id} · ${k.titel} (${fragenVon(k.id).length} Fragen)`) };
    });
    const anzahl = h('select', {}, [10, 20, 30, 40, 60].map(n => h('option', { value: String(n), text: n + ' Fragen', selected: n === 30 })), h('option', { value: '0', text: 'alle Fragen' }));
    const zeit = h('select', {}, [30, 45, 60, 90, 120].map(z => h('option', { value: String(z), text: z + ' Minuten', selected: z === 60 })), h('option', { value: 'auto', text: 'passend zur Fragenzahl' }), h('option', { value: '0', text: 'ohne Zeitlimit' }));
    const ohneErkl = h('input', { type: 'checkbox' });
    const hinweis = h('p', { class: 'hint' });
    const start = h('button', { type: 'button', class: 'btn teal', text: 'Große Prüfung starten' });
    start.addEventListener('click', () => {
      const kap = boxen.filter(b => b.cb.checked).map(b => b.cb.value);
      let pool = kap.flatMap(fragenVon);
      if (ohneErkl.checked) pool = pool.filter(q => q.type !== 'explain' && !q.model);
      if (!pool.length) { hinweis.textContent = 'Wähle mindestens ein Kapitel mit Fragen.'; return; }
      const n = Number(anzahl.value) || pool.length;
      const fragen = P3.mischen(pool).slice(0, n);
      const min = zeit.value === 'auto' ? vorschlagMinuten(fragen) : Number(zeit.value);
      starten({ quelle: 'gross', titel: `Große Prüfung (${kap.join(', ')})`, fragen: fragen.map(q => q.id), minuten: min });
    });
    const moodle = h('button', { type: 'button', class: 'btn ghost', text: 'Probe-Moodle-Test: 15 Fragen, 30 Min.' });
    moodle.addEventListener('click', () => {
      const kap = boxen.filter(b => b.cb.checked).map(b => b.cb.value);
      const pool = kap.flatMap(fragenVon).filter(q => q.type !== 'explain' && !q.model);
      if (!pool.length) { hinweis.textContent = 'Wähle mindestens ein Kapitel mit Fragen.'; return; }
      starten({ quelle: 'gross', titel: `Probe-Moodle-Test (${kap.join(', ')})`, fragen: P3.mischen(pool).slice(0, 15).map(q => q.id), minuten: 30 });
    });
    const laufend = speicher.lesen('laufend', null);
    seite('Große Prüfung',
      h('h1', { text: 'Große Prüfung' }),
      h('p', { class: 'lead', text: 'Zufällig gezogene Fragen aus den gewählten Kapiteln, mit Timer und Note. Zum Testen, ob der Stoff wirklich sitzt, wie in der Klausur.' }),
      laufend ? laufendBanner(laufend) : null,
      h('div', { class: 'form' },
        h('fieldset', {}, h('legend', { text: 'Kapitel' }), h('div', { class: 'checks' }, boxen.map(b => b.el))),
        h('label', {}, 'Anzahl', anzahl),
        h('label', {}, 'Zeit', zeit),
        h('div', { class: 'checks' }, h('label', {}, ohneErkl, 'ohne Erklär-Aufgaben (nur automatisch bewertbare Fragen)')),
        hinweis,
        h('div', { class: 'actions' }, start, moodle),
        h('p', { class: 'hint', text: 'Der Probe-Moodle-Test zieht nur automatisch bewertbare Fragen, wie der echte Theorie-Test (30 Minuten).' })));
  }

  /* ================= Verlauf ================= */
  function viewVerlauf() {
    navAktiv('verlauf');
    const l = verlauf.liste();
    seite('Verlauf',
      h('h1', { text: 'Verlauf' }),
      h('p', { class: 'lead', text: 'Alle abgegebenen Prüfungen. Ein Klick öffnet die Auswertung mit deinen Antworten.' }),
      l.length ? h('div', { style: 'overflow-x:auto' }, h('table', { class: 'table' },
        h('thead', {}, h('tr', {}, ['Datum', 'Prüfung', 'Punkte', '%', 'Note', ''].map((t, i) => h('th', { class: i >= 2 && i <= 4 ? 'n' : '', text: t })))),
        h('tbody', {}, l.map(e => h('tr', {},
          h('td', { text: P3.datum(e.start) }),
          h('td', { text: e.titel }),
          h('td', { class: 'n', text: `${P3.zahl(e.summe)}/${e.max}` }),
          h('td', { class: 'n', text: P3.zahl(e.prozent) }),
          h('td', { class: 'n', text: e.note + (e.offen ? '*' : '') }),
          h('td', {}, h('a', { href: '#/ergebnis/' + e.id, text: 'ansehen' })))))))
        : h('p', { class: 'empty-state', text: 'Noch keine Prüfung geschrieben.' }),
      l.some(e => e.offen) ? h('p', { class: 'hint', text: '* vorläufig: Erklärungen noch nicht selbst bewertet.' }) : null);
  }

  /* ================= Einstellungen ================= */
  function viewEinstellungen() {
    navAktiv('einstellungen');
    const e = einstellungen.lesen();
    const theme = h('select', {}, [['light', 'hell (weiß)'], ['dark', 'dunkel'], ['auto', 'wie das System']].map(([v, t]) => h('option', { value: v, text: t, selected: e.theme === v })));
    theme.addEventListener('change', () => { einstellungen.setzen({ theme: theme.value }); themeAnwenden(); });
    const grenze = h('input', { type: 'number', min: '30', max: '80', step: '5', value: String(e.bestehen) });
    const tabelle = h('div');
    const zeichneTabelle = () => tabelle.replaceChildren(h('table', { class: 'table' },
      h('thead', {}, h('tr', {}, h('th', { text: 'Note' }), h('th', { class: 'n', text: 'ab … %' }))),
      h('tbody', {}, P3.notenTabelle().map(r => h('tr', {}, h('td', { text: r.note }), h('td', { class: 'n', text: P3.zahl(r.ab) }))),
        h('tr', {}, h('td', { text: '5,0' }), h('td', { class: 'n', text: 'darunter' })))));
    grenze.addEventListener('change', () => {
      const v = Math.min(80, Math.max(30, Number(grenze.value) || 50));
      grenze.value = String(v);
      einstellungen.setzen({ bestehen: v });
      zeichneTabelle();
    });
    zeichneTabelle();

    const meldung = h('p', { class: 'hint', 'aria-live': 'polite' });
    const exp = h('button', { type: 'button', class: 'btn', text: 'Fortschritt exportieren' });
    exp.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(P3.exportieren(), null, 1)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'prog3-training-sicherung-' + new Date().toISOString().slice(0, 10) + '.json' });
      document.body.append(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      meldung.textContent = 'Sicherung heruntergeladen.';
    });
    const datei = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
    const imp = h('button', { type: 'button', class: 'btn ghost', text: 'Sicherung importieren', onclick: () => datei.click() });
    datei.addEventListener('change', async () => {
      const f = datei.files[0];
      if (!f) return;
      try {
        P3.importieren(JSON.parse(await f.text()));
        meldung.textContent = 'Import erfolgreich. Fortschritt, Gemerkt, Notizen und Verlauf sind wiederhergestellt.';
        themeAnwenden();
        navZaehler();
      } catch (err) {
        meldung.textContent = 'Import fehlgeschlagen: ' + err.message;
      }
      datei.value = '';
    });
    const reset = h('button', { type: 'button', class: 'btn danger', text: 'Alles zurücksetzen …' });
    const resetBox = h('div', { class: 'confirm', hidden: true },
      h('strong', { text: 'Wirklich alles löschen?' }),
      h('div', { text: 'Fortschritt, Gemerkt, Notizen, Verlauf und eine laufende Prüfung werden in diesem Browser gelöscht. Exportiere vorher eine Sicherung.' }),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn danger', text: 'Ja, alles löschen', onclick: () => {
          speicher.alleSchluessel().filter(k => k !== 'einstellungen').forEach(k => speicher.loeschen(k));
          resetBox.hidden = true; meldung.textContent = 'Alles gelöscht.'; navZaehler();
        } }),
        h('button', { type: 'button', class: 'btn ghost', text: 'Abbrechen', onclick: () => { resetBox.hidden = true; } })));
    reset.addEventListener('click', () => { resetBox.hidden = false; });

    seite('Einstellungen',
      h('h1', { text: 'Einstellungen' }),
      h('div', { class: 'form' },
        h('label', {}, 'Darstellung', theme),
        h('label', {}, 'Bestehensgrenze in %', grenze),
        tabelle),
      h('h2', { text: 'Sicherung' }),
      h('p', { class: 'lead', text: 'Dein Fortschritt liegt nur in diesem Browser (localStorage). Exportiere ihn regelmäßig, um ihn auf ein anderes Gerät zu übertragen oder nach dem Löschen der Browserdaten wiederherzustellen. Neue Serien und Korrekturen an Fragen ändern deinen Fortschritt nicht, weil jede Frage eine feste ID hat.' }),
      h('div', { class: 'actions' }, exp, imp, datei),
      meldung,
      h('h2', { text: 'Zurücksetzen' }),
      h('div', { class: 'actions' }, reset), resetBox);
  }

  function themeAnwenden() {
    const t = einstellungen.lesen().theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }

  function viewNichtGefunden() {
    seite('Nicht gefunden', h('h1', { text: 'Nicht gefunden' }), h('p', { class: 'lead', text: 'Diese Seite oder Serie gibt es nicht (mehr).' }), h('a', { class: 'btn', href: '#/', text: 'Zur Startseite' }));
  }

  /* ================= Router ================= */
  function route() {
    aufraeumen.forEach(f => f());
    aufraeumen = [];
    subbar.replaceChildren();
    const teile = decodeURIComponent(location.hash.replace(/^#\/?/, '')).split('/').filter(Boolean);
    const [a, b, c] = teile;
    if (!a) return viewStart();
    if (a === 'k' && b && c === 'zusammenfassung') return viewZusammenfassung(b);
    if (a === 'k' && b) return viewKapitel(b);
    if (a === 'lernen' && b) return viewLernen(b);
    if (a === 'pruefung' && b) return viewPruefungSetup(b);
    if (a === 'ergebnis' && b) return viewErgebnis(b);
    if (a === 'gemerkt') return viewLernen('gemerkt');
    if (a === 'fehler') return viewLernen('fehler');
    if (a === 'grosse-pruefung') return viewGross();
    if (a === 'verlauf') return viewVerlauf();
    if (a === 'einstellungen') return viewEinstellungen();
    return viewNichtGefunden();
  }

  themeAnwenden();
  laden().then(() => {
    navZaehler();
    window.addEventListener('hashchange', route);
    route();
  });
})(window.P3);
