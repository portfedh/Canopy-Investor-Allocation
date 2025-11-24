/**
 * Validation utilities for investment allocation inputs
 */

/**
 * Validate allocation amount
 * @param {string|number} amount - The allocation amount to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export function validateAllocation(amount) {
  // Check if empty
  if (amount === '' || amount === null || amount === undefined) {
    return { valid: false, error: 'Allocation amount is required' };
  }

  // Convert to number
  const numAmount = Number(amount);

  // Check if valid number
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Allocation amount must be a valid number' };
  }

  // Check if negative
  if (numAmount < 0) {
    return { valid: false, error: 'Allocation amount cannot be negative' };
  }

  // Warn if zero
  if (numAmount === 0) {
    return { valid: true, error: null, warning: 'Allocation amount is zero - no funds will be distributed' };
  }

  return { valid: true, error: null };
}

/**
 * Validate a single investor's data
 * @param {Object} investor - The investor data to validate
 * @param {number} index - The investor's index (for error messages)
 * @returns {Object} - { valid: boolean, errors: Array<string> }
 */
export function validateInvestor(investor, index) {
  const errors = [];
  const investorLabel = investor.name || `Investor ${index + 1}`;

  // Validate name
  if (!investor.name || investor.name.trim() === '') {
    errors.push(`${investorLabel}: Name is required`);
  }

  // Validate requested amount
  if (investor.requestedAmount === '' || investor.requestedAmount === null || investor.requestedAmount === undefined) {
    errors.push(`${investorLabel}: Requested amount is required`);
  } else {
    const requestedNum = Number(investor.requestedAmount);
    if (isNaN(requestedNum)) {
      errors.push(`${investorLabel}: Requested amount must be a valid number`);
    } else if (requestedNum < 0) {
      errors.push(`${investorLabel}: Requested amount cannot be negative`);
    }
  }

  // Validate average amount
  if (investor.averageAmount === '' || investor.averageAmount === null || investor.averageAmount === undefined) {
    errors.push(`${investorLabel}: Average amount is required`);
  } else {
    const averageNum = Number(investor.averageAmount);
    if (isNaN(averageNum)) {
      errors.push(`${investorLabel}: Average amount must be a valid number`);
    } else if (averageNum < 0) {
      errors.push(`${investorLabel}: Average amount cannot be negative`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate the entire form
 * @param {string|number} allocationAmount - The allocation amount
 * @param {Array} investors - Array of investor data
 * @returns {Object} - { valid: boolean, errors: Array<string>, warnings: Array<string> }
 */
export function validateForm(allocationAmount, investors) {
  const errors = [];
  const warnings = [];

  // Validate allocation amount
  const allocationValidation = validateAllocation(allocationAmount);
  if (!allocationValidation.valid) {
    errors.push(allocationValidation.error);
  }
  if (allocationValidation.warning) {
    warnings.push(allocationValidation.warning);
  }

  // Check if at least one investor exists
  if (!investors || investors.length === 0) {
    errors.push('At least one investor is required');
    return { valid: false, errors, warnings };
  }

  // Validate each investor
  investors.forEach((investor, index) => {
    const investorValidation = validateInvestor(investor, index);
    if (!investorValidation.valid) {
      errors.push(...investorValidation.errors);
    }
  });

  // Check if all averages are zero (informational warning)
  const allAveragesZero = investors.every(inv => Number(inv.averageAmount) === 0);
  if (allAveragesZero && investors.length > 0) {
    warnings.push('All investors have zero average amounts - allocation will be split equally');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
