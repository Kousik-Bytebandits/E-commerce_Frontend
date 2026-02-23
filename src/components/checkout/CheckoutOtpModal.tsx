import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import api from "@/api/axios"

interface Props {
  open: boolean
  email: string
  onVerified: () => void
}

export default function CheckoutOtpModal({ open, email, onVerified }: Props) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleVerify = async () => {
    try {
      setLoading(true)

      const res = await api.post("/checkout/verify", { email, otp })

      localStorage.setItem("accessToken", res.data.accessToken)

      onVerified()
    } catch (err: any) {
      alert(err?.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Enter OTP</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button onClick={handleVerify} disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </Card>
    </div>
  )
}
