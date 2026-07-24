import { useMemo } from 'react';
import './Barcode.css';

// ── Types ───────────────────────────────────────────────────────────────────

export type BarcodeFormat = 'code128' | 'upc-a' | 'ean-13';

export interface BarcodeProps {
  /** Data to encode. */
  value: string;
  /** Barcode format to generate. */
  format?: BarcodeFormat;
  /** Barcode width in pixels. */
  width?: number;
  /** Barcode height in pixels. */
  height?: number;
  /** Display the value text below barcode. */
  showText?: boolean;
  /** Bar color. Defaults to the current theme text color when empty. */
  color?: string;
  /** Background color (unused — kept for API parity). */
  background?: string;
  /** Show border around barcode. */
  bordered?: boolean;
  /** Additional CSS class name(s). */
  className?: string;
}

export interface QrCodeProps {
  /** Data to encode. */
  value: string;
  /** QR code size in pixels. */
  size?: number;
  /** Foreground color. Defaults to the current theme text color when empty. */
  color?: string;
  /** Background color. Defaults to the current theme surface color when empty. */
  background?: string;
  /** Error correction level (only M is used internally). */
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  /** Additional CSS class name(s). */
  className?: string;
}

// ── Code 128 encoding tables ────────────────────────────────────────────────

const CODE128_PATTERNS: number[][] = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1,2],
];

const STOP_CODE = 106;
const START_CODE_B = 104;
const QUIET_ZONE_MODULES = 10;

const EAN_L_PATTERNS = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const EAN_G_PATTERNS = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const EAN_R_PATTERNS = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const EAN13_PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

// ── Encoding functions ──────────────────────────────────────────────────────

function encodeCode128B(text: string): number[] {
  const codes: number[] = [START_CODE_B];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code < 0 || code > 94) {
      codes.push(0); // substitute space for unsupported chars
    } else {
      codes.push(code);
    }
  }
  // Checksum
  let checksum = codes[0];
  for (let i = 1; i < codes.length; i++) {
    checksum += codes[i] * i;
  }
  codes.push(checksum % 103);
  codes.push(STOP_CODE);
  return codes;
}

function codesToBars(codes: number[]): boolean[] {
  const bars: boolean[] = [];
  for (const code of codes) {
    const pattern = CODE128_PATTERNS[code];
    for (let i = 0; i < pattern.length; i++) {
      const width = pattern[i];
      const isBar = i % 2 === 0;
      for (let w = 0; w < width; w++) {
        bars.push(isBar);
      }
    }
  }
  return bars;
}

function digitsOnly(text: string): string {
  return text.replace(/\D/g, '');
}

function computeEanCheckDigit(base12: string): number {
  let sum = 0;
  for (let i = 0; i < base12.length; i++) {
    const digit = Number(base12[i]);
    const position = i + 1;
    sum += position % 2 === 0 ? digit * 3 : digit;
  }
  return (10 - (sum % 10)) % 10;
}

function normalizeEan13(text: string): string | null {
  const digits = digitsOnly(text);
  if (digits.length === 12) {
    return `${digits}${computeEanCheckDigit(digits)}`;
  }
  if (digits.length === 13) {
    const base = digits.slice(0, 12);
    const expected = computeEanCheckDigit(base);
    return expected === Number(digits[12]) ? digits : null;
  }
  return null;
}

function normalizeUpcA(text: string): string | null {
  const digits = digitsOnly(text);
  if (digits.length === 11) {
    const check = computeEanCheckDigit(`0${digits}`);
    return `${digits}${check}`;
  }
  if (digits.length === 12) {
    const base = digits.slice(0, 11);
    const expected = computeEanCheckDigit(`0${base}`);
    return expected === Number(digits[11]) ? digits : null;
  }
  return null;
}

