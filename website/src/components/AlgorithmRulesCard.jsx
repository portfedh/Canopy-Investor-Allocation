import { useState } from 'react';

function AlgorithmRulesCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      {/* Header with toggle */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
            i
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            How the Proration Algorithm Works
          </h2>
        </div>
        <button
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Brief summary (always visible) */}
      {!isExpanded && (
        <p className="mt-3 text-sm text-gray-700">
          When investment capacity is limited, allocations are distributed pro-rata based on each investor's <strong>historical average investment</strong>, not their requested amount. Click "Show Details" to learn more.
        </p>
      )}

      {/* Detailed explanation (expandable) */}
      {isExpanded && (
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          {/* Glossary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📖 Key Terms</h3>
            <div className="bg-white border border-blue-200 rounded p-3 space-y-2">
              <div>
                <strong className="text-blue-700">Available Allocation:</strong>
                <span className="ml-2">The total amount of investment capacity available to distribute among all investors.</span>
              </div>
              <div>
                <strong className="text-blue-700">Requested Amount:</strong>
                <span className="ml-2">The amount each investor wants to invest in this round. This is the maximum they can receive.</span>
              </div>
              <div>
                <strong className="text-blue-700">Average Amount:</strong>
                <span className="ml-2">Each investor's historical average investment from past rounds. Used to determine their proportional share when capacity is limited.</span>
              </div>
            </div>
          </div>

          {/* Core Principle */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Core Principle</h3>
            <p>
              The algorithm ensures <strong>fair distribution</strong> of limited investment capacity by prioritizing investors based on their historical participation, not just their current requests.
            </p>
          </div>

          {/* Key Rules */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Rules</h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                <strong>Sufficient capacity:</strong> When total allocation ≥ sum of all requests → everyone gets exactly what they requested
              </li>
              <li>
                <strong>Limited capacity:</strong> When total allocation &lt; sum of all requests → distribute pro-rata based on <strong>historical average amounts</strong>
              </li>
              <li>
                <strong>Respect caps:</strong> No investor receives more than their requested amount
              </li>
              <li>
                <strong>No waste:</strong> All available allocation is distributed (no unused capacity)
              </li>
              <li>
                <strong>Iterative redistribution:</strong> When pro-rata allocation exceeds an investor's request, cap them at their request and redistribute the remainder to other investors
              </li>
            </ol>
          </div>

          {/* Formula */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro-Rata Formula</h3>
            <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs">
              Investor Allocation = Total Allocation × (Investor Avg / Sum of All Avgs)
            </div>
          </div>

          {/* Example */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Example</h3>
            <div className="bg-white border border-blue-200 rounded p-3 space-y-1">
              <p><strong>Scenario:</strong> $100 allocation available</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Investor A: Requested $150, Historical Avg $100 → Receives <strong>$80.00</strong></li>
                <li>Investor B: Requested $50, Historical Avg $25 → Receives <strong>$20.00</strong></li>
              </ul>
              <p className="mt-2 text-xs text-gray-600">
                Calculation: A gets $100 × ($100 / $125) = $80 | B gets $100 × ($25 / $125) = $20
              </p>
            </div>
          </div>

          {/* Edge Cases */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Special Cases</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>All zero averages:</strong> Equal split among all investors (new investors scenario)
              </li>
              <li>
                <strong>Some zero averages:</strong> Non-zero investors get pro-rata first, then remainder split equally among zero-average investors
              </li>
              <li>
                <strong>Multi-pass redistribution:</strong> Algorithm iterates until all investors fit within their requested amounts (may take 2-5+ passes)
              </li>
              <li>
                <strong>Cent-rounding:</strong> All amounts rounded to 2 decimal places with fractional pennies distributed to ensure exact total
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlgorithmRulesCard;
