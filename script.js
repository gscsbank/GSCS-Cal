/**
 * Lanka Bank Loan Calculator - Core Script & Logic
 * Supports Reducing Balance (හීනවෙන ක්‍රමය) & Flat Rate (සමාන වාරික ක්‍රමය)
 * Loan Insurance, Bilingual (Sinhala / English) UI, Charts & Exporting.
 */

// Modern Toast Notification System
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

  // Trigger smooth enter animation
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

  // Close on button click
  toast.querySelector('.toast-close')?.addEventListener('click', removeToast);

  // Auto-dismiss after 3.5 seconds
  setTimeout(removeToast, 3500);
}

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
    insuranceHint: "0.06% (නැතහොත් ඔබගේ අනුපාතය)",
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
    cmpSavingsMsg: "හීනවෙන ක්‍රමය තෝරාගැනීමෙන් රු. {{savings}} ක මුදලක් ඉතිරි කරගත හැක!",
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
    lblBuildingFund: "Building Fund",
    lblSwashakthiFund: "Society Contribution",
    lblDocFee: "Doc / Form Fee",
    lblServiceFund: "Service Fund",
    lblLoanInsurance: "Loan Insurance Fee",
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
    insuranceHint: "0.06% (or custom rate)",
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
let currentMode = 'vehicle'; // 'vehicle', 'reducing', 'flat', 'compare'
let tenureUnit = 'months';
let currentPage = 1;
let rowsPerPage = 12;

// Independent Interest Rates for Reducing Balance & Flat Rate
let reducingRate = 18;
let flatRate = 10;

let vehicleDatabase = [
  // ── BIKES ─────────────────────────────────────────────────────────────────
  { id: "bajaj_platina100es",    name: "Bajaj Platina 100 ES",          type: "bike", price: 289900,  regFee: 15000, vehicleInsurance: 8500,  downPayment: 100000 },
  { id: "bajaj_ct100es",         name: "Bajaj CT 100 ES",               type: "bike", price: 279900,  regFee: 15000, vehicleInsurance: 8200,  downPayment: 100000 },
  { id: "bajaj_discover125drl",  name: "Bajaj Discover 125 DRL",        type: "bike", price: 349900,  regFee: 15000, vehicleInsurance: 9800,  downPayment: 120000 },
  { id: "bajaj_pulsarn125",      name: "Bajaj Pulsar N125",             type: "bike", price: 389900,  regFee: 15000, vehicleInsurance: 10500, downPayment: 130000 },
  { id: "bajaj_pulsarns125",     name: "Bajaj Pulsar NS125",            type: "bike", price: 409900,  regFee: 15000, vehicleInsurance: 11000, downPayment: 140000 },
  { id: "bajaj_pulsarn160std",   name: "Bajaj Pulsar N160 Standard",    type: "bike", price: 489900,  regFee: 15000, vehicleInsurance: 13000, downPayment: 160000 },
  { id: "bajaj_pulsarn160prem",  name: "Bajaj Pulsar N160 Premium",     type: "bike", price: 519900,  regFee: 15000, vehicleInsurance: 14000, downPayment: 170000 },
  { id: "bajaj_pulsarns200",     name: "Bajaj Pulsar NS200",            type: "bike", price: 649900,  regFee: 15000, vehicleInsurance: 17500, downPayment: 200000 },
  { id: "bajaj_pulsarrs200",     name: "Bajaj Pulsar RS200",            type: "bike", price: 759900,  regFee: 15000, vehicleInsurance: 20000, downPayment: 250000 },
  { id: "bajaj_pulsarns400z",    name: "Bajaj Pulsar NS400Z",           type: "bike", price: 989900,  regFee: 15000, vehicleInsurance: 26000, downPayment: 350000 },
  { id: "yamaha_rayzr125fi",     name: "Yamaha Ray ZR 125 FI",          type: "bike", price: 359900,  regFee: 15000, vehicleInsurance: 9900,  downPayment: 120000 },
  { id: "yamaha_rayzr125hyb",    name: "Yamaha Ray ZR 125 Hybrid",      type: "bike", price: 379900,  regFee: 15000, vehicleInsurance: 10200, downPayment: 130000 },
  { id: "yamaha_fzsv2",          name: "Yamaha FZ-S V2",                type: "bike", price: 489900,  regFee: 15000, vehicleInsurance: 13000, downPayment: 160000 },
  { id: "yamaha_fzsv3",          name: "Yamaha FZ-S V3",                type: "bike", price: 519900,  regFee: 15000, vehicleInsurance: 14000, downPayment: 170000 },
  { id: "yamaha_fzsv4",          name: "Yamaha FZ-S V4",                type: "bike", price: 549900,  regFee: 15000, vehicleInsurance: 15000, downPayment: 180000 },
  { id: "yamaha_mt15v2",         name: "Yamaha MT-15 V2",               type: "bike", price: 699900,  regFee: 15000, vehicleInsurance: 18500, downPayment: 230000 },
  { id: "yamaha_r15v4",          name: "Yamaha YZF-R15 V4",             type: "bike", price: 849900,  regFee: 15000, vehicleInsurance: 22500, downPayment: 300000 },
  { id: "yamaha_xsr155",         name: "Yamaha XSR 155",                type: "bike", price: 899900,  regFee: 15000, vehicleInsurance: 23500, downPayment: 310000 },
  { id: "tvs_sport110",          name: "TVS Sport 110",                  type: "bike", price: 269900,  regFee: 15000, vehicleInsurance: 7800,  downPayment: 90000  },
  { id: "tvs_raider125",         name: "TVS Raider 125",                 type: "bike", price: 339900,  regFee: 15000, vehicleInsurance: 9500,  downPayment: 110000 },
  { id: "tvs_xl100",             name: "TVS XL 100 (Moped)",             type: "bike", price: 189900,  regFee: 15000, vehicleInsurance: 5500,  downPayment: 70000  },
  { id: "tvs_ntorq125",          name: "TVS Ntorq 125",                  type: "bike", price: 369900,  regFee: 15000, vehicleInsurance: 10000, downPayment: 120000 },
  { id: "tvs_jupiter110",        name: "TVS Jupiter 110",                type: "bike", price: 329900,  regFee: 15000, vehicleInsurance: 9200,  downPayment: 110000 },
  { id: "tvs_jupiter125",        name: "TVS Jupiter 125",                type: "bike", price: 359900,  regFee: 15000, vehicleInsurance: 9900,  downPayment: 120000 },
  { id: "tvs_apache160",         name: "TVS Apache RTR 160 / 2V / 4V",  type: "bike", price: 519900,  regFee: 15000, vehicleInsurance: 14000, downPayment: 170000 },
  { id: "tvs_ronin225",          name: "TVS Ronin 225",                  type: "bike", price: 699900,  regFee: 15000, vehicleInsurance: 18500, downPayment: 230000 },
  { id: "tvs_iqube",             name: "TVS iQube Electric",             type: "bike", price: 749900,  regFee: 15000, vehicleInsurance: 20000, downPayment: 250000 },
  { id: "yadea_cooljoy",         name: "Yadea Cooljoy",                  type: "bike", price: 299900,  regFee: 15000, vehicleInsurance: 8500,  downPayment: 100000 },
  { id: "yadea_ruibins",         name: "Yadea Ruibin S",                 type: "bike", price: 349900,  regFee: 15000, vehicleInsurance: 9800,  downPayment: 120000 },
  { id: "yadea_m6",              name: "Yadea M6",                       type: "bike", price: 379900,  regFee: 15000, vehicleInsurance: 10200, downPayment: 130000 },
  { id: "yadea_t9",              name: "Yadea T9",                       type: "bike", price: 469900,  regFee: 15000, vehicleInsurance: 12500, downPayment: 150000 },
  { id: "yadea_t5l",             name: "Yadea T5L",                      type: "bike", price: 419900,  regFee: 15000, vehicleInsurance: 11500, downPayment: 140000 },
  { id: "yadea_e8spro",          name: "Yadea E8S Pro",                  type: "bike", price: 529900,  regFee: 15000, vehicleInsurance: 14500, downPayment: 180000 },
  { id: "sunra_dream6",          name: "Sunra Dream 6",                  type: "bike", price: 329900,  regFee: 15000, vehicleInsurance: 9200,  downPayment: 110000 },
  { id: "sunra_amalfi",          name: "Sunra Amalfi",                   type: "bike", price: 359900,  regFee: 15000, vehicleInsurance: 9900,  downPayment: 120000 },
  { id: "sunra_k3",              name: "Sunra K3",                       type: "bike", price: 279900,  regFee: 15000, vehicleInsurance: 8200,  downPayment: 100000 },
  { id: "sunra_k3l",             name: "Sunra K3L",                      type: "bike", price: 299900,  regFee: 15000, vehicleInsurance: 8500,  downPayment: 100000 },
  { id: "sunra_k6",              name: "Sunra K6",                       type: "bike", price: 369900,  regFee: 15000, vehicleInsurance: 10000, downPayment: 120000 },
  { id: "sunra_k6l",             name: "Sunra K6L",                      type: "bike", price: 399900,  regFee: 15000, vehicleInsurance: 11000, downPayment: 130000 },
  { id: "sunra_mikumax",         name: "Sunra Miku Max",                 type: "bike", price: 449900,  regFee: 15000, vehicleInsurance: 12000, downPayment: 150000 },

  // ── THREE-WHEELERS ────────────────────────────────────────────────────────
  { id: "bajaj_re4s_petrol",     name: "Bajaj RE 4S Petrol / EFi",      type: "threewheel", price: 1149900, regFee: 18000, vehicleInsurance: 32000, downPayment: 400000 },
  { id: "tvs_king_deluxe",       name: "TVS King Deluxe",               type: "threewheel", price: 1099900, regFee: 18000, vehicleInsurance: 30000, downPayment: 380000 },
  { id: "tvs_king_duramax",      name: "TVS King Duramax",              type: "threewheel", price: 1199900, regFee: 18000, vehicleInsurance: 33000, downPayment: 420000 },
  { id: "tvs_king_ev",           name: "TVS King EV",                   type: "threewheel", price: 1349900, regFee: 18000, vehicleInsurance: 36000, downPayment: 480000 },
  { id: "piaggio_ape_city_p",    name: "Piaggio Ape City Petrol",       type: "threewheel", price: 1249900, regFee: 18000, vehicleInsurance: 34000, downPayment: 440000 },
  { id: "piaggio_ape_city_d",    name: "Piaggio Ape City Diesel",       type: "threewheel", price: 1299900, regFee: 18000, vehicleInsurance: 35000, downPayment: 460000 },
  { id: "piaggio_ape_xtra",      name: "Piaggio Ape Xtra LDX (Pickup)", type: "threewheel", price: 1399900, regFee: 18000, vehicleInsurance: 37000, downPayment: 500000 },
  { id: "piaggio_ape_ecity",     name: "Piaggio Ape E-City",            type: "threewheel", price: 1499900, regFee: 18000, vehicleInsurance: 39000, downPayment: 520000 },
  { id: "piaggio_ape_extra_e",   name: "Piaggio Ape E-Xtra",            type: "threewheel", price: 1549900, regFee: 18000, vehicleInsurance: 40000, downPayment: 550000 }
];

