// client/script.js
// Exchango — Currency Converter Frontend
// All communication with the backend Express server via Fetch API.

"use strict";

// ── Configuration ─────────────────────────────────────────────────────────────
// When running via "node server.js", everything is on the same origin.
// Change this if deploying frontend separately.
const API_BASE = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? `http://localhost:5000/api`
  : "/api";

// ── Currency Data (code → { name, flag emoji }) ───────────────────────────────
const CURRENCIES = {
  USD: { name: "US Dollar",         flag: "🇺🇸" },
  EUR: { name: "Euro",              flag: "🇪🇺" },
  GBP: { name: "British Pound",     flag: "🇬🇧" },
  JPY: { name: "Japanese Yen",      flag: "🇯🇵" },
  INR: { name: "Indian Rupee",      flag: "🇮🇳" },
  CAD: { name: "Canadian Dollar",   flag: "🇨🇦" },
  AUD: { name: "Australian Dollar", flag: "🇦🇺" },
  CHF: { name: "Swiss Franc",       flag: "🇨🇭" },
  CNY: { name: "Chinese Yuan",      flag: "🇨🇳" },
  SGD: { name: "Singapore Dollar",  flag: "🇸🇬" },
  HKD: { name: "Hong Kong Dollar",  flag: "🇭🇰" },
  NOK: { name: "Norwegian Krone",   flag: "🇳🇴" },
  SEK: { name: "Swedish Krona",     flag: "🇸🇪" },
  DKK: { name: "Danish Krone",      flag: "🇩🇰" },
  NZD: { name: "New Zealand Dollar",flag: "🇳🇿" },
  MXN: { name: "Mexican Peso",      flag: "🇲🇽" },
  BRL: { name: "Brazilian Real",    flag: "🇧🇷" },
  ZAR: { name: "South African Rand",flag: "🇿🇦" },
  TRY: { name: "Turkish Lira",      flag: "🇹🇷" },
  KRW: { name: "South Korean Won",  flag: "🇰🇷" },
  AED: { name: "UAE Dirham",        flag: "🇦🇪" },
  SAR: { name: "Saudi Riyal",       flag: "🇸🇦" },
  THB: { name: "Thai Baht",         flag: "🇹🇭" },
  IDR: { name: "Indonesian Rupiah", flag: "🇮🇩" },
  MYR: { name: "Malaysian Ringgit", flag: "🇲🇾" },
  PHP: { name: "Philippine Peso",   flag: "🇵🇭" },
  PLN: { name: "Polish Złoty",      flag: "🇵🇱" },
  CZK: { name: "Czech Koruna",      flag: "🇨🇿" },
  HUF: { name: "Hungarian Forint",  flag: "🇭🇺" },
  ILS: { name: "Israeli Shekel",    flag: "🇮🇱" },
};

// ── DOM References ────────────────────────────────────────────────────────────
const amountInput   = document.getElementById("amount-input");
const fromSelect    = document.getElementById("from-currency");
const toSelect      = document.getElementById("to-currency");
const convertBtn    = document.getElementById("convert-btn");
const swapBtn       = document.getElementById("swap-btn");
const refreshBtn    = document.getElementById("refresh-btn");
const btnText       = document.getElementById("btn-text");
const spinner       = document.getElementById("spinner");
const resultBlock   = document.getElementById("result-block");
const resultEq      = document.getElementById("result-equation");
const resultAmount  = document.getElementById("result-amount");
const resultCur     = document.getElementById("result-currency");
const rateInfo      = document.getElementById("rate-info");
const rateForward   = document.getElementById("rate-forward");
const rateInverse   = document.getElementById("rate-inverse");
const lastUpdated   = document.getElementById("last-updated");
const alertArea     = document.getElementById("alert-area");
const flagEl        = document.getElementById("amount-flag");
const prefixCode    = document.getElementById("prefix-code");
const amountError   = document.getElementById("amount-error");

// ── Populate Dropdowns ────────────────────────────────────────────────────────
function populateSelects() {
  const codes = Object.keys(CURRENCIES).sort();

  codes.forEach(code => {
    const { name, flag } = CURRENCIES[code];
    const optionHTML = `${flag}  ${code} — ${name}`;

    const optFrom = new Option(optionHTML, code);
    const optTo   = new Option(optionHTML, code);

    fromSelect.add(optFrom);
    toSelect.add(optTo);
  });

  // Default: USD → INR
  fromSelect.value = "USD";
  toSelect.value   = "INR";

  // Set the amount prefix to reflect source currency
  updatePrefix("USD");
}

// ── Update prefix badge (flag + code) ────────────────────────────────────────
function updatePrefix(code) {
  const cur = CURRENCIES[code] || { flag: "🌐", name: code };
  flagEl.textContent    = cur.flag;
  prefixCode.textContent = code;
}

