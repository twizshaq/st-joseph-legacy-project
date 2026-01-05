"use client";
import React from 'react';
import { TeamMember } from "@/app/types/about"; // Adjust import path as needed

// Data Definitions
const executiveOfficers: TeamMember[] = [
  { role: 'Chairperson', name: 'Matthew Alleyne' },
  { role: 'Deputy Chairperson', name: 'Tricia Gill' },
  { role: 'Secretary', name: 'Anjelica Catling' },
  { role: 'Treasurer', name: 'Karen Armstrong' },
];

const specialistLeads: TeamMember[] = [
  { role: 'First Aid', name: 'Moreen Smith' },
  { role: 'Damage Assessment', name: 'Harriet Clarke' },
  { role: 'Communications', name: 'Shaun Maynard' },
  { role: 'Shelter Officer', name: 'Edwin Greene' },
  { role: 'Road Clearance', name: 'Sharon Mayers' },
  { role: 'Vulnerable Persons', name: 'Olivia Philips' },
];

const AboutLeadership = () => {
  return (
    <section className="py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2 mt-5 text-slate-900">Executive Committee</h2>
          <p className="text-blue-600 font-medium tracking-wide">2024 – 2026 Term</p>
        </div>

        {/* Officers (Featured Grid) */}
        <div className="gap-10 mb-16 flex flex-wrap justify-center">
          {executiveOfficers.map((member, idx) => (
            <div key={idx} className="rounded-2xl text-center">
              <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold mb-16 mt-30 text-center text-slate-800">Specialist Leads</h3>
        
        {/* Specialists (Compact List) */}
        <div className="flex flex-wrap gap-y-7 gap-x-15 bg-green-500/0 justify-center">
          {specialistLeads.map((member, idx) => (
            <div key={idx} className="group flex flex-col items-center w-fit gap-4 text-center">
              <div>
                  <h4 className="font-bold text-slate-800">{member.name}</h4>
                  <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutLeadership;