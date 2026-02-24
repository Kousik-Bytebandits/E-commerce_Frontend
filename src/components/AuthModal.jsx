import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./login/login-form";
import api from "../api/axios";

const AuthModal = () => {
  const { showModal, setShowModal, login, setUser } = useAuth();

  const [mode, setMode] = useState("login");
  const [remember, setRemember] = useState(false);
  const [signupMethod, setSignupMethod] = useState("password"); // "password" or "otp"

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

    if (!email.trim()) {
      return alert("Please enter your email address.");
    }

    try {
      if (otp.trim()) {
        // OTP-based login
        const res = await api.post("/auth/login/verify-otp", {
          email,
          otp,
          remember,
        });
        const { accessToken, refreshToken } = res.data;
        if (remember) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        } else {
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("refreshToken", refreshToken);
        }
        const me = await api.get("/auth/me");
        setUser(me.data);
        setShowModal(false);
      } else {
        if (!password.trim()) {
          return alert("Please enter your password or use OTP login.");
        }
        // Password login
        await login(email, password, remember);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || err.message || "Login failed";
      alert(msg);
    }
  };

  // ---------------- SIGNUP WITH PASSWORD ----------------
  const handlePasswordSignup = async () => {
    const { firstName, lastName, password, confirmPassword, phone, line1, city, state, postalCode, country, email } = signupData;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !line1 || !city || !state || !postalCode || !country) {
      return alert("Please fill in all required fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.post("/auth/signup", signupData);
      alert("Account created successfully! You can now log in.");
      setMode("login");
      // Clear form
      setSignupData({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
        phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  // ---------------- SIGNUP WITH OTP ----------------
  const handleOtpSignup = async () => {
    const { firstName, lastName, email, phone, line1, line2, city, state, postalCode, country } = signupData;

    // Validate required fields (password not required for OTP signup)
    if (!firstName || !lastName || !email || !phone || !line1 || !city || !state || !postalCode || !country) {
      return alert("Please fill in all required fields");
    }

    try {
      // First, send OTP if not already sent
      if (!otp) {
        await api.post("/auth/login/send-otp", { email });
        alert(`OTP sent to ${email}`);
        return;
      }

      // Verify OTP and create account
      const res = await api.post("/auth/login/verify-otp", {
        email,
        otp,
        remember,
      });

      // Account is created/verified, now complete the profile
      const { accessToken, refreshToken } = res.data;
      if (remember) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
      }

      // Update user profile with additional details
      await api.put("/auth/profile", {
        firstName,
        lastName,
        phone,
        address: { line1, line2, city, state, postalCode, country }
      });

      const me = await api.get("/auth/me");
      setUser(me.data);
      setShowModal(false);
      setOtp("");
    } catch (err) {
      console.error("OTP Signup Error:", err);
      const msg = err.response?.data?.message || err.message || "OTP verification failed";
      alert(msg);
    }
  };

  // ---------------- MAIN SIGNUP HANDLER ----------------
  const handleSignup = async (e) => {
    e?.preventDefault();

    if (signupMethod === "password") {
      await handlePasswordSignup();
    } else {
      await handleOtpSignup();
    }
  };

  // ---------------- SEND OTP ----------------
  const handleSendOtp = async (targetEmail) => {
    if (!targetEmail) return alert("Please enter your email address first.");

    try {
      if (mode === "signup") {
        // For signup, just send OTP
        await api.post("/auth/login/send-otp", { email: targetEmail });
        alert(`OTP sent to ${targetEmail}`);
        setSignupMethod("otp");
      } else {
        // For login
        await api.post("/auth/login/send-otp", { email: targetEmail });
        alert(`Login OTP sent to ${targetEmail}`);
      }
      setOtp("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email: resetEmail });
      alert("OTP sent to your email");
      setOtp("");
      setMode("reset");
    } catch (err) {
      alert(err.response?.data?.message || "Enter a valid email address");
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
      alert("Password updated successfully. Please sign in.");
      setOtp("");
      setNewPassword("");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP or reset failed");
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
          handleSendOtp={handleSendOtp}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          handleForgotPassword={handleForgotPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          handleResetPassword={handleResetPassword}
          signupMethod={signupMethod}
          setSignupMethod={setSignupMethod}
        />
      </div>
    </div>
  );
};

export default AuthModal;