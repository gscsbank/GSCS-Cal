/**
 * GSCS BANK Assistant Manager Dashboard System - Core Script & Logic
 * Developed by iraasoft Solution
 * 
 * Features:
 * 1. Universal Loan Issuance & Deductions Engine (12 Fund & Admin Deductions)
 * 2. Swashakthi Vehicle Loan Calculator & Estimator
 * 3. Reducing Balance (හීනවන ක්‍රමය) & Flat Rate (සමාන වාරික ක්‍රමය) Calculation
 * 4. Loan Schemes Manager (CRUD custom schemes)
 * 5. Official Dual-Slip A4 Receipt Printing (Cashier Copy & Office/Customer Copy)
 * 6. Centralized Saved Loan Records Archive & Export
 */

// ============================================================
// 1. Toast Notification System
// ============================================================
function showToast(message, type = 'success', title = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-solid fa-circle-check',
    info: 'fa-solid fa-circle-info',
    warning: 'fa-solid fa-triangle-exclamation',
    error: 'fa-solid fa-circle-xmark'
  };

  const defaultTitles = {
    success: 'සාර්ථකයි (Success)',
    info: 'දැනුම්දීම (Info)',
    warning: 'අවවාදයයි (Warning)',
    error: 'දෝෂයකි (Error)'
  };

  const toastTitle = title || defaultTitles[type] || 'දැනුම්දීම';
  const toastIcon = icons[type] || icons.info;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="${toastIcon} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${toastTitle}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const removeToast = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 350);
  };

  toast.querySelector('.toast-close')?.addEventListener('click', removeToast);
  setTimeout(removeToast, 3500);
}

// ============================================================
// 2. Bilingual Dictionary (Sinhala / English)
// ============================================================
let currentLang = 'si';

const i18n = {
  si: {
    appTitle: "GSCS BANK Assistant Manager Dashboard",
    staffBadge: "ASST. MANAGER",
    tabUniversal: "ණය නිකුත් කිරීම & අයකිරීම්",
    tabVehicle: "ස්වශක්ති වාහන ණය",
    tabReducing: "හීනවෙන ක්‍රමය (Reducing Balance)",
    tabFlat: "සමාන වාරික ක්‍රමය (Flat Rate)",
    tabCompare: "ක්‍රම දෙක සසඳන්න",
    tabSchemes: "ණය වර්ග (Schemes)",
    tabRecords: "ලේඛනාගාරය (Archive)",
    
    // Inputs
    inputsHeader: "ණය තොරතුරු ඇතුළත් කරන්න",
    loanAmount: "ණය මුදල (Loan Amount)",
    interestRate: "වාර්ෂික පොලී අනුපාතය (Interest Rate)",
    loanTenure: "ණය කාලසීමාව (Tenure)",
    insuranceRate: "ණය රක්ෂණ අනුපාතය (Insurance Rate)",
    insuranceHint: "0.06%",
    months: "මාස",
    years: "අවුරුදු",
    
    // Summary Cards
    monthlyInstallment: "මාසික වාරිකය (Monthly Installment)",
    totalInterest: "මුළු පොලිය (Total Interest)",
    totalInsurance: "මුළු ණය රක්ෂණය (Total Loan Insurance)",
    totalPayable: "ගෙවිය යුතු මුළු මුදල (Total Amount Payable)",

    // Vehicle
    vehicleCalcTitle: "ස්වශක්ති වාහන ණය - ණය මුදල ගණනය කිරීම",
    vehicleCalcSubtitle: "වාහනයේ මිල, පරිපාලන ගාස්තු සහ මූලික ගෙවීම අනුව අදාළ ණය මුදල ස්වයංක්‍රීයව ගණනය කරගන්න",
    btnAddVehicle: "නව වාහනයක් එකතු කරන්න",
    btnBajajPrices: "Bajaj යතුරුපැදි සඳහා නවතම මිලගණන් බලන්න",
    headerVariableFees: "වාහන තොරතුරු & වෙනස්වන ගාස්තු",
    headerFixedFees: "පරිපාලන & අරමුදල් ගාස්තු",
    headerVehSummary: "ගණනය කිරීමේ සාරාංශය",
    lblVehPrice: "වාහනයේ මිල",
    lblRegFee: "ලියාපදිංචි ගාස්තු",
    lblVehInsurance: "වාහන රක්ෂණ ගාස්තු",
    lblDownPayment: "වාහනයේ මූලික ගෙවීම",
    lblBorrowerShares: "ණයකරු කොටස්",
    lblGuarantor1Shares: "ඇපකරු 1 කොටස්",
    lblGuarantor2Shares: "ඇපකරු 2 කොටස්",
    lblBuildingFund: "ගොඩනැගිලි අරමුදල",
    lblSwashakthiFund: "සමිති දායකත්වය",
    lblDocFee: "ලිපි ගාස්තු",
    lblServiceFund: "සේවා අරමුදල",
    lblLoanInsurance: "ණය රක්ෂණය",
    lblBorrowerDeposit: "ණයකරු තැන්පතු",
    lblTotalDocFees: "ලිපි ලේඛන ගාස්තු එකතුව",
    lblTotalVehCost: "සම්පූර්ණ පිරිවැය (මිල + ගාස්තු)",
    lblDownPaymentSummary: "මූලික ගෙවීම (Down Payment)",
    lblRequiredLoan: "අවශ්‍ය ණය මුදල (Required Loan Amount)",
    btnApplyLoan: "මෙම ණය මුදල වාරික ගණකයට යොදන්න",

    // Schedule
    scheduleTitle: "මාසික ගෙවීම් කාලසටහන (Repayment Schedule)",
    btnPdf: "PDF වාර්තාව",
    btnCsv: "Excel / CSV",
    btnPrint: "මුද්‍රණය",
    colMonth: "මාසය",
    colDate: "ගෙවිය යුතු දිනය",
    colStartBal: "ආරම්භක ශේෂය",
    colPrincipal: "මුල මුදල",
    colInterest: "පොලිය",
    colInsurance: "ණය රක්ෂණය",
    colPayment: "මාසික වාරිකය",
    colEndBal: "අවසාන ශේෂය",

    footerText: "© 2026 GSCS BANK Assistant Manager Dashboard System. All rights reserved."
  },

  en: {
    appTitle: "GSCS BANK Assistant Manager Dashboard",
    staffBadge: "ASST. MANAGER",
    tabUniversal: "Loan Issue & Deductions",
    tabVehicle: "Swashakthi Vehicle Loan",
    tabReducing: "Reducing Balance Method",
    tabFlat: "Flat Rate Method",
    tabCompare: "Compare Methods",
    tabSchemes: "Loan Schemes",
    tabRecords: "Records Archive",
    
    // Inputs
    inputsHeader: "Enter Loan Details",
    loanAmount: "Loan Amount (LKR)",
    interestRate: "Annual Interest Rate (%)",
    loanTenure: "Loan Tenure",
    insuranceRate: "Loan Insurance Rate (%)",
    insuranceHint: "0.06%",
    months: "Months",
    years: "Years",
    
    // Summary Cards
    monthlyInstallment: "Monthly Installment",
    totalInterest: "Total Interest",
    totalInsurance: "Total Loan Insurance",
    totalPayable: "Total Amount Payable",

    // Vehicle
    vehicleCalcTitle: "Swashakthi Vehicle Loan Estimator",
    vehicleCalcSubtitle: "Calculate required loan amount based on vehicle price, fees & down payment",
    btnAddVehicle: "Add New Vehicle",
    btnBajajPrices: "Check Latest Bajaj Motorcycle Prices",
    headerVariableFees: "Vehicle Info & Variable Fees",
    headerFixedFees: "Standard Admin & Fund Fees",
    headerVehSummary: "Calculation Summary",
    lblVehPrice: "Vehicle Price",
    lblRegFee: "Registration Fee",
    lblVehInsurance: "Vehicle Insurance Fee",
    lblDownPayment: "Down Payment",
    lblBorrowerShares: "Borrower Shares",
    lblGuarantor1Shares: "Guarantor 1 Shares",
    lblGuarantor2Shares: "Guarantor 2 Shares",
    lblBuildingFund: "Building Fund",
    lblSwashakthiFund: "Society Contribution",
    lblDocFee: "Doc / Form Fee",
    lblServiceFund: "Service Fund",
    lblLoanInsurance: "Loan Insurance Fee",
    lblBorrowerDeposit: "Borrower Deposit",
    lblTotalDocFees: "Total Documentation Fees",
    lblTotalVehCost: "Total Vehicle Cost",
    lblDownPaymentSummary: "Down Payment",
    lblRequiredLoan: "Required Loan Amount",
    btnApplyLoan: "Apply Loan Amount",

    // Schedule
    scheduleTitle: "Repayment Schedule (Amortization)",
    btnPdf: "PDF Report",
    btnCsv: "Excel / CSV",
    btnPrint: "Print",
    colMonth: "Month",
    colDate: "Due Date",
    colStartBal: "Start Balance",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colInsurance: "Loan Insurance",
    colPayment: "Monthly Payment",
    colEndBal: "Ending Balance",

    footerText: "© 2026 GSCS BANK Assistant Manager Dashboard System. All rights reserved."
  }
};

// ============================================================
// 3. Default Databases (Loan Schemes & Vehicles)
// ============================================================

const defaultLoanSchemes = [
  {
    id: "scheme_festival",
    name: "Festival Loan",
    rate: 18.0,
    period: 12,
    method: "reducing",
    category: "Festival / උත්සව",
    isDefault: true
  },
  {
    id: "scheme_athwela",
    name: "Athwela Team Loan",
    rate: 18.0,
    period: 12,
    method: "flat",
    category: "Team / අත්වැල",
    isDefault: true
  },
  {
    id: "scheme_equipment",
    name: "Equipment Loan",
    rate: 16.0,
    period: 24,
    method: "reducing",
    category: "Equipment / උපකරණ",
    isDefault: true
  },
  {
    id: "scheme_long_term",
    name: "Long Term Loan",
    rate: 15.0,
    period: 60,
    method: "reducing",
    category: "Long Term / දිගුකාලීන",
    isDefault: true
  },
  {
    id: "scheme_advanced",
    name: "Advanced Loan",
    rate: 18.0,
    period: 24,
    method: "reducing",
    category: "Advanced / අත්තිකාරම්",
    isDefault: true
  },
  {
    id: "scheme_suhuru_farm",
    name: "Suhuru Farm Loan",
    rate: 14.0,
    period: 24,
    method: "reducing",
    category: "Agriculture / සුහුරු ගොවිපළ",
    isDefault: true
  },
  {
    id: "scheme_business",
    name: "Business Loan",
    rate: 16.0,
    period: 36,
    method: "reducing",
    category: "Business / ව්‍යාපාරික",
    isDefault: true
  },
  {
    id: "scheme_sap",
    name: "Sap Loan",
    rate: 18.0,
    period: 24,
    method: "reducing",
    category: "Sap / සැප්",
    isDefault: true
  },
  {
    id: "scheme_athamaru",
    name: "Athamaru Loan",
    rate: 20.0,
    period: 6,
    method: "flat",
    category: "Instant / අතමාරු",
    isDefault: true
  },
  {
    id: "scheme_general",
    name: "General Loan",
    rate: 16.0,
    period: 36,
    method: "reducing",
    category: "General / සාමාන්‍ය",
    isDefault: true
  },
  {
    id: "scheme_swashakthi_02",
    name: "Swashakthi Loan 02",
    rate: 18.0,
    period: 36,
    method: "reducing",
    category: "Swashakthi / ස්වශක්ති",
    isDefault: true
  },
  {
    id: "scheme_swashakthi_01",
    name: "Swashakthi Loan 01",
    rate: 18.0,
    period: 24,
    method: "reducing",
    category: "Swashakthi / ස්වශක්ති",
    isDefault: true
  },
  {
    id: "scheme_instant",
    name: "Instant Loan",
    rate: 22.0,
    period: 6,
    method: "flat",
    category: "Instant / ක්ෂණික",
    isDefault: true
  },
  {
    id: "scheme_usawigatha",
    name: "Usawigatha Loan",
    rate: 18.0,
    period: 24,
    method: "reducing",
    category: "Legal / උසාවිගත",
    isDefault: true
  }
];

let loanSchemesDatabase = [...defaultLoanSchemes];

const defaultVehicles = [
  { id: 'bajaj_ct100', name: 'Bajaj CT 100', type: 'bike', price: 625950, regFee: 15000, vehicleInsurance: 18000, downPayment: 250000 },
  { id: 'bajaj_platina', name: 'Bajaj Platina 100', type: 'bike', price: 695950, regFee: 15000, vehicleInsurance: 19500, downPayment: 300000 },
  { id: 'bajaj_pulsar_150', name: 'Bajaj Pulsar 150 UG5', type: 'bike', price: 925950, regFee: 15000, vehicleInsurance: 24500, downPayment: 400000 },
  { id: 'bajaj_discover_125', name: 'Bajaj Discover 125 Disc', type: 'bike', price: 789950, regFee: 15000, vehicleInsurance: 21423, downPayment: 350000 },
  { id: 'bajaj_re_2s', name: 'Bajaj RE 4S (3-Wheel)', type: 'threewheel', price: 1450000, regFee: 20000, vehicleInsurance: 32000, downPayment: 600000 },
  { id: 'tvs_king', name: 'TVS King Deluxe (3-Wheel)', type: 'threewheel', price: 1395000, regFee: 20000, vehicleInsurance: 30000, downPayment: 550000 },
  { id: 'tvs_apache_160', name: 'TVS Apache RTR 160 4V', type: 'bike', price: 985000, regFee: 15000, vehicleInsurance: 25000, downPayment: 420000 },
  { id: 'yamaha_fzs_v3', name: 'Yamaha FZ-S V3 ABS', type: 'bike', price: 1150000, regFee: 15000, vehicleInsurance: 28000, downPayment: 480000 }
];

