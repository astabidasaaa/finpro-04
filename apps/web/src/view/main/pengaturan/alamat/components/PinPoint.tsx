import React, { useState } from 'react';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { TLocation } from '@/types/addressType';

const PinPoint = ({
  mapPin,
  setMapPin,
  setDialogPage,
}: {
  mapPin: TLocation | null;
  setMapPin: React.Dispatch<React.SetStateAction<TLocation | null>>;
  setDialogPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [latestLocation, setLatestLocation] = useState<TLocation>(
    mapPin || {
      lat: -6.2,
      lng: 106.816666,
    },
  );

  const handleChangeLocation = () => {
    setMapPin(latestLocation);
    setDialogPage('address_main');
  };

  return (
    <div className="grid gap-4">
      <Map
        latestLocation={latestLocation}
        setLatestLocation={setLatestLocation}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setDialogPage('address_main')}
          className="mt-2 sm:mt-0 min-w-28"
        >
          Kembali
        </Button>
        <Button
          type="button"
          className="min-w-36"
          onClick={handleChangeLocation}
        >
          Pilih Lokasi
        </Button>
      </DialogFooter>
    </div>
  );
};

export default PinPoint;
