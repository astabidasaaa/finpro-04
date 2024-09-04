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
import { useRouter } from 'next/router';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
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

type ProductFormProps = z.infer<typeof productSchema>;

export default function CreateProductForm({
  brands,
  categories,
}: {
  brands: BrandProps[];
  categories: CategoryProps[];
}) {
  //   const router = useRouter();
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormProps>({
    resolver: zodResolver(productSchema),
  });

  const [file, setFile] = useState<File | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  // for image input ref to hide the actual input field
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
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

      data.product.forEach((file: File) => {
        formData.append('product', file);
      });

      const submitEvent = await axiosInstance().post(`/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${token}`,
        },
      });

      if (submitEvent) {
        toast({
          variant: 'success',
          title: 'Produk telah disimpan',
          description:
            'Produk telah disimpan pada database. Stok produk dapat kemudian diatur pada menu inventori',
        });

        setTimeout(() => {
          form.reset();
          setFile(undefined);
          setPreviewImage(undefined);

          window.location.reload();
        }, 2500);
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

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);

      // Update the state with the files
      setFiles(filesArray);

      // Create URLs for the file previews
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  // passing ref to hidden input field
  const onUploadBtnClick = () => {
    hiddenInputRef.current?.click();
  };

  const removeThumbnail = () => {
    setFile(undefined);
    setPreviewImage(undefined);
    hiddenInputRef.current = null;
  };

  return (
    <div className="grid flex-1 w-full items-start gap-4 p-4 px-0 sm:px-0 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-full w-full flex-col bg-muted/50"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
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
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold md:text-2xl">
                    Gambar Produk
                  </CardTitle>
                  <CardDescription>Upload gambar produk Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {previewImage && (
                      <button
                        type="button"
                        className="relative group"
                        onClick={removeThumbnail}
                      >
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
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
                        name="product"
                        render={({ field }) => (
                          <FormItem className="gap-3 hidden">
                            <FormControl>
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
                                  const files = Array.from(
                                    e.target.files || [],
                                  );
                                  field.onChange(files);
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
                        {previewImage ? 'Ubah gambar' : 'Upload gambar'}
                      </Button>
                      <div className="thumbnails">
                        {previewImages.map((src, index) => (
                          <img
                            key={index}
                            src={src}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-24 h-24 object-cover"
                          />
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
                      <Select>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue
                            defaultValue="DRAFT"
                            placeholder="DRAFT"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                          <SelectItem value="PUBLISHED">PUBLISH</SelectItem>
                        </SelectContent>
                      </Select>
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
