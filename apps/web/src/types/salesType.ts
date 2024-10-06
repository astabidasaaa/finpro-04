export enum MONTHS {
  Januari = 1,
  Februari,
  Maret,
  April,
  Mei,
  Juni,
  Juli,
  Agustus,
  September,
  Oktober,
  November,
  Desember,
}

export type SalesOverall = {
  cleanRevenue: number | null;
  productRevenue: number | null;
  deliveryRevenue: number;
  transactionCount: number;
  itemCount: number | null;
  freeItems: number;
};

export type ProductAndCategoryReport = {
  name: string;
  totalQty: number;
  totalPrice: number;
  totalFree: number;
};

export const CategoryMock: ProductAndCategoryReport[] = [
  { name: 'Minuman', totalQty: 50, totalPrice: 100000, totalFree: 0 },
  { name: 'Kebutuhan Dapur', totalQty: 60, totalPrice: 300000, totalFree: 0 },
  {
    name: 'Perlengkapan Ibu & Anak',
    totalQty: 70,
    totalPrice: 1678000,
    totalFree: 0,
  },
  {
    name: 'Kebutuhan Rumah Tangga',
    totalQty: 60,
    totalPrice: 1532000,
    totalFree: 0,
  },
  { name: 'Obat-obatan', totalQty: 80, totalPrice: 1036000, totalFree: 0 },
];

export const ProductMock: ProductAndCategoryReport[] = [
  { name: 'Sweety', totalQty: 50, totalPrice: 30000, totalFree: 0 },
  { name: 'Milo', totalQty: 60, totalPrice: 542000, totalFree: 0 },
  { name: 'Sasa', totalQty: 70, totalPrice: 1678000, totalFree: 0 },
  { name: 'Walls paddle pop', totalQty: 60, totalPrice: 1062000, totalFree: 0 },
  { name: 'Filma margarin', totalQty: 80, totalPrice: 1025000, totalFree: 0 },
  { name: 'Masker 60 ply', totalQty: 50, totalPrice: 30000, totalFree: 0 },
  { name: 'Tolak angin', totalQty: 60, totalPrice: 542000, totalFree: 0 },
  { name: 'Mujigae topokki', totalQty: 70, totalPrice: 1678000, totalFree: 0 },
  {
    name: 'Indomie kari ayam',
    totalQty: 60,
    totalPrice: 1062000,
    totalFree: 0,
  },
  { name: 'Mamipokok', totalQty: 80, totalPrice: 1025000, totalFree: 0 },
];

export enum OrderByReport {
  nameAsc = 'nameAsc',
  nameDesc = 'nameDesc',
  qtyDesc = 'qtyDesc',
  qtyAsc = 'qtyAsc',
}

export enum OrderByReportDisplay {
  nameAsc = 'Nama A-Z',
  nameDesc = 'Nama Z-A',
  qtyDesc = 'Paling banyak',
  qtyAsc = 'Paling sedikit',
}

export const displayOrderByMap = new Map<string, string>(
  Object.entries(OrderByReportDisplay),
);

export type ProductStockChange = {
  inventoryId: number;
  name: string;
  totalAdd: number;
  totalRemove: number;
  lastStock: number;
};
