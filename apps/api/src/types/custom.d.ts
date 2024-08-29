import { User } from '@prisma/client'; // Adjust the import path as needed

declare module 'express-serve-static-core' {
  interface Request {
    user?: User; // Extend the Request interface with custom properties
  }
}
