'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/lib/hooks';
import { Button } from './ui/button';
import UserDropdown from './UserDropdown';
import HeaderCategoryAndSearch from './HeaderCategoryAndSearch';
import CartBtn from './CartBtn';

export const Header = () => {
  const login_data = useAppSelector((state) => state.auth);
  const { user, status } = login_data;

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-center items-center w-full py-2 md:py-4 bg-background z-50">
      <div className="flex flex-row justify-between items-center w-full px-4 md:px-12 lg:px-24">
        <div className="flex flex-row justify-start items-center gap-4">
          <Link href="/">
            <Image
              src="/sigmart-logo-full-small.png"
              alt="Logo Sigmart"
              width={120}
              height={32}
              className="w-16 md:w-20 lg:w-24"
            />
          </Link>
          <HeaderCategoryAndSearch />
        </div>
        <div className="flex flex-row justify-start items-center gap-2 md:gap-3">
          {user.role === 'user' && <CartBtn isVerified={user.isVerified} />}
          {status.isLogin ? (
            <>
              <UserDropdown user={user} />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-max px-2 py-1 text-xs text-main-dark border-main-dark hover:text-main-dark font-bold"
                asChild
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                className="h-max px-2 py-1 text-xs text-secondary bg-main-dark hover:bg-main-dark/80 font-bold"
                asChild
              >
                <Link href="/registrasi">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
