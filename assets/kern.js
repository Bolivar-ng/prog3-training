/* Prog3-Training – Kern
   Namensraum P3, Speicherung, Hilfsfunktionen, Registrierung der Inhalte, Notenberechnung.
   Klassische Skripte (keine ES-Module), damit index.html auch per Doppelklick (file://) läuft. */
'use strict';

window.P3 = (function () {
  const PREFIX = 'prog3-training:';
  const VERSION = 1;

  /* ---------- Inhalte ---------- */
  const inhalt = {
    kapitel: [],          // [{ id, titel, beschreibung, serien: ['s01', ...] }]
    serien: new Map(),    // 'K00-S01' -> Serie
    fragen: new Map(),    // 'K00-S01-F01' -> Frage (mit Verweis auf Serie)
    zusammenfassungen: new Map(), // 'K00' -> { titel, html }
    fehler: []            // Ladefehler, werden auf der Startseite angezeigt
  };

  function kapitel(liste) { inhalt.kapitel = liste; }

  function serie(s) {
    if (inhalt.serien.has(s.id)) {
      inhalt.fehler.push('Serie doppelt registriert: ' + s.id);
      return;
    }
    s.themen = s.themen || [];
    s.fragen.forEach((q, i) => {
      q.serie = s.id;
      q.kapitel = s.kapitel;
      q.pos = i + 1;
      if (inhalt.fragen.has(q.id)) inhalt.fehler.push('Frage-ID doppelt: ' + q.id);
      inhalt.fragen.set(q.id, q);
    });
    inhalt.serien.set(s.id, s);
  }

  function zusammenfassung(kapitelId, titel, html) {
    inhalt.zusammenfassungen.set(kapitelId, { titel, html });
  }

  /* ---------- Speicherung (localStorage, immer abgesichert) ---------- */
  const speicher = {
    lesen(name, standard) {
      try {
        const roh = window.localStorage.getItem(PREFIX + name);
        return roh == null ? standard : JSON.parse(roh);
      } catch (e) {
        return standard;
      }
    },
    schreiben(name, wert) {
      try {
        window.localStorage.setItem(PREFIX + name, JSON.stringify(wert));
        return true;
      } catch (e) {
        return false;
      }
    },
    loeschen(name) {
      try { window.localStorage.removeItem(PREFIX + name); } catch (e) { /* egal */ }
    },
    alleSchluessel() {
      const out = [];
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
        }
      } catch (e) { /* kein Speicher */ }
      return out;
    }
  };

  /* Fortschritt pro Frage: { last: 0|0.5|1, n: Versuche, sum: Summe der Punkte, ts: Zeitstempel } */
  const fortschritt = {
    alle() { return speicher.lesen('fragen', {}); },
    von(id) { return fortschritt.alle()[id] || null; },
    buchen(id, punkte) {
      const alle = fortschritt.alle();
      const e = alle[id] || { last: null, n: 0, sum: 0, ts: 0 };
      e.last = punkte;
      e.n += 1;
      e.sum += punkte;
      e.ts = Date.now();
      alle[id] = e;
      speicher.schreiben('fragen', alle);
    }
  };

  const gemerkt = {
    liste() { return speicher.lesen('gemerkt', []); },
    hat(id) { return gemerkt.liste().includes(id); },
    umschalten(id) {
      const l = gemerkt.liste();
      const i = l.indexOf(id);
      if (i >= 0) l.splice(i, 1); else l.push(id);
      speicher.schreiben('gemerkt', l);
      return i < 0;
    }
  };

  const notizen = {
    alle() { return speicher.lesen('notizen', {}); },
    von(id) { return notizen.alle()[id] || ''; },
    setzen(id, text) {
      const a = notizen.alle();
      if (text.trim()) a[id] = text; else delete a[id];
      speicher.schreiben('notizen', a);
    }
  };

  const einstellungen = {
    standard: { theme: 'auto', bestehen: 50 },
    lesen() { return Object.assign({}, einstellungen.standard, speicher.lesen('einstellungen', {})); },
    setzen(teil) { speicher.schreiben('einstellungen', Object.assign(einstellungen.lesen(), teil)); }
  };

  const verlauf = {
    liste() { return speicher.lesen('verlauf', []); },
    speichern(eintrag) {
      const l = verlauf.liste();
      const i = l.findIndex(e => e.id === eintrag.id);
      if (i >= 0) l[i] = eintrag; else l.unshift(eintrag);
      speicher.schreiben('verlauf', l.slice(0, 300));
    }
  };

  /* ---------- Export / Import ---------- */
  function exportieren() {
    const daten = {};
    speicher.alleSchluessel().forEach(k => { daten[k] = speicher.lesen(k, null); });
    return { app: 'prog3-training', version: VERSION, exportiert: new Date().toISOString(), daten };
  }

  function importieren(obj) {
    if (!obj || obj.app !== 'prog3-training' || typeof obj.daten !== 'object')
      throw new Error('Das ist keine Sicherungsdatei der Prog3-Plattform.');
    Object.entries(obj.daten).forEach(([k, v]) => speicher.schreiben(k, v));
  }

  /* ---------- Noten ----------
     Bestehensgrenze g (Standard 50 %) ergibt 4,0; ab 95 % gibt es 1,0.
     Dazwischen 9 gleich breite Stufen: 1,0 1,3 1,7 2,0 2,3 2,7 3,0 3,3 3,7 4,0. Darunter 5,0. */
  const STUFEN = ['1,0', '1,3', '1,7', '2,0', '2,3', '2,7', '3,0', '3,3', '3,7', '4,0'];

  function note(prozent, grenze) {
    const g = grenze == null ? einstellungen.lesen().bestehen : grenze;
    if (prozent < g) return '5,0';
    const oben = Math.max(g + 1, 95);
    if (prozent >= oben) return '1,0';
    const breite = (oben - g) / 9;
    const stufe = Math.ceil((oben - prozent) / breite - 1e-9);
    return STUFEN[Math.min(9, Math.max(1, stufe))];
  }

  function notenTabelle(grenze) {
    const g = grenze == null ? einstellungen.lesen().bestehen : grenze;
    const oben = Math.max(g + 1, 95);
    const breite = (oben - g) / 9;
    return STUFEN.map((n, i) => ({ note: n, ab: i === 0 ? oben : Math.round((oben - i * breite) * 10) / 10 }));
  }

  /* ---------- DOM-Helfer ---------- */
  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if (v === true) e.setAttribute(k, '');
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }

  /* Text mit `Code` und **fett** */
  function rich(text) {
    const frag = document.createDocumentFragment();
    String(text == null ? '' : text).split('`').forEach((teil, i) => {
      if (!teil) return;
      if (i % 2) { frag.append(h('code', { text: teil })); return; }
      teil.split('**').forEach((t, j) => {
        if (!t) return;
        frag.append(j % 2 ? h('strong', { text: t }) : document.createTextNode(t));
      });
    });
    return frag;
  }

  function codeView(code) {
    const box = h('div', { class: 'code' });
    code.split('\n').forEach((line, i) => {
      box.append(h('div', { class: 'ln' },
        h('span', { class: 'no', text: String(i + 1) }),
        h('span', { class: 'tx', text: line || ' ' })));
    });
    return box;
  }

  function mischen(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Permutation 0..n-1, die nicht die Identität ist (für Reihenfolge-Aufgaben) */
  function permutation(n) {
    const basis = [...Array(n).keys()];
    if (n < 2) return basis;
    let a;
    do { a = mischen(basis); } while (a.every((v, i) => v === i));
    return a;
  }

  function prozent(p, max) { return max ? Math.round((p / max) * 1000) / 10 : 0; }
  function zahl(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }
  function datum(ts) {
    return new Date(ts).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function uhr(sek) {
    sek = Math.max(0, Math.round(sek));
    const m = Math.floor(sek / 60), s = sek % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  return {
    PREFIX, VERSION, inhalt, kapitel, serie, zusammenfassung,
    speicher, fortschritt, gemerkt, notizen, einstellungen, verlauf,
    exportieren, importieren, note, notenTabelle,
    h, rich, codeView, mischen, permutation, prozent, zahl, datum, uhr
  };
})();