let vehicleDatabase = [...defaultVehicles];

// Global State
let currentMode = 'universal'; // 'universal' | 'vehicle' | 'reducing' | 'flat' | 'compare' | 'schemes' | 'records'
let chartBreakdown = null;
let chartTrend = null;
let currentScheduleRows = [];
let scheduleCurrentPage = 1;
let lastCalculatedVehicleLoanAmount = 499523;

// ============================================================
// 4. Initialization on DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initSidebar();
  initLoanSchemes();
  initUniversalCalculator();
  initVehicleCalculator();
  initSingleCalculator();
  initRecordsArchive();
  updateTopHeroStats();

  // Switch to initial tab
  switchAppMode('universal');

  // Quick Action in Topbar: New Loan
  document.getElementById("btn-quick-new-loan")?.addEventListener("click", () => {
    switchAppMode('universal');
    document.getElementById("univ-member-id")?.focus();
  });
});

// ============================================================
// 5. App Mode / Tab Switcher
// ============================================================
function switchAppMode(mode) {
  currentMode = mode;

  // Update active state on all sidebar items and top method tabs
  document.querySelectorAll(".sidebar-nav-item, .method-tabs .tab-btn").forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Hide all view wrappers safely
  const viewIds = [
    "universal-calc-view",
    "vehicle-calc-view",
    "single-calc-view",
    "compare-calc-view",
    "schemes-calc-view",
    "records-calc-view",
    "repayment-schedule-section"
  ];
  viewIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Show selected view
  switch(mode) {
    case 'universal':
      const uView = document.getElementById("universal-calc-view");
      if (uView) uView.style.display = 'block';
      updateUniversalCalculation();
      break;

    case 'vehicle':
      const vView = document.getElementById("vehicle-calc-view");
      if (vView) vView.style.display = 'block';
      updateVehicleCalculation();
      break;

    case 'reducing':
    case 'flat':
      const sView = document.getElementById("single-calc-view");
      if (sView) sView.style.display = 'grid';
      const rView = document.getElementById("repayment-schedule-section");
      if (rView) rView.style.display = 'block';
      calculateAndRender();
      break;

    case 'compare':
      const cView = document.getElementById("compare-calc-view");
      if (cView) cView.style.display = 'grid';
      renderComparisonView();
      break;

    case 'schemes':
      const schView = document.getElementById("schemes-calc-view");
      if (schView) schView.style.display = 'block';
      renderSchemesCards();
      break;

    case 'records':
      const recView = document.getElementById("records-calc-view");
      if (recView) recView.style.display = 'block';
      renderArchiveTable();
      break;
  }

  // Close mobile sidebar if open
  closeMobileSidebar();
  updateTopHeroStats();
}

// Wire up all tab buttons (both in sidebar & top method tabs)
document.addEventListener("click", (e) => {
  const tabBtn = e.target.closest(".tab-btn");
  if (tabBtn && tabBtn.dataset.mode) {
    switchAppMode(tabBtn.dataset.mode);
  }
});

// ============================================================
// 6. Universal Loan Issuance & Deductions Engine
// ============================================================
function initUniversalCalculator() {
  // Load saved loan schemes into dropdown
  populateUniversalSchemeDropdown();

  // Attach input event listeners to all universal inputs
  document.querySelectorAll(".univ-input").forEach(input => {
    input.addEventListener("input", () => {
      updateUniversalCalculation();
    });
  });

  // Scheme selector change -> auto-apply scheme defaults
  document.getElementById("univ-loan-scheme")?.addEventListener("change", (e) => {
    const schemeId = e.target.value;
    applySchemeToUniversalCalculator(schemeId);
  });

  // Calculation method radios (reducing / flat)
  document.querySelectorAll('input[name="univ-calc-method"]').forEach(radio => {
    radio.addEventListener("change", () => {
      updateUniversalCalculation();
    });
  });

  // Preset chips for Loan Amount
  document.querySelectorAll('.preset-chip[data-for="univ-loan-amount"]').forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll('.preset-chip[data-for="univ-loan-amount"]').forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const val = chip.dataset.value;
      const input = document.getElementById("univ-loan-amount");
      if (input) {
        input.value = val;
        updateUniversalCalculation();
      }
    });
  });

  // Reset form button
  document.getElementById("btn-reset-universal-form")?.addEventListener("click", () => {
    if (confirm("පෝරමයේ සියලුම අගයන් මුල් තත්වයට පත් කිරීමට කැමතිද?")) {
      resetUniversalForm();
      showToast("පෝරමය සාර්ථකව හිස් කරන ලදී.", "info");
    }
  });

  // Clear deductions button
  document.getElementById("btn-clear-univ-deductions")?.addEventListener("click", () => {
    document.querySelectorAll(".univ-fee-input").forEach(inp => inp.value = 0);
    updateUniversalCalculation();
    showToast("සියලුම අරමුදල් හා අයකිරීම් 0 කරන ලදී.", "info");
  });

  // Quick add scheme button
  document.getElementById("btn-quick-add-scheme")?.addEventListener("click", () => {
    openSchemeModalAdd();
  });

  // Save & Print Universal Voucher Slip
  document.getElementById("btn-save-and-print-universal")?.addEventListener("click", () => {
    saveAndPrintUniversalLoan();
  });

  // Apply to repayment schedule button
  document.getElementById("btn-apply-to-repayment-schedule")?.addEventListener("click", () => {
    applyUniversalLoanToSchedule();
  });

  // Shortcut to records archive
  document.getElementById("btn-view-all-saved-records-shortcut")?.addEventListener("click", () => {
    switchAppMode('records');
  });

  updateUniversalCalculation();
}

function populateUniversalSchemeDropdown() {
  const select = document.getElementById("univ-loan-scheme");
  if (!select) return;

  const curVal = select.value;
  select.innerHTML = "";

  loanSchemesDatabase.forEach(scheme => {
    const opt = document.createElement("option");
    opt.value = scheme.id;
    opt.textContent = scheme.name;
    select.appendChild(opt);
  });

  if (curVal && Array.from(select.options).some(o => o.value === curVal)) {
    select.value = curVal;
  }
}

function applySchemeToUniversalCalculator(schemeId) {
  const scheme = loanSchemesDatabase.find(s => s.id === schemeId);
  if (!scheme) return;

  const rateInput = document.getElementById("univ-interest-rate");
  const tenureInput = document.getElementById("univ-loan-tenure");

  if (rateInput && (!rateInput.value || rateInput.value === '0')) {
    if (scheme.rate !== undefined) rateInput.value = scheme.rate;
  }
  if (tenureInput && (!tenureInput.value || tenureInput.value === '0')) {
    if (scheme.period !== undefined) tenureInput.value = scheme.period;
  }

  if (scheme.method) {
    document.querySelectorAll('input[name="univ-calc-method"]').forEach(r => {
      r.checked = (r.value === scheme.method);
    });
  }

  updateUniversalCalculation();
}

function resetUniversalForm() {
  const ids = ["univ-member-id", "univ-member-name", "univ-member-nic", "univ-member-phone", "univ-g1-acc", "univ-g2-acc", "univ-loan-amount", "univ-interest-rate", "univ-loan-tenure", "univ-loan-remarks"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.querySelectorAll(".univ-fee-input").forEach(inp => inp.value = "");
  document.querySelectorAll('.preset-chip[data-for="univ-loan-amount"]').forEach(c => c.classList.remove("active"));

  updateUniversalCalculation();
}

function updateUniversalCalculation() {
  const grossLoanAmount = parseInputNumber("univ-loan-amount", 0);
  const annualRate = parseInputNumber("univ-interest-rate", 0);
  const tenureMonths = parseInt(document.getElementById("univ-loan-tenure")?.value) || 0;
  const calcMethod = document.querySelector('input[name="univ-calc-method"]:checked')?.value || 'reducing';

  // 12 Itemized Fund & Admin Deductions
  const savings         = parseInputNumber("univ-fee-savings", 0);
  const serviceFund     = parseInputNumber("univ-fee-service", 0);
  const buildingFund    = parseInputNumber("univ-fee-building", 0);
  const loanInsurance   = parseInputNumber("univ-fee-insurance", 0);
  const memberShares    = parseInputNumber("univ-fee-member-shares", 0);
  const securityDeposit = parseInputNumber("univ-fee-security", 0);
  const stationery      = parseInputNumber("univ-fee-stationery", 0);
  const welfareFund     = parseInputNumber("univ-fee-welfare", 0);
  const existingLoan    = parseInputNumber("univ-fee-existing-loan", 0);
  const existingInterest= parseInputNumber("univ-fee-existing-interest", 0);
  const g1Shares        = parseInputNumber("univ-fee-g1-shares", 0);
  const g2Shares        = parseInputNumber("univ-fee-g2-shares", 0);

  const totalDeductions = savings + serviceFund + buildingFund + loanInsurance + 
                          memberShares + securityDeposit + stationery + welfareFund + 
                          existingLoan + existingInterest + g1Shares + g2Shares;

  const netDisbursement = Math.max(0, grossLoanAmount - totalDeductions);

  // EMI & Interest Calculations
  let monthlyInstallment = 0;
  let totalInterest = 0;
  let installmentSub = "";

  if (grossLoanAmount > 0 && tenureMonths > 0) {
    if (calcMethod === 'reducing') {
      const monthlyPrincipal = grossLoanAmount / tenureMonths;
      const firstMonthInterest = (grossLoanAmount * (annualRate / 100)) / 12;
      const lastMonthInterest = (monthlyPrincipal * (annualRate / 100)) / 12;
      monthlyInstallment = monthlyPrincipal + firstMonthInterest;
      totalInterest = (grossLoanAmount * (annualRate / 100) * (tenureMonths + 1)) / 24;
      installmentSub = `පළමු මාසය: ${formatCurrency(monthlyPrincipal + firstMonthInterest)} | අවසන් මාසය: ${formatCurrency(monthlyPrincipal + lastMonthInterest)}`;
    } else {
      // Flat Rate
      totalInterest = grossLoanAmount * (annualRate / 100) * (tenureMonths / 12);
      monthlyInstallment = (grossLoanAmount + totalInterest) / tenureMonths;
      installmentSub = "මුළු කාලය පුරාම ස්ථාවර වාරිකය (Fixed EMI)";
    }
  } else {
    installmentSub = "–";
  }

  // Update UI Elements
  const elGross = document.getElementById("univ-metric-gross-loan");
  const elDeductions = document.getElementById("univ-metric-total-deductions");
  const elNet = document.getElementById("univ-metric-net-disbursement");
  const elEmi = document.getElementById("univ-metric-monthly-installment");
  const elEmiSub = document.getElementById("univ-metric-installment-sub");
  const elTotalInterest = document.getElementById("univ-metric-total-interest");

  if (elGross) elGross.textContent = formatCurrency(grossLoanAmount);
  if (elDeductions) elDeductions.textContent = formatCurrency(totalDeductions);
  if (elNet) elNet.textContent = formatCurrency(netDisbursement);
  if (elEmi) elEmi.textContent = formatCurrency(monthlyInstallment);
  if (elEmiSub) elEmiSub.textContent = installmentSub;
  if (elTotalInterest) elTotalInterest.textContent = formatCurrency(totalInterest);

  updateTopHeroStats();
}

function extractUniversalLoanRecord() {
  const schemeSelect = document.getElementById("univ-loan-scheme");
  const schemeName = schemeSelect?.options[schemeSelect.selectedIndex]?.text?.split(" (")[0] || "ණය වර්ගය";

  const memberId    = document.getElementById("univ-member-id")?.value.trim() || "";
  const memberName  = document.getElementById("univ-member-name")?.value.trim() || "";
  const nic         = document.getElementById("univ-member-nic")?.value.trim() || "";
  const phone       = document.getElementById("univ-member-phone")?.value.trim() || "";
  const g1Acc       = document.getElementById("univ-g1-acc")?.value.trim() || "";
  const g2Acc       = document.getElementById("univ-g2-acc")?.value.trim() || "";
  const grossLoan   = parseInputNumber("univ-loan-amount", 0);
  const rate        = parseInputNumber("univ-interest-rate", 18);
  const period      = parseInt(document.getElementById("univ-loan-tenure")?.value) || 24;
  const method      = document.querySelector('input[name="univ-calc-method"]:checked')?.value || 'reducing';
  const remarks     = document.getElementById("univ-loan-remarks")?.value.trim() || "";

  // 12 Itemized Fund & Admin Deductions
  const savings         = parseInputNumber("univ-fee-savings", 0);
  const serviceFund     = parseInputNumber("univ-fee-service", 0);
  const buildingFund    = parseInputNumber("univ-fee-building", 0);
  const loanInsurance   = parseInputNumber("univ-fee-insurance", 0);
  const memberShares    = parseInputNumber("univ-fee-member-shares", 0);
  const securityDeposit = parseInputNumber("univ-fee-security", 0);
  const stationery      = parseInputNumber("univ-fee-stationery", 0);
  const welfareFund     = parseInputNumber("univ-fee-welfare", 0);
  const existingLoan    = parseInputNumber("univ-fee-existing-loan", 0);
  const existingInterest= parseInputNumber("univ-fee-existing-interest", 0);
  const g1Shares        = parseInputNumber("univ-fee-g1-shares", 0);
  const g2Shares        = parseInputNumber("univ-fee-g2-shares", 0);

  const totalDeductions = savings + serviceFund + buildingFund + loanInsurance + 
                          memberShares + securityDeposit + stationery + welfareFund + 
                          existingLoan + existingInterest + g1Shares + g2Shares;

  const netDisbursement = Math.max(0, grossLoan - totalDeductions);

  // Calculate EMI
  let emi = 0;
  let totalInterest = 0;
  if (method === 'reducing') {
    const monthlyPrincipal = grossLoan / period;
    const firstMonthInterest = (grossLoan * (rate / 100)) / 12;
    emi = monthlyPrincipal + firstMonthInterest;
    totalInterest = (grossLoan * (rate / 100) * (period + 1)) / 24;
  } else {
    totalInterest = grossLoan * (rate / 100) * (period / 12);
    emi = (grossLoan + totalInterest) / period;
  }

  const record = {
    id: "rec_" + Date.now(),
    date: new Date().toLocaleDateString('si-LK', { year:'numeric', month:'short', day:'numeric' }),
    timestamp: Date.now(),
    type: "universal",
    schemeName,
    memberId,
    memberName,
    nic,
    phone,
    g1Acc,
    g2Acc,
    grossLoan,
    rate,
    period,
    method,
    remarks,
    savings,
    serviceFund,
    buildingFund,
    loanInsurance,
    memberShares,
    securityDeposit,
    stationery,
    welfareFund,
    existingLoan,
    existingInterest,
    g1Shares,
    g2Shares,
    totalDeductions,
    netDisbursement,
    emi,
    totalInterest
  };

  return record;
}

function saveAndPrintUniversalLoan() {
  const record = extractUniversalLoanRecord();
  if (!record.memberId || !record.memberName) {
    showToast("කරුණාකර සාමාජික අංකය සහ නම ඇතුළත් කරන්න.", "warning", "තොරතුරු අවශ්‍යයි");
    return;
  }
  if (record.grossLoan <= 0) {
    showToast("කරුණාකර වලංගු අනුමත ණය මුදලක් ඇතුළත් කරන්න.", "warning", "අගය අවශ්‍යයි");
    return;
  }

  // Save to Archive
  const archive = getAllSavedRecords();
  archive.unshift(record);
  saveAllRecordsArray(archive);

  showToast(`"${record.memberName}" (${record.memberId}) ගේ ණය වාර්තාව සුරැකි අතර Print Preview විවෘත වේ...`, "success", "සුරකින ලදී & Print");

  // Trigger Print Slip
  printUniversalLoanSlip(record);
}

function applyUniversalLoanToSchedule() {
  const grossLoan = parseInputNumber("univ-loan-amount", 0);
  const rate = parseInputNumber("univ-interest-rate", 18);
  const period = parseInt(document.getElementById("univ-loan-tenure")?.value) || 24;
  const method = document.querySelector('input[name="univ-calc-method"]:checked')?.value || 'reducing';

  document.getElementById("loan-amount").value = grossLoan;
  document.getElementById("loan-amount-slider").value = grossLoan;
  document.getElementById("interest-rate").value = rate;
  document.getElementById("loan-tenure").value = period;

  switchAppMode(method === 'flat' ? 'flat' : 'reducing');
  document.getElementById("repayment-schedule-section")?.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// 7. Loan Schemes Manager (CRUD)
// ============================================================
function initLoanSchemes() {
  loanSchemesDatabase = [...defaultLoanSchemes];
  const savedCustom = localStorage.getItem("gscs_custom_loan_schemes");
  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(c => {
          if (!loanSchemesDatabase.some(s => s.id === c.id)) {
            loanSchemesDatabase.push(c);
          }
        });
      }
    } catch(e) {}
  }

  updateSchemesCountBadge();

  // Modal event listeners
  document.getElementById("btn-open-add-scheme-modal")?.addEventListener("click", () => {
    openSchemeModalAdd();
  });

  document.getElementById("btn-close-scheme-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-scheme").style.display = "none";
  });

  document.getElementById("btn-cancel-scheme-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-scheme").style.display = "none";
  });

  // Search in schemes
  document.getElementById("scheme-search-input")?.addEventListener("input", (e) => {
    renderSchemesCards(e.target.value.trim().toLowerCase());
  });

  // Form Submit (Add or Edit Scheme)
  document.getElementById("form-add-scheme")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("m-scheme-edit-id").value;
    const name = document.getElementById("m-scheme-name").value.trim();
    const rate = parseFloat(document.getElementById("m-scheme-rate").value) || 18;
    const period = parseInt(document.getElementById("m-scheme-period").value) || 24;
    const method = document.getElementById("m-scheme-method").value || "reducing";
    const category = document.getElementById("m-scheme-category").value.trim() || "සාමාන්‍ය";

    if (!name) return;

    if (editId) {
      // Edit mode
      const item = loanSchemesDatabase.find(s => s.id === editId);
      if (item) {
        item.name = name;
        item.rate = rate;
        item.period = period;
        item.method = method;
        item.category = category;
      }
    } else {
      // Add mode
      const newScheme = {
        id: "scheme_" + Date.now(),
        name,
        rate,
        period,
        method,
        category,
        isDefault: false
      };
      loanSchemesDatabase.push(newScheme);
    }

    saveLoanSchemesToStorage();
    document.getElementById("modal-add-scheme").style.display = "none";
    renderSchemesCards();
    populateUniversalSchemeDropdown();
    showToast(`"${name}" ණය වර්ගය සාර්ථකව සුරකින ලදී.`, "success", "සුරකින ලදී");
  });

  // Delete Scheme
  document.getElementById("btn-delete-scheme")?.addEventListener("click", () => {
    const editId = document.getElementById("m-scheme-edit-id").value;
    if (!editId) return;
    const item = loanSchemesDatabase.find(s => s.id === editId);
    if (!item) return;

    if (confirm(`"${item.name}" ණය වර්ගය ඉවත් කිරීමට සහතිකද?`)) {
      loanSchemesDatabase = loanSchemesDatabase.filter(s => s.id !== editId);
      saveLoanSchemesToStorage();
      document.getElementById("modal-add-scheme").style.display = "none";
      renderSchemesCards();
      populateUniversalSchemeDropdown();
      showToast(`"${item.name}" ණය වර්ගය ඉවත් කරන ලදී.`, "warning", "ඉවත් කෙරිණි");
    }
  });
}

