import InvestorRow from './InvestorRow';
import ValidationMessage from './ValidationMessage';

function InputSection({
  allocationAmount,
  investors,
  errors,
  warnings,
  onAllocationChange,
  onInvestorChange,
  onAddInvestor,
  onRemoveInvestor,
  onCalculate,
  onClear
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Inputs</h2>

      {/* Validation Messages */}
      {errors.length > 0 && (
        <ValidationMessage messages={errors} type="error" />
      )}
      {warnings.length > 0 && (
        <ValidationMessage messages={warnings} type="warning" />
      )}

      {/* Allocation Amount */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Total Available Allocation
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
          <input
            type="number"
            value={allocationAmount}
            onChange={(e) => onAllocationChange(e.target.value)}
            placeholder="Allocation"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Investor Breakdown */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Investor Breakdown
        </label>

        {/* Column Headers */}
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-2 px-2">
          <div className="text-sm font-semibold text-gray-600">Investor Name</div>
          <div className="text-sm font-semibold text-gray-600">Requested Amount</div>
          <div className="text-sm font-semibold text-gray-600">Average Amount</div>
          <div className="w-10"></div> {/* Spacer for delete button */}
        </div>

        <div className="space-y-3">
          {investors.map((investor) => (
            <InvestorRow
              key={investor.id}
              investor={investor}
              showDelete={investors.length > 1}
              onChange={(field, value) => onInvestorChange(investor.id, field, value)}
              onDelete={() => onRemoveInvestor(investor.id)}
            />
          ))}
        </div>

        {/* Add Investor Button */}
        <button
          onClick={onAddInvestor}
          className="mt-4 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium"
        >
          + Add Investor
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCalculate}
          className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Prorate
        </button>
        <button
          onClick={onClear}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default InputSection;
