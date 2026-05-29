"use client";

import { useReveal } from '@/utils/useReveal';
import SectionHeader from './SectionHeader';
import PricingCard from './PricingCard';
import { Zap } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: 0,
    tagline: 'For getting started',
    features: [
      '10 job applications',
      'Basic tracking',
      '3 AI matches/month',
      '7-day follow-up reminders',
    ],
    highlighted: false,
    ctaText: 'Start Free Beta',
  },
  {
    name: 'Pro',
    price: 9,
    tagline: 'Ideal for active job seekers',
    features: [
      'Unlimited applications',
      'Full AI Resume Matcher',
      'Analytics dashboard',
      'Unlimited notes',
      'Priority support',
    ],
    highlighted: true,
    Icon: Zap,
    ctaText: 'Join Pro Beta (Free)',
  },
  {
    name: 'Teams',
    price: 29,
    tagline: 'For career coaches & agencies',
    features: [
      'Everything in Pro',
      'Multiple candidate profiles',
      'Team dashboard',
      'Dedicated support',
      'API access',
    ],
    highlighted: false,
    ctaText: 'Join Teams Beta (Free)',
  },
];

export default function PricingSection() {
  const ref = useReveal();

  return (
    <section id="pricing" className="section-gap">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Pricing Plans"
          title="Simple, honest pricing"
        />

        {/* Beta Phase Announcement Alert */}
        <div className="max-w-2xl mx-auto mb-10 overflow-hidden bg-gradient-to-r from-cyan-50/70 via-blue-50/50 to-indigo-50/70 border border-blue-100 rounded-2xl p-4 flex items-center justify-center text-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold text-blue-900 leading-none">
              ApplyAI Open Beta Phase: All premium Pro & Teams capabilities are currently 100% unlocked and free!
            </span>
          </div>
        </div>

        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <PricingCard
              key={i}
              name={tier.name}
              price={tier.price}
              tagline={tier.tagline}
              features={tier.features}
              highlighted={tier.highlighted}
              Icon={tier.Icon}
              ctaText={tier.ctaText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
