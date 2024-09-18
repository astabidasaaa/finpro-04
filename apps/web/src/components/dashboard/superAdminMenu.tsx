import {
  Home,
  Package,
  Package2,
  LayoutGrid,
  Percent,
  Store,
  UserCircle2,
} from 'lucide-react';

export const superAdminMenuList = [
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
    label: 'Manajemen Akun',
    icon: <UserCircle2 className="size-5" />,
    href: '/dashboard/account',
    child: [
      { label: 'Administrator', href: '/dashboard/account/admin' },
      { label: 'Kustomer', href: '/dashboard/account/user' },
    ],
  },
  {
    label: 'Kategori',
    icon: <LayoutGrid className="size-5" />,
    href: '/dashboard/category',
    child: [
      { label: 'Kategori', href: '/dashboard/category/list' },
      { label: 'Subkategori', href: '/dashboard/category/subcategory' },
    ],
  },
  {
    label: 'Produk',
    icon: <Package className="size-5" />,
    href: '/dashboard/product',
    child: [
      { label: 'Brand', href: '/dashboard/product/brand' },
      { label: 'Daftar Produk', href: '/dashboard/product/list' },
      { label: 'Tambah Produk', href: '/dashboard/product/add-product' },
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
        label: 'Promosi Umum',
        href: '/dashboard/promotion/general',
      },
      {
        label: 'Promosi Toko',
        href: '/dashboard/promotion/store',
      },
      {
        label: 'Riwayat Voucher',
        href: '/dashboard/promotion/voucher-history',
      },
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
];
