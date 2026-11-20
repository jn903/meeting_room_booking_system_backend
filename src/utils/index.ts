import * as crypto from 'crypto';
import { diskStorage } from 'multer';
import * as path from 'path';

// md5 加密
export function md5(str:string):string {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

// 中文路径兼容性编码
export function decodeOriginalName(originalname: string): string {
  if (/[\u0080-\u009f]/.test(originalname)) {
    const fixed = Buffer.from(originalname, 'latin1').toString('utf8');
    if (!fixed.includes('\uFFFD') && /[^\x00-\x7F]/.test(fixed)) {
      return fixed;
    }
  }
  return originalname;
}
