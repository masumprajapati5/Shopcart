import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

// Base axios instance for public calls (no interceptor recursion)
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

// Authenticated axios instance with automatic token injection and 401 refresh interception
export const authApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

let currentAccessToken = null

export const setGlobalAccessToken = (token) => {
    currentAccessToken = token
}

export const getGlobalAccessToken = () => {
    return currentAccessToken
}

// Request interceptor: attach Bearer token
authApi.interceptors.request.use(
    (config) => {
        if (currentAccessToken) {
            config.headers.Authorization = `Bearer ${currentAccessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor: automatically refresh token on 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return authApi(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const res = await api.post("/auth/refresh-token")
                const newAccessToken = res.data?.data?.accessToken
                setGlobalAccessToken(newAccessToken)

                processQueue(null, newAccessToken)
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return authApi(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                setGlobalAccessToken(null)
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

const useApi = () => {
    return authApi
}

export default useApi