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
    <header className="fixed top-0 left-0 right-0 flex justify-center items-center w-full py-2 bg-background z-10">
      <div className="flex flex-row justify-between items-center w-full max-w-screen-2xl px-4 md:px-12 lg:px-24">
        <Link href="/">
          <Image
            src="/sigmart-logo-full-small.png"
            alt="Logo Sigmart"
            width={80}
            height={24}
          />
        </Link>
        {
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/pengaturan">Pengaturan</Link>
              </DropdownMenuItem>
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
        }
      </div>
    </header>
  );
};