let lastCalculatedVehicleLoanAmount = 499523;

let chartBreakdown = null;
let chartTrend = null;

function updateInterestRatePresetActive(val) {
  const num = parseFloat(val) || 0;
  document.querySelectorAll('.preset-chip[data-for="interest-rate"]').forEach(c => {
    if (parseFloat(c.dataset.value) === num) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // ── DB Version Migration ───────────────────────────────────────────────────
  // Clear old localStorage defaults if they belong to the old 3-vehicle DB (v1)
  const dbVersion = localStorage.getItem("gscs_db_version");
  if (dbVersion !== "2") {
    localStorage.removeItem("gscs_default_vehicles");
    localStorage.setItem("gscs_db_version", "2");
  }
  // ─────────────────────────────────────────────────────────────────────────
  initEventListeners();
  initVehicleCalculator();
  renderVehicleCalculator();
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
      const scheduleSection = document.getElementById("repayment-schedule-section");

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

        // Load the mode-specific interest rate
        const currentRate = currentMode === 'flat' ? flatRate : reducingRate;
        const rateInput = document.getElementById("interest-rate");
        const rateSlider = document.getElementById("interest-rate-slider");
        if (rateInput) rateInput.value = currentRate;
        if (rateSlider) rateSlider.value = currentRate;
        updateInterestRatePresetActive(currentRate);
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
    document.getElementById("repayment-schedule-section").style.display = 'none';
    renderVehicleCalculator();
  });

  // Input fields & Sliders sync
  bindInputSlider("loan-amount", "loan-amount-slider");
  bindInputSlider("interest-rate", "interest-rate-slider");
  bindInputSlider("loan-tenure", "loan-tenure-slider");
  bindInputSlider("insurance-rate", "insurance-rate-slider");

  // Keep track of mode-specific interest rate when edited
  const rateInput = document.getElementById("interest-rate");
  const rateSlider = document.getElementById("interest-rate-slider");

  const syncRate = (val) => {
    const num = parseFloat(val) || 0;
    if (currentMode === 'flat') {
      flatRate = num;
    } else if (currentMode === 'reducing') {
      reducingRate = num;
    }
    updateInterestRatePresetActive(num);
  };

  rateInput?.addEventListener("input", (e) => syncRate(e.target.value));
  rateSlider?.addEventListener("input", (e) => syncRate(e.target.value));

  // Date input
  document.getElementById("start-date")?.addEventListener("change", calculateAndRender);

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

      if (targetInputId === 'interest-rate') {
        const num = parseFloat(val) || 0;
        if (currentMode === 'flat') {
          flatRate = num;
        } else if (currentMode === 'reducing') {
          reducingRate = num;
        }
      }

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
  document.getElementById("btn-export-pdf")?.addEventListener("click", printRepaymentSchedule);
  document.getElementById("btn-print")?.addEventListener("click", printRepaymentSchedule);
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
  const startDateVal = document.getElementById("start-date")?.value || new Date().toISOString().split('T')[0];
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
  let tenure = parseInputNumber("loan-tenure", 60);
  if (tenureUnit === 'years') tenure = tenure * 12;
  const insuranceRate = parseInputNumber("insurance-rate", 0.06);

  if (currentMode === 'compare') {
    renderComparisonView(loanAmount, tenure, insuranceRate);
    return;
  }

  // Use mode-specific rate
  const annualRate = currentMode === 'flat' ? flatRate : reducingRate;

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
  const titleEl = document.getElementById("formula-title");
  const textEl = document.getElementById("formula-text");
  if (!titleEl || !textEl) return;

  const dict = i18n[currentLang];
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
function renderComparisonView(loanAmount, tenure, insuranceRate) {
  const dict = i18n[currentLang];
  const resReducing = calculateLoanData('reducing', loanAmount, reducingRate, tenure, insuranceRate);
  const resFlat = calculateLoanData('flat', loanAmount, flatRate, tenure, insuranceRate);

  const savings = resFlat.totalPayable - resReducing.totalPayable;

  const compareContainer = document.getElementById("compare-calc-view");
  if (!compareContainer) return;

  compareContainer.innerHTML = `
    <div style="grid-column: 1 / -1; margin-bottom: 16px;">
      <h2 style="font-size: 1.3rem; margin-bottom: 8px;">${dict.cmpTitle}</h2>
      <div class="formula-box" style="background: rgba(16, 185, 129, 0.1); border-left-color: var(--accent-emerald); display: flex; align-items: center; gap: 10px;">
        <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); font-size: 1.2rem; flex-shrink: 0;"></i>
        <span>${dict.cmpSavingsMsg.replace("{{savings}}", Number(savings).toLocaleString("en-US", { minimumFractionDigits: 2 }))}</span>
      </div>
    </div>

    <div class="comparison-card highlight">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
        <h3 style="font-size: 1.15rem; color: var(--accent-emerald);">${dict.cmpReducingHead}</h3>
        <span class="badge-recommended"><i class="fa-solid fa-star"></i> ${dict.recommended}</span>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; background: rgba(16,185,129,0.07); border-radius: 8px; padding: 8px 12px;">
        <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); white-space: nowrap;">පොලී අනුපාතය:</label>
        <input type="number" id="cmp-reducing-rate" class="input-field has-suffix" value="${reducingRate}" step="0.25" min="1" max="50" style="width: 80px; padding: 4px 8px; font-size: 0.95rem; font-weight: 700;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">%</span>
        <button id="btn-apply-reducing-rate" class="btn-action btn-emerald" style="padding: 4px 12px; font-size: 0.8rem;">යොදන්න</button>
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
        <h3 style="font-size: 1.15rem;">${dict.cmpFlatHead}</h3>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; background: rgba(245,158,11,0.07); border-radius: 8px; padding: 8px 12px;">
        <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); white-space: nowrap;">පොලී අනුපාතය:</label>
        <input type="number" id="cmp-flat-rate" class="input-field has-suffix" value="${flatRate}" step="0.25" min="1" max="50" style="width: 80px; padding: 4px 8px; font-size: 0.95rem; font-weight: 700;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">%</span>
        <button id="btn-apply-flat-rate" class="btn-action btn-gold" style="padding: 4px 12px; font-size: 0.8rem;">යොදන්න</button>
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

  // Wire up inline rate apply buttons
  document.getElementById("btn-apply-reducing-rate")?.addEventListener("click", () => {
    const val = parseFloat(document.getElementById("cmp-reducing-rate")?.value) || reducingRate;
    reducingRate = val;
    // Also update the main interest-rate input if switching back
    const mainInput = document.getElementById("interest-rate");
    const mainSlider = document.getElementById("interest-rate-slider");
    if (mainInput) mainInput.value = val;
    if (mainSlider) mainSlider.value = val;
    calculateAndRender();
  });

  document.getElementById("btn-apply-flat-rate")?.addEventListener("click", () => {
    const val = parseFloat(document.getElementById("cmp-flat-rate")?.value) || flatRate;
    flatRate = val;
    calculateAndRender();
  });
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

// Professional Repayment Schedule PDF & Print Statement
function printRepaymentSchedule() {
  if (!activeCalculationResult) return;

  const res = activeCalculationResult;
  const modeText = currentMode === 'reducing' ? 'හීනවෙන ක්‍රමය (Reducing Balance)' : 'සමාන වාරික ක්‍රමය (Flat Rate)';
  const printDate = new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' });
  const printTime = new Date().toLocaleTimeString('si-LK', { hour: '2-digit', minute: '2-digit' });

  // Generate table rows HTML for ALL months in schedule
  const rowsHtml = res.schedule.map(r => `
    <tr>
      <td style="text-align: center; font-weight: 700;">${r.month}</td>
      <td style="text-align: center;">${r.date}</td>
      <td style="text-align: right;">${formatCurrency(r.startBal)}</td>
      <td style="text-align: right;">${formatCurrency(r.principal)}</td>
      <td style="text-align: right;">${formatCurrency(r.interest)}</td>
      <td style="text-align: right;">${formatCurrency(r.insurance)}</td>
      <td style="text-align: right; font-weight: 800;">${formatCurrency(r.totalPayment)}</td>
      <td style="text-align: right;">${formatCurrency(r.endBal)}</td>
    </tr>
  `).join("");

  const docHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GSCS BANK - මාසික ගෙවීම් කාලසටහන (${res.months} Months)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 12mm 10mm;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Noto Sans Sinhala', Arial, sans-serif;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #000;
      padding-bottom: 3mm;
      margin-bottom: 3.5mm;
    }
    .brand-title {
      font-size: 13pt;
      font-weight: 800;
      color: #000;
      letter-spacing: 0.3px;
    }
    .brand-subtitle {
      font-size: 8.5pt;
      color: #444;
      font-weight: 600;
    }
    .doc-badge {
      text-align: right;
      font-size: 8pt;
      color: #333;
    }
    .doc-type {
      display: inline-block;
      background: #000;
      color: #fff;
      font-size: 8pt;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 3px;
      margin-bottom: 2px;
    }

    /* Summary Grid */
    .summary-box {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4mm;
      border: 1.2px solid #000;
    }
    .summary-box td {
      padding: 3.5px 8px;
      font-size: 8pt;
      border: 1px solid #ccc;
    }
    .summary-box .lbl {
      background: #f3f4f6;
      font-weight: 700;
      color: #333;
      width: 18%;
    }
    .summary-box .val {
      font-weight: 700;
      color: #000;
      width: 32%;
    }

    /* Amortization Table */
    .sched-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
    }
    .sched-table thead {
      display: table-header-group;
    }
    .sched-table thead th {
      background: #1e293b !important;
      color: #fff !important;
      font-weight: 800;
      padding: 4px 6px;
      border: 1px solid #0f172a;
      text-align: right;
      font-size: 7.5pt;
      text-transform: uppercase;
    }
    .sched-table thead th.c { text-align: center; }
    .sched-table tbody tr {
      page-break-inside: avoid;
    }
    .sched-table tbody tr:nth-child(even) {
      background: #f8fafc !important;
    }
    .sched-table tbody td {
      padding: 3px 6px;
      border: 1px solid #cbd5e1;
      color: #000;
    }
    .sched-table tfoot {
      display: table-footer-group;
    }
    .sched-table tfoot td {
      background: #e2e8f0 !important;
      font-weight: 800;
      padding: 4px 6px;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      border-left: 1px solid #cbd5e1;
      border-right: 1px solid #cbd5e1;
      color: #000;
      font-size: 8pt;
    }

    /* Signatures */
    .sig-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 7mm;
      page-break-inside: avoid;
    }
    .sig-table td {
      width: 25%;
      text-align: center;
      vertical-align: bottom;
      padding: 0 4mm;
    }
    .sig-line {
      border-top: 1.2px dotted #000;
      padding-top: 2mm;
      font-size: 7.5pt;
      font-weight: 700;
      color: #000;
    }
  </style>
</head>
<body>

  <table class="header-table">
    <tr>
      <td>
        <div class="brand-title">GSCS BANK - ණය සේවා අංශය</div>
        <div class="brand-subtitle">ණය මුදල් ගෙවීම් කාලසටහන (Loan Repayment Schedule Statement)</div>
      </td>
      <td class="doc-badge">
        <div class="doc-type">${modeText}</div>
        <div>මුද්‍රිත දිනය: <strong>${printDate}</strong></div>
        <div style="font-size: 7.5pt; color: #666;">වේලාව: ${printTime}</div>
      </td>
    </tr>
  </table>

  <!-- Loan Meta Summary -->
  <table class="summary-box">
    <tr>
      <td class="lbl">ණය මුදල (Principal):</td>
      <td class="val" style="font-size: 9pt; color: #000;">${formatCurrency(res.loanAmount)}</td>
      <td class="lbl">වාර්ෂික පොලිය (Interest Rate):</td>
      <td class="val">${res.annualRate}%</td>
    </tr>
    <tr>
      <td class="lbl">ණය කාලය (Tenure):</td>
      <td class="val">${res.months} මාස (${(res.months/12).toFixed(1)} අවුරුදු)</td>
      <td class="lbl">ණය රක්ෂණ අනුපාතය:</td>
      <td class="val">${res.insuranceRate}%</td>
    </tr>
    <tr>
      <td class="lbl">මුළු පොලිය (Total Interest):</td>
      <td class="val">${formatCurrency(res.totalInterest)}</td>
      <td class="lbl">මාසික වාරිකය:</td>
      <td class="val" style="color: #000;">${currentMode === 'reducing' ? `${formatCurrency(res.firstMonthPayment)} → ${formatCurrency(res.lastMonthPayment)}` : formatCurrency(res.firstMonthPayment)}</td>
    </tr>
    <tr>
      <td class="lbl">මුළු රක්ෂණය:</td>
      <td class="val">${formatCurrency(res.totalInsurance)}</td>
      <td class="lbl" style="background: #e2e8f0; font-weight: 800;">ගෙවිය යුතු මුළු මුදල:</td>
      <td class="val" style="background: #e2e8f0; font-size: 9.5pt; font-weight: 800;">${formatCurrency(res.totalPayable)}</td>
    </tr>
  </table>

  <!-- Schedule Table -->
  <table class="sched-table">
    <thead>
      <tr>
        <th class="c" style="width: 6%;">මාසය</th>
        <th class="c" style="width: 13%;">ගෙවිය යුතු දිනය</th>
        <th style="width: 14%;">ආරම්භක ශේෂය</th>
        <th style="width: 13%;">මුල මුදල</th>
        <th style="width: 13%;">පොලිය</th>
        <th style="width: 12%;">ණය රක්ෂණය</th>
        <th style="width: 14%;">මාසික වාරිකය</th>
        <th style="width: 15%;">අවසාන ශේෂය</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="text-align: center;">එකතුව (TOTAL)</td>
        <td style="text-align: right;">${formatCurrency(res.loanAmount)}</td>
        <td style="text-align: right;">${formatCurrency(res.totalInterest)}</td>
        <td style="text-align: right;">${formatCurrency(res.totalInsurance)}</td>
        <td style="text-align: right; font-weight: 800;">${formatCurrency(res.totalPayable)}</td>
        <td style="text-align: right;">Rs. 0.00</td>
      </tr>
    </tfoot>
  </table>

  <!-- Signature Block -->
  <table class="sig-table">
    <tr>
      <td><div class="sig-line">ණයකරුගේ අත්සන</div></td>
      <td><div class="sig-line">සකස් කළේ (Officer)</div></td>
      <td><div class="sig-line">පරීක්ෂා කළේ (Supervisor)</div></td>
      <td><div class="sig-line">කළමනාකරු / බලයලත් අත්සන</div></td>
    </tr>
  </table>

</body>
</html>`;

  // Use hidden iframe to trigger clean native print
  let iframe = document.getElementById("repayment-print-frame");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "repayment-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(docHtml);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
  }, 350);
}

