// routes/currencyRoutes.js
// Defines all API routes for the currency converter.
// Mounted at /api in server.js.

const express  = require("express");
const router   = express.Router();
const { handleConvert, handleGetCurrencies } = require("../controllers/currencyController");

// GET /api/convert?from=USD&to=INR&amount=100
router.get("/convert", handleConvert);

// GET /api/currencies  — returns all supported currency codes
router.get("/currencies", handleGetCurrencies);

// Health check
router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Currency Converter API is running ✅", timestamp: new Date() });
});

module.exports = router;
