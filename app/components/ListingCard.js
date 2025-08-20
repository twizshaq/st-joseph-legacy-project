import React from 'react';

// A simple function to format the price
const formatPrice = (price) => {
    if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
    }
    if (price >= 1000) {
        return `$${Math.round(price / 1000)}K`;
    }
    return `$${price}`;
};

const ListingCard = ({ listing, onClose }) => {
    // Extract properties from the GeoJSON feature
    const {
        imageUrl,
        price,
        bedrooms,
        bathrooms,
        sqft,
        address
    } = listing.properties;

    return (
        // This outer div acts as a backdrop and a centering container
        <div 
            className="absolute inset-0 flex items-center justify-center p-4 z-20"
            onClick={onClose} // Close when clicking the backdrop
        >
            {/* This is the actual card. Stop propagation to prevent closing when clicking inside the card. */}
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Section */}
                <div className="relative">
                    <img src={imageUrl} alt={`View of ${address}`} className="w-full h-48 object-cover" />
                    <button 
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-white transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Info Section */}
                <div className="p-4">
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">${price.toLocaleString()}</p>
                    </div>
                    <div className="text-gray-600 mt-1">
                        <span>{bedrooms} bedrooms</span>
                        <span className="mx-2">&bull;</span>
                        <span>{bathrooms} bathrooms</span>
                        <span className="mx-2">&bull;</span>
                        <span>{sqft.toLocaleString()} ft²</span>
                    </div>
                    <div className="flex items-start gap-2 mt-3 text-gray-800">
                        {/* A simple location pin icon using SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p>{address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;