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
import LupaPasswordForm from './LupaPasswordForm';

const LupaPasswordPageView = () => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Lupa password</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk mengatur ulang password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LupaPasswordForm />
      </CardContent>
    </Card>
  );
};

export default LupaPasswordPageView;
