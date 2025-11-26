import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [mode, setMode] = useState(null);

    useEffect(() => {
        if (!token) return;

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // if parsing fails, fall back to decoding token
                console.warn("Failed to parse stored user, decoding token instead.", e);
            }
        }

        if (!storedUser) {
            try {
                const decoded = jwtDecode(token);
                const userFromToken = {
                    id: decoded.id ?? decoded.sub ?? decoded.userId ?? null,
                    email: decoded.email ?? decoded.em ?? null,
                    username: decoded.username ?? decoded.name ?? null,
                };
                setUser(userFromToken);
                localStorage.setItem("user", JSON.stringify(userFromToken));
            } catch (err) {
                console.error("Failed to decode token:", err);
            }
        }

        setMode(localStorage.getItem("mode"));
    }, [token]);

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setMode(null);
    };
    const loginUser = (tokenData) => {
        setToken(tokenData.Token);
        setUser({ 
            id: tokenData.id,
            email: tokenData.email, 
            username: tokenData.username 
            
        });
        setMode(tokenData.Mode);

        localStorage.setItem("token", tokenData.Token);
        localStorage.setItem("user", JSON.stringify({ email: tokenData.email, username: tokenData.username }));
        localStorage.setItem("mode", tokenData.Mode);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, mode, setMode, logout, loginUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
