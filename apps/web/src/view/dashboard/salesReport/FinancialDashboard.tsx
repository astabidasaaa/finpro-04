import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { IDR } from '@/lib/utils';
import { SalesOverall } from '@/types/salesType';
import {
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  Truck,
} from 'lucide-react';

const mockData: SalesOverall = {
  cleanRevenue: 150000000,
  productRevenue: 130000000,
  deliveryRevenue: 20000000,
  transactionCount: 1000,
  itemCount: 1500,
};

export default function FinancialDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-3">
      <MetricCard
        title="Pendapatan"
        value={IDR.format(mockData.cleanRevenue)}
        icon={DollarSign}
      />
      <MetricCard
        title="Jumlah Transaksi"
        value={mockData.transactionCount.toString()}
        icon={CreditCard}
      />
      <MetricCard
        title="Jumlah Barang Dibeli"
        value={mockData.itemCount?.toString() ?? 'N/A'}
        icon={Package}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="min-w-[200px] flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
