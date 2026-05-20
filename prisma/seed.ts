import { PrismaClient, Prisma } from "../client/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as argon2 from "argon2";
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});



const prisma = new PrismaClient({
  adapter,
});
/**
 * =============================================================================
 * PRISMA SEED SCRIPT — Coffee Plantation Management System
 * =============================================================================
 * Center Point : -3.726413841230212, 102.6226891844456 (Desa Air Pesi)
 * Land Radius  : Each land randomly placed within 300m of center
 * Plant Grid   : 2.5m spacing, aligned to each land's bounding box
 * =============================================================================
 */


// ---------------------------------------------------------------------------
// 1. GEOSPATIAL UTILITIES
// ---------------------------------------------------------------------------

const CENTER_LAT = -3.726413841230212;
const CENTER_LNG = 102.6226891844456;

/** Earth radius in metres */
const EARTH_RADIUS_M = 6_378_137;

/** Convert degrees → radians */
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Convert radians → degrees */
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Offset a point by (dx, dy) metres using the flat-earth approximation.
 * Accurate enough for distances < 1 km.
 */
function offsetPoint(
  lat: number,
  lng: number,
  dx: number, // east  (+) / west  (-)
  dy: number  // north (+) / south (-)
): { lat: number; lng: number } {
  const newLat = lat + toDeg(dy / EARTH_RADIUS_M);
  const newLng = lng + toDeg(dx / (EARTH_RADIUS_M * Math.cos(toRad(lat))));
  return { lat: newLat, lng: newLng };
}

/**
 * Haversine distance between two points (metres).
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Generate a random point within `maxRadius` metres of (lat, lng).
 * Uses the square-root trick to produce a uniform radial distribution.
 */
function randomPointInRadius(
  lat: number,
  lng: number,
  maxRadius: number
): { lat: number; lng: number } {
  const r = maxRadius * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);
  return offsetPoint(lat, lng, dx, dy);
}

// ---------------------------------------------------------------------------
// 2. LAND BLOCK DEFINITIONS (size in metres)
// ---------------------------------------------------------------------------

interface LandDefinition {
  name: string;
  areaM2: number;
  address: string;
  variety: string;
  /**
   * Polygon vertices as [dx, dy] offsets in metres from CENTER_LAT/LNG.
   * dx: east (+) / west (-), dy: north (+) / south (-).
   * List them counter-clockwise; the seed code closes the ring automatically.
   * These define the actual GeoJSON shape — not just a rectangle.
   */
  polygonPoints: Array<[number, number]>;
  /**
   * Per-year yield multiplier relative to base (0.3–0.5 kg/m²).
   * Values > 1.0 = above average, < 1.0 = below average / troubled year.
   */
  yieldProfile: Record<number, number>;
  /** Short story used to generate contextual harvest notes. */
  story: string;
  /**
   * Fraction of plants that are inactive (dead / diseased / missing).
   * 0.0 = all healthy, 0.6 = 60% of plants inactive.
   */
  inactiveRate: number;
}