function getVehicleIconClass(type) {
  switch(type) {
    case 'threewheel':
      return 'tuktuk';
    case 'car':
      return 'fa-solid fa-car';
    case 'van':
      return 'fa-solid fa-car-side';
    case 'bus':
      return 'fa-solid fa-bus';
    case 'lorry':
      return 'fa-solid fa-truck';
    case 'other':
      return 'fa-solid fa-circle-question';
    case 'bike':
    default:
      return 'fa-solid fa-motorcycle';
  }
}

function getVehicleIconHTML(type) {
  if (type === 'threewheel') {
    return `<svg class="tuktuk-svg" viewBox="0 0 100 100" width="1.3em" height="1.3em" fill="currentColor" aria-hidden="true">
      <!-- Roof Top Vent -->
      <path d="M43 14h14a2 2 0 0 1 2 2v3H41v-3a2 2 0 0 1 2-2z"/>
      
      <!-- Side Mirrors -->
      <path d="M26 39c-6-1-9-6-11-10" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="14" cy="27" r="4.5"/>
      <path d="M74 39c6-1 9-6 11-10" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="86" cy="27" r="4.5"/>

      <!-- Wheels (Left, Right, Center Front) -->
      <rect x="25" y="74" width="7" height="12" rx="3.5"/>
      <rect x="68" y="74" width="7" height="12" rx="3.5"/>
      <rect x="46" y="74" width="8" height="17" rx="4"/>

      <!-- Main Body + Cutouts (Windshield, Indicators, Center Headlight) -->
      <path fill-rule="evenodd" d="M33 18.5c-6.5.8-9 4.5-9.5 9.5L21.5 50h-1c-2 0-3.5 1.5-3.5 3.5v20c0 1.8 1.4 3.2 3.2 3.2H31c1.8 0 3.2-1.4 3.2-3.2v-9.5h31.6v9.5c0 1.8 1.4 3.2 3.2 3.2h10.8c1.8 0 3.2-1.4 3.2-3.2v-20c0-2-1.5-3.5-3.5-3.5h-1L76.5 28c-.5-5-3-8.7-9.5-9.5-6-.8-28-.8-34 0zm-4.5 8c0-1.8 1.4-3 3-3h37c1.6 0 3 1.2 3 3l-1.2 17.5c0 1.8-1.4 3-3 3H31.7c-1.6 0-3-1.2-3-3L28.5 26.5zm-2 26.5h7.5a1.5 1.5 0 0 1 1.5 1.5v.5a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5v-.5a1.5 1.5 0 0 1 1.5-1.5zm39 0h7.5a1.5 1.5 0 0 1 1.5 1.5v.5a1.5 1.5 0 0 1-1.5 1.5H65.5a1.5 1.5 0 0 1-1.5-1.5v-.5a1.5 1.5 0 0 1 1.5-1.5zm-15.5 8a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/>
    </svg>`;
  }
  return `<i class="${getVehicleIconClass(type)}"></i>`;
}

