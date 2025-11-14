'use client';

import { Button } from "./ui/button";

type DatePresetButtonsProps = {
    onPresetSelect: (days: number) => void;
};

const buttonPresets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
];

const buttonClass = "px-3 py-1 bg-white text-blue-700 border rounded text-sm hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-700";

export default function DatePresetButtons({ onPresetSelect }: DatePresetButtonsProps) {
    const handlePresetClick = (days: number) => {
        onPresetSelect(days);
    };

    return (
        <div className="flex items-center gap-2">
            {buttonPresets.map(({ label, days }) => (
                <Button
                    key={days}
                    onClick={() => handlePresetClick(days)}
                    className={buttonClass}
                >
                    {label}
                </Button>
            ))}
        </div>
    );
}