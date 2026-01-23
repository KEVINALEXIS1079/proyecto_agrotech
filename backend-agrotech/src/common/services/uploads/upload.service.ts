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
          //  Si el usuario aún no está disponible (antes del guard JWT)
          // usa solo la carpeta principal del módulo
          const username =
            (req.user && req.user.username) ||
            (req.body && req.body.username) ||
            'general';

          const userFolder = join(process.cwd(), 'uploads', folder, username);

          // Crear carpeta si no existe
          if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
          }

          cb(null, userFolder);
        },

        filename: (req, file, cb) => {
          const username =
            (req.user && req.user.username) ||
            (req.body && req.body.username) ||
            'general';

          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const cleanFolder = folder.replace(/\W+/g, '-');
          const fileName = `${cleanFolder}-${username}-${uniqueSuffix}${ext}`;

          cb(null, fileName);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes.'), false);
        }
        cb(null, true);
      },

      limits: { fileSize: 20 * 1024 * 1024 },
    };
  }
}