import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import api from "@/api/axios"

interface Props {
  open: boolean
  onSuccess: (email: string) => void
}

export default function CheckoutEmailModal({ open, onSuccess }: Props) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSendOtp = async () => {
    try {
      setLoading(true)
      await api.post("/checkout/start", { email })
      onSuccess(email)
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Enter your email</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button onClick={handleSendOtp} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </Card>
    </div>
  )
}
