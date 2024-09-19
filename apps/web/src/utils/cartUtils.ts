// Function to get the cart items for a specific user from local storage
export const getCartItems = (userId: string) => {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : {};
    
    // Return only the cart items for the specified userId
    const userCart = cart[userId] || [];
    
    // Handle potential null values in the cart
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
  
      console.log('Current Cart:', cart);
  
      const userCart = cart[userId] || [];
      console.log('User Cart:', userCart);
  
      const existingItemIndex = userCart.findIndex(
        (item: any) => item.productId === newItem.productId && item.storeId === newItem.storeId
      );
  
      if (existingItemIndex >= 0) {
        userCart[existingItemIndex].quantity += newItem.quantity;
      } else {
        userCart.push(newItem);
      }
  
      cart[userId] = userCart;
      console.log('Updated User Cart:', userCart);
      console.log('Updated Cart:', cart);
  
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };
  
  
  
  // Function to clear the cart for a specific user
  export const clearCart = (userId: string) => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : {};
  
      delete cart[userId]; // Remove cart for this user
  
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };
  