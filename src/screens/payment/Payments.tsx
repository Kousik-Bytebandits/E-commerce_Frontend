import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Package, Plus, Minus, Trash2, Shield } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import UserForm from "@/components/form/UserForm"
import api from "@/api/axios"
import CheckoutEmailModal from "@/components/checkout/CheckoutEmailModal"
import CheckoutOtpModal from "@/components/checkout/CheckoutOtpModal"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Payments() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart() as any
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [emailModal, setEmailModal] = useState(false)
  const [otpModal, setOtpModal] = useState(false)
  const [checkoutEmail, setCheckoutEmail] = useState("")
  const [verified, setVerified] = useState(!!user)

  useEffect(() => {
    if (!user) setEmailModal(true)
  }, [user])

  const subtotal = cart.reduce(
    (sum: number, item: any) => sum + Number(item.price) * item.quantity,
    0
  )

  const shipping = subtotal > 0 ? 9.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = async (formData: any) => {
    try {
      setLoading(true)

      const items = cart.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      }))

      const res = await api.post("/order/checkout", {
        address: formData,
        items,
      })

      const { razorpayOrder, orderId } = res.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,

        handler: async (response: any) => {
          await api.post("/payment/razor-verify", {
            ...response,
            orderId,
          })

          alert("Payment successful")
          clearCart()
          navigate("/orders")
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
      }

      new window.Razorpay(options).open()
    } catch (err: any) {
      alert(err?.response?.data?.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">

      <CheckoutEmailModal
        open={emailModal}
        onSuccess={(email) => {
          setCheckoutEmail(email)
          setEmailModal(false)
          setOtpModal(true)
        }}
      />

      <CheckoutOtpModal
        open={otpModal}
        email={checkoutEmail}
        onVerified={() => {
          setVerified(true)
          setOtpModal(false)
        }}
      />

      <h1 className="text-3xl font-bold mb-8">Payment</h1>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-xl font-bold">Cart</h2>
            </div>

            {cart.map((item: any) => (
              <div key={item.id} className="flex justify-between mb-4">
                <div className="flex gap-4">
                  <Package />
                  <div>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus />
                  </Button>
                  {item.quantity}
                  <Button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus />
                  </Button>
                  <Button onClick={() => removeFromCart(item.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </Card>

          {verified ? (
            <UserForm onSubmit={handleCheckout} loading={loading} />
          ) : (
            <Card className="p-6 text-center">
              Verify your email to continue
            </Card>
          )}
        </div>

        <Card className="p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Summary</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm">
            <Shield className="h-4 w-4" />
            Secure payment
          </div>
        </Card>
      </div>
    </div>
  )
}
