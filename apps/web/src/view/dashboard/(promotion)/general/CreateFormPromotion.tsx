'use client';

import Image from 'next/image';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AxiosError } from 'axios';
import { Loader2, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCookie } from 'cookies-next';
import { Textarea } from '@/components/ui/textarea';
import { DiscountType, State } from '@/types/productTypes';
import {
  displayDiscountTypeMap,
  displayPromotionTypeMap,
  PromotionSource,
  PromotionType,
} from '@/types/promotionType';
import SelectSourceType from './SelectType';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectDuration from '../components/SelectDuration';
import { Switch } from '@/components/ui/switch';
import { formSchema } from './createPromotionSchema';

export default function CreatePromotionForm({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [source, setSource] = useState<string>(PromotionSource.REFEREE_BONUS);
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );
  const token = getCookie('access-token');

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      promotionState: State.DRAFT,
      source: PromotionSource.REFEREE_BONUS,
      description: '',
      startedAt: '',
      finishedAt: '',
      quota: undefined,
      promotionType: PromotionType.TRANSACTION,
      discountType: DiscountType.PERCENT,
      discountValue: undefined,
      discountDurationSecs: 60 * 60 * 24,
      isFeatured: false,
      afterMinPurchase: undefined,
      afterMinTransaction: undefined,
      minPurchase: undefined,
      maxDeduction: undefined,
    },
  });

  useEffect(() => {
    if (file !== undefined) {
      form.setValue('file', file);
    } else {
      form.setValue('file', undefined);
    }
  }, [file]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().post('/promotions/general', values, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => {
        setSubmitLoading((prev) => false);
        form.reset();
        setIsOpen(false);
        if (res.status === 200) {
          toast({
            variant: 'success',
            title: res.data.message,
            description: 'Promosi umum berhasil ditambahkan',
          });
        }

        window.location.reload();
      }, 1000);
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        if (error.response?.status == 410) {
          error.response.data.errors.forEach((error: any) => {
            message += `${error.msg} \n`;
          });
        } else {
          message = error.response?.data.message;
        }
      } else {
        message = error.message;
      }
      console.log(error);

      setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'Promosi gagal ditambahkan',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 500);
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];

      setFile(image);
      setPreviewImage(URL.createObjectURL(image));
    }
  };

  // passing ref to hidden input field
  const onUploadBtnClick = () => {
    hiddenInputRef.current?.click();
  };

  const removeThumbnail = () => {
    setFile(undefined);
    setPreviewImage(undefined);
  };

  return (
    <ScrollArea className="max-h-[60vh]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 pl-1 pr-2"
        >
          <FormField
            control={form.control}
            name="source"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Jenis Promosi</FormLabel>
                <Select
                  defaultValue={PromotionSource.REFEREE_BONUS}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSource(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectSourceType />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {source === PromotionSource.AFTER_MIN_PURCHASE && (
            <FormField
              control={form.control}
              name="afterMinPurchase"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Minimal belanja untuk mendapatkan kupon</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {source === PromotionSource.AFTER_MIN_TRANSACTION && (
            <FormField
              control={form.control}
              name="afterMinTransaction"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>
                    Minimal transaksi untuk mendapatkan kupon
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Nama promosi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea placeholder="Deskripsi promosi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            {previewImage && (
              <button
                type="button"
                className="relative group"
                onClick={removeThumbnail}
              >
                <Image
                  alt="Promotion image"
                  className="aspect-auto w-full rounded-md object-cover"
                  height="100"
                  src={previewImage}
                  width="300"
                />
                <div className="absolute bottom-0 left-0 right-0 py-4 bg-muted-foreground/90 opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-muted text-sm font-medium">
                    Hapus gambar
                  </span>
                </div>
              </button>
            )}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="gap-3 hidden">
                    <FormControl>
                      <Input
                        type="file"
                        ref={(e) => {
                          field.ref(e);
                          hiddenInputRef.current = e;
                        }}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange();
                          handleThumbnailUpload(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="icon"
                className="flex aspect-square w-full items-center justify-center rounded-md text-muted-foreground"
                onClick={onUploadBtnClick}
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                {previewImage ? 'Ubah gambar' : 'Unggah gambar'}
              </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="startedAt"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Mulai promosi</FormLabel>
                <FormControl>
                  <Input type="date" {...field} autoComplete="mobile tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="finishedAt"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Selesai promosi</FormLabel>
                <FormControl>
                  <Input type="date" {...field} autoComplete="mobile tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quota"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Kuota Kupon</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promotionType"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Tipe Promosi</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PromotionType).map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {displayPromotionTypeMap.get(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Tipe Diskon</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(DiscountType).map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {displayDiscountTypeMap.get(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Nilai Diskon</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minPurchase"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Minimal pembelian</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxDeduction"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Maksimal potongan</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountDurationSecs"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Durasi Validitas Kupon</FormLabel>
                <Select
                  defaultValue={String(60 * 60 * 24)}
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectDuration />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Promosi Unggulan?</FormLabel>
                <FormDescription>
                  Promosi unggulan akan ditampilkan pada landing page
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promotionState"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue defaultValue="DRAFT" placeholder="DRAFT" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT" key="DRAFT">
                      DRAF
                    </SelectItem>
                    <SelectItem value="PUBLISHED" key="PUBLISHED">
                      TERBIT
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitLoading} className="min-w-36">
            {isSubmitLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Tambah Promosi'
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
