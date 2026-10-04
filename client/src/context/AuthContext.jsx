import { createContext, useEffect, useState, useCallback } from "react";
import { api, authApi, setGlobalAccessToken } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessTokenState] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateAccessToken = useCallback((token) => {
        setAccessTokenState(token);
        setGlobalAccessToken(token);
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await api.post("/auth/refresh-token");
                const userData = response.data?.data?.user;
                const token = response.data?.data?.accessToken;
                setUser(userData);
                updateAccessToken(token);
            } catch {
                setUser(null);
                updateAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [updateAccessToken]);

    const logout = async () => {
        try {
            await authApi.post("/auth/logout");
        } catch {
            
        } finally {
            setUser(null);
            updateAccessToken(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                setUser,
                setAccessToken: updateAccessToken,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};