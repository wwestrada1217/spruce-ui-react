/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
  /** Angular-parity alias for showText. */
  showValue?: boolean;
  /** Bar color. Defaults to the current theme text color when empty. */
  color?: string;
  /** Angular-parity alias for color. */
  barColor?: string;
  /** Background color (unused — kept for API parity). */
  background?: string;
  /** Show border around barcode. */
  bordered?: boolean;
  /** Additional CSS class name(s). */
  className?: string;
}

export type QrCodeEcLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrCodeProps {
  /** Data to encode. */
  value?: string;
  /** QR code size in pixels. */
  size?: number;
  /** Foreground color. Defaults to the current theme text color when empty. */
  color?: string;
  /** Foreground color, aligned with the Angular API. */
  fgColor?: string;
  /** Background color. Defaults to the current theme surface color when empty. */
  background?: string;
  /** Background color, aligned with the Angular API. */
  bgColor?: string;
  /** Error correction level. */
  errorCorrection?: QrCodeEcLevel;
  /** Error correction level, aligned with the Angular API. */
  ecLevel?: QrCodeEcLevel;
  /** Enable versions 1–40 instead of the compact 1–6 range. */
  highCapacity?: boolean;
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
// Each entry is [ecPerBlock, group1Blocks, group1Data, group2Blocks, group2Data].
// The table is the ISO/IEC 18004 byte-mode capacity table used by Angular.
type QrEcEntry = readonly [number, number, number, number, number];

const QR_EC_TABLE: Record<QrCodeEcLevel, readonly QrEcEntry[]> = {
  L: [[7,1,19,0,0],[10,1,34,0,0],[15,1,55,0,0],[20,1,80,0,0],[26,1,108,0,0],[18,2,68,0,0],[20,2,78,0,0],[24,2,97,0,0],[30,2,116,0,0],[18,2,68,2,69],[20,4,81,0,0],[24,2,92,2,93],[26,4,107,0,0],[30,3,115,1,116],[22,5,87,1,88],[24,5,98,1,99],[28,1,107,5,108],[30,5,120,1,121],[28,3,113,4,114],[28,3,107,5,108],[28,4,116,4,117],[28,2,111,7,112],[30,4,121,5,122],[30,6,117,4,118],[26,8,106,4,107],[28,10,114,2,115],[30,8,122,4,123],[30,3,117,10,118],[30,7,116,7,117],[30,5,115,10,116],[30,13,115,3,116],[30,17,115,0,0],[30,17,115,1,116],[30,13,115,6,116],[30,12,121,7,122],[30,6,121,14,122],[30,17,122,4,123],[30,4,122,18,123],[30,20,117,4,118],[30,19,118,6,119]],
  M: [[10,1,16,0,0],[16,1,28,0,0],[26,1,44,0,0],[18,2,32,0,0],[24,2,43,0,0],[16,4,27,0,0],[18,4,31,0,0],[22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44],[30,1,50,4,51],[22,6,36,2,37],[22,8,37,1,38],[24,4,40,5,41],[24,5,41,5,42],[28,7,45,3,46],[28,10,46,1,47],[26,9,43,4,44],[26,3,44,11,45],[26,3,41,13,42],[26,17,42,0,0],[28,17,46,0,0],[28,4,47,14,48],[28,6,45,14,46],[28,8,47,13,48],[28,19,46,4,47],[28,22,45,3,46],[28,3,45,23,46],[28,21,45,7,46],[28,19,47,10,48],[28,2,46,29,47],[28,10,46,23,47],[28,14,46,21,47],[28,14,46,23,47],[28,12,47,26,48],[28,6,47,34,48],[28,29,46,14,47],[28,13,46,32,47],[28,40,47,7,48],[28,18,47,31,48]],
  Q: [[13,1,13,0,0],[22,1,22,0,0],[18,2,17,0,0],[26,2,24,0,0],[18,2,15,2,16],[24,4,19,0,0],[18,2,14,4,15],[22,4,18,2,19],[20,4,16,4,17],[24,6,19,2,20],[28,4,22,4,23],[26,4,20,6,21],[24,8,20,4,21],[20,11,16,5,17],[30,5,24,7,25],[24,15,19,2,20],[28,1,22,15,23],[28,17,22,1,23],[26,17,21,4,22],[30,15,24,5,25],[28,17,22,6,23],[30,7,24,16,25],[30,11,24,14,25],[30,11,24,16,25],[30,7,24,22,25],[28,28,22,6,23],[30,8,23,26,24],[30,4,24,31,25],[30,1,23,37,24],[30,15,24,25,25],[30,42,24,1,25],[30,10,24,35,25],[30,29,24,19,25],[30,44,24,7,25],[30,39,24,14,25],[30,46,24,10,25],[30,49,24,10,25],[30,48,24,14,25],[30,43,24,22,25],[30,34,24,34,25]],
  H: [[17,1,9,0,0],[28,1,16,0,0],[22,2,13,0,0],[16,4,9,0,0],[22,2,11,2,12],[28,4,15,0,0],[26,4,13,1,14],[26,4,14,2,15],[24,4,12,4,13],[28,6,15,2,16],[24,3,12,8,13],[28,7,14,4,15],[22,12,11,4,12],[24,11,12,5,13],[24,11,12,7,13],[30,3,15,13,16],[28,2,14,17,15],[28,2,14,19,15],[26,9,13,16,14],[28,15,15,10,16],[30,19,16,6,17],[24,34,13,0,0],[30,16,15,14,16],[30,30,16,2,17],[30,22,15,13,16],[30,33,16,4,17],[30,12,15,28,16],[30,11,15,31,16],[30,19,15,26,16],[30,23,15,25,16],[30,23,15,28,16],[30,19,15,35,16],[30,11,15,46,16],[30,59,16,1,17],[30,22,15,41,16],[30,2,15,64,16],[30,24,15,46,16],[30,42,15,32,16],[30,10,15,67,16],[30,20,15,61,16]],
};

const ALIGNMENT_POSITIONS: readonly number[][] = [
  [],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170],
];

