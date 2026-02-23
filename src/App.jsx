import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Products from "@/screens/products/Products";
import "./styles/main.css";
import { Toaster } from "@/components/ui/sonner";
import Payments from "@/screens/payment/Payments";
import { useState } from "react";
import Refund from "./screens/Refund/Refund";

function AppContent() {
  const { loading } = useAuth();
  const [open, setOpen] = useState(true)

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <AuthModal />
      <div className="mx-auto container px-4 sm:px-6">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/orders' element={<Refund />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
