import ProductDetailView from '@/view/main/product-detail';

export default function ProductDetailPage({
  params,
}: {
  params: { product: string };
}) {
  return <ProductDetailView productId={params.product} />;
}
