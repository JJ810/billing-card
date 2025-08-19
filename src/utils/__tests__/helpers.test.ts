import { describe, it, expect } from 'vitest'
import { buildFormatMoney } from '../helpers'

describe('buildFormatMoney', () => {
  describe('USD Currency with default fractional digits (0)', () => {
    const formatUSD = buildFormatMoney('USD')

    it('formats whole dollars correctly', () => {
      expect(formatUSD(100)).toBe('$100')
      expect(formatUSD(1000)).toBe('$1,000')
      expect(formatUSD(1234567)).toBe('$1,234,567')
    })

    it('rounds decimal values when no fractional digits', () => {
      expect(formatUSD(99.99)).toBe('$100') // Rounds up
      expect(formatUSD(99.49)).toBe('$99')  // Rounds down
      expect(formatUSD(0.01)).toBe('$0')    // Rounds down
      expect(formatUSD(123.45)).toBe('$123') // Rounds down
    })

    it('handles negative values', () => {
      expect(formatUSD(-100)).toBe('-$100')
      expect(formatUSD(-99.99)).toBe('-$100') // Rounds to -100
    })
  })

  describe('USD Currency with fractional digits', () => {
    const formatUSDCents = buildFormatMoney('USD', 2)

    it('formats cents correctly', () => {
      expect(formatUSDCents(99.99)).toBe('$99.99')
      expect(formatUSDCents(0.01)).toBe('$0.01')
      expect(formatUSDCents(123.45)).toBe('$123.45')
    })

    it('handles negative values with decimals', () => {
      expect(formatUSDCents(-100)).toBe('-$100.00')
      expect(formatUSDCents(-99.99)).toBe('-$99.99')
    })
  })

  describe('EUR Currency', () => {
    const formatEUR = buildFormatMoney('EUR', 2)

    it('formats euros correctly', () => {
      expect(formatEUR(100)).toBe('€100.00')
      expect(formatEUR(1000)).toBe('€1,000.00')
      expect(formatEUR(99.99)).toBe('€99.99')
    })

    it('handles negative euros', () => {
      expect(formatEUR(-100)).toBe('-€100.00')
    })
  })

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      const formatUSD = buildFormatMoney('USD', 2)
      expect(formatUSD(999999999.99)).toBe('$999,999,999.99')
      expect(formatUSD(1000000000)).toBe('$1,000,000,000.00')
    })

    it('handles very small numbers', () => {
      const formatUSD = buildFormatMoney('USD', 2)
      expect(formatUSD(0.001)).toBe('$0.00') // Rounds to nearest cent
      expect(formatUSD(0.005)).toBe('$0.01') // Rounds up
    })

    it('handles decimal precision correctly', () => {
      const formatUSD = buildFormatMoney('USD', 2)
      expect(formatUSD(99.999)).toBe('$100.00') // Rounds to nearest cent
      expect(formatUSD(99.994)).toBe('$99.99')  // Rounds down
      expect(formatUSD(99.995)).toBe('$100.00') // Rounds up
    })
  })

  describe('International Formatting', () => {
    it('uses correct currency symbols', () => {
      expect(buildFormatMoney('USD', 2)(100)).toBe('$100.00')
      expect(buildFormatMoney('EUR', 2)(100)).toBe('€100.00')
      expect(buildFormatMoney('GBP', 2)(100)).toBe('£100.00')
      expect(buildFormatMoney('JPY', 0)(100)).toBe('¥100')
    })
  })

  describe('Invalid Currency Handling', () => {
    it('throws error for completely invalid currency codes', () => {
      expect(() => buildFormatMoney('INVALID')).toThrow()
    })
  })
})