function saveLoanSchemesToStorage() {
  const customOnly = loanSchemesDatabase.filter(s => !s.isDefault);
  localStorage.setItem("gscs_custom_loan_schemes", JSON.stringify(customOnly));
  updateSchemesCountBadge();
  updateTopHeroStats();
}

function updateSchemesCountBadge() {
  const count = loanSchemesDatabase.length;
  const badge = document.getElementById("sidebar-schemes-count");
  if (badge) badge.textContent = count;
}

function openSchemeModalAdd() {
  document.getElementById("m-scheme-edit-id").value = "";
  document.getElementById("m-scheme-name").value = "";
  document.getElementById("m-scheme-rate").value = "18";
  document.getElementById("m-scheme-period").value = "24";
  document.getElementById("m-scheme-method").value = "reducing";
  document.getElementById("m-scheme-category").value = "";
  document.getElementById("scheme-modal-title").textContent = "නව ණය වර්ගයක් ඇතුළත් කරන්න (Add Loan Scheme)";
  document.getElementById("btn-save-scheme-label").textContent = "සුරකින්න";
  document.getElementById("btn-delete-scheme").style.display = "none";
  document.getElementById("modal-add-scheme").style.display = "flex";
  document.getElementById("m-scheme-name").focus();
}

function openSchemeModalEdit(id) {
  const scheme = loanSchemesDatabase.find(s => s.id === id);
  if (!scheme) return;

  document.getElementById("m-scheme-edit-id").value = scheme.id;
  document.getElementById("m-scheme-name").value = scheme.name;
  document.getElementById("m-scheme-rate").value = scheme.rate;
  document.getElementById("m-scheme-period").value = scheme.period;
  document.getElementById("m-scheme-method").value = scheme.method || "reducing";
  document.getElementById("m-scheme-category").value = scheme.category || "";
  document.getElementById("scheme-modal-title").textContent = `"${scheme.name}" සංස්කරණය`;
  document.getElementById("btn-save-scheme-label").textContent = "යාවත්කාලීන කරන්න";
  document.getElementById("btn-delete-scheme").style.display = scheme.isDefault ? "none" : "block";
  document.getElementById("modal-add-scheme").style.display = "flex";
  document.getElementById("m-scheme-name").focus();
}

function renderSchemesCards(filterQuery = "") {
  const container = document.getElementById("schemes-cards-container");
  if (!container) return;

  const filtered = filterQuery
    ? loanSchemesDatabase.filter(s => s.name.toLowerCase().includes(filterQuery) || (s.category && s.category.toLowerCase().includes(filterQuery)))
    : loanSchemesDatabase;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; opacity: 0.4; display:block; margin-bottom: 10px;"></i>
        ණය වර්ග කිසිවක් හමු නොවීය.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(scheme => `
    <div class="scheme-card">
      <div class="scheme-card-header">
        <span class="scheme-badge ${scheme.isDefault ? 'badge-default' : 'badge-custom'}">
          ${scheme.isDefault ? 'DEFAULT SCHEME' : 'CUSTOM SCHEME'}
        </span>
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">
          ${scheme.category || 'සාමාන්‍ය'}
        </span>
      </div>

      <div class="scheme-card-title">${scheme.name}</div>
      <div class="scheme-card-desc">පදනම: ${scheme.method === 'flat' ? 'සමාන වාරික (Flat Rate)' : 'හීනවෙන ක්‍රමය (Reducing Balance)'}</div>

      <div class="scheme-stats-grid">
        <div class="scheme-stat-item">
          <span class="scheme-stat-lbl">පෙරනිමි පොලිය</span>
          <span class="scheme-stat-val text-gold">${scheme.rate}%</span>
        </div>
        <div class="scheme-stat-item">
          <span class="scheme-stat-lbl">පෙරනිමි කාලය</span>
          <span class="scheme-stat-val text-blue">${scheme.period} මාස</span>
        </div>
      </div>

      <div class="scheme-card-actions">
        <button class="btn-action btn-gold btn-use-scheme" data-id="${scheme.id}" title="මෙම ණය ක්‍රමය ගණකයට යොදන්න" style="padding: 6px 10px; font-size: 0.78rem;">
          <i class="fa-solid fa-play"></i> යොදන්න
        </button>
        <button class="btn-action btn-edit-scheme" data-id="${scheme.id}" title="සංස්කරණය" style="padding: 6px 10px; font-size: 0.78rem;">
          <i class="fa-solid fa-pen-to-square"></i> වෙනස් කරන්න
        </button>
      </div>
    </div>
  `).join("");

  // Attach card event listeners
  container.querySelectorAll(".btn-use-scheme").forEach(btn => {
    btn.addEventListener("click", () => {
      const schemeId = btn.dataset.id;
      switchAppMode('universal');
      const select = document.getElementById("univ-loan-scheme");
      if (select) select.value = schemeId;
      applySchemeToUniversalCalculator(schemeId);
    });
  });

  container.querySelectorAll(".btn-edit-scheme").forEach(btn => {
    btn.addEventListener("click", () => {
      openSchemeModalEdit(btn.dataset.id);
    });
  });
}

// ============================================================
// 8. Centralized Saved Records Archive (Universal + Vehicles)
// ============================================================
function getAllSavedRecords() {
  try {
    const raw = localStorage.getItem("gscs_saved_loan_records");
    if (raw) return JSON.parse(raw);

    // Fallback & Migrate legacy vehicle records if any
    const legacyVeh = localStorage.getItem("gscs_saved_vehicle_loans");
    if (legacyVeh) {
      const parsedVeh = JSON.parse(legacyVeh);
      if (Array.isArray(parsedVeh)) {
        const migrated = parsedVeh.map(v => ({
          id: v.id,
          date: v.date,
          timestamp: v.timestamp || Date.now(),
          type: "vehicle",
          schemeName: `ස්වශක්ති වාහන ණය (${v.vehicleName || 'Vehicle'})`,
          memberId: v.memberId,
          memberName: v.memberName,
          g1Acc: v.g1Acc,
          g2Acc: v.g2Acc,
          grossLoan: v.vehPrice || 0,
          rate: v.rate || 18,
          period: v.period || 24,
          method: "reducing",
          totalDeductions: v.totalDocFees || 0,
          netDisbursement: v.requiredLoan || 0,
          emi: 0,
          vehicleData: v
        }));
        localStorage.setItem("gscs_saved_loan_records", JSON.stringify(migrated));
        return migrated;
      }
    }
    return [];
  } catch(e) {
    return [];
  }
}

function saveAllRecordsArray(arr) {
  localStorage.setItem("gscs_saved_loan_records", JSON.stringify(arr));
  updateSavedRecordsBadge();
  updateTopHeroStats();
}

function updateSavedRecordsBadge() {
  const count = getAllSavedRecords().length;
  const badge1 = document.getElementById("sidebar-saved-count");
  if (badge1) badge1.textContent = count;
  const badge2 = document.getElementById("saved-loans-count-badge");
  if (badge2) badge2.textContent = count;
}

function initRecordsArchive() {
  updateSavedRecordsBadge();

  // Search & Filter listeners
  document.getElementById("archive-search-input")?.addEventListener("input", () => {
    renderArchiveTable();
  });
  document.getElementById("archive-filter-scheme")?.addEventListener("change", () => {
    renderArchiveTable();
  });
  document.getElementById("archive-sort-by")?.addEventListener("change", () => {
    renderArchiveTable();
  });

  // Export CSV
  document.getElementById("btn-export-all-loans-csv")?.addEventListener("click", () => {
    exportArchiveToCSV();
  });

  // Clear Archive
  document.getElementById("btn-clear-archive")?.addEventListener("click", () => {
    const records = getAllSavedRecords();
    if (records.length === 0) return;
    if (confirm("ලේඛනාගාරයේ ඇති සියලුම ණය වාර්තා ස්ථිරවම මකා දැමීමට සහතිකද?")) {
      saveAllRecordsArray([]);
      renderArchiveTable();
      showToast("සියලුම වාර්තා මකා දමන ලදී.", "warning", "මකා දැමිණි");
    }
  });
}

