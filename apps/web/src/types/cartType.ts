export type CartItem = {
    productId: string;
    storeId: string;
    name: string;
    price: number;              
    discountedPrice: number;    
    quantity: number;
    userId: string;            
    image: {
      title: string;
      alt?: string;
    };
    buy?: number;               
    get?: number;               
  };

  