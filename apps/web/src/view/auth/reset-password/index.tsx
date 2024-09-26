import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordPageView = () => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Atur ulang password</CardTitle>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPageView;
