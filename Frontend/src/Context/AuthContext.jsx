import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [mode, setMode] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.email,
                    username: decoded.username || decoded.unique_name || decoded.name
                });
                setMode(decoded.mode || null);
            } catch (err) {
                console.error("Failed to decode token", err);
                setUser(null);
            }
        }
    }, [token]);

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setMode(null);
    };
    const loginUser = (tokenData) => {
        setToken(tokenData.Token);
        setUser({ email: tokenData.email, username: tokenData.username });
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