function encodeEan13(ean13: string): boolean[] {
  const bits: boolean[] = [];
  const pushPattern = (pattern: string): void => {
    for (let i = 0; i < pattern.length; i++) {
      bits.push(pattern[i] === '1');
    }
  };

  const first = Number(ean13[0]);
  const parityPattern = EAN13_PARITY[first];

  pushPattern('101');

  for (let i = 1; i <= 6; i++) {
    const digit = Number(ean13[i]);
    const parity = parityPattern[i - 1];
    pushPattern(parity === 'L' ? EAN_L_PATTERNS[digit] : EAN_G_PATTERNS[digit]);
  }

  pushPattern('01010');

  for (let i = 7; i <= 12; i++) {
    const digit = Number(ean13[i]);
    pushPattern(EAN_R_PATTERNS[digit]);
  }

  pushPattern('101');

  return bits;
}

function encodeByFormat(format: BarcodeFormat, text: string): { bars: boolean[]; displayValue: string } | null {
  if (!text) return null;

  if (format === 'code128') {
    return {
      bars: codesToBars(encodeCode128B(text)),
      displayValue: text,
    };
  }

  if (format === 'upc-a') {
    const normalized = normalizeUpcA(text);
    if (!normalized) return null;
    return {
      bars: encodeEan13(`0${normalized}`),
      displayValue: normalized,
    };
  }

  const normalized = normalizeEan13(text);
  if (!normalized) return null;
  return {
    bars: encodeEan13(normalized),
    displayValue: normalized,
  };
}

// ── GF(256) arithmetic for Reed-Solomon ─────────────────────────────────────

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let v = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = v;
    GF_LOG[v] = i;
    v <<= 1;
    if (v >= 256) v ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGenPoly(nsym: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < nsym; i++) {
    const ng = new Uint8Array(g.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < g.length; j++) {
      ng[j] ^= g[j];
      ng[j + 1] ^= gfMul(g[j], factor);
    }
    g = ng;
  }
  return g;
}

function rsEncode(data: Uint8Array, nsym: number): Uint8Array {
  const gen = rsGenPoly(nsym);
  const out = new Uint8Array(data.length + nsym);
  out.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = out[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        out[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return out.subarray(data.length);
}

// ── QR version/EC tables ────────────────────────────────────────────────────
// [totalDataCodewords, ecCodewordsPerBlock, numBlocks] for EC level M, versions 1-6
const VERSION_TABLE: [number, number, number][] = [
  [16, 10, 1],   // v1-M
  [28, 16, 1],   // v2-M
  [44, 26, 1],   // v3-M
  [64, 18, 2],   // v4-M
  [86, 24, 2],   // v5-M
  [108, 16, 4],  // v6-M
];

const ALIGNMENT_POSITIONS: number[][] = [
  [],       // v1
  [6, 18],  // v2
  [6, 22],  // v3
  [6, 26],  // v4
  [6, 30],  // v5
  [6, 34],  // v6
];

// Format info bits for EC level M (00) with mask patterns 0-7
const FORMAT_BITS: number[] = [
  0x5412, 0x5125, 0x5E7C, 0x5B4B,
  0x45F9, 0x40CE, 0x4F97, 0x4AA0,
];

function qrMatrixSize(version: number): number {
  return 17 + version * 4;
}

// ── Data encoding (byte mode) ───────────────────────────────────────────────

function encodeQrData(text: string, version: number): Uint8Array {
  const vInfo = VERSION_TABLE[version - 1];
  const totalData = vInfo[0];
  const bytes = new TextEncoder().encode(text);
  const bits: number[] = [];

  // Mode indicator: byte mode = 0100
  bits.push(0, 1, 0, 0);

  // Character count (8 bits for v1-9)
  const count = bytes.length;
  for (let i = 7; i >= 0; i--) bits.push((count >> i) & 1);

  // Data
  for (const b of bytes) {
    for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  }

  // Terminator (up to 4 bits)
  const maxBits = totalData * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);

  // Pad codewords
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    const pb = padBytes[padIdx % 2];
    for (let i = 7; i >= 0; i--) bits.push((pb >> i) & 1);
    padIdx++;
  }

  const codewords = new Uint8Array(totalData);
  for (let i = 0; i < totalData; i++) {
    let val = 0;
    for (let b = 0; b < 8; b++) val = (val << 1) | (bits[i * 8 + b] || 0);
    codewords[i] = val;
  }

  return codewords;
}

// ── Interleave blocks + EC ──────────────────────────────────────────────────

