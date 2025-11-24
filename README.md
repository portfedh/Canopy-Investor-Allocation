# Investment Allocation Proration Tool

**Canopy Take-Home Project - Completed November 24 2024**

🔗 **[Live Demo on Railway](https://your-app.railway.app)** _(Link to be updated after deployment)_

Created by: Pablo Cruz Lemini

Portfolio: https://pablocruz.io/

Github: https://github.com/portfedh

LinkedIn: https://www.linkedin.com/in/pablocruzlemini/

Email: pablo.cruz.lemini@gmail.com

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technical Implementation](#-technical-implementation)
- [Test Coverage](#-test-coverage)
- [Project Structure](#-project-structure)
- [Algorithm Details](#-algorithm-details)
- [Deployment](#-deployment)

---

## 🚀 Quick Start

### Running Locally

```bash
# Navigate to the web application
cd website

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173/** in your browser.

### Running Algorithm Tests

```bash
# From project root
node test-algorithm.js

# Expected output: ✅ ALL 22 TESTS PASS
```

### Production Build

```bash
cd website
npm run build
npm run preview
```

---

## 🎯 Project Overview

This project implements a two-part solution for Canopy's investment allocation challenge:

### Part 1: Backend Algorithm

A proration algorithm that fairly distributes limited investment capacity among multiple investors based on their historical average investment amounts.

**Key Features:**

- Iterative redistribution (handles 1-5+ passes automatically)
- Prevents investors from exceeding their requested amounts
- Uses historical averages for fairness, not requested amounts
- Handles complex edge cases (zero averages, fractional cents, etc.)
- Ensures exact allocation distribution with cent-rounding

### Part 2: Frontend Application

A React-based UI that provides an intuitive interface for internal teams to calculate and export investor allocations.

**Key Features:**

- Two-column layout matching provided wireframe
- Dynamic investor management (add/remove rows)
- Real-time validation with helpful error messages
- Calculation transparency (shows multi-pass breakdown)
- Export to JSON and CSV formats
- Responsive design for all devices

---

## ✨ Features

### Core Functionality

- ✅ **Dynamic Investor Management** - Add/remove investors (minimum 1, no maximum)
- ✅ **Real-Time Validation** - Comprehensive error checking with helpful messages
- ✅ **Iterative Proration** - Automatically handles complex multi-pass redistribution
- ✅ **Calculation Transparency** - Collapsible details showing pass-by-pass logic
- ✅ **Export Capabilities** - Download results as JSON or CSV

### Enhanced Features

- ✅ **Algorithm Rules Card** - Interactive educational component explaining proration logic
- ✅ **Automated Testing UI** - Built-in test runner with:
  - Load any of 22 test cases into the form
  - Batch mode to run all tests at once
  - Visual pass/fail indicators
  - Detailed comparison for failures
- ✅ **Currency Formatting** - Proper $1,234.56 display
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Edge Cases Handled

- Zero allocation amounts
- All investors with zero historical averages (equal split)
- Mixed zero and non-zero averages
- Fractional cents with dust distribution
- Very large numbers (billions)
- Single investor scenarios
- Undersubscribed scenarios (allocation > total requested)

---

## 🔧 Technical Implementation

### Technology Stack

- **React 19.2** - Modern component-based UI
- **Vite 7.2** - Fast build tool and development server
- **Tailwind CSS 4.1** - Utility-first styling framework
- **JavaScript ES6+** - Modern JavaScript with modules

### Architecture Highlights

**Component Structure:**

- Presentational components for UI elements
- Container components for logic management
- Utility modules for business logic (pure functions)
- Single source of truth with React hooks (useState)

**Algorithm Design:**

- Immutable operations (no side effects)
- Helper functions (small, focused, testable)
- Comprehensive inline documentation
- ES6 module system

**Code Quality:**

- ~1,750 lines of production code across 16 files
- Clear separation of concerns
- Zero external dependencies (beyond React/Vite/Tailwind)

---

## 🧪 Test Coverage

**Status: ✅ ALL 22 TESTS PASSING**

### Test Categories

#### Basic Cases (2 tests)

- `simple_1`, `simple_2` - Fundamental proration logic

#### Complex Cases (2 tests)

- `complex_1`, `complex_2` - Two-pass redistribution scenarios

#### Edge Cases (18 tests)

- **Multi-Pass Redistribution:**

  - `edge_three_pass` - Three sequential caps with detailed walkthrough
  - `edge_five_pass` - Most complex scenario (5 redistribution passes)
  - `edge_simultaneous_multi_caps` - Multiple investors capped simultaneously

- **Zero Averages:**

  - `edge_all_zero_averages` - Division by zero handling (equal split)
  - `edge_mixed_zero_averages` - Some zero, some non-zero averages

- **Precision & Rounding:**

  - `edge_fractional_cents` - Cent-rounding with dust distribution
  - `edge_many_investors_precision` - 10 investors, floating-point precision
  - `edge_tiny_amounts_precision` - Fractional cent precision

- **Boundary Conditions:**

  - `edge_zero_allocation` - Zero allocation amount
  - `edge_single_investor` - Single investor scenario
  - `edge_zero_request` - Investor with zero request
  - `edge_exact_match` - Allocation equals total requested
  - `edge_all_undersubscribed` - Allocation exceeds total requested

- **Special Scenarios:**
  - `edge_large_numbers` - Billion-dollar amounts
  - `edge_inverse_whale` - Large investor requests far below average
  - `edge_disproportionate_averages` - Vastly different averages
  - `edge_requested_below_average` - Requests below historical averages
  - `edge_single_investor_oversubscribed` - One investor, limited allocation

### Testing Methods

**Command-Line Testing:**

```bash
node test-algorithm.js
```

Runs all 22 test cases automatically and reports results.

**UI-Based Testing:**
Open the web app and use the "Automated Testing" card to:

- Load individual test cases from dropdown
- Run all 22 tests in batch mode
- View visual comparison of expected vs. actual results
- Debug specific scenarios interactively

---

## 📁 Project Structure

```
.
├── data/                              # 22 paired test case files
│   ├── simple_1_input.json
│   ├── simple_1_output.json
│   ├── edge_three_pass_input.json
│   └── ... (40 more test files)
│
├── test-algorithm.js                  # Test runner (176 lines)
│
├── website/                           # React application
│   ├── public/
│   │   └── data/                      # Test cases for UI testing
│   │
│   ├── src/
│   │   ├── App.jsx                    # Main component (224 lines)
│   │   │
│   │   ├── components/                # 8 React components
│   │   │   ├── InputSection.jsx       # Left panel - input form (93 lines)
│   │   │   ├── InvestorRow.jsx        # Dynamic investor rows (70 lines)
│   │   │   ├── ResultsPanel.jsx       # Right panel - results (with validation)
│   │   │   ├── ValidationMessage.jsx  # Error/warning display (62 lines)
│   │   │   ├── CalculationDetails.jsx # Collapsible breakdown (98 lines)
│   │   │   ├── ExportButton.jsx       # JSON/CSV export (75 lines)
│   │   │   ├── AlgorithmRulesCard.jsx # Algorithm info card (116 lines)
│   │   │   └── TestRunner.jsx         # Automated testing UI (248 lines)
│   │   │
│   │   └── utils/                     # Business logic utilities
│   │       ├── prorationAlgorithm.js  # Core algorithm (289 lines)
│   │       ├── validation.js          # Input validation (126 lines)
│   │       ├── exportUtils.js         # Export functions (108 lines)
│   │       ├── formatting.js          # Currency formatting (48 lines)
│   │       └── testCaseLoader.js      # Test case loading (152 lines)
│   │
│   ├── package.json                   # Dependencies
│   ├── vite.config.js                 # Vite configuration
│   └── tailwind.config.js             # Tailwind configuration
│
├── README.md                          # This file
└── CLAUDE.md                          # AI assistant instructions
```

**Total Production Code:** ~1,750 lines across 16 source files

---

## 🧮 Algorithm Details

### Business Rules

1. **When allocation ≥ sum of requested amounts:**

   - Everyone gets exactly what they requested
   - No proration needed

2. **When allocation < sum of requested amounts:**

   - Prorate based on **historical average investment amounts** (not requested amounts)
   - No investor receives more than their requested amount
   - All allocation distributed pro rata
   - **Iterative redistribution:** When pro-rata exceeds requests, cap those investors and redistribute remainder to others (repeat until convergence)

3. **Special Cases:**
   - All averages zero → Equal split among all investors
   - Some averages zero → Equal split among zero-average investors after allocating to others
   - Cent-rounding → Round to 2 decimal places, distribute remainder pennies to ensure exact total

### Example

```
Available Allocation: $100

Investor A: Requested $150, Average $100
Investor B: Requested $50,  Average $25

Calculation:
- Total averages: $100 + $25 = $125
- Investor A: $100 × (100/125) = $80 ✓ (within request)
- Investor B: $100 × (25/125) = $20 ✓ (within request)

Result: A gets $80, B gets $20
```

### Multi-Pass Example

```
Available Allocation: $100

Investor A: Requested $40,  Average $100
Investor B: Requested $20,  Average $50
Investor C: Requested $15,  Average $30
Investor D: Requested $200, Average $20

Pass 1: Pro-rata based on all averages
- A would get $50 → Capped at $40 ✓
- B would get $25 → Capped at $20 ✓
- C would get $15 → OK ✓
- D would get $10 → OK ✓

Pass 2: Redistribute $30 remaining among C and D
- C would get $18 → Capped at $15 ✓
- D gets $15 → OK ✓

Pass 3: Redistribute $10 remaining to D only
- D gets all $10 → Final: $25 ✓

Final Result: A=$40, B=$20, C=$15, D=$25 (Total=$100)
```

### Input/Output Schema

**Input:**

```json
{
  "allocation_amount": 100,
  "investor_amounts": [
    {
      "name": "Investor A",
      "requested_amount": 150,
      "average_amount": 100
    }
  ]
}
```

**Output:**

```json
{
  "Investor A": 80.0,
  "Investor B": 20.0
}
```
