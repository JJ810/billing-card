import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import * as React from 'react'

// Create a test theme
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

// Custom render function that includes MUI theme
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={testTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper function to create mock plans
export const createMockPlan = (overrides = {}) => ({
  id: 'test-plan',
  name: 'Test Plan',
  subtitle: 'Test Subtitle',
  price: {
    amount: 99,
    currency: 'USD' as const,
    per: 'month' as const,
    note: 'Test note',
  },
  features: [
    { id: 'f1', label: 'Feature 1' },
    { id: 'f2', label: 'Feature 2' },
  ],
  ctaLabel: 'Select Plan',
  highlight: false,
  ...overrides,
})

// Helper function to create mock toggle options
export const createMockToggleOptions = () => [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
] as const
