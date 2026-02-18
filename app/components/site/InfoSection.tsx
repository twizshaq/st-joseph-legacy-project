import React, { ReactNode } from 'react';
import { ContentSection } from '@/app/types/site';

interface InfoSectionProps {
    sections: ContentSection[];
    // history: ReactNode;
    sidebarSlot?: ReactNode;
}

export const InfoSection = ({ sections, sidebarSlot }: InfoSectionProps) => {
    return (
        <div className='flex flex-wrap bg-blue-500/0 gap-12 max-w-[1400px] mx-auto max-sm:w-[90vw] justify-between my-20'>
            <div className='max-w-[800px] flex flex-col gap-8'>

                {/* Main Content Area - Loops through all sections */}
                <div className="lg:col-span-2 space-y-10">

                    {sections.map((section, index) => (
                        <div key={index} className="content-block">
                            {/* Only render title if it's not empty string (optional) */}
                            {section.title && (
                                <h2 className="text-[1.8rem] max-sm:text-[1.6rem] text-blue-500 font-bold mb-4">{section.title}</h2>
                            )}
                            <div className="prose text-[1rem] leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    ))}

                </div>

            </div>

            {sidebarSlot && (
                <div className='col-span-1 xl:col-span-5 flex flex-col md:flex-row xl:flex-col gap-6 bg-red-500/0'>
                    {sidebarSlot}
                </div>
            )}
        </div>
    );
};
