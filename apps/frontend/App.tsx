import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Dashboard from './components/Dashboard';
import CropManager from './components/CropManager';
import Settings from './components/Settings';
import Login from './components/Login';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MobileHeader, DesktopHeader } from './components/layout/Header';
import { CropFormModal } from './components/modals/CropFormModal';
import { AddLogModal, ShowLogsModal } from './components/modals/LogModal';
import { MilestonesModal } from './components/modals/MilestonesModal';
import { useCropOperations } from './hooks/useCropOperations';
import { useCropLogs } from './hooks/useCropLogs';
import { useCropMilestones } from './hooks/useCropMilestones';
import { useAuth } from './hooks/useAuth';
import { Tab, Crop } from './types';

const App: React.FC = () => {
  const { isAuthenticated, loading, checkAuth } = useAuth();

  // Show login screen if not authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E7C4F] mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={checkAuth} />;
  }

  return <AuthenticatedApp />;
};

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Form state for new crop
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    plantingDate: '',
    expectedHarvestDate: '',
    pruneDate: '',
    cropType: 'annual' as 'annual' | 'permanent',
    cropYear: new Date().getFullYear(),
  });

  // Custom hooks
  const cropOps = useCropOperations();
  const cropLogs = useCropLogs();
  const cropMilestones = useCropMilestones(cropOps.updateCrop);

  // Load crops on mount
  useEffect(() => {
    cropOps.loadCrops();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      plantingDate: '',
      expectedHarvestDate: '',
      pruneDate: '',
      cropType: 'annual',
      cropYear: new Date().getFullYear(),
    });
  };

  const handleSubmitCrop = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || formData.name.trim().length === 0) {
      toast.error('Please enter a valid crop name');
      return;
    }
    if (!formData.species || formData.species.trim().length === 0) {
      toast.error('Please enter a valid species name');
      return;
    }
    if (!formData.plantingDate || !/^(0[1-9]|1[0-2])$/.test(formData.plantingDate)) {
      toast.error('Please select a valid planting month');
      return;
    }
    if (!formData.expectedHarvestDate || !/^(0[1-9]|1[0-2])$/.test(formData.expectedHarvestDate)) {
      toast.error('Please select a valid harvest month');
      return;
    }

    if (editingCrop) {
      // Update existing crop
      await cropOps.updateCrop(editingCrop.id, {
        name: formData.name,
        species: formData.species,
        plantingDate: formData.plantingDate,
        expectedHarvestDate: formData.expectedHarvestDate,
        pruneDate: formData.pruneDate || undefined,
        cropType: formData.cropType,
        cropYear: formData.cropYear,
      });
      setIsAddModalOpen(false);
      setEditingCrop(null);
      resetForm();
      return;
    }

    // Generate a random color for the crop
    const colors = ['bg-[#4E7C4F]', 'bg-[#5DA9E9]', 'bg-[#966F33]', 'bg-[#E94560]', 'bg-[#9B59B6]'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    await cropOps.addCrop({
      name: formData.name,
      species: formData.species,
      plantingDate: formData.plantingDate,
      expectedHarvestDate: formData.expectedHarvestDate,
      pruneDate: formData.pruneDate || undefined,
      status: 'Planned',
      color: randomColor,
      cropType: formData.cropType,
      cropYear: formData.cropYear,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      species: crop.species,
      plantingDate: crop.plantingDate,
      expectedHarvestDate: crop.expectedHarvestDate,
      pruneDate: crop.pruneDate || '',
      cropType: crop.cropType || 'annual',
      cropYear: crop.cropYear || new Date().getFullYear(),
    });
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCrop(null);
    resetForm();
  };

  const handleNewCropClick = () => {
    if (activeTab !== 'crops') setActiveTab('crops');
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewCropClick={handleNewCropClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Desktop Top Header */}
        <DesktopHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {cropOps.error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Connection Error</h3>
                  <p className="text-slate-500 mb-6">{cropOps.error}</p>
                  <button
                    onClick={cropOps.loadCrops}
                    className="px-6 py-3 bg-[#4E7C4F] text-white rounded-2xl font-bold hover:bg-[#3d633e] transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : cropOps.loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E7C4F] mx-auto"></div>
                  <p className="mt-4 text-slate-500 font-medium">Loading...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <Dashboard
                    crops={cropOps.crops}
                    onNavigateToCrops={() => setActiveTab('crops')}
                  />
                )}
                {activeTab === 'crops' && (
                  <CropManager
                    crops={cropOps.crops}
                    onDelete={cropOps.deleteCrop}
                    onEdit={handleEditCrop}
                    onStatusChange={cropOps.updateCropStatus}
                    onAdd={() => setIsAddModalOpen(true)}
                    onAddLog={cropLogs.handleAddLog}
                    onShowLogs={cropLogs.handleShowLogs}
                    onShowMilestones={cropMilestones.handleShowMilestones}
                  />
                )}
                {activeTab === 'settings' && <Settings />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={handleNewCropClick}
        className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#4E7C4F] text-white rounded-2xl shadow-lg shadow-[#4E7C4F]/30 flex items-center justify-center active:scale-95 transition-all z-20"
      >
        <Plus size={28} />
      </button>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Crop Registration Modal */}
      <CropFormModal
        isOpen={isAddModalOpen}
        editingCrop={editingCrop}
        formData={formData}
        submitting={cropOps.submitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCrop}
        onFormDataChange={setFormData}
      />

      {/* Add Log Modal */}
      <AddLogModal
        isOpen={cropLogs.isAddLogModalOpen}
        crop={cropLogs.selectedCropForLog}
        logDate={cropLogs.logFormData.logDate}
        note={cropLogs.logFormData.note}
        submitting={cropLogs.submitting}
        onClose={cropLogs.closeAddLogModal}
        onSubmit={cropLogs.handleSubmitLog}
        onLogDateChange={(date) =>
          cropLogs.setLogFormData({ ...cropLogs.logFormData, logDate: date })
        }
        onNoteChange={(note) => cropLogs.setLogFormData({ ...cropLogs.logFormData, note })}
      />

      {/* Show Logs Modal */}
      <ShowLogsModal
        isOpen={cropLogs.isShowLogsModalOpen}
        crop={cropLogs.selectedCropForLog}
        logs={cropLogs.cropLogs}
        onClose={cropLogs.closeShowLogsModal}
      />

      {/* Milestones Modal */}
      <MilestonesModal
        isOpen={cropMilestones.isMilestonesModalOpen}
        crop={cropMilestones.selectedCropForMilestones}
        milestonesData={cropMilestones.milestonesData}
        newHarvestDate={cropMilestones.newHarvestDate}
        selectedMilestoneYear={cropMilestones.selectedMilestoneYear}
        submitting={cropMilestones.submitting}
        onClose={cropMilestones.closeMilestonesModal}
        onSubmit={cropMilestones.handleUpdateMilestones}
        onMilestonesDataChange={cropMilestones.setMilestonesData}
        onNewHarvestDateChange={cropMilestones.setNewHarvestDate}
        onAddHarvestDate={cropMilestones.handleAddHarvestDate}
        onRemoveHarvestDate={cropMilestones.handleRemoveHarvestDate}
        onMilestoneYearChange={cropMilestones.handleMilestoneYearChange}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default App;
