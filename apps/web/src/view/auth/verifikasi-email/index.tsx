import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import VerifikasiEmailForm from './VerifikasiEmailForm';

type Props = {};

const VerifikasiEmailPageView = (props: Props) => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Verifikasi email</CardTitle>
        <CardDescription>
          Masukkan password untuk verifikasi email anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifikasiEmailForm />
      </CardContent>
    </Card>
  );
};

export default VerifikasiEmailPageView;
