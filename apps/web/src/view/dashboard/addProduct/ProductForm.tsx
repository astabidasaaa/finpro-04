'use client';

import React, { useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { productSchema } from './productSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CategoryProps } from '@/types/categoryTypes';
import { BrandProps } from '@/types/brandTypes';
import { toast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { getCookie } from 'cookies-next';

type ProductFormProps = z.infer<typeof productSchema>;

export default function CreateProductForm({
  brands,
  categories,
}: {
  brands: BrandProps[];
  categories: CategoryProps[];
}) {
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const token = getCookie('access-token');

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ProductFormProps>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      brandId: '',
      subcategoryId: '',
      productState: 'DRAFT',
      price: 0,
      product: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('brandId', data.brandId);
      formData.append('subcategoryId', data.subcategoryId);
      formData.append('description', data.description);
      formData.append('productState', data.productState);
      formData.append('price', data.price.toString());

      files.forEach((file: File) => {
        formData.append('product', file);
      });

      const submitEvent = await axiosInstance().post(`/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (submitEvent) {
        setTimeout(() => {
          form.reset();
          setFiles([]);
          setPreviewImages([]);

          toast({
            variant: 'success',
            title: 'Produk telah disimpan',
            description:
              'Produk telah disimpan pada database. Stok produk dapat kemudian diatur pada menu inventori',
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }, 1000);
      }
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      } else {
        message = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Gagal menambahkan produk',
        description: message,
      });
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // passing ref to hidden input field
  const onUploadBtnClick = () => {
    hiddenInputRef.current?.click();
  };

  return (
    <div className="grid flex-1 w-full items-start gap-4 p-4 px-0 sm:px-0 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-full w-full flex-col bg-muted/50"
        >
          <div className="grid gap-4 xl:grid-cols-5 xl:gap-8">
            <div className="grid auto-rows-max items-start gap-4 xl:col-span-3 xl:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold md:text-2xl">
                    Detail Produk
                  </CardTitle>
                  <CardDescription>
                    Isi dengan detail produk. Meliputi nama, deskripsi, brand,
                    kategori, dan harga.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama produk" {...field} />
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
                            <Textarea
                              placeholder="Deskripsi produk"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="-- Pilih Brand --" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand: BrandProps) => (
                                <SelectItem
                                  key={brand.id}
                                  value={brand.id.toString()}
                                >
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Kategori
                      </Label>
                      <div className="h-2.5" />
                      <Select onValueChange={(e) => setParentCategoryId(e)}>
                        <SelectTrigger className="col-span-3 ">
                          <SelectValue placeholder="-- Pilih Kategori --" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subkategori</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="-- Pilih Subkategori --" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories
                                .find(
                                  (cat) => cat.id == Number(parentCategoryId),
                                )
                                ?.subcategories.map(
                                  (subcategory: {
                                    id: number;
                                    name: string;
                                  }) => (
                                    <SelectItem
                                      key={subcategory.id}
                                      value={subcategory.id.toString()}
                                    >
                                      {subcategory.name}
                                    </SelectItem>
                                  ),
                                )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Harga</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              min={0}
                              max={100000000}
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? parseFloat(value) : 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 xl:col-span-2 xl:gap-8">
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold md:text-2xl">
                    Gambar Produk
                  </CardTitle>
                  <CardDescription>Unggah gambar produk Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                          <FormItem className="gap-3">
                            <FormControl className="hidden">
                              <Input
                                type="file"
                                multiple
                                ref={(e) => {
                                  field.ref(e);
                                  hiddenInputRef.current = e;
                                }}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                  handleThumbnailUpload(e);
                                  const files = Array.from(
                                    e.target.files || [],
                                  );
                                  field.onChange(files);
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
                        {previewImages.length > 0
                          ? 'Tambah gambar'
                          : 'Unggah gambar'}
                      </Button>
                      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-3 gap-2">
                        {previewImages.map((src, index) => (
                          <div key={index} className="relative col-span-1">
                            <Image
                              src={src}
                              alt={`Thumbnail ${index + 1}`}
                              className="object-cover w-32 h-32"
                              height={300}
                              width={300}
                            />
                            <Button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500/60 text-white rounded-lg w-3 h-4"
                              onClick={() => handleRemoveImage(index)}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold md:text-2xl">
                    Status Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="productState"
                        render={({ field }) => (
                          <FormItem className="gap-3">
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue
                                    defaultValue="DRAFT"
                                    placeholder="DRAFT"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DRAFT" key="DRAFT">
                                  DRAFT
                                </SelectItem>
                                <SelectItem value="PUBLISHED" key="PUBLISHED">
                                  PUBLISH
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit">Submit</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
