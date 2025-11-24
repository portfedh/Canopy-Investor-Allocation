/**
 * Investment Allocation Proration Algorithm
 *
 * This algorithm fairly distributes limited investment allocation among multiple investors
 * based on their historical average investment amounts.
 *
 * Key Principles:
 * - If there's enough allocation for everyone, give each investor what they requested
 * - If allocation is limited, distribute proportionally based on historical averages
 * - No investor should receive more than they requested
 * - Unused allocation should be redistributed to other investors
 * - Handle edge cases like zero averages, cent-rounding, etc.
 */

/**
 * Main function to calculate investment allocation for each investor
 *
 * @param {Object} input - The allocation request
 * @param {number} input.allocation_amount - Total amount available to allocate
 * @param {Array} input.investor_amounts - Array of investor data
 * @param {string} input.investor_amounts[].name - Investor's name
 * @param {number} input.investor_amounts[].requested_amount - Amount investor wants
 * @param {number} input.investor_amounts[].average_amount - Investor's historical average
 * @returns {Object} - Object with results and calculation details
 */
export function calculateProration(input) {
  // Track calculation details for transparency
  const calculationDetails = {
    passes: [],
    summary: ''
  };

  // STEP 1: Extract and validate input data
  const allocationAmount = input.allocation_amount;
  const investors = input.investor_amounts;

  // Handle edge case: no allocation to distribute
  if (allocationAmount <= 0) {
    calculationDetails.summary = 'No allocation to distribute (amount = 0)';
    return {
      results: createZeroAllocation(investors),
      details: calculationDetails
    };
  }

  // Handle edge case: no investors
  if (!investors || investors.length === 0) {
    calculationDetails.summary = 'No investors provided';
    return {
      results: {},
      details: calculationDetails
    };
  }

  // STEP 2: Calculate total requested amount across all investors
  const totalRequested = investors.reduce((sum, investor) => {
    return sum + investor.requested_amount;
  }, 0);

  // STEP 3: Check if we have enough allocation for everyone
  // If allocation >= total requested, just give everyone what they asked for
  if (allocationAmount >= totalRequested) {
    calculationDetails.summary = `Allocation ($${allocationAmount}) >= Total Requested ($${totalRequested}). Everyone gets their full request.`;
    return {
      results: createFullAllocation(investors),
      details: calculationDetails
    };
  }

  // STEP 4: We need to prorate - allocation is less than total requested
  // Initialize tracking for each investor
  const investorData = investors.map(investor => ({
    name: investor.name,
    requested: investor.requested_amount,
    average: investor.average_amount,
    allocated: 0,  // How much they've been allocated so far
    isCapped: false  // Whether they've hit their request limit
  }));

  // STEP 5: Handle special case - all averages are zero
  // When no one has history, split equally among all investors
  const totalAverages = investorData.reduce((sum, inv) => sum + inv.average, 0);

  if (totalAverages === 0) {
    calculationDetails.summary = 'All averages are zero. Splitting allocation equally among all investors.';
    const result = handleAllZeroAverages(investorData, allocationAmount);
    return {
      results: result,
      details: calculationDetails
    };
  }

  // STEP 6: Iterative proration process
  // We'll loop multiple times, capping investors who exceed their requests
  // and redistributing their excess to remaining investors
  let remainingAllocation = allocationAmount;
  let uncappedInvestors = investorData.filter(inv => !inv.isCapped);
  let passNumber = 1;

  // Keep looping until everyone is allocated or capped
  while (uncappedInvestors.length > 0 && remainingAllocation > 0) {
    const passDetails = {
      number: passNumber,
      remainingAllocation: remainingAllocation,
      calculations: []
    };

    // Calculate sum of averages for investors who aren't capped yet
    const sumOfUncappedAverages = uncappedInvestors.reduce((sum, inv) => {
      return sum + inv.average;
    }, 0);

    // Handle case where remaining investors all have zero averages
    if (sumOfUncappedAverages === 0) {
      distributeEqually(uncappedInvestors, remainingAllocation);
      passDetails.calculations.push({
        note: 'Remaining uncapped investors have zero averages. Splitting equally.'
      });
      calculationDetails.passes.push(passDetails);
      break;
    }

    // Calculate pro-rata allocation for each uncapped investor
    // Formula: allocation * (investor_average / sum_of_averages)
    let anyoneCapped = false;

    for (const investor of uncappedInvestors) {
      // Calculate this investor's proportional share
      const proportionalShare = remainingAllocation * (investor.average / sumOfUncappedAverages);

      const calcDetail = {
        name: investor.name,
        formula: `$${remainingAllocation.toFixed(2)} × (${investor.average} / ${sumOfUncappedAverages}) = $${proportionalShare.toFixed(2)}`,
        requested: investor.requested
      };

      // Check if giving them their share would exceed their request
      if (proportionalShare >= investor.requested) {
        // Cap them at their request
        investor.allocated = investor.requested;
        investor.isCapped = true;
        anyoneCapped = true;
        calcDetail.result = `Capped at request: $${investor.requested}`;
      } else {
        // They're under their request, allocate the proportional share
        investor.allocated = proportionalShare;
        calcDetail.result = `Allocated: $${proportionalShare.toFixed(2)}`;
      }

      passDetails.calculations.push(calcDetail);
    }

    calculationDetails.passes.push(passDetails);

    // If no one got capped this round, we're done
    if (!anyoneCapped) {
      break;
    }

    // Recalculate remaining allocation (subtract what's been locked in by capped investors)
    const totalAllocatedSoFar = investorData.reduce((sum, inv) => {
      return sum + (inv.isCapped ? inv.allocated : 0);
    }, 0);
    remainingAllocation = allocationAmount - totalAllocatedSoFar;

    // Update list of uncapped investors for next iteration
    uncappedInvestors = investorData.filter(inv => !inv.isCapped);
    passNumber++;
  }

  calculationDetails.summary = `Completed proration in ${passNumber} pass(es). Total allocated: $${allocationAmount}`;

  // STEP 7: Round all allocations to 2 decimal places (cents)
  investorData.forEach(investor => {
    investor.allocated = roundToCents(investor.allocated);
  });

  // STEP 8: Handle rounding errors - distribute "dust" (leftover pennies)
  // Due to rounding, the sum might not equal the allocation exactly
  const totalAllocated = investorData.reduce((sum, inv) => sum + inv.allocated, 0);
  const roundedAllocation = roundToCents(allocationAmount);
  const dust = roundToCents(roundedAllocation - totalAllocated);

  // Distribute the dust (usually just a few cents) to investors
  if (dust !== 0) {
    distributeDust(investorData, dust);
    calculationDetails.summary += ` Distributed ${Math.abs(dust)} cents to ensure exact total.`;
  }

  // STEP 9: Create output object mapping names to amounts
  return {
    results: createAllocationResult(investorData),
    details: calculationDetails
  };
}

