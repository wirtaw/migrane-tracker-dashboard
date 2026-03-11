# 🌤 Migraine Tracker Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A serene, responsive, and intuitive React dashboard that visualizes complex
health and environmental data to empower users with chronic migraines.

This is the frontend client for the
[Migraine Tracker Monolith API](https://github.com/wirtaw/migraine-tracker-monolith).
It transforms deep analytical data into accessible, easy-to-read daily insights.

Full documentation [here](https://wirtaw.github.io/migraine-tracker-docs/)

## ✨ Key Features

- **📊 Wellness Dashboard:** A customizable view featuring interactive widgets
  for Solar Flux, UV Index, Geo-Magnetic data, and daily risk forecasts.
- **📈 Advanced Visualization:** Clean, responsive charts displaying biorhythms
  alongside historical weather trends and user incident data.
- **📓 Frictionless Logging:** Easy-to-use forms for logging daily health
  metrics, specific migraine incidents, triggers, and medication routines.
- **🌙 Serene UI/UX:** Built with Tailwind CSS and full light/dark mode support
  to ensure the app is gentle on the eyes (especially during a migraine attack).

## 🏗 Project Structure

- `src/components`: Reusable UI elements, including specialized `widgets` and
  `charts`.
- `src/pages`: Main routing views (Dashboard, Settings, ReportPage, etc.).
- `src/services`: API hooks and fetch utilities communicating with the NestJS
  backend.
- `src/context`: Global state management for Themes, Auth, and Profile Data.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (We use pnpm for fast, efficient package management)
- The **Backend API** running locally (see the
  [monolith repo](https://github.com/wirtaw/migraine-tracker-monolith) for
  setup).

### Local Setup

1. **Clone the repository:**

```bash
git clone [https://github.com/wirtaw/migrane-tracker-dashboard.git](https://github.com/wirtaw/migrane-tracker-dashboard.git)
cd migrane-tracker-dashboard
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Environment Setup:**

```bash
cp env.example .env
```

4. **Start the Development Server:**

```bash
pnpm run dev
```

5. **Open http://localhost:5173 in your browser to view the dashboard!**

## Open-Source Constraints & Customization

This repository includes promotional headers and usage limits intended for the Migraine Pulse ecosystem.

### How to Remove Promotion
To remove the Migraine Pulse banner:
1. Open `src/context/NotificationContext.tsx`.
2. Delete the `promoNotification` constant and the conditional rendering block inside the `NotificationProvider` return statement.

### Adjusting or Removing API/Database Limits
To lift limits on DB entries and API requests (OpenWeather, Termis, NOAA):
1. Open `src/services/api-utils.ts`.
2. Find the `checkUsageLimit` function.
3. Change the logic to `return true;` immediately at the start of the function.

Or `checkUsageLimit` usage from services and from `src/services/api-utils.ts`.

## 🤝 Contributing

We believe that managing chronic pain should be accessible and visually
soothing. If you are a frontend developer passionate about UI/UX, data
visualization, or accessibility, we would love your help!

Check out our issues tab for tasks tagged good first issue or help wanted.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for
details