function getSelectedVehicleType() {
  const activeChip = document.querySelector('#modal-veh-type-selector .veh-type-chip.active');
  return activeChip ? activeChip.dataset.type : 'bike';
}

function setVehicleTypeInModal(type) {
  const targetType = type || 'bike';
  document.querySelectorAll('#modal-veh-type-selector .veh-type-chip').forEach(chip => {
    const radio = chip.querySelector('input[type="radio"]');
    if (chip.dataset.type === targetType) {
      chip.classList.add('active');
      if (radio) radio.checked = true;
    } else {
      chip.classList.remove('active');
      if (radio) radio.checked = false;
    }
  });
}

// Swashakthi Vehicle Loan Calculator Logic
function initVehicleCalculator() {
  // Load saved edits to default vehicles (Bajaj, Risk, Yamaha) from localStorage
  const savedDefaults = localStorage.getItem("gscs_default_vehicles");
  if (savedDefaults) {
    try {
      const parsed = JSON.parse(savedDefaults);
      if (Array.isArray(parsed)) {
        parsed.forEach(saved => {
          const existing = vehicleDatabase.find(v => v.id === saved.id);
          if (existing) {
            existing.name = saved.name;
            existing.type = saved.type || 'bike';
            existing.price = saved.price;
            existing.regFee = saved.regFee;
            existing.vehicleInsurance = saved.vehicleInsurance;
            existing.downPayment = saved.downPayment;
          }
        });
      }
    } catch(e) {}
  }

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

  // Wire up vehicle type chips inside modal
  document.querySelectorAll("#modal-veh-type-selector .veh-type-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      setVehicleTypeInModal(chip.dataset.type);
    });
  });

  populateVehicleDropdown();

  // Attach event listeners to all vehicle inputs
  document.querySelectorAll(".veh-input").forEach(input => {
    input.addEventListener("input", () => {
      // If user edits price/fees, switch select to custom
      const select = document.getElementById("vehicle-select");
      if (select && select.value !== "custom") {
        const curVeh = vehicleDatabase.find(v => v.id === select.value);
        const p = parseInputNumber("veh-price", 0);
        const r = parseInputNumber("veh-reg-fee", 0);
        const ins = parseInputNumber("veh-insurance-fee", 0);
        const dp = parseInputNumber("veh-down-payment", 0);
        if (curVeh && (curVeh.price !== p || curVeh.regFee !== r || curVeh.vehicleInsurance !== ins || curVeh.downPayment !== dp)) {
          select.value = "custom";
        }
      }
      updateVehicleCalculation();
    });
  });

  // Vehicle selector change
  document.getElementById("vehicle-select")?.addEventListener("change", (e) => {
    selectVehicle(e.target.value);
  });

  // Apply loan amount button
  document.getElementById("btn-apply-veh-loan")?.addEventListener("click", () => {
    applyVehicleLoanAmount(lastCalculatedVehicleLoanAmount);
  });

  // Helper: open modal in ADD mode
  window.openVehicleModalAdd = function() {
    document.getElementById("m-veh-edit-id").value = "";
    document.getElementById("m-veh-name").value = "";
    document.getElementById("m-veh-price").value = "";
    document.getElementById("m-veh-reg").value = 15000;
    document.getElementById("m-veh-insurance").value = 18000;
    document.getElementById("m-veh-down").value = 200000;
    setVehicleTypeInModal("bike");
    document.getElementById("modal-title-text").textContent = "නව වාහනයක් ඇතුළත් කරන්න";
    document.getElementById("btn-save-label").textContent = "සුරකින්න";
    document.getElementById("btn-delete-vehicle").style.display = "none";
    document.getElementById("modal-add-vehicle").style.display = "flex";
    document.getElementById("m-veh-name").focus();
  };

  // Helper: open modal in EDIT mode with vehicle data pre-filled
  window.openVehicleModalEdit = function(vehId) {
    const veh = vehicleDatabase.find(v => v.id === vehId);
    if (!veh) return;
    document.getElementById("m-veh-edit-id").value = veh.id;
    document.getElementById("m-veh-name").value = veh.name;
    document.getElementById("m-veh-price").value = veh.price;
    document.getElementById("m-veh-reg").value = veh.regFee;
    document.getElementById("m-veh-insurance").value = veh.vehicleInsurance;
    document.getElementById("m-veh-down").value = veh.downPayment;
    setVehicleTypeInModal(veh.type || "bike");
    document.getElementById("modal-title-text").textContent = `"${veh.name}" සංස්කරණය`;
    document.getElementById("btn-save-label").textContent = "යාවත්කාලීන කරන්න";
    document.getElementById("btn-delete-vehicle").style.display = "flex";
    document.getElementById("modal-add-vehicle").style.display = "flex";
    document.getElementById("m-veh-name").focus();
  };

  // + Add New button → Add mode
  document.getElementById("btn-add-vehicle-modal")?.addEventListener("click", () => {
    window.openVehicleModalAdd();
  });

  // ✏️ Edit button → Edit mode with currently selected vehicle
  document.getElementById("btn-edit-vehicle-modal")?.addEventListener("click", () => {
    const selectedId = document.getElementById("vehicle-select")?.value;
    if (selectedId && selectedId !== "custom") {
      window.openVehicleModalEdit(selectedId);
    } else {
      window.openVehicleModalAdd();
    }
  });

  // Close / Cancel
  document.getElementById("btn-close-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "none";
  });

  document.getElementById("btn-cancel-modal")?.addEventListener("click", () => {
    document.getElementById("modal-add-vehicle").style.display = "none";
  });

  // Click outside modal to close
  document.getElementById("modal-add-vehicle")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-add-vehicle")) {
      document.getElementById("modal-add-vehicle").style.display = "none";
    }
  });

  // 🗑️ Delete Vehicle
  document.getElementById("btn-delete-vehicle")?.addEventListener("click", () => {
    const editId = document.getElementById("m-veh-edit-id").value;
    if (!editId) return;
    const veh = vehicleDatabase.find(v => v.id === editId);
    if (!veh) return;
    if (!confirm(`"${veh.name}" ඉවත් කිරීමට කැමතිද?`)) return;

    const idx = vehicleDatabase.findIndex(v => v.id === editId);
    if (idx !== -1) vehicleDatabase.splice(idx, 1);

    // Re-save to localStorage (only custom ones)
    const customOnly = vehicleDatabase.filter(v => v.id.startsWith("veh_"));
    localStorage.setItem("gscs_custom_vehicles", JSON.stringify(customOnly));

    document.getElementById("modal-add-vehicle").style.display = "none";
    populateVehicleDropdown();

    // Select first available vehicle
    const firstId = vehicleDatabase[0]?.id;
    if (firstId) {
      selectVehicle(firstId);
    }
    updateVehicleCalculation();
    showToast(`"${veh.name}" වාහනය සාර්ථකව ඉවත් කරන ලදී.`, "warning", "වාහනය ඉවත් කෙරිණි");
  });

  // 💾 Save (Add or Update)
  document.getElementById("form-add-vehicle")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("m-veh-name").value.trim();
    const type = getSelectedVehicleType();
    const price = parseFloat(document.getElementById("m-veh-price").value) || 0;
    const regFee = parseFloat(document.getElementById("m-veh-reg").value) || 0;
    const vehicleInsurance = parseFloat(document.getElementById("m-veh-insurance").value) || 0;
    const downPayment = parseFloat(document.getElementById("m-veh-down").value) || 0;
    const editId = document.getElementById("m-veh-edit-id").value;

    if (!name || price <= 0) return;

    if (editId) {
      // EDIT MODE: update existing entry in vehicleDatabase
      const veh = vehicleDatabase.find(v => v.id === editId);
      if (veh) {
        veh.name = name;
        veh.type = type;
        veh.price = price;
        veh.regFee = regFee;
        veh.vehicleInsurance = vehicleInsurance;
        veh.downPayment = downPayment;
      }
    } else {
      // ADD MODE: create new entry
      const newVeh = {
        id: "veh_" + Date.now(),
        name, type, price, regFee, vehicleInsurance, downPayment
      };
      vehicleDatabase.push(newVeh);
    }

    // Persist ALL custom-id vehicles
    const customOnly = vehicleDatabase.filter(v => v.id.startsWith("veh_"));
    localStorage.setItem("gscs_custom_vehicles", JSON.stringify(customOnly));

    // Also save default vehicles if they were edited
    const defaultEdited = vehicleDatabase.filter(v => !v.id.startsWith("veh_"));
    localStorage.setItem("gscs_default_vehicles", JSON.stringify(defaultEdited));

    populateVehicleDropdown();
    const savedId = editId || vehicleDatabase[vehicleDatabase.length - 1].id;
    selectVehicle(savedId);

    document.getElementById("modal-add-vehicle").style.display = "none";
    document.getElementById("form-add-vehicle").reset();
    showToast(editId ? `"${name}" වාහනයේ විස්තර යාවත්කාලීන කරන ලදී.` : `"${name}" නව වාහනය සාර්ථකව එක් කරන ලදී.`, "success", "සුරකින ලදී");
  });
}

