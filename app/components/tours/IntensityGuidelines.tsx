import React, { useState } from 'react'
// --- Custom Illustration Components ---
const RelaxedWalker = ({ color }: { color: string }) => (
    <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Head */}
        <circle cx="100" cy="50" r="18" fill={color} />
        {/* Body - Upright and relaxed */}
        <path
            d="M100 70 C 100 70, 90 90, 95 110 L 95 140 L 85 180"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M95 110 L 115 180"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Arms - Relaxed at side */}
        <path
            d="M100 75 L 80 100 L 85 125"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M100 75 L 120 100 L 115 125"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Ground shadow */}
        <ellipse cx="100" cy="185" rx="40" ry="4" fill={color} opacity="0.2" />
    </svg>
)
const BriskWalker = ({ color }: { color: string }) => (
    <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Head - Slightly forward */}
        <circle cx="110" cy="50" r="18" fill={color} />
        {/* Body - Leaning forward */}
        <path
            d="M110 70 C 110 70, 95 90, 90 110 L 75 140 L 55 180"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M90 110 L 120 140 L 145 180"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Arms - Swinging */}
        <path
            d="M110 75 L 80 95 L 60 85"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M110 75 L 130 95 L 150 85"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Ground shadow */}
        <ellipse cx="100" cy="185" rx="55" ry="4" fill={color} opacity="0.2" />
    </svg>
)
const Hiker = ({ color }: { color: string }) => (
    <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Head */}
        <circle cx="105" cy="45" r="18" fill={color} />
        {/* Body - Dynamic climbing pose */}
        <path
            d="M105 65 C 105 65, 95 85, 100 105 L 80 135 L 60 175"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* High step leg */}
        <path
            d="M100 105 L 130 125 L 135 160"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Arms - Reaching/Using pole */}
        <path
            d="M105 70 L 135 90 L 155 80"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M105 70 L 75 90 L 65 120"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Hiking Pole */}
        <line
            x1="150"
            y1="70"
            x2="160"
            y2="180"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
        />
        {/* Ground/Rock hint */}
        <path
            d="M120 165 L 150 165 L 160 185 L 40 185"
            fill={color}
            opacity="0.15"
        />
    </svg>
)
// --- Components ---
interface IntensityCardProps {
    level: number
    title: string
    description: string
    activeIcons: number
    gradientFrom: string
    gradientTo: string
    accentColor: string
    figureColor: string
    borderColor: string
    Illustration: React.FC<{
        color: string
    }>
}
const IntensityCard = ({
    level,
    title,
    description,
    activeIcons,
    gradientFrom,
    gradientTo,
    accentColor,
    figureColor,
    borderColor,
    Illustration,
}: IntensityCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className="w-full rounded-[2.5rem] p-6 md:p-8 shadow-lg flex flex-col h-full relative overflow-hidden transition-transform hover:-translate-y-1 duration-300 border-8"
            style={{
                background: `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                borderColor: borderColor,
            }}
        >
            {/* Level Badge */}
            <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-1.5 rounded-full b/g-white/90 backdrop-blur-sm shadow-sm flex items-center gap-2"
                    style={{
                        backgroundColor: borderColor + '80',
                        border: `2px dashed ${accentColor}`,
                    }}>
                    <span
                        className="text-lg font-black uppercase tracking-wider"
                        style={{
                            color: figureColor,
                        }}
                    >
                        Level
                    </span>
                    <span
                        className="text-lg font-black"
                        style={{
                            color: figureColor,
                        }}
                    >
                        {level}
                    </span>
                </div>
            </div>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-6 right-6 z-10 md:hidden bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white/95 transition-colors"
                aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
            >
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: figureColor }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Illustration Area */}
            <div className="flex-1 flex items-center justify-center py-8 min-h-[220px]">
                <div className="w-48 h-48 relative">
                    <Illustration color={figureColor} />
                </div>
            </div>

            {/* Content Area - Collapsible on Mobile */}
            <div className={`relative z-10 md:block ${isExpanded ? 'block' : 'hidden'}`}>
                {/* Divider */}
                <div className="w-12 h-1 bg-black/10 rounded-full mb-6 mx-auto"></div>

                <h3
                    className="text-xl font-bold mb-3 text-center"
                    style={{
                        color: accentColor,
                    }}
                >
                    {title}
                </h3>

                <p className="text-center leading-relaxed mb-6 font-medium opacity-90"
                    style={{
                        color: accentColor,
                    }}>
                    {description}
                </p>

                {/* Intensity Dots */}
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i <= activeIcons ? '' : 'bg-transparent border-2'}`}
                            style={{
                                backgroundColor: i <= activeIcons ? figureColor : 'transparent',
                                borderColor: figureColor,
                                opacity: i <= activeIcons ? 1 : 0.3,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
export function IntensityGuidelines() {
    const levels = [
        {
            level: 1,
            title: 'Easy - Moderate',
            description:
                'Primarily flat or paved surfaces; light walking.',
            activeIcons: 1,
            gradientFrom: '#E8F5E9',
            gradientTo: '#C8E6C9',
            accentColor: '#2E7D32',
            figureColor: '#1B5E20',
            borderColor: '#FFFFFF',
            Illustration: RelaxedWalker,
        },
        {
            level: 2,
            title: 'Moderate',
            description:
                'Uneven surfaces, grass, or gravel; involves inclines.',
            activeIcons: 3,
            gradientFrom: '#FFF3E0',
            gradientTo: '#FFE0B2',
            accentColor: '#E65100',
            figureColor: '#BF360C',
            borderColor: '#FFFFFF',
            Illustration: BriskWalker,
        },
        {
            level: 3,
            title: 'Strenuous',
            description:
                'Steep hills and trails; recommended for active guests.',
            activeIcons: 5,
            gradientFrom: '#FFEBEE',
            gradientTo: '#FFCDD2',
            accentColor: '#C62828',
            figureColor: '#B71C1C',
            borderColor: '#FFFFFF',
            Illustration: Hiker,
        },
    ]
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24 font-sans bg-white">
            {/* Header Section */}
            <div className="text-center mb-20 space-y-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Choose Your Pace
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    To help you plan your adventure, we have rated our tours based on the physical effort required and the nature of the St. Joseph terrain:
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
                {levels.map((levelData) => (
                    <IntensityCard key={levelData.level} {...levelData} />
                ))}
            </div>
        </section>
    )
}

export default IntensityGuidelines
