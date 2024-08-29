import { Router } from 'express';

export type Route = {
  path?: string;
  router: Router;
};

export type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isVerified: boolean;
  avatar: string;
  referral: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
