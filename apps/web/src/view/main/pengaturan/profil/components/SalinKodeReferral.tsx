import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

const SalinKodeReferral = ({ referralCode }: { referralCode: string }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(referralCode);

    toast({
      variant: 'default',
      description: 'Kode referral disalin ke clipboard',
    });
  };

  return (
    <Button
      variant="link"
      className="p-0 text-accent-yellow"
      onClick={handleCopyClick}
    >
      Salin
    </Button>
  );
};

export default SalinKodeReferral;
