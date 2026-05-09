import { useReveal } from '@/hooks/useReveal';
import SectionHeader from '../ui/SectionHeader';
import PricingCard from '../ui/PricingCard';
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
    ctaText: 'Get started',
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
    ctaText: 'Get started',
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
    ctaText: 'Contact us',
  },
];

export default function PricingSection() {
  const ref = useReveal();

  return (
    <section id="pricing" className="section-gap">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Pricing"
          title="Simple, honest pricing"
        />

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
