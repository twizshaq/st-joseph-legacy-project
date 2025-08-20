// Create this new file, e.g., in `app/components/MapContainer.js`

"use client";

import { useState, useEffect } from 'react';
import MapFull from './MapFull';
import MapPanel from './MapPanel';

export default function MapContainer() {
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);

    // Fetch all listings data once when the component mounts
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('/data/listings.geojson');
                const data = await response.json();
                // We only need the features array for our lists and markers
                setListings(data.features);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            }
        };
        fetchListings();
    }, []);

    const handleListingSelect = (listing) => {
        setSelectedListing(listing);
    };

    const handleClosePanel = () => {
        setSelectedListing(null);
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <MapFull 
                listings={listings} 
                onListingSelect={handleListingSelect}
            />
            <MapPanel 
                // Note: MapPanel expects `sites`, so we pass listings to it.
                // It's a good idea to make prop names consistent later.
                sites={listings} 
                selectedListing={selectedListing}
                onClose={handleClosePanel}
            />
        </div>
    );
}