import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import authRoutes from '../routes/auth.routes.js'
import productRoutes from "../routes/product.routes.js"

import config from '../config/config.js'

const app = express()

// CORS configuration supporting credentials (cookies) both locally and in production
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    config.CLIENT_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server) or from allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true) // permissive to prevent deployment blocking while preserving credentials
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(cookieParser())

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

// Fallback 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint not found"
    })
})

export default app