import React from 'react'
import './style.css'

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                d="M15.833 10H4.167M4.167 10L10 15.833M4.167 10L10 4.167"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default function Error404Page() {
    return (
        <div className="min-h-screen w-full bg-white font-['Inter',sans-serif] overflow-hidden">
            <main className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-12 lg:py-0 gap-8 lg:gap-4">
                {/* Left Content */}
                <div className="flex flex-col justify-center max-w-xl lg:max-w-lg xl:max-w-xl z-10">
                    {/* Error Label */}
                    <p className="text-[#06B6D4] text-sm md:text-base font-semibold tracking-wider mb-4">
                        ERROR CODE: 404
                    </p>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-tight mb-6">
                        OOOPS!!
                    </h1>

                    {/* Subheading */}
                    <p className="text-2xl md:text-3xl text-gray-800 font-light leading-tight mb-10">
                        This is not the page you are looking for
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <a
                            href="/"
                            className="inline-block cursor-pointer rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-[.98]"
                        >
                            <span className="flex items-center gap-2 bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-6 py-3 text-white font-semibold">
                                <ArrowLeftIcon className="w-5 h-5" />
                                Go Back Home
                            </span>
                        </a>

                        <a
                            href="#"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-gray-600 font-semibold rounded-full border-2 border-gray-300 hover:border-gray-400 hover:text-gray-800 transition-all"
                        >
                            Contact Support
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200 mb-6"></div>

                    {/* Alternative Pages */}
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm font-medium">
                            Or try these pages:
                        </p>

                        <nav aria-label="Alternative pages">
                            <ul className="flex flex-wrap gap-6 md:gap-8">
                                <li>
                                    <a
                                        href="/all-sites"
                                        className="text-gray-700 text-sm font-semibold hover:text-black transition-colors"
                                    >
                                        Sites
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/about-us"
                                        className="text-gray-700 text-sm font-semibold hover:text-black transition-colors"
                                    >
                                        The DEO
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/team"
                                        className="text-gray-700 text-sm font-semibold hover:text-black transition-colors"
                                    >
                                        Team
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/virtual-map"
                                        className="text-gray-700 text-sm font-semibold hover:text-black transition-colors"
                                    >
                                        Virtual Map
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Graphic Image */}
                <div className="relative animate-float-slow">
                    <img
                        src="https://cdn.magicpatterns.com/uploads/8kQ9SDHePhkTxmPJUbRzpW/Screenshot_2026-02-01_104739.png"
                        alt="Astronaut floating in space with colorful 404 numbers"
                        className="w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] h-auto object-contain"
                    />
                </div>
            </main>
        </div>
    )
}
