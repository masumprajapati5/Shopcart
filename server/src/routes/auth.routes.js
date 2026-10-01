import express from 'express'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'
import { getMe, login, logout, refresh, register } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/register", registerValidator, register)

router.post("/login", loginValidator, login)

router.post("/refresh-token", refresh)
router.post("/refresh", refresh) 

router.post("/logout", authenticate, logout)

router.get("/me", authenticate, getMe)

export default router