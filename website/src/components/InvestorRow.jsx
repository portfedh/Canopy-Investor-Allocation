function InvestorRow({ investor, showDelete, onChange, onDelete }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Name Input */}
      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <input
            type="text"
            value={investor.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Name"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Requested Amount Input */}
      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
          <input
            type="number"
            value={investor.requestedAmount}
            onChange={(e) => onChange('requestedAmount', e.target.value)}
            placeholder="Requested Amount"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Average Amount Input */}
      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
          <input
            type="number"
            value={investor.averageAmount}
            onChange={(e) => onChange('averageAmount', e.target.value)}
            placeholder="Average Amount"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Delete Button */}
      {showDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Remove investor"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default InvestorRow;
