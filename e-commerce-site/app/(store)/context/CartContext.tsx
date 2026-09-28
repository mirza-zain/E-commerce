'use client'

import { createContext, useContext, useState } from "react";

type Product = {
    id: number,
    name: string,
    description: string, 
    price: number,
    image: string
}

type CartItem = Product & {
    quantity: number
}

type CartContextValue = {
    cart: CartItem[]
    addToCart: (product: Product) => void
    decreaseQuantity: (id: number) => void
    removeFromCart: (id: number) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({children}: any) {
    const [cart, setCart] = useState<CartItem[]>([])

    const addToCart = (product: Product) => {
        setCart((currentCart) => {
            const existingProduct = currentCart.find((item) => item.id === product.id)
            if(existingProduct) {
                return currentCart.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item)
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
  
    return (
        <CartContext.Provider value={{cart, addToCart, decreaseQuantity, removeFromCart}}>
            {children}
        </CartContext.Provider>
  )
}

export function useCart() {
    const context = useContext(CartContext)

    if(!context) throw new Error("useCart must be used inside CartProvider")

    return context
}