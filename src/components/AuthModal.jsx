import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./login/login-form";
import api from "../api/axios";

const AuthModal = () => {
  const { showModal, setShowModal, login } = useAuth();

  const [mode, setMode] = useState("login");
  const [remember, setRemember] = useState(false);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup state
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  


  // OTP state
  const [otp, setOtp] = useState("");

  // Reset password state
  const [newPassword, setNewPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  if (!showModal) return null;

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, remember);
      setShowModal(false);
    } catch (err) {
      alert("Login failed");
    }
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.post("/auth/signup", signupData);
      setMode("otp");
      alert("OTP sent to your email");
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      alert(message);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-email", {
        email: signupData.email,
        otp,
      });

      alert("Account verified. Please login.");
      setMode("login");
    } catch (err) {
      alert("Invalid or expired OTP");
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email: resetEmail });
      setMode("reset");
      alert("OTP sent to email");
    } catch (err) {
      alert("Enter correct email address");
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", {
        email: resetEmail,
        otp,
        newPassword,
      });

      alert("Password updated successfully");
      setMode("login");
    } catch (err) {
      alert("Invalid OTP or reset failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95">
        <LoginForm
          mode={mode}
          setMode={setMode}
          onClose={() => setShowModal(false)}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          remember={remember}
          setRemember={setRemember}
          handleLogin={handleLogin}
          signupData={signupData}
          setSignupData={setSignupData}
          handleSignup={handleSignup}
          otp={otp}
          setOtp={setOtp}
          handleOtpVerify={handleOtpVerify}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          handleForgotPassword={handleForgotPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          handleResetPassword={handleResetPassword}
        />
      </div>
    </div>
  );
};

export default AuthModal;
