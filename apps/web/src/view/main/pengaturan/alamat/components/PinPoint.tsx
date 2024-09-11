import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { TLocation } from '@/types/addressType';
import { Loader2 } from 'lucide-react';
import React from 'react';

type Props = {};

const PinPoint = ({
  mapPin,
  setMapPin,
  setDialogPage,
}: {
  mapPin: TLocation;
  setMapPin: React.Dispatch<React.SetStateAction<TLocation>>;
  setDialogPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="grid gap-4">
      <Map defaultPosition={mapPin} />
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setDialogPage('address_main')}
        >
          Kembali
        </Button>
        <Button type="button" className="min-w-36">
          Pilih Lokasi
        </Button>
      </DialogFooter>
    </div>
  );
};

export default PinPoint;
