export type CartItem = {
    productId: string;
    storeId: string;
    name: string;
    price: number;              // Original price
    discountedPrice: number;    // Discounted price
    quantity: number;
    userId: string;             // userId is now part of CartItem
    image: {
      title: string;
      alt?: string;
    };
    buy?: number;               // For "Beli x"
    get?: number;               // For "Gratis y"
  };