function selectVehicle(id) {
  const select = document.getElementById("vehicle-select");
  if (select) select.value = id;

  // Highlight selected tile
  document.querySelectorAll(".vehicle-tile").forEach(tile => {
    if (tile.dataset.id === id) {
      tile.classList.add("active");
    } else {
      tile.classList.remove("active");
    }
  });

  if (id === "custom") {
    updateVehicleCalculation();
    return;
  }

  const veh = vehicleDatabase.find(v => v.id === id);
  if (veh) {
    document.getElementById("veh-price").value = veh.price;
    document.getElementById("veh-reg-fee").value = veh.regFee;
    document.getElementById("veh-insurance-fee").value = veh.vehicleInsurance;
    document.getElementById("veh-down-payment").value = veh.downPayment;
    updateVehicleCalculation();
  }
}

function renderVehicleTiles(filterQuery = "") {
  const container = document.getElementById("vehicle-tiles-container");
  if (!container) return;

  const select = document.getElementById("vehicle-select");
  const selectedId = (select && select.value) ? select.value : (vehicleDatabase[0] ? vehicleDatabase[0].id : "");

  // Filter by search query (case-insensitive match on name)
  const q = filterQuery.trim().toLowerCase();
  const filtered = q
    ? vehicleDatabase.filter(v => v.name.toLowerCase().includes(q))
    : vehicleDatabase;

  let html = "";

  if (filtered.length === 0) {
    html = `<div class="veh-no-results">
      <i class="fa-solid fa-magnifying-glass"></i>
      <span>«${filterQuery}» සඳහා ප්‍රතිඵල නැත</span>
    </div>`;
  } else {
    filtered.forEach(v => {
      const isActive = v.id === selectedId;
      const iconHtml = getVehicleIconHTML(v.type);
      const typeLabel = { bike: "Bike", threewheel: "3-Wheel", car: "Car", van: "Van", bus: "Bus", lorry: "Lorry", other: "Other" }[v.type] || v.type;
      html += `
        <div class="vehicle-tile ${isActive ? 'active' : ''}" data-id="${v.id}" title="${v.name} තෝරන්න">
          <div class="veh-tile-icon">
            ${iconHtml}
          </div>
          <div class="veh-tile-info">
            <div class="veh-tile-name">${v.name}</div>
            <div class="veh-tile-price">${formatCurrency(v.price)}</div>
            <div class="veh-tile-type">${typeLabel}</div>
          </div>
          <button class="btn-tile-edit" data-id="${v.id}" title="${v.name} සංස්කරණය කරන්න">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      `;
    });
  }

  container.innerHTML = html;

  // Click on tile to select vehicle
  container.querySelectorAll(".vehicle-tile").forEach(tile => {
    tile.addEventListener("click", (e) => {
      if (e.target.closest(".btn-tile-edit")) return;
      selectVehicle(tile.dataset.id);
    });
  });

  // Click on edit button inside tile
  container.querySelectorAll(".btn-tile-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.openVehicleModalEdit) {
        window.openVehicleModalEdit(btn.dataset.id);
      }
    });
  });
}

function populateVehicleDropdown() {
  const select = document.getElementById("vehicle-select");
  if (select) {
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
    customOpt.textContent = i18n[currentLang]?.customVehicleOption || "වෙනත් / නියමිත නොවන වාහනයක් (Custom)";
    select.appendChild(customOpt);

    if (currentVal && Array.from(select.options).some(o => o.value === currentVal)) {
      select.value = currentVal;
    }
  }

  // Wire search input (only once)
  const searchInput = document.getElementById("vehicle-search-input");
  if (searchInput && !searchInput._wired) {
    searchInput._wired = true;
    searchInput.addEventListener("input", () => {
      renderVehicleTiles(searchInput.value);
    });
    // Clear search on Escape
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        renderVehicleTiles();
      }
    });
  }

  // Render the interactive vehicle cards / tiles
  renderVehicleTiles(searchInput?.value || "");
}


function renderVehicleCalculator() {
  populateVehicleDropdown();
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
  const rawLoanAmount = totalVehCost - downPayment;
  const requiredLoanAmount = Math.max(0, rawLoanAmount);

  lastCalculatedVehicleLoanAmount = requiredLoanAmount;

  // Update summary metrics
  const elDocFees = document.getElementById("veh-metric-doc-fees");
  const elTotalCost = document.getElementById("veh-metric-total-cost");
  const elDownPayment = document.getElementById("veh-metric-down-payment");
  const elRequiredLoan = document.getElementById("veh-metric-required-loan");
  const btnApply = document.getElementById("btn-apply-veh-loan");
  const warningEl = document.getElementById("veh-downpayment-warning");
  const warningTextEl = document.getElementById("veh-downpayment-warning-text");

  if (elDocFees) elDocFees.textContent = formatCurrency(totalDocFees);
  if (elTotalCost) elTotalCost.textContent = formatCurrency(totalVehCost);
  if (elDownPayment) elDownPayment.textContent = formatCurrency(downPayment);
  if (elRequiredLoan) elRequiredLoan.textContent = formatCurrency(requiredLoanAmount);

  // Warning when Down Payment exceeds Total Cost
  if (warningEl && warningTextEl) {
    if (downPayment > totalVehCost && totalVehCost > 0) {
      warningEl.style.display = "block";
      warningTextEl.textContent = `මූලික ගෙවීම (${formatCurrency(downPayment)}) සම්පූර්ණ පිරිවැයට (${formatCurrency(totalVehCost)}) වඩා වැඩි බැවින් ණය මුදලක් අවශ්‍ය නොවේ. කරුණාකර මූලික ගෙවීම පරීක්ෂා කරන්න.`;
    } else {
      warningEl.style.display = "none";
    }
  }

  if (btnApply) {
    btnApply.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket"></i> ${dict.btnApplyLoan || 'මෙම ණය මුදල වාරික ගණකයට යොදන්න'} (${formatCurrency(requiredLoanAmount)})`;
  }

  // Re-render saved loans table
  renderSavedLoansTable();
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
  document.getElementById("repayment-schedule-section").style.display = 'block';

  calculateAndRender();

  // Scroll smoothly to Loan Amount section
  document.getElementById("single-calc-view")?.scrollIntoView({ behavior: 'smooth' });
}


// ============================================================

// ============================================================
//  Vehicle Loan Print Slip & Saved Records Management
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initSavedVehicleLoans();
});