function addErrorCorrection(data: Uint8Array, version: number): Uint8Array {
  const vInfo = VERSION_TABLE[version - 1];
  const [totalData, ecPerBlock, numBlocks] = vInfo;
  const dataPerBlock = Math.floor(totalData / numBlocks);
  const extraBlocks = totalData - dataPerBlock * numBlocks;

  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let i = 0; i < numBlocks; i++) {
    const blockLen = dataPerBlock + (i >= numBlocks - extraBlocks ? 1 : 0);
    const block = data.subarray(offset, offset + blockLen);
    offset += blockLen;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, ecPerBlock));
  }

  // Interleave data
  const result: number[] = [];
  const maxDataLen = Math.max(...dataBlocks.map(b => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }
  // Interleave EC
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }

  return new Uint8Array(result);
}

// ── Matrix placement ────────────────────────────────────────────────────────

type Matrix = (boolean | null)[][];

function createMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function placeFinderPattern(m: Matrix, row: number, col: number): void {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const mr = row + r, mc = col + c;
      if (mr < 0 || mr >= m.length || mc < 0 || mc >= m.length) continue;
      if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
        m[mr][mc] =
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else {
        m[mr][mc] = false;
      }
    }
  }
}

function placeAlignmentPattern(m: Matrix, row: number, col: number): void {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      m[row + r][col + c] =
        Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
    }
  }
}

function placeTimingPatterns(m: Matrix): void {
  const size = m.length;
  for (let i = 8; i < size - 8; i++) {
    if (m[6][i] === null) m[6][i] = i % 2 === 0;
    if (m[i][6] === null) m[i][6] = i % 2 === 0;
  }
}

function reserveFormatArea(m: Matrix): void {
  const size = m.length;
  for (let i = 0; i < 8; i++) {
    if (m[8][i] === null) m[8][i] = false;
    if (m[i][8] === null) m[i][8] = false;
    if (m[8][size - 1 - i] === null) m[8][size - 1 - i] = false;
    if (m[size - 1 - i][8] === null) m[size - 1 - i][8] = false;
  }
  if (m[8][8] === null) m[8][8] = false;
  // Dark module
  m[size - 8][8] = true;
}

function placeQrData(m: Matrix, data: Uint8Array): void {
  const size = m.length;
  const bits: number[] = [];
  for (const byte of data) {
    for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
  }

  let bitIdx = 0;
  let upward = true;

  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    const rowRange = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const row of rowRange) {
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (c < 0 || c >= size) continue;
        if (m[row][c] !== null) continue;
        m[row][c] = bitIdx < bits.length ? bits[bitIdx++] === 1 : false;
      }
    }
    upward = !upward;
  }
}

// ── Masking ─────────────────────────────────────────────────────────────────

type MaskFn = (row: number, col: number) => boolean;

const MASK_FUNCTIONS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function isFinderOverlap(r: number, c: number, size: number): boolean {
  return (r <= 8 && c <= 8) || (r <= 8 && c >= size - 8) || (r >= size - 8 && c <= 8);
}

function getReservedMask(m: Matrix, version: number): boolean[][] {
  const size = m.length;
  const reserved = Array.from({ length: size }, () => Array<boolean>(size).fill(false));

  // Finder patterns + separators
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) reserved[r][c] = true;
  for (let r = 0; r < 9; r++) for (let c = size - 8; c < size; c++) reserved[r][c] = true;
  for (let r = size - 8; r < size; r++) for (let c = 0; c < 9; c++) reserved[r][c] = true;

  // Timing
  for (let i = 0; i < size; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
  }

  // Alignment
  const ap = ALIGNMENT_POSITIONS[version - 1];
  if (ap.length > 1) {
    for (const ar of ap) {
      for (const ac of ap) {
        if (reserved[ar]?.[ac] !== undefined && !isFinderOverlap(ar, ac, size)) {
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              reserved[ar + dr][ac + dc] = true;
            }
          }
        }
      }
    }
  }

  // Dark module
  reserved[size - 8][8] = true;

  return reserved;
}

