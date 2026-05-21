// controllers/currencyController.js
// Handles incoming HTTP requests, validates inputs, calls the service layer,
// and returns well-formed JSON responses.

const { convertCurrency, getSupportedCurrencies } = require("../services/currencyService");

/**
 * GET /api/convert?from=USD&to=INR&amount=100
 * Converts an amount from one currency to another.
 */
async function handleConvert(req, res) {
  try {
    const { from, to, amount } = req.query;

    // ── Input Validation ──────────────────────────────────────────────────────
    if (!from || !to || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required query parameters: from, to, amount",
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number.",
      });
    }

    if (parsedAmount > 1_000_000_000) {
      return res.status(400).json({
        success: false,
        error: "Amount is too large. Please enter a value below 1,000,000,000.",
      });
    }

    const fromCode = from.trim().toUpperCase();
    const toCode   = to.trim().toUpperCase();

    // Basic currency code format check (3 uppercase letters)
    const codeRegex = /^[A-Z]{3}$/;
    if (!codeRegex.test(fromCode) || !codeRegex.test(toCode)) {
      return res.status(400).json({
        success: false,
        error: "Currency codes must be 3 letters (e.g., USD, EUR, INR).",
      });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Call service layer
    const result = await convertCurrency(fromCode, toCode, parsedAmount);

    // Build successful response
    return res.status(200).json({
      success: true,
      data: {
        from: fromCode,
        to: toCode,
        amount: parsedAmount,
        convertedAmount: parseFloat(result.convertedAmount.toFixed(4)),
        rate: parseFloat(result.rate.toFixed(6)),        // 1 unit of `from` in `to`
        inverseRate: parseFloat((1 / result.rate).toFixed(6)), // 1 unit of `to` in `from`
        lastUpdated: result.date,
      },
    });
  } catch (err) {
    // Network / API errors
    console.error("[convertController] Error:", err.message);

    const statusCode = err.response?.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || "An unexpected error occurred. Please try again.",
    });
  }
}

/**
 * GET /api/currencies
 * Returns a list of all supported currency codes and their full names.
 */
async function handleGetCurrencies(req, res) {
  try {
    const currencies = await getSupportedCurrencies();
    return res.status(200).json({ success: true, data: currencies });
  } catch (err) {
    console.error("[currenciesController] Error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch supported currencies.",
    });
  }
}

module.exports = { handleConvert, handleGetCurrencies };
