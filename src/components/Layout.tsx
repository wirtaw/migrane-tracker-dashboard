import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ThemeProvider } from '../context/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
