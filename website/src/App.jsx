import { useState } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import AlgorithmRulesCard from './components/AlgorithmRulesCard';
import TestRunner from './components/TestRunner';
import { calculateProration } from './utils/prorationAlgorithm';
import { validateForm } from './utils/validation';
import { compareResults } from './utils/testCaseLoader';

function App() {
  // State for allocation amount
  const [allocationAmount, setAllocationAmount] = useState('');

  // State for investors (start with 1 investor)
  const [investors, setInvestors] = useState([
    { id: 1, name: '', requestedAmount: '', averageAmount: '' }
  ]);

  // State for results and calculation details
  const [results, setResults] = useState(null);
  const [calculationDetails, setCalculationDetails] = useState(null);

  // State for validation errors
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // State for calculated status
  const [isCalculated, setIsCalculated] = useState(false);

  // State for loaded test case (for validation)
  const [loadedTestCase, setLoadedTestCase] = useState(null);

  // State for test validation results
  const [testValidation, setTestValidation] = useState(null);

  // Counter for generating unique investor IDs
  const [nextId, setNextId] = useState(2);

  /**
   * Handle allocation amount change
   */
  const handleAllocationChange = (value) => {
    setAllocationAmount(value);
    setIsCalculated(false); // Clear calculated status when input changes
    setLoadedTestCase(null); // Clear test case tracking when user modifies input
    setTestValidation(null);
  };

  /**
   * Handle investor field change
   */
  const handleInvestorChange = (id, field, value) => {
    setInvestors(investors.map(inv =>
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
    setIsCalculated(false); // Clear calculated status when input changes
    setLoadedTestCase(null); // Clear test case tracking when user modifies input
    setTestValidation(null);
  };

  /**
   * Add a new investor row
   */
  const addInvestor = () => {
    setInvestors([
      ...investors,
      { id: nextId, name: '', requestedAmount: '', averageAmount: '' }
    ]);
    setNextId(nextId + 1);
  };

  /**
   * Remove an investor row
   */
  const removeInvestor = (id) => {
    // Don't allow removing if only one investor left
    if (investors.length > 1) {
      setInvestors(investors.filter(inv => inv.id !== id));
    }
  };

  /**
   * Calculate allocation
   */
  const calculateAllocation = () => {
    // Validate inputs
    const validation = validateForm(allocationAmount, investors);

    if (!validation.valid) {
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      setResults(null);
      setCalculationDetails(null);
      setIsCalculated(false);
      return;
    }

    // Clear errors and set warnings
    setErrors([]);
    setWarnings(validation.warnings);

    // Prepare input for algorithm
    const input = {
      allocation_amount: Number(allocationAmount),
      investor_amounts: investors.map(inv => ({
        name: inv.name,
        requested_amount: Number(inv.requestedAmount),
        average_amount: Number(inv.averageAmount)
      }))
    };

    // Run the algorithm
    const { results: calculatedResults, details } = calculateProration(input);

    // Update state
    setResults(calculatedResults);
    setCalculationDetails(details);
    setIsCalculated(true);

    // If a test case was loaded, validate the results
    if (loadedTestCase) {
      const comparison = compareResults(calculatedResults, loadedTestCase.expectedOutput);
      setTestValidation({
        testCaseId: loadedTestCase.id,
        passed: comparison.passed,
        differences: comparison.differences,
        expectedOutput: loadedTestCase.expectedOutput
      });
    }
  };

  /**
   * Clear the form
   */
  const clearForm = () => {
    setAllocationAmount('');
    setInvestors([{ id: 1, name: '', requestedAmount: '', averageAmount: '' }]);
    setResults(null);
    setCalculationDetails(null);
    setErrors([]);
    setWarnings([]);
    setIsCalculated(false);
    setLoadedTestCase(null);
    setTestValidation(null);
    setNextId(2);
  };

  /**
   * Load a test case into the form
   * Called by TestRunner component
   */
  const handleLoadTestCase = ({ allocationAmount, investors, testCaseId, expectedOutput }) => {
    // Clear any existing results first
    setResults(null);
    setCalculationDetails(null);
    setErrors([]);
    setWarnings([]);
    setIsCalculated(false);
    setTestValidation(null);

    // Load the test case data
    setAllocationAmount(allocationAmount);
    setInvestors(investors);
    setNextId(investors.length + 1);

    // Store the test case for validation after calculation
    setLoadedTestCase({
      id: testCaseId,
      expectedOutput: expectedOutput
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Investment Allocation Proration Tool
          </h1>
          <p className="mt-2 text-gray-600">
            Calculate fair allocation of limited investment capacity among investors
          </p>
        </div>

        {/* Algorithm Rules Card */}
        <AlgorithmRulesCard />

        {/* Test Runner - Automated Testing */}
        <TestRunner onLoadTestCase={handleLoadTestCase} />

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <InputSection
            allocationAmount={allocationAmount}
            investors={investors}
            errors={errors}
            warnings={warnings}
            onAllocationChange={handleAllocationChange}
            onInvestorChange={handleInvestorChange}
            onAddInvestor={addInvestor}
            onRemoveInvestor={removeInvestor}
            onCalculate={calculateAllocation}
            onClear={clearForm}
          />

          {/* Right Column - Results */}
          <ResultsPanel
            results={results}
            allocationAmount={Number(allocationAmount) || 0}
            investors={investors}
            calculationDetails={calculationDetails}
            isCalculated={isCalculated}
            testValidation={testValidation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
