import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "@/api/axios"

interface PurchaseItem {
  orderId: number
  orderNumber: string
  name: string
  price: number
  quantity: number
  total: number
  purchaseDate: string
  orderStatus: string
  paymentStatus: string
  refundStatus?: string
  orderItemId: number
}

const Refund = () => {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------- FETCH ORDERS ---------------- */

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/order-details")

      const formatted: PurchaseItem[] = []

      res.data.forEach((order: any) => {
        const payment = order.payments?.[0]
        const refund = payment?.refunds?.[0]

        order.items.forEach((item: any) => {
          formatted.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            total: Number(item.total),
            purchaseDate: new Date(order.createdAt).toLocaleDateString(),
            orderStatus: order.status,
            paymentStatus: payment?.status,
            refundStatus: refund?.status,
            orderItemId: item.id,
          })
        })
      })

      setPurchases(formatted)
    } catch (err) {
      console.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- REFUND REQUEST ---------------- */

  const handleRefundRequest = async (orderItemId: number) => {
    const confirmRefund = window.confirm(
      "Are you sure you want to request a refund?"
    )
    if (!confirmRefund) return

    try {
      await api.post("/payment/refund", {
        orderItemId,
        reason: "Customer requested refund",
      })

      alert("Refund requested successfully")
      fetchOrders()
    } catch (err) {
      alert("Refund request failed")
    }
  }

  /* ---------------- BADGES ---------------- */

  const renderOrderStatus = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <Badge className="bg-green-100 text-green-800">Delivered</Badge>

    case "SHIPPED":
      return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>

    case "PAID":
      return <Badge className="bg-purple-100 text-purple-800">Paid</Badge>

    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>

    case "CANCELLED":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>

    default:
      return null
  }
}

  const renderRefundStatus = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Refund Pending
          </Badge>
        )
      case "SUCCESS":
        return (
          <Badge className="bg-green-100 text-green-800">
            Refund Completed
          </Badge>
        )
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800">
            Refund Failed
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) return <div className="p-8">Loading purchases...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shopping
        </Button>

        <h1 className="text-3xl font-bold mt-6 mb-6">
          Refunds & Returns
        </h1>

        <div className="space-y-6">
          {purchases.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="mx-auto h-10 w-10 mb-4" />
              <p>No purchase history found.</p>
            </Card>
          ) : (
            purchases.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {item.name}
                    </h3>

                    <div className="flex gap-3 mb-3">
                      {renderOrderStatus(item.orderStatus)}
                      {renderRefundStatus(item.refundStatus)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="font-medium">Order ID</p>
                        <p>{item.orderNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium">Purchase Date</p>
                        <p>{item.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="font-medium">Quantity</p>
                        <p>{item.quantity}</p>
                      </div>
                      <div>
                        <p className="font-medium">Price Each</p>
                        <p>₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{item.total.toFixed(2)}
                      </p>
                    </div>

                    {/* REFUND BUTTON LOGIC */}
                    {item.orderStatus === "DELIVERED" &&
                    item.paymentStatus === "SUCCESS" &&
                    !item.refundStatus ? (
                      <Button
                        className="mt-4"
                        onClick={() =>
                          handleRefundRequest(item.orderItemId)
                        }
                      >
                        Request Refund
                      </Button>
                    ) : item.refundStatus ? (
                      <div className="mt-4">
                        {renderRefundStatus(item.refundStatus)}
                      </div>
                    ) : (
                      <Badge className="mt-4">
                        Not Eligible
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Refund