const LAND_DEFINITIONS: LandDefinition[] = [
  {
    // ✅ STAR PERFORMER — trapezoid, wider at base, NW of center
    // Neighbours: Lembah Hijau is 15m to its east, Puncak Sejuk 15m below
    // Approximate area: ~11,900 m²
    name: "Blok Kopi Gunung Merapi",
    areaM2: 11900,
    address: "Desa Air Pesi, Kecamatan Lebong Utara, Bengkulu",
    variety: "Robusta",
    polygonPoints: [
      [-225, 15],   // SW — bottom-left
      [-90, 15],   // SE — bottom-right (wider base: 135m)
      [-100, 130],   // NE — top-right
      [-210, 130],   // NW — top-left  (narrower top: 110m, height: 115m)
    ],
    story: "Lahan terbaik dengan manajemen optimal dan irigasi teratur",
    inactiveRate: 0.04,
    yieldProfile: { 2022: 1.15, 2023: 1.25, 2024: 1.20, 2025: 1.18, 2026: 1.22 },
  },
  {
    // 📈 RECOVERING — irregular pentagon, NE of center
    // 15m gap from Gunung Merapi on its west side
    // Approximate area: ~12,400 m²
    name: "Blok Kopi Lembah Hijau",
    areaM2: 12400,
    address: "Desa Air Pesi, Kecamatan Lebong Utara, Bengkulu",
    variety: "Robusta",
    polygonPoints: [
      [-75, 15],   // SW
      [45, 15],   // SE  (120m wide base)
      [50, 80],   // E   — east bulge mid-point
      [30, 130],   // NE
      [-70, 130],   // NW  (100m wide top, height ~115m)
    ],
    story: "Sempat diserang hama penggerek buah 2022-2023, kini dalam pemulihan",
    inactiveRate: 0.28,
    yieldProfile: { 2022: 0.45, 2023: 0.55, 2024: 0.85, 2025: 1.05, 2026: 1.10 },
  },
  {
    // ⚠️  STRUGGLING — parallelogram (skewed quad), south of center
    // 15m gap below the two northern blocks
    // Approximate area: ~12,750 m²
    name: "Blok Kopi Bukit Harapan",
    areaM2: 12750,
    address: "Desa Air Pesi, Kecamatan Lebong Utara, Bengkulu",
    variety: "Robusta",
    polygonPoints: [
      [-80, -240],  // SW
      [55, -240],  // SE  (135m base)
      [70, -130],  // NE  — top shifted 15m east (parallelogram skew)
      [-65, -130],  // NW  (135m top, height: 110m)
    ],
    story: "Lahan di lereng kering, rentan kekeringan dan kualitas tanah rendah",
    inactiveRate: 0.45,
    yieldProfile: { 2022: 0.60, 2023: 0.40, 2024: 0.50, 2025: 0.55, 2026: 0.45 },
  },
  {
    // 📉 DECLINING — narrow tall rectangle, SE of center
    // 15m gap from Bukit Harapan on its west side
    // Approximate area: ~9,000 m²
    name: "Blok Kopi Sungai Tenang",
    areaM2: 9000,
    address: "Desa Air Pesi, Kecamatan Lebong Utara, Bengkulu",
    variety: "Robusta",
    polygonPoints: [
      [85, -240],  // SW
      [175, -240],  // SE  (90m wide)
      [175, -140],  // NE
      [85, -140],  // NW  (height: 100m)
    ],
    story: "Tanaman mulai menua, terserang penyakit karat daun sejak 2024",
    inactiveRate: 0.55,
    yieldProfile: { 2022: 1.10, 2023: 1.05, 2024: 0.70, 2025: 0.50, 2026: 0.35 },
  },
  {
    // 🔄 VOLATILE — irregular hexagon, SW of center
    // 15m gap from Gunung Merapi on its east side
    // Approximate area: ~14,500 m²
    name: "Blok Kopi Puncak Sejuk",
    areaM2: 14500,
    address: "Desa Air Pesi, Kecamatan Lebong Utara, Bengkulu",
    variety: "Robusta",
    polygonPoints: [
      [-370, -230],  // SW
      [-240, -230],  // SE  (130m base)
      [-230, -145],  // E   — slight east notch
      [-245, -70],  // NE
      [-350, -70],  // NW  (105m top)
      [-375, -150],  // W   — west indent (hexagon bump)
    ],
    story: "Lahan berpotensi tinggi namun sangat bergantung pada curah hujan",
    inactiveRate: 0.18,
    yieldProfile: { 2022: 0.80, 2023: 1.35, 2024: 0.50, 2025: 1.20, 2026: 0.70 },
  },
];

// ---------------------------------------------------------------------------
// 3. PLANT GRID GENERATOR
// ---------------------------------------------------------------------------

/**
 * Fill a rectangular land block with coffee plants on a 2.5 m grid.
 *
 * The grid origin is the SW corner of the land.  
 * Row direction  = North  (+dy per step)  
 * Column direction = East (+dx per step)
 *
 * Each plant is offset by ±0.3 m of random jitter to look natural.
 */
