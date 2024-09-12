import axiosInstance from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import TambahAlamatDialog from '../main/pengaturan/alamat/components/TambahAlamatDialog';
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
import { Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  addresses: Address[] | null;
  setAddresses: React.Dispatch<React.SetStateAction<Address[] | null>>;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
};

const PilihAlamatDialogContent = ({
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
}: Props) => {
  const token = getCookie('access-token');

  //   const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance().get(`/user/addresses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data.addresses;
    },
    queryKey: ['user_address'],
  });

  useEffect(() => {
    if (data) {
      setAddresses(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm === '') {
      setAddresses(data);
    } else {
      const filteredAddresses = data.filter(
        (address: Address) =>
          address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setAddresses(filteredAddresses);
    }
  }, [searchTerm, data]);

  return (
    <>
      <div className="relative w-full">
        <Input
          type="search"
          placeholder="Tulis nama / alamat / kode pos"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Search className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
      </div>
      <TambahAlamatDialog
        refetch={refetch}
        buttonStyle="bg-transparent border border-main-dark text-main-dark hover:bg-transparent "
      />
      <div className="flex flex-col gap-4 h-[320px] overflow-y-auto mt-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((address: Address, index: number) => {
            return (
              <Card
                key={`address-${index}`}
                className={`relative mx-auto w-full ${parseInt(selectedAddressId) == address.id && 'border-main-dark border-2'}`}
              >
                <CardHeader className="sr-only">
                  <CardTitle className="sr-only">{address.name}</CardTitle>
                  <CardDescription className="sr-only">
                    {address.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-row justify-between items-center pt-6">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="text-sm font-bold space-x-3">
                      {address.isMain && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] text-muted-foreground font-bold tracking-wide w-max mr-2"
                        >
                          Utama
                        </Badge>
                      )}
                      <span>{address.name}</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {address.address}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {address.zipCode}
                    </p>
                  </div>
                  <div>
                    {parseInt(selectedAddressId) == address.id ? (
                      <Check className="text-main-dark" />
                    ) : (
                      <Button
                        type="button"
                        variant="default"
                        className="bg-main-dark hover:bg-main-dark/80 text-background w-24"
                        onClick={() => {
                          setSelectedAddressId(address.id.toString());
                        }}
                      >
                        Pilih
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-muted-foreground text-xs md:text-sm">
            Anda belum memiliki alamat
          </p>
        )}
      </div>
    </>
  );
};

export default PilihAlamatDialogContent;
