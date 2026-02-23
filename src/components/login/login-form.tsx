import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import GoogleLoginButton from "../GoogleLoginButton"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
    resetEmail,
    setResetEmail,
    handleForgotPassword,
    newPassword,
    setNewPassword,
    handleResetPassword
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSignupData({ ...signupData, [id]: value })
    }

    return (
        <Card className="relative w-full max-w-lg pt-4 mx-auto bg-white shadow-lg border border-gray-200">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground hover:text-foreground z-10"
            >
                <X className="h-5 w-5" />
            </button>

            <CardContent className="p-6">
                {(mode === "login" || mode === "signup") && (
                    <Tabs value={mode} onValueChange={(val) => setMode(val as AuthMode)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                                    <p className="text-muted-foreground mt-1">Sign in to your account</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>


                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Remember me
                                        </label>
                                    </div>
                                    <button type="button" onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </button>
                                </div>

                                <Button type="submit" className="w-full">Sign In</Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-muted"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <GoogleLoginButton />
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold">Create Account</h2>
                                    <p className="text-muted-foreground mt-1">Join us today</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" value={signupData.firstName} onChange={handleSignupChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" value={signupData.lastName} onChange={handleSignupChange} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={signupData.email} onChange={handleSignupChange} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>

                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={signupData.password}
                                                onChange={handleSignupChange}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm</Label>

                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={signupData.confirmPassword}
                                                onChange={handleSignupChange}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" value={signupData.phone} onChange={handleSignupChange} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="line1">Address Line 1</Label>
                                        <Input id="line1" value={signupData.line1} onChange={handleSignupChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="line2">Address Line 2</Label>
                                        <Input id="line2" value={signupData.line2} onChange={handleSignupChange} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" value={signupData.city} onChange={handleSignupChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" value={signupData.state} onChange={handleSignupChange} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input id="postalCode" value={signupData.postalCode} onChange={handleSignupChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" value={signupData.country} onChange={handleSignupChange} required />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">Create Account</Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}

                {mode === "otp" && (
                    <form onSubmit={handleOtpVerify} className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Verify Email</h2>
                            <p className="text-muted-foreground mt-1">Enter the OTP sent to your email</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="otp">One-Time Password</Label>
                            <Input
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                className="text-center text-2xl tracking-widest"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Verify & Continue</Button>
                        <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground">
                            Back to Login
                        </button>
                    </form>
                )}

                {mode === "forgot" && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Reset Password</h2>
                            <p className="text-muted-foreground mt-1">We'll send you an OTP to reset your password</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resetEmail">Email Address</Label>
                            <Input
                                id="resetEmail"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Send OTP</Button>
                        <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground">
                            Back to Login
                        </button>
                    </form>
                )}

                {mode === "reset" && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">New Password</h2>
                            <p className="text-muted-foreground mt-1">Enter the OTP and your new password</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="otp">OTP</Label>
                            <Input
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Update Password</Button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}