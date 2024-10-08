import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col justify-start items-center min-h-screen">
      <Header />
      <main className="w-full pt-24 pb-16 md:py-24 min-h-screen max-w-screen-xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
