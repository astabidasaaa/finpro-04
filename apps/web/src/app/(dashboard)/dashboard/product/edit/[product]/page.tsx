import EditProductView from '@/view/dashboard/product/edit';

export default function ProductEditView({
  params,
}: {
  params: { product: string };
}) {
  return <EditProductView productId={params.product} />;
}
