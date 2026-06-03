"use client";

import { useReveal } from '@/utils/useReveal';
import SectionHeader from './ui/SectionHeader';
import TestimonialCard from './ui/TestimonialCard';
import Card from '../ui/Card';

const testimonials = [
  {
    name: 'Marcus T.',
    role: 'Software Engineer',
    quote: 'I went from sending 40 applications into the void to knowing exactly which ones to follow up on. The AI match score changed how I tailor every resume.',
    color: '#2563EB',
  },
  {
    name: 'Priya K.',
    role: 'Product Manager',
    quote: "The analytics section showed me I was ignoring follow-ups for 2 weeks. Fixed that habit in one week.",
    color: '#06B6D4',
  },
  {
    name: 'Jordan L.',
    role: 'UX Designer',
    quote: "Being able to paste a job description and instantly see what's missing from my resume is a superpower.",
    color: '#8B5CF6',
  },
  {
    name: 'Aisha R.',
    role: 'Data Analyst',
    quote: 'Went from 0 callbacks to 4 interviews in 3 weeks. Honestly unbelievable.',
    color: '#22C55E',
  },
  {
    name: 'Daniel F.',
    role: 'Freelance Dev',
    quote: "The Kanban board alone is worth it — finally a system that matches how my brain works.",
    color: '#F59E0B',
  },
];

export default function TestimonialsSection() {
  const ref = useReveal();

  return (
    <section className="section-gap bg-gradient-to-b from-[var(--bg-page)] to-[var(--bg-surface)]">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Testimonials"
          title="Job seekers are landing roles faster"
        />

        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              name={t.name}
              role={t.role}
              quote={t.quote}
              avatarColor={t.color}
            />
          ))}

          {/* Video thumbnail card */}
          <Card hover className="overflow-hidden flex flex-col">
            <div className="bg-[#0F172A] flex-1 min-h-[160px] flex flex-col items-center justify-center gap-3 relative p-6">
              {/* Play button */}
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <span className="text-white/80 text-sm font-medium">Watch success story</span>
              <span className="text-white/40 text-xs">2:34</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
