'use client';

import Link from 'next/link';
import {
  Home,
  Package,
  Package2,
  Circle,
  ShoppingCart,
  LayoutGrid,
  Percent,
  Store,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const superAdminMenuList = [
  {
    label: 'Dashboard',
    icon: <Home className="h-4 w-4" />,
    href: '/dashboard',
  },
  {
    label: 'Pengelolaan Toko',
    icon: <Store className="h-4 w-4" />,
    href: '/dashboard/pengelolaan-toko',
  },
  {
    label: 'Kategori',
    // add category, add subcategory, category
    icon: <LayoutGrid className="h-4 w-4" />,
    href: '/dashboard/category',
    child: [
      { label: 'Kategori', href: '/dashboard/category/list' },
      { label: 'Subkategori', href: '/dashboard/category/subcategory' },
    ],
  },
  {
    label: 'Produk',
    // brand, product, add product
    icon: <Package className="h-4 w-4" />,
    href: '/dashboard/product',
    child: [
      { label: 'Brand', href: '/dashboard/product/brand' },
      { label: 'Daftar Produk', href: '/dashboard/product/list' },
      { label: 'Tambah Produk', href: '/dashboard/product/add-product' },
    ],
  },
  {
    label: 'Inventori',
    // brand, product, add product
    icon: <Package2 className="h-4 w-4" />,
    href: '/dashboard/inventory',
  },
  {
    label: 'Manajemen Diskon',
    // brand, product, add product
    icon: <Percent className="h-4 w-4" />,
    href: '/dashboard/discount',
  },
];

export default function NavigationList() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  console.log(pathname);

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-lg">SIGMART</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-m font-medium lg:px-4">
          {superAdminMenuList.map((item, index) => (
            <div key={item.label}>
              {item.child ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex items-center w-full text-left"
                  >
                    <span
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all  ${
                        pathname.startsWith(item.href)
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {item.icon}
                      <div>{item.label}</div>
                    </span>
                  </button>
                  {openMenu === item.label && (
                    <div className="ml-7">
                      {item.child.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className={`flex items-center gap-3 rounded-lg px-3 text-sm py-1.5 transition-all ${
                            pathname === subItem.href
                              ? 'bg-muted text-primary'
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                        >
                          <Circle className="w-2 h-2" /> {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === item.href
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  key={`menu-${index}`}
                >
                  {item.icon} {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
