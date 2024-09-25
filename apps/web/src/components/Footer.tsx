'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

export const Footer = () => {
  return (
    <footer className="flex justify-center items-center w-full py-8 border-t z-10">
      <div className="flex flex-col justify-start items-start w-full px-4 md:px-12 lg:px-24 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 w-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 lg:w-2/3">
            <div className={col_container}>
              <div className={col_title}>
                SIG<span className="text-xl">M</span>ART
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                {main_menu.map((item, index) => {
                  return (
                    <Link
                      key={`main_menu-${index}`}
                      href={item.href}
                      className={link_text}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className={col_container}>
              <div className={col_title}>Bantuan</div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                {bantuan_menu.map((item, index) => {
                  return (
                    <Link
                      key={`bantuan-${index}`}
                      href={item.href}
                      className={link_text}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className={col_container}>
              <div className={col_title}>Layanan Pelanggan</div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <span className={link_text}>(021) 12345678</span>
                <span className={link_text}>Senin – Minggu, 08.00-17.00</span>
                <Link href="mailto:layanan@sigmart.com" className={link_text}>
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

// style
const col_container = 'flex flex-col justify-start items-start gap-4 w-full';
const col_title =
  'text-base font-bold w-full text-center md:text-left text-main-dark';
const link_text =
  'w-full text-muted-foreground font-light text-sm text-center md:text-left';

// data
const main_menu = [
  {
    label: 'Tentang Sigmart',
    href: '#',
  },
  {
    label: 'Karir',
    href: '#',
  },
  {
    label: 'Blog',
    href: '#',
  },
  {
    label: 'Promo Hari Ini',
    href: '#',
  },
];

const bantuan_menu = [
  {
    label: 'Kebijakan Privasi',
    href: '#',
  },
  {
    label: 'Kebijakan Refund',
    href: '#',
  },
  {
    label: 'Cara Berbelanja',
    href: '#',
  },
  {
    label: 'Pertanyaan Umum',
    href: '#',
  },
  {
    label: 'Petunjuk Pembayaran',
    href: '#',
  },
  {
    label: 'Syarat & Ketentuan',
    href: '#',
  },
];
