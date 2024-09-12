import React from 'react';
import { Bell } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import Link from 'next/link';

const NotificationBtnDashboard = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" type="button" asChild>
            <Link href="/notifikasi" className="!p-0 h-max hidden md:block">
              <Bell className="size-4 md:size-5" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lihat notifikasi</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationBtnDashboard;
