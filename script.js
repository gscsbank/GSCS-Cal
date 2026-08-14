/**
 * Lanka Bank Loan Calculator - Core Script & Logic
 * Supports Reducing Balance (හීනවෙන ක්‍රමය) & Flat Rate (සමාන වාරික ක්‍රමය)
 * Loan Insurance, Bilingual (Sinhala / English) UI, Charts & Exporting.
 */

// Language Dictionary
const i18n = {
  si: {
    appTitle: "GSCS BANK Loan Calculator",
    appSubtitle: "iraasoft Solution මගින් බලගන්වන ලද GSCS BANK ණය ගණනය කිරීමේ පද්ධතිය",
    staffBadge: "FOR STAFF USE ONLY",
    tabReducing: "හීනවෙන ක්‍රමය (Reducing Balance)",
    tabFlat: "සමාන වාරික ක්‍රමය (Flat Rate)",
    tabCompare: "ක්‍රම දෙක සසඳන්න (Comparison)",
    
    // Inputs
    inputsHeader: "ණය තොරතුරු ඇතුළත් කරන්න",
    loanAmount: "ණය මුදල (Loan Amount)",
    interestRate: "වාර්ෂික පොලී අනුපාතය (Interest Rate)",
    loanTenure: "ණය කාලසීමාව (Tenure)",
    insuranceRate: "ණය රක්ෂණ අනුපාතය (Insurance Rate)",
    insuranceHint: "0.00% (නැතහොත් ඔබගේ අනුපාතය)",
    startDate: "ණය ආරම්භක දිනය (Start Date)",
    months: "මාස",
    years: "අවුරුදු",
    calcMethod: "පොලී ගණනය කිරීමේ පදනම (Basis)",
    basisActual: "නියමිත දින ගණන (Actual Days / 365) - සනස / බැංකු ක්‍රමය",
    basisFixed: "මාසික නියත පදනම (30 Days / 360 Basis)",
    roundingOption: "ගණන් වටයන ආකාරය (Rounding)",
    roundRupees: "සම්පූර්ණ රුපියල් වලට (Sanasa / Bank Format)",
    roundCents: "සත 2 කට (Exact Cents)",
    
    // Summary Cards
    monthlyInstallment: "මාසික වාරිකය (Monthly Installment)",
    totalInterest: "මුළු පොලිය (Total Interest)",
    totalInsurance: "මුළු ණය රක්ෂණය (Total Insurance)",
    totalPayable: "ගෙවිය යුතු මුළු මුදල (Total Amount Payable)",
    reducingRange: "පළමු මාසය: {{first}} | අවසාන මාසය: {{last}}",
    flatFixed: "මුළු කාලය පුරාම ස්ථාවර වාරිකය",

    // Formula Box
    formulaReducingTitle: "හීනවෙන ක්‍රමයේ ගණනය කිරීම (Sanasa / Bank Day-Count Basis):",
    formulaReducingText: "එක් එක් මාසික ගෙවීම් කාලසීමාවේ ඇති සැබෑ දින ගණන (31, 30, 28/29) අනුව එම මාසයේ ඉතිරි ණය ශේෂයට පමණක් පොලිය ගණනය කෙරේ (දින 365 පදනම). මුල මුදල සමානව බෙදා වෙන් කෙරේ. එමගින් සැබෑ බැංකු වාර්තාවට 100% ක් සමානව ගණනය වේ.",
    formulaFlatTitle: "සමාන වාරික ක්‍රමයේ ගණනය කිරීම:",
    formulaFlatText: "සම්පූර්ණ කාලසීමාව සඳහාම පොලිය එකවර ගණනය කර ණය මුදලට එකතු කර මාස ගණනට සමානව බෙදා වෙන් කරනු ලැබේ. සෑම මාසයකම වාරිකය එක සමානය.",

    // Table
    scheduleTitle: "මාසික ගෙවීම් කාලසටහන (Repayment Schedule)",
    searchPlaceholder: "මාසය සොයන්න...",
    btnPdf: "PDF වාර්තාව",
    btnCsv: "Excel / CSV",
    btnPrint: "මුද්‍රණය",
    
    colMonth: "මාසය",
    colDate: "ගෙවිය යුතු දිනය",
    colStartBal: "ආරම්භක ශේෂය (Balance B/F)",
    colPrincipal: "මුල මුදල (Principal)",
    colInterest: "පොලිය (Interest)",
    colInsurance: "ණය රක්ෂණය",
    colPayment: "මාසික වාරිකය (Total)",
    colEndBal: "අවසාන ශේෂය (Balance C/F)",
    colTotal: "එකතුව (Total)",

    // Comparison
    cmpTitle: "හීනවෙන ක්‍රමය සහ සමාන වාරික ක්‍රමය අතර සැසඳීම",
    cmpSavingsMsg: "හීනවෙන ක්‍රමය තෝරාගැනීමෙන් ඔබට රු. {{savings}} ක මුදලක් ඉතිරි කරගත හැක!",
    cmpReducingHead: "හීනවෙන ක්‍රමය (Reducing Balance)",
    cmpFlatHead: "සමාන වාරික ක්‍රමය (Flat Rate)",
    recommended: "වඩාත් වාසිදායකයි",

    // Vehicle Estimator
    tabVehicle: "ස්වශක්ති වාහන ණය (Vehicle Loan)",
    btnCalcVehShortcut: "ස්වශක්ති වාහන ණය මුදල ගණනය කරන්න",
    vehicleCalcTitle: "ස්වශක්ති වාහන ණය - ණය මුදල ගණනය කිරීම",
    vehicleCalcSubtitle: "වාහනයේ මිල, පරිපාලන ගාස්තු සහ මූලික ගෙවීම අනුව අදාළ ණය මුදල ස්වයංක්‍රීයව ගණනය කරගන්න",
    selectVehicleLabel: "වාහනය තෝරන්න:",
    btnAddVehicle: "නව වාහනයක් එකතු කරන්න",
    headerVariableFees: "වාහන තොරතුරු & වෙනස්වන ගාස්තු",
    headerFixedFees: "පරිපාලන & අරමුදල් ගාස්තු",
    headerVehSummary: "ගණනය කිරීමේ සාරාංශය",
    lblVehPrice: "වාහනයේ මිල (Vehicle Price)",
    lblRegFee: "වාහන ලියාපදිංචි ගාස්තු (Reg Fee)",
    lblVehInsurance: "වාහන රක්ෂණ ගාස්තු (Vehicle Insurance)",
    lblDownPayment: "වාහනයේ මූලික ගෙවීම (Down Payment)",
    lblBorrowerShares: "ණයකරු කොටස්",
    lblGuarantor1Shares: "ඇපකරු 1 කොටස්",
    lblGuarantor2Shares: "ඇපකරු 2 කොටස්",
    lblDocFee: "ලිපි ගාස්තු",
    lblServiceFund: "සේවා අරමුදල",
    lblLoanInsurance: "ණය රක්ෂණය",
    lblSwashakthiFund: "ස්වශක්ති අරමුදල",
    lblBuildingFund: "ගොඩනැගිලි අරමුදල",
    lblTotalDocFees: "ලිපි ලේඛන ගාස්තු එකතුව",
    lblTotalVehCost: "සම්පූර්ණ පිරිවැය (මිල + ගාස්තු)",
    lblDownPaymentSummary: "මූලික ගෙවීම (Down Payment)",
    lblRequiredLoan: "අවශ්‍ය ණය මුදල (Required Loan Amount)",
    btnApplyLoan: "මෙම ණය මුදල වාරික ගණකයට යොදන්න",
    titleVehComparison: "ස්වශක්ති ණය - වාහන සසඳන සැසඳුම් සටහන (Excel Matrix)",
    modalTitleAddVeh: "නව වාහනයක් ඇතුළත් කරන්න",
    lblModalVehName: "වාහනයේ නම / මාදිලිය (e.g. TVS Apache)",
    lblModalVehPrice: "වාහනයේ මිල (Vehicle Price)",
    lblModalRegFee: "ලියාපදිංචි ගාස්තු (Reg Fee)",
    lblModalInsuranceFee: "වාහන රක්ෂණ ගාස්තු (Vehicle Insurance)",
    lblModalDownPayment: "පෙරනිමි මූලික ගෙවීම (Default Down Payment)",
    btnCancel: "අවලංගු කරන්න",
    btnSaveVeh: "සුරකින්න",
    customVehicleOption: "වෙනත් / නියමිත නොවන වාහනයක් (Custom)",
    btnApplyThisLoan: "මේ ණය මුදල ගන්න",

    footerText: "© 2026 GSCS BANK Loan System. All rights reserved."
  },

  en: {
    appTitle: "GSCS BANK Loan Calculator",
    appSubtitle: "GSCS BANK Loan Calculation System Powered by iraasoft Solution",
    staffBadge: "FOR STAFF USE ONLY",
    tabReducing: "Reducing Balance Method",
    tabFlat: "Flat Rate Method",
    tabCompare: "Compare Both Methods",
    tabVehicle: "Swashakthi Vehicle Loan",
    btnCalcVehShortcut: "Calculate Vehicle Loan Amount",
    vehicleCalcTitle: "Swashakthi Vehicle Loan Estimator",
    vehicleCalcSubtitle: "Calculate required loan amount based on vehicle price, documentation fees & down payment",
    selectVehicleLabel: "Select Vehicle Model:",
    btnAddVehicle: "Add New Vehicle",
    headerVariableFees: "Vehicle Info & Variable Fees",
    headerFixedFees: "Standard Admin & Fund Fees",
    headerVehSummary: "Calculation Summary",
    lblVehPrice: "Vehicle Price (LKR)",
    lblRegFee: "Vehicle Registration Fee",
    lblVehInsurance: "Vehicle Insurance Fee",
    lblDownPayment: "Down Payment (Initial Deposit)",
    lblBorrowerShares: "Borrower Shares",
    lblGuarantor1Shares: "Guarantor 1 Shares",
    lblGuarantor2Shares: "Guarantor 2 Shares",
    lblDocFee: "Doc / Form Fee",
    lblServiceFund: "Service Fund",
    lblLoanInsurance: "Loan Insurance Fee",
    lblSwashakthiFund: "Swashakthi Fund",
    lblBuildingFund: "Building Fund",
    lblTotalDocFees: "Total Documentation Fees",
    lblTotalVehCost: "Total Vehicle Cost (Price + Fees)",
    lblDownPaymentSummary: "Down Payment",
    lblRequiredLoan: "Required Loan Amount",
    btnApplyLoan: "Apply Loan Amount to EMI Calculator",
    titleVehComparison: "Swashakthi Loan - Vehicle Matrix (Excel Comparison)",
    modalTitleAddVeh: "Add New Vehicle Model",
    lblModalVehName: "Vehicle Name / Model",
    lblModalVehPrice: "Vehicle Price",
    lblModalRegFee: "Registration Fee",
    lblModalInsuranceFee: "Vehicle Insurance Fee",
    lblModalDownPayment: "Default Down Payment",
    btnCancel: "Cancel",
    btnSaveVeh: "Save Vehicle",
    customVehicleOption: "Custom Vehicle Model",
    btnApplyThisLoan: "Apply Loan",
    
    // Inputs
    inputsHeader: "Enter Loan Details",
    loanAmount: "Loan Amount (LKR)",
    interestRate: "Annual Interest Rate (%)",
    loanTenure: "Loan Tenure",
    insuranceRate: "Loan Insurance Rate (%)",
    insuranceHint: "0.00% (or custom rate)",
    startDate: "Loan Start Date",
    months: "Months",
    years: "Years",
    calcMethod: "Interest Calculation Basis",
    basisActual: "Actual Days / 365 Basis (Sanasa & Sri Lanka Bank Standard)",
    basisFixed: "Fixed 30 Days / 360 Basis",
    roundingOption: "Rounding Method",
    roundRupees: "Round to Whole Rupees (Sanasa / Bank Format)",
    roundCents: "Exact Cents (2 Decimals)",

    // Summary Cards
    monthlyInstallment: "Monthly Installment",
    totalInterest: "Total Interest",
    totalInsurance: "Total Loan Insurance",
    totalPayable: "Total Amount Payable",
    reducingRange: "Month 1: {{first}} | Month {{n}}: {{last}}",
    flatFixed: "Fixed installment across all months",

    // Formula Box
    formulaReducingTitle: "Reducing Balance Calculation (Sanasa / Bank Day-Count Basis):",
    formulaReducingText: "Interest is calculated on the exact calendar days of each installment period (31, 30, 28/29 days on a 365-day basis) on the remaining loan balance. Principal is divided equally across months.",
    formulaFlatTitle: "Flat Rate Calculation:",
    formulaFlatText: "Interest for the total tenure is calculated upfront on the original loan amount and split equally across all months.",

    // Table
    scheduleTitle: "Repayment Amortization Schedule",
    searchPlaceholder: "Search month...",
    btnPdf: "PDF Report",
    btnCsv: "Excel / CSV",
    btnPrint: "Print",

    colMonth: "Month",
    colDate: "Due Date",
    colStartBal: "Balance B/F",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colInsurance: "Loan Insurance",
    colPayment: "Total Installment",
    colEndBal: "Balance C/F",
    colTotal: "Total",

    // Comparison
    cmpTitle: "Reducing Balance vs Flat Rate Comparison",
    cmpSavingsMsg: "By choosing Reducing Balance, you save LKR {{savings}} in total payments!",
    cmpReducingHead: "Reducing Balance Method",
    cmpFlatHead: "Flat Rate Method",
    recommended: "Recommended",

    footerText: "© 2026 GSCS BANK Loan System. All rights reserved."
  }
};

