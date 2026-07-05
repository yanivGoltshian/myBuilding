// Finance aggregation helpers shared by tenant transparency + management dashboards.
import type { Ledger, Payment } from "./types";
import { periodLabel } from "./format";

export function totals(ledger: Ledger[]) {
  let income = 0;
  let expense = 0;
  for (const l of ledger) {
    if (l.kind === "income") income += l.amount;
    else expense += l.amount;
  }
  return { income, expense, net: income - expense };
}

export function balance(ledger: Ledger[]): number {
  return totals(ledger).net;
}

// Split expenses into current (falls on all residents incl. renters) vs capital (owners).
export function currentVsCapital(ledger: Ledger[]) {
  let current = 0;
  let capital = 0;
  for (const l of ledger) {
    if (l.kind !== "expense") continue;
    if (l.type === "capital") capital += l.amount;
    else current += l.amount;
  }
  return { current, capital, total: current + capital };
}

export function expenseByCategory(
  ledger: Ledger[]
): { category: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const l of ledger) {
    if (l.kind !== "expense") continue;
    map.set(l.category, (map.get(l.category) ?? 0) + l.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// Last N months income vs expense, oldest → newest.
export function monthlyFlow(
  ledger: Ledger[],
  months = 6
): { key: string; label: string; income: number; expense: number }[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const rows = keys.map((key) => ({
    key,
    label: periodLabel(key).split(" ")[0],
    income: 0,
    expense: 0,
  }));
  const idx = new Map(rows.map((r, i) => [r.key, i]));
  for (const l of ledger) {
    const k = l.date.slice(0, 7);
    const i = idx.get(k);
    if (i === undefined) continue;
    if (l.kind === "income") rows[i].income += l.amount;
    else rows[i].expense += l.amount;
  }
  return rows;
}

export const CATEGORY_COLORS = [
  "var(--brand)",
  "#0d9488",
  "#f79009",
  "#2e90fa",
  "#0ea5e9",
  "#6366f1",
  "#12b76a",
  "#f04438",
];

// Debts across a building, from payment rows.
export function debtsSummary(payments: Payment[]) {
  let overdueAmount = 0;
  let dueAmount = 0;
  let overdueCount = 0;
  let dueCount = 0;
  let collected = 0;
  for (const p of payments) {
    if (p.status === "overdue") {
      overdueAmount += p.amount;
      overdueCount++;
    } else if (p.status === "due") {
      dueAmount += p.amount;
      dueCount++;
    } else if (p.status === "paid") {
      collected += p.amount;
    }
  }
  return {
    overdueAmount,
    dueAmount,
    overdueCount,
    dueCount,
    collected,
    outstanding: overdueAmount + dueAmount,
  };
}

// Outstanding balance for a single unit.
export function unitBalance(payments: Payment[]): number {
  return payments
    .filter((p) => p.status !== "paid")
    .reduce((s, p) => s + p.amount, 0);
}

// Group unpaid payments by unit for the debts table.
export function debtorsByUnit(payments: Payment[]) {
  const map = new Map<string, { amount: number; months: number }>();
  for (const p of payments) {
    if (p.status === "paid") continue;
    const cur = map.get(p.unitId) ?? { amount: 0, months: 0 };
    cur.amount += p.amount;
    cur.months += 1;
    map.set(p.unitId, cur);
  }
  return map;
}
