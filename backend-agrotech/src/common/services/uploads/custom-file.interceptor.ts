// src/common/interceptors/file.interceptor.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

export class CustomFileInterceptor {
  static create(fieldName: string, folder: string) {
    const uploadService = new UploadService();
    return FileInterceptor(fieldName, uploadService.getMulterOptions(folder));
  }
}
