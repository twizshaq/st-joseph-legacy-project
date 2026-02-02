import React, { useState } from 'react'
import { Navigation, ChevronUp, ChevronDown } from 'lucide-react'
import ArrowIcon from "@/public/icons/arrow-icon"

export function TourMap() {
    const [isExpanded, setIsExpanded] = useState(true)

    const locations = [
        {
            id: 1,
            name: 'Andromeda Botanic Gardens',
        },
        {
            id: 2,
            name: 'Atlantis Hotel at Tent Bay',
        },
        {
            id: 3,
            name: 'Old Barbados Railway Path',
        },
        {
            id: 4,
            name: 'Bathsheba Beach',
        },
    ]

    return (
        <div className="bg-[#f2f2f2] rounded-[40px] overflow-hidden mb-8">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-white/0 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Navigation className="w-6 h-6 text-black" />
                    <h2 className="text-xl font-bold text-gray-900">Tour Locations</h2>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center cursor-pointer gap-2bg-[#f2f2f2] rounded-[40px] text-slate-800 px-4 py-2 rounded-full font-medium transition-colors gap-2"
                >
                    {isExpanded ? 'Hide Stops' : 'Show Stops'}
                    {isExpanded ? (
                        <ArrowIcon className="rotate-0" color="#1E293B" />
                    ) : (
                        <ArrowIcon className="rotate-180" color="#1E293B" />
                    )}
                </button>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="bg-[#f0f4f8]/0 p-4">
                    {/* List/Legend */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {locations.map((loc) => (
                            <div key={loc.id} className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                    {loc.id}
                                </div>
                                <span className="text-gray-800 font-medium truncate">
                                    {loc.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TourMap
