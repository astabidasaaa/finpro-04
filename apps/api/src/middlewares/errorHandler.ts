import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { MulterError } from 'multer';
import { deletePhoto } from '@/utils/deletePhoto';

export function ErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // For deleting attached photo(s) that are not processed
  if (req.file !== undefined) {
    deletePhoto(req.file.filename, req.file.fieldname);
  }

  if (Array.isArray(req.files)) {
    for (const file of req.files) {
      deletePhoto(file.filename, file.fieldname);
    }
  }

  if (error instanceof HttpException) {
    res
      .status(error.status)
      .json({ message: error.message, error: error.error });
  } else if (error instanceof MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        message: 'Ukuran file terlalu besar',
        error: 'PAYLOAD TOO LARGE',
      });
    }
  } else {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
}
