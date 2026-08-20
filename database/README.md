# Project Setup Steps: cutie-mcpretty

This document records the exact steps followed to initialize and configure the Laravel and React (Inertia.io) application.

## Step-by-Step Installation

### 1. Initialize Laravel Project
Create a fresh Laravel installation named `cutie-mcpretty`:
```bash
composer create-project laravel/laravel cutie-mcpretty
```
### 2. Navigate to Project Root
*Critical Step: Always ensure you are inside the project directory before running artisan commands.*
```bash
cd cutie-mcpretty
```

### 3. Start the Local Development Server
Launch the PHP server on a custom port to avoid conflicts with other active projects:
```bash
php artisan serve --port=8002
```

### 4. Install Laravel Breeze
Download the Laravel Breeze authentication scaffolding package as a development dependency:
```bash
composer require laravel/breeze --dev
```

### 5. Configure Breeze Scaffolding
Initialize the Breeze installation process:
```bash
php artisan breeze:install
```

During the interactive prompt, the following configuration choices were selected:
* **Stack:** React with Inertia
* **Features:**
  * Dark mode
  * Inertia SSR (Server-Side Rendering)
  * TypeScript
  * ESLint with Prettier
* **Testing Framework:** Pest

### 6. Run Database Migrations
Create the default database tables required by Laravel and Breeze:
```bash
php artisan migrate
```

---

## ⚡ Frontend Development Environment

Open a **new terminal tab**, navigate back to the project root, and execute the following commands to build the frontend assets:

```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