function renderArchiveTable() {
  const tbody = document.getElementById("archive-loans-tbody");
  if (!tbody) return;

  const records = getAllSavedRecords();
  const searchQ = document.getElementById("archive-search-input")?.value.trim().toLowerCase() || "";
  const schemeFilter = document.getElementById("archive-filter-scheme")?.value || "all";
  const sortBy = document.getElementById("archive-sort-by")?.value || "newest";

  // Populate scheme filter options
  const filterSelect = document.getElementById("archive-filter-scheme");
  if (filterSelect && filterSelect.options.length <= 1) {
    const uniqueSchemes = [...new Set(records.map(r => r.schemeName))];
    uniqueSchemes.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      filterSelect.appendChild(opt);
    });
  }

  let filtered = records.filter(r => {
    const matchesSearch = !searchQ || 
      (r.memberId && r.memberId.toLowerCase().includes(searchQ)) ||
      (r.memberName && r.memberName.toLowerCase().includes(searchQ)) ||
      (r.schemeName && r.schemeName.toLowerCase().includes(searchQ)) ||
      (r.nic && r.nic.toLowerCase().includes(searchQ)) ||
      (r.g1Acc && r.g1Acc.toLowerCase().includes(searchQ));

    const matchesScheme = schemeFilter === "all" || r.schemeName === schemeFilter;
    return matchesSearch && matchesScheme;
  });

  // Sort
  if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } else if (sortBy === 'oldest') {
    filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  } else if (sortBy === 'amount-high') {
    filtered.sort((a, b) => (b.grossLoan || b.netDisbursement || 0) - (a.grossLoan || a.netDisbursement || 0));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 36px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2.4rem; opacity: 0.35; display:block; margin-bottom: 8px;"></i>
          සුරකින ලද ණය වාර්තා කිසිවක් හමු නොවීය
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td style="text-align: left;">
        <div style="font-weight: 800; color: var(--text-main);">${r.memberName}</div>
        <div style="font-size: 0.76rem; color: var(--accent-blue); font-weight: 700;">${r.memberId}</div>
      </td>
      <td style="text-align: left;">
        <span class="record-type-pill">${r.schemeName}</span>
      </td>
      <td style="font-weight: 700; color: var(--accent-purple);">${formatCurrency(r.grossLoan || r.netDisbursement)}</td>
      <td style="color: var(--accent-rose); font-weight: 600;">${formatCurrency(r.totalDeductions || 0)}</td>
      <td style="font-weight: 800; color: var(--accent-emerald); font-size: 0.95rem;">${formatCurrency(r.netDisbursement)}</td>
      <td style="font-weight: 700; color: var(--accent-gold);">${r.emi ? formatCurrency(r.emi) : '–'}</td>
      <td style="font-size: 0.82rem; font-weight: 600;">${r.period} මාස (${r.rate}%)</td>
      <td style="font-size: 0.78rem; color: var(--text-muted);">${r.date}</td>
      <td style="text-align: center;">
        <div style="display: inline-flex; gap: 5px;">
          <button class="btn-action btn-emerald btn-arch-print" data-id="${r.id}" title="A4 Print Slip (A5 පිටපත් 2)" style="padding: 5px 8px; font-size: 0.76rem;">
            <i class="fa-solid fa-print"></i>
          </button>
          <button class="btn-action btn-blue btn-arch-load" data-id="${r.id}" title="ගණකයට නැවත ඇතුළත් කරන්න" style="padding: 5px 8px; font-size: 0.76rem;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
          <button class="btn-action btn-arch-delete" data-id="${r.id}" title="මකන්න" style="padding: 5px 8px; font-size: 0.76rem; color: var(--accent-rose); border-color: rgba(244,63,94,0.3);">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");

  // Attach actions
  tbody.querySelectorAll(".btn-arch-print").forEach(btn => {
    btn.addEventListener("click", () => {
      const rec = records.find(r => r.id === btn.dataset.id);
      if (rec) {
        if (rec.type === 'vehicle') {
          printVehicleLoanSlip(rec.vehicleData || rec);
        } else {
          printUniversalLoanSlip(rec);
        }
      }
    });
  });

  tbody.querySelectorAll(".btn-arch-load").forEach(btn => {
    btn.addEventListener("click", () => {
      const rec = records.find(r => r.id === btn.dataset.id);
      if (rec) loadRecordIntoCalculator(rec);
    });
  });

  tbody.querySelectorAll(".btn-arch-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const rec = records.find(r => r.id === btn.dataset.id);
      if (rec && confirm(`"${rec.memberName}" ගේ වාර්තාව මකා දැමීමට සහතිකද?`)) {
        const updated = records.filter(r => r.id !== btn.dataset.id);
        saveAllRecordsArray(updated);
        renderArchiveTable();
        showToast("වාර්තාව සාර්ථකව ඉවත් කරන ලදී.", "warning", "මකා දැමිණි");
      }
    });
  });
}

function loadRecordIntoCalculator(rec) {
  if (rec.type === 'vehicle') {
    switchAppMode('vehicle');
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    setVal("veh-member-id", rec.memberId || "");
    setVal("veh-member-name", rec.memberName || "");
    setVal("veh-loan-type", rec.loanType || "ස්වශක්ති ණය 01");
    setVal("veh-g1-account", rec.g1Acc || "");
    setVal("veh-g2-account", rec.g2Acc || "");
    setVal("veh-loan-period", rec.period || 24);
    setVal("veh-loan-rate", rec.rate || 18);
    if (rec.vehPrice) setVal("veh-price", rec.vehPrice);
    if (rec.regFee !== undefined) setVal("veh-reg-fee", rec.regFee);
    if (rec.vehIns !== undefined) setVal("veh-insurance-fee", rec.vehIns);
    if (rec.downPayment !== undefined) setVal("veh-down-payment", rec.downPayment);

    if (rec.borrowerShares !== undefined) setVal("fee-borrower-shares", rec.borrowerShares);
    if (rec.g1 !== undefined) setVal("fee-guarantor1-shares", rec.g1);
    if (rec.g2 !== undefined) setVal("fee-guarantor2-shares", rec.g2);
    if (rec.docFee !== undefined) setVal("fee-doc", rec.docFee);
    if (rec.serviceFund !== undefined) setVal("fee-service-fund", rec.serviceFund);
    if (rec.loanIns !== undefined) setVal("fee-loan-insurance", rec.loanIns);
    if (rec.swashakthi !== undefined) setVal("fee-swashakthi-fund", rec.swashakthi);
    if (rec.building !== undefined) setVal("fee-building-fund", rec.building);
    if (rec.borrowerDeposit !== undefined) setVal("fee-borrower-deposit", rec.borrowerDeposit);

    updateVehicleCalculation();
  } else {
    switchAppMode('universal');
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    setVal("univ-member-id", rec.memberId || "");
    setVal("univ-member-name", rec.memberName || "");
    setVal("univ-g1-acc", rec.g1Acc || "");
    setVal("univ-g2-acc", rec.g2Acc || "");
    setVal("univ-loan-amount", rec.grossLoan || "");
    setVal("univ-interest-rate", rec.rate || "");
    setVal("univ-loan-tenure", rec.period || "");
    setVal("univ-loan-remarks", rec.remarks || "");

    if (rec.savings !== undefined) document.getElementById("univ-fee-savings").value = rec.savings;
    if (rec.serviceFund !== undefined) document.getElementById("univ-fee-service").value = rec.serviceFund;
    if (rec.buildingFund !== undefined) document.getElementById("univ-fee-building").value = rec.buildingFund;
    if (rec.loanInsurance !== undefined) document.getElementById("univ-fee-insurance").value = rec.loanInsurance;
    if (rec.memberShares !== undefined) document.getElementById("univ-fee-member-shares").value = rec.memberShares;
    if (rec.securityDeposit !== undefined) document.getElementById("univ-fee-security").value = rec.securityDeposit;
    if (rec.stationery !== undefined) document.getElementById("univ-fee-stationery").value = rec.stationery;
    if (rec.welfareFund !== undefined) document.getElementById("univ-fee-welfare").value = rec.welfareFund;
    if (rec.existingLoan !== undefined) document.getElementById("univ-fee-existing-loan").value = rec.existingLoan;
    if (rec.existingInterest !== undefined) document.getElementById("univ-fee-existing-interest").value = rec.existingInterest;
    if (rec.g1Shares !== undefined) document.getElementById("univ-fee-g1-shares").value = rec.g1Shares;
    if (rec.g2Shares !== undefined) document.getElementById("univ-fee-g2-shares").value = rec.g2Shares;

    updateUniversalCalculation();
  }
  showToast(`"${rec.memberName}" ගේ දත්ත ගණකයට ඇතුළත් කරන ලදී.`, "info", "දත්ත ඇතුළත් විය");
}

