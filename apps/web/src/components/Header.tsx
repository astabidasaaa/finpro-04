'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import Link from 'next/link';
import { logout } from '@/_middlewares/auth.middleware';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const Header = () => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-center items-center w-full py-2 md:py-4 bg-background z-10">
      <div className="flex flex-row justify-between items-center w-full px-4 md:px-12 lg:px-24">
        <Link href="/">
          <Image
            src="/sigmart-logo-full-small.png"
            alt="Logo Sigmart"
            width={80}
            height={24}
          />
        </Link>
        {user.status.isLogin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full size-4 md:size-8"
              >
                <Avatar className="size-4 md:size-8">
                  <AvatarImage
                    src={`${process.env.AVATAR_API_URL}/${user.user.avatar}`}
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.user.name || user.user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/pengaturan">
                <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await logout()(dispatch);

                  router.refresh();
                }}
                className="hover:cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