function generatePlantGrid(
  originLat: number,   // SW corner latitude
  originLng: number,   // SW corner longitude
  widthM: number,
  heightM: number,
  spacingM: number = 2.5,
  variety: string,
  inactiveRate: number = 0.0  // 0.0–1.0 fraction of plants to mark inactive
): Array<{
  variety: string;
  locationCoordinate: { lat: number; lng: number };
  status: string;
  plantedAt: Date;
}> {
  const plants: ReturnType<typeof generatePlantGrid> = [];

  const cols = Math.floor(widthM / spacingM);
  const rows = Math.floor(heightM / spacingM);

  // Spread planting dates over the past 4 years for realism
  const now = new Date("2026-05-10");
  const oldDate = new Date("2022-01-01");
  const dateRangeMs = now.getTime() - oldDate.getTime();

  // ── Cluster-based inactive zones ──────────────────────────────────────────
  // Instead of scattering inactive plants randomly, we create 2–4 "problem
  // clusters" so the map shows realistic patches of dead/diseased plants.
  const numClusters = inactiveRate > 0 ? 2 + Math.floor(inactiveRate * 4) : 0;
  interface Cluster { cx: number; cy: number; radius: number; }
  const clusters: Cluster[] = [];
  for (let c = 0; c < numClusters; c++) {
    clusters.push({
      cx: Math.random() * cols,           // grid-space centre X
      cy: Math.random() * rows,           // grid-space centre Y
      radius: 2 + Math.random() * (inactiveRate * 10), // cluster radius in grid cells
    });
  }

  /** Returns true if this grid cell falls inside any inactive cluster */
  function isInCluster(col: number, row: number): boolean {
    for (const cl of clusters) {
      const dist = Math.sqrt((col - cl.cx) ** 2 + (row - cl.cy) ** 2);
      if (dist <= cl.radius) return true;
    }
    return false;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Base position
      const dx = col * spacingM;
      const dy = row * spacingM;

      // Natural jitter ±0.3 m
      const jitterX = (Math.random() - 0.5) * 0.6;
      const jitterY = (Math.random() - 0.5) * 0.6;

      const { lat, lng } = offsetPoint(
        originLat, originLng,
        dx + jitterX,
        dy + jitterY
      );

      const plantedAt = new Date(
        oldDate.getTime() + Math.random() * dateRangeMs
      );

      // Status: inactive if inside a cluster AND random roll confirms it,
      // with a small chance of isolated inactive plants outside clusters.
      let status = "active";
      if (inactiveRate > 0) {
        const inCluster = isInCluster(col, row);
        const roll = Math.random();
        if (inCluster && roll < inactiveRate * 1.5) {
          status = "inactive"; // dense inside cluster
        } else if (!inCluster && roll < inactiveRate * 0.15) {
          status = "inactive"; // sparse scattered outliers
        }
      }

      plants.push({
        variety,
        locationCoordinate: { lat, lng },
        status,
        plantedAt,
      });
    }
  }

  return plants;
}

// ---------------------------------------------------------------------------
// 4. SEED HELPERS
// ---------------------------------------------------------------------------

/** Deterministic seeded pseudo-random (LCG) — only for color/stable values */
class SeededRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// 5. STATIC DATA TABLES
// ---------------------------------------------------------------------------

const TREATMENT_ACTIVITIES = [
  "Pemupukan",
  "Pemangkasan",
  "Penyiraman",
  "Pengendalian Hama",
  "Pengendalian Penyakit",
  "Penyiangan Gulma",
  "Pembumbunan Tanah",
  "Pemanenan Buah Kopi",
];

const TASK_TITLES: Record<string, string[]> = {
  Pemupukan: [
    "Aplikasi Pupuk NPK Blok Utara",
    "Pemupukan Organik Kuartal II",
    "Aplikasi Kompos Daun",
  ],
  Pemangkasan: [
    "Pemangkasan Bentuk Tanaman",
    "Pemangkasan Peremajaan",
    "Pemangkasan Sanitasi",
  ],
  Penyiraman: [
    "Irigasi Tetes Musim Kemarau",
    "Penyiraman Manual Bibit",
    "Monitoring Kelembaban Tanah",
  ],
  "Pengendalian Hama": [
    "Penyemprotan Pestisida Penggerek Buah",
    "Pemasangan Perangkap Hama",
    "Aplikasi Biopestisida",
  ],
};

// Only the four valid task statuses — weighted toward pending/in_progress
// to reflect a realistic work-in-progress state.
const TASK_STATUSES = [
  "pending",
  "pending",
  "in_progress",
  "in_progress",
  "on_approval",
  "completed",
];

// All plants and harvests are Robusta
const COFFEE_VARIETIES = ["Robusta"];