function exportArchiveToCSV() {
  const records = getAllSavedRecords();
  if (records.length === 0) {
    showToast("අපනයනය කිරීමට වාර්තා කිසිවක් නැත.", "warning");
    return;
  }

  const headers = [
    "ID", "Date", "Member ID", "Member Name", "NIC", "Phone", 
    "Loan Scheme", "Gross Loan", "Total Deductions", "Net Disbursement", 
    "Interest Rate %", "Period (Months)", "EMI", "Guarantor 1 A/C", "Guarantor 2 A/C"
  ];

  const rows = records.map(r => [
    r.id,
    `"${r.date}"`,
    `"${r.memberId || ''}"`,
    `"${r.memberName || ''}"`,
    `"${r.nic || ''}"`,
    `"${r.phone || ''}"`,
    `"${r.schemeName || ''}"`,
    r.grossLoan || r.netDisbursement || 0,
    r.totalDeductions || 0,
    r.netDisbursement || 0,
    r.rate || 0,
    r.period || 0,
    r.emi || 0,
    `"${r.g1Acc || ''}"`,
    `"${r.g2Acc || ''}"`
  ]);

  let csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `GSCS_Bank_Loans_Archive_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Excel / CSV ගොනුව සාර්ථකව බාගත කරන ලදී.", "success");
}

// ============================================================
// 9. Top Hero Stats Live Synchronizer
// ============================================================
function updateTopHeroStats() {
  const records = getAllSavedRecords();
  const totalCount = records.length;
  
  let totalNetDisbursed = 0;
  let totalDeductionsCollected = 0;

  records.forEach(r => {
    totalNetDisbursed += (r.netDisbursement || 0);
    totalDeductionsCollected += (r.totalDeductions || 0);
  });

  const activeSchemesCount = loanSchemesDatabase.length;

  const el1 = document.getElementById("stat-pill-1-val");
  const el2 = document.getElementById("stat-pill-2-val");
  const el3 = document.getElementById("stat-pill-3-val");
  const el4 = document.getElementById("stat-pill-4-val");

  if (el1) el1.textContent = `${totalCount} Records`;
  if (el2) el2.textContent = formatCurrency(totalNetDisbursed);
  if (el3) el3.textContent = formatCurrency(totalDeductionsCollected);
  if (el4) el4.textContent = `${activeSchemesCount} Schemes`;
}

// ============================================================
// 10. Universal Official Dual A4 Receipt Voucher Printing
// ============================================================
function printUniversalLoanSlip(record) {
  const fmtR = v => "රු. " + Number(v || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  const printCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&display=swap');
    @page { size: A4 portrait; margin: 3mm 5mm; }
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: #fff;
      color: #000;
      font-family: 'Noto Sans Sinhala', 'Inter', Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .wrap {
      width: 100%;
      max-width: 198mm;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 290mm;
      box-sizing: border-box;
    }
    .slip {
      width: 100%;
      height: 139mm;
      max-height: 139mm;
      border: 1.2px solid #000;
      padding: 3.5mm 5.5mm;
      display: flex;
      flex-direction: column;
      page-break-inside: avoid;
      box-sizing: border-box;
      overflow: hidden;
    }
    .slip-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .slip-head { border-bottom: 1.5px solid #000; padding-bottom: 2mm; margin-bottom: 2mm; }
    .slip-head table { width: 100%; border-collapse: collapse; }
    .slip-head td { padding: 0; vertical-align: middle; }
    .slip-head td:last-child { text-align: right; }
    .slip-bank { font-size: 12.5pt; font-weight: 900; color: #000; letter-spacing: -0.02em; line-height: 1.1; margin-top: 1px; }
    .slip-sub  { font-size: 7.8pt; color: #000; margin-top: 1.5px; font-weight: 700; }
    .slip-sub-en { font-size: 6.5pt; color: #333; }
    .slip-date { font-size: 7.8pt; color: #000; font-weight: 600; }
    .slip-staff {
      font-size: 6.2pt; font-weight: 800; color: #000;
      border: 1.2px solid #000; border-radius: 10px;
      padding: 1.5px 7px; display: inline-block; margin-top: 2px;
    }
    .slip-copy-badge {
      display: inline-block;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.4px;
      color: #000;
      background: #e0e0e0 !important;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
      border: 1.2px solid #000;
      border-radius: 3px;
      padding: 1.5px 7px;
      margin-bottom: 2px;
    }
    .slip-veh {
      font-size: 9.2pt; font-weight: 800; color: #000;
      border: 1.2px solid #000; display: inline-block;
      padding: 2px 9px; margin-bottom: 2.5mm; align-self: flex-start;
      background: #f4f4f4 !important;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .content-grid { width: 100%; border-collapse: collapse; flex: 1; }
    .content-grid > tbody > tr > td { vertical-align: top; padding: 0; }
    .col-divider { width: 4.5mm; }

    .field-row { margin-bottom: 2.8mm; }
    .field-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm; margin-bottom: 2.8mm; }
    .field-lbl { font-size: 6.8pt; color: #000; font-weight: 700; display: block; margin-bottom: 0.8mm; }
    .field-line {
      border-bottom: 1px solid #000;
      min-height: 5.5mm;
      width: 100%;
      display: block;
      font-size: 8.5pt;
      font-weight: 700;
      color: #000;
      line-height: 5.5mm;
      padding-left: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .font-mono {
      font-family: 'Inter', Consolas, monospace, sans-serif;
      font-weight: 800;
    }
    .fee-tbl { width: 100%; border-collapse: collapse; font-size: 7.4pt; color: #000; }
    .fee-tbl thead th {
      background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
      color: #fff !important; padding: 3px 6px; font-weight: 700; font-size: 7.2pt;
      border: 1px solid #000; text-align: left;
    }
    .fee-tbl tbody tr:nth-child(even) td {
      background: #f4f4f4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .fee-tbl td { padding: 2.7px 6px; border: 1px solid #ccc; color: #000; font-size: 7.4pt; line-height: 1.35; }
    .fee-tbl td.r { text-align: right; font-weight: 700; }

    .sum-tbl { width: 100%; border-collapse: collapse; font-size: 7.6pt; margin-top: 3.5mm; }
    .sum-tbl td { padding: 3px 6px; border: 1px solid #ccc; color: #000; }
    .sum-tbl td.r { text-align: right; font-weight: 700; }
    .sum-tbl tr.hl td {
      background: #dcdcdc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
      border-top: 1.5px solid #000; font-weight: 900; font-size: 8.6pt; padding: 4px 6px;
    }
    .sum-tbl tr.hl td.r { font-size: 10.5pt; font-weight: 900; }

    .slip-sign-row {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8mm;
      margin-top: auto;
      padding-top: 5mm;
      padding-bottom: 1.5mm;
    }
    .sign-box { text-align: center; }
    .sign-line { border-bottom: 1.2px dotted #000; width: 100%; min-height: 15mm; }
    .sign-lbl { font-size: 7.5pt; font-weight: 800; color: #000; margin-top: 1.8mm; line-height: 1.1; }
    .sign-sub { font-size: 6.2pt; color: #555; margin-top: 0.5mm; }

    .cut-line {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 1mm 0;
      color: #555;
      font-size: 6.5pt;
      font-family: Arial, sans-serif;
    }
    .cut-line hr { flex: 1; border: none; border-top: 1.1px dashed #555; }
    .cut-label { font-size: 6.5pt; font-weight: 700; letter-spacing: 1px; }
  `;

  function createUniversalSlipHTML(copyName) {
    const isVehicle = record.type === 'vehicle';
    const methodText = record.method === 'flat' ? 'සමාන වාරික (Flat Rate)' : 'හීනවෙන ක්‍රමය (Reducing)';
    const bankTitle = isVehicle ? 'GSCS BANK – ස්වශක්ති වාහන ණය අංශය' : 'GSCS BANK – ණය නිකුත් කිරීමේ අංශය';
    const subTitle = isVehicle ? 'ස්වශක්ති වාහන ණය සහ අයකිරීම් කුවිතාන්සිය' : 'ණය මුදල් නිකුත් කිරීම සහ අරමුදල් අයකිරීම් කුවිතාන්සිය';
    const subTitleEn = isVehicle ? 'Swashakthi Vehicle Loan &amp; Fund Deductions Voucher Slip' : 'Loan Disbursement &amp; Fund Deductions Voucher Slip';
    const schemeBadge = isVehicle ? `&#x1F3CD;&nbsp; ${record.schemeName}` : `&#x1F4B3;&nbsp; ${record.schemeName}`;

    // Left summary table
    const summaryTableHTML = isVehicle ? `
              <table class="sum-tbl">
                <tr><td>වාහනයේ මිල (Vehicle Price)</td><td class="r">${fmtR(record.vehPrice)}</td></tr>
                <tr><td>ලේඛන ගාස්තු එකතුව (Total Fees)</td><td class="r">${fmtR(record.totalDocFees)}</td></tr>
                <tr><td>සම්පූර්ණ පිරිවැය (Total Cost)</td><td class="r">${fmtR(record.totalVehCost)}</td></tr>
                <tr><td>අඩු කළ මූලික ගෙවීම (Down Payment)</td><td class="r">(${fmtR(record.downPayment)})</td></tr>
                <tr class="hl"><td>අවශ්‍ය ණය මුදල (Net Loan)</td><td class="r">${fmtR(record.requiredLoan || record.netDisbursement)}</td></tr>
              </table>
    ` : `
              <table class="sum-tbl">
                <tr><td>අනුමත ණය මුදල (Gross)</td><td class="r">${fmtR(record.grossLoan)}</td></tr>
                <tr><td>මුළු අයකිරීම් එකතුව (Deductions)</td><td class="r" style="color: #000;">(${fmtR(record.totalDeductions)})</td></tr>
                <tr class="hl"><td>නිකුත් කරන ශුද්ධ මුදල (Net)</td><td class="r">${fmtR(record.netDisbursement)}</td></tr>
              </table>
    `;

    // Right deductions table
    const deductionsTableHTML = isVehicle ? `
              <table class="fee-tbl">
                <thead>
                  <tr><th>අයකිරීම් විස්තරය (Deduction Item)</th><th style="text-align:right;">මුදල (Rs.)</th></tr>
                </thead>
                <tbody>
                  <tr><td>1. ණයකරු කොටස් (Borrower Shares)</td><td class="r">${fmtR(record.borrowerShares)}</td></tr>
                  <tr><td>2. ණයකරු තැන්පතු (Borrower Deposit)</td><td class="r">${fmtR(record.borrowerDeposit)}</td></tr>
                  <tr><td>3. ඇපකරු 1 කොටස් (Guarantor 1 Shares)</td><td class="r">${fmtR(record.g1)}</td></tr>
                  <tr><td>4. ඇපකරු 2 කොටස් (Guarantor 2 Shares)</td><td class="r">${fmtR(record.g2)}</td></tr>
                  <tr><td>5. ගොඩනැගිලි අරමුදල (Building Fund)</td><td class="r">${fmtR(record.building)}</td></tr>
                  <tr><td>6. සමිති දායකත්වය (Swashakthi Fund)</td><td class="r">${fmtR(record.swashakthi)}</td></tr>
                  <tr><td>7. ලිපි ගාස්තු (Documentation Fee)</td><td class="r">${fmtR(record.docFee)}</td></tr>
                  <tr><td>8. සේවා අරමුදල (Service Fund)</td><td class="r">${fmtR(record.serviceFund)}</td></tr>
                  <tr><td>9. ණය රක්ෂණය (Loan Insurance)</td><td class="r">${fmtR(record.loanIns)}</td></tr>
                  <tr><td>10. වාහන ලියාපදිංචි ගාස්තු (Reg. Fee)</td><td class="r">${fmtR(record.regFee)}</td></tr>
                  <tr><td>11. වාහන රක්ෂණ ගාස්තු (Vehicle Insurance)</td><td class="r">${fmtR(record.vehIns)}</td></tr>
                  <tr style="font-weight: 800; background: #e8f5e9 !important;"><td>මුළු ගාස්තු එකතුව (Total Fees)</td><td class="r font-mono" style="font-weight: 900;">${fmtR(record.totalDocFees)}</td></tr>
                </tbody>
              </table>
    ` : `
              <table class="fee-tbl">
                <thead>
                  <tr><th>අයකිරීම් විස්තරය (Deduction Item)</th><th style="text-align:right;">මුදල (Rs.)</th></tr>
                </thead>
                <tbody>
                  <tr><td>1. ඉතිරිකිරීම් තැන්පතු (Savings Deposit)</td><td class="r">${fmtR(record.savings)}</td></tr>
                  <tr><td>2. සේවා අරමුදල (Service Fund)</td><td class="r">${fmtR(record.serviceFund)}</td></tr>
                  <tr><td>3. ගොඩනැගිලි අරමුදල (Building Fund)</td><td class="r">${fmtR(record.buildingFund)}</td></tr>
                  <tr><td>4. ණය රක්ෂණය (Loan Insurance)</td><td class="r">${fmtR(record.loanInsurance)}</td></tr>
                  <tr><td>5. සාමාජික කොටස් (Member Shares)</td><td class="r">${fmtR(record.memberShares)}</td></tr>
                  <tr><td>6. සුරැකුම් තැන්පතු (Security Deposit)</td><td class="r">${fmtR(record.securityDeposit)}</td></tr>
                  <tr><td>7. ලිපි ද්‍රව්‍ය ගාස්තු (Stationery Fee)</td><td class="r">${fmtR(record.stationery)}</td></tr>
                  <tr><td>8. සුබසාධන අරමුදල (Welfare Fund)</td><td class="r">${fmtR(record.welfareFund)}</td></tr>
                  <tr><td>9. ගෙවීමට ඇති ණය (Existing Loan)</td><td class="r">${fmtR(record.existingLoan)}</td></tr>
                  <tr><td>10. ගෙවීමට ඇති පොලිය (Interest Due)</td><td class="r">${fmtR(record.existingInterest)}</td></tr>
                  <tr><td>11. ඇපකරු 1 කොටස් (G1 Shares)</td><td class="r">${fmtR(record.g1Shares)}</td></tr>
                  <tr><td>12. ඇපකරු 2 කොටස් (G2 Shares)</td><td class="r">${fmtR(record.g2Shares)}</td></tr>
                </tbody>
              </table>
    `;

    return `
    <div class="slip">
      <div class="slip-inner">
        <div class="slip-body-top">

          <!-- Header -->
          <div class="slip-head">
            <table><tr>
              <td>
                <div class="slip-copy-badge">${copyName}</div>
                <div class="slip-bank">${bankTitle}</div>
                <div class="slip-sub">${subTitle}</div>
                <div class="slip-sub-en">${subTitleEn}</div>
              </td>
              <td>
                <div class="slip-date">${record.date}</div>
                <div class="slip-staff">ASST. MANAGER SYSTEM</div>
              </td>
            </tr></table>
          </div>

          <!-- Scheme Name Badge -->
          <div class="slip-veh">${schemeBadge}</div>

          <!-- Two Column Layout -->
          <table class="content-grid"><tbody><tr>
            
            <!-- LEFT: Member & Loan Info + Final Summary -->
            <td style="width: 44%;">
              <div class="field-row-grid">
                <div>
                  <span class="field-lbl">සාමාජික අංකය (Member A/C):</span>
                  <span class="field-line font-mono" style="font-size: 10.5pt; font-weight: 900; color: #000; letter-spacing: 0.5px;">${record.memberId || '–'}</span>
                </div>
                <div>
                  <span class="field-lbl">සාමාජිකයා (Member Name):</span>
                  <span class="field-line" style="font-size: 8.5pt; font-weight: 800; color: #000;">${record.memberName || '–'}</span>
                </div>
              </div>

              <div class="field-row-grid">
                <div>
                  <span class="field-lbl">ඇපකරු 1 A/C:</span>
                  <span class="field-line font-mono" style="font-size: 10pt; font-weight: 900; color: #000; letter-spacing: 0.5px;">${record.g1Acc || '–'}</span>
                </div>
                <div>
                  <span class="field-lbl">ඇපකරු 2 A/C:</span>
                  <span class="field-line font-mono" style="font-size: 10pt; font-weight: 900; color: #000; letter-spacing: 0.5px;">${record.g2Acc || '–'}</span>
                </div>
              </div>

              <div class="field-row-grid">
                <div>
                  <span class="field-lbl">කාලය / Period:</span>
                  <span class="field-line">${record.period} මාස (${record.rate}%)</span>
                </div>
                <div>
                  <span class="field-lbl">වාරික ක්‍රමය:</span>
                  <span class="field-line" style="font-size: 6.8pt;">${methodText}</span>
                </div>
              </div>

              <!-- Summary Table -->
              ${summaryTableHTML}
            </td>

            <td class="col-divider"></td>

            <!-- RIGHT: Deductions Breakdown Table -->
            <td style="width: 52%;">
              ${deductionsTableHTML}
            </td>

          </tr></tbody></table>

        </div>

        <!-- 3 Official Signature Blocks -->
        <div class="slip-sign-row">
          <div class="sign-box">
            <div class="sign-line"></div>
            <div class="sign-lbl">ණය නිකුත් කළ නිලධාරී</div>
            <div class="sign-sub">Loan Issuing Officer</div>
          </div>
          <div class="sign-box">
            <div class="sign-line"></div>
            <div class="sign-lbl">පරීක්ෂා කළ නිලධාරී</div>
            <div class="sign-sub">Checking Officer</div>
          </div>
          <div class="sign-box">
            <div class="sign-line"></div>
            <div class="sign-lbl">මුදල් අයකැමි (Cashier)</div>
            <div class="sign-sub">Cashier</div>
          </div>
        </div>

      </div>
    </div>
    `;
  }

  const slipCashier = createUniversalSlipHTML("CASHIER COPY / මුදල් අයකැමි පිටපත");
  const slipCustomer = createUniversalSlipHTML("CUSTOMER / OFFICE FILE COPY");

  const fullHTML = `<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>GSCS BANK – Loan Disbursement Voucher Slip</title>
  <style>${printCSS}</style>
</head>
<body>
  <div class="wrap">
    ${slipCashier}
    <div class="cut-line"><hr> <span class="cut-label">✂ CUT HERE (මෙහිදී වෙන් කරන්න) ✂</span> <hr></div>
    ${slipCustomer}
  </div>
</body>
</html>`;

  let iframe = document.getElementById("_univ_print_frame");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "_univ_print_frame";
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;";
    document.body.appendChild(iframe);
  }

  iframe.srcdoc = fullHTML;
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 500);
  };
}

