import React, { useState, useEffect } from 'react'
import { Navigation } from 'lucide-react'
import ArrowIcon from "@/public/icons/arrow-icon"
// IMPORT YOUR SUPABASE CLIENT
import { supabase } from '@/lib/supabaseClient'
import TourStopsMap from '@/app/components/tours/TourStopsMap'

// 1. Define what a "Stop" looks like
interface Stop {
    id: string
    name: string
    // Supabase nests related table data into an object named after the table
    location_pins: {
        latitude: number
        longitude: number
        pointimage: string
        colorhex: string
    }
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
            if (!tourId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            
            console.log("1. Fetching nested data for Tour ID:", tourId);

            const { data, error } = await supabase
                .from('stops')
                .select(`
                    id, 
                    name, 
                    location_pins (
                        latitude, 
                        longitude,
                        pointimage,
                        colorhex
                    )
                `)
                .eq('tour_id', tourId);

            if (error) {
                // This will tell us if your Foreign Key is broken
                console.error("🚨 SUPABASE ERROR:", error.message);
                console.error("Error details:", error.details);
            } else if (data) {
                console.log("2. RAW Data from database:", data);

                // TEMPORARY FIX: Stop filtering out the nulls so we can see the text list!
                // We will cast the data knowing that location_pins MIGHT be null right now
                setStops(data as unknown as Stop[]);
            }
            
            setIsLoading(false);
        }

        fetchStops();
    }, [tourId])

    return (
        <div className="bg-[#f2f2f2]/0 rounded-[40px] overflow-hidden/0 mb-8">
            {/* Header */}
            <div className="p-2 flex items-center justify-between bg-white/0">
                <div className="flex items-center gap-2">
                    {/* <Navigation className="w-6 h-6 text-black" /> */}
                    <h2 className="text-xl font-bold text-gray-900">Tour Locations</h2>
                </div>
                {/* <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center cursor-pointer gap-2 bg-[#f2f2f2] rounded-[40px] text-slate-800 px-4 py-2 font-medium transition-colors"
                >
                    {isExpanded ? 'Hide Stops' : 'Show Stops'}
                    {isExpanded ? (
                        <ArrowIcon className="rotate-0" color="#1E293B" />
                    ) : (
                        <ArrowIcon className="rotate-180" color="#1E293B" />
                    )}
                </button> */}
            </div>

            {isExpanded && (
                <div className="relative bg-red-500/0 overflow-hidden border-white border-[3px] shadow-[0px_10px_20px_rgba(0,0,0,0.09)] rounded-[40px]">
                    {/* <div className='absolute z-[20] bottom-[0px] rounded-b-[37px] bg-black/20 h-[200px] w-full [mask-image:linear-gradient(to_top,black_40%,transparent)]'/> */}
                    {stops.length > 0 && (
                        <div className="bg-red-500/0 rounded-[40px]">
                            <TourStopsMap 
                                // Flatten the data for the map component
                                stops={stops.map(stop => ({
                                    id: stop.id,
                                    name: stop.name,
                                    lat: stop.location_pins.latitude,
                                    lng: stop.location_pins.longitude,
                                    pointimage: stop.location_pins.pointimage
                                }))} 
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {/* {isExpanded && (
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
            )} */}
        </div>
    )
}

export default TourMap