// Global State
let currentLang = 'si';
let currentMode = 'reducing'; // 'reducing', 'flat', 'compare', 'vehicle'
let tenureUnit = 'months';
let currentPage = 1;
let rowsPerPage = 12;

let vehicleDatabase = [
  { id: "bajaj", name: "Bajaj", price: 789950, regFee: 15000, vehicleInsurance: 21423, downPayment: 350000 },
  { id: "risk", name: "Risk", price: 599000, regFee: 13850, vehicleInsurance: 16951, downPayment: 200000 },
  { id: "yamaha", name: "Yamaha", price: 590000, regFee: 17000, vehicleInsurance: 16951, downPayment: 200000 }
];

let lastCalculatedVehicleLoanAmount = 499523;

let chartBreakdown = null;
let chartTrend = null;

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  initVehicleCalculator();
  calculateAndRender();
});

function initEventListeners() {
  // Language Switcher
  document.getElementById("btn-lang")?.addEventListener("click", () => {
    currentLang = currentLang === 'si' ? 'en' : 'si';
    updateLanguage();
    calculateAndRender();
    if (currentMode === 'vehicle') renderVehicleCalculator();
  });

  // Theme Switcher
  document.getElementById("btn-theme")?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const icon = document.querySelector("#btn-theme i");
    if (document.body.classList.contains("light-theme")) {
      icon.className = "fa-solid fa-sun";
    } else {
      icon.className = "fa-solid fa-moon";
    }
  });

  // Tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      const clickedTab = e.currentTarget;
      clickedTab.classList.add("active");
      currentMode = clickedTab.dataset.mode;

      const calcGrid = document.getElementById("single-calc-view");
      const compareGrid = document.getElementById("compare-calc-view");
      const vehicleView = document.getElementById("vehicle-calc-view");
      const scheduleSection = document.querySelector(".schedule-section");

      if (currentMode === 'compare') {
        calcGrid.style.display = 'none';
        compareGrid.style.display = 'grid';
        if (vehicleView) vehicleView.style.display = 'none';
        if (scheduleSection) scheduleSection.style.display = 'block';
      } else if (currentMode === 'vehicle') {
        calcGrid.style.display = 'none';
        compareGrid.style.display = 'none';
        if (vehicleView) vehicleView.style.display = 'block';
        if (scheduleSection) scheduleSection.style.display = 'none';
        renderVehicleCalculator();
      } else {
        calcGrid.style.display = 'grid';
        compareGrid.style.display = 'none';
        if (vehicleView) vehicleView.style.display = 'none';
        if (scheduleSection) scheduleSection.style.display = 'block';
      }

      calculateAndRender();
    });
  });

  // Shortcut button under loan amount
  document.getElementById("btn-calc-veh-loan")?.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.remove("active");
      if (b.dataset.mode === 'vehicle') b.classList.add("active");
    });
    currentMode = 'vehicle';
    document.getElementById("single-calc-view").style.display = 'none';
    document.getElementById("compare-calc-view").style.display = 'none';
    document.getElementById("vehicle-calc-view").style.display = 'block';
    document.querySelector(".schedule-section").style.display = 'none';
    renderVehicleCalculator();
  });

  // Input fields & Sliders sync
  bindInputSlider("loan-amount", "loan-amount-slider");
  bindInputSlider("interest-rate", "interest-rate-slider");
  bindInputSlider("loan-tenure", "loan-tenure-slider");
  bindInputSlider("insurance-rate", "insurance-rate-slider");

  // Date input
  document.getElementById("start-date")?.addEventListener("change", calculateAndRender);

  // Calculation Basis & Rounding listeners
  document.getElementById("calc-method")?.addEventListener("change", calculateAndRender);
  document.querySelectorAll("input[name='rounding-mode']").forEach(radio => {
    radio.addEventListener("change", calculateAndRender);
  });

  // Tenure Unit toggle (Months vs Years)
  document.querySelectorAll("input[name='tenure-unit']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      tenureUnit = e.target.value;
      const tenureSlider = document.getElementById("loan-tenure-slider");
      const tenureInput = document.getElementById("loan-tenure");
      
      if (tenureUnit === 'years') {
        tenureSlider.min = 1;
        tenureSlider.max = 30;
        tenureInput.value = 3;
        tenureSlider.value = 3;
      } else {
        tenureSlider.min = 3;
        tenureSlider.max = 360;
        tenureInput.value = 36;
        tenureSlider.value = 36;
      }
      calculateAndRender();
    });
  });

  // Presets
  document.querySelectorAll(".preset-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      const targetInputId = e.target.dataset.for;
      const val = e.target.dataset.value;
      const input = document.getElementById(targetInputId);
      const slider = document.getElementById(targetInputId + "-slider");
      if (input) input.value = val;
      if (slider) slider.value = val;

      // Update active state on preset chips
      e.target.parentElement.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");

      calculateAndRender();
    });
  });

  // Search & Rows per page
  document.getElementById("search-month")?.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });

  document.getElementById("rows-per-page")?.addEventListener("change", (e) => {
    rowsPerPage = parseInt(e.target.value) || 12;
    currentPage = 1;
    renderTable();
  });

  // Export buttons
  document.getElementById("btn-export-csv")?.addEventListener("click", exportCSV);
  document.getElementById("btn-export-pdf")?.addEventListener("click", () => window.print());
  document.getElementById("btn-print")?.addEventListener("click", () => window.print());
}