// ============================================================
// 11. Swashakthi Vehicle Loan Calculator & Dual-Slip Printing
// ============================================================
function initVehicleCalculator() {
  loadSavedVehicles();
  populateVehicleDropdown();

  // Attach event listeners to all vehicle inputs
  document.querySelectorAll(".veh-input").forEach(input => {
    input.addEventListener("input", () => {
      updateVehicleCalculation();
    });
  });

  document.getElementById("vehicle-select")?.addEventListener("change", (e) => {
    selectVehicle(e.target.value);
  });

  document.getElementById("btn-apply-veh-loan")?.addEventListener("click", () => {
    applyVehicleLoanAmount(lastCalculatedVehicleLoanAmount);
  });

  // Modal event listeners (Add & Edit Vehicle)
  document.getElementById("btn-add-vehicle-modal")?.addEventListener("click", () => {
    openVehicleModalAdd();
  });


  document.getElementById("btn-close-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "none";
  });

  document.getElementById("btn-cancel-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "none";
  });

  // Delete vehicle handler
  document.getElementById("btn-delete-vehicle")?.addEventListener("click", () => {
    const editId = document.getElementById("m-veh-edit-id")?.value;
    if (!editId) return;
    const v = vehicleDatabase.find(x => x.id === editId);
    const vName = v ? v.name : "මෙම වාහනය";
    if (!confirm(`«${vName}» වාහනය පද්ධතියෙන් ඉවත් කිරීමට ඔබට විශ්වාසද?`)) return;

    vehicleDatabase = vehicleDatabase.filter(x => x.id !== editId);
    saveVehiclesToStorage();
    populateVehicleDropdown();
    if (vehicleDatabase.length > 0) {
      selectVehicle(vehicleDatabase[0].id);
    }
    const modal = document.getElementById("modal-add-vehicle");
    if (modal) modal.style.display = "none";
    showToast(`«${vName}» වාහනය සාර්ථකව ඉවත් කරන ලදී.`, "info", "ඉවත් කෙරිණි");
  });

  // Vehicle type icon picker — click to select
  document.querySelectorAll(".veh-type-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedType = btn.dataset.type;
      const selectedIcon = btn.dataset.icon;

      // Update hidden field
      const typeHidden = document.getElementById("m-veh-type");
      if (typeHidden) typeHidden.value = selectedType;

      // Update button styles
      document.querySelectorAll(".veh-type-btn").forEach(b => {
        const active = b.dataset.type === selectedType;
        b.style.border = active ? "2px solid var(--accent-amber)" : "2px solid var(--border-color)";
        b.style.background = active ? "var(--accent-amber)" : "var(--bg-input)";
        b.style.color = active ? "#fff" : "var(--text-primary)";
      });

      // Update modal header icon
      const modalIcon = document.querySelector("#modal-title i");
      if (modalIcon) {
        modalIcon.className = `fa-solid ${selectedIcon}`;
        modalIcon.style.color = "var(--accent-amber)";
      }
    });
  });

  document.getElementById("form-add-vehicle")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("m-veh-edit-id")?.value;
    const name = document.getElementById("m-veh-name")?.value.trim();
    const price = parseFloat(document.getElementById("m-veh-price")?.value) || 0;
    const regFee = parseFloat(document.getElementById("m-veh-reg")?.value) || 0;
    const vehicleInsurance = parseFloat(document.getElementById("m-veh-insurance")?.value) || 0;
    const downPayment = parseFloat(document.getElementById("m-veh-down")?.value) || 0;
    const vehType = document.getElementById("m-veh-type")?.value || "bike";

    if (!name || price <= 0) {
      showToast("කරුණාකර වලංගු වාහනයේ නම සහ මිලක් ඇතුළත් කරන්න.", "warning");
      return;
    }

    if (editId) {
      const v = vehicleDatabase.find(x => x.id === editId);
      if (v) {
        v.name = name;
        v.type = vehType;
        v.price = price;
        v.regFee = regFee;
        v.vehicleInsurance = vehicleInsurance;
        v.downPayment = downPayment;
      }
    } else {
      const newVeh = {
        id: "veh_" + Date.now(),
        name,
        type: vehType,
        price,
        regFee,
        vehicleInsurance,
        downPayment
      };
      vehicleDatabase.unshift(newVeh);
    }

    saveVehiclesToStorage();
    populateVehicleDropdown();
    selectVehicle(editId || vehicleDatabase[0].id);

    const modal = document.getElementById("modal-add-vehicle");
    if (modal) modal.style.display = "none";
    if (editId) {
      showToast(`"${name}" වාහනයේ විස්තර සාර්ථකව යාවත්කාලීන කරන ලදී.`, "success", "යාවත්කාලීනයි");
    } else {
      showToast(`"${name}" වාහනය සාර්ථකව පද්ධතියට එක් කරන ලදී.`, "success", "සාර්ථකයි");
    }
  });

  // Direct Save & Print Vehicle Loan (no modal needed)
  document.getElementById("btn-save-veh-loan-modal")?.addEventListener("click", () => {
    saveAndPrintVehicleLoanDirect();
  });

  updateVehicleCalculation();
}

function saveAndPrintVehicleLoanDirect() {
  const vehSelectEl = document.getElementById("vehicle-select");
  const selectedVehName = vehSelectEl?.options[vehSelectEl.selectedIndex]?.text?.split(" - ")[0] || "වාහනය";
  const memberId    = document.getElementById("veh-member-id")?.value.trim() || "";
  const memberName  = document.getElementById("veh-member-name")?.value.trim() || "";
  const loanType    = document.getElementById("veh-loan-type")?.value.trim() || "ස්වශක්ති ණය 01";
  const g1Acc       = document.getElementById("veh-g1-account")?.value.trim() || "";
  const g2Acc       = document.getElementById("veh-g2-account")?.value.trim() || "";
  const period      = parseInt(document.getElementById("veh-loan-period")?.value) || 24;
  const rate        = parseFloat(document.getElementById("veh-loan-rate")?.value) || 18;

  if (!memberName) {
    showToast("කරුණාකර සාමාජිකයාගේ නම ඇතුළත් කරන්න.", "warning", "අවශ්‍යයි");
    document.getElementById("veh-member-name")?.focus();
    return;
  }

  const vehPrice       = parseInputNumber("veh-price", 0);
  const regFee         = parseInputNumber("veh-reg-fee", 0);
  const vehIns         = parseInputNumber("veh-insurance-fee", 0);
  const downPayment    = parseInputNumber("veh-down-payment", 0);
  const borrowerShares = parseInputNumber("fee-borrower-shares", 0);
  const g1             = parseInputNumber("fee-guarantor1-shares", 0);
  const g2             = parseInputNumber("fee-guarantor2-shares", 0);
  const docFee         = parseInputNumber("fee-doc", 0);
  const serviceFund    = parseInputNumber("fee-service-fund", 0);
  const loanIns        = parseInputNumber("fee-loan-insurance", 0);
  const swashakthi     = parseInputNumber("fee-swashakthi-fund", 0);
  const building       = parseInputNumber("fee-building-fund", 0);
  const borrowerDeposit = parseInputNumber("fee-borrower-deposit", 0);

  const totalDocFees   = borrowerShares + g1 + g2 + docFee + serviceFund + loanIns + swashakthi + building + borrowerDeposit + regFee + vehIns;
  const totalVehCost   = vehPrice + totalDocFees;
  const requiredLoan   = Math.max(0, totalVehCost - downPayment);

  const vehRecord = {
    id: "saveloan_" + Date.now(),
    date: new Date().toLocaleDateString('si-LK', { year:'numeric', month:'short', day:'numeric' }),
    timestamp: Date.now(),
    type: "vehicle",
    schemeName: `${loanType} (${selectedVehName})`,
    memberId,
    memberName,
    loanType,
    g1Acc,
    g2Acc,
    period,
    rate,
    grossLoan: totalVehCost,
    totalDeductions: downPayment,
    netDisbursement: requiredLoan,
    vehicleName: selectedVehName,
    vehPrice,
    regFee,
    vehIns,
    downPayment,
    borrowerShares,
    g1, g2,
    docFee,
    serviceFund,
    loanIns,
    swashakthi,
    building,
    borrowerDeposit,
    totalDocFees,
    totalVehCost,
    requiredLoan
  };
  vehRecord.vehicleData = vehRecord;

  const archive = getAllSavedRecords();
  archive.unshift(vehRecord);
  saveAllRecordsArray(archive);

  showToast(`"${vehRecord.memberName}" ගේ වාහන ණය සුරැකි අතර Print Preview විවෘත වේ...`, "success", "සුරකින ලදී & Print");
  printVehicleLoanSlip(vehRecord);
}

function selectVehicle(id) {
  const select = document.getElementById("vehicle-select");
  if (select) select.value = id;

  document.querySelectorAll(".vehicle-tile").forEach(tile => {
    if (tile.dataset.id === id) {
      tile.classList.add("active");
    } else {
      tile.classList.remove("active");
    }
  });

  const veh = vehicleDatabase.find(v => v.id === id);
  if (veh) {
    document.getElementById("veh-price").value = veh.price;
    document.getElementById("veh-reg-fee").value = veh.regFee;
    document.getElementById("veh-insurance-fee").value = veh.vehicleInsurance;
    document.getElementById("veh-down-payment").value = veh.downPayment;
    updateVehicleCalculation();
  }
}

function getVehicleIconClass(type) {
  switch (type) {
    case 'bike':
    case 'motorcycle':
      return 'fa-solid fa-motorcycle';
    case 'threewheel':
    case 'three-wheeler':
      return 'fa-solid fa-truck-pickup';
    case 'car':
      return 'fa-solid fa-car';
    case 'van':
      return 'fa-solid fa-van-shuttle';
    case 'bus':
      return 'fa-solid fa-bus';
    case 'lorry':
    case 'truck':
      return 'fa-solid fa-truck';
    case 'other':
    default:
      return 'fa-solid fa-shapes';
  }
}

