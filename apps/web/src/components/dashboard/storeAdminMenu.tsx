import {
  Home,
  Package,
  Package2,
  LayoutGrid,
  Percent,
  Store,
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
