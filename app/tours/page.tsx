'use client'

import React, { useMemo, useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ArrowRight, Clock, DollarSign, Leaf, Waves, Landmark, Mountain, Trees, MapPin, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import sortIcon from '@/public/icons/sort-icon.svg';
import searchIcon from '@/public/icons/search-icon.svg';

// ---- Mock data (replace with real data) ----
const TOURS = [
  {
    id: "gardens-st-joseph-1",
    title: "The Gardens of St. Joseph Circuit",
    durationHours: 4,
    priceUSD: 60,
    tags: ["Nature & Gardens"],
    cover: "/demo/gardens-1.jpg",
  },
  {
    id: "cliffs-coastlines-1",
    title: "Cliffs, Coastlines, & Canopies",
    durationHours: 4.5,
    priceUSD: 60,
    tags: ["Beach & Cliffs"],
    cover: "/demo/cliffs-1.jpg",
  },
  {
    id: "gardens-st-joseph-2",
    title: "The Gardens of St. Joseph Circuit",
    durationHours: 4,
    priceUSD: 60,
    tags: ["Nature & Gardens"],
    cover: "/demo/gardens-2.jpg",
  },
  {
    id: "cliffs-coastlines-2",
    title: "Cliffs, Coastlines, & Canopies",
    durationHours: 4.5,
    priceUSD: 60,
    tags: ["Beach & Cliffs"],
    cover: "/demo/cliffs-2.jpg",
  },
  {
    id: "gardens-st-joseph-3",
    title: "The Gardens of St. Joseph Circuit",
    durationHours: 4,
    priceUSD: 60,
    tags: ["Nature & Gardens"],
    cover: "/demo/gardens-3.jpg",
  },
];

const TAGS = [
    { label: "Nature & Gardens", icon: Leaf },
    { label: "Beach & Cliffs", icon: Waves },
    { label: "History & Heritage", icon: Landmark },
    { label: "Hiking & Trails", icon: Mountain },
    { label: "Forest & Canopy", icon: Trees },
];

const sorters = [
  { key: "featured", label: "Featured" },
  { key: "priceAsc", label: "Price: Low → High" },
  { key: "priceDesc", label: "Price: High → Low" },
  { key: "durationAsc", label: "Duration: Short → Long" },
  { key: "durationDesc", label: "Duration: Long → Short" },
];

export default function ToursPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-black">currently being worked on</h1>
    </div>
  );
}

function TourCard({
  tour,
}: {
  tour: {
    id: string;
    title: string;
    durationHours: number;
    priceUSD: number;
    tags: string[];
    cover: string;
  };
}) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-56 w-full">
        <Image
          alt={tour.title}
          src={tour.cover}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{tour.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center text-gray-600">
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>{tour.durationHours} hrs</span>
            </div>
            <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-800">{tour.priceUSD} USD</span>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tour.tags.map((tag) => {
            const tagInfo = TAGS.find(t => t.label === tag);
            const Icon = tagInfo ? tagInfo.icon : Leaf;
            return (
                <span key={tag} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                   <Icon className="h-4 w-4" />
                   {tag}
                </span>
            )
          })}
        </div>
        <button className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          Book Trip
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}


function Assurance({
    icon: Icon,
    title,
    desc,
  }: {
    icon: React.ElementType;
    title: string;
    desc: string;
  }) {
    return (
        <div className="flex flex-col items-center p-4">
             <div className="p-3 bg-blue-100 rounded-full mb-4">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-600 mt-1">{desc}</p>
        </div>
    );
  }