function bindInputSlider(inputId, sliderId) {
  const input = document.getElementById(inputId);
  const slider = document.getElementById(sliderId);
  if (!input || !slider) return;

  input.addEventListener("input", () => {
    slider.value = input.value;
    calculateAndRender();
  });

  slider.addEventListener("input", () => {
    input.value = slider.value;
    calculateAndRender();
  });
}

function updateLanguage() {
  const dict = i18n[currentLang];
  document.getElementById("lang-name").textContent = currentLang === 'si' ? 'English' : 'සිංහල';

  // Translate static text elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Search placeholder
  const searchInput = document.getElementById("search-month");
  if (searchInput) searchInput.placeholder = dict.searchPlaceholder;
}

// Number formatting helpers
function formatCurrency(amount) {
  return "Rs. " + Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function parseInputNumber(id, defaultVal = 0) {
  const el = document.getElementById(id);
  if (!el) return defaultVal;
  const val = parseFloat(el.value);
  return isNaN(val) ? defaultVal : val;
}

function getNthInstallmentDate(baseDateStr, n) {
  const base = new Date(baseDateStr);
  if (isNaN(base.getTime())) return new Date();
  
  const startDay = base.getDate();
  const targetDate = new Date(base.getFullYear(), base.getMonth() + n, 1);
  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
  const actualDay = Math.min(startDay, daysInMonth);
  targetDate.setDate(actualDay);
  return targetDate;
}

function formatDateString(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Core Calculations
function calculateLoanData(mode, loanAmount, annualRate, months, insuranceRate) {
  const calcMethod = document.getElementById("calc-method")?.value || "actual";
  const roundModeRadio = document.querySelector("input[name='rounding-mode']:checked");
  const roundMode = roundModeRadio ? roundModeRadio.value : "rupees";

  const monthlyInsuranceFactor = insuranceRate / 100;
  let schedule = [];
  let totalInterest = 0;
  let totalInsurance = 0;

  let balance = loanAmount;
  const startDateVal = document.getElementById("start-date")?.value || "2024-12-27";
  const baseDate = new Date(startDateVal);

  if (mode === 'reducing') {
    const rawMonthlyPrincipal = loanAmount / months;
    const fixedPrincipal = roundMode === 'rupees' ? Math.round(rawMonthlyPrincipal) : rawMonthlyPrincipal;

    let prevDate = new Date(baseDate);

    for (let i = 1; i <= months; i++) {
      const startBal = balance;
      const dueDate = getNthInstallmentDate(startDateVal, i);
      
      let interest = 0;
      if (calcMethod === 'actual') {
        // Actual Days / 365 basis (Sanasa & Sri Lanka Bank Standard)
        const diffTime = dueDate.getTime() - prevDate.getTime();
        const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
        const rawInterest = startBal * (annualRate / 100) * (days / 365);
        interest = roundMode === 'rupees' ? Math.floor(rawInterest) : rawInterest;
      } else {
        // Fixed 30 days / 360 basis
        const rawInterest = startBal * (annualRate / 100 / 12);
        interest = roundMode === 'rupees' ? Math.floor(rawInterest) : rawInterest;
      }

      const insurance = startBal * monthlyInsuranceFactor;
      let principal = (i === months) ? startBal : fixedPrincipal;
      if (roundMode === 'rupees') principal = Math.round(principal);

      const totalPayment = principal + interest + insurance;
      const endBal = Math.max(0, startBal - principal);

      totalInterest += interest;
      totalInsurance += insurance;

      schedule.push({
        month: i,
        date: formatDateString(dueDate),
        startBal: startBal,
        principal: principal,
        interest: interest,
        insurance: insurance,
        totalPayment: totalPayment,
        endBal: endBal
      });

      balance = endBal;
      prevDate = dueDate;
    }
  } else {
    // Flat Rate
    const rawMonthlyPrincipal = loanAmount / months;
    const monthlyPrincipal = roundMode === 'rupees' ? Math.round(rawMonthlyPrincipal) : rawMonthlyPrincipal;
    
    const rawMonthlyInterest = (loanAmount * (annualRate / 100)) / 12;
    const monthlyInterest = roundMode === 'rupees' ? Math.floor(rawMonthlyInterest) : rawMonthlyInterest;
    
    const monthlyInsurance = loanAmount * monthlyInsuranceFactor;
    const monthlyPayment = monthlyPrincipal + monthlyInterest + monthlyInsurance;

    for (let i = 1; i <= months; i++) {
      const startBal = balance;
      const dueDate = getNthInstallmentDate(startDateVal, i);
      const principal = (i === months) ? startBal : monthlyPrincipal;
      const endBal = Math.max(0, startBal - principal);

      totalInterest += monthlyInterest;
      totalInsurance += monthlyInsurance;

      schedule.push({
        month: i,
        date: formatDateString(dueDate),
        startBal: startBal,
        principal: principal,
        interest: monthlyInterest,
        insurance: monthlyInsurance,
        totalPayment: monthlyPayment,
        endBal: endBal
      });

      balance = endBal;
    }
  }

  const totalPayable = loanAmount + totalInterest + totalInsurance;

  return {
    loanAmount,
    annualRate,
    months,
    insuranceRate,
    totalInterest,
    totalInsurance,
    totalPayable,
    schedule,
    firstMonthPayment: schedule[0]?.totalPayment || 0,
    lastMonthPayment: schedule[months - 1]?.totalPayment || 0,
    avgMonthlyPayment: totalPayable / months
  };
}

let activeCalculationResult = null;

function calculateAndRender() {
  const loanAmount = parseInputNumber("loan-amount", 400000);
  const annualRate = parseInputNumber("interest-rate", 18);
  let tenure = parseInputNumber("loan-tenure", 60);
  if (tenureUnit === 'years') tenure = tenure * 12;
  const insuranceRate = parseInputNumber("insurance-rate", 0.00);

  if (currentMode === 'compare') {
    renderComparisonView(loanAmount, annualRate, tenure, insuranceRate);
    return;
  }

  // Calculate for single selected mode
  activeCalculationResult = calculateLoanData(currentMode, loanAmount, annualRate, tenure, insuranceRate);
  
  updateSummaryCards(activeCalculationResult);
  renderFormulaBox();
  renderCharts(activeCalculationResult);
  renderTable();
}

function updateSummaryCards(res) {
  const dict = i18n[currentLang];
  
  const elInstallment = document.getElementById("metric-installment");
  const elInstallmentSub = document.getElementById("metric-installment-sub");
  const elInterest = document.getElementById("metric-interest");
  const elInsurance = document.getElementById("metric-insurance");
  const elTotalPayable = document.getElementById("metric-total-payable");

  if (currentMode === 'reducing') {
    elInstallment.textContent = `${formatCurrency(res.firstMonthPayment)} → ${formatCurrency(res.lastMonthPayment)}`;
    elInstallmentSub.textContent = dict.reducingRange
      .replace("{{first}}", formatCurrency(res.firstMonthPayment))
      .replace("{{n}}", res.months)
      .replace("{{last}}", formatCurrency(res.lastMonthPayment));
  } else {
    elInstallment.textContent = formatCurrency(res.firstMonthPayment);
    elInstallmentSub.textContent = dict.flatFixed;
  }

  elInterest.textContent = formatCurrency(res.totalInterest);
  elInsurance.textContent = formatCurrency(res.totalInsurance);
  elTotalPayable.textContent = formatCurrency(res.totalPayable);
}

function renderFormulaBox() {
  const dict = i18n[currentLang];
  const titleEl = document.getElementById("formula-title");
  const textEl = document.getElementById("formula-text");
  
  if (currentMode === 'reducing') {
    titleEl.textContent = dict.formulaReducingTitle;
    textEl.textContent = dict.formulaReducingText;
  } else {
    titleEl.textContent = dict.formulaFlatTitle;
    textEl.textContent = dict.formulaFlatText;
  }
}

function renderCharts(res) {
  const dict = i18n[currentLang];

  // 1. Donut Chart - Payment Breakdown
  const ctxBreakdown = document.getElementById("chart-breakdown")?.getContext("2d");
  if (ctxBreakdown) {
    if (chartBreakdown) chartBreakdown.destroy();
    
    chartBreakdown = new Chart(ctxBreakdown, {
      type: 'doughnut',
      data: {
        labels: [dict.colPrincipal, dict.colInterest, dict.colInsurance],
        datasets: [{
          data: [res.loanAmount, res.totalInterest, res.totalInsurance],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: getComputedStyle(document.body).getPropertyValue('--text-main') }
          }
        }
      }
    });
  }

  // 2. Line Chart - Balance Reduction Trend
  const ctxTrend = document.getElementById("chart-trend")?.getContext("2d");
  if (ctxTrend) {
    if (chartTrend) chartTrend.destroy();

    const labels = res.schedule.map(s => `M${s.month}`);
    const balances = res.schedule.map(s => Math.round(s.endBal));
    const payments = res.schedule.map(s => Math.round(s.totalPayment));

    chartTrend = new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: dict.colEndBal,
            data: balances,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.2
          },
          {
            label: dict.colPayment,
            data: payments,
            borderColor: '#f59e0b',
            borderDash: [5, 5],
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-muted'), maxTicksLimit: 12 } },
          y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-muted') } }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: getComputedStyle(document.body).getPropertyValue('--text-main') }
          }
        }
      }
    });
  }
}

