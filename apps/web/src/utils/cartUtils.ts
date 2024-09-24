import { CartItem } from "@/types/cartType";


export const getCartItems = (userId: string) => {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : {};
    
    const userCart = cart[userId] || [];
  
    return userCart.filter((item: any) => item !== null);
  }
  return [];
};

  

  export const addToCart = (newItem: any) => {
    if (typeof window !== 'undefined') {
      if (!newItem) {
        console.error('Invalid item:', newItem);
        return;
      }
  
      const userId = newItem.userId;
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : {};
  
  
      const userCart = cart[userId] || [];
  
      const existingItemIndex = userCart.findIndex(
        (item: any) => item.productId === newItem.productId && item.storeId === newItem.storeId
      );
  
      if (existingItemIndex >= 0) {
        userCart[existingItemIndex].quantity += newItem.quantity;
      } else {
        userCart.push(newItem);
      }
  
      cart[userId] = userCart;
  
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };
  
  
  

  export const clearCart = (userId: string) => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : {};
  
      delete cart[userId]; 
  
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };
  

export const updateCartForUser = (userId: string, updatedCart: any[]) => {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : {};
    
    cart[userId] = updatedCart;

    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const removeItemsFromCart = (userId: string, itemsToRemove: CartItem[]) => {
  if (typeof window !== 'undefined') {
    const userCart: CartItem[] = getCartItems(userId); 

    const filteredCart = userCart.filter(
      (cartItem: CartItem) =>
        !itemsToRemove.some((item: CartItem) => item.productId === cartItem.productId)
    );
    updateCartForUser(userId, filteredCart);
  }
};

