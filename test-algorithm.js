/**
 * Test script for the proration algorithm
 * Run with: node test-algorithm.js
 */

const fs = require('fs');
const path = require('path');

// Import the algorithm (we'll need to adapt it for Node.js)
const algorithmCode = fs.readFileSync(
  path.join(__dirname, 'website/src/utils/prorationAlgorithm.js'),
  'utf8'
);

// Convert ES6 module to CommonJS for Node.js testing
const algorithmModule = algorithmCode
  .replace('export function calculateProration', 'function calculateProration')
  + '\nmodule.exports = { calculateProration };';

// Write temporary file and require it
const tempFile = path.join(__dirname, 'temp-algorithm.js');
fs.writeFileSync(tempFile, algorithmModule);
const { calculateProration } = require(tempFile);

/**
 * Load a JSON test file
 */
function loadTestFile(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Compare two result objects
 */
function compareResults(actual, expected, tolerance = 0.01) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected)
    .filter(key => !key.startsWith('_'))
    .sort();

  if (actualKeys.length !== expectedKeys.length) {
    return {
      match: false,
      reason: `Different number of investors: ${actualKeys.length} vs ${expectedKeys.length}`
    };
  }

  for (let i = 0; i < actualKeys.length; i++) {
    if (actualKeys[i] !== expectedKeys[i]) {
      return {
        match: false,
        reason: `Different investor names: ${actualKeys[i]} vs ${expectedKeys[i]}`
      };
    }

    const actualValue = actual[actualKeys[i]];
    const expectedValue = expected[expectedKeys[i]];
    const diff = Math.abs(actualValue - expectedValue);

    if (diff > tolerance) {
      return {
        match: false,
        reason: `${actualKeys[i]}: ${actualValue} vs ${expectedValue} (diff: ${diff})`
      };
    }
  }

  return { match: true };
}

/**
 * Run a single test
 */
function runTest(testName) {
  try {
    const input = loadTestFile(`${testName}_input.json`);
    const expectedOutput = loadTestFile(`${testName}_output.json`);

    const { results: actualOutput } = calculateProration(input);

    const comparison = compareResults(actualOutput, expectedOutput);

    return {
      name: testName,
      passed: comparison.match,
      reason: comparison.reason,
      input,
      expected: expectedOutput,
      actual: actualOutput
    };
  } catch (error) {
    return {
      name: testName,
      passed: false,
      reason: `Error: ${error.message}`,
      error
    };
  }
}

/**
 * Main test runner
 */
function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTMENT ALLOCATION PRORATION - TEST SUITE');
  console.log('='.repeat(70) + '\n');

  const testCases = [
    'simple_1',
    'simple_2',
    'complex_1',
    'complex_2',
    'edge_three_pass',
    'edge_five_pass',
    'edge_fractional_cents',
    'edge_all_zero_averages',
    'edge_simultaneous_multi_caps',
    'edge_many_investors_precision',
    'edge_large_numbers',
    'edge_inverse_whale',
    'edge_mixed_zero_averages',
    'edge_zero_allocation',
    'edge_single_investor',
    'edge_zero_request',
    'edge_exact_match',
    'edge_all_undersubscribed',
    'edge_disproportionate_averages',
    'edge_requested_below_average',
    'edge_single_investor_oversubscribed',
    'edge_tiny_amounts_precision'
  ];

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = runTest(testCase);
    results.push(result);

    const status = result.passed ? '✓ PASS' : '✗ FAIL';
    const color = result.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`${color}${status}${reset} ${testCase.padEnd(40)}`);

    if (!result.passed && result.reason) {
      console.log(`     ${result.reason}`);
    }

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total:  ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(70) + '\n');

  // Show details for failed tests
  if (failed > 0) {
    console.log('\nFAILED TEST DETAILS:');
    console.log('-'.repeat(70));
    results
      .filter(r => !r.passed)
      .forEach(result => {
        console.log(`\n${result.name}:`);
        console.log(`  Reason: ${result.reason}`);
        if (result.actual && result.expected) {
          console.log(`  Expected:`, JSON.stringify(result.expected, null, 2));
          console.log(`  Actual:  `, JSON.stringify(result.actual, null, 2));
        }
      });
  }

  // Cleanup
  fs.unlinkSync(tempFile);

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
