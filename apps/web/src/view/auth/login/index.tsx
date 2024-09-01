import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from './LoginForm';

const LoginPageView = () => {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 lg:h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Masukkan email untuk login ke akun anda
            </p>
          </div>
          <LoginForm />
          <div className="text-center text-sm">
            Belum memiliki akun?{' '}
            <Link href="/registrasi" className="underline hover:no-underline">
              Daftar
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden justify-center items-center lg:flex p-16">
        <Image
          src="/sigmart-logo-full-huge.png"
          alt="Sigmart Banner"
          width={480}
          height={480}
          className="w-full h-full object-contain object-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPageView;
