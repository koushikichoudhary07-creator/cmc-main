# Cutie-Mcpretty

A modern, full-stack fashion e-commerce web application built with **Laravel 13**, **React 18**, and **Inertia.js**. Features an AI-powered shopping assistant, Razorpay payment integration, wishlists, a shopping bag, and a curated catalogue of Traditional, Western, and Accessories categories.

---

##  Features

-  **Storefront** — Curated homepage showcasing new arrivals and sale products
-  **Product Categories** — Traditional (Festive, Classics, Fusion), Western (Tops, Dresses, Bottoms), Accessories (Purses, Footwear, Scarves), and a Bonus section
-  **Search** — Full-text product search across the catalogue
-  **AI Shopping Assistant** — Powered by Google Gemini to help customers find what they're looking for
-  **Wishlist** — Save favourite items (requires login)
-  **Shopping Bag** — Add, update quantity, and remove items (requires login)
-  **Checkout with Razorpay** — Secure payment processing with order verification
-  **User Accounts** — Registration, login, profile management, and order history dashboard
-  **Dark Mode** — Full dark mode support
-  **SSR** — Server-Side Rendering via Inertia.js for fast initial page loads

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.4 |
| Frontend | React 18, TypeScript, Inertia.js v2 |
| Styling | Tailwind CSS v3, Flowbite React, Headless UI |
| Build Tool | Vite 8 |
| Auth | Laravel Breeze (with Inertia/React stack) |
| Payments | Razorpay |
| AI | Google Gemini (via `google-gemini-php/laravel`) |
| Testing | Pest |
| Linting | ESLint + Prettier |
| Containerization | Docker (multi-stage build), Docker Compose |

---

##  Getting Started

### Prerequisites

- PHP 8.4+
- Composer
- Node.js 20+ & npm
- A MySQL database

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cutie-mcpretty.git
cd cutie-mcpretty
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Generate the application key
php artisan key:generate
```

Open `.env` and fill in the required values:

```env
APP_NAME="cutie-mcpretty"
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Google Gemini (AI Assistant)
GEMINI_API_KEY=your_gemini_api_key

# Razorpay (Payments)
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
VITE_RAZORPAY_KEY=your_razorpay_key
```

### 4. Run Migrations

```bash
php artisan migrate
```

### 5. Start the Development Server

The Composer `dev` script starts everything concurrently — the PHP server, queue worker, log monitor, and Vite dev server:

```bash
composer dev
```

Or start them individually:

```bash
# Terminal 1 – Laravel backend
php artisan serve

# Terminal 2 – Vite frontend (hot reload)
npm run dev
```

Visit http://localhost:8000 in your browser.

---

##  Running with Docker

A multi-stage `Dockerfile` and `compose.yaml` are included for containerized deployments.

```bash
# Build and start the container
docker compose up --build
```

The app will be available at **http://localhost:5074**.

> **Note:** Make sure your `.env` file is configured correctly before running Docker. The container reads it at startup via `docker-entrypoint.sh`.

---

## ⚡ One-Command Setup

The `setup` Composer script automates the full installation:

```bash
composer setup
```

This runs: `composer install` → copy `.env` → `key:generate` → `migrate` → `npm install` → `npm run build`

---

##  Running Tests

```bash
composer test
# or
php artisan test
```

---

##  Project Structure

```
cutie-mcpretty/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # BagController, CheckoutController, GeminiController, etc.
│   │   └── Requests/
│   ├── Models/                # User, Product, Order, Address
│   └── Providers/
├── resources/
│   └── js/
│       ├── Pages/             # Inertia page components (Storefront, Bag, Wishlist, etc.)
│       ├── Components/        # Reusable React components
│       └── Layouts/
├── routes/
│   ├── web.php                # All application routes
│   └── auth.php               # Auth routes (Breeze)
├── database/
│   └── migrations/
├── Dockerfile
└── compose.yaml
```

---

##  License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
