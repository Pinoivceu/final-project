export type SessionPayload = {
  userId: string | number; 
  role: string; 
  expiresAt: Date;
};

export const formatAreaDisplay = (areaInM2: number): string => {
  if (!areaInM2 || areaInM2 <= 0) return "0 m²";

  // Kondisi: Jika luas >= 10.000 m2, konversi ke Hektar
  if (areaInM2 >= 10000) {
    const ha = areaInM2 / 10000;
    
    return ha.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " ha";
  }

  // Kondisi: Jika di bawah 1 Hektar, tampilkan dalam m2 tanpa desimal agar rapi
  return Math.round(areaInM2).toLocaleString("id-ID") + " m²";
};