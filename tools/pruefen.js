#!/usr/bin/env node
/* Prüft alle Inhalte auf Formfehler. Aufruf im Repo-Ordner:  node tools/pruefen.js
   Bricht mit Exit-Code 1 ab, wenn etwas nicht stimmt. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const fehler = [];
const warn = [];
const kapitel = [];
const serien = [];
const zus = new Set();
const ctx = vm.createContext({
  P3: {
    kapitel: l => kapitel.push(...l),
    serie: s => serien.push(s),
    zusammenfassung: id => zus.add(id)
  }
});
function laden(rel) {
  const f = path.join(root, rel);
  if (!fs.existsSync(f)) { fehler.push('Datei fehlt: ' + rel); return false; }
  try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: rel }); return true; }
  catch (e) { fehler.push(rel + ': ' + e.message); return false; }
}

laden('content/inhalt.js');
const TYPEN = ['mc', 'multi', 'input', 'fill', 'order', 'match', 'bug', 'explain', 'review', 'trace'];
const alleIds = new Set();
let anzahl = 0;
const proTyp = {};

for (const k of kapitel) {
  if (!/^K\d\d$/.test(k.id)) fehler.push(`Kapitel-ID ungültig: ${k.id}`);
  const ordner = 'content/' + (k.ordner || k.id.toLowerCase()) + '/';
  if (k.zusammenfassung) { laden(ordner + 'zusammenfassung.js'); if (!zus.has(k.id)) fehler.push(`${k.id}: Zusammenfassung registriert sich nicht mit der Kapitel-ID`); }
  for (const sname of k.serien) {
    const vorher = serien.length;
    if (!laden(ordner + sname + '.js')) continue;
    if (serien.length !== vorher + 1) { fehler.push(`${ordner}${sname}.js muss genau einmal P3.serie(...) aufrufen`); continue; }
    pruefeSerie(serien[serien.length - 1], k, sname);
  }
}

function pruefeSerie(s, k, sname) {
  const sid = `${k.id}-${sname.toUpperCase()}`;
  const wo = `${sid}`;
  if (s.id !== sid) fehler.push(`${wo}: Serien-ID ist "${s.id}", erwartet "${sid}" (aus Dateiname)`);
  if (s.kapitel !== k.id) fehler.push(`${wo}: kapitel ist "${s.kapitel}", erwartet "${k.id}"`);
  if (!s.titel) fehler.push(`${wo}: titel fehlt`);
  if (s.dauer != null && !(Number.isInteger(s.dauer) && s.dauer >= 5)) fehler.push(`${wo}: dauer muss eine ganze Minutenzahl >= 5 sein`);
  if (!Array.isArray(s.fragen) || !s.fragen.length) { fehler.push(`${wo}: keine Fragen`); return; }
  const themen = new Set((s.themen || []).map(t => t.id));
  s.fragen.forEach(q => {
    anzahl++;
    const w = `${q.id || '(ohne id)'}`;
    const F = m => fehler.push(`${w}: ${m}`);
    if (!new RegExp(`^${sid}-F\\d\\d+$`).test(q.id || '')) F(`ID muss ${sid}-Fnn sein`);
    if (alleIds.has(q.id)) F('ID doppelt');
    alleIds.add(q.id);
    if (!TYPEN.includes(q.type)) { F('unbekannter Typ ' + q.type); return; }
    proTyp[q.type] = (proTyp[q.type] || 0) + 1;
    if (!q.sec || !themen.has(q.sec)) F(`Thema "${q.sec}" nicht in themen`);
    if (!q.prompt) F('prompt fehlt');
    const codeZeilen = q.code ? q.code.split('\n').length : 0;
    const idx = (i, n) => Number.isInteger(i) && i >= 0 && i < n;
    switch (q.type) {
      case 'mc':
        if (!Array.isArray(q.options) || q.options.length < 2) F('mind. 2 options');
        else if (!idx(q.answer, q.options.length)) F('answer ist kein gültiger Index');
        if (!q.explain) F('explain fehlt');
        break;
      case 'multi':
        if (!Array.isArray(q.options) || q.options.length < 2) F('mind. 2 options');
        else if (!Array.isArray(q.answer) || !q.answer.length || !q.answer.every(i => idx(i, q.options.length))) F('answer muss Liste gültiger Indizes sein');
        if (!q.explain) F('explain fehlt');
        break;
      case 'input':
        if (!Array.isArray(q.answers) || !q.answers.length || q.answers.some(a => typeof a !== 'string' || !a.trim())) F('answers: Liste nicht-leerer Strings');
        if (!q.code) F('code fehlt');
        if (!q.explain) F('explain fehlt');
        break;
      case 'fill': {
        const marken = [...(q.code || '').matchAll(/\[\[(\d+)\]\]/g)].map(m => Number(m[1]));
        if (!Array.isArray(q.blanks)) { F('blanks fehlt'); break; }
        if (marken.length !== q.blanks.length || !q.blanks.every((_, i) => marken.includes(i))) F(`Lücken [[n]] (${marken.join(',')}) passen nicht zu ${q.blanks.length} blanks`);
        q.blanks.forEach((b, i) => { if (!Array.isArray(b.options) || !idx(b.answer, b.options.length)) F(`blank ${i}: options/answer ungültig`); });
        break;
      }
      case 'order':
        if (!Array.isArray(q.items) || q.items.length < 2) F('mind. 2 items');
        break;
      case 'match':
        if (!Array.isArray(q.pairs) || q.pairs.length < 2 || q.pairs.some(p => !Array.isArray(p) || p.length !== 2)) F('pairs: mind. 2 Paare [links, rechts]');
        else if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) F('rechte Seiten müssen verschieden sein');
        break;
      case 'bug':
        if (!q.code) { F('code fehlt'); break; }
        if (!Array.isArray(q.required) || !q.required.length) F('required fehlt');
        [...(q.required || []), ...(q.extra || [])].forEach(n => { if (!Number.isInteger(n) || n < 1 || n > codeZeilen) F(`Zeile ${n} existiert nicht (Code hat ${codeZeilen} Zeilen)`); });
        if ((q.extra || []).some(n => q.required.includes(n))) F('Zeile in required und extra');
        if (!q.explain && !q.model) F('explain oder model fehlt');
        break;
      case 'explain':
        if (!q.model) F('model fehlt');
        break;
      case 'review':
        if (!Array.isArray(q.findings) || q.findings.length < 2) { F('mind. 2 findings'); break; }
        if (!q.findings.some(f => f.correct)) F('mind. ein zutreffender Befund nötig');
        q.findings.forEach((f, i) => { if (!f.text || typeof f.correct !== 'boolean') F(`finding ${i}: text/correct fehlt`); if (!f.why) warn.push(`${w}: finding ${i} ohne why`); });
        break;
      case 'trace':
        if (!Array.isArray(q.columns) || !q.columns.length) F('columns fehlt');
        if (!Array.isArray(q.rows) || !q.rows.length) F('rows fehlt');
        else q.rows.forEach((r, i) => { if (!r.label || !Array.isArray(r.values) || r.values.length !== q.columns.length) F(`row ${i}: label/values passen nicht zu columns`); });
        break;
    }
    if (q.prompt && (q.prompt.split('`').length % 2 === 0)) warn.push(`${w}: ungerade Anzahl Backticks im prompt`);
  });
}

console.log(`Kapitel: ${kapitel.length} · Serien: ${serien.length} · Fragen: ${anzahl}`);
console.log('Typen:', Object.entries(proTyp).map(([t, n]) => `${t} ${n}`).join(', '));
warn.forEach(w => console.log('WARNUNG ' + w));
if (fehler.length) {
  fehler.forEach(f => console.log('FEHLER  ' + f));
  process.exit(1);
}
console.log('Alles in Ordnung.');
