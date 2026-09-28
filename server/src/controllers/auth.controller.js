import User from "../models/user.model.js"
import { generateTokens, readRefreshToken } from "../utils/auth.js"
import bcrypt from 'bcryptjs'

// register controller
// Requirements: Accept name, email, password, confirmPassword
// Hash password with bcrypt (min 10 salt rounds)
// Reject duplicate emails with clear 409 error
// Return created user (without password) - do not return tokens on register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existUser = await User.findOne({ email: email.toLowerCase() })
        if (existUser) {
            return res.status(409).json({
                message: "Email is already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash: hashedPassword
        })

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// login controller
// Requirements: Accept email, password
// Verify password with bcrypt.compare; return 401 on mismatch (generic message)
// Issue short-lived Access Token (JSON body)
// Issue long-lived Refresh Token (7 days) sent as httpOnly cookie & persist in DB
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const { accessToken, refreshToken } = await generateTokens(user._id)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return res.status(200).json({
            message: "User logged in successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// refresh token controller
// Requirements: Read refresh token from cookie (or body), verify against DB record,
// issue brand-new access token (and optionally rotate refresh token).
// Return 401/403 on invalid/expired/reused tokens.
export const refresh = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required"
        })
    }

    try {
        const decoded = readRefreshToken(refreshToken)
        const { id } = decoded

        const user = await User.findById(id)
        if (!user || user.refreshToken !== refreshToken) {
            if (user) {
                user.refreshToken = null
                await user.save()
            }
            return res.status(403).json({
                message: "Invalid or revoked refresh token. Please login again."
            })
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id)
        user.refreshToken = newRefreshToken
        await user.save()

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Tokens refreshed successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            }
        })
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token. Please login again."
        })
    }
}

// logout controller
// Requirements: Delete/invalidate stored refresh token and clear cookie
export const logout = async (req, res) => {
    try {
        const userId = req.user?.id
        if (userId) {
            await User.findByIdAndUpdate(userId, { refreshToken: null })
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        return res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// getMe controller
// Requirements: Return current authenticated user profile
export const getMe = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select("-passwordHash -refreshToken")
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}