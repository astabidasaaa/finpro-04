import { Router } from 'express';

export interface RouteItems {
  path?: string;
  router: Router;
}