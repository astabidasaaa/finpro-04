import { SidebarNav } from '@/components/settings/SidebarNav';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';
// import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
  title: 'Pengaturan',
};

const sidebarNavItems = [
  {
    title: 'Profil',
    href: '/pengaturan',
  },
  {
    title: 'Daftar Alamat',
    href: '/pengaturan/alamat',
  },
  {
    title: 'Tampilan',
    href: '/pengaturan/tampilan',
  },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="space-y-6 p-4 md:px-12 lg:px-24 pb-16 block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
          <p className="text-muted-foreground">
            Kelola pengaturan akun Anda dan atur preferensi tampilan.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full">
          <aside className="lg:-mx-4 w-full lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 ">{children}</div>
        </div>
      </div>
    </>
  );
};

export default SettingsLayout;