// Helper to get saved loan records array
function getSavedVehicleLoans() {
  try {
    const raw = localStorage.getItem("gscs_saved_vehicle_loans");
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

function saveVehicleLoansArray(arr) {
  localStorage.setItem("gscs_saved_vehicle_loans", JSON.stringify(arr));
  updateSavedLoansCountBadge();
}

function updateSavedLoansCountBadge() {
  const count = getSavedVehicleLoans().length;
  const badge = document.getElementById("saved-loans-count-badge");
  if (badge) badge.textContent = count;
}

function initSavedVehicleLoans() {
  updateSavedLoansCountBadge();
  renderSavedLoansTable();

  const saveModal = document.getElementById("modal-save-veh-loan");
  const listModal = document.getElementById("modal-saved-veh-loans-list");

  // Open Save Modal
  document.getElementById("btn-save-veh-loan-modal")?.addEventListener("click", () => {
    const vehSelectEl = document.getElementById("vehicle-select");
    const vehName = vehSelectEl?.options[vehSelectEl.selectedIndex]?.text?.split(" - ")[0] || "වාහනය";
    const reqLoan = document.getElementById("veh-metric-required-loan")?.textContent || "–";

    document.getElementById("save-modal-veh-name").textContent = vehName;
    document.getElementById("save-modal-req-loan").textContent = reqLoan;

    saveModal.style.display = "flex";
    document.getElementById("save-member-id")?.focus();
  });

  // Close Save Modal
  document.getElementById("btn-close-save-modal")?.addEventListener("click", () => {
    saveModal.style.display = "none";
  });
  document.getElementById("btn-cancel-save-modal")?.addEventListener("click", () => {
    saveModal.style.display = "none";
  });

  // Save Form Helper
  function extractCurrentLoanRecord() {
    const vehSelectEl = document.getElementById("vehicle-select");
    const selectedVehName = vehSelectEl?.options[vehSelectEl.selectedIndex]?.text?.split(" - ")[0] || "–";

    const memberId    = document.getElementById("save-member-id")?.value.trim() || "";
    const memberName  = document.getElementById("save-member-name")?.value.trim() || "";
    const loanType    = document.getElementById("save-loan-type")?.value.trim() || "ස්වශක්ති ණය 01";
    const g1Acc       = document.getElementById("save-g1-account")?.value.trim() || "";
    const g2Acc       = document.getElementById("save-g2-account")?.value.trim() || "";
    const period      = parseInt(document.getElementById("save-loan-period")?.value) || 24;
    const rate        = parseFloat(document.getElementById("save-loan-rate")?.value) || 18;

    const vehPrice       = parseInputNumber("veh-price", 0);
    const regFee         = parseInputNumber("veh-reg-fee", 0);
    const vehIns         = parseInputNumber("veh-insurance-fee", 0);
    const downPayment    = parseInputNumber("veh-down-payment", 0);
    const borrowerShares = parseInputNumber("fee-borrower-shares", 5000);
    const g1             = parseInputNumber("fee-guarantor1-shares", 5000);
    const g2             = parseInputNumber("fee-guarantor2-shares", 5000);
    const docFee         = parseInputNumber("fee-doc", 350);
    const serviceFund    = parseInputNumber("fee-service-fund", 1500);
    const loanIns        = parseInputNumber("fee-loan-insurance", 300);
    const swashakthi     = parseInputNumber("fee-swashakthi-fund", 5000);
    const building       = parseInputNumber("fee-building-fund", 1000);

    const totalDocFees   = borrowerShares + g1 + g2 + docFee + serviceFund + loanIns + swashakthi + building + regFee + vehIns;
    const totalVehCost   = vehPrice + totalDocFees;
    const requiredLoan   = Math.max(0, totalVehCost - downPayment);

    const record = {
      id: "saveloan_" + Date.now(),
      date: new Date().toLocaleDateString('si-LK', { year:'numeric', month:'short', day:'numeric' }),
      timestamp: Date.now(),
      memberId,
      memberName,
      loanType,
      g1Acc,
      g2Acc,
      period,
      rate,
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
      totalDocFees,
      totalVehCost,
      requiredLoan
    };

    return record;
  }

  // Handle Save & Print on Form Submit
  document.getElementById("form-save-veh-loan")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const record = extractCurrentLoanRecord();
    if (!record.memberId || !record.memberName) {
      showToast("කරුණාකර සාමාජික අංකය සහ නම ඇතුළත් කරන්න.", "warning", "තොරතුරු අවශ්‍යයි");
      return;
    }

    const saved = getSavedVehicleLoans();
    saved.unshift(record);
    saveVehicleLoansArray(saved);

    saveModal.style.display = "none";
    renderSavedLoansTable();
    showToast(`"${record.memberName}" (${record.memberId}) ගේ වාහන ණය සුරැකි අතර Print Preview විවෘත වේ...`, "success", "සුරකින ලදී & Print");

    // Trigger print with this record
    printVehicleLoanSlip(record);
  });

  // Open Saved Loans List Modal
  document.getElementById("btn-view-saved-veh-loans")?.addEventListener("click", () => {
    renderSavedLoansTable();
    listModal.style.display = "flex";
  });

  // Close Saved Loans List Modal
  document.getElementById("btn-close-saved-list-modal")?.addEventListener("click", () => {
    listModal.style.display = "none";
  });

  // Search in Saved Loans Table
  document.getElementById("search-saved-loans")?.addEventListener("input", (e) => {
    renderSavedLoansTable(e.target.value.trim().toLowerCase());
  });

  // Clear All Saved Loans
  document.getElementById("btn-clear-all-saved-loans")?.addEventListener("click", () => {
    if (getSavedVehicleLoans().length === 0) return;
    if (confirm("සියලුම සුරකින ලද වාහන ණය වාර්තා ඉවත් කිරීමට ඔබට සහතිකද?")) {
      saveVehicleLoansArray([]);
      renderSavedLoansTable();
      showToast("සියලුම සුරකින ලද වාර්තා ඉවත් කරන ලදී.", "warning", "මකා දැමිණි");
    }
  });

  // Close modals on clicking backdrop
  window.addEventListener("click", (e) => {
    if (e.target === saveModal) saveModal.style.display = "none";
    if (e.target === listModal) listModal.style.display = "none";
  });
}

function renderSavedLoansTable(filterQuery = "") {
  const tbody = document.getElementById("saved-loans-tbody");
  if (!tbody) return;

  const records = getSavedVehicleLoans();
  const filtered = filterQuery
    ? records.filter(r => 
        (r.memberId && r.memberId.toLowerCase().includes(filterQuery)) ||
        (r.memberName && r.memberName.toLowerCase().includes(filterQuery)) ||
        (r.g1Acc && r.g1Acc.toLowerCase().includes(filterQuery)) ||
        (r.g2Acc && r.g2Acc.toLowerCase().includes(filterQuery)) ||
        (r.vehicleName && r.vehicleName.toLowerCase().includes(filterQuery))
      )
    : records;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 28px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 8px; display:block; opacity: 0.5;"></i>
          සුරකින ලද වාර්තා කිසිවක් හමු නොවීය
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td style="text-align: left;">
        <div style="font-weight: 700; color: var(--text-primary);">${r.memberName}</div>
        <div style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 600;">${r.memberId}</div>
      </td>
      <td style="text-align: left; font-weight: 600;">${r.vehicleName}</td>
      <td style="font-family: monospace; font-size: 0.82rem; font-weight: 600;">${r.g1Acc || '–'}</td>
      <td style="font-family: monospace; font-size: 0.82rem; font-weight: 600;">${r.g2Acc || '–'}</td>
      <td>${formatCurrency(r.vehPrice)}</td>
      <td style="color: var(--accent-rose);">${formatCurrency(r.downPayment)}</td>
      <td style="font-weight: 700; color: var(--accent-emerald); font-size: 0.95rem;">${formatCurrency(r.requiredLoan)}</td>
      <td style="font-size: 0.8rem; color: var(--text-muted);">${r.date}</td>
      <td style="text-align: center;">
        <div style="display: inline-flex; gap: 6px;">
          <button class="btn-action btn-emerald btn-saved-print" data-id="${r.id}" title="A4 Print Slip (A5 පිටපත් 2)" style="padding: 4px 8px; font-size: 0.75rem;">
            <i class="fa-solid fa-print"></i>
          </button>
          <button class="btn-action btn-blue btn-saved-load" data-id="${r.id}" title="ගණකයට ඇතුළත් කරන්න" style="padding: 4px 8px; font-size: 0.75rem;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
          <button class="btn-action btn-saved-delete" data-id="${r.id}" title="මකන්න" style="padding: 4px 8px; font-size: 0.75rem; color: var(--accent-rose); border-color: rgba(244,63,94,0.3);">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");

  // Attach row action listeners
  tbody.querySelectorAll(".btn-saved-print").forEach(btn => {
    btn.addEventListener("click", () => {
      const record = records.find(r => r.id === btn.dataset.id);
      if (record) printVehicleLoanSlip(record);
    });
  });

  tbody.querySelectorAll(".btn-saved-load").forEach(btn => {
    btn.addEventListener("click", () => {
      const record = records.find(r => r.id === btn.dataset.id);
      if (record) {
        document.getElementById("veh-price").value = record.vehPrice;
        document.getElementById("veh-reg-fee").value = record.regFee;
        document.getElementById("veh-insurance-fee").value = record.vehIns;
        document.getElementById("veh-down-payment").value = record.downPayment;
        document.getElementById("fee-borrower-shares").value = record.borrowerShares;
        document.getElementById("fee-guarantor1-shares").value = record.g1;
        document.getElementById("fee-guarantor2-shares").value = record.g2;
        document.getElementById("fee-doc").value = record.docFee;
        document.getElementById("fee-service-fund").value = record.serviceFund;
        document.getElementById("fee-loan-insurance").value = record.loanIns;
        document.getElementById("fee-swashakthi-fund").value = record.swashakthi;
        document.getElementById("fee-building-fund").value = record.building;

        if (record.memberId) document.getElementById("save-member-id").value = record.memberId;
        if (record.memberName) document.getElementById("save-member-name").value = record.memberName;
        if (record.loanType) document.getElementById("save-loan-type").value = record.loanType;
        if (record.g1Acc) document.getElementById("save-g1-account").value = record.g1Acc;
        if (record.g2Acc) document.getElementById("save-g2-account").value = record.g2Acc;
        if (record.period) document.getElementById("save-loan-period").value = record.period;
        if (record.rate) document.getElementById("save-loan-rate").value = record.rate;

        updateVehicleCalculation();
        document.getElementById("modal-saved-veh-loans-list").style.display = "none";
        showToast(`"${record.memberName}" ගේ දත්ත ගණකයට ඇතුළත් කරන ලදී.`, "info", "දත්ත ඇතුළත් විය");
      }
    });
  });

  tbody.querySelectorAll(".btn-saved-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const record = records.find(r => r.id === btn.dataset.id);
      if (record && confirm(`"${record.memberName}" (${record.memberId}) ගේ වාර්තාව මකා දැමීමට සහතිකද?`)) {
        const updated = records.filter(r => r.id !== btn.dataset.id);
        saveVehicleLoansArray(updated);
        renderSavedLoansTable(document.getElementById("search-saved-loans")?.value.trim().toLowerCase());
        showToast(`"${record.memberName}" ගේ වාර්තාව ඉවත් කරන ලදී.`, "warning", "වාර්තාව මකා දැමිණි");
      }
    });
  });
}


