import { useState } from 'react';
import { TEST_CASES, loadTestCase, compareResults, formatInputForUI } from '../utils/testCaseLoader';
import { calculateProration } from '../utils/prorationAlgorithm';

/**
 * TestRunner Component
 *
 * Provides automated testing capabilities for the UI:
 * 1. Load individual test cases from dropdown
 * 2. Run all tests in batch mode
 * 3. Display pass/fail results with comparisons
 */
function TestRunner({ onLoadTestCase }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState('');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [loadError, setLoadError] = useState(null);

  /**
   * Load a single test case into the form
   */
  const handleLoadTestCase = async () => {
    if (!selectedTestCase) return;

    try {
      setLoadError(null);
      const { input, expectedOutput } = await loadTestCase(selectedTestCase);
      const formattedInput = formatInputForUI(input);
      onLoadTestCase({
        ...formattedInput,
        testCaseId: selectedTestCase,
        expectedOutput: expectedOutput
      });
    } catch (error) {
      setLoadError(`Failed to load test case: ${error.message}`);
    }
  };

  /**
   * Run all test cases and display results
   */
  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    setLoadError(null);
    const results = [];

    for (const testCase of TEST_CASES) {
      try {
        // Load test case input and expected output
        const { input, expectedOutput } = await loadTestCase(testCase.id);

        // Run the algorithm
        const { results: actualResults } = calculateProration(input);

        // Compare results
        const comparison = compareResults(actualResults, expectedOutput);

        results.push({
          id: testCase.id,
          name: testCase.name,
          description: testCase.description,
          passed: comparison.passed,
          differences: comparison.differences,
          actual: actualResults,
          expected: expectedOutput
        });
      } catch (error) {
        results.push({
          id: testCase.id,
          name: testCase.name,
          description: testCase.description,
          passed: false,
          error: error.message
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const passedTests = testResults?.filter(r => r.passed).length || 0;
  const totalTests = testResults?.length || 0;
  const allTestsPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            Automated Testing
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Load test cases or run all 22 tests to verify the algorithm
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Test Case Loader */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Load Test Case</h3>
            <div className="flex gap-3">
              <select
                value={selectedTestCase}
                onChange={(e) => setSelectedTestCase(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a test case...</option>
                {TEST_CASES.map(testCase => (
                  <option key={testCase.id} value={testCase.id}>
                    {testCase.name} - {testCase.description}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLoadTestCase}
                disabled={!selectedTestCase}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Load
              </button>
            </div>
            {loadError && (
              <p className="mt-2 text-sm text-red-600">{loadError}</p>
            )}
          </div>

          {/* Batch Test Runner */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Batch Testing</h3>
            <button
              onClick={handleRunAllTests}
              disabled={isRunningTests}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All 22 Tests'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Test Results</h3>
                <div className={`px-4 py-2 rounded-lg font-semibold ${
                  allTestsPassed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {allTestsPassed ? '✅ ALL TESTS PASSED' : `❌ ${passedTests}/${totalTests} PASSED`}
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.map(result => (
                  <TestResultItem key={result.id} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual test result item component
 */
function TestResultItem({ result }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`border rounded-lg p-4 ${
      result.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {result.passed ? '✅' : '❌'}
            </span>
            <span className="font-semibold text-gray-900">{result.name}</span>
            <span className="text-sm text-gray-600">({result.id})</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{result.description}</p>
          {result.error && (
            <p className="text-sm text-red-600 mt-1">Error: {result.error}</p>
          )}
        </div>
        {!result.passed && result.differences && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-4"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      {/* Show differences if test failed */}
      {showDetails && !result.passed && result.differences && (
        <div className="mt-4 pl-8 border-t pt-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Differences:</h4>
          <div className="space-y-2">
            {result.differences.map((diff, index) => (
              <div key={index} className="text-sm">
                <p className="text-red-700 font-mono">{diff.message}</p>
              </div>
            ))}
          </div>

          {/* Show full comparison */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-sm text-gray-900 mb-2">Expected:</h5>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                {JSON.stringify(result.expected, null, 2)}
              </pre>
            </div>
            <div>
              <h5 className="font-semibold text-sm text-gray-900 mb-2">Actual:</h5>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                {JSON.stringify(result.actual, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestRunner;