function renderTable() {
  if (!activeCalculationResult) return;
  const dict = i18n[currentLang];
  const tbody = document.getElementById("schedule-tbody");
  const tfoot = document.getElementById("schedule-tfoot");
  const searchVal = (document.getElementById("search-month")?.value || "").toLowerCase().trim();

  if (!tbody || !tfoot) return;

  let filtered = activeCalculationResult.schedule.filter(row => {
    return row.month.toString().includes(searchVal) || row.date.toLowerCase().includes(searchVal);
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageRows = rowsPerPage === 0 ? filtered : filtered.slice(startIdx, startIdx + rowsPerPage);

  tbody.innerHTML = "";
  pageRows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.month}</strong></td>
      <td>${row.date}</td>
      <td>${formatCurrency(row.startBal)}</td>
      <td>${formatCurrency(row.principal)}</td>
      <td>${formatCurrency(row.interest)}</td>
      <td>${formatCurrency(row.insurance)}</td>
      <td><strong>${formatCurrency(row.totalPayment)}</strong></td>
      <td>${formatCurrency(row.endBal)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Footer Totals
  tfoot.innerHTML = `
    <tr>
      <td colspan="3" style="text-align: center;">${dict.colTotal}</td>
      <td>${formatCurrency(activeCalculationResult.loanAmount)}</td>
      <td>${formatCurrency(activeCalculationResult.totalInterest)}</td>
      <td>${formatCurrency(activeCalculationResult.totalInsurance)}</td>
      <td><strong>${formatCurrency(activeCalculationResult.totalPayable)}</strong></td>
      <td>Rs. 0.00</td>
    </tr>
  `;

  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  const container = document.getElementById("pagination-controls");
  if (!container) return;
  container.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn-page ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });
    container.appendChild(btn);
  }
}

