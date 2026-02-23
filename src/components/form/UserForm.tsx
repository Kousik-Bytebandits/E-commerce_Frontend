import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import api from "@/api/axios"

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Props {
  onSubmit: (data: FormData) => void
  loading?: boolean
}

const UserForm = ({ onSubmit, loading }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  })

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")

    if (!token) return

    const fetchAddress = async () => {
      try {
        const res = await api.get("/user/address")
        if (res.data) {
          setFormData({
            fullName: res.data.address?.fullName || "",
            email: res.data.email || "",
            phone: res.data.address?.phone || "",
            address: res.data.address?.line1 || "",
            city: res.data.address?.city || "",
            state: res.data.address?.state || "",
            zipCode: res.data.address?.postalCode || "",
            country: res.data.address?.country || "",
          })
         
        }
      } catch (err) {
        console.log("Address fetch skipped")
      }
    }

    fetchAddress()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  return (
    <Card className="border rounded-xl p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(formData)
        }}
        className="space-y-4"
      >
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street Address"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="p-3 border rounded-lg w-full"
          required
        />

        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="p-3 border rounded-lg w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-3 rounded-lg"
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </form>
    </Card>
  )
}

export default UserForm
