import React from 'react';
import { Address } from '@/types/addressType';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HapusAlamatDialog from './HapusAlamatDialog';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import UbahAlamatUtamaDialog from './UbahAlamatUtamaDialog';
import DisplayMap from './DisplayMap';
import UbahAlamatDialog from './UbahAlamatDialog';

const AlamatCard = ({
  fullAddress,
  refetch,
}: {
  fullAddress: Address;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const { id, name, address, latitude, longitude, zipCode, isMain } =
    fullAddress;
  return (
    <Card
      className={`relative mx-auto w-full ${isMain && 'border-main-dark border-2'}`}
    >
      <CardHeader className="sr-only">
        <CardTitle className="sr-only">{name}</CardTitle>
        <CardDescription className="sr-only">{address}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-1 md:space-y-2">
        <div className="text-sm font-bold space-x-3">
          <span className="[overflow-wrap:anywhere]">{name}</span>
          {isMain && (
            <Badge
              variant="secondary"
              className="text-[10px] text-muted-foreground font-bold tracking-wide w-max"
            >
              Utama
            </Badge>
          )}
        </div>
        <p className="text-sm md:text-base [overflow-wrap:anywhere]">
          {address}
        </p>
        <p className="text-sm md:text-base">{zipCode}</p>
        <DisplayMap
          latestLocation={{
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          }}
        />
      </CardContent>
      <CardFooter className="space-x-4">
        <UbahAlamatDialog fullAddress={fullAddress} refetch={refetch} />
        {!isMain && (
          <UbahAlamatUtamaDialog
            addressId={id}
            label={name}
            refetch={refetch}
          />
        )}
        <HapusAlamatDialog addressId={id} label={name} refetch={refetch} />
      </CardFooter>
    </Card>
  );
};

export default AlamatCard;
