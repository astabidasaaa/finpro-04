import type { Metadata } from 'next';
import AuthHeader from '@/components/AuthHeader';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <AuthHeader />
      <main className="flex flex-col items-center justify-center min-h-screen w-full">
        {children}
      </main>
      {/* <AuthFooter /> */}
    </div>
  );
};

export default AuthLayout;
