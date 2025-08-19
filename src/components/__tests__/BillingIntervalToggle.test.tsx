import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import BillingIntervalToggle, { type ToggleOption } from '../BillingIntervalToggle';

const options: ToggleOption<'monthly' | 'annually'>[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
];

describe('BillingIntervalToggle', () => {
  test('renders toggle options', () => {
    render(
      <BillingIntervalToggle
        value="monthly"
        onChange={vi.fn()}
        options={options}
        aria-label="Billing interval"
      />
    );

    expect(screen.getByRole('button', { name: /monthly/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annually/i })).toBeInTheDocument();
  });

  test('fires onChange when option selected', async () => {
    const u = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BillingIntervalToggle
        value="monthly"
        onChange={onChange}
        options={options}
        aria-label="Billing interval"
      />
    );

    await u.click(screen.getByRole('button', { name: /annually/i }));
    expect(onChange).toHaveBeenCalledWith('annually');
  });

  test('keyboard navigation works (Tab + Space)', async () => {
    const u = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BillingIntervalToggle
        value="monthly"
        onChange={onChange}
        options={options}
        aria-label="Billing interval"
      />
    );

    // First Tab → Monthly button
    await u.tab();
    const monthly = screen.getByRole('button', { name: /monthly/i });
    expect(monthly).toHaveFocus();

    // Space should "select" Monthly (already active so no change)
    await u.keyboard('[Space]');

    // Tab to Annually and Space to select it
    await u.tab();
    const annually = screen.getByRole('button', { name: /annually/i });
    expect(annually).toHaveFocus();
    await u.keyboard('[Space]');
    expect(onChange).toHaveBeenCalledWith('annually');
  });
});
