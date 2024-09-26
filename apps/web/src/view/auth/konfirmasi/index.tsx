import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import KonfirmasiForm from './KonfirmasiForm';

const KonfirmasiRegistrasiView = () => {
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
