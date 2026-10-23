import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroConnections from '@/components/HeroConnections';
import networkDesktop from '@/assets/hero-network-2026.webp';
import networkMobile from '@/assets/hero-network-mobile-2026.webp';
import './HomeHero.css';

function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.05 });
  const reducedMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const syncVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, []);

  const playing = !reducedMotion && isInView && pageVisible;

  return (
    <section
      ref={sectionRef}
      className="home-hero"
      aria-labelledby="home-hero-title"
      data-motion={playing ? 'playing' : 'paused'}
    >
      <div className="home-hero__artwork">
        <picture>
          <source media="(max-width: 768px)" srcSet={networkMobile} />
          <img
            src={networkDesktop}
            width="1672"
            height="941"
            alt="Watercolour of independent concierge practices across the Bay Area, with the San Francisco skyline and Bay Bridge beyond"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
        <div id="home-hero-animation" className="home-hero__motion" aria-hidden="true">
          <HeroConnections format="desktop" playing={playing} />
          <HeroConnections format="mobile" playing={playing} />
        </div>
      </div>
      <div className="home-hero__scrim" aria-hidden="true" />

      <div className="home-hero__inner">
        <div className="home-hero__copy">
          <h1 id="home-hero-title" className="home-hero__title">
            <span>Empowering physicians,</span>
            <span>preserving autonomy.</span>
          </h1>
          <p className="hero-text home-hero__description">
            We give independent concierge medicine practices the financial and operational backing of a
            large group, while patient relations stay with the physicians, exactly
            where they belong.
          </p>
          <div className="home-hero__actions">
            <Link to="/be-a-partner" className="home-hero__link">
              Become a Partner <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/about" className="home-hero__link home-hero__link--secondary">
              About Blue Angel <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
