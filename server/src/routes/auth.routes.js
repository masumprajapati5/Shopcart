import express from 'express'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'
import { getMe, login, logout, refresh, register } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = express.Router()

// register api (Public)
router.post("/register", registerValidator, register)

// login api (Public)
router.post("/login", loginValidator, login)

// refresh token api (Public* - requires valid refresh token)
router.post("/refresh-token", refresh)
router.post("/refresh", refresh) // backward compatibility

// logout api (Authenticated - invalidates refresh token)
router.post("/logout", authenticate, logout)

// current logged in user profile api (Authenticated)
router.get("/me", authenticate, getMe)

export default router