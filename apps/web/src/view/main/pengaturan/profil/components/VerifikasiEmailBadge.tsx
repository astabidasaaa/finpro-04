import React from 'react';
import { Badge } from '@/components/ui/badge';
import DialogVerifikasi from './DialogVerifikasi';

const VerifikasiEmailBadge = ({
  isVerified,
  email,
}: {
  isVerified: boolean;
  email: string;
}) => {
  return (
    <>
      {isVerified ? (
        <Badge variant="outline">Terverifikasi</Badge>
      ) : (
        <DialogVerifikasi email={email} />
      )}
    </>
  );
};

export default VerifikasiEmailBadge;
