export type Promotion = {
    discountType: 'FLAT' | 'PERCENT'; 
    discountValue: number;
    maxDeduction: number;            
  };
  
  export type Voucher = {
    id: string;
    promotion: Promotion;              
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
  finalPrice: number;                
  productDiscountPerStore?: Promotion; 
  freeProductPerStore?: {
    buy: number;
    get: number;
  };                                  
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
  orderItems: OrderItem[];            
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
  selectedTransactionVoucher?: Voucher; 
  selectedDeliveryVoucher?: Voucher;    
};