// ── Show Alert ────────────────────────────────────────────────────────────────
function showAlert(message, type = "danger") {
  alertArea.innerHTML = `
    <div class="custom-alert alert-${type}" role="alert">
      <span>${type === "danger" ? "⚠️" : "✅"}</span>
      <span>${message}</span>
    </div>`;

  // Auto-dismiss after 5 s
  setTimeout(() => { alertArea.innerHTML = ""; }, 5000);
}

function clearAlert() { alertArea.innerHTML = ""; }

// ── Validate Inputs ───────────────────────────────────────────────────────────
function validateInputs() {
  let valid = true;

  // Amount check
  const val = amountInput.value.trim();
  if (!val || isNaN(parseFloat(val)) || parseFloat(val) <= 0) {
    amountInput.closest(".amount-input-wrapper").classList.add("is-invalid");
    amountError.textContent = "Please enter a valid positive amount.";
    amountError.classList.add("visible");
    valid = false;
  } else {
    amountInput.closest(".amount-input-wrapper").classList.remove("is-invalid");
    amountError.classList.remove("visible");
  }

  // Currency check
  if (!fromSelect.value) {
    fromSelect.classList.add("is-invalid");
    valid = false;
  } else {
    fromSelect.classList.remove("is-invalid");
  }
  if (!toSelect.value) {
    toSelect.classList.add("is-invalid");
    valid = false;
  } else {
    toSelect.classList.remove("is-invalid");
  }

  return valid;
}

// ── Format number with commas ─────────────────────────────────────────────────
function formatNumber(num) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);
}

// ── Set Loading State ─────────────────────────────────────────────────────────
function setLoading(isLoading) {
  convertBtn.disabled = isLoading;
  spinner.style.display = isLoading ? "block" : "none";
  btnText.textContent   = isLoading ? "Converting…" : "Convert";
}

// ── Main Conversion Function ──────────────────────────────────────────────────
async function doConvert() {
  clearAlert();

  if (!validateInputs()) return;

  const amount = parseFloat(amountInput.value.trim());
  const from   = fromSelect.value;
  const to     = toSelect.value;

  setLoading(true);

  // Hide previous results
  resultBlock.classList.remove("visible");
  rateInfo.classList.remove("visible");

  try {
    // ── Call backend API ───────────────────────────────────────────────────
    const url = `${API_BASE}/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`;
    const response = await fetch(url);
    const json     = await response.json();

    if (!response.ok || !json.success) {
      // Server returned an error
      showAlert(json.error || "Conversion failed. Please try again.");
      return;
    }

    const { convertedAmount, rate, inverseRate, lastUpdated: updatedDate } = json.data;

    // ── Render results ─────────────────────────────────────────────────────
    resultEq.textContent = `${formatNumber(amount)} ${from} =`;
    resultAmount.textContent = formatNumber(convertedAmount);
    resultCur.textContent    = to;

    const fFrom = CURRENCIES[from] || { flag: "" };
    const fTo   = CURRENCIES[to]   || { flag: "" };

    rateForward.textContent = `1 ${from} = ${formatNumber(rate)} ${to}`;
    rateInverse.textContent = `1 ${to} = ${formatNumber(inverseRate)} ${from}`;

    // Format date
    const dateStr = updatedDate
      ? new Date(updatedDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "N/A";
    lastUpdated.textContent = `Last updated: ${dateStr} (ECB)`;

    // Show blocks with animation
    resultBlock.classList.add("visible");
    rateInfo.classList.add("visible");

    showAlert(`Conversion successful! ${formatNumber(amount)} ${from} = ${formatNumber(convertedAmount)} ${to}`, "success");

  } catch (err) {
    // Network-level error
    console.error("Fetch error:", err);
    showAlert("Network error: Unable to reach the server. Is the backend running?");
  } finally {
    setLoading(false);
  }
}

// ── Swap Currencies ───────────────────────────────────────────────────────────
function swapCurrencies() {
  const tempVal      = fromSelect.value;
  fromSelect.value   = toSelect.value;
  toSelect.value     = tempVal;
  updatePrefix(fromSelect.value);

  // If result is already visible, re-convert immediately
  if (resultBlock.classList.contains("visible")) {
    doConvert();
  }
}

// ── Refresh Button ────────────────────────────────────────────────────────────
function handleRefresh() {
  refreshBtn.classList.add("spinning");
  doConvert().finally(() => {
    setTimeout(() => refreshBtn.classList.remove("spinning"), 700);
  });
}

// ── Event Listeners ───────────────────────────────────────────────────────────
convertBtn.addEventListener("click", doConvert);
swapBtn.addEventListener("click", swapCurrencies);
refreshBtn.addEventListener("click", handleRefresh);

// Update prefix when source currency changes
fromSelect.addEventListener("change", () => updatePrefix(fromSelect.value));

// Allow Enter key to trigger conversion
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doConvert();
});

// Clear validation error as user types
amountInput.addEventListener("input", () => {
  amountInput.closest(".amount-input-wrapper").classList.remove("is-invalid");
  amountError.classList.remove("visible");
});

// ── Boot ──────────────────────────────────────────────────────────────────────
populateSelects();