// Side-by-Side Comparison View
function renderComparisonView(loanAmount, annualRate, tenure, insuranceRate) {
  const dict = i18n[currentLang];
  const resReducing = calculateLoanData('reducing', loanAmount, annualRate, tenure, insuranceRate);
  const resFlat = calculateLoanData('flat', loanAmount, annualRate, tenure, insuranceRate);

  const savings = resFlat.totalPayable - resReducing.totalPayable;

  const compareContainer = document.getElementById("compare-calc-view");
  if (!compareContainer) return;

  compareContainer.innerHTML = `
    <div style="grid-column: 1 / -1; margin-bottom: 12px;">
      <h2 style="font-size: 1.3rem; margin-bottom: 8px;">${dict.cmpTitle}</h2>
      <div class="formula-box" style="background: rgba(16, 185, 129, 0.1); border-left-color: var(--accent-emerald);">
        <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); font-size: 1.2rem; margin-right: 8px;"></i>
        ${dict.cmpSavingsMsg.replace("{{savings}}", Number(savings).toLocaleString("en-US", { minimumFractionDigits: 2 }))}
      </div>
    </div>

    <div class="comparison-card highlight">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem; color: var(--accent-emerald);">${dict.cmpReducingHead}</h3>
        <span class="badge-recommended"><i class="fa-solid fa-star"></i> ${dict.recommended}</span>
      </div>
      
      <div class="input-group">
        <div class="metric-title">${dict.monthlyInstallment}</div>
        <div class="metric-value" style="color: var(--accent-emerald);">
          ${formatCurrency(resReducing.firstMonthPayment)} → ${formatCurrency(resReducing.lastMonthPayment)}
        </div>
      </div>

      <div class="summary-cards-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 0;">
        <div class="metric-card">
          <div class="metric-title">${dict.totalInterest}</div>
          <div class="metric-value">${formatCurrency(resReducing.totalInterest)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">${dict.totalInsurance}</div>
          <div class="metric-value">${formatCurrency(resReducing.totalInsurance)}</div>
        </div>
      </div>

      <div class="metric-card emerald-border" style="margin-top: 16px;">
        <div class="metric-title">${dict.totalPayable}</div>
        <div class="metric-value" style="font-size: 1.6rem; color: var(--accent-emerald);">
          ${formatCurrency(resReducing.totalPayable)}
        </div>
      </div>
    </div>

    <div class="comparison-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem;">${dict.cmpFlatHead}</h3>
      </div>

      <div class="input-group">
        <div class="metric-title">${dict.monthlyInstallment}</div>
        <div class="metric-value">
          ${formatCurrency(resFlat.firstMonthPayment)}
        </div>
      </div>

      <div class="summary-cards-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 0;">
        <div class="metric-card">
          <div class="metric-title">${dict.totalInterest}</div>
          <div class="metric-value">${formatCurrency(resFlat.totalInterest)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">${dict.totalInsurance}</div>
          <div class="metric-value">${formatCurrency(resFlat.totalInsurance)}</div>
        </div>
      </div>

      <div class="metric-card gold-border" style="margin-top: 16px;">
        <div class="metric-title">${dict.totalPayable}</div>
        <div class="metric-value" style="font-size: 1.6rem;">
          ${formatCurrency(resFlat.totalPayable)}
        </div>
      </div>
    </div>
  `;
}

