'use client';

import React from 'react';
import FieldNama from './FieldNama';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import FieldEmail from './FieldEmail';
import FieldNomorHP from './FieldNomorHP';
import FieldTanggalLahir from './FieldTanggalLahir';
import VerifikasiEmailBadge from './VerifikasiEmailBadge';
import SalinKodeReferral from './SalinKodeReferral';
import { useAppSelector } from '@/lib/hooks';

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

  const user = useAppSelector((state) => state.auth);

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
          {name && <span className="[overflow-wrap:anywhere]">{name}</span>}
          {user.user.role === 'user' && (
            <FieldNama name={name} refetch={refetch} />
          )}
        </div>
        <span className="text-muted-foreground">Email</span>
        <div className="space-x-3">
          {email && (
            <>
              <span className="[overflow-wrap:anywhere]">{email}</span>
              {user.user.role === 'user' && (
                <VerifikasiEmailBadge isVerified={isVerified} email={email} />
              )}
            </>
          )}
          {user.user.role === 'user' && (
            <FieldEmail
              isPassword={isPassword}
              email={email}
              refetch={refetch}
            />
          )}
        </div>
        <span className="text-muted-foreground">Nomor HP</span>
        <div className="space-x-3">
          {phone && <span>{phone}</span>}
          {user.user.role === 'user' && (
            <FieldNomorHP phone={phone} refetch={refetch} />
          )}
        </div>
        <span className="text-muted-foreground">Tanggal lahir</span>
        <div className="space-x-3">
          {dob && <span>{dobConverted}</span>}
          {user.user.role === 'user' && (
            <FieldTanggalLahir dob={dob} refetch={refetch} />
          )}
        </div>
        {user.user.role === 'user' && (
          <>
            <span className="text-muted-foreground">Kode referral</span>
            <div className="space-x-3">
              <span>{referralCode}</span>
              {user.user.role === 'user' && (
                <SalinKodeReferral referralCode={referralCode} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilForm;
