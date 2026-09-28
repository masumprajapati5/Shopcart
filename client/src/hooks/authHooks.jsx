import { useForm } from 'react-hook-form'
import { api } from '../api/axios'
import { useNavigate } from 'react-router'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
    const { handleSubmit, reset, register, watch, formState: { errors }, setError: setFormError } = useForm({
        mode: "onChange"
    })
    const navigate = useNavigate()
    const { setUser, setAccessToken, logout } = useContext(AuthContext)
    const [serverError, setServerError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (data) => {
        setServerError("")
        setLoading(true)
        try {
            await api.post("/auth/register", data)
            return true
        } catch (err) {
            const resData = err.response?.data
            if (resData?.errors && Array.isArray(resData.errors)) {
                resData.errors.forEach((e) => {
                    const field = e.path || e.param
                    if (field) {
                        setFormError(field, { type: "server", message: e.msg })
                    }
                })
            }
            setServerError(resData?.message || "Registration failed")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (data) => {
        setServerError("")
        setLoading(true)
        try {
            const response = await api.post("/auth/login", data)
            const userData = response.data?.data?.user
            const token = response.data?.data?.accessToken

            setUser(userData)
            setAccessToken(token)
            navigate("/main")
            return true
        } catch (err) {
            const resData = err.response?.data
            if (resData?.errors && Array.isArray(resData.errors)) {
                resData.errors.forEach((e) => {
                    const field = e.path || e.param
                    if (field) {
                        setFormError(field, { type: "server", message: e.msg })
                    }
                })
            }
            setServerError(resData?.message || "Login failed")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    return {
        handleSubmit,
        handleLogin,
        handleRegister,
        handleLogout,
        navigate,
        reset,
        register,
        watch,
        errors,
        serverError,
        setServerError,
        loading
    }
}