// CSV Export
function exportCSV() {
  if (!activeCalculationResult) return;

  const dict = i18n[currentLang];
  let csvContent = "\uFEFF"; // UTF-8 BOM for Excel Sinhala support

  csvContent += `${dict.appTitle} - ${currentMode === 'reducing' ? dict.tabReducing : dict.tabFlat}\n`;
  csvContent += `${dict.loanAmount},${activeCalculationResult.loanAmount}\n`;
  csvContent += `${dict.interestRate},${activeCalculationResult.annualRate}%\n`;
  csvContent += `${dict.loanTenure},${activeCalculationResult.months} ${dict.months}\n`;
  csvContent += `${dict.totalInterest},${activeCalculationResult.totalInterest.toFixed(2)}\n`;
  csvContent += `${dict.totalInsurance},${activeCalculationResult.totalInsurance.toFixed(2)}\n`;
  csvContent += `${dict.totalPayable},${activeCalculationResult.totalPayable.toFixed(2)}\n\n`;

  // Headers
  csvContent += `"${dict.colMonth}","${dict.colDate}","${dict.colStartBal}","${dict.colPrincipal}","${dict.colInterest}","${dict.colInsurance}","${dict.colPayment}","${dict.colEndBal}"\n`;

  // Rows
  activeCalculationResult.schedule.forEach(r => {
    csvContent += `${r.month},"${r.date}",${r.startBal.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.insurance.toFixed(2)},${r.totalPayment.toFixed(2)},${r.endBal.toFixed(2)}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `LankaBank_Loan_Schedule_${currentMode}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Swashakthi Vehicle Loan Calculator Logic
function initVehicleCalculator() {
  // Load saved custom vehicles from localStorage
  const savedVehicles = localStorage.getItem("gscs_custom_vehicles");
  if (savedVehicles) {
    try {
      const parsed = JSON.parse(savedVehicles);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(v => {
          if (!vehicleDatabase.find(existing => existing.id === v.id)) {
            vehicleDatabase.push(v);
          }
        });
      }
    } catch(e) {}
  }

  populateVehicleDropdown();

  // Attach event listeners to all vehicle inputs
  document.querySelectorAll(".veh-input").forEach(input => {
    input.addEventListener("input", updateVehicleCalculation);
  });

  // Vehicle selector change
  document.getElementById("vehicle-select")?.addEventListener("change", (e) => {
    const selectedId = e.target.value;
    if (selectedId === "custom") {
      updateVehicleCalculation();
      return;
    }
    const veh = vehicleDatabase.find(v => v.id === selectedId);
    if (veh) {
      document.getElementById("veh-price").value = veh.price;
      document.getElementById("veh-reg-fee").value = veh.regFee;
      document.getElementById("veh-insurance-fee").value = veh.vehicleInsurance;
      document.getElementById("veh-down-payment").value = veh.downPayment;
      updateVehicleCalculation();
    }
  });

  // Apply loan amount button
  document.getElementById("btn-apply-veh-loan")?.addEventListener("click", () => {
    applyVehicleLoanAmount(lastCalculatedVehicleLoanAmount);
  });

  // Modal open/close
  document.getElementById("btn-add-vehicle-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "flex";
  });

  document.getElementById("btn-close-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "none";
  });

  document.getElementById("btn-cancel-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "none";
  });

  // Save new custom vehicle form submission
  document.getElementById("form-add-vehicle")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("m-veh-name").value.trim();
    const price = parseFloat(document.getElementById("m-veh-price").value) || 0;
    const regFee = parseFloat(document.getElementById("m-veh-reg").value) || 0;
    const vehicleInsurance = parseFloat(document.getElementById("m-veh-insurance").value) || 0;
    const downPayment = parseFloat(document.getElementById("m-veh-down").value) || 0;

    if (!name || price <= 0) return;

    const newVeh = {
      id: "veh_" + Date.now(),
      name: name,
      price: price,
      regFee: regFee,
      vehicleInsurance: vehicleInsurance,
      downPayment: downPayment
    };

    vehicleDatabase.push(newVeh);

    // Save custom vehicles to localStorage
    const customOnly = vehicleDatabase.filter(v => v.id.startsWith("veh_"));
    localStorage.setItem("gscs_custom_vehicles", JSON.stringify(customOnly));

    populateVehicleDropdown();
    document.getElementById("vehicle-select").value = newVeh.id;

    document.getElementById("veh-price").value = price;
    document.getElementById("veh-reg-fee").value = regFee;
    document.getElementById("veh-insurance-fee").value = vehicleInsurance;
    document.getElementById("veh-down-payment").value = downPayment;

    document.getElementById("modal-add-vehicle").style.display = "none";
    document.getElementById("form-add-vehicle").reset();

    updateVehicleCalculation();
  });
}

