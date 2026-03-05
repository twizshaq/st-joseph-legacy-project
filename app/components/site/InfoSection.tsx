import React, { ReactNode } from 'react';
import { ContentSection } from '@/app/types/site';

interface InfoSectionProps {
    sections: ContentSection[];
    sidebarSlot?: ReactNode;
}

export const InfoSection = ({ sections, sidebarSlot }: InfoSectionProps) => {
    return (
        <section className='mx-auto w-full max-w-[1400px] px-[3vw] my-12 lg:my-20'>
            {/* 
                Main Grid Container:
                - 1 column on mobile/tablet (stacking)
                - 12 columns on desktop for fine control
                - Adjust gap for screen size
            */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:flex xl:justify-between">
                
                {/* Main Content Area: Spans 8 columns on large screens */}
                <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-10">
                    {sections.map((section, index) => (
                        <div key={index} className="content-block">
                            {section.title && (
                                <h2 className="text-2xl md:text-3xl lg:text-[1.8rem] text-blue-500 font-bold mb-4 tracking-tight">
                                    {section.title}
                                </h2>
                            )}
                            <div className="prose prose-blue max-w-none text-slate-700 leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Area: Spans 5 columns on lg, 4 on xl */}
                {sidebarSlot && (
                    <aside className="lg:col-span-5 xl:col-span-5">
                        <div className="sticky top-8 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-6">
                            {/* 
                                Sticky top ensures the sidebar stays visible while scrolling.
                                The nested grid (sm:grid-cols-2) allows sidebar items to sit 
                                side-by-side on tablet before stacking again on desktop.
                            */}
                            {sidebarSlot}
                        </div>
                    </aside>
                )}
            </div>
        </section>
    );
};