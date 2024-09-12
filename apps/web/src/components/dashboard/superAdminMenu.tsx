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
    label: 'Inventori',
    icon: <Package2 className="size-5" />,
    href: '/dashboard/inventory',
  },
  {
    label: 'Manajemen Diskon',
    icon: <Percent className="size-5" />,
    href: '/dashboard/discount',
  },
];
