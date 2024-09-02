import { Request } from 'express';
import multer, { Multer } from 'multer';
import { join } from 'path';
import path = require('path');
import { HttpException } from '@/errors/httpException';
import type { FileFilterCallback } from 'multer';
import { HttpStatus } from '@/types/error';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const upload = multer();

export function uploader(filePrefix: string, folderName?: string): Multer {
  const defaultDir = join(__dirname, '../../public');

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ) => {
      const destination = folderName ? defaultDir + folderName : defaultDir;
      cb(null, destination);
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback,
    ) => {
      const originalNameParts = file.originalname.split('.');
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = filePrefix + Date.now() + '.' + fileExtension;

      cb(null, newFileName);
    },
  });

  function filter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    }
    cb(
      new HttpException(
        HttpStatus.BAD_REQUEST,
        'File type not supported. Only JPEG, JPG, and PNG files are allowed.',
      ),
    );
  }

  return multer({
    storage: storage,
    fileFilter: filter,
    limits: { fileSize: 1024 * 1024 },
  });
}
