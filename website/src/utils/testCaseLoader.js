/**
 * Test Case Loader Utility
 *
 * Loads test case input/output files from the public/data directory
 * and provides utilities for running automated tests in the UI.
 */

/**
 * List of all available test cases
 * Each test case has a paired _input.json and _output.json file
 */
export const TEST_CASES = [
  { id: 'simple_1', name: 'Simple Case 1', description: 'Basic two-investor proration' },
  { id: 'simple_2', name: 'Simple Case 2', description: 'Undersubscribed allocation' },
  { id: 'complex_1', name: 'Complex Case 1', description: 'Two-pass redistribution' },
  { id: 'complex_2', name: 'Complex Case 2', description: 'Multi-pass scenario' },
  { id: 'edge_single_investor', name: 'Single Investor', description: 'One investor only' },
  { id: 'edge_single_investor_oversubscribed', name: 'Single Investor Oversubscribed', description: 'One investor, limited allocation' },
  { id: 'edge_exact_match', name: 'Exact Match', description: 'Allocation equals total requested' },
  { id: 'edge_zero_request', name: 'Zero Request', description: 'Investor requests zero' },
  { id: 'edge_disproportionate_averages', name: 'Disproportionate Averages', description: 'Large variance in averages' },
  { id: 'edge_all_undersubscribed', name: 'All Undersubscribed', description: 'Everyone gets full request' },
  { id: 'edge_requested_below_average', name: 'Requested Below Average', description: 'Requests less than historical average' },
  { id: 'edge_tiny_amounts_precision', name: 'Tiny Amounts Precision', description: 'Very small decimal amounts' },
  { id: 'edge_mixed_zero_averages', name: 'Mixed Zero Averages', description: 'Some investors have zero average' },
  { id: 'edge_all_zero_averages', name: 'All Zero Averages', description: 'All investors have zero average' },
  { id: 'edge_inverse_whale', name: 'Inverse Whale', description: 'Large investor requests below average' },
  { id: 'edge_simultaneous_multi_caps', name: 'Simultaneous Multi Caps', description: 'Multiple caps in same pass' },
  { id: 'edge_five_pass', name: 'Five Pass Cascading', description: 'Five redistribution passes (most complex)' },
  { id: 'edge_many_investors_precision', name: 'Many Investors Precision', description: '10 investors with precision handling' },
  { id: 'edge_zero_allocation', name: 'Zero Allocation', description: 'No allocation to distribute' },
  { id: 'edge_large_numbers', name: 'Large Numbers', description: 'Billion-dollar amounts' },
  { id: 'edge_fractional_cents', name: 'Fractional Cents', description: 'Cent-rounding with dust distribution' },
  { id: 'edge_three_pass', name: 'Three Pass Cascading', description: 'Three-pass redistribution' }
];

/**
 * Load a test case input file
 * @param {string} testCaseId - The test case ID (e.g., 'simple_1')
 * @returns {Promise<Object>} - The parsed input JSON
 */
export async function loadTestInput(testCaseId) {
  const response = await fetch(`/data/${testCaseId}_input.json`);
  if (!response.ok) {
    throw new Error(`Failed to load test input: ${testCaseId}`);
  }
  return await response.json();
}

/**
 * Load a test case expected output file
 * @param {string} testCaseId - The test case ID (e.g., 'simple_1')
 * @returns {Promise<Object>} - The parsed expected output JSON
 */
export async function loadTestOutput(testCaseId) {
  const response = await fetch(`/data/${testCaseId}_output.json`);
  if (!response.ok) {
    throw new Error(`Failed to load test output: ${testCaseId}`);
  }
  return await response.json();
}

/**
 * Load both input and output for a test case
 * @param {string} testCaseId - The test case ID
 * @returns {Promise<Object>} - Object with input and expectedOutput
 */
export async function loadTestCase(testCaseId) {
  const [input, expectedOutput] = await Promise.all([
    loadTestInput(testCaseId),
    loadTestOutput(testCaseId)
  ]);

  return { input, expectedOutput };
}

/**
 * Compare two allocation results for equality
 * Handles floating point comparison with tolerance
 * @param {Object} actual - Actual results from algorithm
 * @param {Object} expected - Expected results from test file
 * @returns {Object} - { passed: boolean, differences: Array }
 */
export function compareResults(actual, expected) {
  const differences = [];
  const tolerance = 0.01; // 1 cent tolerance for floating point

  // Filter out metadata fields (starting with _) from expected results
  const expectedInvestors = Object.entries(expected).filter(([name]) => !name.startsWith('_'));

  // Check if all expected investors are in actual results
  for (const [name, expectedAmount] of expectedInvestors) {
    if (!(name in actual)) {
      differences.push({
        investor: name,
        expected: expectedAmount,
        actual: 'missing',
        message: `Missing investor: ${name}`
      });
    } else {
      const actualAmount = actual[name];
      const diff = Math.abs(actualAmount - expectedAmount);

      if (diff > tolerance) {
        differences.push({
          investor: name,
          expected: expectedAmount,
          actual: actualAmount,
          difference: diff,
          message: `${name}: Expected $${expectedAmount}, got $${actualAmount} (diff: $${diff.toFixed(2)})`
        });
      }
    }
  }

  // Check if actual has extra investors not in expected
  const expectedNames = new Set(expectedInvestors.map(([name]) => name));
  for (const name of Object.keys(actual)) {
    if (!expectedNames.has(name)) {
      differences.push({
        investor: name,
        expected: 'not expected',
        actual: actual[name],
        message: `Unexpected investor: ${name}`
      });
    }
  }

  return {
    passed: differences.length === 0,
    differences
  };
}

/**
 * Format test case input for display in the UI
 * Converts test JSON to form-friendly format
 * @param {Object} input - Test case input
 * @returns {Object} - { allocationAmount, investors }
 */
export function formatInputForUI(input) {
  return {
    allocationAmount: input.allocation_amount.toString(),
    investors: input.investor_amounts.map((inv, index) => ({
      id: index + 1,
      name: inv.name,
      requestedAmount: inv.requested_amount.toString(),
      averageAmount: inv.average_amount.toString()
    }))
  };
}
