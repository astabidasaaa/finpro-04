import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import fs from 'fs';

export function deletePhoto(filename: string, destination: string): void {
  try {
    const normalizedPath = destination.replace(/\\/g, '/');
    const segments = normalizedPath.split('/');
    const lastSegment = segments[segments.length - 1];

    fs.unlink(`public/${lastSegment}/${filename}`, (err) => {
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
