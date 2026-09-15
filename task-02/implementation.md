# Task 02: Implementation Steps (Step-by-Step Guide)

This document outlines the step-by-step development process for building the E-Commerce Checkout & Payment System.

## Step 1: Project Initialization & Backend Setup
1. Create `task-02` directory.
2. Inside `task-02`, create a `backend` directory.
3. Run `npm init -y` in the backend directory.
4. Install necessary dependencies: `express`, `cors`, `dotenv`.
5. Install TypeScript and Dev dependencies: `typescript`, `ts-node`, `@types/node`, `@types/express`, `nodemon`.
6. Initialize TypeScript configuration (`tsc --init`).
7. Setup **Prisma ORM**:
   - Run `npm install prisma --save-dev`
   - Run `npx prisma init`
   - Configure PostgreSQL connection string in `.env`.
   - Define `Product`, `Order`, and `OrderItem` models in `schema.prisma`.
   - Run `npx prisma migrate dev --name init` to create tables.
   - Run `npm install @prisma/client`.

## Step 2: Frontend Setup
1. Inside `task-02`, create a Next.js project by running: `npx create-next-app@latest frontend` (selecting TypeScript, ESLint, App Router).
2. Install state management library: `npm install zustand` (for cart state).
3. Setup the basic layout and global CSS for a premium UI look.

## Step 3: Backend - Product APIs & Database Seeding
1. **Seed Script:** Write a `seed.ts` script to populate the database with mock e-commerce products (name, description, price, stock, images).
2. **Product Routes:** 
   - `GET /api/products` (Support search by name and filtering by category/price).
   - `GET /api/products/:id` (Fetch single product details).

## Step 4: Frontend - Storefront UI
1. Create the **Home Page** to list all products fetched from the backend API.
2. Implement Search Bar and Category Filters.
3. Create the **Product Details Page** (`/product/[id]`).

## Step 5: Backend - Order API & Concurrency Control
1. **Checkout Route:** Implement `POST /api/orders/checkout`.
2. **Concurrency Logic:** Use Prisma interactive transactions (`$transaction`) and raw SQL locks (`SELECT ... FOR UPDATE`) to check stock safely.
3. Reserve stock (decrease `availableStock`, increase `reservedStock`).
4. **Expiry Job:** Create a scheduled task (e.g., using `node-cron`) to run every minute to revert stock for `RESERVED` orders older than 5 minutes.

## Step 6: Frontend - Cart & Checkout UI
1. Implement the **Cart** using `zustand` to store added products.
2. Build a sliding cart sidebar or cart page.
3. Implement the "Checkout" button which sends the cart items to the backend `POST /api/orders/checkout` API.

## Step 7: Mock Payment System (Frontend & Backend)
1. **Backend Payment Route:** Implement `POST /api/payments/process` taking `orderId` and `status` (SUCCESS, FAILED, TIMEOUT).
   - On SUCCESS: Status -> `PAID`, permanently deduct reserved stock.
   - On FAILED/TIMEOUT: Status -> `FAILED`/`EXPIRED`, restore reserved stock to available stock.
2. **Frontend Payment Modal:** After successful checkout, show a Mock Payment Modal.
3. Send the result to the backend payment route.

## Step 8: Post-Purchase Flow (Order History & Cancellations)
1. **Backend:** Implement `GET /api/orders/my-orders` and `POST /api/orders/:id/cancel`.
2. **Frontend:** Build an **Order History Page** for the user to view past orders and cancel them. Simulate a refund if a paid order is cancelled.
