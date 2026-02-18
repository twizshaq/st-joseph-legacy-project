import React from 'react';
import Image from "next/image";
import houseIcon from '@/public/icons/house-icon.svg';
import { Check, X } from 'lucide-react';

const rulesData = [

    { title: "Physical Requirements & Accessibility", description: <><b> Uneven Terrain:</b> St. Joseph is hilly. Guests should be comfortable walking on slopes, grass, and unpaved, sometimes muddy paths.</> },
    { title: "Dress Code ", description: <><b>Footwear:</b> Closed-toe shoes with good grip (sneakers or hiking sandals) are highly recommended.</> },
    { title: "What is Included", description: <><Check size={18} className="text-green-500 inline" /> Expert Local Guide | <Check size={18} className="text-green-500 inline" /> All Entry Fees</> },
    { title: "What is Not Included", description: <><X size={18} className="text-red-500 inline" /> Lunch Costs | <X size={18} className="text-red-500 inline" /> Gratuities | <X size={18} className="text-red-500 inline" /> Hotel Pickup (Available for extra cost)</> },
];

const HouseRules = () => {
    return (
        <div className="w-[1500px] max-w-[90vw] mt-[100px]">
            <div className="flex flex-col mb-[30px]">
                <p className="font-[700] text-[1.75rem]">Things to Know, Before you go</p>
                <p className="max-w-[600px]">Please review these details to ensure you have the best experience in the St Joseph</p>
            </div>

            <div className="flex justify-between gap-[30px] max-ttk-wrap2:flex-wrap max-ttk-wrap:justify-start max-sm:gap-y-[30px]">
                {rulesData.map((rule, i) => (
                    <div key={i} className="bg-white/10 max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center rounded-[45px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-[2px] overflow-hidden transform hover:scale-105 duration-300">
                        <div className="bg-black/3 gap-[3px] p-[15px] flex flex-col items-center w-[100%] h-[100%] rounded-[43px]">
                            <Image src={houseIcon} alt="icon" height={30} className="opacity-70" />
                            <p className="text-[#656565] text-center font-[600] text-[1.1rem] mt-1">{rule.title}</p>
                            <p className="text-center max-w-[300px] text-sm leading-relaxed text-gray-600">{rule.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HouseRules;