function populateVehicleDropdown() {
  const select = document.getElementById("vehicle-select");
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = "";

  vehicleDatabase.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = `${v.name} - ${formatCurrency(v.price)}`;
    select.appendChild(opt);
  });

  const customOpt = document.createElement("option");
  customOpt.value = "custom";
  customOpt.textContent = i18n[currentLang].customVehicleOption || "වෙනත් / නියමිත නොවන වාහනයක් (Custom)";
  select.appendChild(customOpt);

  if (currentVal && Array.from(select.options).some(o => o.value === currentVal)) {
    select.value = currentVal;
  }
}

function renderVehicleCalculator() {
  updateVehicleCalculation();
}

function updateVehicleCalculation() {
  const dict = i18n[currentLang];

  const price = parseInputNumber("veh-price", 0);
  const regFee = parseInputNumber("veh-reg-fee", 0);
  const vehInsurance = parseInputNumber("veh-insurance-fee", 0);
  const downPayment = parseInputNumber("veh-down-payment", 0);

  const borrowerShares = parseInputNumber("fee-borrower-shares", 5000);
  const g1Shares = parseInputNumber("fee-guarantor1-shares", 5000);
  const g2Shares = parseInputNumber("fee-guarantor2-shares", 5000);
  const docFee = parseInputNumber("fee-doc", 350);
  const serviceFund = parseInputNumber("fee-service-fund", 1500);
  const loanInsurance = parseInputNumber("fee-loan-insurance", 300);
  const swashakthiFund = parseInputNumber("fee-swashakthi-fund", 5000);
  const buildingFund = parseInputNumber("fee-building-fund", 1000);

  // Formula matching Excel sheet exact rows
  const totalDocFees = borrowerShares + g1Shares + g2Shares + docFee + serviceFund + loanInsurance + swashakthiFund + buildingFund + regFee + vehInsurance;
  const totalVehCost = price + totalDocFees;
  const requiredLoanAmount = Math.max(0, totalVehCost - downPayment);

  lastCalculatedVehicleLoanAmount = requiredLoanAmount;

  // Update summary metrics
  const elDocFees = document.getElementById("veh-metric-doc-fees");
  const elTotalCost = document.getElementById("veh-metric-total-cost");
  const elDownPayment = document.getElementById("veh-metric-down-payment");
  const elRequiredLoan = document.getElementById("veh-metric-required-loan");
  const btnApply = document.getElementById("btn-apply-veh-loan");

  if (elDocFees) elDocFees.textContent = formatCurrency(totalDocFees);
  if (elTotalCost) elTotalCost.textContent = formatCurrency(totalVehCost);
  if (elDownPayment) elDownPayment.textContent = formatCurrency(downPayment);
  if (elRequiredLoan) elRequiredLoan.textContent = formatCurrency(requiredLoanAmount);

  if (btnApply) {
    btnApply.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket"></i> ${dict.btnApplyLoan || 'මෙම ණය මුදල වාරික ගණකයට යොදන්න'} (${formatCurrency(requiredLoanAmount)})`;
  }

  // Render Excel Replica Matrix Table
  renderVehicleComparisonMatrix(borrowerShares, g1Shares, g2Shares, docFee, serviceFund, loanInsurance, swashakthiFund, buildingFund);
}

