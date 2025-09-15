import { HeroSection } from '@/components/landing/hero-section';
import { DownloadSection } from '@/components/landing/download-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <HeroSection />
      <div id="download">
        <DownloadSection />
      </div>
      <FeaturesSection />
      <Footer />
    </main>
  );
}
