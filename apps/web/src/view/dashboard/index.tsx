'use client';

import React from 'react';
import { useAppSelector } from '@/lib/hooks';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { FileWarning, MessageSquareWarning } from 'lucide-react';
import Image from 'next/image';

const Dashboard = () => {
  const login_data = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-1 flex-col justify-around items-center gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col justify-center items-center h-full">
        <Image
          alt="Logo Sigmart"
          className="aspect-square object-contain w-40 mb-12"
          height={400}
          width={400}
          src="/sigmart-logo-round.png"
        />
        <h1 className="text-lg font-semibold md:text-2xl text-center">
          Selamat Datang di Dashboard Admin
        </h1>
        <p className="text-muted-foreground text-center">
          {login_data.user.name || login_data.user.email} -{' '}
          {login_data.user.role}
        </p>
      </div>
      <div className="flex flex-row gap-6 justify-between items-center max-w-md text-muted-foreground/80 text-left text-sm p-8 bg-muted rounded-lg">
        <MessageSquareWarning className="size-12" />
        <p>
          Silakan gunakan menu di sebelah kiri untuk mengelola berbagai fungsi
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
