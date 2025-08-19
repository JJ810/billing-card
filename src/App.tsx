import { Container, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import BillingCard from './components/BillingCard';
import BillingIntervalToggle from './components/BillingIntervalToggle';
import { getPlans, intervalOptions, type Interval } from './utils/demo';

export default function App() {
  const [interval, setInterval] = useState<Interval>('monthly');

  const plans = getPlans(interval);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
          How often do you want to pay?
        </Typography>

        <BillingIntervalToggle value={interval} onChange={setInterval} options={intervalOptions} />
      </Stack>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {plans.map((p) => (
          <Grid size={{ xs: 12, md: 4 }} key={p.id}>
            <BillingCard plan={p} onSelect={(id) => alert(`Selected: ${id}-${interval}`)} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
