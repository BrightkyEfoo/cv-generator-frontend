import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '@/services/api';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadApi.uploadImage,
  });
};

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: uploadApi.deleteImage,
  });
};
