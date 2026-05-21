// server/server.js
// Entry point for the Currency Converter Express backend.
// Sets up middleware, mounts routes, and starts the HTTP server.

require("dotenv").config(); // Load .env variables first

const express        = require("express");
const cors           = require("cors");
const path           = require("path");
const currencyRoutes = require("./routes/currencyRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────

// Allow cross-origin requests from the frontend (localhost:3000 or file://)
app.use(cors({
  origin: "*", // In production, restrict this to your frontend domain
  methods: ["GET"],
}));

// Parse JSON request bodies
app.use(express.json());

// Serve the client folder as static files (so you don't need a separate server)
// Access at: http://localhost:5000/
app.use(express.static(path.join(__dirname, "../client")));

// ── Routes ───────────────────────────────────────────────────────────────────

// All API endpoints are prefixed with /api
app.use("/api", currencyRoutes);

// Catch-all: serve index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[Global Error]", err.stack);
  res.status(500).json({ success: false, error: "Internal server error." });
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Currency Converter API running at http://localhost:${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/convert?from=USD&to=INR&amount=100`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
});
