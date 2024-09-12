'use client';

import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import UserDropdownDashboard from './UserDropdown';
import { useAppSelector } from '@/lib/hooks';

export default function Header() {
  const login_data = useAppSelector((state) => state.auth);
  const { user } = login_data;
  return (
    <>
      <div className="w-full flex-1">
        {/* <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form> */}
      </div>
      <div className="flex flex-row justify-start items-center gap-4">
        <UserDropdownDashboard user={user} />
      </div>
    </>
  );
}
