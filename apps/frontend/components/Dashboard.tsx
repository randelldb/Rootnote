import React from 'react';
import { Calendar, Clock, ChevronRight, Droplets, Leaf, TrendingUp } from 'lucide-react';
import { Crop } from '../types';

interface DashboardProps {
  crops: Crop[];
  onNavigateToCrops?: () => void;
}

// Helper to calculate months until event (positive = future, negative = past)
const getMonthsUntil = (targetMonth: number, currentMonth: number): number => {
  let diff = targetMonth - currentMonth;
  if (diff < 0) diff += 12; // Handle wrap around year
  return diff;
};

// Helper to get readable time description
const getTimeDescription = (monthsUntil: number): string => {
  if (monthsUntil === 0) return 'THIS MONTH';
  if (monthsUntil === 1) return 'NEXT MONTH';
  if (monthsUntil === 2) return 'IN 2 MONTHS';
  return `IN ${monthsUntil} MONTHS`;
};

const Dashboard: React.FC<DashboardProps> = ({ crops, onNavigateToCrops }) => {
  const recentCrops = crops.slice(0, 5);
  1;

  // Get current month (0-11, so we add 1 to match our MM format which is 1-12)
  const currentMonth = new Date().getMonth() + 1;

  // Create upcoming events from crops
  interface UpcomingEvent {
    cropName: string;
    task: 'Sowing' | 'Harvest';
    month: number;
    monthsUntil: number;
    color: string;
  }

  const upcomingEvents: UpcomingEvent[] = [];

  crops.forEach((crop) => {
    // Add sowing event for Planned crops
    if (crop.status === 'Planned' && crop.plantingDate) {
      const sowingMonth = parseInt(crop.plantingDate);
      upcomingEvents.push({
        cropName: crop.name,
        task: 'Sowing',
        month: sowingMonth,
        monthsUntil: getMonthsUntil(sowingMonth, currentMonth),
        color: crop.color,
      });
    }

    // Add harvest event for Growing crops
    if (crop.status === 'Growing' && crop.expectedHarvestDate) {
      const harvestMonth = parseInt(crop.expectedHarvestDate);
      upcomingEvents.push({
        cropName: crop.name,
        task: 'Harvest',
        month: harvestMonth,
        monthsUntil: getMonthsUntil(harvestMonth, currentMonth),
        color: crop.color,
      });
    }
  });

  // Sort by most upcoming first
  const sortedEvents = upcomingEvents.sort((a, b) => a.monthsUntil - b.monthsUntil).slice(0, 5); // Show only top 5

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 lg:pb-0">
      <header className="mb-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Growth Overview</h1>
        <p className="text-slate-500 font-medium text-sm">
          Monitoring {crops.length} active biological logs.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule Column */}
        <section className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-[#4E7C4F]" size={20} />
              Schedule
            </h2>
          </div>
          <div className="space-y-3">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event, idx) => (
                <EventRow
                  key={`${event.cropName}-${event.task}-${idx}`}
                  title={event.cropName}
                  task={event.task}
                  day={getTimeDescription(event.monthsUntil)}
                  color={event.color}
                />
              ))
            ) : (
              <div className="bg-white px-5 py-8 rounded-3xl border border-slate-200 text-center">
                <p className="text-slate-400 text-sm font-medium">No upcoming events</p>
                <p className="text-slate-300 text-xs mt-1">
                  Add crops to see sowing and harvest schedules
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recently Added Column */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-md font-bold text-slate-800">Fresh Registrations</h2>
            <button
              onClick={onNavigateToCrops}
              className="text-[10px] font-black text-[#4E7C4F] uppercase hover:underline"
            >
              Full Garden
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCrops.map((crop) => (
              <div
                key={crop.id}
                className="bg-white p-5 rounded-[32px] border border-slate-200 flex items-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${crop.color} flex-shrink-0 mr-4 shadow-inner opacity-80`}
                ></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 leading-tight text-sm truncate">
                    {crop.name}
                  </h3>
                  <p className="text-[11px] text-[#966F33] italic font-bold truncate">
                    {crop.species}
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-300 ml-2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const EventRow: React.FC<{ title: string; task: string; day: string; color: string }> = ({
  title,
  task,
  day,
  color,
}) => (
  <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group shadow-sm">
    <div className="flex items-center">
      <div className={`w-1.5 h-10 rounded-full mr-4 ${color}`}></div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{task}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-black text-[#4E7C4F] group-hover:scale-110 transition-transform">
        {day}
      </p>
    </div>
  </div>
);

export default Dashboard;
