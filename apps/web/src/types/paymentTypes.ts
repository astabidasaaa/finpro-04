export type Promotion = {
    discountType: 'FLAT' | 'PERCENT'; // Type of discount (flat or percentage)
    discountValue: number;            // Discount value based on type
  };
  
  export type Voucher = {
    id: string;
    promotion: Promotion;              // Promotion details for the voucher
  };

  export type Payment = {
  amount: number;
  paymentStatus: string;
  paymentGateway: string;
  paymentProof?: string;
};

export type OrderItem = {
  qty: number;
  price: number;
  finalPrice: number;                 // Final price after discount
  productDiscountPerStore?: Promotion; // Discount details if applicable
  freeProductPerStore?: {
    buy: number;
    get: number;
  };                                  // "Buy X get Y" promotion if applicable
  product: {
    name: string;
  };
};

export type Order = {
  id: string;
  orderCode: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  payment: Payment;
  orderItems: OrderItem[];            // List of order items
  customer: {
    profile: {
      name: string;
    };
    email: string;
  };
  deliveryAddress: {
    address: string;
    zipCode: string;
  };
  shipping: {
    courier: string;
    trackingNumber: string;
    amount: number;
  };
  vouchers?: Voucher[];
  selectedTransactionVoucher?: Voucher; // Transaction-level voucher for discounts
  selectedDeliveryVoucher?: Voucher;    // Delivery voucher for reduced shipping
};