'use client';

import { useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { Label } from './ui/label';
import Image from 'next/image';
import { Button } from './ui/button';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

export const Footer = () => {
  const login_data = useAppSelector((state) => state.storeId);

  // console.log('footer', login_data);
  return (
    <footer className="flex justify-center items-center w-full py-8 border-t z-10">
      <div className="flex flex-col justify-start items-start w-full px-4 md:px-12 lg:px-24 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 w-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 lg:w-2/3">
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="text-base font-bold w-full text-center md:text-left text-main-dark">
                SIG<span className="text-xl">M</span>ART
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Tentang Sigmart
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Karir
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Blog
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Promo Hari Ini
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="text-base font-bold w-full text-center md:text-left text-main-dark">
                Bantuan
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Kebijakan Privasi
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Kebijakan Refund
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Cara Berbelanja
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Pertanyaan Umum
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Petunjuk Pembayaran
                </Link>
                <Link
                  href="#"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  Syarat & Ketentuan
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="text-base font-bold w-full text-center md:text-left text-main-dark">
                Layanan Pelanggan
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <span className="w-full text-muted-foreground font-light text-sm text-center md:text-left">
                  (021) 12345678
                </span>
                <span className="w-full text-muted-foreground font-light text-sm text-center md:text-left">
                  Senin – Minggu, 08.00-17.00
                </span>
                <Link
                  href="mailto:layanan@sigmart.com"
                  className="w-full text-muted-foreground font-light text-sm text-center md:text-left"
                >
                  layanan@sigmart.com
                </Link>
                <div className="flex flex-row justify-center md:justify-start gap-2 py-2 w-full text-muted-foreground">
                  <Link href="#">
                    <FaFacebook size={20} />
                  </Link>
                  <Link href="#">
                    <BsTwitterX size={20} />
                  </Link>
                  <Link href="#">
                    <FaInstagram size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <Link href="/">
              <Image
                src="/sigmart-logo-full-huge.png"
                alt="Logo Sigmart"
                width={320}
                height={80}
                className="w-40 md:w-48"
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center w-full pt-8 border-t">
          <span className="text-xs font-light text-muted-foreground tracking-widest">
            © 2024 Sigmart
          </span>
        </div>
      </div>
    </footer>
  );
};

// order-2 md:order-1
// order-1 md:order-2
