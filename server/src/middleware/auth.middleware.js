import { readAccessToken } from "../utils/auth.js"

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access token not found in request header"
        })
    }

    const accessToken = authHeader.split(" ")[1]
    if (!accessToken) {
        return res.status(401).json({
            message: "Access token missing"
        })
    }

    try {
        const decoded = await readAccessToken(accessToken)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        })
    }
}