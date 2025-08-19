import {
    styled,
    ToggleButton,
    ToggleButtonGroup,
    type ToggleButtonGroupProps,
    type ToggleButtonProps,
} from '@mui/material';
import * as React from 'react';

const Root = styled(ToggleButtonGroup, {
  name: 'BillingIntervalToggle',
  slot: 'Root',
})(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 4,
  borderRadius: 16,
  gap: 4,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiToggleButtonGroup-grouped': {
    border: 'none',
    borderRadius: 12,
    margin: 0,
  },
}));

export type ToggleOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
};

export interface BillingIntervalToggleProps<T extends string = string> {
  value: T;
  onChange: (val: T) => void;
  options: readonly ToggleOption<T>[];
  groupProps?: ToggleButtonGroupProps;
  buttonProps?: ToggleButtonProps;
}

export default function BillingIntervalToggle<T extends string = string>({
  value,
  onChange,
  options,
  groupProps,
  buttonProps,
}: BillingIntervalToggleProps<T>) {
  return (
    <Root
      color="primary"
      exclusive
      size="small"
      value={value}
      onChange={(_, v: T | null) => v != null && onChange(v)}
      {...groupProps}
    >
      {options.map((opt) => (
        <ToggleButton
          key={String(opt.value)}
          value={opt.value}
          sx={{ px: 2.5, whiteSpace: 'nowrap' }}
          {...buttonProps}
        >
          {opt.label}
        </ToggleButton>
      ))}
    </Root>
  );
}
