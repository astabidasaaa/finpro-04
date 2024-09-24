'use client';

import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  editProductSchema,
  productSchema,
} from '../../addProduct/productSchema';
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
import { ProductProps } from '@/types/productTypes';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';

export default function EditProductForm({
  brands,
  categories,
  product,
}: {
  brands: BrandProps[];
  categories: CategoryProps[];
  product: ProductProps;
}) {
  const [parentCategoryId, setParentCategoryId] = useState<string>(
    String(product.subcategory.productCategory.id),
  );
  const [previewImages, setPreviewImages] = useState<
    { url: string; id: number; isUploaded: boolean }[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const token = getCookie('access-token');
  const route = useRouter();

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      brandId: String(product?.brandId || ''),
      subcategoryId: String(product?.subcategoryId || ''),
      productState: product?.productState || 'DRAFT',
      price: product?.prices[0]?.price || 0,
      product: [],
      imagesToDelete: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof editProductSchema>) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('brandId', data.brandId);
      formData.append('subcategoryId', data.subcategoryId);
      formData.append('description', data.description);
      formData.append('productState', data.productState);
      formData.append('price', data.price.toString());
      formData.append('imagesToDelete', JSON.stringify(data.imagesToDelete));

      files.forEach((file: File) => {
        if (file.name !== '') {
          formData.append('product', file);
        }
      });

      const submitEvent = await axiosInstance().patch(
        `/products/${product.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (submitEvent) {
        toast({
          variant: 'success',
          title: 'Produk berhasil diperbarui',
          description: 'Perubahan produk telah disimpan pada database.',
        });

        setTimeout(() => {
          form.reset();
          setFiles([]);
          setPreviewImages([]);

          route.push('/dashboard/product/list');
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
        title: 'Gagal memperbarui produk',
        description: message,
      });
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isUploaded: false,
      id: 0,
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const removedImage = previewImages[index];
    if (removedImage.isUploaded) {
      form.setValue('imagesToDelete', [
        ...form.getValues('imagesToDelete'),
        removedImage.id,
      ]);
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // passing ref to hidden input field
  const onUploadBtnClick = () => {
    hiddenInputRef.current?.click();
  };

  useEffect(() => {
    if (product) {
      const images = product.images.map((image) => ({
        url: `${process.env.PRODUCT_API_URL}/${image.title}`,
        isUploaded: true,
        id: image.id,
      }));
      setPreviewImages(images);

      const uploadedFiles = product.images.map((image) => new File([], ''));
      setFiles(uploadedFiles);
    } else {
      <Loading />;
    }
  }, [product]);

  if (!product) {
    return <Loading />;
  }

  return (
    <div
      key={product?.id}
      className="grid flex-1 w-full items-start gap-4 p-4 px-0 sm:px-0 sm:py-0 md:gap-8"
    >
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
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Textarea {...field} />
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
                          <Select
                            onValueChange={field.onChange}
                            value={form.watch('brandId')}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultChecked={true} />
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
                      {parentCategoryId !== null && (
                        <Select
                          onValueChange={(e) => setParentCategoryId(e)}
                          value={parentCategoryId}
                        >
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
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subkategori</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={form.watch('subcategoryId')}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultChecked={true} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories
                                .find(
                                  (cat) => cat.id === Number(parentCategoryId),
                                )
                                ?.subcategories.map((subcategory) => (
                                  <SelectItem
                                    key={subcategory.id}
                                    value={subcategory.id.toString()}
                                  >
                                    {subcategory.name}
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
                            <FormControl>
                              <Input
                                className="hidden"
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
                                  field.onChange(files); // Updating the form value
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
                      <div className="grid grid-cols-3 gap-2">
                        {previewImages.map((images, index) => (
                          <div key={index} className="relative col-span-1">
                            <Image
                              src={images.url}
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
                            <Select
                              onValueChange={field.onChange}
                              value={form.watch('productState')}
                            >
                              <FormControl>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue defaultChecked={true} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DRAFT" key="DRAFT">
                                  DRAF
                                </SelectItem>
                                <SelectItem value="PUBLISHED" key="PUBLISHED">
                                  TERBIT
                                </SelectItem>
                                <SelectItem value="ARCHIVED" key="ARCHIVED">
                                  ARSIP
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
