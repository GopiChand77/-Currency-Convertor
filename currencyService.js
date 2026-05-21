// services/currencyService.js
// Fetches real-time exchange rates from the Frankfurter API (https://www.frankfurter.app)
// Frankfurter is completely free, open-source, and requires NO API key.
// It uses data from the European Central Bank, updated daily on business days.

const axios = require("axios");

const BASE_URL = "https://api.frankfurter.app";

/**
 * Fetches the latest exchange rate between two currencies.
 * @param {string} from  - Source currency code (e.g., "USD")
 * @param {string} to    - Target currency code (e.g., "INR")
 * @param {number} amount - Amount to convert
 * @returns {Object} { convertedAmount, rate, date }
 */
async function convertCurrency(from, to, amount) {
  // If from === to, no conversion needed
  if (from === to) {
    return {
      convertedAmount: parseFloat(amount),
      rate: 1,
      date: new Date().toISOString(),
    };
  }

  // Build the Frankfurter API URL
  // Example: https://api.frankfurter.app/latest?amount=100&from=USD&to=INR
  const url = `${BASE_URL}/latest`;

  const response = await axios.get(url, {
    params: {
      amount: parseFloat(amount),
      from: from.toUpperCase(),
      to: to.toUpperCase(),
    },
    timeout: 8000, // 8-second timeout
  });

  const data = response.data;

  // Frankfurter returns: { amount, base, date, rates: { EUR: 91.55, ... } }
  if (!data.rates || !data.rates[to.toUpperCase()]) {
    throw new Error(
      `Exchange rate not available for the pair ${from}/${to}. ` +
        `Note: Frankfurter does not support all currencies (e.g., crypto).`
    );
  }

  return {
    convertedAmount: data.rates[to.toUpperCase()],
    rate: data.rates[to.toUpperCase()] / parseFloat(amount), // rate for 1 unit
    date: data.date, // ECB update date (YYYY-MM-DD)
  };
}

/**
 * Returns a list of all supported currencies from Frankfurter.
 * @returns {Object} currency code → full name map
 */
async function getSupportedCurrencies() {
  const response = await axios.get(`${BASE_URL}/currencies`, { timeout: 8000 });
  return response.data;
}

module.exports = { convertCurrency, getSupportedCurrencies };
