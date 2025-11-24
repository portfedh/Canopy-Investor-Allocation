import { useState } from 'react';
import { formatCurrency } from '../utils/formatting';
import CalculationDetails from './CalculationDetails';
import ExportButton from './ExportButton';

function ResultsPanel({ results, allocationAmount, investors, calculationDetails, isCalculated, testValidation }) {
  // If no results yet, show empty state
  if (!results || !isCalculated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No results yet</p>
            <p className="text-sm mt-1">Enter allocation data and click &quot;Prorate&quot;</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalAllocated = Object.values(results).reduce((sum, val) => sum + val, 0);
  const remaining = allocationAmount - totalAllocated;

  // Get sorted results (by allocation amount, descending)
  const sortedResults = Object.entries(results).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>
        <ExportButton
          allocationAmount={allocationAmount}
          investors={investors}
          results={results}
        />
      </div>

      {/* Test Validation Badge */}
      {testValidation && (
        <TestValidationBadge testValidation={testValidation} actualResults={results} />
      )}

      {/* Results List */}
      <div className="space-y-3 mb-6">
        {sortedResults.map(([name, amount]) => (
          <div key={name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-900">{name}</span>
            <span className="font-semibold text-indigo-600 text-lg">
              {formatCurrency(amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Allocated:</span>
          <span className="font-semibold">{formatCurrency(totalAllocated)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Available Allocation:</span>
          <span className="font-semibold">{formatCurrency(allocationAmount)}</span>
        </div>
        {Math.abs(remaining) > 0.01 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
        )}
      </div>

      {/* Calculation Details */}
      {calculationDetails && (
        <div className="mt-6">
          <CalculationDetails details={calculationDetails} />
        </div>
      )}
    </div>
  );
}

/**
 * Test Validation Badge Component
 * Shows pass/fail status and expected vs actual comparison
 */
function TestValidationBadge({ testValidation, actualResults }) {
  const [showComparison, setShowComparison] = useState(true);

  // Get expected results, filtering out metadata fields
  const expectedResults = Object.entries(testValidation.expectedOutput || {})
    .filter(([name]) => !name.startsWith('_'))
    .sort((a, b) => a[0].localeCompare(b[0]));

  // Get actual results sorted by name
  const actualResultsSorted = Object.entries(actualResults)
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className={`mb-6 p-4 rounded-lg border-2 ${
      testValidation.passed
        ? 'bg-green-50 border-green-500'
        : 'bg-red-50 border-red-500'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {testValidation.passed ? '✅' : '❌'}
          </span>
          <div>
            <p className={`font-bold text-lg ${
              testValidation.passed ? 'text-green-900' : 'text-red-900'
            }`}>
              {testValidation.passed ? 'Test Passed!' : 'Test Failed'}
            </p>
            <p className="text-sm text-gray-700">
              Test Case: <span className="font-mono font-semibold">{testValidation.testCaseId}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showComparison ? 'Hide' : 'Show'} Comparison
        </button>
      </div>

      {/* Expected vs Actual Comparison */}
      {showComparison && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-4">
            {/* Expected Column */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Expected:</h4>
              <div className="bg-white rounded border border-gray-300 p-3 space-y-1">
                {expectedResults.map(([name, amount]) => (
                  <div key={name} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">{name}</span>
                    <span className="font-mono text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actual Column */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Actual:</h4>
              <div className="bg-white rounded border border-gray-300 p-3 space-y-1">
                {actualResultsSorted.map(([name, amount]) => {
                  // Check if this investor has a difference
                  const hasDiff = testValidation.differences?.some(d => d.investor === name);
                  return (
                    <div key={name} className={`flex justify-between items-center text-sm ${
                      hasDiff ? 'bg-red-100 -mx-3 px-3 py-1' : ''
                    }`}>
                      <span className={`font-medium ${hasDiff ? 'text-red-700' : 'text-gray-700'}`}>
                        {name}
                      </span>
                      <span className={`font-mono ${hasDiff ? 'text-red-900 font-bold' : 'text-gray-900'}`}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Show specific differences if test failed */}
          {!testValidation.passed && testValidation.differences && testValidation.differences.length > 0 && (
            <div className="mt-4 pt-3 border-t border-red-200">
              <p className="font-semibold text-sm text-red-900 mb-2">Issues:</p>
              <ul className="space-y-1 text-sm text-red-800">
                {testValidation.differences.map((diff, index) => (
                  <li key={index} className="font-mono text-xs">
                    • {diff.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