function renderVehicleComparisonMatrix(borrowerShares, g1Shares, g2Shares, docFee, serviceFund, loanInsurance, swashakthiFund, buildingFund) {
  const table = document.getElementById("veh-comparison-table");
  if (!table) return;

  const dict = i18n[currentLang];
  const standardFixedFees = borrowerShares + g1Shares + g2Shares + docFee + serviceFund + loanInsurance + swashakthiFund + buildingFund;

  let html = `
    <thead>
      <tr>
        <th style="text-align: left;">${dict.colFeeType || 'ගාස්තු විස්තරය'}</th>
  `;

  vehicleDatabase.forEach(v => {
    html += `<th style="text-align: right; color: var(--accent-gold); font-size: 0.95rem;">${v.name}</th>`;
  });

  html += `
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: left;"><strong>${dict.lblVehPrice || 'වාහනයේ වටිනාකම'}</strong></td>
  `;
  vehicleDatabase.forEach(v => {
    html += `<td style="color: var(--accent-rose); font-weight: 700;">${formatCurrency(v.price)}</td>`;
  });
  html += `</tr>`;

  // Standard fee rows
  const feeRows = [
    { name: dict.lblBorrowerShares || "ණයකරු කොටස්", val: borrowerShares },
    { name: dict.lblGuarantor1Shares || "ඇපකරු 1 කොටස්", val: g1Shares },
    { name: dict.lblGuarantor2Shares || "ඇපකරු 2 කොටස්", val: g2Shares },
    { name: dict.lblDocFee || "ලිපි ගාස්තු", val: docFee },
    { name: dict.lblServiceFund || "සේවා අරමුදල", val: serviceFund },
    { name: dict.lblLoanInsurance || "ණය රක්ෂණය", val: loanInsurance },
    { name: dict.lblSwashakthiFund || "ස්වශක්ති අරමුදල", val: swashakthiFund },
    { name: dict.lblBuildingFund || "ගොඩනැගිලි අරමුදල", val: buildingFund }
  ];

  feeRows.forEach(r => {
    html += `
      <tr>
        <td style="text-align: left; color: var(--text-muted);">${r.name}</td>
    `;
    vehicleDatabase.forEach(() => {
      html += `<td>${formatCurrency(r.val)}</td>`;
    });
    html += `</tr>`;
  });

  // Variable rows (Reg & Insurance fees)
  html += `
    <tr>
      <td style="text-align: left;"><strong>${dict.lblRegFee || 'වාහන ලියාපදිංචි ගාස්තු'}</strong></td>
  `;
  vehicleDatabase.forEach(v => {
    html += `<td style="color: var(--accent-rose);">${formatCurrency(v.regFee)}</td>`;
  });
  html += `</tr>`;

  html += `
    <tr>
      <td style="text-align: left;"><strong>${dict.lblVehInsurance || 'වාහන රක්ෂණ ගාස්තු'}</strong></td>
  `;
  vehicleDatabase.forEach(v => {
    html += `<td style="color: var(--accent-rose);">${formatCurrency(v.vehicleInsurance)}</td>`;
  });
  html += `</tr>`;

  // Total Documentation fees
  html += `
    <tr style="background: rgba(245, 158, 11, 0.08);">
      <td style="text-align: left; font-weight: 800;">${dict.lblTotalDocFees || 'ලිපි ලේඛන ගාස්තු එකතුව'}</td>
  `;
  vehicleDatabase.forEach(v => {
    const totDoc = standardFixedFees + v.regFee + v.vehicleInsurance;
    html += `<td style="font-weight: 800; color: var(--accent-gold);">${formatCurrency(totDoc)}</td>`;
  });
  html += `</tr>`;

  // Total vehicle price/cost
  html += `
    <tr>
      <td style="text-align: left; font-weight: 700;">${dict.lblTotalVehCost || 'වාහනයෙහි සම්පූර්ණ පිරිවැය'}</td>
  `;
  vehicleDatabase.forEach(v => {
    const totDoc = standardFixedFees + v.regFee + v.vehicleInsurance;
    const totCost = v.price + totDoc;
    html += `<td style="font-weight: 700;">${formatCurrency(totCost)}</td>`;
  });
  html += `</tr>`;

  // Down Payment
  html += `
    <tr>
      <td style="text-align: left; color: var(--accent-rose); font-weight: 700;">${dict.lblDownPayment || 'වාහනයෙහි මූලික ගෙවීම'}</td>
  `;
  vehicleDatabase.forEach(v => {
    html += `<td style="color: var(--accent-rose); font-weight: 700;">${formatCurrency(v.downPayment)}</td>`;
  });
  html += `</tr>`;

  // Final Required Loan Amount row
  html += `
    <tr style="background: rgba(16, 185, 129, 0.15); border-top: 2px solid var(--accent-emerald);">
      <td style="text-align: left; font-weight: 800; font-size: 0.95rem; color: var(--accent-emerald);">${dict.colRequiredLoan || 'ණය මුදල (Required Loan Amount)'}</td>
  `;
  vehicleDatabase.forEach(v => {
    const totDoc = standardFixedFees + v.regFee + v.vehicleInsurance;
    const totCost = v.price + totDoc;
    const reqLoan = Math.max(0, totCost - v.downPayment);
    html += `
      <td style="font-weight: 800; font-size: 1.05rem; color: var(--accent-emerald);">
        ${formatCurrency(reqLoan)}
        <br>
        <button class="btn-action btn-gold btn-apply-matrix" data-amount="${reqLoan}" style="padding: 2px 8px; font-size: 0.72rem; margin-top: 4px;">
          ${dict.btnApplyThisLoan || 'මේ ණය මුදල ගන්න'}
        </button>
      </td>
    `;
  });
  html += `</tr></tbody>`;

  table.innerHTML = html;

  // Attach event listeners to matrix "Apply" buttons
  document.querySelectorAll(".btn-apply-matrix").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const amount = parseFloat(e.currentTarget.dataset.amount) || 0;
      applyVehicleLoanAmount(amount);
    });
  });
}

function applyVehicleLoanAmount(amount) {
  if (amount <= 0) return;

  const loanInput = document.getElementById("loan-amount");
  const loanSlider = document.getElementById("loan-amount-slider");

  if (loanInput) loanInput.value = amount;
  if (loanSlider) loanSlider.value = amount;

  // Switch to Reducing Balance tab
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.remove("active");
    if (b.dataset.mode === 'reducing') b.classList.add("active");
  });
  currentMode = 'reducing';

  document.getElementById("single-calc-view").style.display = 'grid';
  document.getElementById("compare-calc-view").style.display = 'none';
  document.getElementById("vehicle-calc-view").style.display = 'none';
  document.querySelector(".schedule-section").style.display = 'block';

  calculateAndRender();

  // Scroll smoothly to Loan Amount section
  document.getElementById("single-calc-view")?.scrollIntoView({ behavior: 'smooth' });
}
