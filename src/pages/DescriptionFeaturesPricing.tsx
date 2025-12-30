import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Brain, Moon, Sun } from 'lucide-react';
import ThemeContextMain, { ThemeProviderMain } from './../context/ThemeContextMain';
import { System } from './../config/constants';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContextMain);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isInitiallyMobile, setIsInitiallyMobile] = useState<boolean>(
    window.innerWidth < System.MobileWidth
  );
  const [isMobileNavActive, setIsMobileNavActive] = useState<boolean>(
    window.innerWidth < System.MobileWidth
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileNavActive(!isMobileNavActive);
  };

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < System.MobileWidth;
      setIsInitiallyMobile(isCurrentlyMobile);
      if (!isCurrentlyMobile && isMobileNavActive) {
        setIsMobileNavActive(false);
        setIsMobileMenuOpen(false);
      } else if (isCurrentlyMobile && !isMobileNavActive && isMobileMenuOpen) {
        setIsMobileNavActive(true);
      } else if (isCurrentlyMobile && isInitiallyMobile) {
        setIsMobileNavActive(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileNavActive, isInitiallyMobile, isMobileMenuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 rounded-lg transition-colors flex items-center ${
      isMobileMenuOpen || isMobileNavActive ? 'w-full' : 'px-4'
    } ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  return (
    <header
      className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} p-4`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold">{System.Content.Title}</h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition dark:text-gray-400 dark:hover:text-gray-500 dark:focus:bg-gray-800 md:hidden"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            className="hidden h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <nav
          className={`items-center gap-4 ${isMobileMenuOpen && isMobileNavActive ? 'flex-col' : 'hidden'} md:flex`}
        >
          <NavLink to="/signin" className={navLinkClass}>
            Sign In
          </NavLink>
          <button
            onClick={toggleTheme}
            className={`group relative flex justify-center border border-transparent text-sm font-medium rounded-md bg-white text-blue-500 dark:text-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ${isMobileMenuOpen && isMobileNavActive ? 'w-full py-6' : ''}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

const WelcomeSection = () => {
  const { theme } = useContext(ThemeContextMain);
  return (
    <section
      className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} container mx-auto p-8`}
    >
      <h2 className="text-4xl font-bold mb-4">Track Your Migraines, Take Control of Your Life</h2>
      <p className="text-lg mb-6">
        Welcome to The Migraine Tracker: Your Path to Migraine Understanding
      </p>
    </section>
  );
};

const IntroSection = () => {
  const { theme } = useContext(ThemeContextMain);
  return (
    <section
      className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} container mx-auto p-8 m-5`}
    >
      <p className="text-medium mb-6">
        Are you tired of migraines disrupting your life? The Migraine Tracker is a groundbreaking
        online application that empowers you to take control. We go beyond basic headache diaries,
        providing you with a comprehensive platform to track, analyze, and understand the intricate
        factors that contribute to your migraines.
      </p>
    </section>
  );
};

const FeaturesSection = () => {
  const { theme } = useContext(ThemeContextMain);
  return (
    <section
      className={`bg-${theme === 'light' ? 'blue-500 text-black-500' : 'gray-800 text-gray-300'} container mx-auto p-8`}
    >
      <h2
        className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800'} text-4xl font-bold mb-4`}
      >
        Key Features at a Glance:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-3 dark:text-black">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Holistic Data Tracking</h3>
          <p>
            Log incidents, triggers, symptoms, medications, weather, solar activity, sleep, blood
            pressure, heart rate, stress, and biorhythms.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Automated Weather and Solar Data</h3>
          <p>Seamlessly integrates detailed weather and geomagnetic data for your location.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Personalized Insights</h3>
          <p>
            Discover hidden patterns and correlations through intuitive visualizations and advanced
            analytics.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Predictive Capabilities</h3>
          <p>
            Explore potential triggers and anticipate future migraines with our intelligent
            algorithms.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Secure and User-Friendly</h3>
          <p>Your data is safe, and our interface is designed for effortless navigation.</p>
        </div>
      </div>
    </section>
  );
};

const CallToActionSection = () => {
  const { theme } = useContext(ThemeContextMain);
  return (
    <section
      className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} container mx-auto p-8 text-white text-center mt-5 mb-5`}
    >
      <h2 className="text-3xl font-bold mb-4">
        Start your journey to migraine mastery today! Sign up for a free trial and experience the
        difference of The Migraine Tracker.
      </h2>
      <Link
        to="/signin"
        className="bg-white text-blue-500 py-2 px-6 rounded-lg font-bold hover:bg-blue-100"
      >
        Sign In
      </Link>
    </section>
  );
};

const Footer = () => {
  const { theme } = useContext(ThemeContextMain);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} shadow-sm mt-auto`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm dark:text-gray-400">
            © {currentYear} Migraine Tracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function DescriptionFeaturesPricing() {
  return (
    <ThemeProviderMain>
      <div className="bg-gary-200 dark:bg-gray-800">
        <Header />
        <WelcomeSection />
        <IntroSection />
        <FeaturesSection />
        <CallToActionSection />
        <Footer />
      </div>
    </ThemeProviderMain>
  );
}
