import { round, floor } from "mathjs";
export function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

export function vnd(num) {
  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function chi(_val) {
  const val = round(_val, 1);
  if (val < 10) return `${round(val / 10, 3)} ly`;
  if (val < 100 && val > 10) return `${floor(val / 10)}p${round((val - 10 * floor(val / 10))*10)}`;
  return `${floor(val / 100)}c${round((val - 100 * floor(val / 100))*10)}`;
}