const FORMAT_BITS: Record<QrCodeEcLevel, readonly number[]> = {
  L: [0x77c4,0x72f3,0x7daa,0x789d,0x662f,0x6318,0x6c41,0x6976],
  M: [0x5412,0x5125,0x5e7c,0x5b4b,0x45f9,0x40ce,0x4f97,0x4aa0],
  Q: [0x355f,0x3068,0x3f31,0x3a06,0x24b4,0x2183,0x2eda,0x2bed],
  H: [0x1689,0x13be,0x1ce7,0x19d0,0x0762,0x0255,0x0d0c,0x083b],
};

const VERSION_BITS: readonly number[] = [0x07c94,0x085bc,0x09a99,0x0a4d3,0x0bbf6,0x0c762,0x0d847,0x0e60d,0x0f928,0x10b78,0x1145d,0x12a17,0x13532,0x149a6,0x15683,0x168c9,0x177ec,0x18ec4,0x191e1,0x1afab,0x1b08e,0x1cc1a,0x1d33f,0x1ed75,0x1f250,0x209d5,0x216f0,0x228ba,0x2379f,0x24b0b,0x2542e,0x26a64,0x27541,0x28c69];

function qrMatrixSize(version: number): number {
  return 17 + version * 4;
}

// ── Data encoding (byte mode) ───────────────────────────────────────────────

function totalDataCodewords(version: number, ecLevel: QrCodeEcLevel): number {
  const [, group1Blocks, group1Data, group2Blocks, group2Data] = QR_EC_TABLE[ecLevel][version - 1];
  return group1Blocks * group1Data + group2Blocks * group2Data;
}

function encodeQrData(text: string, version: number, ecLevel: QrCodeEcLevel): Uint8Array {
  const totalData = totalDataCodewords(version, ecLevel);
  const bytes = new TextEncoder().encode(text);
  const bits: number[] = [];

  // Mode indicator: byte mode = 0100
  bits.push(0, 1, 0, 0);

  // Character count (8 bits for v1-9, 16 bits for v10-40)
  const count = bytes.length;
  const countBits = version <= 9 ? 8 : 16;
  for (let i = countBits - 1; i >= 0; i--) bits.push((count >> i) & 1);

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

function addErrorCorrection(data: Uint8Array, version: number, ecLevel: QrCodeEcLevel): Uint8Array {
  const [ecPerBlock, group1Blocks, group1Data, group2Blocks, group2Data] = QR_EC_TABLE[ecLevel][version - 1];
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let i = 0; i < group1Blocks; i++) {
    const block = data.subarray(offset, offset + group1Data);
    offset += group1Data;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, ecPerBlock));
  }
  for (let i = 0; i < group2Blocks; i++) {
    const block = data.subarray(offset, offset + group2Data);
    offset += group2Data;
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
    for (const block of ecBlocks) result.push(block[i]);
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

function reserveVersionArea(m: Matrix, version: number): void {
  if (version < 7) return;
  const size = m.length;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      if (m[i][size - 11 + j] === null) m[i][size - 11 + j] = false;
      if (m[size - 11 + j][i] === null) m[size - 11 + j][i] = false;
    }
  }
}

