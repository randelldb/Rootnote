import { useState } from 'react';
import { toast } from 'sonner';
import { Crop, CropMilestones } from '../types';
import { cropService, cropLogService } from '../services/apiService';

export const useCropOperations = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const cropsData = await cropService.getAll();
      setCrops(cropsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async (newCrop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSubmitting(true);
      const crop = await cropService.create(newCrop);
      setCrops([crop, ...crops]);
      return crop;
    } catch (error: any) {
      console.error('Failed to create crop:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to create crop. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateCrop = async (id: string, updates: Partial<Crop>) => {
    try {
      setSubmitting(true);
      const updated = await cropService.update(id, updates);
      setCrops(crops.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (error: any) {
      console.error('Failed to update crop:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to update crop. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCrop = async (id: string) => {
    toast.promise(cropService.delete(id), {
      loading: 'Deleting crop...',
      success: () => {
        setCrops(crops.filter((c) => c.id !== id));
        return 'Crop deleted successfully';
      },
      error: (error) => {
        console.error('Failed to delete crop:', error);
        return error?.response?.data?.error || 'Failed to delete crop. Please try again.';
      },
    });
  };

  const updateCropStatus = async (id: string, status: 'Planned' | 'Growing' | 'Harvested') => {
    try {
      const updated = await cropService.update(id, { status });
      setCrops(crops.map((c) => (c.id === id ? updated : c)));
    } catch (error: any) {
      console.error('Failed to update crop status:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to update status. Please try again.';
      toast.error(errorMessage);
    }
  };

  return {
    crops,
    loading,
    error,
    submitting,
    loadCrops,
    addCrop,
    updateCrop,
    deleteCrop,
    updateCropStatus,
    setCrops,
  };
};
