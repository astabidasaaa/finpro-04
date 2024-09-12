import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User2Icon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/_middlewares/auth.middleware';
import { Button } from '../ui/button';
import { User } from '@/types/userType';

const UserDropdownDashboard = ({ user }: { user: User }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full size-6 md:size-8 lg:size-10"
        >
          <Avatar className="size-6 md:size-8 lg:size-10">
            <AvatarImage src={`${process.env.AVATAR_API_URL}/${user.avatar}`} />
            <AvatarFallback>
              <User2Icon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard/notifikasi" className="block md:hidden">
          <DropdownMenuItem>Notifikasi</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="block md:hidden" />
        <Link href="/dashboard/pengaturan">
          <DropdownMenuItem>Pengaturan</DropdownMenuItem>
        </Link>
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
  );
};

export default UserDropdownDashboard;
