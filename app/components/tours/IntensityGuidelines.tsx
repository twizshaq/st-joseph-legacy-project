import { div } from '@tensorflow/tfjs'
import React from 'react'

// --- Custom Illustration Components (Unchanged) ---
const RelaxedWalker = ({ color }: { color: string }) => (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="50" r="18" fill={color} />
        <path d="M100 70 C 100 70, 90 90, 95 110 L 95 140 L 85 180" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M95 110 L 115 180" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 75 L 80 100 L 85 125" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 75 L 120 100 L 115 125" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="100" cy="185" rx="40" ry="4" fill={color} opacity="0.2" />
    </svg>
)

const BriskWalker = ({ color }: { color: string }) => (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="50" r="18" fill={color} />
        <path d="M110 70 C 110 70, 95 90, 90 110 L 75 140 L 55 180" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 110 L 120 140 L 145 180" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M110 75 L 80 95 L 60 85" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M110 75 L 130 95 L 150 85" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="100" cy="185" rx="55" ry="4" fill={color} opacity="0.2" />
    </svg>
)

const Hiker = ({ color }: { color: string }) => (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="105" cy="45" r="18" fill={color} />
        <path d="M105 65 C 105 65, 95 85, 100 105 L 80 135 L 60 175" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 105 L 130 125 L 135 160" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M105 70 L 135 90 L 155 80" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M105 70 L 75 90 L 65 120" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="150" y1="70" x2="160" y2="180" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M120 165 L 150 165 L 160 185 L 40 185" fill={color} opacity="0.15" />
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
    Illustration: React.FC<{ color: string }>
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
    return (
        <div
            className={`cursor-pointer rounded-[52px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[3px] active:scale-[.98] transition-transform hover:-translate-y-1 duration-300`}
            style={{
                background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                borderColor: borderColor,
            }}>
        <div
            className="w-full rounded-[50px] bg-white/80 p-4"
        >
            <div className="flex flex-row items-center gap-6 h-full">
                {/* Left Side: Illustration */}
                {/* Reduced size to w-28 (7rem) and ensured it doesn't shrink */}
                <div className="w-20 h-20 shrink-0 relative flex items-center justify-center">
                    <Illustration color={figureColor} />
                </div>

                {/* Right Side: Info */}
                <div className="flex-1 text-left">
                    {/* Badge moved inline */}
                    {/* <div 
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 bg-white/60 backdrop-blur-sm"
                        style={{ border: `1px solid ${accentColor}40` }}
                    >
                        <span className="text-xs font-black uppercase tracking-wider" style={{ color: figureColor }}>
                            Level
                        </span>
                        <span className="text-sm font-black" style={{ color: figureColor }}>
                            {level}
                        </span>
                    </div> */}

                    <h3
                        className="text-xl font-bold mb-1 leading-tight"
                        style={{ color: accentColor }}
                    >
                        {title}
                    </h3>

                    <p 
                        className="text-sm font-medium leading-snug mb-3 opacity-90"
                        style={{ color: accentColor }}
                    >
                        {description}
                    </p>

                    {/* Intensity Dots - Left Aligned */}
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= activeIcons ? '' : 'bg-transparent border'}`}
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
        </div>
    </div>
    )
}

export function IntensityGuidelines() {
    const levels = [
        {
            level: 1,
            title: 'Easy - Moderate',
            description: 'Primarily flat or paved surfaces; light walking.',
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
            description: 'Uneven surfaces, grass, or gravel; involves inclines.',
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
            description: 'Steep hills and trails; recommended for active guests.',
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
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    Choose Your Pace
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Plan your adventure based on physical effort and terrain:
                </p>
            </div>

            {/* Changed Grid to 1 column on small, 2 on medium, 3 on large */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {levels.map((levelData) => (
                    <IntensityCard key={levelData.level} {...levelData} />
                ))}
            </div>
        </section>
    )
}

export default IntensityGuidelines