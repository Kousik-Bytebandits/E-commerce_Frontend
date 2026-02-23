import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UserForm from "@/components/form/UserForm";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ---------------- SAFE TOTAL CALCULATION ---------------- */

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  /* ---------------- CHECKOUT ---------------- */

  const handleCheckout = async (formData) => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const formattedItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
      }));

      if (!user) {
        // Guest checkout must include items
        await api.post("/auth/guest-checkout", {
          ...formData,
          items: formattedItems,
        });

        alert("Guest checkout stored successfully");
        clearCart();
        navigate("/");
      } else {
        console.log("CHECKOUT PAYLOAD:", {
  address: formData,
  items: cart,
});

        await api.post("/order/checkout", {
          address: formData,
          items: formattedItems,
        });

        alert("Order placed successfully");
        clearCart();
        navigate("/orders");
      }
    } catch (error) {
  console.error("Checkout error:", error.response?.data);
  alert(error.response?.data?.message || "Checkout failed");

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-muted-foreground mb-8">
          No products added
        </p>
      ) : (
        <div className="mb-8 space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
            >
              <span className="font-medium">{item.name}</span>

              <span className="text-muted-foreground">
                ₹{Number(item.price).toFixed(2)} × {item.quantity || 1}
              </span>

              <span className="font-semibold">
                ₹
                {(
                  Number(item.price) *
                  Number(item.quantity || 1)
                ).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">
        Total:{" "}
        <span className="text-primary">
          ₹{total.toFixed(2)}
        </span>
      </h3>

      <h3 className="text-lg font-semibold mb-2">
        Shipping Address
      </h3>

      <UserForm onSubmit={handleCheckout} loading={loading} />
    </div>
  );
};

export default Cart;
