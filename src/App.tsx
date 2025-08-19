import { Container, Grid, Stack, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import BillingCard from './components/BillingCard';
import BillingIntervalToggle from './components/BillingIntervalToggle';
import { getPlans, humanInterval, intervalOptions, type Interval } from './utils/demo';

export default function App() {
  const [interval, setInterval] = useState<Interval>('monthly');
  const [liveMsg, setLiveMsg] = useState<string>('');

  const plans = getPlans(interval);

  const handleIntervalChange = (interval: Interval) => {
    setInterval(interval);
    setLiveMsg(`Billing interval set to ${humanInterval(interval)}. Prices updated.`);
  };

  const handlePlanSelect = (id: string) => {
    const plan = plans.find((p) => p.id === id);
    setLiveMsg(`Selected ${plan?.name ?? 'plan'} — ${humanInterval(interval)}.`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Typography role="status" aria-live="polite" sx={visuallyHidden}>
          {liveMsg}
        </Typography>
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
          How often do you want to pay?
        </Typography>

        <BillingIntervalToggle
          value={interval}
          onChange={handleIntervalChange}
          options={intervalOptions}
          aria-label="Billing interval"
        />
      </Stack>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {plans.map((p) => (
          <Grid size={{ xs: 12, md: 4 }} key={p.id}>
            <BillingCard
              plan={p}
              onSelect={handlePlanSelect}
              slotProps={{
                ctaButton: {
                  'aria-label': `${p.ctaLabel ?? 'Select Plan'}: ${p.name} — ${humanInterval(interval)}`,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
