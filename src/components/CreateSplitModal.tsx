import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

interface CreateSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSplit: (name: string, description: string, dayNames: string[]) => void;
}

export const CreateSplitModal: React.FC<CreateSplitModalProps> = ({
  isOpen,
  onClose,
  onSaveSplit,
}) => {
  const [splitName, setSplitName] = useState('');
  const [description, setDescription] = useState('');
  const [dayNames, setDayNames] = useState<string[]>([
    'Day 1 — Upper Push & Pull',
    'Day 2 — Lower Quad & Hinge',
    'Day 3 — Arms & Delts',
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddDaySlot = () => {
    setDayNames((prev) => [...prev, `Day ${prev.length + 1} — Custom Session`]);
  };

  const handleRemoveDaySlot = (index: number) => {
    if (dayNames.length <= 1) return;
    setDayNames((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDayNameChange = (index: number, value: string) => {
    setDayNames((prev) => prev.map((d, idx) => (idx === index ? value : d)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = splitName.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter a name for your custom workout split.');
      return;
    }
    const validDays = dayNames.map((d) => d.trim()).filter(Boolean);
    if (validDays.length === 0) {
      setErrorMessage('Please include at least one training day in your split.');
      return;
    }

    onSaveSplit(trimmedName, description.trim(), validDays);
    setSplitName('');
    setDescription('');
    setDayNames([
      'Day 1 — Upper Push & Pull',
      'Day 2 — Lower Quad & Hinge',
      'Day 3 — Arms & Delts',
    ]);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-split-modal-title"
    >
      <div className="w-full max-w-lg bg-[#1E1E1E] border border-[#323640] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E37]">
          <div>
            <h2
              id="create-split-modal-title"
              className="font-display text-2xl font-bold tracking-wide text-[#F4F4F6]"
            >
              Create Custom Split
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Define your training rotation and workout day categories.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Create Split Modal"
            className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121212] border border-[#2E323B] text-[#9CA3AF] hover:text-[#F4F4F6] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-[#FF2A54]/15 border border-[#FF2A54] text-xs font-medium text-[#FF6B88]"
            >
              {errorMessage}
            </div>
          )}

          <div>
            <label
              htmlFor="custom-split-name"
              className="block text-xs font-semibold text-[#D1D5DB] mb-1.5"
            >
              Split Name *
            </label>
            <input
              id="custom-split-name"
              type="text"
              value={splitName}
              onChange={(e) => {
                setSplitName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g., 4-Day Power Hypertrophy, Torso / Limbs"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#121212] border border-[#323640] text-[#F4F4F6] text-sm focus:border-[#FF5500] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="custom-split-desc"
              className="block text-xs font-semibold text-[#D1D5DB] mb-1.5"
            >
              Training Focus (Optional)
            </label>
            <input
              id="custom-split-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., High-intensity progressive overload block"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#121212] border border-[#323640] text-[#F4F4F6] text-sm focus:border-[#FF5500] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#D1D5DB]">
                Workout Days in Rotation ({dayNames.length})
              </label>
              <button
                type="button"
                onClick={handleAddDaySlot}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#121212] border border-[#323640] hover:border-[#00E5FF] text-[#00E5FF] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day Slot</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {dayNames.map((day, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono-tabular text-xs text-[#9CA3AF] w-6 shrink-0">
                    0{idx + 1}.
                  </span>
                  <input
                    type="text"
                    aria-label={`Workout Day ${idx + 1} Name`}
                    value={day}
                    onChange={(e) => handleDayNameChange(idx, e.target.value)}
                    placeholder={`Day ${idx + 1} Name (e.g., Push Day)`}
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-[#121212] border border-[#323640] text-[#F4F4F6] text-sm focus:border-[#FF5500] focus:outline-none"
                  />
                  {dayNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDaySlot(idx)}
                      aria-label={`Remove Workout Day ${idx + 1}`}
                      className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121212] border border-[#2E323B] text-[#9CA3AF] hover:text-[#FF2A54] hover:border-[#FF2A54] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#2A2E37] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#121212] border border-[#323640] text-sm font-semibold text-[#D1D5DB] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-lg bg-[#00FF66] hover:bg-[#19FF75] text-[#121212] font-bold text-sm transition-colors cursor-pointer"
            >
              Save & Activate Split
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
