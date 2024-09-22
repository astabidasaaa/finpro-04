import {
  Home,
  Package,
  Package2,
  LayoutGrid,
  Percent,
  Store,
  ChartColumn,
  NotebookText,
} from 'lucide-react';

export const storeAdminMenuList = [
  {
    label: 'Dashboard',
    icon: <Home className="size-5" />,
    href: '/dashboard',
  },
  {
    label: 'Pengelolaan Toko',
    icon: <Store className="size-5" />,
    href: '/dashboard/pengelolaan-toko',
  },
  {
    label: 'Kategori',
    // add category, add subcategory, category
    icon: <LayoutGrid className="size-5" />,
    href: '/dashboard/category',
    child: [
      { label: 'Kategori', href: '/dashboard/category/list' },
      { label: 'Subkategori', href: '/dashboard/category/subcategory' },
    ],
  },
  {
    label: 'Produk',
    // brand, product, add product
    icon: <Package className="size-5" />,
    href: '/dashboard/product',
    child: [
      { label: 'Brand', href: '/dashboard/product/brand' },
      { label: 'Daftar Produk', href: '/dashboard/product/list' },
    ],
  },
  {
    label: 'Inventaris',
    icon: <Package2 className="size-5" />,
    href: '/dashboard/inventory',
    child: [
      {
        label: 'Inventaris Produk',
        href: '/dashboard/inventory/product-inventory',
      },
      {
        label: 'Riwayat Inventaris',
        href: '/dashboard/inventory/inventory-history',
      },
    ],
  },
  {
    label: 'Manajemen Promosi',
    icon: <Percent className="size-5" />,
    href: '/dashboard/promotion',
    child: [
      {
        label: 'Promosi Toko',
        href: '/dashboard/promotion/store',
      },
      // {
      //   label: 'Riwayat Voucher',
      //   href: '/dashboard/promotion/voucher-history',
      // },
      {
        label: 'Diskon Produk',
        href: '/dashboard/promotion/discount-product',
      },
      {
        label: 'Gratis Produk',
        href: '/dashboard/promotion/free-product',
      },
    ],
  },
  {
    label: 'Pesanan',
    icon: <NotebookText className="size-5" />,
    href: '/dashboard/order-management',
  },
  {
    label: 'Laporan',
    icon: <ChartColumn className="size-5" />,
    href: '/dashboard/report',
    child: [
      {
        label: 'Penjualan',
        href: '/dashboard/report/sales',
      },
      {
        label: 'Stok',
        href: '/dashboard/report/stock',
      },
    ],
  },
];
