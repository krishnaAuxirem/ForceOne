import { useEffect } from 'react';
import HeroSection from '@/components/features/home/HeroSection';
import FeaturesSection from '@/components/features/home/FeaturesSection';
import LiveTrackingSection from '@/components/features/home/LiveTrackingSection';
import TaskManagementSection from '@/components/features/home/TaskManagementSection';
import AttendanceExpenseSection from '@/components/features/home/AttendanceExpenseSection';
import StatsSection from '@/components/features/home/StatsSection';
import TestimonialsSection from '@/components/features/home/TestimonialsSection';
import PricingSection from '@/components/features/home/PricingSection';
import BlogPreviewSection from '@/components/features/home/BlogPreviewSection';
import ContactCTA from '@/components/features/home/ContactCTA';

export default function HomePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <LiveTrackingSection />
      <TaskManagementSection />
      <AttendanceExpenseSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <BlogPreviewSection />
      <ContactCTA />
    </main>
  );
}
