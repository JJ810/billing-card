import { describe, it, expect } from 'vitest'
import { monthlyPriceFor, getPlans, intervalOptions, type Interval } from '../demo'

describe('demo utilities', () => {
  describe('intervalOptions', () => {
    it('contains expected interval options', () => {
      expect(intervalOptions).toEqual([
        { value: 'monthly', label: 'Monthly' },
        { value: 'annually', label: 'Annually' },
        { value: 'twoYears', label: '2 Years' },
        { value: 'threeYears', label: '3 Years' },
      ])
    })

    it('has readonly array type', () => {
      // This test ensures the type is readonly
      expect(Array.isArray(intervalOptions)).toBe(true)
      expect(intervalOptions.length).toBe(4)
    })
  })

  describe('monthlyPriceFor', () => {
    const baseMonthly = 100

    describe('monthly interval', () => {
      it('adds $20 for monthly billing', () => {
        const price = monthlyPriceFor('monthly', baseMonthly)
        
        expect(price).toEqual({
          amount: 120, // baseMonthly + 20
          currency: 'USD',
          per: 'month',
          note: 'Billed Monthly'
        })
      })
    })

    describe('annually interval', () => {
      it('keeps base price for annual billing', () => {
        const price = monthlyPriceFor('annually', baseMonthly)
        
        expect(price).toEqual({
          amount: baseMonthly,
          currency: 'USD',
          per: 'month',
          note: 'Billed Yearly'
        })
      })
    })

    describe('twoYears interval', () => {
      it('applies 8% discount (92% of base)', () => {
        const price = monthlyPriceFor('twoYears', baseMonthly)
        
        expect(price).toEqual({
          amount: 92, // Math.round(100 * 0.92)
          currency: 'USD',
          per: 'month',
          note: '2 Months Free'
        })
      })

      it('rounds discount correctly', () => {
        const price = monthlyPriceFor('twoYears', 99)
        expect(price.amount).toBe(91) // Math.round(99 * 0.92)
      })
    })

    describe('threeYears interval', () => {
      it('applies 11% discount (89% of base)', () => {
        const price = monthlyPriceFor('threeYears', baseMonthly)
        
        expect(price).toEqual({
          amount: 89, // Math.round(100 * 0.89)
          currency: 'USD',
          per: 'month',
          note: '4 Months Free'
        })
      })

      it('rounds discount correctly', () => {
        const price = monthlyPriceFor('threeYears', 99)
        expect(price.amount).toBe(88) // Math.round(99 * 0.89)
      })
    })

    describe('edge cases', () => {
      it('handles zero base price', () => {
        expect(monthlyPriceFor('monthly', 0)).toEqual({
          amount: 20,
          currency: 'USD',
          per: 'month',
          note: 'Billed Monthly'
        })

        expect(monthlyPriceFor('annually', 0)).toEqual({
          amount: 0,
          currency: 'USD',
          per: 'month',
          note: 'Billed Yearly'
        })
      })

      it('handles fractional base prices', () => {
        const price = monthlyPriceFor('twoYears', 99.5)
        expect(price.amount).toBe(92) // Math.round(99.5 * 0.92)
      })
    })
  })

  describe('getPlans', () => {
    it('returns array of three plans', () => {
      const plans = getPlans('monthly')
      expect(plans).toHaveLength(3)
    })

    it('has consistent plan structure', () => {
      const plans = getPlans('monthly')
      
      plans.forEach(plan => {
        expect(plan).toHaveProperty('id')
        expect(plan).toHaveProperty('name')
        expect(plan).toHaveProperty('price')
        expect(plan).toHaveProperty('features')
        expect(plan).toHaveProperty('ctaLabel')
        expect(typeof plan.id).toBe('string')
        expect(typeof plan.name).toBe('string')
        expect(typeof plan.ctaLabel).toBe('string')
        expect(Array.isArray(plan.features)).toBe(true)
      })
    })

    describe('basic plan', () => {
      it('has fixed annual pricing regardless of interval', () => {
        const monthlyPlans = getPlans('monthly')
        const annualPlans = getPlans('annually')
        
        const basicMonthly = monthlyPlans.find(p => p.id === 'basic')
        const basicAnnual = annualPlans.find(p => p.id === 'basic')
        
        expect(basicMonthly?.price).toEqual({
          amount: 499,
          currency: 'USD',
          per: 'year',
          note: 'one time annual payment'
        })
        
        expect(basicAnnual?.price).toEqual(basicMonthly?.price)
      })

      it('has correct features', () => {
        const plans = getPlans('monthly')
        const basic = plans.find(p => p.id === 'basic')
        
        expect(basic?.features).toHaveLength(5)
        expect(basic?.features[0]).toEqual({
          id: 'b1',
          label: 'For Contractors with FCI (i.e., no CUI)'
        })
      })
    })

    describe('core plan', () => {
      it('uses dynamic pricing based on interval', () => {
        const monthlyPlans = getPlans('monthly')
        const annualPlans = getPlans('annually')
        
        const coreMonthly = monthlyPlans.find(p => p.id === 'core')
        const coreAnnual = annualPlans.find(p => p.id === 'core')
        
        expect(coreMonthly?.price.amount).toBe(419) // 399 + 20 for monthly
        expect(coreAnnual?.price.amount).toBe(399)  // base price for annual
      })

      it('is highlighted by default', () => {
        const plans = getPlans('monthly')
        const core = plans.find(p => p.id === 'core')
        
        expect(core?.highlight).toBe(true)
      })

      it('has subtitle', () => {
        const plans = getPlans('monthly')
        const core = plans.find(p => p.id === 'core')
        
        expect(core?.subtitle).toBe('CMMC Level 1+')
      })
    })

    describe('dod plan', () => {
      it('uses dynamic pricing based on interval', () => {
        const monthlyPlans = getPlans('monthly')
        const twoYearPlans = getPlans('twoYears')
        
        const dodMonthly = monthlyPlans.find(p => p.id === 'dod')
        const dodTwoYear = twoYearPlans.find(p => p.id === 'dod')
        
        expect(dodMonthly?.price.amount).toBe(503) // 483 + 20 for monthly
        expect(dodTwoYear?.price.amount).toBe(444) // Math.round(483 * 0.92)
      })

      it('has subtitle', () => {
        const plans = getPlans('monthly')
        const dod = plans.find(p => p.id === 'dod')
        
        expect(dod?.subtitle).toBe('CMMC Level 2+')
      })
    })

    describe('different intervals', () => {
      it('applies correct pricing for all intervals', () => {
        const intervals: Interval[] = ['monthly', 'annually', 'twoYears', 'threeYears']
        
        intervals.forEach(interval => {
          const plans = getPlans(interval)
          expect(plans).toHaveLength(3)
          
          // Basic plan should always be the same
          const basic = plans.find(p => p.id === 'basic')
          expect(basic?.price.amount).toBe(499)
          
          // Other plans should have interval-based pricing
          const core = plans.find(p => p.id === 'core')
          const dod = plans.find(p => p.id === 'dod')
          
          expect(core?.price).toEqual(monthlyPriceFor(interval, 399))
          expect(dod?.price).toEqual(monthlyPriceFor(interval, 483))
        })
      })
    })

    describe('plan features', () => {
      it('all plans have features array', () => {
        const plans = getPlans('monthly')
        
        plans.forEach(plan => {
          expect(Array.isArray(plan.features)).toBe(true)
          expect(plan.features.length).toBeGreaterThan(0)
          
          plan.features.forEach(feature => {
            expect(feature).toHaveProperty('id')
            expect(feature).toHaveProperty('label')
            expect(typeof feature.id).toBe('string')
            expect(typeof feature.label).toBe('string')
          })
        })
      })

      it('features have unique IDs within each plan', () => {
        const plans = getPlans('monthly')
        
        plans.forEach(plan => {
          const featureIds = plan.features.map(f => f.id)
          const uniqueIds = new Set(featureIds)
          expect(uniqueIds.size).toBe(featureIds.length)
        })
      })
    })

    describe('plan metadata', () => {
      it('all plans have unique IDs', () => {
        const plans = getPlans('monthly')
        const planIds = plans.map(p => p.id)
        const uniqueIds = new Set(planIds)
        
        expect(uniqueIds.size).toBe(planIds.length)
        expect(planIds).toEqual(['basic', 'core', 'dod'])
      })

      it('all plans have CTA labels', () => {
        const plans = getPlans('monthly')
        
        plans.forEach(plan => {
          expect(typeof plan.ctaLabel).toBe('string')
          expect(plan.ctaLabel.length).toBeGreaterThan(0)
        })
      })
    })
  })
})
