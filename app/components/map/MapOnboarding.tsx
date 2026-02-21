"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to St Joseph Map!',
    description: 'Discover beautiful locations in St Joseph, Barbados. This quick tour will help you get started.',
    position: 'center',
  },
  {
    id: 'search',
    title: 'Search Locations',
    description: 'Search for specific places or filter by category using the search bar.',
    targetSelector: '[data-onboarding="search"]',
    position: 'bottom',
  },
  {
    id: 'markers',
    title: 'Explore Map Markers',
    description: 'Tap on any marker on the map to see details about that location.',
    targetSelector: '.mapboxgl-marker',
    position: 'right',
  },
  {
    id: '3d-toggle',
    title: '3D View Toggle',
    description: 'Switch between 2D and 3D views for a more immersive experience.',
    targetSelector: '[data-onboarding="3d-toggle"]',
    position: 'left',
  },
  {
    id: 'zoom',
    title: 'Zoom Controls',
    description: 'Use the zoom buttons to get closer or see more of the map.',
    targetSelector: '[data-onboarding="zoom"]',
    position: 'left',
  },
  {
    id: 'trip',
    title: 'Plan Your Trip',
    description: 'Create custom trips with multiple stops and export them to Apple or Google Maps.',
    targetSelector: '[data-onboarding="trip"]',
    position: 'top',
  },
  {
    id: 'like',
    title: 'Save Favorites',
    description: 'Like your favorite locations to save them for later.',
    targetSelector: '[data-onboarding="like"]',
    position: 'top',
  },
];

interface MapOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapOnboarding({ isOpen, onClose }: MapOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has disabled onboarding
    const savedPreference = localStorage.getItem('mapOnboardingDisabled');
    if (savedPreference === 'true' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    const step = ONBOARDING_STEPS[currentStep];

    if (step.targetSelector && step.position !== 'center') {
      // Try to find the target element
      const updatePosition = () => {
        const element = document.querySelector(step.targetSelector!);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          let top = 0;
          let left = 0;

          switch (step.position) {
            case 'top':
              top = rect.top - 180;
              left = rect.left + rect.width / 2 - 150;
              break;
            case 'bottom':
              top = rect.bottom + 20;
              left = rect.left + rect.width / 2 - 150;
              break;
            case 'left':
              top = rect.top + rect.height / 2 - 80;
              left = rect.left - 320;
              break;
            case 'right':
              top = rect.top + rect.height / 2 - 80;
              left = rect.right + 20;
              break;
          }

          // Ensure tooltip stays within viewport
          if (left < 10) left = 10;
          if (left + 300 > viewportWidth - 10) left = viewportWidth - 310;
          if (top < 10) top = 10;
          if (top + 160 > viewportHeight - 10) top = viewportHeight - 170;

          setTooltipPosition({ top, left });
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    } else if (step.position === 'center') {
      // Center the tooltip for welcome screen
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 175,
      });
    }
  }, [currentStep, isOpen, mounted]);

  const handleNext = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleFinish = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem('mapOnboardingDisabled', 'true');
    }
    onClose();
    setCurrentStep(0);
  }, [dontShowAgain, onClose]);

  const handleSkip = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem('mapOnboardingDisabled', 'true');
    }
    onClose();
    setCurrentStep(0);
  }, [dontShowAgain, onClose]);

  if (!isOpen || !mounted) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isCenter = step.position === 'center';
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const tooltipContent = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Highlight effect for non-center steps */}
      {!isCenter && step.targetSelector && (
        <div
          className="absolute transition-all duration-300"
          style={{
            top: 'var(--highlight-top, 0)',
            left: 'var(--highlight-left, 0)',
            width: 'var(--highlight-width, 0)',
            height: 'var(--highlight-height, 0)',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        className={`absolute transition-all duration-300 ease-out ${
          isCenter ? 'animate-in fade-in zoom-in-95' : ''
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '300px',
        }}
      >
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[24px] p-5 shadow-2xl border border-white/10">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= currentStep ? 'bg-blue-500 w-6' : 'bg-white/20 w-3'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-white/50 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="mb-5">
            <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
          </div>

          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-white/60 text-xs">Don't show this again</span>
          </label>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 text-white/70 text-sm font-medium transition-colors ${
                currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'
              }`}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors active:scale-95"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Arrow pointer */}
        {!isCenter && (
          <div
            className="absolute w-4 h-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rotate-45 border-l border-b border-white/10"
            style={{
              ...getArrowPosition(step.position, tooltipPosition),
            }}
          />
        )}
      </div>
    </div>
  );

  return createPortal(tooltipContent, document.body);
}

function getArrowPosition(position: string, tooltipPos: { top: number; left: number }) {
  switch (position) {
    case 'top':
      return { top: '100%', left: '50%', marginLeft: '-8px', marginTop: '-4px' };
    case 'bottom':
      return { bottom: '100%', left: '50%', marginLeft: '-8px', marginBottom: '-4px', transform: 'rotate(225deg)' };
    case 'left':
      return { top: '50%', left: '100%', marginTop: '-8px', marginLeft: '-4px', transform: 'rotate(-45deg)' };
