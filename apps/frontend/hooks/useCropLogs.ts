import { useState } from 'react';
import { toast } from 'sonner';
import { Crop, CropLog } from '../types';
import { cropLogService } from '../services/apiService';

export const useCropLogs = () => {
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
  const [isShowLogsModalOpen, setIsShowLogsModalOpen] = useState(false);
  const [selectedCropForLog, setSelectedCropForLog] = useState<Crop | null>(null);
  const [cropLogs, setCropLogs] = useState<CropLog[]>([]);
  const [logFormData, setLogFormData] = useState({
    logDate: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddLog = (crop: Crop) => {
    setSelectedCropForLog(crop);
    setLogFormData({
      logDate: new Date().toISOString().split('T')[0],
      note: '',
    });
    setIsAddLogModalOpen(true);
  };

  const handleShowLogs = async (crop: Crop) => {
    setSelectedCropForLog(crop);
    setIsShowLogsModalOpen(true);
    try {
      const logs = await cropLogService.getByCropId(crop.id);
      setCropLogs(logs);
    } catch (error) {
      console.error('Failed to load logs:', error);
      toast.error('Failed to load logs. Please try again.');
    }
  };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCropForLog) return;

    if (!logFormData.note || logFormData.note.trim().length === 0) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setSubmitting(true);
      await cropLogService.create({
        cropId: selectedCropForLog.id,
        logDate: logFormData.logDate,
        note: logFormData.note,
      });

      setIsAddLogModalOpen(false);
      setLogFormData({
        logDate: new Date().toISOString().split('T')[0],
        note: '',
      });

      toast.success('Log added successfully!');
    } catch (error: any) {
      console.error('Failed to create log:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to create log. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAddLogModal = () => {
    setIsAddLogModalOpen(false);
    setLogFormData({ logDate: new Date().toISOString().split('T')[0], note: '' });
  };

  const closeShowLogsModal = () => {
    setIsShowLogsModalOpen(false);
    setCropLogs([]);
  };

  return {
    isAddLogModalOpen,
    isShowLogsModalOpen,
    selectedCropForLog,
    cropLogs,
    logFormData,
    submitting,
    handleAddLog,
    handleShowLogs,
    handleSubmitLog,
    closeAddLogModal,
    closeShowLogsModal,
    setLogFormData,
  };
};
