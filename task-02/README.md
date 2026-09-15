# Task 02: E-Commerce Concurrent Order Handling

This task implements a robust e-commerce checkout flow that safely handles concurrent purchases and stock management using database transactions and background cron jobs.

## 🔗 Live Demo Links

*   **Frontend (Vercel):** `[https://techloom-assessment-1.onrender.com]`
*   **Backend API (Render):** `[https://techloom-assessment-1.onrender.com]`

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS, Lucide Icons
*   **State Management:** Zustand
*   **Deployment:** Vercel

### Backend
*   **Framework:** Node.js, Express, TypeScript
*   **Database:** TiDB Serverless (MySQL)
*   **ORM:** Prisma
*   **Background Jobs:** node-cron
*   **Deployment:** Render (Dockerized)

---

## 🚀 Key Features

1.  **Concurrent Order Handling:** Uses Prisma Transactions to safely decrement `availableStock` and increment `reservedStock` during checkout to prevent race conditions (overselling).
2.  **Order Expiration (Cron Job):** A background cron job runs continuously to find orders that were "RESERVED" but not paid within 5 minutes. It automatically reverts the stock to `availableStock` and marks the order as "EXPIRED".
3.  **Mock Payment Gateway:** Simulates a payment gateway with an intentional 3-second delay, allowing users to test concurrent behavior in a realistic environment.
4.  **Modern UI:** A beautiful, responsive interface built with Tailwind CSS, featuring light/dark mode support and real-time cart state management.

---

## ⚙️ Local Development

### Prerequisites
*   Node.js (v18 or higher)
*   TiDB or MySQL Database

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your database URL:
   ```env
   DATABASE_URL="mysql://username:password@host:port/database"
   ```
4. Push the schema to the database and seed it with initial products:
   ```bash
   npx prisma db push
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add the backend API URL (optional if using default port 5000):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:3000`.
