import { Router } from 'express';

export type Route = {
  path?: string;
  router: Router;
};

export type User = {
  id: number;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
