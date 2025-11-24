/**
 * Export utilities for downloading results
 */

/**
 * Format data for export (matches test file structure)
 * @param {number} allocationAmount - The allocation amount
 * @param {Array} investors - Array of investor data
 * @param {Object} results - The calculated results
 * @returns {Object} - Formatted data for export
 */
export function formatForExport(allocationAmount, investors, results) {
  return {
    allocation_amount: allocationAmount,
    investor_amounts: investors.map(inv => ({
      name: inv.name,
      requested_amount: Number(inv.requestedAmount),
      average_amount: Number(inv.averageAmount)
    })),
    results: results,
    calculated_at: new Date().toISOString()
  };
}

/**
 * Export results as JSON file
 * @param {Object} data - The data to export
 * @param {string} filename - The filename (without extension)
 */
export function exportAsJSON(data, filename = 'allocation_results') {
  // Create a blob from the JSON data
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${getTimestamp()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export results as CSV file
 * @param {number} allocationAmount - The allocation amount
 * @param {Array} investors - Array of investor data
 * @param {Object} results - The calculated results
 * @param {string} filename - The filename (without extension)
 */
export function exportAsCSV(allocationAmount, investors, results, filename = 'allocation_results') {
  // Create CSV header
  const headers = ['Investor Name', 'Requested Amount', 'Average Amount', 'Allocated Amount'];

  // Create CSV rows
  const rows = investors.map(inv => {
    const allocatedAmount = results[inv.name] || 0;
    return [
      inv.name,
      Number(inv.requestedAmount),
      Number(inv.averageAmount),
      allocatedAmount
    ];
  });

  // Add summary row
  const totalRequested = investors.reduce((sum, inv) => sum + Number(inv.requestedAmount), 0);
  const totalAverage = investors.reduce((sum, inv) => sum + Number(inv.averageAmount), 0);
  const totalAllocated = Object.values(results).reduce((sum, val) => sum + val, 0);

  rows.push(['', '', '', '']);
  rows.push(['Total', totalRequested, totalAverage, totalAllocated]);
  rows.push(['Available Allocation', '', '', allocationAmount]);

  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${getTimestamp()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get current timestamp for filename
 * @returns {string} - Formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}`;
}