/**
 * Helper function: Round a number to 2 decimal places (cents)
 */
function roundToCents(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Helper function: Create result object with zero allocation for all investors
 */
function createZeroAllocation(investors) {
  const result = {};
  investors.forEach(investor => {
    result[investor.name] = 0;
  });
  return result;
}

/**
 * Helper function: Give each investor their full requested amount
 */
function createFullAllocation(investors) {
  const result = {};
  investors.forEach(investor => {
    result[investor.name] = investor.requested_amount;
  });
  return result;
}

/**
 * Helper function: Handle case where all investors have zero average
 * Split the allocation equally among all investors
 */
function handleAllZeroAverages(investorData, allocationAmount) {
  const equalShare = allocationAmount / investorData.length;

  investorData.forEach(investor => {
    // Cap at requested amount if equal share exceeds it
    investor.allocated = Math.min(equalShare, investor.requested);
  });

  return createAllocationResult(investorData);
}

/**
 * Helper function: Distribute allocation equally among a list of investors
 * Used when remaining investors all have zero averages
 */
function distributeEqually(investors, amount) {
  const equalShare = amount / investors.length;

  investors.forEach(investor => {
    investor.allocated = Math.min(equalShare, investor.requested);
  });
}

/**
 * Helper function: Distribute dust (leftover pennies from rounding)
 * Adds/subtracts one cent at a time to ensure sum equals allocation exactly
 */
function distributeDust(investorData, dust) {
  const increment = dust > 0 ? 0.01 : -0.01;
  let remaining = Math.abs(dust);

  // Distribute one penny at a time to investors (from last to first)
  // This ensures that rounding benefits are distributed to later investors
  for (let i = investorData.length - 1; i >= 0 && remaining > 0.005; i--) {
    const investor = investorData[i];

    // Only add pennies if it won't exceed their request
    if (dust > 0 && investor.allocated < investor.requested) {
      investor.allocated = roundToCents(investor.allocated + increment);
      remaining = roundToCents(remaining - 0.01);
    }
    // For negative dust, subtract pennies as long as allocation stays positive
    else if (dust < 0 && investor.allocated > 0) {
      investor.allocated = roundToCents(investor.allocated + increment);
      remaining = roundToCents(remaining - 0.01);
    }
  }
}

/**
 * Helper function: Convert investor data array to result object
 * Maps investor names to their allocated amounts
 */
function createAllocationResult(investorData) {
  const result = {};
  investorData.forEach(investor => {
    result[investor.name] = investor.allocated;
  });
  return result;
}
