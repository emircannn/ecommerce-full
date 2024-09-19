import * as argon2 from 'argon2';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CombinationsProps, VariantsProps } from 'src/common/types';
import { transliterate } from 'transliteration';
import { Repository } from 'typeorm';

export async function hashValue(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
}

export async function compareValues(
  value: string,
  hashedValue: string,
): Promise<boolean> {
  return await argon2.verify(hashedValue, value);
}

export function successReturn({
  data,
  message,
}: {
  data?: any;
  message?: string;
}) {
  return {
    error: false,
    message: message || 'İşlem Başarılı.',
    data,
  };
}

export function errorReturn(message?: string) {
  return {
    error: true,
    message: message || 'İşlem Başarısız!',
  };
}

export const generateSeo = async (
  name: string,
  repository: Repository<any>,
): Promise<string> => {
  const transliteratedName = transliterate(name);
  const baseSeo = transliteratedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  let uniqueSeo = baseSeo;
  let suffix = 1;

  while (await repository.findOne({ where: { seo: uniqueSeo } })) {
    uniqueSeo = `${baseSeo}-${suffix}`;
    suffix++;
  }

  return uniqueSeo;
};

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const multerOptions = (destination: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `${process.cwd()}${destination}`;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/\s+/g, '_');
      const uniqueSuffix = `${Math.round(Math.random() * 1e9)}`;
      // Uzantıyı sadece bir kere ekleyin
      const fileName = `${originalName}-${uniqueSuffix}${extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Kabul edilen resim dosya türleri
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|tiff|svg/;
    const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          'Kabul edilmeyen dosya türü. Sadece resim dosyaları kabul edilir.',
        ),
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export function generateBarcode(): string {
  const prefix = 'DJTYNK';
  const randomNumbers = Math.floor(10000 + Math.random() * 90000).toString();
  return `${prefix}${randomNumbers}`;
}

export function generateStockCode(): string {
  const prefix = 'DJT-YNK';
  const randomNumbers = Math.floor(10000 + Math.random() * 90000).toString();
  return `${prefix}${randomNumbers}`;
}

export function generateVariants(
  combinations: CombinationsProps[],
): VariantsProps[] {
  const variantGroups = new Map<number, VariantsProps>();

  combinations.forEach(combination => {
    combination.variant_values.forEach(variantValue => {
      const { id, value, variant_group_id, variant_group_name } = variantValue;

      // Eğer bu variant group daha önce eklenmemişse, ekliyoruz
      if (!variantGroups.has(variant_group_id)) {
        variantGroups.set(variant_group_id, {
          id: variant_group_id,
          name: variant_group_name,
          values: [{ id, value }],
        });
      } else {
        const existingGroup = variantGroups.get(variant_group_id)!;

        // `values` dizisinde aynı `id`'ye sahip bir değer olup olmadığını kontrol ediyoruz
        if (!existingGroup.values.some(v => v.id === id)) {
          existingGroup.values.push({ id, value });
        }
      }
    });
  });

  return Array.from(variantGroups.values());
}
