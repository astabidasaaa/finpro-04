import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import fs from 'fs';

export function deletePhoto(filename: string, foldername: string): void {
  try {
    fs.unlink(`public/${foldername}/${filename}`, (err) => {
      if (err) {
        throw new HttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Failed to delete photo',
        );
      }
    });
  } catch (err) {
    throw err;
  }
}
