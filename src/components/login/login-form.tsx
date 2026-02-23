import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import GoogleLoginButton from "../GoogleLoginButton"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export type AuthMode = "login" | "signup" | "otp" | "forgot" | "reset"

interface LoginFormProps {
    mode: AuthMode
    setMode: (mode: AuthMode) => void
    onClose: () => void
    // Login handlers
    email: string
    setEmail: (val: string) => void
    password: string
    setPassword: (val: string) => void
    remember: boolean
    setRemember: (val: boolean) => void
    handleLogin: (e: React.FormEvent) => void
    // Signup handlers
    signupData: any
    setSignupData: (data: any) => void
    handleSignup: (e: React.FormEvent) => void
    // OTP handlers
    otp: string
    setOtp: (val: string) => void
    handleOtpVerify: (e: React.FormEvent) => void
    handleSendOtp: (targetEmail: string) => void
    // Forgot Password handlers
    resetEmail: string
    setResetEmail: (val: string) => void
    handleForgotPassword: (e: React.FormEvent) => void
    // Reset Password handlers
    newPassword: string
    setNewPassword: (val: string) => void
    handleResetPassword: (e: React.FormEvent) => void
}

export default function LoginForm({
    mode,
    setMode,
    onClose,
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    handleLogin,
    signupData,
    setSignupData,
    handleSignup,
    otp,
    setOtp,
    handleOtpVerify,
    handleSendOtp,
    resetEmail,
    setResetEmail,
    handleForgotPassword,
    newPassword,
    setNewPassword,
    handleResetPassword,
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showSignupPassword, setShowSignupPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSignupData({ ...signupData, [id]: value })
    }

    return (
        <Card className="relative w-full max-w-lg mx-auto bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-1 z-10 rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>

            <CardContent className="p-6 pt-5">
                {(mode === "login" || mode === "signup") && (
                    <Tabs
                        value={mode}
                        onValueChange={(val) => {
                            setMode(val as AuthMode)
                            setOtp("")
                        }}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl bg-gray-100">
                            <TabsTrigger value="login" className="rounded-lg text-sm font-medium">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-lg text-sm font-medium">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* ── LOGIN TAB ── */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="text-center mb-5">
                                    <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
                                </div>

                                {/* Email + Send OTP inline */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="loginEmail">Email Address</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="loginEmail"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-10 flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-10 px-3 text-sm shrink-0"
                                            onClick={() => handleSendOtp(email)}
                                            disabled={!email}
                                        >
                                            Send OTP
                                        </Button>
                                    </div>
                                </div>

                                {/* OTP input — always visible below email */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="loginOtp">One-Time Password</Label>
                                    <Input
                                        id="loginOtp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter OTP sent to your email"
                                        className="h-10 text-center tracking-widest font-mono text-lg"
                                        maxLength={6}
                                    />
                                </div>

                                {/* ── or ── divider */}
                                <div className="relative my-1">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-xs text-muted-foreground uppercase tracking-wider">or</span>
                                    </div>
                                </div>

                                {/* Email (for password login) */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="loginEmailPwd">Email Address</Label>
                                    <Input
                                        id="loginEmailPwd"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-10"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="loginPassword">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="loginPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember + Forgot */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 accent-primary"
                                        />
                                        <label htmlFor="remember" className="text-sm text-gray-600 select-none">
                                            Remember me
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot")}
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <Button type="submit" className="w-full h-10 font-semibold">
                                    Sign In
                                </Button>

                                {/* Divider */}
                                <div className="relative my-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-xs text-muted-foreground uppercase tracking-wider">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <GoogleLoginButton />

                                <p className="text-center text-sm text-muted-foreground mt-2">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("signup")}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Create account
                                    </button>
                                </p>
                            </form>
                        </TabsContent>

                        {/* ── SIGNUP TAB ── */}
                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-3">
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Join us today</p>
                                </div>

                                {/* Name */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" value={signupData.firstName} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" value={signupData.lastName} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                </div>

                                {/* Email + Send OTP inline */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={signupData.email}
                                            onChange={handleSignupChange}
                                            required
                                            className="h-9 flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-9 px-3 text-sm shrink-0"
                                            onClick={() => handleSendOtp(signupData.email)}
                                            disabled={!signupData.email}
                                        >
                                            Send OTP
                                        </Button>
                                    </div>
                                </div>

                                {/* OTP — immediately below email */}
                                <Input
                                    id="signupOtp"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    placeholder="Enter OTP sent to your email"
                                    autoComplete="new-password"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    className="h-9 text-center tracking-widest font-mono text-lg"
                                />

                                {/* Passwords */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showSignupPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={signupData.password}
                                                onChange={handleSignupChange}
                                                required
                                                className="h-9 pr-9"
                                            />
                                            <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="confirmPassword">Confirm</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={signupData.confirmPassword}
                                                onChange={handleSignupChange}
                                                required
                                                className="h-9 pr-9"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+91 98765 43210" value={signupData.phone} onChange={handleSignupChange} required className="h-9" />
                                </div>

                                {/* Address */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="line1">Address Line 1</Label>
                                        <Input id="line1" placeholder="123 Main St" value={signupData.line1} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="line2">Address Line 2</Label>
                                        <Input id="line2" placeholder="Apt, Suite…" value={signupData.line2} onChange={handleSignupChange} className="h-9" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="Mumbai" value={signupData.city} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="Maharashtra" value={signupData.state} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input id="postalCode" placeholder="400001" value={signupData.postalCode} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" placeholder="India" value={signupData.country} onChange={handleSignupChange} required className="h-9" />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-10 font-semibold mt-1">
                                    Create Account
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                                        Sign in
                                    </button>
                                </p>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}

                {/* ── OTP VERIFICATION (standalone mode) ── */}
                {mode === "otp" && (
                    <form onSubmit={handleOtpVerify} className="space-y-5">
                        <div className="text-center mb-4">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Verify Email</h2>
                            <p className="text-sm text-muted-foreground mt-1">Enter the OTP sent to your email</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="otp">One-Time Password</Label>
                            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="• • • • • •" className="text-center text-2xl tracking-[0.5em] h-12 font-mono" maxLength={6} required />
                        </div>
                        <Button type="submit" className="w-full h-10 font-semibold">Verify &amp; Continue</Button>
                        <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Login</button>
                    </form>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {mode === "forgot" && (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                        <div className="text-center mb-4">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Forgot Password?</h2>
                            <p className="text-sm text-muted-foreground mt-1">We'll send an OTP to reset your password</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="resetEmail">Email Address</Label>
                            <Input id="resetEmail" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="email@example.com" className="h-10" required />
                        </div>
                        <Button type="submit" className="w-full h-10 font-semibold">Send OTP</Button>
                        <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Login</button>
                    </form>
                )}

                {/* ── RESET PASSWORD ── */}
                {mode === "reset" && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="text-center mb-4">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">New Password</h2>
                            <p className="text-sm text-muted-foreground mt-1">Enter the OTP and choose a new password</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="resetOtp">OTP</Label>
                            <Input id="resetOtp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="• • • • • •" className="text-center text-xl tracking-[0.5em] h-11 font-mono" maxLength={6} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-10" required />
                        </div>
                        <Button type="submit" className="w-full h-10 font-semibold">Update Password</Button>
                        <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Login</button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}