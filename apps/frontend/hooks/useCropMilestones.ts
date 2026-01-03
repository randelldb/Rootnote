import { useState } from 'react';
import { toast } from 'sonner';
import { Crop, CropMilestones } from '../types';
import { cropService } from '../services/apiService';

export const useCropMilestones = (
  updateLocalCrop: (id: string, updates: Partial<Crop>) => Promise<Crop>
) => {
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);
  const [selectedCropForMilestones, setSelectedCropForMilestones] = useState<Crop | null>(null);
  const [milestonesData, setMilestonesData] = useState<CropMilestones>({});
  const [newHarvestDate, setNewHarvestDate] = useState('');
  const [selectedMilestoneYear, setSelectedMilestoneYear] = useState<number>(
    new Date().getFullYear()
  );
  const [submitting, setSubmitting] = useState(false);

  const handleShowMilestones = (crop: Crop) => {
    setSelectedCropForMilestones(crop);

    // Initialize with current year
    const currentYear = new Date().getFullYear();
    setSelectedMilestoneYear(currentYear);

    // Parse existing milestones if they exist
    let parsedMilestones: CropMilestones = {};
    if (crop.milestones) {
      try {
        const parsed = JSON.parse(crop.milestones);

        // For permanent crops, extract the data for the current year
        if (crop.cropType === 'permanent') {
          parsedMilestones = parsed[currentYear.toString()] || {};
        } else {
          // For annual crops, use the data directly
          parsedMilestones = parsed;
        }
      } catch (error) {
        console.error('Failed to parse milestones:', error);
      }
    }

    setMilestonesData(parsedMilestones);
    setIsMilestonesModalOpen(true);
  };

  const handleUpdateMilestones = async () => {
    if (!selectedCropForMilestones) return;

    try {
      setSubmitting(true);

      let milestonesJson: string;

      // For permanent crops, save milestones under the selected year
      if (selectedCropForMilestones.cropType === 'permanent') {
        // Parse existing milestones to get all years
        let allMilestones: Record<string, CropMilestones> = {};
        if (selectedCropForMilestones.milestones) {
          try {
            allMilestones = JSON.parse(selectedCropForMilestones.milestones);
          } catch (error) {
            console.error('Failed to parse existing milestones:', error);
          }
        }

        // Update the selected year's milestones
        allMilestones[selectedMilestoneYear.toString()] = milestonesData;
        milestonesJson = JSON.stringify(allMilestones);
      } else {
        // For annual crops, save milestones directly
        milestonesJson = JSON.stringify(milestonesData);
      }

      await updateLocalCrop(selectedCropForMilestones.id, {
        milestones: milestonesJson,
      });

      setIsMilestonesModalOpen(false);
      toast.success('Milestones updated successfully!');
    } catch (error: any) {
      console.error('Failed to update milestones:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to update milestones. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHarvestDate = () => {
    if (!newHarvestDate) return;

    const currentHarvests = milestonesData.harvestDates || [];
    setMilestonesData({
      ...milestonesData,
      harvestDates: [...currentHarvests, newHarvestDate].sort(),
    });
    setNewHarvestDate('');
  };

  const handleRemoveHarvestDate = (dateToRemove: string) => {
    const currentHarvests = milestonesData.harvestDates || [];
    setMilestonesData({
      ...milestonesData,
      harvestDates: currentHarvests.filter((d) => d !== dateToRemove),
    });
  };

  const handleMilestoneYearChange = (newYear: number) => {
    if (!selectedCropForMilestones) return;

    setSelectedMilestoneYear(newYear);

    // Load milestones for the new year
    let parsedMilestones: CropMilestones = {};
    if (selectedCropForMilestones.milestones) {
      try {
        const parsed = JSON.parse(selectedCropForMilestones.milestones);

        // For permanent crops, extract the data for the selected year
        if (selectedCropForMilestones.cropType === 'permanent') {
          parsedMilestones = parsed[newYear.toString()] || {};
        } else {
          // For annual crops, use the data directly
          parsedMilestones = parsed;
        }
      } catch (error) {
        console.error('Failed to parse milestones:', error);
      }
    }

    setMilestonesData(parsedMilestones);
  };

  const closeMilestonesModal = () => {
    setIsMilestonesModalOpen(false);
    setMilestonesData({});
  };

  return {
    isMilestonesModalOpen,
    selectedCropForMilestones,
    milestonesData,
    newHarvestDate,
    selectedMilestoneYear,
    submitting,
    handleShowMilestones,
    handleUpdateMilestones,
    handleAddHarvestDate,
    handleRemoveHarvestDate,
    handleMilestoneYearChange,
    closeMilestonesModal,
    setMilestonesData,
    setNewHarvestDate,
  };
};
