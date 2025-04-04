import { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from 'react-toastify';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP, 3 = reset password

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Login validation
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                login(data.token); // Store token
                navigate('/admin/addproduct');
                toast.success("Login Successful");
            } else {
                setError(data.message);
                toast.error(data.message);
            }
        } catch (err) {
            setError("Server error, please try again later.");
            toast.error("Server error");
        }
    };

    // Request OTP
    const handleRequestOtp = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin-forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("OTP sent to email");
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error sending OTP");
        }
    };

    // Verify OTP and Reset Password
    const handleResetPassword = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin-reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Password updated. You can log in now.");
                setShowForgotPassword(false);
                setStep(1);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error resetting password");
        }
    };

    return (
        <div className={showForgotPassword ? "show-forgot-password" : ""}>
            {!showForgotPassword && (
                <div className="login-container">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <button type="submit">Login</button>
                    </form>
                    <p className="forgot-password-link" onClick={() => setShowForgotPassword(true)}>Forgot Password?</p>
                    {error && <p className="error">{error}</p>}
                </div>
            )}
    
            {showForgotPassword && (
                <div className="forgot-password-modal">
                    <h2>Forgot Password</h2>
                    {step === 1 && (
                        <>
                            <input type="email" placeholder="Enter registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <button onClick={handleRequestOtp}>Send OTP</button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            <button onClick={() => setStep(3)}>Verify OTP</button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            <button onClick={handleResetPassword}>Reset Password</button>
                        </>
                    )}
                    <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
    
};

export default Login;
