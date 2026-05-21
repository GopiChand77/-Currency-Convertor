# 💱 Exchango — Currency Converter

A full-stack, production-quality currency converter web application built with **Node.js + Express** on the backend and **HTML5 + CSS3 + Bootstrap 5 + Vanilla JS** on the frontend.

Uses the **[Frankfurter API](https://www.frankfurter.app/)** — completely **free**, open-source, **no API key required**, powered by European Central Bank data.

---

## 📁 Project Structure

```
currency-converter/
│
├── server/                         # Express.js backend
│   ├── server.js                   # Entry point — sets up Express, middleware, routes
│   ├── routes/
│   │   └── currencyRoutes.js       # API route definitions (/api/convert, /api/currencies)
│   ├── controllers/
│   │   └── currencyController.js   # Request handling, input validation, response building
│   ├── services/
│   │   └── currencyService.js      # Business logic — fetches rates from Frankfurter API
│   ├── .env                        # Environment variables (PORT, optional API key)
│   └── package.json                # Server dependencies
│
├── client/                         # Frontend (served as static files by Express)
│   ├── index.html                  # Main HTML page
│   ├── style.css                   # Custom CSS (glassmorphism design)
│   └── script.js                   # All UI logic, Fetch API calls, validation
│
└── README.md                       # This file
```

---

## 🚀 Quick Start

### Step 1 — Install Dependencies

```bash
cd currency-converter/server
npm install
```

> This installs: `express`, `cors`, `axios`, `dotenv`, and `nodemon`.

---

### Step 2 — Configure Environment (optional)

Open `server/.env`:

```env
PORT=5000
EXCHANGE_RATE_API_KEY=your_key_here   # Not needed for Frankfurter
```

The default setup uses the **Frankfurter API** which requires **no key**.

---

### Step 3 — Start the Server

**Development (with auto-reload):**
```bash
cd server
npm run dev
```

**Production:**
```bash
cd server
npm start
```

You should see:
```
🚀 Currency Converter API running at http://localhost:5000
📊 Test endpoint: http://localhost:5000/api/convert?from=USD&to=INR&amount=100
❤️  Health check: http://localhost:5000/api/health
```

---

### Step 4 — Open the App

Open your browser and navigate to:
```
http://localhost:5000
```

The Express server serves both the API **and** the frontend from the same port.

---

## 🔌 API Endpoints

### `GET /api/convert`

Converts an amount from one currency to another.

**Query Parameters:**

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `from`    | string | ✅       | Source currency (e.g., `USD`) |
| `to`      | string | ✅       | Target currency (e.g., `INR`) |
| `amount`  | number | ✅       | Amount to convert        |

**Example Request:**
```
GET /api/convert?from=USD&to=INR&amount=100
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "INR",
    "amount": 100,
    "convertedAmount": 8391.25,
    "rate": 83.9125,
    "inverseRate": 0.011917,
    "lastUpdated": "2024-11-15"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Amount must be a positive number."
}
```

---

### `GET /api/currencies`

Returns all supported currency codes and names.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "AUD": "Australian Dollar",
    "BGN": "Bulgarian Lev",
    "EUR": "Euro",
    "USD": "US Dollar",
    ...
  }
}
```

---

### `GET /api/health`

Health check endpoint.

```json
{
  "success": true,
  "message": "Currency Converter API is running ✅",
  "timestamp": "2024-11-15T10:32:05.000Z"
}
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Convert between 30+ currencies | ✅ |
| Real-time exchange rates (ECB) | ✅ |
| Currency swap button | ✅ |
| Loading spinner | ✅ |
| Input validation | ✅ |
| Error handling (network + API) | ✅ |
| Success/error alerts | ✅ |
| Last updated date | ✅ |
| Responsive mobile design | ✅ |
| Glassmorphism UI | ✅ |
| Bottom navigation bar | ✅ |
| No API key required | ✅ |

---

## 🌐 About the Frankfurter API

- **URL:** https://www.frankfurter.app/
- **Free:** Yes, completely free forever
- **No key:** No signup or API key required
- **Source:** European Central Bank (ECB) exchange rates
- **Update frequency:** Daily on business days (~16:00 CET)
- **Currencies:** 33 world currencies
- **Rate limits:** Generous; suitable for learning projects

---

## 🔑 Optional: Using ExchangeRate-API (more currencies)

If you need crypto or more exotic currencies:

1. Go to https://www.exchangerate-api.com/
2. Click **"Get Free Key"** — free plan gives 1,500 requests/month
3. Add to `server/.env`: `EXCHANGE_RATE_API_KEY=your_key`
4. Modify `currencyService.js` to use that API instead

---

## 🛠 Tech Stack

| Layer    | Technology              |
|----------|------------------------|
| Backend  | Node.js 18+, Express.js |
| HTTP     | Axios                   |
| Config   | dotenv                  |
| CORS     | cors middleware         |
| Frontend | HTML5, CSS3, Vanilla JS |
| UI       | Bootstrap 5.3           |
| Fonts    | Google Fonts (DM Sans)  |
| API      | Frankfurter (ECB)       |

---

## 📋 npm Commands

```bash
npm install        # Install all dependencies
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload on save)
```

---

## 🧪 Testing the API

**With curl:**
```bash
# Basic conversion
curl "http://localhost:5000/api/convert?from=USD&to=EUR&amount=500"

# Health check
curl "http://localhost:5000/api/health"

# All currencies
curl "http://localhost:5000/api/currencies"
```

**With your browser:**
```
http://localhost:5000/api/convert?from=GBP&to=JPY&amount=250
```

---

## 📄 License

MIT — feel free to use in personal and commercial projects.
