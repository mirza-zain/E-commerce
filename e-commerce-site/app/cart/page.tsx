'use client'

import { useCart } from "../context/CartContext";

export default function page() {
  const {cart} = useCart()

  return (
    <div>
      <h1>Your Order Cart</h1>
      {
        cart.length === 0 ? (
          <p>Your Cart is Empty</p>
        ) : (
          cart.map(items => (
            <div key={items.id}>
              <p>{items.name}</p>
              <p>Rs {items.price}</p>
              <p>Quantity {items.quantity}</p>
            </div>
          ))
        )
      }    
    </div>
  )
}
