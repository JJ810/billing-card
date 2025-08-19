export type BillingInterval = 'monthly' | 'annually';

/**
 * @pattern ^[A-Z]{3}$
 */
export type CurrencyIso4217 = string;

export type Price = {
  amount: number;
  currency: CurrencyIso4217;
  per: 'month' | 'year';
  note?: string;
};

export type PlanFeature = {
  id: string;
  label: string;
};

export type BillingPlan = {
  id: string;
  name: string;
  subtitle?: string;
  logo?: React.ReactNode;
  price: Price;
  features: PlanFeature[];
  ctaLabel: string;
  highlight?: boolean;
};