function writeVersionInfo(m: Matrix, version: number): void {
  if (version < 7) return;
  const size = m.length;
  const bits = VERSION_BITS[version - 7];
  for (let k = 0; k < 18; k++) {
    const bit = ((bits >> k) & 1) === 1;
    const r = Math.floor(k / 3);
    const c = k % 3;
    m[size - 11 + c][r] = bit;
    m[r][size - 11 + c] = bit;
  }
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

  if (version >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        reserved[i][size - 11 + j] = true;
        reserved[size - 11 + j][i] = true;
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

function writeFormatInfo(m: Matrix, ecLevel: QrCodeEcLevel, maskIdx: number): void {
  const size = m.length;
  const bits = FORMAT_BITS[ecLevel][maskIdx];

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

function qrByteCapacity(version: number, ecLevel: QrCodeEcLevel): number {
  const totalData = totalDataCodewords(version, ecLevel);
  return totalData - Math.ceil((4 + (version <= 9 ? 8 : 16)) / 8);
}

function generateQR(text: string, ecLevel: QrCodeEcLevel, maxVersion: number): boolean[][] | null {
  if (!text) return null;

  const byteLen = new TextEncoder().encode(text).length;

  // Find the smallest version that fits at the requested EC level.
  let version = 0;
  for (let v = 1; v <= maxVersion; v++) {
    if (byteLen <= qrByteCapacity(v, ecLevel)) { version = v; break; }
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
  reserveVersionArea(m, version);

  // Encode & place data
  const encodedData = encodeQrData(text, version, ecLevel);
  const finalData = addErrorCorrection(encodedData, version, ecLevel);
  placeQrData(m, finalData);

  // Try all masks, pick lowest penalty
  const reserved = getReservedMask(m, version);
  let bestMask = 0;
  let bestScore = Infinity;

  for (let maskIdx = 0; maskIdx < 8; maskIdx++) {
    const masked = applyMask(m, reserved, maskIdx);
    writeFormatInfo(masked, ecLevel, maskIdx);
    writeVersionInfo(masked, version);
    const s = penaltyScore(masked);
    if (s < bestScore) { bestScore = s; bestMask = maskIdx; }
  }

  const final = applyMask(m, reserved, bestMask);
  writeFormatInfo(final, ecLevel, bestMask);
  writeVersionInfo(final, version);

  return final.map(row => row.map(cell => cell === true));
}

// ── Barcode Component ───────────────────────────────────────────────────────

export function Barcode({
  value,
  format = 'code128',
  width = 200,
  height = 60,
  showText = true,
  showValue,
  color = '',
  barColor,
  bordered = false,
  className = '',
}: BarcodeProps) {
  const encoded = useMemo(() => encodeByFormat(format, value), [format, value]);
  const displayValue = encoded?.displayValue ?? value;
  const resolvedShowValue = showValue ?? showText;
  const resolvedBarColor = barColor || color;

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
            style={resolvedBarColor ? { fill: resolvedBarColor } : undefined}
          />
        ))}
      </svg>
      {resolvedShowValue && (
        <figcaption className="sp-barcode__label">{displayValue}</figcaption>
      )}
    </figure>
  );
}

// ── QrCode Component ────────────────────────────────────────────────────────

const QR_QUIET_ZONE = 4;

export function QrCode({
  value = '',
  size = 200,
  color = '',
  fgColor,
  background = '',
  bgColor,
  errorCorrection = 'M',
  ecLevel,
  highCapacity = false,
  className = '',
}: QrCodeProps) {
  const resolvedEcLevel = ecLevel ?? errorCorrection;
  const resolvedFgColor = fgColor || color;
  const resolvedBgColor = bgColor || background;
  const modules = useMemo(
    () => generateQR(value, resolvedEcLevel, highCapacity ? 40 : 6),
    [highCapacity, resolvedEcLevel, value],
  );

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
          style={resolvedBgColor ? { fill: resolvedBgColor } : undefined}
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
                  style={resolvedFgColor ? { fill: resolvedFgColor } : undefined}
                />
              ),
          ),
        )}
      </svg>
    </figure>
  );
}
