import type { PaymentMethod } from "./types";

// Metadata for each digital collection channel — label, lucide icon, short blurb.
export const PAYMENT_METHOD_META: Record<
  PaymentMethod,
  { label: string; icon: string; sub: string }
> = {
  credit: { label: "כרטיס אשראי", icon: "CreditCard", sub: "תשלום מיידי ומאובטח" },
  standing_order: { label: "הוראת קבע", icon: "CalendarClock", sub: "חיוב חודשי אוטומטי" },
  check: { label: "צ׳ק דיגיטלי", icon: "ScrollText", sub: "העברת צ׳ק מקוון" },
  bank_transfer: { label: "העברה בנקאית", icon: "Landmark", sub: "העברה לחשבון הוועד" },
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  "credit",
  "standing_order",
  "check",
  "bank_transfer",
];

export function paymentMethodLabel(method?: string): string {
  if (method && method in PAYMENT_METHOD_META) {
    return PAYMENT_METHOD_META[method as PaymentMethod].label;
  }
  return method ?? "כרטיס אשראי";
}
