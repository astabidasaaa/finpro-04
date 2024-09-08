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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

const AlamatCard = ({ fullAddress }: { fullAddress: Address }) => {
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
      <CardContent className="pt-6 space-y-2">
        <div className="text-sm font-bold space-x-3">
          <span>{name}</span>
          {isMain && (
            <Badge
              variant="secondary"
              className="text-[10px] text-muted-foreground font-bold tracking-wide w-max"
            >
              Utama
            </Badge>
          )}
        </div>
        <p className="text-sm md:text-base">{address}</p>
        <p className="text-sm md:text-base">{zipCode}</p>
        <Button
          variant="link"
          className="!mt-4 p-0 h-max text-main-dark space-x-2"
        >
          <MapPin className="size-5" /> <span>Lihat Pinpoint</span>
        </Button>
      </CardContent>
      <CardFooter className="space-x-4">
        <Button variant="link" className="p-0 h-max text-main-dark text-xs">
          Ubah Alamat
        </Button>

        {!isMain && (
          <Button variant="link" className="p-0 h-max text-main-dark text-xs">
            Jadikan Alamat Utama
          </Button>
        )}
        <Button variant="link" className="p-0 h-max text-main-dark text-xs">
          Hapus
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlamatCard;
