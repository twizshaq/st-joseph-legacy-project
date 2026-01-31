import React, { useState } from 'react'
import { Navigation, ChevronUp, ChevronDown } from 'lucide-react'

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
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Navigation className="w-6 h-6 text-black" />
                    <h2 className="text-xl font-bold text-gray-900">Tour Locations</h2>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    {isExpanded ? 'Hide Map' : 'Show Map'}
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="bg-[#f0f4f8] p-4">
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
