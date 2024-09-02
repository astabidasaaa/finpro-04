'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/components/ui/use-toast';

const UploadPaymentView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const userId = searchParams.get('userId');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('paymentProof', file);
    formData.append('orderId', orderId || '0'); 
    formData.append('userId', userId || '0');   

    try {
      await axiosInstance().post('/payments/upload-payment-proof', formData);

      toast({
        variant: 'default',
        title: 'Upload successful',
        description: 'Your payment proof has been uploaded successfully.',
      });

      router.push('/orders'); // Redirect to a success page after upload
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your payment proof. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Upload Payment Proof</h1>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={isSubmitting || !file}>
        {isSubmitting ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};

export default UploadPaymentView;
