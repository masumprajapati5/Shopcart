# E-Commerce Authentication & Product CRUD Platform

A full-stack web application built with **Node.js, Express, MongoDB, React, and express-validator**, implementing secure JWT authentication (short-lived access tokens + long-lived rotating refresh tokens in httpOnly cookies) and full product CRUD functionality.


## 🛠 Tech Stack
- **Backend**: Node.js, Express.js (ES Modules), Mongoose, express-validator, jsonwebtoken, bcryptjs, cookie-parser, cors.
- **Frontend**: React (Vite), React Router, React Hook Form, Axios, TailwindCSS.
- **Database**: MongoDB (Local / Atlas).

---

## 🚀 Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to `server/`:
   ```bash
   cd server
   npm install
   ```
2. Create or verify `server/.env`:
   ```env
   MONGO_URL=mongodb://localhost:27017/auth_crud_db
   ACCESS_TOKEN=your_jwt_access_secret_key
   REFRESH_TOKEN=your_jwt_refresh_secret_key
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:3000`.*

---

### 2. Frontend Setup
1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:5173` with proxy pointing `/api` to `http://localhost:3000`.*

---

## 📚 API Endpoints

### 1. Authentication APIs (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`, `confirmPassword`). Rejects duplicate emails with `409 Conflict`. Does not return tokens. |
| `POST` | `/api/auth/login` | Public | Authenticates user (`email`, `password`). Returns short-lived `accessToken` in JSON body and sets `refreshToken` in an httpOnly cookie. |
| `POST` | `/api/auth/refresh-token` | Public* | Reads `refreshToken` cookie, verifies against DB, issues new `accessToken` and rotates refresh token. |
| `POST` | `/api/auth/logout` | Authenticated | Invalidates the stored refresh token in DB and clears the cookie. |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile (`id`, `name`, `email`). |

*Requires a valid refresh token cookie.

---

### 2. Product CRUD APIs (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/products` | Authenticated | Create a new product (`name`, `description`, `price`, `stock`). |
| `GET` | `/api/products` | Public | List all products (supports optional pagination: `?page=1&limit=10`). |
| `GET` | `/api/products/:id` | Public | Fetch a single product by Mongo ID (validated before DB query). |
| `PUT` | `/api/products/:id` | Authenticated | Update a product (validates ID existence and input types). |
| `DELETE` | `/api/products/:id` | Authenticated | Delete a product (validates ID existence before deletion). |

---

## 🛡 Security & Validation Features
- **Password Hashing**: Bcrypt with 10 salt rounds before persisting to DB. Passwords are never returned or logged.
- **Tokens**:
  - `Access Token`: 15-minute short-lived token signed with secret.
  - `Refresh Token`: 7-day long-lived token stored server-side in DB for revocation support and sent in an `httpOnly`, `sameSite: lax` cookie.
- **Input Validation**: `express-validator` on all routes validating fields (`confirmPassword` matching, email format, string lengths, positive float prices, non-negative integer stock, and MongoId route parameters).
- **Client Session Restoration**: Axios automatically restores session from `/api/auth/refresh-token` on load and intercepts 401s to refresh tokens seamlessly.
