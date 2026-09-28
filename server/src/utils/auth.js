import jwt from 'jsonwebtoken'
import config from "../config/config.js"

// PDF Spec:
// Access Token — short-lived (10–15 min), signed with ACCESS_TOKEN_SECRET
// Refresh Token — long-lived (7 days), signed with REFRESH_TOKEN_SECRET
export const generateTokens = async (id) => {
    const accessToken = jwt.sign({ id }, config.ACCESS_TOKEN, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ id }, config.REFRESH_TOKEN, { expiresIn: "7d" })

    return { accessToken, refreshToken }
}

export const readRefreshToken = (token) => {
    return jwt.verify(token, config.REFRESH_TOKEN)
}

export const readAccessToken = (token) => {
    return jwt.verify(token, config.ACCESS_TOKEN)
}
