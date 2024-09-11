'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Package2,
  LayoutGrid,
  Percent,
  Store,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const superAdminMenuList = [
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
      { label: 'Tambah Produk', href: '/dashboard/product/add-product' },
    ],
  },
  {
    label: 'Inventori',
    // brand, product, add product
    icon: <Package2 className="size-5" />,
    href: '/dashboard/inventory',
  },
  {
    label: 'Manajemen Diskon',
    // brand, product, add product
    icon: <Percent className="size-5" />,
    href: '/dashboard/discount',
  },
];

export default function NavigationList() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 lg:h-[60px] items-center border-b sm:px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/sigmart-logo-full-small.png"
            alt="Logo Sigmart"
            width={120}
            height={32}
            className="w-20 lg:w-24"
          />
        </Link>
      </div>
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden">
        <nav className="grid items-start text-sm lg:text-base font-medium sm:px-4 lg:px-6">
          <Accordion type="single" collapsible className="flex flex-col w-full">
            {superAdminMenuList.map((item, index) => {
              return (
                <React.Fragment key={`${item.href}`}>
                  {item.child ? (
                    <AccordionItem value={`menu-${index}`}>
                      <AccordionTrigger
                        className={`text-muted-foreground hover:text-primary ${
                          pathname.startsWith(item.href) && 'text-primary'
                        }`}
                      >
                        <span className="flex flex-row items-center gap-4">
                          {item.icon}
                          {item.label}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="w-full space-y-2">
                          {item.child.map((subItem) => (
                            <li key={subItem.label} className="pl-8">
                              <Link
                                href={subItem.href}
                                className={`flex items-center gap-3 rounded-lg px-3 text-sm py-1.5 transition-all text-muted-foreground hover:text-primary ${
                                  pathname === subItem.href &&
                                  'bg-muted text-primary'
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <AccordionItem value={`menu-${index}`} asChild>
                      <Link
                        href={item.href}
                        className={`flex flex-1 items-center justify-start py-4 font-medium text-muted-foreground hover:text-primary transition-all ${
                          pathname === item.href && 'text-primary'
                        }`}
                      >
                        <span className="flex flex-row items-center gap-4">
                          {item.icon}
                          {item.label}
                        </span>
                      </Link>
                    </AccordionItem>
                  )}
                </React.Fragment>
              );
            })}
          </Accordion>
        </nav>
      </div>
    </div>
  );
}
