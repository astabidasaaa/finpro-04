import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegisterForm from './RegistrasiForm';
import { BsTwitterX } from 'react-icons/bs';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const RegistrasiPageView = () => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Selamat datang di Sigmart!
        </CardTitle>
        <CardDescription>
          Buat akun sekarang untuk dapat kemudahan belanja
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              atau lanjutkan dengan
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full gap-2 mt-4">
          <Button variant="outline">
            <FaGoogle className="size-5" />
          </Button>
          <Button variant="outline">
            <FaFacebook className="size-5" />
          </Button>
          <Button variant="outline">
            <BsTwitterX className="size-5" />
          </Button>
        </div>
        <div className="text-center text-sm w-full mt-4">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegistrasiPageView;
