import type { BillingPlan, Price } from '../types';

export const intervalOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
  { value: 'twoYears', label: '2 Years' },
  { value: 'threeYears', label: '3 Years' },
] as const;

export type Interval = (typeof intervalOptions)[number]['value'];

export function monthlyPriceFor(interval: Interval, baseMonthly: number): Price {
  switch (interval) {
    case 'annually':
      return { amount: baseMonthly, currency: 'USD', per: 'month', note: 'Billed Yearly' };
    case 'twoYears':
      return {
        amount: Math.round(baseMonthly * 0.92),
        currency: 'USD',
        per: 'month',
        note: '2 Months Free',
      };
    case 'threeYears':
      return {
        amount: Math.round(baseMonthly * 0.89),
        currency: 'USD',
        per: 'month',
        note: '4 Months Free',
      };
    default:
      return { amount: baseMonthly + 20, currency: 'USD', per: 'month', note: 'Billed Monthly' };
  }
}

export const getPlans = (interval: Interval): BillingPlan[] => [
  {
    id: 'basic',
    name: 'Basic FAR Self-Assessment',
    price: { amount: 499, currency: 'USD', per: 'year', note: 'one time annual payment' },
    features: [
      { id: 'b1', label: 'For Contractors with FCI (i.e., no CUI)' },
      { id: 'b2', label: 'Compliance Single-Point-of-Truth' },
      { id: 'b3', label: 'Guided Self-Assessment' },
      { id: 'b4', label: 'Organize scope and assets' },
      { id: 'b5', label: 'Store evidence to defend your assessment' },
    ],
    ctaLabel: 'Select Plan',
  },
  {
    id: 'core',
    name: 'FutureFeed Core',
    subtitle: 'CMMC Level 1+',
    price: monthlyPriceFor(interval, 399),
    features: [
      { id: 'c1', label: 'All of the features of CMMC1 Express' },
      { id: 'c2', label: 'CIS Implementation Group 1 (IG1) **' },
      { id: 'c3', label: 'Manage Live SSP' },
      { id: 'c4', label: 'Manage POAMs' },
      { id: 'c5', label: 'Build and Manage Projects' },
      { id: 'c6', label: 'Add Other Frameworks' },
    ],
    ctaLabel: 'Select Plan',
    highlight: true,
  },
  {
    id: 'dod',
    name: 'DoD Contractor CUI Bundle',
    subtitle: 'CMMC Level 2+',
    price: monthlyPriceFor(interval, 483),
    features: [
      { id: 'd1', label: 'All of the features of FutureFeed Core' },
      { id: 'd2', label: 'CMMC 2.0 Level 2 Framework' },
      { id: 'd3', label: 'NIST SP 800-171 Framework' },
      { id: 'd4', label: 'Dynamic SPRS Score Tracking' },
    ],
    ctaLabel: 'Select Plan',
  },
];

export const humanInterval = (v: Interval) =>
  v === 'annually'
    ? 'Annually'
    : v === 'twoYears'
      ? '2 Years'
      : v === 'threeYears'
        ? '3 Years'
        : 'Monthly';