function renderVehicleTiles(filterQuery = "") {
  const container = document.getElementById("vehicle-tiles-container");
  if (!container) return;

  const select = document.getElementById("vehicle-select");
  const selectedId = (select && select.value) ? select.value : (vehicleDatabase[0] ? vehicleDatabase[0].id : "");

  const q = filterQuery.trim().toLowerCase();
  const filtered = q
    ? vehicleDatabase.filter(v => v.name.toLowerCase().includes(q))
    : vehicleDatabase;

  let html = "";
  if (filtered.length === 0) {
    html = `<div class="veh-no-results"><i class="fa-solid fa-magnifying-glass"></i> <span>«${filterQuery}» සඳහා වාහන නැත</span></div>`;
  } else {
    filtered.forEach(v => {
      const isActive = v.id === selectedId;
      const typeLabel = { bike: "Bike", threewheel: "3-Wheel", car: "Car", van: "Van", bus: "Bus", lorry: "Lorry", other: "Other" }[v.type] || v.type;
      html += `
        <div class="vehicle-tile ${isActive ? 'active' : ''}" data-id="${v.id}" title="${v.name} තෝරන්න" style="position: relative;">
          <button type="button" class="btn-tile-edit" data-id="${v.id}" title="${v.name} සංස්කරණය කරන්න"
            style="position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.06); border: none; border-radius: 6px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); transition: all .2s; z-index: 2;">
            <i class="fa-solid fa-pen-to-square" style="font-size: 11px;"></i>
          </button>
          <div class="veh-tile-icon">
            <i class="${getVehicleIconClass(v.type)}"></i>
          </div>
          <div class="veh-tile-info">
            <div class="veh-tile-name" style="padding-right: 22px;">${v.name}</div>
            <div class="veh-tile-price">${formatCurrency(v.price)}</div>
            <div class="veh-tile-type">${typeLabel}</div>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = html;

  // Tile selection click
  container.querySelectorAll(".vehicle-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      selectVehicle(tile.dataset.id);
    });
  });

  // Tile edit button click
  container.querySelectorAll(".btn-tile-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openVehicleModalEdit(btn.dataset.id);
    });
  });
}

function openVehicleModalAdd() {
  const editIdInput = document.getElementById("m-veh-edit-id");
  if (editIdInput) editIdInput.value = "";
  const nameInput = document.getElementById("m-veh-name");
  if (nameInput) nameInput.value = "";
  const priceInput = document.getElementById("m-veh-price");
  if (priceInput) priceInput.value = "";
  const regInput = document.getElementById("m-veh-reg");
  if (regInput) regInput.value = "15000";
  const insInput = document.getElementById("m-veh-insurance");
  if (insInput) insInput.value = "18000";
  const downInput = document.getElementById("m-veh-down");
  if (downInput) downInput.value = "200000";

  // Hide delete button for new vehicle
  const deleteBtn = document.getElementById("btn-delete-vehicle");
  if (deleteBtn) deleteBtn.style.display = "none";

  // Reset vehicle type picker to Bike
  const typeHidden = document.getElementById("m-veh-type");
  if (typeHidden) typeHidden.value = "bike";
  document.querySelectorAll(".veh-type-btn").forEach(btn => {
    const isSelected = btn.dataset.type === "bike";
    btn.style.border = isSelected ? "2px solid var(--accent-amber)" : "2px solid var(--border-color)";
    btn.style.background = isSelected ? "var(--accent-amber)" : "var(--bg-input)";
    btn.style.color = isSelected ? "#fff" : "var(--text-primary)";
  });

  // Update modal header icon to bike
  const modalIcon = document.querySelector("#modal-title i");
  if (modalIcon) { modalIcon.className = "fa-solid fa-motorcycle"; modalIcon.style.color = "var(--accent-amber)"; }

  const titleText = document.getElementById("modal-title-text");
  if (titleText) titleText.textContent = "නව වාහනයක් ඇතුළත් කරන්න (Add Vehicle)";
  const saveLabel = document.getElementById("btn-save-label");
  if (saveLabel) saveLabel.textContent = "සුරකින්න";

  const modal = document.getElementById("modal-add-vehicle");
  if (modal) modal.style.display = "flex";
  nameInput?.focus();
}

function openVehicleModalEdit(vehicleId) {
  const v = vehicleDatabase.find(x => x.id === vehicleId);
  if (!v) return;

  const editIdInput = document.getElementById("m-veh-edit-id");
  if (editIdInput) editIdInput.value = v.id;
  const nameInput = document.getElementById("m-veh-name");
  if (nameInput) nameInput.value = v.name || "";
  const priceInput = document.getElementById("m-veh-price");
  if (priceInput) priceInput.value = v.price || "";
  const regInput = document.getElementById("m-veh-reg");
  if (regInput) regInput.value = v.regFee !== undefined ? v.regFee : "15000";
  const insInput = document.getElementById("m-veh-insurance");
  if (insInput) insInput.value = v.vehicleInsurance !== undefined ? v.vehicleInsurance : "18000";
  const downInput = document.getElementById("m-veh-down");
  if (downInput) downInput.value = v.downPayment !== undefined ? v.downPayment : "200000";

  // Show delete button when editing
  const deleteBtn = document.getElementById("btn-delete-vehicle");
  if (deleteBtn) deleteBtn.style.display = "inline-flex";

  // Match vehicle type and update picker buttons
  const vehType = v.type || "bike";
  const typeHidden = document.getElementById("m-veh-type");
  if (typeHidden) typeHidden.value = vehType;

  let chosenIcon = "fa-motorcycle";
  document.querySelectorAll(".veh-type-btn").forEach(btn => {
    const isSelected = btn.dataset.type === vehType;
    if (isSelected) chosenIcon = btn.dataset.icon || "fa-motorcycle";
    btn.style.border = isSelected ? "2px solid var(--accent-amber)" : "2px solid var(--border-color)";
    btn.style.background = isSelected ? "var(--accent-amber)" : "var(--bg-input)";
    btn.style.color = isSelected ? "#fff" : "var(--text-primary)";
  });

  const modalIcon = document.querySelector("#modal-title i");
  if (modalIcon) {
    modalIcon.className = `fa-solid ${chosenIcon}`;
    modalIcon.style.color = "var(--accent-amber)";
  }

  const titleText = document.getElementById("modal-title-text");
  if (titleText) titleText.textContent = "වාහන තොරතුරු සංස්කරණය (Edit Vehicle)";
  const saveLabel = document.getElementById("btn-save-label");
  if (saveLabel) saveLabel.textContent = "වෙනස්කම් සුරකින්න";

  const modal = document.getElementById("modal-add-vehicle");
  if (modal) modal.style.display = "flex";
  nameInput?.focus();
}

function saveVehiclesToStorage() {
  localStorage.setItem("gscs_vehicle_database", JSON.stringify(vehicleDatabase));
}

function loadSavedVehicles() {
  const savedAll = localStorage.getItem("gscs_vehicle_database");
  if (savedAll) {
    try {
      const parsed = JSON.parse(savedAll);
      if (Array.isArray(parsed) && parsed.length > 0) {
        vehicleDatabase = parsed;
        return;
      }
    } catch(e) {}
  }
  const savedCustom = localStorage.getItem("gscs_custom_vehicles");
  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (Array.isArray(parsed)) {
        parsed.forEach(v => {
          if (!vehicleDatabase.some(existing => existing.id === v.id)) {
            vehicleDatabase.unshift(v);
          }
        });
      }
    } catch(e) {}
  }
}

function populateVehicleDropdown() {
  const select = document.getElementById("vehicle-select");
  if (select) {
    select.innerHTML = "";
    vehicleDatabase.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = `${v.name} - ${formatCurrency(v.price)}`;
      select.appendChild(opt);
    });
  }

  const searchInput = document.getElementById("vehicle-search-input");
  if (searchInput && !searchInput._wired) {
    searchInput._wired = true;
    searchInput.addEventListener("input", () => {
      renderVehicleTiles(searchInput.value);
    });
  }

  renderVehicleTiles(searchInput?.value || "");
}

function updateVehicleCalculation() {
  const price = parseInputNumber("veh-price", 0);
  const regFee = parseInputNumber("veh-reg-fee", 0);
  const vehInsurance = parseInputNumber("veh-insurance-fee", 0);
  const downPayment = parseInputNumber("veh-down-payment", 0);

  const borrowerShares = parseInputNumber("fee-borrower-shares", 0);
  const g1Shares = parseInputNumber("fee-guarantor1-shares", 0);
  const g2Shares = parseInputNumber("fee-guarantor2-shares", 0);
  const docFee = parseInputNumber("fee-doc", 0);
  const serviceFund = parseInputNumber("fee-service-fund", 0);
  const loanInsurance = parseInputNumber("fee-loan-insurance", 0);
  const swashakthiFund = parseInputNumber("fee-swashakthi-fund", 0);
  const buildingFund = parseInputNumber("fee-building-fund", 0);
  const borrowerDeposit = parseInputNumber("fee-borrower-deposit", 0);

  const totalDocFees = borrowerShares + g1Shares + g2Shares + docFee + serviceFund + loanInsurance + swashakthiFund + buildingFund + borrowerDeposit + regFee + vehInsurance;
  const totalVehCost = price + totalDocFees;
  const rawLoanAmount = totalVehCost - downPayment;
  const requiredLoanAmount = Math.max(0, rawLoanAmount);

  lastCalculatedVehicleLoanAmount = requiredLoanAmount;

  const elDocFees = document.getElementById("veh-metric-doc-fees");
  const elTotalCost = document.getElementById("veh-metric-total-cost");
  const elDownPayment = document.getElementById("veh-metric-down-payment");
  const elRequiredLoan = document.getElementById("veh-metric-required-loan");
  const btnApply = document.getElementById("btn-apply-veh-loan");
  const warningEl = document.getElementById("veh-downpayment-warning");

  if (elDocFees) elDocFees.textContent = formatCurrency(totalDocFees);
  if (elTotalCost) elTotalCost.textContent = formatCurrency(totalVehCost);
  if (elDownPayment) elDownPayment.textContent = formatCurrency(downPayment);
  if (elRequiredLoan) elRequiredLoan.textContent = formatCurrency(requiredLoanAmount);

  if (warningEl) {
    warningEl.style.display = (downPayment > totalVehCost && totalVehCost > 0) ? "block" : "none";
  }

  if (btnApply) {
    btnApply.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket"></i> මෙම ණය මුදල වාරික ගණකයට යොදන්න (${formatCurrency(requiredLoanAmount)})`;
  }
}

function applyVehicleLoanAmount(amount) {
  if (amount <= 0) return;
  document.getElementById("loan-amount").value = amount;
  document.getElementById("loan-amount-slider").value = amount;
  switchAppMode('reducing');
  calculateAndRender();
}

function printVehicleLoanSlip(customData) {
  if (!customData) return;
  const v = customData.vehicleData || customData;
  const regFee = Number(v.regFee) || 0;
  const vehIns = Number(v.vehIns || v.vehicleInsurance) || 0;
  const borrowerShares = Number(v.borrowerShares) || 0;
  const borrowerDeposit = Number(v.borrowerDeposit) || 0;
  const g1 = Number(v.g1 || v.g1Shares) || 0;
  const g2 = Number(v.g2 || v.g2Shares) || 0;
  const building = Number(v.building || v.buildingFund) || 0;
  const swashakthi = Number(v.swashakthi || v.swashakthiFund) || 0;
  const docFee = Number(v.docFee) || 0;
  const serviceFund = Number(v.serviceFund) || 0;
  const loanIns = Number(v.loanIns || v.loanInsurance) || 0;

  const calculatedDocFees = borrowerShares + borrowerDeposit + g1 + g2 + building + swashakthi + docFee + serviceFund + loanIns + regFee + vehIns;
  const totalDocFees = (v.totalDocFees !== undefined && v.totalDocFees !== null) ? Number(v.totalDocFees) : calculatedDocFees;
  const vehPrice = Number(v.vehPrice) || 0;
  const totalVehCost = (v.totalVehCost !== undefined && v.totalVehCost !== null) ? Number(v.totalVehCost) : (vehPrice + totalDocFees);
  const downPayment = Number(v.downPayment) || 0;
  const requiredLoan = (v.requiredLoan !== undefined && v.requiredLoan !== null) ? Number(v.requiredLoan) : Math.max(0, totalVehCost - downPayment);

  const vehName = v.vehicleName || 'Vehicle';
  const loanType = v.loanType || 'ස්වශක්ති වාහන ණය';

  const record = {
    id: v.id || ("veh_" + Date.now()),
    date: v.date || new Date().toLocaleDateString('si-LK', { year:'numeric', month:'short', day:'numeric' }),
    type: 'vehicle',
    schemeName: v.schemeName || `${loanType} (${vehName})`,
    vehicleName: vehName,
    loanType: loanType,
    memberId: v.memberId || '',
    memberName: v.memberName || '',
    nic: v.nic || '',
    phone: v.phone || '',
    g1Acc: v.g1Acc || '',
    g2Acc: v.g2Acc || '',
    period: v.period || 24,
    rate: v.rate || 18,
    method: 'reducing',
    vehPrice,
    regFee,
    vehIns,
    downPayment,
    borrowerShares,
    borrowerDeposit,
    g1,
    g2,
    building,
    swashakthi,
    docFee,
    serviceFund,
    loanIns,
    totalDocFees,
    totalVehCost,
    requiredLoan,
    grossLoan: totalVehCost,
    totalDeductions: downPayment,
    netDisbursement: requiredLoan,
    emi: 0
  };

  printUniversalLoanSlip(record);
}

// ============================================================
// 12. Single Loan Calculator & Amortization Repayment Engine
// ============================================================
function initSingleCalculator() {
  const inputs = ["loan-amount", "interest-rate", "loan-tenure", "insurance-rate"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    const slider = document.getElementById(id + "-slider");
    if (el) {
      el.addEventListener("input", () => {
        if (slider) slider.value = el.value;
        calculateAndRender();
      });
    }
    if (slider) {
      slider.addEventListener("input", () => {
        if (el) el.value = slider.value;
        calculateAndRender();
      });
    }
  });

  document.querySelectorAll('.presets-row .preset-chip').forEach(chip => {
    chip.addEventListener("click", () => {
      const forId = chip.dataset.for;
      if (!forId || forId === "univ-loan-amount") return;
      const targetInput = document.getElementById(forId);
      const targetSlider = document.getElementById(forId + "-slider");
      if (targetInput) {
        targetInput.value = chip.dataset.value;
        if (targetSlider) targetSlider.value = chip.dataset.value;
        chip.parentElement.querySelectorAll('.preset-chip').forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        calculateAndRender();
      }
    });
  });

  document.querySelectorAll('input[name="tenure-unit"]').forEach(radio => {
    radio.addEventListener("change", () => {
      calculateAndRender();
    });
  });

  document.getElementById("search-month")?.addEventListener("input", (e) => {
    filterScheduleTable(e.target.value.trim().toLowerCase());
  });

  document.getElementById("rows-per-page")?.addEventListener("change", (e) => {
    scheduleCurrentPage = 1;
    renderScheduleTable();
  });

  document.getElementById("btn-print")?.addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btn-export-csv")?.addEventListener("click", () => {
    exportScheduleToCSV();
  });

  document.getElementById("btn-export-pdf")?.addEventListener("click", () => {
    window.print();
  });

  calculateAndRender();
}

