'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FieldNama from './FieldNama';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import FieldEmail from './FieldEmail';
import FieldNomorHP from './FieldNomorHP';
import FieldTanggalLahir from './FieldTanggalLahir';
import VerifikasiEmailBadge from './VerifikasiEmailBadge';
import SalinKodeReferral from './SalinKodeReferral';

type TUserData = {
  email: string;
  isVerified: boolean;
  isPassword: boolean;
  role: string;
  referralCode: string;
  avatar: string;
  name: string;
  phone: string;
  dob: string;
};

const ProfilForm = ({
  profile,
  refetch,
}: {
  profile: TUserData;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const { email, isVerified, referralCode, name, phone, dob, isPassword } =
    profile;

  const dobConverted = new Date(dob).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="flex flex-col w-full md:p-4 md:pr-0 space-y-4">
      <p className="text-base font-semibold">Ubah profil</p>
      <div className="grid grid-cols-[120px_minmax(0,_1fr)] md:grid-cols-[160px_minmax(0,_1fr)] w-full text-sm lg:text-base justify-items-start items-center">
        <span className="text-muted-foreground">Nama</span>
        <div className="space-x-3">
          {name && <span>{name}</span>}
          <FieldNama name={name} refetch={refetch} />
        </div>
        <span className="text-muted-foreground">Email</span>
        <div className="space-x-3">
          {email && (
            <>
              <span>{email}</span>
              <VerifikasiEmailBadge isVerified={isVerified} email={email} />
            </>
          )}
          <FieldEmail isPassword={isPassword} email={email} refetch={refetch} />
        </div>
        <span className="text-muted-foreground">Nomor HP</span>
        <div className="space-x-3">
          {phone && <span>{phone}</span>}
          <FieldNomorHP phone={phone} refetch={refetch} />
        </div>
        <span className="text-muted-foreground">Tanggal lahir</span>
        <div className="space-x-3">
          {dob && <span>{dobConverted}</span>}
          <FieldTanggalLahir dob={dob} refetch={refetch} />
        </div>
        <span className="text-muted-foreground">Kode referral</span>
        <div className="space-x-3">
          <span>{referralCode}</span>
          <SalinKodeReferral referralCode={referralCode} />
        </div>
      </div>
    </div>
  );
};

export default ProfilForm;
