import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(localStorage.getItem("auth-token") || null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("auth-token");
        console.log("Auth Context Loaded - Token:", storedToken); // Debugging

        if (storedToken) {
            setAuth(storedToken);
        }
    }, []);

    const login = (token) => {
        console.log("Logging in with token:", token); // Debugging
        localStorage.setItem("auth-token", token);
        setAuth(token);
        navigate("/admin");
    };

    const logout = () => {
        console.log("Logging out..."); // Debugging
        localStorage.removeItem("auth-token");
        setAuth(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
