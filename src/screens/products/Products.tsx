import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Star, ArrowRight, Package } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { showAddToCartToast } from "@/components/ui/sonner-toast"
import { useCart } from "@/context/CartContext"
import { useState, useEffect } from "react"
import api from "@/api/axios"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  rating: number
  imageUrl?: string
  stock: number
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export default function Products() {
  const navigate = useNavigate()
  const { cart, addToCart } = useCart() as {
    cart: CartItem[]
    addToCart: (product: any) => void
  }

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  /* ---------------- FETCH PRODUCTS ---------------- */

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/all")
      setProducts(res.data)
    } catch (err) {
      console.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- NAVIGATION ---------------- */

  const handleCheckout = () => {
    navigate("/payment")
  }

  const handleCartDetails = () => {
    navigate("/orders")
  }

  /* ---------------- ADD TO CART ---------------- */

  const handleAddToCart = (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()

    if (product.stock <= 0) {
      return alert("Product out of stock")
    }

    addToCart(product)
    showAddToCartToast(product.name)
  }

  if (loading) {
    return <div className="p-8">Loading products...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Products Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Our Products</h1>

            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {products.length} products
              </Badge>

              {cart.length > 0 && (
                <Badge>
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {totalItems} in cart
                </Badge>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const cartItem = cart.find(
                (item) => item.id === product.id
              )
              const quantity = cartItem?.quantity || 0

              return (
                <Card
                  key={product.id}
                  className="rounded-xl border-2 hover:shadow-xl cursor-pointer overflow-hidden"
                  onClick={() =>
                    setSelectedProduct(product.id)
                  }
                >
                  <div className="p-4 space-y-4 h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}

                      {quantity > 0 && (
                        <Badge className="absolute top-2 right-2">
                          {quantity}
                        </Badge>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                          {product.category}
                        </span>

                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>

                      <p className="font-bold text-lg text-primary">
                        ₹{product.price}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stock}
                      </p>
                    </div>

                    {/* Add Button */}
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) =>
                        handleAddToCart(product, e)
                      }
                      disabled={product.stock <= 0}
                    >
                      {product.stock <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"></div>

          <div>
            <Button
              size="lg"
              className="w-full mb-4"
              onClick={handleCheckout}
            >
              Proceed to Payment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleCartDetails}
            >
              View Orders
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
