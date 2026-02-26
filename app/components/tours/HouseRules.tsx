import React from 'react';
// import Image from "next/image"; // No longer needed
// import houseIcon from '@/public/icons/house-icon.svg'; // No longer needed
import { 
    Check, 
    X, 
    MountainSnow, 
    AlertTriangle, 
    Footprints, 
    CheckCircle2, 
    XCircle 
} from 'lucide-react';

const rulesData = [
    { 
        title: "Physical Requirements & Accessibility", 
        icon: <MountainSnow size={30} className="text-slate-700" />,
        description: <>St. Joseph is hilly. Guests should be comfortable walking on slopes, grass, and unpaved, sometimes muddy paths.</> 
    },
    { 
        title: "Limited Accessibility", 
        icon: <AlertTriangle size={30} className="text-slate-700" />,
        description: <>Due to the geological nature of St. Joseph (steep ridges and natural trails), not all sites offer complete wheelchair access. Please check the specific Tour Descriptions for accessibility ratings or contact us for tailored arrangements.</> 
    },
    { 
        title: "Dress Code ", 
        icon: <Footprints size={30} className="text-slate-700" />,
        description: <>Closed-toe shoes with good grip (sneakers or hiking sandals) are highly recommended.</> 
    },
    { 
        title: "What is Included", 
        icon: <CheckCircle2 size={30} className="text-slate-700" />,
        description: <><Check size={18} className="text-green-500 inline" /> Expert Local Guide | <Check size={18} className="text-green-500 inline" /> All Entry Fees</> 
    },
    { 
        title: "What is Not Included", 
        icon: <XCircle size={30} className="text-slate-700" />,
        description: <><X size={18} className="text-red-500 inline" /> Lunch Costs | <X size={18} className="text-red-500 inline" /> Gratuities | <X size={18} className="text-red-500 inline" /> Hotel Pickup (Available for extra cost)</> 
    },
];

const HouseRules = () => {
    // Shared card style to reduce code duplication
    const cardStyle = "bg-white/10 flex-1 flex flex-col items-center rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-[2px] overflow-hidden transform hover:scale-105 duration-300";

    // Inner container style
    const innerStyle = "bg-black/3 gap-[10px] p-[25px] flex flex-col items-start w-[100%] h-[100%] rounded-[43px]";

    return (
        <div className="w-[1500px] max-w-[90vw] mt-[100px]">
            <div className="flex flex-col mb-[30px]">
                <p className="font-[700] text-[1.75rem]">Things to Know, Before you go</p>
                <p className="max-w-[600px]">Please review these details to ensure you have the best experience in the St Joseph</p>
            </div>

            {/* Overall Container: Flex Column */}
            <div className="flex flex-col gap-[30px]">

                {/* Top Row: First 2 Items */}
                <div className="flex justify-between gap-[30px] max-md:flex-col">
                    {rulesData.slice(0, 2).map((rule, i) => (
                        <div key={i} className={cardStyle}>
                            <div className={innerStyle}>
                                {/* Render the specific icon component */}
                                {rule.icon}
                                <p className="text-slate-700 font-[600] text-[1.1rem] mt-1">{rule.title}</p>
                                <p className="leading-relaxed text-slate-700">{rule.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Row: Remaining 3 Items */}
                <div className="flex justify-between gap-[30px] max-md:flex-col">
                    {rulesData.slice(2).map((rule, i) => (
                        <div key={i} className={cardStyle}>
                            <div className={innerStyle}>
                                {/* Render the specific icon component */}
                                {rule.icon}
                                <p className="text-slate-700 font-[600] text-[1.1rem] mt-1">{rule.title}</p>
                                <p className="leading-relaxed text-slate-700">{rule.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HouseRules;