function applyMask(m: Matrix, reserved: boolean[][], maskIdx: number): Matrix {
  const size = m.length;
  const masked = m.map(row => [...row]);
  const fn = MASK_FUNCTIONS[maskIdx];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && fn(r, c)) {
        masked[r][c] = !masked[r][c];
      }
    }
  }
  return masked;
}

function writeFormatInfo(m: Matrix, maskIdx: number): void {
  const size = m.length;
  const bits = FORMAT_BITS[maskIdx];

  // Horizontal: left of top-right finder
  for (let i = 0; i < 8; i++) {
    m[8][size - 1 - i] = ((bits >> i) & 1) === 1;
  }
  // Horizontal around top-left finder
  const hPositions = [0, 1, 2, 3, 4, 5, 7, 8];
  for (let i = 0; i < 8; i++) {
    m[8][hPositions[i]] = ((bits >> (14 - i)) & 1) === 1;
  }

  // Vertical around top-left finder
  const vPositions = [0, 1, 2, 3, 4, 5, 7, 8];
  for (let i = 0; i < 8; i++) {
    m[vPositions[i]][8] = ((bits >> i) & 1) === 1;
  }
  // Vertical: bottom-left
  for (let i = 0; i < 7; i++) {
    m[size - 7 + i][8] = ((bits >> (14 - i)) & 1) === 1;
  }
}

// ── Penalty scoring ─────────────────────────────────────────────────────────

function penaltyScore(m: Matrix): number {
  const size = m.length;
  let score = 0;

  // Rule 1: consecutive same-color in row/col
  for (let r = 0; r < size; r++) {
    let run = 1;
    for (let c = 1; c < size; c++) {
      if (m[r][c] === m[r][c - 1]) { run++; } else { if (run >= 5) score += run - 2; run = 1; }
    }
    if (run >= 5) score += run - 2;
  }
  for (let c = 0; c < size; c++) {
    let run = 1;
    for (let r = 1; r < size; r++) {
      if (m[r][c] === m[r - 1][c]) { run++; } else { if (run >= 5) score += run - 2; run = 1; }
    }
    if (run >= 5) score += run - 2;
  }

  // Rule 2: 2x2 blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
    }
  }

  // Rule 3: finder-like pattern
  const pat1 = [true, false, true, true, true, false, true, false, false, false, false];
  const pat2 = [...pat1].reverse();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      let match1 = true, match2 = true;
      for (let i = 0; i < 11; i++) {
        if (m[r][c + i] !== pat1[i]) match1 = false;
        if (m[r][c + i] !== pat2[i]) match2 = false;
      }
      if (match1 || match2) score += 40;
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 11; r++) {
      let match1 = true, match2 = true;
      for (let i = 0; i < 11; i++) {
        if (m[r + i][c] !== pat1[i]) match1 = false;
        if (m[r + i][c] !== pat2[i]) match2 = false;
      }
      if (match1 || match2) score += 40;
    }
  }

  // Rule 4: proportion of dark modules
  let dark = 0;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (m[r][c]) dark++;
  const pct = (dark * 100) / (size * size);
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = prev5 + 5;
  score += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10;

  return score;
}

// ── Main QR generation ──────────────────────────────────────────────────────

function generateQR(text: string): boolean[][] | null {
  if (!text) return null;

  const byteLen = new TextEncoder().encode(text).length;

  // Find smallest version that fits
  let version = 0;
  for (let v = 1; v <= 6; v++) {
    const capacity = VERSION_TABLE[v - 1][0] - 3; // minus mode + count overhead
    if (byteLen <= capacity) { version = v; break; }
  }
  if (version === 0) return null; // too long

  const size = qrMatrixSize(version);
  const m = createMatrix(size);

  // Place function patterns
  placeFinderPattern(m, 0, 0);
  placeFinderPattern(m, 0, size - 7);
  placeFinderPattern(m, size - 7, 0);

  const ap = ALIGNMENT_POSITIONS[version - 1];
  if (ap.length > 1) {
    for (const ar of ap) {
      for (const ac of ap) {
        if (!isFinderOverlap(ar, ac, size)) {
          placeAlignmentPattern(m, ar, ac);
        }
      }
    }
  }

  placeTimingPatterns(m);
  reserveFormatArea(m);

  // Encode & place data
  const encodedData = encodeQrData(text, version);
  const finalData = addErrorCorrection(encodedData, version);
  placeQrData(m, finalData);

  // Try all masks, pick lowest penalty
  const reserved = getReservedMask(m, version);
  let bestMask = 0;
  let bestScore = Infinity;

  for (let maskIdx = 0; maskIdx < 8; maskIdx++) {
    const masked = applyMask(m, reserved, maskIdx);
    writeFormatInfo(masked, maskIdx);
    const s = penaltyScore(masked);
    if (s < bestScore) { bestScore = s; bestMask = maskIdx; }
  }

  const final = applyMask(m, reserved, bestMask);
  writeFormatInfo(final, bestMask);

  return final.map(row => row.map(cell => cell === true));
}

