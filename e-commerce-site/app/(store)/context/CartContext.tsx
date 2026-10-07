'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const CART_STORAGE_KEY = "zarb-cart";

type Product = {
    id: number,
    name: string,
    description: string, 
    price: number,
    image: string | null,
    stock: number,
    category: string
}

type CartItem = Product & {
    quantity: number
}

type CartContextValue = {
    cart: CartItem[]
    addToCart: (product: Product) => void
    decreaseQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({children}: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [hasHydrated, setHasHydrated] = useState(false)

    useEffect(() => {
        try {
            const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)

            if (storedCart) {
                const parsedCart: unknown = JSON.parse(storedCart)

                if (Array.isArray(parsedCart)) {
                    // Restore browser state once the provider has mounted.
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setCart(parsedCart as CartItem[])
                }
            }
        } catch {
            window.localStorage.removeItem(CART_STORAGE_KEY)
        } finally {
            setHasHydrated(true)
        }
    }, [])

    useEffect(() => {
        if (hasHydrated) {
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
        }
    }, [cart, hasHydrated])

    const addToCart = (product: Product) => {
        setCart((currentCart) => {
            const existingProduct = currentCart.find((item) => 
                item.id === product.id)
            
            if(product.stock <= 0) {
                return currentCart
            }
            
            if(existingProduct) {
                
                if(existingProduct.quantity >= product.stock) {
                    return currentCart
                }

                return currentCart.map(item => 
                    item.id === product.id ? 
                    {...item, quantity: item.quantity + 1} 
                    : item)
            }

            return [
                ...currentCart, 
                {...product, quantity: 1}
            ]
        })
    }
    const decreaseQuantity = (id: number) => {
        setCart((currentCart) => {
            return currentCart.map(item => item.id === id ?
                {...item, quantity: item.quantity -1 } :
                item
            )
            .filter((item) => item.quantity > 0)
        })
    }
    const removeFromCart = (id:number) => {
        setCart((currentCart) => currentCart.filter(item => item.id !== id))
    }
  
    const clearCart = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{cart, addToCart, decreaseQuantity, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
  )
}

export function useCart() {
    const context = useContext(CartContext)

    if(!context) throw new Error("useCart must be used inside CartProvider")

    return context
}