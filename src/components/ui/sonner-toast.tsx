import { toast } from "sonner"

export function showAddToCartToast(productName: string) {
    toast.success(`${productName} added to cart!`, {
        duration: 2000,
        position: "top-right"
    })
}
