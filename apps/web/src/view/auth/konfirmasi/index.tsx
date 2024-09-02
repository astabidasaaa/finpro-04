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
import KonfirmasiForm from './KonfirmasiForm';
import { BsTwitterX } from 'react-icons/bs';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {};

const KonfirmasiRegistrasiView = (props: Props) => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Konfirmasi registrasi
        </CardTitle>
        <CardDescription>
          Masukkan password anda untuk melanjutkan registrasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <KonfirmasiForm />
      </CardContent>
    </Card>
  );
};

export default KonfirmasiRegistrasiView;
