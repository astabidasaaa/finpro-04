import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const expiryChecker = async (token: string) => {
  if (!token) return false;

  const decoded = await decodeToken(token);
  if (!decoded || !decoded.exp) return false;

  return Date.now() >= decoded.exp * 1000 - 6 * 60 * 60 * 1000;
};

export const decodeToken = async (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  } catch (error) {
    return null;
  }
};
