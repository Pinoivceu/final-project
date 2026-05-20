export type SessionPayload = {
  userId: string | number; 
  role: string; 
  expiresAt: Date;
};

export const formatAreaDisplay = (areaInM2: number): string => {
  if (!areaInM2 || areaInM2 <= 0) return "0 m²";

  if (areaInM2 >= 10000) {
    const ha = areaInM2 / 10000;
    return ha.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " Ha";
  }

  return Math.round(areaInM2).toLocaleString("id-ID") + " m²";
};