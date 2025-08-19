import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- Mock demo utils so tests are deterministic ---
vi.mock('../utils/demo', () => {
  const intervalOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'annually', label: 'Annually' },
    { value: 'twoYears', label: '2 Years' },
    { value: 'threeYears', label: '3 Years' },
  ] as const;

  type Interval = (typeof intervalOptions)[number]['value'];

  const humanInterval = (v: Interval) =>
    v === 'annually'
      ? 'Annually'
      : v === 'twoYears'
        ? '2 Years'
        : v === 'threeYears'
          ? '3 Years'
          : 'Monthly';

  const getPlans = () => [
    {
      id: 'basic',
      name: 'Basic FAR Self-Assessment',
      price: { amount: 499, currency: 'USD', per: 'year', note: 'one time annual payment' },
      features: [{ id: 'b1', label: 'Feature B1' }],
      ctaLabel: 'Add to Cart',
    },
    {
      id: 'core',
      name: 'FutureFeed Core',
      subtitle: 'CMMC Level 1+',
      price: { amount: 399, currency: 'USD', per: 'month', note: 'Billed Monthly' },
      features: [{ id: 'c1', label: 'Feature C1' }],
      ctaLabel: 'Select Plan',
      highlight: true,
    },
    {
      id: 'dod',
      name: 'DoD Contractor CUI Bundle',
      subtitle: 'CMMC Level 2+',
      price: { amount: 483, currency: 'USD', per: 'month', note: 'Billed Monthly' },
      features: [{ id: 'd1', label: 'Feature D1' }],
      ctaLabel: 'Select Plan',
    },
  ];

  return {
    getPlans,
    humanInterval,
    intervalOptions,
  };
});

import App from '../App';
import { describe, test, vi } from 'vitest';
import { expect } from 'vitest';

describe('App (keyboard & SR behavior)', () => {
  test('renders heading, toggle, and cards', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /how often do you want to pay\?/i })
    ).toBeInTheDocument();
    // Toggle buttons exist
    expect(screen.getAllByText(/monthly/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/annually/i)[0]).toBeInTheDocument();
    // Live region present
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('changing interval updates the live region (screen reader announcement)', async () => {
    const u = userEvent.setup();
    render(<App />);

    await u.click(screen.getByRole('button', { name: /annually/i }));
    const live = screen.getByRole('status');
    expect(live).toHaveTextContent(/billing interval set to annually/i);
    expect(live).toHaveTextContent(/prices updated/i);
  });

  test('CTA accessible names include plan name + interval', async () => {
    const u = userEvent.setup();
    render(<App />);

    // Switch to "Annually" so labels include “— Annually”
    await u.click(screen.getByRole('button', { name: /annually/i }));

    // Core plan CTA should include plan and interval in its accessible name
    const coreCta = screen.getByRole('button', {
      name: /select plan:\s*futurefeed core\s*—\s*annually/i,
    });
    expect(coreCta).toBeInTheDocument();

    // Two more examples (not strictly required, but useful)
    const basicCta = screen.getByRole('button', {
      name: /add to cart:\s*basic far self-assessment\s*—\s*annually/i,
    });
    const dodCta = screen.getByRole('button', {
      name: /select plan:\s*dod contractor cui bundle\s*—\s*annually/i,
    });
    expect(basicCta).toBeInTheDocument();
    expect(dodCta).toBeInTheDocument();
  });

  test('keyboard: Tab reaches toggle and Space toggles; Enter on CTA announces selection', async () => {
    const u = userEvent.setup();
    render(<App />);

    await u.tab();
    const monthly = screen.getAllByText(/monthly/i)[0];
    expect(monthly).toHaveFocus();

    // Space toggles Monthly (pressed state)
    await u.keyboard('[Space]');
    expect(monthly).toHaveAttribute('aria-pressed', 'true');

    // Move focus to "Annually" and activate
    await u.tab();
    const annually = screen.getAllByText(/annually/i)[0];
    expect(annually).toHaveFocus();
    await u.keyboard('[Space]');
    const live = screen.getByRole('status');
    expect(live).toHaveTextContent(/billing interval set to annually/i);

    // Focus the first CTA and press Enter
    const firstCta = screen.getAllByRole('button', { name: /select plan:|add to cart:/i })[0];
    firstCta.focus();
    expect(firstCta).toHaveFocus();
    await u.keyboard('{Enter}');
    expect(live).toHaveTextContent(/selected .* — annually\./i);
  });
});
