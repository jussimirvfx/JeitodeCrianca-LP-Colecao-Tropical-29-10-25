import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useMetaPixel } from '@jussimirvfx/meta-pixel-tracking';
import Header from './components/Header';
import TopBanner from './components/TopBanner';

// Lazy load components below the fold for better initial load performance
const Advantages = lazy(() => import('./components/Advantages'));
const Collections = lazy(() => import('./components/Collections'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const HowToBecomePartner = lazy(() => import('./components/HowToBecomePartner'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Footer = lazy(() => import('./components/Footer'));

const App: React.FC = () => {
  const { trackPageView, trackCustomEvent } = useMetaPixel();
  const [scrollTracked, setScrollTracked] = useState({
    scroll25: false,
    scroll50: false,
    scroll75: false,
    scroll90: false,
  });

  useEffect(() => {
    // Disparar PageView ao carregar a página
    trackPageView();
    console.log('📄 PageView disparado via Meta Pixel Package');
  }, [trackPageView]);

  useEffect(() => {
    // Tracking de scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track 25% scroll
      if (scrollPercentage >= 25 && !scrollTracked.scroll25) {
        trackCustomEvent('Scroll', { 
          scroll_depth: '25%',
          content_name: 'Landing Page - Jeito de Criança',
          content_category: 'Engagement'
        });
        console.log('📊 Scroll 25% disparado via Meta Pixel');
        setScrollTracked(prev => ({ ...prev, scroll25: true }));
      }

      // Track 50% scroll
      if (scrollPercentage >= 50 && !scrollTracked.scroll50) {
        trackCustomEvent('Scroll', { 
          scroll_depth: '50%',
          content_name: 'Landing Page - Jeito de Criança',
          content_category: 'Engagement'
        });
        console.log('📊 Scroll 50% disparado via Meta Pixel');
        setScrollTracked(prev => ({ ...prev, scroll50: true }));
      }

      // Track 75% scroll
      if (scrollPercentage >= 75 && !scrollTracked.scroll75) {
        trackCustomEvent('Scroll', { 
          scroll_depth: '75%',
          content_name: 'Landing Page - Jeito de Criança',
          content_category: 'Engagement'
        });
        console.log('📊 Scroll 75% disparado via Meta Pixel');
        setScrollTracked(prev => ({ ...prev, scroll75: true }));
      }

      // Track 90% scroll
      if (scrollPercentage >= 90 && !scrollTracked.scroll90) {
        trackCustomEvent('Scroll', { 
          scroll_depth: '90%',
          content_name: 'Landing Page - Jeito de Criança',
          content_category: 'Engagement'
        });
        console.log('📊 Scroll 90% disparado via Meta Pixel');
        setScrollTracked(prev => ({ ...prev, scroll90: true }));
      }
    };

    // Adicionar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTracked, trackCustomEvent]);

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="py-12 md:py-24 bg-gray-50 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white text-gray-800 font-sans">
      <TopBanner />
      <Header />
      <main>
        <Suspense fallback={<LoadingFallback />}>
        <Advantages />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
        <Collections />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
        <AboutUs />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
        <HowToBecomePartner />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
        <Testimonials />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
        <ContactForm />
        </Suspense>
      </main>
      <Suspense fallback={null}>
      <Footer />
      </Suspense>
    </div>
  );
};

export default App;
