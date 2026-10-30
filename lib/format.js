export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export function formatTanggal(stringTanggal) {
  if (!stringTanggal) return "-";
  try {
    const tanggal = new Date(stringTanggal);
    if (isNaN(tanggal.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(tanggal);
  } catch {
    return "-";
  }
}