function calculateAndRender() {
  const loanAmount = parseInputNumber("loan-amount", 400000);
  const annualRate = parseInputNumber("interest-rate", 18);
  let tenure = parseInt(document.getElementById("loan-tenure")?.value) || 60;
  const tenureUnit = document.querySelector('input[name="tenure-unit"]:checked')?.value || 'months';
  if (tenureUnit === 'years') tenure = tenure * 12;

  const insuranceRate = parseInputNumber("insurance-rate", 0.06);

  let schedule = [];
  let totalInterest = 0;
  let totalInsurance = 0;
  let totalPayable = 0;
  let firstMonthPayment = 0;
  let lastMonthPayment = 0;

  if (currentMode === 'flat') {
    // Flat Rate calculation
    totalInterest = loanAmount * (annualRate / 100) * (tenure / 12);
    totalInsurance = (loanAmount * (insuranceRate / 100)) * (tenure / 12);
    totalPayable = loanAmount + totalInterest + totalInsurance;
    const monthlyPrincipal = loanAmount / tenure;
    const monthlyInterest = totalInterest / tenure;
    const monthlyInsurance = totalInsurance / tenure;
    const monthlyTotal = monthlyPrincipal + monthlyInterest + monthlyInsurance;
    firstMonthPayment = monthlyTotal;
    lastMonthPayment = monthlyTotal;

    let balance = loanAmount;
    for (let m = 1; m <= tenure; m++) {
      const startBal = balance;
      balance = Math.max(0, balance - monthlyPrincipal);
      schedule.push({
        month: m,
        date: getMonthDateString(m),
        startBal,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        insurance: monthlyInsurance,
        total: monthlyTotal,
        endBal: balance
      });
    }
  } else {
    // Reducing Balance Day-Count 365
    const monthlyPrincipal = loanAmount / tenure;
    let balance = loanAmount;
    for (let m = 1; m <= tenure; m++) {
      const startBal = balance;
      const daysInMonth = getDaysInSpecificMonth(m);
      const monthInterest = (balance * (annualRate / 100) * daysInMonth) / 365;
      const monthInsurance = (balance * (insuranceRate / 100) * daysInMonth) / 365;
      const monthTotal = monthlyPrincipal + monthInterest + monthInsurance;

      balance = Math.max(0, balance - monthlyPrincipal);
      totalInterest += monthInterest;
      totalInsurance += monthInsurance;

      if (m === 1) firstMonthPayment = monthTotal;
      if (m === tenure) lastMonthPayment = monthTotal;

      schedule.push({
        month: m,
        date: getMonthDateString(m),
        startBal,
        principal: monthlyPrincipal,
        interest: monthInterest,
        insurance: monthInsurance,
        total: monthTotal,
        endBal: balance
      });
    }
    totalPayable = loanAmount + totalInterest + totalInsurance;
  }

  currentScheduleRows = schedule;

  // Update Metric Cards
  const elInst = document.getElementById("metric-installment");
  const elInstSub = document.getElementById("metric-installment-sub");
  const elInt = document.getElementById("metric-interest");
  const elIns = document.getElementById("metric-insurance");
  const elPay = document.getElementById("metric-total-payable");

  if (elInst) {
    elInst.textContent = (currentMode === 'reducing') ? formatCurrency(firstMonthPayment) : formatCurrency(firstMonthPayment);
  }
  if (elInstSub) {
    elInstSub.textContent = (currentMode === 'reducing') ? `පළමු මාසය: ${formatCurrency(firstMonthPayment)} | අවසන්: ${formatCurrency(lastMonthPayment)}` : "ස්ථාවර මාසික වාරිකය";
  }
  if (elInt) elInt.textContent = formatCurrency(totalInterest);
  if (elIns) elIns.textContent = formatCurrency(totalInsurance);
  if (elPay) elPay.textContent = formatCurrency(totalPayable);

  renderScheduleTable();
  renderCharts(loanAmount, totalInterest, totalInsurance, schedule);
}

function renderScheduleTable() {
  const tbody = document.getElementById("schedule-tbody");
  const tfoot = document.getElementById("schedule-tfoot");
  if (!tbody) return;

  const rowsPerPage = parseInt(document.getElementById("rows-per-page")?.value) || 12;
  const totalRows = currentScheduleRows.length;

  let pageRows = currentScheduleRows;
  if (rowsPerPage > 0) {
    const startIdx = (scheduleCurrentPage - 1) * rowsPerPage;
    pageRows = currentScheduleRows.slice(startIdx, startIdx + rowsPerPage);
  }

  tbody.innerHTML = pageRows.map(r => `
    <tr>
      <td>${r.month}</td>
      <td>${r.date}</td>
      <td>${formatCurrency(r.startBal)}</td>
      <td style="color: var(--accent-blue); font-weight: 700;">${formatCurrency(r.principal)}</td>
      <td style="color: var(--accent-gold);">${formatCurrency(r.interest)}</td>
      <td style="color: var(--accent-emerald);">${formatCurrency(r.insurance)}</td>
      <td style="font-weight: 800; color: var(--accent-purple);">${formatCurrency(r.total)}</td>
      <td>${formatCurrency(r.endBal)}</td>
    </tr>
  `).join("");

  // Totals in tfoot
  const sumPrincipal = currentScheduleRows.reduce((a, b) => a + b.principal, 0);
  const sumInterest = currentScheduleRows.reduce((a, b) => a + b.interest, 0);
  const sumInsurance = currentScheduleRows.reduce((a, b) => a + b.insurance, 0);
  const sumTotal = currentScheduleRows.reduce((a, b) => a + b.total, 0);

  if (tfoot) {
    tfoot.innerHTML = `
      <tr style="font-weight: 800; background: var(--bg-card-hover);">
        <td colspan="3" style="text-align: center;">එකතුව (Total)</td>
        <td style="color: var(--accent-blue);">${formatCurrency(sumPrincipal)}</td>
        <td style="color: var(--accent-gold);">${formatCurrency(sumInterest)}</td>
        <td style="color: var(--accent-emerald);">${formatCurrency(sumInsurance)}</td>
        <td style="color: var(--accent-purple); font-size: 0.95rem;">${formatCurrency(sumTotal)}</td>
        <td>Rs. 0.00</td>
      </tr>
    `;
  }
}

function filterScheduleTable(query) {
  if (!query) {
    renderScheduleTable();
    return;
  }
  const tbody = document.getElementById("schedule-tbody");
  if (!tbody) return;

  const matched = currentScheduleRows.filter(r => r.month.toString().includes(query) || r.date.toLowerCase().includes(query));
  tbody.innerHTML = matched.map(r => `
    <tr>
      <td>${r.month}</td>
      <td>${r.date}</td>
      <td>${formatCurrency(r.startBal)}</td>
      <td style="color: var(--accent-blue); font-weight: 700;">${formatCurrency(r.principal)}</td>
      <td style="color: var(--accent-gold);">${formatCurrency(r.interest)}</td>
      <td style="color: var(--accent-emerald);">${formatCurrency(r.insurance)}</td>
      <td style="font-weight: 800; color: var(--accent-purple);">${formatCurrency(r.total)}</td>
      <td>${formatCurrency(r.endBal)}</td>
    </tr>
  `).join("");
}

function renderCharts(principal, interest, insurance, schedule) {
  const ctxBreakdown = document.getElementById("chart-breakdown")?.getContext("2d");
  const ctxTrend = document.getElementById("chart-trend")?.getContext("2d");

  if (ctxBreakdown) {
    if (chartBreakdown) chartBreakdown.destroy();
    chartBreakdown = new Chart(ctxBreakdown, {
      type: 'doughnut',
      data: {
        labels: ['මුල මුදල (Principal)', 'මුළු පොලිය (Interest)', 'ණය රක්ෂණය (Insurance)'],
        datasets: [{
          data: [principal, interest, insurance],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: document.body.classList.contains('light-theme') ? '#0f172a' : '#f9fafb', font: { family: 'Noto Sans Sinhala, Inter' } } }
        }
      }
    });
  }

  if (ctxTrend && schedule.length > 0) {
    if (chartTrend) chartTrend.destroy();
    const labels = schedule.map(r => `M${r.month}`);
    const balances = schedule.map(r => r.endBal);
    chartTrend = new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'ණය ශේෂය (Loan Balance)',
          data: balances,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.12)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#9ca3af' } },
          y: { ticks: { color: '#9ca3af' } }
        }
      }
    });
  }
}

function renderComparisonView() {
  const container = document.getElementById("compare-calc-view");
  if (!container) return;

  const loanAmount = parseInputNumber("loan-amount", 400000);
  const annualRate = parseInputNumber("interest-rate", 18);
  let tenure = parseInt(document.getElementById("loan-tenure")?.value) || 60;

  // Reducing
  const redInterest = (loanAmount * (annualRate / 100) * (tenure + 1)) / 24;
  const redPayable = loanAmount + redInterest;
  const redFirst = (loanAmount / tenure) + ((loanAmount * (annualRate / 100)) / 12);
  const redLast = (loanAmount / tenure) + (((loanAmount / tenure) * (annualRate / 100)) / 12);

  // Flat
  const flatInterest = loanAmount * (annualRate / 100) * (tenure / 12);
  const flatPayable = loanAmount + flatInterest;
  const flatEmi = flatPayable / tenure;

  const savings = flatInterest - redInterest;

  container.innerHTML = `
    <div class="glass-card" style="border-top: 4px solid var(--accent-gold);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 class="card-title" style="color: var(--accent-gold); margin-bottom: 0;">හීනවෙන ක්‍රමය (Reducing Balance)</h3>
        <span class="badge-tag" style="background: rgba(245,158,11,0.15); color: var(--accent-gold); font-weight: 800;">වඩාත් වාසිදායකයි</span>
      </div>
      <div class="metric-value text-gold" style="font-size: 1.8rem; margin-bottom: 6px;">${formatCurrency(redFirst)} → ${formatCurrency(redLast)}</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">මාසික වාරිකය ක්‍රමයෙන් අඩු වේ.</p>
      <div style="font-size: 0.88rem; line-height: 1.8;">
        <div>මුළු පොලිය: <strong>${formatCurrency(redInterest)}</strong></div>
        <div>ගෙවිය යුතු මුළු මුදල: <strong>${formatCurrency(redPayable)}</strong></div>
      </div>
    </div>

    <div class="glass-card" style="border-top: 4px solid var(--accent-blue);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 class="card-title" style="color: var(--accent-blue); margin-bottom: 0;">සමාන වාරික ක්‍රමය (Flat Rate)</h3>
        <span class="badge-tag" style="background: rgba(59,130,246,0.15); color: var(--accent-blue);">ස්ථාවර වාරික</span>
      </div>
      <div class="metric-value text-blue" style="font-size: 1.8rem; margin-bottom: 6px;">${formatCurrency(flatEmi)}</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">සෑම මාසයකම එකම වාරිකය ගෙවිය යුතුය.</p>
      <div style="font-size: 0.88rem; line-height: 1.8;">
        <div>මුළු පොලිය: <strong>${formatCurrency(flatInterest)}</strong></div>
        <div>ගෙවිය යුතු මුළු මුදල: <strong>${formatCurrency(flatPayable)}</strong></div>
      </div>
    </div>

    <div class="glass-card" style="grid-column: 1 / -1; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.3); text-align: center; padding: 20px;">
      <h3 style="color: var(--accent-emerald); font-size: 1.25rem; font-weight: 800; margin-bottom: 6px;">
        <i class="fa-solid fa-piggy-bank"></i> හීනවෙන ක්‍රමය තෝරාගැනීමෙන් ඔබ ලබන ඉතිරිය: ${formatCurrency(savings)}
      </h3>
      <p style="font-size: 0.85rem; color: var(--text-muted);">සැබෑ බැංකු පොලී ක්‍රමය අනුව ණය ශේෂයට පමණක් පොලිය ගණනය වන බැවින් ගනුදෙනුකරුට උපරිම වාසියක් අත්වේ.</p>
    </div>
  `;
}

function exportScheduleToCSV() {
  if (currentScheduleRows.length === 0) return;
  const headers = ["Month", "Date", "Start Balance", "Principal", "Interest", "Insurance", "Monthly Installment", "Ending Balance"];
  const rows = currentScheduleRows.map(r => [r.month, `"${r.date}"`, r.startBal, r.principal, r.interest, r.insurance, r.total, r.endBal]);
  let csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `GSCS_Repayment_Schedule.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("කාලසටහන CSV ගොනුවක් ලෙස බාගත කරන ලදී.", "success");
}

// ============================================================
// 13. UI Helper Utilities (Theme, Language, Sidebar, Currency)
// ============================================================
function parseInputNumber(id, defaultVal = 0) {
  const el = document.getElementById(id);
  if (!el) return defaultVal;
  const parsed = parseFloat(el.value);
  return isNaN(parsed) ? defaultVal : parsed;
}

function formatCurrency(num) {
  return "Rs. " + Number(num || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getDaysInSpecificMonth(monthOffset) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getMonthDateString(monthOffset) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  return d.toLocaleDateString('si-LK', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initTheme() {
  const btnTheme = document.getElementById("btn-theme");
  const savedTheme = localStorage.getItem("gscs_theme") || "light";
  
  if (savedTheme === "dark") {
    document.body.classList.remove("light-theme");
    btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    document.body.classList.add("light-theme");
    btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  btnTheme?.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    localStorage.setItem("gscs_theme", isLight ? "light" : "dark");
    btnTheme.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    if (chartBreakdown) calculateAndRender();
  });
}

function initLanguage() {
  const btnLang = document.getElementById("btn-lang");
  const langName = document.getElementById("lang-name");
  
  btnLang?.addEventListener("click", () => {
    currentLang = (currentLang === 'si') ? 'en' : 'si';
    langName.textContent = (currentLang === 'si') ? 'English' : 'සිංහල';
    applyLanguage(currentLang);
  });
}

function applyLanguage(lang) {
  const dict = i18n[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

function initSidebar() {
  const toggleBtn = document.getElementById("btn-sidebar-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");
  const sidebar = document.querySelector(".dashboard-sidebar");

  toggleBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
    backdrop?.classList.toggle("active");
  });

  backdrop?.addEventListener("click", () => {
    closeMobileSidebar();
  });
}

function closeMobileSidebar() {
  document.querySelector(".dashboard-sidebar")?.classList.remove("open");
  document.getElementById("sidebar-backdrop")?.classList.remove("active");
}

function openCustomerSupportModal() {
  const modal = document.getElementById("modal-customer-service");
  if (modal) modal.style.display = "flex";
}

document.getElementById("btn-close-support-modal")?.addEventListener("click", () => {
  const modal = document.getElementById("modal-customer-service");
  if (modal) modal.style.display = "none";
});

// Global modal close on clicking backdrop
window.addEventListener("click", (e) => {
  const supportModal = document.getElementById("modal-customer-service");
  const schemeModal = document.getElementById("modal-add-scheme");
  const saveVehModal = document.getElementById("modal-save-veh-loan");
  const addVehModal = document.getElementById("modal-add-vehicle");

  if (e.target === supportModal) supportModal.style.display = "none";
  if (e.target === schemeModal) schemeModal.style.display = "none";
  if (e.target === saveVehModal) saveVehModal.style.display = "none";
  if (e.target === addVehModal) addVehModal.style.display = "none";
});
