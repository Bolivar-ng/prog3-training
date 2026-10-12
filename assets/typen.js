/* Prog3-Training – Aufgabentypen
   Jeder Typ liefert:
     label                     Anzeigename
     render(q, aenderung)  ->  { el, get(), set(antwort), fertig(), sperren(), zeigen(antwort) -> Element|null }
     bewerten(q, antwort)  ->  { punkte: 0..1 | null, selbst: boolean }
                               punkte null + selbst true: Selbstbewertung nötig (Erklären).
   aenderung() wird bei jeder Eingabe aufgerufen (Knopf freischalten, Prüfung zwischenspeichern). */
'use strict';

(function (P3) {
  const { h, rich, codeView, permutation } = P3;

  function norm(s) {
    return String(s == null ? '' : s)
      .replace(/\r/g, '')
      .split('\n').map(z => z.replace(/[ \t]+/g, ' ').trim()).join('\n')
      .replace(/^\n+|\n+$/g, '');
  }
  function alternativen(v) { return Array.isArray(v) ? v : [v]; }
  function gleich(a, b) { return a.length === b.length && a.every((x, i) => x === b[i]); }

  const T = {};

  /* ---------- Multiple Choice / Mehrfachauswahl ---------- */
  function wahl(multi) {
    return {
      label: multi ? 'Mehrfachauswahl' : 'Multiple Choice',
      render(q, aenderung) {
        const sel = new Set();
        const el = h('div', {});
        if (q.code) el.append(codeView(q.code));
        const list = h('div', { class: 'opts' + (multi ? ' multi' : ''), role: 'group', 'aria-label': 'Antwortmöglichkeiten' });
        const btns = q.options.map((o, i) => {
          const b = h('button', { type: 'button', class: 'opt', 'aria-pressed': 'false' },
            h('span', { class: 'mark', 'aria-hidden': 'true' }),
            h('span', { class: 'opt-tx' }, rich(o)));
          b.addEventListener('click', () => {
            if (!multi) sel.clear();
            if (multi && sel.has(i)) sel.delete(i); else sel.add(i);
            draw();
            aenderung();
          });
          return b;
        });
        // Antworten in zufälliger Reihenfolge anzeigen; gespeichert wird immer der Original-Index
        P3.mischen(btns.map((_, i) => i)).forEach(i => list.append(btns[i]));
        const draw = () => btns.forEach((b, i) => b.setAttribute('aria-pressed', String(sel.has(i))));
        el.append(list);
        if (multi) el.append(h('p', { class: 'hint', text: 'Mehrere Antworten können richtig sein. Bewertet wird nur die exakt richtige Auswahl.' }));
        return {
          el,
          get: () => multi ? [...sel].sort((a, b) => a - b) : (sel.size ? [...sel][0] : null),
          set(r) { sel.clear(); (multi ? (r || []) : (r == null ? [] : [r])).forEach(i => sel.add(i)); draw(); },
          fertig: () => sel.size > 0,
          sperren() { btns.forEach(b => { b.disabled = true; }); },
          zeigen() {
            const ans = new Set(alternativen(q.answer));
            btns.forEach((b, i) => {
              if (ans.has(i)) b.classList.add('is-right');
              else if (sel.has(i)) b.classList.add('is-wrong');
            });
            return null;
          }
        };
      },
      bewerten(q, r) {
        const ans = alternativen(q.answer).slice().sort((a, b) => a - b);
        const got = multi ? (r || []) : (r == null ? [] : [r]);
        return { punkte: gleich(ans, got.slice().sort((a, b) => a - b)) ? 1 : 0, selbst: false };
      }
    };
  }
  T.mc = wahl(false);
  T.multi = wahl(true);

  /* ---------- Ausgabe eintippen ---------- */
  T.input = {
    label: 'Ausgabe eintippen',
    render(q, aenderung) {
      const mehrzeilig = q.answers.some(a => a.includes('\n'));
      const el = h('div', {});
      if (q.code) el.append(codeView(q.code));
      const inp = mehrzeilig
        ? h('textarea', { class: 'inp', rows: String(Math.max(2, q.answers[0].split('\n').length)), placeholder: 'Ausgabe hier eintippen, jede Zeile in eine eigene Zeile …', 'aria-label': 'Erwartete Ausgabe', spellcheck: 'false' })
        : h('input', { type: 'text', class: 'inp', placeholder: 'Ausgabe hier eintippen …', 'aria-label': 'Erwartete Ausgabe', autocomplete: 'off', spellcheck: 'false' });
      inp.addEventListener('input', aenderung);
      el.append(h('div', { class: 'input-row' }, inp));
      el.append(h('p', { class: 'hint', text: mehrzeilig ? 'Mehrzeilige Ausgabe. Leerzeichen am Zeilenrand zählen nicht, sonst wird exakt verglichen.' : 'Exakter Vergleich (Groß-/Kleinschreibung zählt), Leerzeichen am Rand zählen nicht.' }));
      return {
        el,
        get: () => inp.value,
        set(r) { inp.value = r || ''; },
        fertig: () => inp.value.trim() !== '',
        sperren() { inp.readOnly = true; },
        zeigen(r) {
          const ok = T.input.bewerten(q, r).punkte === 1;
          inp.classList.add(ok ? 'is-right' : 'is-wrong');
          return h('div', {}, h('p', { text: 'Erwartete Ausgabe:' }), codeView(q.answers[0]));
        }
      };
    },
    bewerten(q, r) {
      const g = norm(r);
      return { punkte: q.answers.some(a => norm(a) === g) ? 1 : 0, selbst: false };
    }
  };

  /* ---------- Lückentext ---------- */
  T.fill = {
    label: 'Lückentext',
    render(q, aenderung) {
      const selects = [];
      const box = h('div', { class: 'code fillcode' });
      q.code.split('\n').forEach((line, i) => {
        const tx = h('span', { class: 'tx' });
        line.split(/(\[\[\d+\]\])/).forEach(part => {
          const m = part.match(/^\[\[(\d+)\]\]$/);
          if (m) {
            const idx = Number(m[1]);
            const s = h('select', { class: 'blank', 'aria-label': 'Lücke ' + (idx + 1) },
              h('option', { value: '', text: '▾ ' + (idx + 1) }),
              P3.mischen(q.blanks[idx].options.map((o, j) => j)).map(j => h('option', { value: String(j), text: q.blanks[idx].options[j] })));
            s.addEventListener('change', aenderung);
            selects[idx] = s;
            tx.append(s);
          } else if (part) {
            tx.append(document.createTextNode(part));
          }
        });
        if (!line) tx.append(document.createTextNode(' '));
        box.append(h('div', { class: 'ln' }, h('span', { class: 'no', text: String(i + 1) }), tx));
      });
      const el = h('div', {}, box, h('p', { class: 'hint', text: 'Wähle für jede Lücke die passende Ergänzung.' }));
      return {
        el,
        get: () => selects.map(s => s.value === '' ? null : Number(s.value)),
        set(r) { (r || []).forEach((v, i) => { if (selects[i]) selects[i].value = v == null ? '' : String(v); }); },
        fertig: () => selects.every(s => s.value !== ''),
        sperren() { selects.forEach(s => { s.disabled = true; }); },
        zeigen(r) {
          const why = h('ol', { class: 'why' });
          selects.forEach((s, i) => {
            const b = q.blanks[i];
            const v = r && r[i] != null ? r[i] : null;
            const right = v === b.answer;
            s.classList.add(right ? 'is-right' : 'is-wrong');
            why.append(h('li', {},
              h('strong', { text: 'Lücke ' + (i + 1) + ': ' }),
              h('code', { text: b.options[b.answer] }),
              right ? ' ✓ ' : ' (deine Wahl: ' + (v == null ? '–' : b.options[v]) + ') ',
              b.why ? rich('– ' + b.why) : null));
          });
          return why;
        }
      };
    },
    bewerten(q, r) {
      return { punkte: q.blanks.every((b, i) => r && r[i] === b.answer) ? 1 : 0, selbst: false };
    }
  };

  /* ---------- Reihenfolge ---------- */
  T.order = {
    label: 'Reihenfolge',
    render(q, aenderung) {
      let order = permutation(q.items.length);
      let locked = false;
      let beruehrt = false;
      const el = h('div', {});
      if (q.code) el.append(codeView(q.code));
      const list = h('ol', { class: 'order' });
      const draw = () => {
        list.replaceChildren(...order.map((idx, pos) => {
          const up = h('button', { type: 'button', class: 'mv', 'aria-label': 'nach oben', text: '↑', disabled: locked || pos === 0 });
          const down = h('button', { type: 'button', class: 'mv', 'aria-label': 'nach unten', text: '↓', disabled: locked || pos === order.length - 1 });
          up.addEventListener('click', () => { [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]]; beruehrt = true; draw(); aenderung(); });
          down.addEventListener('click', () => { [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]]; beruehrt = true; draw(); aenderung(); });
          const li = h('li', { class: 'ord' }, h('span', { class: 'ord-tx' }, rich(q.items[idx])), h('span', { class: 'ord-btns' }, up, down));
          if (locked) li.classList.add(idx === pos ? 'is-right' : 'is-wrong');
          return li;
        }));
      };
      draw();
      el.append(list, h('p', { class: 'hint', text: 'Mit den Pfeilen sortieren. Bewertet wird nur die vollständig richtige Reihenfolge.' }));
      return {
        el,
        get: () => order.slice(),
        set(r) { if (Array.isArray(r) && r.length === q.items.length) { order = r.slice(); beruehrt = true; draw(); } },
        fertig: () => beruehrt,
        sperren() { locked = true; draw(); },
        zeigen() { return h('div', {}, h('p', { text: 'Richtige Reihenfolge:' }), h('ol', { class: 'why' }, q.items.map(it => h('li', {}, rich(it))))); }
      };
    },
    bewerten(q, r) { return { punkte: Array.isArray(r) && r.every((v, i) => v === i) && r.length === q.items.length ? 1 : 0, selbst: false }; }
  };

  /* ---------- Zuordnen ---------- */
  T.match = {
    label: 'Zuordnen',
    render(q, aenderung) {
      const rightOrder = permutation(q.pairs.length);
      const selects = [];
      const grid = h('div', { class: 'match' });
      q.pairs.forEach((p, i) => {
        const s = h('select', { class: 'msel', 'aria-label': 'Zuordnung für Zeile ' + (i + 1) },
          h('option', { value: '', text: 'zuordnen …' }),
          rightOrder.map(r => h('option', { value: String(r), text: q.pairs[r][1] })));
        s.addEventListener('change', aenderung);
        selects.push(s);
        grid.append(h('div', { class: 'm-left' }, rich(p[0])), s);
      });
      return {
        el: grid,
        get: () => selects.map(s => s.value === '' ? null : Number(s.value)),
        set(r) { (r || []).forEach((v, i) => { if (selects[i]) selects[i].value = v == null ? '' : String(v); }); },
        fertig: () => selects.every(s => s.value !== ''),
        sperren() { selects.forEach(s => { s.disabled = true; }); },
        zeigen(r) {
          selects.forEach((s, i) => s.classList.add(r && r[i] === i ? 'is-right' : 'is-wrong'));
          return h('ul', { class: 'why' }, q.pairs.map(p => h('li', {}, rich(p[0]), ' → ', rich(p[1]))));
        }
      };
    },
    bewerten(q, r) { return { punkte: q.pairs.every((p, i) => r && r[i] === i) ? 1 : 0, selbst: false }; }
  };

  /* ---------- Fehler finden (optional mit Erklärung) ---------- */
  T.bug = {
    label: 'Fehler finden',
    render(q, aenderung) {
      const sel = new Set();
      const el = h('div', {});
      const box = h('div', { class: 'code bugcode', role: 'group', 'aria-label': 'Codezeilen, zum Markieren anklicken' });
      const lines = [];
      q.code.split('\n').forEach((line, i) => {
        const n = i + 1;
        const b = h('button', { type: 'button', class: 'ln', 'aria-pressed': 'false', 'data-n': String(n) },
          h('span', { class: 'no', text: String(n) }),
          h('span', { class: 'tx', text: line || ' ' }));
        b.addEventListener('click', () => {
          if (sel.has(n)) sel.delete(n); else sel.add(n);
          b.setAttribute('aria-pressed', String(sel.has(n)));
          aenderung();
        });
        lines.push(b);
        box.append(b);
      });
      el.append(box, h('p', { class: 'hint', text: 'Klicke die fehlerhaften Zeilen an.' + (q.model ? ' Erkläre danach kurz, was falsch ist und wie es richtig wäre.' : '') }));
      let ta = null;
      if (q.model) {
        ta = h('textarea', { class: 'ta', rows: '3', placeholder: 'Was ist falsch, und wie wäre es richtig?', 'aria-label': 'Deine Erklärung' });
        ta.addEventListener('input', aenderung);
        el.append(ta);
      }
      return {
        el,
        get: () => ({ zeilen: [...sel].sort((a, b) => a - b), text: ta ? ta.value : '' }),
        set(r) {
          sel.clear();
          ((r && r.zeilen) || []).forEach(n => sel.add(n));
          lines.forEach((b, i) => b.setAttribute('aria-pressed', String(sel.has(i + 1))));
          if (ta && r) ta.value = r.text || '';
        },
        fertig: () => sel.size > 0 && (!ta || ta.value.trim().length >= 10),
        sperren() { lines.forEach(b => { b.disabled = true; }); if (ta) ta.readOnly = true; },
        zeigen() {
          const req = new Set(q.required), extra = new Set(q.extra || []);
          lines.forEach((b, i) => {
            const n = i + 1;
            if (req.has(n)) b.classList.add(sel.has(n) ? 'is-right' : 'is-miss');
            else if (extra.has(n)) b.classList.add('is-extra');
            else if (sel.has(n)) b.classList.add('is-wrong');
          });
          return h('div', { class: 'legend' },
            h('span', { class: 'l-right', text: 'Fehlerzeile' }),
            (q.extra || []).length ? h('span', { class: 'l-extra', text: 'darf mitmarkiert werden' }) : null,
            h('span', { class: 'l-wrong', text: 'falsch markiert' }));
        }
      };
    },
    zeilenOk(q, r) {
      const sel = new Set((r && r.zeilen) || []);
      const req = new Set(q.required), extra = new Set(q.extra || []);
      return q.required.every(n => sel.has(n)) && [...sel].every(n => req.has(n) || extra.has(n));
    },
    bewerten(q, r) {
      const ok = T.bug.zeilenOk(q, r);
      if (!ok) return { punkte: 0, selbst: false };
      return q.model ? { punkte: null, selbst: true } : { punkte: 1, selbst: false };
    }
  };

  /* ---------- Code-Review: zutreffende Befunde ankreuzen ---------- */
  T.review = {
    label: 'Code-Review',
    render(q, aenderung) {
      const sel = new Set();
      const el = h('div', {});
      if (q.code) el.append(codeView(q.code));
      const list = h('div', { class: 'opts multi', role: 'group', 'aria-label': 'Befunde' });
      const btns = q.findings.map((f, i) => {
        const b = h('button', { type: 'button', class: 'opt', 'aria-pressed': 'false' },
          h('span', { class: 'mark', 'aria-hidden': 'true' }),
          h('span', { class: 'opt-tx' }, rich(f.text)));
        b.addEventListener('click', () => {
          if (sel.has(i)) sel.delete(i); else sel.add(i);
          b.setAttribute('aria-pressed', String(sel.has(i)));
          aenderung();
        });
        list.append(b);
        return b;
      });
      el.append(list, h('p', { class: 'hint', text: 'Kreuze jeden Befund an, der auf diesen Code zutrifft. Nicht zutreffende Befunde nicht ankreuzen.' }));
      let beruehrt = false;
      list.addEventListener('click', () => { beruehrt = true; });
      return {
        el,
        get: () => [...sel].sort((a, b) => a - b),
        set(r) { sel.clear(); (r || []).forEach(i => sel.add(i)); btns.forEach((b, i) => b.setAttribute('aria-pressed', String(sel.has(i)))); if (r) beruehrt = true; },
        fertig: () => beruehrt,
        sperren() { btns.forEach(b => { b.disabled = true; }); },
        zeigen() {
          btns.forEach((b, i) => {
            const f = q.findings[i];
            b.classList.add(f.correct === sel.has(i) ? 'is-right' : 'is-wrong');
            b.querySelector('.opt-tx').append(h('span', { class: 'opt-why' },
              h('strong', { text: f.correct ? 'Trifft zu. ' : 'Trifft nicht zu. ' }), rich(f.why || '')));
          });
          return null;
        }
      };
    },
    bewerten(q, r) {
      const sel = new Set(r || []);
      return { punkte: q.findings.every((f, i) => f.correct === sel.has(i)) ? 1 : 0, selbst: false };
    }
  };

  /* ---------- Trace-Tabelle ---------- */
  T.trace = {
    label: 'Trace',
    render(q, aenderung) {
      const el = h('div', {});
      if (q.code) el.append(codeView(q.code));
      const cells = [];
      const table = h('table', { class: 'trace' },
        h('thead', {}, h('tr', {}, h('th', { text: 'Zeitpunkt' }), q.columns.map(c => h('th', { text: c })))),
        h('tbody', {}, q.rows.map((row, ri) => {
          cells[ri] = [];
          return h('tr', {}, h('td', { class: 'lbl' }, rich(row.label)), q.columns.map((c, ci) => {
            const inp = h('input', { type: 'text', class: 'tcell', autocomplete: 'off', spellcheck: 'false', 'aria-label': row.label + ', ' + c });
            inp.addEventListener('input', aenderung);
            cells[ri][ci] = inp;
            return h('td', {}, inp);
          }));
        })));
      el.append(h('div', { class: 'tracewrap' }, table),
        h('p', { class: 'hint', text: 'Trage in jede Zelle den Wert zu diesem Zeitpunkt ein. Strings ohne Anführungszeichen, double mit Punkt (z. B. 2.5). Alle Zellen müssen stimmen.' }));
      return {
        el,
        get: () => cells.map(r => r.map(c => c.value)),
        set(r) { (r || []).forEach((row, i) => (row || []).forEach((v, j) => { if (cells[i] && cells[i][j]) cells[i][j].value = v || ''; })); },
        fertig: () => cells.every(r => r.every(c => c.value.trim() !== '')),
        sperren() { cells.forEach(r => r.forEach(c => { c.readOnly = true; })); },
        zeigen(r) {
          cells.forEach((row, i) => row.forEach((c, j) => {
            const ok = T.trace.zelleOk(q.rows[i].values[j], r && r[i] ? r[i][j] : '');
            c.classList.add(ok ? 'is-right' : 'is-wrong');
            if (!ok) c.parentNode.append(h('span', { class: 'tsol', text: alternativen(q.rows[i].values[j])[0] }));
          }));
          return null;
        }
      };
    },
    zelleOk(soll, ist) { return alternativen(soll).some(a => norm(a) === norm(ist)); },
    bewerten(q, r) {
      return { punkte: q.rows.every((row, i) => row.values.every((v, j) => T.trace.zelleOk(v, r && r[i] ? r[i][j] : ''))) ? 1 : 0, selbst: false };
    }
  };

  /* ---------- Erklären (Selbstbewertung) ---------- */
  T.explain = {
    label: 'Erklären',
    render(q, aenderung) {
      const el = h('div', {});
      if (q.code) el.append(codeView(q.code));
      const ta = h('textarea', { class: 'ta', rows: '4', placeholder: 'Deine Erklärung in eigenen Worten …', 'aria-label': 'Deine Antwort' });
      ta.addEventListener('input', aenderung);
      el.append(ta, h('p', { class: 'hint', text: 'Erst selbst schreiben (mindestens ein Satz), dann mit der Musterlösung vergleichen und ehrlich bewerten.' }));
      return {
        el,
        get: () => ta.value,
        set(r) { ta.value = r || ''; },
        fertig: () => ta.value.trim().length >= 15,
        sperren() { ta.readOnly = true; },
        zeigen() { return null; }
      };
    },
    bewerten() { return { punkte: null, selbst: true }; }
  };

  P3.typen = T;
  P3.typLabel = q => q.kind || (T[q.type] ? (q.type === 'bug' && q.model ? 'Fehler finden + erklären' : T[q.type].label) : q.type);
})(window.P3);
