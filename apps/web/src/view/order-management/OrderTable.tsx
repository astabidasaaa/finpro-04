'use client'
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { File, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type OrderTableProps = {
  orders: any[]; 
};

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
      };
      const formatOrderStatus = (status: string) => {
        return status.replace(/_/g, ' ');
      };
      
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kustomer</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="hidden sm:table-cell">Toko</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead className="hidden sm:table-cell">Tanggal Pemesanan</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="font-medium [overflow-wrap:anywhere]">{order.customer?.profile?.name || order.customer?.email}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  className={`text-xs px-3 font-semibold ${
                    order.orderStatus === 'DIKONFIRMASI'
                      ? 'bg-green-400'
                      : order.orderStatus === 'DIBATALKAN'
                      ? 'bg-red-900'
                      : 'bg-main-dark hover:bg-main-dark/80'
                  }`}
                >
                  {formatOrderStatus(order.orderStatus)}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {order.store?.name || 'Unknown Store'}
              </TableCell>
              <TableCell>{IDR.format(order.finalPrice)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/order-management/${order.id}`} passHref>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <File className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No orders available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
