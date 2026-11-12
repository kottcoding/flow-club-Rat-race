// Group decimal strings without rounding their fractional part.
export function groupDigits(value) {
 const [whole, fraction] = String(value).replaceAll(',', '').split('.');
 return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (fraction === undefined ? '' : '.' + fraction);
}
export function formatNumber(value) {
 return Number.isFinite(Number(value)) ? new Intl.NumberFormat('en-US', {maximumFractionDigits: 12}).format(Number(value)) : '—';
}
export function formatCalculation(value) {
 return String(value ?? '').replace(/(?<![\w.])[-+]?\d+(?:,\d{3})*(?:\.\d+)?(?![\w.]|,\d)/g, groupDigits);
}
export function parseNumberInput(text) {
 const raw = text.replaceAll(',', '').trim();
 if (!/^\d*(?:\.\d*)?$/.test(raw)) return null;
 const number = raw === '' || raw === '.' ? 0 : Number(raw);
 return Number.isFinite(number) && number <= Number.MAX_SAFE_INTEGER ? {raw, number} : null;
}
