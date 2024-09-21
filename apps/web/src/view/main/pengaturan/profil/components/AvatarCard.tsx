import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AvatarForm from './AvatarForm';
import PasswordUbah from './PasswordUbah';
import PasswordBuat from './PasswordBuat';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

const AvatarCard = ({
  avatar,
  isPassword,
  refetch,
}: {
  avatar: string;
  isPassword: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const user = useAppSelector((state) => state.auth);

  // for thumbnail upload
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (avatar) {
      setPreviewImage((prev) => `${process.env.AVATAR_API_URL}/${avatar}`);
    }
  }, [avatar]);

  return (
    <div className="flex flex-col w-full md:max-w-[280px] md:p-4 md:pl-0 space-y-4">
      {user.user.role === 'user' && (
        <Card className="relative mx-auto w-full md:max-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl font-bold sr-only">Avatar</CardTitle>
            <CardDescription className="sr-only">
              Ubah avatar anda
            </CardDescription>

            <Image
              alt="User avatar"
              className="aspect-square w-full object-cover "
              height={300}
              src={previewImage || '/avatar-placeholder.png'}
              width={300}
            />
          </CardHeader>
          <CardContent>
            <AvatarForm
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
            />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Besar file: maksimum 1 MB. Ekstensi file yang diperbolehkan: .JPG
            .JPEG .PNG
          </CardFooter>
        </Card>
      )}

      {isPassword ? <PasswordUbah /> : <PasswordBuat refetch={refetch} />}
    </div>
  );
};

export default AvatarCard;
