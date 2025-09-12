import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  getMulterOptions(folder: string) {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const username = req.user?.username || 'unknown';
          const userFolder = join('./uploads', folder, username);

          if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
          }

          cb(null, userFolder);
        },
        filename: (req, file, cb) => {
          const username = req.user?.username || 'unknown';
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${folder}-${username}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes.'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    };
  }
}
