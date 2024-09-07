import { Request } from 'express';
import multer from 'multer';
import { join } from 'path';
import path = require('path');
import { FileFilterCallback } from 'multer';
import { User } from '@/types/express';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';

type DestinationCallback = (error: Error | null, destination: string) => void;

type FileNameCallback = (error: Error | null, filename: string) => void;

type FilterCallback = (error: Error | null, valid: Boolean) => void;

export const uploader = (filePrefix: string, folderName?: string) => {
  try {
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
        // const { id } = req.user as User;
        const id = 3;

        const originalNameParts = file.originalname.split('.');

        const fileExtension = originalNameParts[originalNameParts.length - 1];

        const newFileName = `${filePrefix}_${id}_${Date.now()}.${fileExtension}`;

        cb(null, newFileName);
      },
    });

    const filter = (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      try {
        const extension = path.extname(file.originalname);
        if (
          extension !== '.png' &&
          extension !== '.jpg' &&
          extension !== '.jpeg'
        ) {
          cb(
            new HttpException(
              HttpStatus.BAD_REQUEST,
              'Ekstensi file tidak sesuai. Upload file dengan ekstensi png, jpg, atau jpeg',
            ),
          );
        }
        cb(null, true);
      } catch (err) {
        throw err;
      }
    };

    return multer({
      storage: storage,
      fileFilter: filter,
      limits: { fileSize: 1024 * 1024 },
    });
  } catch (error: any) {
    throw new HttpException(HttpStatus.BAD_REQUEST, error.message);
  }
};