function printVehicleLoanSlip(customData = null) {
  // Read values either from customData (saved record) or live inputs
  let selectedVehName, vehPrice, regFee, vehIns, downPayment;
  let borrowerShares, g1, g2, docFee, serviceFund, loanIns, swashakthi, building;
  let totalDocFees, totalVehCost, requiredLoan, today;
  let memberId = "", memberName = "", loanType = "ස්වශක්ති ණය 01", g1Acc = "", g2Acc = "", period = 24, rate = 18;

  if (customData) {
    selectedVehName = customData.vehicleName || "–";
    vehPrice       = customData.vehPrice || 0;
    regFee         = customData.regFee || 0;
    vehIns         = customData.vehIns || 0;
    downPayment    = customData.downPayment || 0;
    borrowerShares = customData.borrowerShares || 5000;
    g1             = customData.g1 || 5000;
    g2             = customData.g2 || 5000;
    docFee         = customData.docFee || 350;
    serviceFund    = customData.serviceFund || 1500;
    loanIns        = customData.loanIns || 300;
    swashakthi     = customData.swashakthi || 5000;
    building       = customData.building || 1000;
    totalDocFees   = customData.totalDocFees || (borrowerShares + g1 + g2 + docFee + serviceFund + loanIns + swashakthi + building + regFee + vehIns);
    totalVehCost   = customData.totalVehCost || (vehPrice + totalDocFees);
    requiredLoan   = customData.requiredLoan || Math.max(0, totalVehCost - downPayment);
    today          = customData.date || new Date().toLocaleDateString('si-LK', { year:'numeric', month:'long', day:'numeric' });
    memberId       = customData.memberId || "";
    memberName     = customData.memberName || "";
    loanType       = customData.loanType || "ස්වශක්ති ණය 01";
    g1Acc          = customData.g1Acc || "";
    g2Acc          = customData.g2Acc || "";
    period         = customData.period || 24;
    rate           = customData.rate || 18;
  } else {
    const vehSelectEl = document.getElementById("vehicle-select");
    selectedVehName = vehSelectEl?.options[vehSelectEl.selectedIndex]?.text?.split(" - ")[0] || "–";
    vehPrice       = parseInputNumber("veh-price", 0);
    regFee         = parseInputNumber("veh-reg-fee", 0);
    vehIns         = parseInputNumber("veh-insurance-fee", 0);
    downPayment    = parseInputNumber("veh-down-payment", 0);
    borrowerShares = parseInputNumber("fee-borrower-shares", 5000);
    g1             = parseInputNumber("fee-guarantor1-shares", 5000);
    g2             = parseInputNumber("fee-guarantor2-shares", 5000);
    docFee         = parseInputNumber("fee-doc", 350);
    serviceFund    = parseInputNumber("fee-service-fund", 1500);
    loanIns        = parseInputNumber("fee-loan-insurance", 300);
    swashakthi     = parseInputNumber("fee-swashakthi-fund", 5000);
    building       = parseInputNumber("fee-building-fund", 1000);
    totalDocFees   = borrowerShares + g1 + g2 + docFee + serviceFund + loanIns + swashakthi + building + regFee + vehIns;
    totalVehCost   = vehPrice + totalDocFees;
    requiredLoan   = Math.max(0, totalVehCost - downPayment);
    today          = new Date().toLocaleDateString('si-LK', { year:'numeric', month:'long', day:'numeric' });
    memberId       = document.getElementById("save-member-id")?.value.trim() || "";
    memberName     = document.getElementById("save-member-name")?.value.trim() || "";
    loanType       = document.getElementById("save-loan-type")?.value.trim() || "ස්වශක්ති ණය 01";
    g1Acc          = document.getElementById("save-g1-account")?.value.trim() || "";
    g2Acc          = document.getElementById("save-g2-account")?.value.trim() || "";
    period         = parseInt(document.getElementById("save-loan-period")?.value) || 24;
    rate           = parseFloat(document.getElementById("save-loan-rate")?.value) || 18;
  }

  // Format rupees helper
  const fmtR = v => "රු. " + Number(v).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // ── Build full print HTML ──────────────────────────────────
  const printCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 4mm 6mm; }
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
      height: 288mm;
    }
    .slip {
      width: 100%;
      height: 140mm;
      border: 1.5px solid #000;
      padding: 4mm 6mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .slip-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* ── HEADER ── */
    .slip-head { border-bottom: 2px solid #000; padding-bottom: 2mm; margin-bottom: 2.5mm; }
    .slip-head table { width: 100%; border-collapse: collapse; }
    .slip-head td { padding: 0; vertical-align: middle; }
    .slip-head td:last-child { text-align: right; }
    .slip-bank { font-size: 13.5pt; font-weight: 800; color: #000; letter-spacing: -0.02em; line-height: 1.1; margin-top: 1px; }
    .slip-sub  { font-size: 8pt; color: #000; margin-top: 1px; }
    .slip-sub-en { font-size: 7pt; color: #333; }
    .slip-date { font-size: 8pt; color: #000; font-weight: 600; }
    .slip-staff {
      font-size: 6.5pt; font-weight: 700; color: #000;
      border: 1.5px solid #000; border-radius: 12px;
      padding: 1.5px 6px; display: inline-block; margin-top: 2px;
    }

    /* ── VEHICLE BADGE ── */
    .slip-veh {
      font-size: 10pt; font-weight: 700; color: #000;
      border: 1.5px solid #000; display: inline-block;
      padding: 2px 9px; margin-bottom: 2.5mm; align-self: flex-start;
      background: #f4f4f4 !important;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }

    /* ── MAIN CONTENT: 2 columns ── */
    .content-grid { width: 100%; border-collapse: collapse; flex: 1; }
    .content-grid > tbody > tr > td { vertical-align: top; padding: 0; }
    .col-divider { width: 4mm; }

    /* ── MANUAL & AUTO FIELDS ── */
    .fields-block { margin-bottom: 1.5mm; }
    .field-row { margin-bottom: 2mm; }
    .field-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-bottom: 2mm; }
    .field-lbl { font-size: 7pt; color: #000; font-weight: 700; display: block; margin-bottom: 0.5mm; }
    .field-line {
      border-bottom: 1.2px solid #000;
      min-height: 4.8mm;
      width: 100%;
      display: block;
      font-size: 7.5pt;
      font-weight: 700;
      color: #000;
      line-height: 4.8mm;
      padding-left: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .val-text {
      font-size: 7.8pt;
      font-weight: 700;
      color: #000;
    }
    .font-mono {
      font-family: 'Inter', Consolas, Monaco, monospace, sans-serif;
      font-weight: 800;
      letter-spacing: 0.4px;
    }
    .check-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.4mm;
      height: 3.4mm;
      border: 1.2px solid #000;
      border-radius: 1.5px;
      vertical-align: -0.5mm;
      margin-right: 3px;
      background: #fff;
      font-size: 6.5pt;
      line-height: 1;
      font-weight: 900;
    }

    /* ── FEE TABLE ── */
    .fee-tbl { width: 100%; border-collapse: collapse; font-size: 8pt; color: #000; }
    .fee-tbl thead th {
      background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
      color: #fff !important; padding: 3px 6px; font-weight: 700; font-size: 7.5pt;
      border: 1px solid #000; text-align: left;
    }
    .fee-tbl tbody tr:nth-child(even) td {
      background: #f2f2f2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .fee-tbl td { padding: 2.2px 6px; border: 1px solid #ccc; color: #000; font-size: 8pt; }
    .fee-tbl td.r { text-align: right; font-weight: 700; }

    /* ── SUMMARY ── */
    .sum-tbl { width: 100%; border-collapse: collapse; font-size: 8pt; margin-top: 2mm; }
    .sum-tbl td { padding: 2.2px 6px; border: 1px solid #ccc; color: #000; }
    .sum-tbl td.r { text-align: right; font-weight: 700; }
    .sum-tbl tr.hl td {
      background: #dcdcdc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
      border-top: 2px solid #000; font-weight: 800; font-size: 9pt; padding: 3.5px 6px;
    }
    .sum-tbl tr.hl td.r { font-size: 11pt; font-weight: 900; }

    /* COPY TYPE BADGE */
    .slip-copy-badge {
      display: inline-block;
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #000;
      background: #e0e0e0 !important;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
      border: 1.5px solid #000;
      border-radius: 3px;
      padding: 1px 7px;
      margin-bottom: 2px;
    }

    /* ── SIGNATURE ROW ── */
    .slip-sign-row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 2.5mm;
      padding-top: 1mm;
    }
    .sign-box { width: 46%; }
    .sign-line { border-bottom: 1.2px dotted #000; width: 44mm; min-height: 4.5mm; }
    .sign-lbl { font-size: 7pt; font-weight: 700; color: #000; margin-top: 0.8mm; line-height: 1.2; }
    .sign-sub { font-size: 6pt; color: #555; }

    /* CUT LINE */
    .cut-line {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 1.5mm 0;
      color: #555;
      font-size: 7pt;
      font-family: Arial, sans-serif;
    }
    .cut-line hr { flex: 1; border: none; border-top: 1.2px dashed #555; }
    .cut-label { font-size: 7pt; font-weight: 700; letter-spacing: 1px; }
  `;

  function createSlipHTML(copyName) {
    const isType01 = loanType.includes("01") || loanType === "ස්වශක්ති ණය 01";
    const isType02 = loanType.includes("02") || loanType === "ස්වශක්ති ණය 02";

    let memberDisplay = "";
    if (memberName) {
      memberDisplay = memberId ? `${memberName} (${memberId})` : memberName;
    }

    return `
    <div class="slip">
      <div class="slip-inner">

        <!-- Header -->
        <div class="slip-head">
          <table><tr>
            <td>
              <div class="slip-copy-badge">${copyName}</div>
              <div class="slip-bank">GSCS BANK</div>
              <div class="slip-sub">ස්වශක්ති වාහන ණය – ගාස්තු ගණනය කිරීමේ සටහන</div>
              <div class="slip-sub-en">Swashakthi Vehicle Loan – Fee Calculation Slip</div>
            </td>
            <td>
              <div class="slip-date">${today}</div>
              <div class="slip-staff">FOR STAFF USE ONLY</div>
            </td>
          </tr></table>
        </div>

        <!-- Vehicle name badge -->
        <div class="slip-veh">&#x1F3CD;&nbsp; ${selectedVehName}</div>

        <!-- Two column layout: manual fields LEFT | fee table RIGHT -->
        <table class="content-grid"><tbody><tr>

          <!-- LEFT: Details fields -->
          <td style="width:42%;">
            <div class="fields-block">

              <div class="field-row">
                <span class="field-lbl">ස්වශක්ති ණය වර්ගය / Loan Type:</span>
                <div style="display: flex; gap: 10px; margin-top: 2px; font-size: 7.2pt; font-weight: 700;">
                  <span style="display: inline-flex; align-items: center;"><span class="check-box">${isType01 ? '&#10004;' : ''}</span> ස්වශක්ති ණය 01</span>
                  <span style="display: inline-flex; align-items: center;"><span class="check-box">${isType02 ? '&#10004;' : ''}</span> ස්වශක්ති ණය 02</span>
                </div>
              </div>

              <div class="field-row">
                <span class="field-lbl">සාමාජිකයා / Member:</span>
                <span class="field-line">${memberDisplay ? `<span class="val-text">${memberDisplay}</span>` : ''}</span>
              </div>

              <div class="field-row">
                <span class="field-lbl">ණය ගිණුම් අංකය / Loan A/C No:</span>
                <span class="field-line"></span>
              </div>

              <div class="field-row">
                <span class="field-lbl">ඇපකරු 1 ගිණුම් අංකය / Guarantor 1 A/C:</span>
                <span class="field-line">${g1Acc ? `<span class="val-text font-mono">${g1Acc}</span>` : ''}</span>
              </div>

              <div class="field-row">
                <span class="field-lbl">ඇපකරු 2 ගිණුම් අංකය / Guarantor 2 A/C:</span>
                <span class="field-line">${g2Acc ? `<span class="val-text font-mono">${g2Acc}</span>` : ''}</span>
              </div>

              <div class="field-row-grid">
                <div>
                  <span class="field-lbl">කාලය / Period:</span>
                  <span class="field-line">${period ? `<span class="val-text">${period} මාස</span>` : ''}</span>
                </div>
                <div>
                  <span class="field-lbl">පොලී / Rate:</span>
                  <span class="field-line">${rate ? `<span class="val-text">${rate}%</span>` : ''}</span>
                </div>
              </div>

            </div>

            <!-- Summary below fields -->
            <table class="sum-tbl">
              <tr><td>ලිපි ලේඛන ගාස්තු</td><td class="r">${fmtR(totalDocFees)}</td></tr>
              <tr><td>සම්පූර්ණ පිරිවැය</td><td class="r">${fmtR(totalVehCost)}</td></tr>
              <tr><td>මූලික ගෙවීම</td><td class="r">${fmtR(downPayment)}</td></tr>
              <tr class="hl"><td>අවශ්‍ය ණය මුදල</td><td class="r">${fmtR(requiredLoan)}</td></tr>
            </table>
          </td>

          <td class="col-divider"></td>

          <!-- RIGHT: Fee breakdown table -->
          <td style="width:54%;">
            <table class="fee-tbl">
              <thead>
                <tr><th>විස්තරය</th><th style="text-align:right;">මුදල (Rs.)</th></tr>
              </thead>
              <tbody>
                <tr><td>වාහනයේ මිල</td><td class="r">${fmtR(vehPrice)}</td></tr>
                <tr><td>ණයකරු කොටස්</td><td class="r">${fmtR(borrowerShares)}</td></tr>
                <tr><td>ඇපකරු 1 කොටස්</td><td class="r">${fmtR(g1)}</td></tr>
                <tr><td>ඇපකරු 2 කොටස්</td><td class="r">${fmtR(g2)}</td></tr>
                <tr><td>ගොඩනැගිලි අරමුදල</td><td class="r">${fmtR(building)}</td></tr>
                <tr><td>ලියාපදිංචි ගාස්තු</td><td class="r">${fmtR(regFee)}</td></tr>
                <tr><td>වාහන රක්ෂණ ගාස්තු</td><td class="r">${fmtR(vehIns)}</td></tr>
                <tr><td>සමිති දායකත්වය</td><td class="r">${fmtR(swashakthi)}</td></tr>
                <tr><td>ලිපි ගාස්තු</td><td class="r">${fmtR(docFee)}</td></tr>
                <tr><td>සේවා අරමුදල</td><td class="r">${fmtR(serviceFund)}</td></tr>
                <tr><td>ණය රක්ෂණය</td><td class="r">${fmtR(loanIns)}</td></tr>
                <tr><td>මූලික ගෙවීම</td><td class="r">(${fmtR(downPayment)})</td></tr>
              </tbody>
            </table>
          </td>

        </tr></tbody></table>

        <!-- Footer Signatures Row -->
        <div class="slip-sign-row">
          <div class="sign-box" style="text-align: left;">
            <div class="sign-line"></div>
            <div class="sign-lbl">පරීක්ෂා කළ නිලධාරියාගේ අත්සන</div>
            <div class="sign-sub">Checked by Officer</div>
          </div>
          <div class="sign-box" style="text-align: right;">
            <div class="sign-line" style="margin-left: auto;"></div>
            <div class="sign-lbl">සකස් කළ නිලධාරියාගේ අත්සන</div>
            <div class="sign-sub">Prepared by Officer Signature</div>
          </div>
        </div>

      </div>
    </div>
    `;
  }

  const slipCashier = createSlipHTML("CASHIER COPY");
  const slipCustomer = createSlipHTML("CUSTOMER FILE COPY");

  const fullHTML = `<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>GSCS BANK – Vehicle Loan Slip</title>
  <style>${printCSS}</style>
</head>
<body>
  <div class="wrap">
    ${slipCashier}
    <div class="cut-line"><hr> <span class="cut-label">✂ CUT HERE ✂</span> <hr></div>
    ${slipCustomer}
  </div>
</body>
</html>`;

  // ── Print via hidden iframe (no new tab, native print dialog) ──
  let iframe = document.getElementById("_veh_print_frame");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "_veh_print_frame";
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


