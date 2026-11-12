"use client";
import {useLayoutEffect, useRef, useState} from 'react';
import {formatNumber, groupDigits, parseNumberInput} from '../lib/number-format.mjs';

// Keep a decimal draft and restore the caret after inserting grouping commas.
export default function NumberInput({value, onChange, min, max, step, ...props}) {
 const [draft, setDraft] = useState(() => formatNumber(value ?? 0));
 const input = useRef(null), caret = useRef(null);
 useLayoutEffect(() => {
  if (Number(draft.replaceAll(',', '')) !== Number(value)) setDraft(formatNumber(value ?? 0));
 }, [value]);
 useLayoutEffect(() => {
  if (caret.current !== null) {
   input.current?.setSelectionRange(caret.current, caret.current);
   caret.current = null;
  }
 }, [draft]);
 function change(event) {
  const text = event.target.value, parsed = parseNumberInput(text);
  if (!parsed) return;
  const formatted = groupDigits(parsed.raw);
  const count = text.slice(0, event.target.selectionStart).replaceAll(',', '').trimStart().length;
  let pos = 0, seen = 0;
  while (pos < formatted.length && seen < count) {if (formatted[pos] !== ',') seen++; pos++;}
  caret.current = pos;
  setDraft(formatted);
  onChange?.({target: {value: String(parsed.number)}});
 }
 return <input {...props} ref={input} type="text" inputMode={step === 'any' ? 'decimal' : 'numeric'} autoComplete="off" value={draft} onChange={change}
  onBlur={() => setDraft(formatNumber(value ?? 0))} />;
}
