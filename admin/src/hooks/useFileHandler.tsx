import { useToast } from '@/components/ui/use-toast';
import { ChangeEvent, useState } from 'react';

interface ImageProps {
  data: File | null;
  pre: string | ArrayBuffer | null;
}

export const useFileHandler = () => {
  const { toast } = useToast();

  const [image, setImage] = useState<ImageProps>({ data: null, pre: null });
  const [images, setImages] = useState<ImageProps[]>([{ data: null, pre: null }]);

  const handleSelectFile = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (file: File) => void,
    setFilePre?: (filePreview: string | ArrayBuffer | null) => void,
    fileSizeMb: number = 2
  ): void => {
    const selectedFile = e.target.files?.[0];
    const maxFileSize = fileSizeMb * 1024 * 1024;
  
    if (selectedFile && selectedFile.size <= maxFileSize) {
      setFile(selectedFile);
  
      const reader = new FileReader();
      reader.onload = () => {
        if (setFilePre) {
          setFilePre(reader.result);
        }
      };
  
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile) {
      toast({
        title: 'Geçersiz Dosya Boyutu',
        description: `Dosya ${fileSizeMb}Mb'tan büyük olamaz.`
      });
    }
  };

  const handleSelectFiles = (
    e: ChangeEvent<HTMLInputElement>,
    setFiles: (files: File[]) => void,
    setFilePreviews?: (filePreviews: (string | ArrayBuffer | null)[]) => void,
    fileSizeMb: number = 2
  ): void => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxFileSize = fileSizeMb * 1024 * 1024;

    if (selectedFiles.length > 5) {
      toast({
        title: 'Maksimum Dosya Sayısı Aşıldı',
        description: 'En fazla 5 dosya seçebilirsiniz.'
      });
      return;
    }

    const validFiles: File[] = [];
    const filePreviews: (string | ArrayBuffer | null)[] = [];

    selectedFiles.forEach((file) => {
      if (file.size <= maxFileSize) {
        validFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          filePreviews.push(reader.result);
          if (filePreviews.length === validFiles.length && setFilePreviews) {
            setFilePreviews(filePreviews);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: 'Geçersiz Dosya Boyutu',
          description: `${file.name} dosyası ${fileSizeMb}Mb'tan büyük olamaz.`
        });
      }
    });

    if (validFiles.length > 0) {
      setFiles(validFiles);
    }
  };

  return { handleSelectFile, handleSelectFiles, image, setImage, images, setImages };
};