// ---------------------------------------------------------------------------
// 6. MAIN SEED FUNCTION
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Starting coffee plantation seed...\n");

  // ── 6.1  Clean existing data (order respects FK constraints) ──────────────
  console.log("🗑️  Clearing existing data...");
  await prisma.treatmentDocumentation.deleteMany();
  await prisma.treatmentLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.harvest.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.land.deleteMany();
  await prisma.user.deleteMany();
  console.log("   ✅ Done.\n");

  // ── 6.2  Hash helper ──────────────────────────────────────────────────────
  const hash = (plain: string) =>
    argon2.hash(plain, { type: argon2.argon2id });

  // ── 6.3  Create Owner ─────────────────────────────────────────────────────
  console.log("👑 Creating Owner...");
  const owner = await prisma.user.create({
    data: {
      fullName: "Budi Santoso",
      username: "owner_budi",
      password: await hash("password123"),
      role: "owner",
      phoneNumber: "+6281234567890",
      status: "active",
      image: "/default-avatar.png",
      joinedAt: new Date("2023-01-15"),
      lastLogin: new Date(),
    },
  });
  console.log(`   ✅ Owner: ${owner.fullName} (${owner.id})\n`);

  // ── 6.4  Create 5 Mandors ─────────────────────────────────────────────────
  console.log("👷 Creating 5 Mandors...");
  const mandorData = [
    { fullName: "Ahmad Fauzi", username: "mandor_ahmad", phone: "+6282111111001" },
    { fullName: "Siti Rahayu", username: "mandor_siti", phone: "+6282111111002" },
    { fullName: "Dede Kurniawan", username: "mandor_dede", phone: "+6282111111003" },
    { fullName: "Rina Marlina", username: "mandor_rina", phone: "+6282111111004" },
    { fullName: "Joko Susanto", username: "mandor_joko", phone: "+6282111111005" },
  ];

  const mandors = await Promise.all(
    mandorData.map(async (m, i) =>
      prisma.user.create({
        data: {
          fullName: m.fullName,
          username: m.username,
          password: await hash("password123"),
          role: "mandor",
          phoneNumber: m.phone,
          status: "active",
          image: "/default-avatar.png",
          joinedAt: randomDate(new Date("2023-03-01"), new Date("2024-01-01")),
          lastLogin: randomDate(new Date("2025-01-01"), new Date()),
        },
      })
    )
  );
  mandors.forEach((m) => console.log(`   ✅ Mandor: ${m.fullName} (${m.id})`));
  console.log();

  // ── 6.5  Create 5 Lands with geospatial coordinates ──────────────────────
  console.log("🗺️  Creating 5 Land Blocks (non-overlapping, 8,000–16,000 m²)...");

  const lands: Awaited<ReturnType<typeof prisma.land.create>>[] = [];

  for (let i = 0; i < 5; i++) {
    const def = LAND_DEFINITIONS[i];
    const mandor = mandors[i];

    // Convert polygonPoints ([dx,dy] metre offsets from CENTER) → real lat/lng vertices
    const vertices = def.polygonPoints.map(([dx, dy]) =>
      offsetPoint(CENTER_LAT, CENTER_LNG, dx, dy)
    );

    // Close the GeoJSON ring (last point = first point)
    const ring: [number, number][] = [
      ...vertices.map(v => [v.lng, v.lat] as [number, number]),
      [vertices[0].lng, vertices[0].lat],
    ];

    // Bounding box of the polygon (used for plant grid origin & dimensions)
    const dxValues = def.polygonPoints.map(p => p[0]);
    const dyValues = def.polygonPoints.map(p => p[1]);
    const minDx = Math.min(...dxValues);
    const maxDx = Math.max(...dxValues);
    const minDy = Math.min(...dyValues);
    const maxDy = Math.max(...dyValues);
    const bboxWidthM = maxDx - minDx;
    const bboxHeightM = maxDy - minDy;

    // SW corner of bounding box (plant grid origin)
    const swCorner = offsetPoint(CENTER_LAT, CENTER_LNG, minDx, minDy);

    // Centre of bounding box (for distance reporting)
    const landCenter = offsetPoint(CENTER_LAT, CENTER_LNG,
      (minDx + maxDx) / 2, (minDy + maxDy) / 2);
    const dist = haversineDistance(
      CENTER_LAT, CENTER_LNG, landCenter.lat, landCenter.lng
    );

    // Valid GeoJSON Feature → Polygon (RFC 7946, [lng, lat], closed ring)
    const coordinates = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [ring],
      },
      properties: {},
    };

    const land = await prisma.land.create({
      data: {
        landName: def.name,
        areaSize: def.areaM2,
        locationAddress: def.address,
        coordinates,
        image: "/default-kebun.jpg",
        isActive: true,
        mandorId: mandor.id,
      },
    });

    lands.push(land);
    console.log(
      `   ✅ ${def.name} | ${def.polygonPoints.length}-vertex polygon | ` +
      `bbox ${Math.round(bboxWidthM)}×${Math.round(bboxHeightM)}m | ` +
      `${Math.round(dist)}m from center | mandor: ${mandor.fullName}`
    );

    // ── 6.6  Generate Plant Grid (fills bounding box of polygon) ─────────────
    const plantGridData = generatePlantGrid(
      swCorner.lat,
      swCorner.lng,
      bboxWidthM,
      bboxHeightM,
      2.5,
      def.variety,
      def.inactiveRate
    );

    // Batch insert plants (chunked to avoid query size limits)
    const CHUNK = 500;
    let plantCount = 0;
    for (let c = 0; c < plantGridData.length; c += CHUNK) {
      const chunk = plantGridData.slice(c, c + CHUNK);
      await prisma.plant.createMany({
        data: chunk.map((p) => ({
          variety: p.variety,
          plantedAt: p.plantedAt,
          locationCoordinate: p.locationCoordinate,
          status: p.status,
          landId: land.id,
        })),
      });
      plantCount += chunk.length;
    }

    const activePlants = plantGridData.filter(p => p.status === "active").length;
    const inactivePlants = plantGridData.filter(p => p.status === "inactive").length;
    const cols = Math.floor(bboxWidthM / 2.5);
    const rows = Math.floor(bboxHeightM / 2.5);
    console.log(
      `      🌱 ${plantCount} plants (${cols}×${rows}) | ` +
      `✅ ${activePlants} active  ❌ ${inactivePlants} inactive  ` +
      `(${(def.inactiveRate * 100).toFixed(0)}% inactive rate)`
    );
  }
  console.log();

  // ── 6.7  Treatment Logs ───────────────────────────────────────────────────
  console.log("📋 Creating Treatment Logs...");
  const treatmentLogs: Awaited<ReturnType<typeof prisma.treatmentLog.create>>[] = [];

  for (const land of lands) {
    const mandor = mandors.find((m) => m.id === land.mandorId)!;
    const logsPerLand = 6;

    for (let t = 0; t < logsPerLand; t++) {
      const activityType = randomElement(TREATMENT_ACTIVITIES);
      const log = await prisma.treatmentLog.create({
        data: {
          activityType,
          description: `Kegiatan ${activityType} pada ${land.landName}. ` +
            `Dilaksanakan sesuai jadwal perawatan rutin blok.`,
          executionDate: randomDate(new Date("2024-06-01"), new Date()),
          landId: land.id,
          mandorId: mandor.id,
        },
      });
      treatmentLogs.push(log);

      // ── 6.8  Treatment Documentation (2–3 photos per log) ────────────────
      const photosCount = 2 + Math.floor(Math.random() * 2);
      const landCoords = land.coordinates as any;
      const centerPt = landCoords?.centerPoint ?? { lat: CENTER_LAT, lng: CENTER_LNG };

      await prisma.treatmentDocumentation.createMany({
        data: Array.from({ length: photosCount }, (_, pi) => ({
          photoUrl: `https://picsum.photos/seed/${log.id}-${pi}/800/600`,
          caption: `Dokumentasi ${activityType} - Foto ${pi + 1}`,
          takenAt: log.executionDate,
          latitude: centerPt.lat + (Math.random() - 0.5) * 0.001,
          longitude: centerPt.lng + (Math.random() - 0.5) * 0.001,
          treatmentLogId: log.id,
        })),
      });
    }
  }
  console.log(
    `   ✅ ${treatmentLogs.length} treatment logs + documentation created.\n`
  );

  // ── 6.9  Harvests (5-year realistic dataset, 2021–2025) ──────────────────
  //
  // Rules applied:
  //  • 14-day interval per land: next pick is always 10–14 days after the last.
  //  • Bell curve volume: 8–10 sessions per season distributed as:
  //      early/late 5–10%, shoulder 10–20%, peak 25–40% of annual yield.
  //  • Annual yield per land: ~0.3–0.5 kg/m² of areaSize (realistic Indonesian
  //    Robusta field yield = 800–1500 kg/ha → 0.08–0.15 kg/m²; we use cherry
  //    weight which is ~4–6× green-bean weight, so 0.3–0.5 kg/m²).
  //  • Harvest season per year: May–October (Indonesian main crop).
  //  • 5 years: 2021, 2022, 2023, 2024, 2025.
  //
  console.log("🍒 Creating Harvest Records (5-year dataset)...");
  let harvestTotal = 0;

  /**
   * Generate one season's worth of harvest dates + weights for a single land.
   * Returns an array of { date, weight } objects following the bell curve rule.
   */
  function generateSeasonHarvests(
    year: number,
    annualYieldKg: number
  ): Array<{ date: Date; weight: number; sessionIndex: number; totalSessions: number }> {
    // Season: May 1 → October 31 (capped at May 10 for 2026)
    const seasonStart = new Date(year, 4, 1);   // May 1
    const naturalEnd = new Date(year, 9, 31);  // October 31
    const hardCap = new Date("2026-05-10T23:59:59.000Z");
    const seasonEnd = naturalEnd > hardCap ? hardCap : naturalEnd;

    // 8–10 picking sessions per season
    const totalSessions = 8 + Math.floor(Math.random() * 3); // 8, 9, or 10

    // Bell-curve weight distribution:
    // Position 0..totalSessions-1 → weight factor via a Gaussian-like curve.
    // Peak is at the middle session(s).
    function bellWeight(i: number, n: number): number {
      // Normalised position 0..1
      const x = i / (n - 1);
      // Gaussian centred at 0.5
      const sigma = 0.22;
      return Math.exp(-Math.pow(x - 0.5, 2) / (2 * sigma * sigma));
    }

    // Compute raw factors and normalise so they sum to 1
    const factors: number[] = [];
    for (let i = 0; i < totalSessions; i++) factors.push(bellWeight(i, totalSessions));
    const sum = factors.reduce((a, b) => a + b, 0);
    const normalised = factors.map((f) => f / sum);

    // Add ±15% biological noise to each session weight
    const weights = normalised.map((f) => {
      const noise = 1 + (Math.random() * 0.3 - 0.15);
      return parseFloat((annualYieldKg * f * noise).toFixed(2));
    });

    // Build dates: start near season open, advance 10–14 days per session
    const sessions: Array<{ date: Date; weight: number; sessionIndex: number; totalSessions: number }> = [];
    let cursor = new Date(seasonStart.getTime() + Math.random() * 7 * 86400_000); // 0–7 day offset into season

    for (let i = 0; i < totalSessions; i++) {
      if (cursor > seasonEnd) break;
      sessions.push({
        date: new Date(cursor),
        weight: weights[i],
        sessionIndex: i + 1,
        totalSessions,
      });
      // Advance 10–14 days for next pick
      const interval = 10 + Math.floor(Math.random() * 5); // 10..14
      cursor = new Date(cursor.getTime() + interval * 86400_000);
    }

    return sessions;
  }

  // 5 years: 2022 → 2026, hard cutoff = May 10 2026
  const HARVEST_YEARS = [2022, 2023, 2024, 2025, 2026];
  const HARVEST_CUTOFF = new Date("2026-05-10T23:59:59.000Z");

  // Build a lookup: landId → LandDefinition (for yieldProfile & story)
  const landDefMap = new Map<string, LandDefinition>();
  for (let i = 0; i < lands.length; i++) {
    landDefMap.set(lands[i].id, LAND_DEFINITIONS[i]);
  }

  // Contextual note generators per land story archetype
  function harvestNote(
    def: LandDefinition,
    year: number,
    sessionIndex: number,
    totalSessions: number,
    annualYieldKg: number,
    multiplier: number
  ): string {
    const phase =
      sessionIndex <= 2 ? "awal panen" :
        sessionIndex <= totalSessions - 2 ? "puncak panen" : "akhir panen";

    const quality =
      multiplier >= 1.15 ? "Kualitas cherry sangat baik, biji penuh dan merah merata." :
        multiplier >= 0.90 ? "Kualitas cherry baik, kadar air normal." :
          multiplier >= 0.60 ? "Kualitas cherry cukup, beberapa biji kurang matang sempurna." :
            "Kualitas cherry di bawah standar, banyak biji keriput.";

    return (
      `Panen sesi ke-${sessionIndex} dari ${totalSessions} sesi musim ${year} (${phase}). ` +
      `${quality} ` +
      `Estimasi hasil tahunan: ${annualYieldKg.toFixed(0)} kg cherry basah. ` +
      `Catatan lahan: ${def.story}.`
    );
  }

  for (let li = 0; li < lands.length; li++) {
    const land = lands[li];
    const def = LAND_DEFINITIONS[li];

    // Base yield: 0.3–0.5 kg/m² — fixed per land for consistency
    const baseYieldPerM2 = 0.30 + (li * 0.05); // gives each land a slightly different base
    const baseAnnualYield = land.areaSize * baseYieldPerM2;

    for (const year of HARVEST_YEARS) {
      // Use the land's story-driven multiplier + small biological noise (±5%)
      const storyMultiplier = def.yieldProfile[year] ?? 1.0;
      const noise = 1 + (Math.random() * 0.1 - 0.05);
      const annualYieldKg = parseFloat((baseAnnualYield * storyMultiplier * noise).toFixed(2));

      const sessions = generateSeasonHarvests(year, annualYieldKg);

      for (const session of sessions) {
        // Skip anything beyond May 10 2026
        if (session.date > HARVEST_CUTOFF) continue;

        await prisma.harvest.create({
          data: {
            harvestDate: session.date,
            totalWeight: session.weight,
            variety: "Robusta",
            notes: harvestNote(
              def, year,
              session.sessionIndex, session.totalSessions,
              annualYieldKg, storyMultiplier
            ),
            landId: land.id,
          },
        });
        harvestTotal++;
      }
    }
  }
  console.log(`   ✅ ${harvestTotal} harvest records created (2022–2026, cutoff May 10 2026).\n`);

  // ── 6.10  Tasks ───────────────────────────────────────────────────────────
  console.log("✅ Creating Tasks...");
  let taskTotal = 0;

  for (const land of lands) {
    const mandor = mandors.find((m) => m.id === land.mandorId)!;
    const tasksPerLand = 5;

    for (let tk = 0; tk < tasksPerLand; tk++) {
      const activityType = randomElement(Object.keys(TASK_TITLES));
      const titleOptions = TASK_TITLES[activityType] ?? [activityType];
      const title = randomElement(titleOptions);
      const status = randomElement(TASK_STATUSES);

      const dueDate = randomDate(new Date(), new Date(Date.now() + 30 * 86400_000));
      const startedAt =
        ["in_progress", "on_approval", "completed"].includes(status)
          ? randomDate(new Date("2025-01-01"), new Date())
          : null;
      const completedAt =
        status === "completed" && startedAt
          ? randomDate(startedAt, new Date())
          : null;
      const verifiedAt = null;   // not used in this status model
      const rejectionReason = null; // not used in this status model

      await prisma.task.create({
        data: {
          title,
          description:
            `${title} di ${land.landName}. ` +
            `Pastikan SOP dan standar keamanan kerja diikuti.`,
          activityType,
          status,
          dueDate,
          startedAt,
          completedAt,
          verifiedAt,
          rejectionReason,
          landId: land.id,
          mandorId: mandor.id,
        },
      });
      taskTotal++;
    }
  }
  console.log(`   ✅ ${taskTotal} tasks created.\n`);

  // ── 6.11  Summary ─────────────────────────────────────────────────────────
  const [
    userCount, landCount, plantCount,
    logCount, docCount, harvestCount, taskCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.land.count(),
    prisma.plant.count(),
    prisma.treatmentLog.count(),
    prisma.treatmentDocumentation.count(),
    prisma.harvest.count(),
    prisma.task.count(),
  ]);

  console.log("═".repeat(55));
  console.log("🎉  SEED COMPLETE — Database Summary");
  console.log("═".repeat(55));
  console.log(`   Users                   : ${userCount}  (1 owner + 5 mandors)`);
  console.log(`   Lands                   : ${landCount}`);
  console.log(`   Plants                  : ${plantCount}  (2.5 m grid)`);
  console.log(`   Treatment Logs          : ${logCount}`);
  console.log(`   Treatment Documentation : ${docCount}`);
  console.log(`   Harvests                : ${harvestCount}`);
  console.log(`   Tasks                   : ${taskCount}`);
  console.log("═".repeat(55));
  console.log("\n📌 Login credentials:");
  console.log("   Owner   → username: owner_budi     | password: password123");
  console.log("   Mandors → username: mandor_ahmad … | password: password123");
  console.log();
}

// ---------------------------------------------------------------------------
// 7. ENTRY POINT
// ---------------------------------------------------------------------------

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });