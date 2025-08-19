import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  type BoxProps,
  type ButtonProps,
  type CardContentProps,
  type CardProps,
  type ListProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type { BillingPlan } from '../types';
import { buildFormatMoney } from '../utils/helpers';

const BillingCardRoot = styled(Card, {
  name: 'BillingCard',
  slot: 'Root',
})(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[2],
  maxWidth: '100%',
  [theme.breakpoints.up('md')]: { maxWidth: 365 },
}));

const BillingCardContent = styled(CardContent, {
  name: 'BillingCard',
  slot: 'Content',
})(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: { padding: theme.spacing(4) },
}));

const BillingCardHeader = styled(Box, {
  name: 'BillingCard',
  slot: 'Header',
})(() => ({
  textAlign: 'center',
}));

const BillingCardPrice = styled(Box, {
  name: 'BillingCard',
  slot: 'Price',
})(() => ({
  textAlign: 'center',
}));

const BillingCardFeatures = styled(List, {
  name: 'BillingCard',
  slot: 'Features',
})(() => ({
  alignSelf: 'stretch',
}));

const BillingCardCtaContainer = styled(Box, {
  name: 'BillingCard',
  slot: 'CtaContainer',
})(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: 'auto',
  [theme.breakpoints.up('md')]: { padding: theme.spacing(4) },
}));

export interface BillingCardSlots {
  root?: React.ElementType;
  content?: React.ElementType;
  header?: React.ElementType;
  price?: React.ElementType;
  features?: React.ElementType;
  ctaContainer?: React.ElementType;
  ctaButton?: React.ElementType;
}
export interface BillingCardSlotProps {
  root?: CardProps;
  content?: CardContentProps;
  header?: BoxProps;
  price?: BoxProps;
  features?: ListProps;
  ctaContainer?: BoxProps;
  ctaButton?: ButtonProps;
}

export interface BillingCardProps extends Omit<CardProps, 'title' | 'onSelect'> {
  plan: BillingPlan;
  highlight?: boolean;
  /** Slots allow swapping internal components */
  slots?: BillingCardSlots;
  /** Props per slot (add sx, className, data-testid, etc.) */
  slotProps?: BillingCardSlotProps;
  /** Fired when CTA is pressed */
  onSelect?: (planId: string, event: React.MouseEvent) => void;
}

const defaultSlots: Required<BillingCardSlots> = {
  root: BillingCardRoot,
  content: BillingCardContent,
  header: BillingCardHeader,
  price: BillingCardPrice,
  features: BillingCardFeatures,
  ctaContainer: BillingCardCtaContainer,
  ctaButton: Button,
};

const BillingCard = React.forwardRef<HTMLDivElement, BillingCardProps>(function BillingCard(
  { plan, highlight = plan.highlight ?? false, slots = {}, slotProps = {}, onSelect, sx, ...rest },
  ref
) {
  const {
    root: Root = defaultSlots.root,
    content: Content = defaultSlots.content,
    header: Header = defaultSlots.header,
    price: Price = defaultSlots.price,
    features: Features = defaultSlots.features,
    ctaContainer: CtaContainer = defaultSlots.ctaContainer,
    ctaButton: CtaButton = defaultSlots.ctaButton,
  } = slots;

  const handleClick: React.MouseEventHandler = (e) => {
    onSelect?.(plan.id, e);
  };

  return (
    <Root ref={ref} elevation={highlight ? 6 : 2} sx={sx} {...rest} {...slotProps.root}>
      <Content {...slotProps.content}>
        <Stack spacing={2} alignItems="center">
          {plan.logo && (
            <Box sx={{ height: 56, display: 'grid', placeItems: 'center' }}>{plan.logo}</Box>
          )}

          <Header {...slotProps.header}>
            <Typography variant="h5">{plan.name}</Typography>
            {!!plan.subtitle && (
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {plan.subtitle}
              </Typography>
            )}
          </Header>

          <Price {...slotProps.price}>
            <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
              {buildFormatMoney(plan.price.currency)(plan.price.amount)}
              <Typography
                component="span"
                variant="h5"
                sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
              >
                {' '}
                / {plan.price.per}
              </Typography>
            </Typography>
            {!!plan.price.note && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {plan.price.note}
              </Typography>
            )}
          </Price>

          <Divider sx={{ my: 1, alignSelf: 'stretch' }} />

          <Features dense {...slotProps.features}>
            {plan.features.map((f) => (
              <ListItem key={f.id} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleOutlineIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={f.label} />
              </ListItem>
            ))}
          </Features>
        </Stack>
      </Content>

      <CtaContainer {...slotProps.ctaContainer}>
        <CtaButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ height: 44, borderWidth: 2 }}
          {...slotProps.ctaButton}
        >
          {plan.ctaLabel ?? 'Select Plan'}
        </CtaButton>
      </CtaContainer>
    </Root>
  );
});

export default BillingCard;
