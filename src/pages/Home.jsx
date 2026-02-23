import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/axios";

const Cart = () => {
  const { cart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  // Fetch saved address for logged-in users
  useEffect(() => {
    if (user) {
      fetchAddress();
    }
  }, [user]);

  const fetchAddress = async () => {
    try {
      const res = await api.get("/user/address");
      if (res.data) {
        setAddress(res.data);
      }
    } catch (err) {
      console.log("No saved address found");
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const {
      fullName,
      email,
      phone,
      line1,
      city,
      state,
      country,
      postalCode,
    } = address;

    if (
      !fullName ||
      !email ||
      !phone ||
      !line1 ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      alert("Please fill all required address fields");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!validateAddress()) return;

    setLoading(true);

    try {
      if (!user) {
        // Guest checkout
        await api.post("/auth/guest-checkout", address);
        alert("Guest checkout stored successfully");
      } else {
        // Logged-in user checkout
        await api.post("/order/checkout", {
          items: cart,
          address,
        });
        alert("Order placed successfully");
      }
    } catch (error) {
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Cart</h1>
    </div>

  );
};

export default Cart;
