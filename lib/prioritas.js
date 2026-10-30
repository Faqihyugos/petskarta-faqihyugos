export function ekstrakPrioritas(deskripsi) {
  if (!deskripsi) return 0;
  const match = deskripsi.match(/\[PRIORITAS:(-?\d+)\]/i);
  return match ? parseInt(match[1], 10) : 0;
}

export function setPrioritasDeskripsi(deskripsi, nilaiBaru) {
  let bersih = (deskripsi || "")
    .replace(/\[PRIORITAS:(-?\d+)\]/gi, "")
    .trim();
  if (nilaiBaru !== 0) {
    bersih = bersih ? `${bersih}\n[PRIORITAS:${nilaiBaru}]` : `[PRIORITAS:${nilaiBaru}]`;
  }
  return bersih;
}

