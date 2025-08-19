import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import type { BillingPlan } from '../../types';
import BillingCard from '../BillingCard';

const plan: BillingPlan = {
  id: 'core',
  name: 'FutureFeed Core',
  subtitle: 'CMMC Level 1+',
  price: { amount: 399, currency: 'USD', per: 'month', note: 'Billed Monthly' },
  features: [
    { id: 'f1', label: 'Feature A' },
    { id: 'f2', label: 'Feature B' },
  ],
  ctaLabel: 'Select Plan',
  highlight: true,
};

describe('BillingCard', () => {
  test('renders plan details and CTA', () => {
    render(<BillingCard plan={plan} onSelect={vi.fn()} />);

    expect(screen.getByText(/futurefeed core/i)).toBeInTheDocument();
    expect(screen.getByText(/cmmc level 1\+/i)).toBeInTheDocument();
    expect(screen.getByText(/\$399/i)).toBeInTheDocument();

    const cta = screen.getByRole('button', { name: /select plan/i });
    expect(cta).toBeInTheDocument();
  });

  test('fires onSelect when CTA clicked', async () => {
    const u = userEvent.setup();
    const onSelect = vi.fn<(id: string, e: React.MouseEvent) => void>();

    render(
      <BillingCard
        plan={plan}
        onSelect={onSelect}
        slotProps={{ ctaButton: { 'aria-label': 'Select Core — Monthly' } }}
      />
    );

    const cta = screen.getByRole('button', { name: /select core/i });
    await u.click(cta);
    expect(onSelect).toHaveBeenCalledWith('core', expect.any(Object));
  });

  test('CTA respects custom aria-label', () => {
    render(
      <BillingCard
        plan={plan}
        onSelect={vi.fn()}
        slotProps={{ ctaButton: { 'aria-label': 'Custom Core CTA' } }}
      />
    );

    expect(screen.getByRole('button', { name: /custom core cta/i })).toBeInTheDocument();
  });
});
