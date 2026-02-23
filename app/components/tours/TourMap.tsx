import React, { useState, useEffect } from 'react'
import { Navigation } from 'lucide-react'
import ArrowIcon from "@/public/icons/arrow-icon"
// IMPORT YOUR SUPABASE CLIENT
import { supabase } from '@/lib/supabaseClient'

// 1. Define what a "Stop" looks like
interface Stop {
  id: string
  name: string
}

// 2. Define what props the component accepts
interface TourMapProps {
  tourId: string
}

export function TourMap({ tourId }: TourMapProps) { 
    const [isExpanded, setIsExpanded] = useState(true)
    
    // 3. Tell useState that this is an array of 'Stop' objects
    const [stops, setStops] = useState<Stop[]>([]) 
    
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStops = async () => {
            if (!tourId) return;
            
            setIsLoading(true);
            
            // We can explicitly tell Supabase what the return data looks like, 
            // but usually TypeScript infers it. If not, the 'as' cast below handles it.
            const { data, error } = await supabase
                .from('stops')
                .select('id, name')
                .eq('tour_id', tourId)

            if (error) {
                console.error("Error fetching stops:", error)
            } else if (data) {
                // TypeScript now knows 'data' matches the 'Stop' shape
                setStops(data as Stop[])
            }
            setIsLoading(false);
        }

        fetchStops();
    }, [tourId])

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
                    className="flex items-center cursor-pointer gap-2 bg-[#f2f2f2] rounded-[40px] text-slate-800 px-4 py-2 font-medium transition-colors"
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
                    {isLoading ? (
                         <div className="text-sm text-gray-500 pl-2">Loading stops...</div>
                    ) : stops.length === 0 ? (
                         <div className="text-sm text-gray-500 pl-2">No stops found for this tour.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {stops.map((stop, index) => (
                                <div key={stop.id} className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <span className="text-gray-800 font-medium truncate">
                                        {stop.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default TourMap