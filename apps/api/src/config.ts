import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
export const EMAIL_VERIFICATION_SECRET =
  process.env.EMAIL_VERIFICATION_SECRET || '';
export const FRONTEND_URL = process.env.FRONTEND_URL || '';
export const FRONTEND_URL_ALIAS = process.env.FRONTEND_URL_ALIAS || '';
export const BACKEND_URL = process.env.BACKEND_URL || '';
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL || '';
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS || '';
export const SHIPPING_API_URL = process.env.SHIPPING_API_URL || '';
export const SHIPPING_CLIENT_KEY = process.env.SHIPPING_CLIENT_KEY || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
