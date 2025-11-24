import { useState } from 'react';

function CalculationDetails({ details }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!details) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left py-2 hover:bg-gray-50 rounded-md px-2 transition-colors"
      >
        <span className="font-semibold text-gray-700 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculation Details
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pl-2 space-y-4">
          {/* Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <p className="text-sm text-blue-800">{details.summary}</p>
          </div>

          {/* Pass Details */}
          {details.passes && details.passes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">
                Redistribution Passes ({details.passes.length})
              </h4>
              {details.passes.map((pass, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md text-sm">
                  <div className="font-semibold text-gray-800 mb-2">
                    Pass {pass.number}
                    {pass.remainingAllocation && (
                      <span className="ml-2 text-gray-600 font-normal">
                        (Remaining: ${pass.remainingAllocation.toFixed(2)})
                      </span>
                    )}
                  </div>

                  {pass.calculations && pass.calculations.length > 0 && (
                    <div className="space-y-1.5 ml-2">
                      {pass.calculations.map((calc, calcIndex) => (
                        <div key={calcIndex} className="text-gray-700">
                          {calc.note ? (
                            <p className="italic text-gray-600">{calc.note}</p>
                          ) : (
                            <>
                              <div className="font-medium">{calc.name}</div>
                              {calc.formula && (
                                <div className="text-xs text-gray-600 font-mono ml-2">
                                  {calc.formula}
                                </div>
                              )}
                              {calc.result && (
                                <div className="text-xs ml-2">
                                  → {calc.result}
                                  {calc.requested && (
                                    <span className="text-gray-500">
                                      {' '}(requested: ${calc.requested})
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalculationDetails;