// ── Barcode Component ───────────────────────────────────────────────────────

export function Barcode({
  value,
  format = 'code128',
  width = 200,
  height = 60,
  showText = true,
  color = '',
  bordered = false,
  className = '',
}: BarcodeProps) {
  const encoded = useMemo(() => encodeByFormat(format, value), [format, value]);
  const displayValue = encoded?.displayValue ?? value;

  const svgData = useMemo(() => {
    if (!encoded) return { modules: [] as { x: number; w: number }[], viewBox: '0 0 0 0', barHeight: 0 };

    const bars = encoded.bars;
    const totalModules = bars.length + QUIET_ZONE_MODULES * 2;
    const barHeight = 100;
    const modules: { x: number; w: number }[] = [];

    let i = 0;
    while (i < bars.length) {
      const on = bars[i];
      let w = 1;
      while (i + w < bars.length && bars[i + w] === on) w++;
      if (on) {
        modules.push({ x: QUIET_ZONE_MODULES + i, w });
      }
      i += w;
    }

    return {
      modules,
      viewBox: `0 0 ${totalModules} ${barHeight}`,
      barHeight,
    };
  }, [encoded]);

  if (!svgData.modules.length) return null;

  const classes = [
    'sp-barcode',
    bordered && 'sp-barcode--bordered',
    className,
  ].filter(Boolean).join(' ');

  return (
    <figure
      className={classes}
      role="img"
      aria-label={`Barcode (${format}): ${displayValue}`}
    >
      <svg
        width={width}
        height={height}
        viewBox={svgData.viewBox}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {svgData.modules.map((bar, idx) => (
          <rect
            key={idx}
            className="sp-barcode__bar"
            x={bar.x}
            y={0}
            width={bar.w}
            height={svgData.barHeight}
            style={color ? { fill: color } : undefined}
          />
        ))}
      </svg>
      {showText && (
        <figcaption className="sp-barcode__label">{displayValue}</figcaption>
      )}
    </figure>
  );
}

// ── QrCode Component ────────────────────────────────────────────────────────

const QR_QUIET_ZONE = 4;

export function QrCode({
  value,
  size = 200,
  color = '',
  background = '',
  className = '',
}: QrCodeProps) {
  const modules = useMemo(() => generateQR(value), [value]);

  const svgSize = useMemo(() => {
    if (!modules) return 0;
    return modules.length + QR_QUIET_ZONE * 2;
  }, [modules]);

  const viewBox = `0 0 ${svgSize} ${svgSize}`;

  if (!modules) return null;

  return (
    <figure
      className={`sp-qrcode ${className}`.trim()}
      role="img"
      aria-label={`QR Code: ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className="sp-qrcode__bg"
          x={0}
          y={0}
          width={svgSize}
          height={svgSize}
          style={background ? { fill: background } : undefined}
        />
        {modules.map((row, r) =>
          row.map(
            (cell, c) =>
              cell && (
                <rect
                  key={`${r}-${c}`}
                  className="sp-qrcode__module"
                  x={c + QR_QUIET_ZONE}
                  y={r + QR_QUIET_ZONE}
                  width={1}
                  height={1}
                  style={color ? { fill: color } : undefined}
                />
              ),
          ),
        )}
      </svg>
    </figure>
  );
}
