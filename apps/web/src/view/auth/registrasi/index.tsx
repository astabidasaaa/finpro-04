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
import { Label } from '@/components/ui/label';

type Props = {};

const RegistrasiPageView = (props: Props) => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Buat akun</CardTitle>
        <CardDescription>
          Buat akun sekarang untuk dapat kemudahan belanja
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex flex-col">
        <Label>Registrasi menggunakan sosial</Label>
        <div className="grid grid-cols-3 w-full gap-2 mt-2">
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
