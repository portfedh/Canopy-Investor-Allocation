# Edge Cases Summary

This document catalogs all test cases for the investment allocation proration algorithm.

## Multi-Pass Redistribution Cases

### 1. **Three-Pass Redistribution** (`edge_three_pass_*`)
**Scenario:** Cascading caps across three iterations
- Pass 1: A and B exceed requests, capped
- Pass 2: C exceeds request on redistribution, capped
- Pass 3: D absorbs final remainder
- **Tests:** Algorithm handles sequential capping across multiple rounds
- **Note:** Test file includes detailed pass-by-pass calculation walkthrough

### 2. **Five-Pass Redistribution** (`edge_five_pass_*`)
**Scenario:** Extreme cascading with 5 investors capping sequentially
- Each investor A through D hits their cap in successive passes
- E finally absorbs all remaining allocation
- **Tests:** Algorithm robustness with many redistribution rounds
- **Critical:** Most complex redistribution scenario

### 3. **Simultaneous Multi-Caps** (`edge_simultaneous_multi_caps_*`)
**Scenario:** Three investors all exceed requests in same pass
- A, B, C all capped simultaneously in first pass
- D absorbs all remaining allocation
- **Tests:** Handling multiple caps in single iteration (not sequential)

## Zero/Missing Data Cases

### 4. **Mixed Zero Averages** (`edge_mixed_zero_averages_*`)
**Scenario:** Some investors have no historical data
- Investor A has average, B and C have zero average
- **Business decision:** Split remaining equally among zero-average investors
- **Tests:** Graceful handling of new investors without history

### 5. **All Zero Averages** (`edge_all_zero_averages_*`)
**Scenario:** No investor has historical data
- All averages are zero → division by zero risk
- **Business decision:** Equal split among all investors
- **Tests:** Fallback behavior when no historical basis exists

### 6. **Zero Allocation** (`edge_zero_allocation_*`)
**Scenario:** No allocation available
- Everyone receives zero
- **Tests:** Edge case of nothing to distribute

### 7. **Zero Request** (`edge_zero_request_*`)
**Scenario:** Investor requests $0 (opts out)
- **Tests:** Handling investors who opt out of the round

## Precision and Scale Cases

### 8. **Many Investors Precision** (`edge_many_investors_precision_*`)
**Scenario:** 10 investors with small amounts
- Tests floating point precision with many divisions
- **Critical:** Sum must equal exactly 100.0 (no accumulation errors)
- **Tests:** Numeric stability with multiple pro-rata calculations

### 9. **Cent-Rounding Logic** (`edge_fractional_cents_*`)
**Scenario:** $1 split among 3 investors requiring cent-rounding
- Raw calculation: $0.333... each
- Rounded result: $0.33, $0.33, $0.34 (extra penny to one investor)
- **Tests:** Proper cent-rounding and remainder distribution
- **Critical:** Algorithm must handle 'dust' (fractional cents) to ensure exact total

### 10. **Tiny Amounts Precision** (`edge_tiny_amounts_precision_*`)
**Scenario:** Very small decimal amounts
- **Tests:** Precision with tiny fractions

### 11. **Large Numbers** (`edge_large_numbers_*`)
**Scenario:** Billion-dollar institutional amounts
- Allocation: $2B among investors requesting $3.5B total
- **Tests:** No overflow, precision maintained at large scale
- **Note:** Well within JavaScript's MAX_SAFE_INTEGER

## Unusual Investor Behavior Cases

### 12. **Inverse Whale** (`edge_inverse_whale_*`)
**Scenario:** Large historical investor dramatically reduces participation
- Whale (avg $1M) only requests $10K
- Creates windfall opportunity for smaller investors
- **Tests:** Request far below average redistributes allocation

### 13. **Disproportionate Averages** (`edge_disproportionate_averages_*`)
**Scenario:** Whale with 1000x average vs small investors
- Tests extreme disparity in historical averages
- **Tests:** Pro-rata handles large disparities correctly

### 14. **Requested Below Average** (`edge_requested_below_average_*`)
**Scenario:** Investors requesting less than their historical average
- **Tests:** Algorithm respects request caps even when below average

## Simple Scenarios

### 15. **All Undersubscribed** (`edge_all_undersubscribed_*`)
**Scenario:** Everyone gets full request, allocation unused
- **Tests:** When total allocation exceeds total requested

### 16. **Exact Match** (`edge_exact_match_*`)
**Scenario:** Total requested equals allocation exactly
- **Tests:** Perfect fit with no redistribution needed

### 17. **Single Investor** (`edge_single_investor_*`)
**Scenario:** Only one investor (undersubscribed)
- **Tests:** Trivial allocation with single participant

### 18. **Single Investor Oversubscribed** (`edge_single_investor_oversubscribed_*`)
**Scenario:** Single investor requests more than available
- **Tests:** Capping to allocation amount with single participant

## Base Test Cases

### 19. **Simple 1** (`simple_1_*`)
**Scenario:** Basic two-investor undersubscribed
- **Tests:** Fundamental algorithm behavior

### 20. **Simple 2** (`simple_2_*`)
**Scenario:** Basic two-investor oversubscribed
- **Tests:** Simple pro-rata allocation

### 21. **Complex 1** (`complex_1_*`)
**Scenario:** Two-pass redistribution
- One investor hits cap in first pass, remainder redistributed
- **Tests:** Basic iterative redistribution

### 22. **Complex 2** (`complex_2_*`)
**Scenario:** Multiple investors cap, single absorbs remainder
- **Tests:** Multiple simultaneous caps in second pass

## Test Coverage Summary

**Total Test Cases:** 22 paired input/output files
- 2 Simple base cases
- 2 Complex multi-investor cases
- 18 Edge cases

**Key Algorithm Challenges Tested:**
1. ✅ Iterative redistribution (1-5 passes)
2. ✅ Sequential capping vs simultaneous capping
3. ✅ Zero averages (individual and all)
4. ✅ Floating point precision
5. ✅ **Cent-rounding for real currency** (required)
6. ✅ Very small and very large numbers
7. ✅ Edge cases (zero allocation, single investor, etc.)
8. ✅ Request >> average and request << average
9. ✅ Exact match scenarios

## Implementation Requirements

### Must Handle:
- **Division by zero** when sum of averages = 0
- **Iterative loops** until all allocations fit within requests
- **Floating point precision** ensuring exact sum
- **Multiple simultaneous caps** in one iteration
- **Cent-rounding logic** for real currency (round to 2 decimal places, distribute dust)

### Business Decisions Implemented:
1. When all averages are zero → **equal split among all investors**
2. When some averages are zero → **equal split among zero-avg investors**
3. Cent-rounding → **required, distribute remainder pennies to ensure exact total**

### Validation Needed:
- Negative numbers → reject or handle gracefully
- Allocation < 0 → reject or treat as 0
- Requested < 0 → reject or treat as 0
- Average < 0 → reject or treat as 0
- Maximum iterations → prevent infinite loops (suggest max 100 iterations)

## Algorithm Summary

The proration algorithm must:
1. Calculate initial pro-rata allocation based on historical averages
2. Identify investors exceeding their requested amounts
3. Cap those investors at their requests
4. Redistribute remaining allocation to uncapped investors (iteratively)
5. Round all final amounts to nearest cent
6. Distribute remainder pennies to ensure total equals allocation amount
