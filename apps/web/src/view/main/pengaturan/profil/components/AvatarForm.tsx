import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import { Button } from '@/components/ui/button';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const FormSchema = z.object({
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
      message: 'Ukuran maksimal avatar 1MB',
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type || ''), {
      message: 'Ekstensi file hanya bisa .png, .jpg, atau .jpeg',
    }),
});

const AvatarForm = (props: {
  previewImage: string | undefined;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { previewImage, setPreviewImage } = props;
  const token = getCookie('access-token');

  const [isFormLoading, setFormLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const watchFile = useWatch({ control: form.control, name: 'file' });

  useEffect(() => {
    if (watchFile) form.handleSubmit(onSubmit)();
  }, [watchFile]);

  const onUploadBtnClick = () => {
    hiddenInputRef.current?.click();
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setFormLoading((prev) => true);

    try {
      const changeAvatar = await axiosInstance().patch(`/user/profile`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (changeAvatar) {
        setTimeout(() => {
          setFormLoading((prev) => false);

          toast({
            variant: 'default',
            description: 'Avatar berhasil diubah',
          });

          if (data.file) {
            const image = data.file;

            setPreviewImage(URL.createObjectURL(image));
          }
        }, 1500);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal mengubah avatar',
      });

      setFormLoading((prev) => false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-full w-full flex-col"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  ref={(e) => {
                    field.ref(e);
                    hiddenInputRef.current = e;
                  }}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    field.onChange(e.target.files && e.target.files[0]);
                  }}
                  className="hidden"
                />
              </FormControl>
              <FormMessage className="!mt-0 !mb-2" />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          size="icon"
          className="flex w-full items-center justify-center rounded-md text-muted-foreground"
          onClick={onUploadBtnClick}
          type="button"
          disabled={isFormLoading}
        >
          {isFormLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {previewImage ? 'Ubah avatar' : 'Upload avatar'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AvatarForm;
