import type { CurrencyIso4217 } from "../types";

export type MoneyFormatter = (x: number) => string;

export const buildFormatMoney = (c: CurrencyIso4217): MoneyFormatter => {
  const money = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: c,
    currencyDisplay: 'narrowSymbol',
  });
  return (x) => money.format(x);
};
