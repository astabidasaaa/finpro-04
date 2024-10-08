import type { Metadata } from 'next';
import Header from '@/components/dashboard/Header';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import NavigationList from '@/components/dashboard/NavigationList';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Sigmart Admin Dashboard',
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/50 md:block">
          <NavigationList />
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/50 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="link"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu navigasi</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader className="sr-only">
                  <SheetTitle>Dashboard menu</SheetTitle>
                  <SheetDescription>
                    Menu untuk admin dashboard
                  </SheetDescription>
                </SheetHeader>
                <NavigationList />
              </SheetContent>
            </Sheet>
            <Header />
          </header>
          <main className="flex flex-col h-[calc(100vh-56px)] lg:h-[calc(100vh-60px)] overflow-y-auto bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
