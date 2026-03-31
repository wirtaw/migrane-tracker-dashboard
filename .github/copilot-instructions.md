# AI Coding Assistant Instructions - Migraine Tracker Dashboard

## Project Overview
React + TypeScript health tracking dashboard for migraines with environmental factors (weather, geomagnetic data, biorhythms). Multi-tenant app with Supabase authentication and custom backend API integration.

## Architecture Patterns

### Authentication & Protected Routes
- `AuthContext` manages user session, profile data, weather/geomagnetic data fetching
- `ProtectedRoute` wraps routes requiring auth; auto-redirects to `/profile` if profile incomplete
- Uses Supabase for auth with auto token refresh, sessionStorage for post-login redirect
- See: [src/context/AuthContext.tsx](src/context/AuthContext.tsx), [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)

### Data Flow & Services
- Domain-specific service modules in [src/services/](src/services/) (incidents.ts, symptoms.ts, medications.ts, triggers.ts, weather.ts)
- Centralized API error handling via `api-utils.ts` with `handleResponseError()`
- `migraineApi.ts` communicates with custom backend; weather services call OpenMeteo/NOAA APIs
- `ProfileDataContext` holds domain data (incidents, symptoms, triggers, medications); hydrated on auth
- See: [src/services/incidents.ts](src/services/incidents.ts), [src/services/weather.ts](src/services/weather.ts)

### Component Organization
- **Pages** (routes): [src/pages/](src/pages/) - full-page components tied to routes
- **Forms**: [src/components/forms/](src/components/forms/) - reusable form components (IncidentForm, SymptomForm, etc.)
- **Cards**: [src/components/cards/](src/components/cards/) - data display cards
- **Charts**: [src/components/charts/](src/components/charts/) - Chart.js visualizations
- Form pattern: useState for fields, validation helpers, useProfileDataContext for state updates
- See: [src/components/forms/IncidentForm.tsx](src/components/forms/IncidentForm.tsx) for form conventions

### Type System
- Domain types in [src/models/](src/models/) (*-types.ts files)
- Enums in [src/enums/](src/enums/) (IncidentTypeEnum, TriggerTypeEnum)
- Interface pattern: `I` prefix (IIncident, ISymptom, IMedication)
- See: [src/models/profileData.types.ts](src/models/profileData.types.ts)

## Build & Development Workflow

### Commands
- **Dev**: `npm run dev` → Vite hot-reload on `http://localhost:5173`
- **Build**: `npm run build` → Production bundle
- **Lint**: `npm run lint` → ESLint + auto-fix
- **Format**: `npm run format` → Prettier on src files
- **Type Check**: `npm run typecheck` → tsc --noEmit
- **Unused Code**: `npm run knip` → Finds unused exports/imports

### Environment Setup
- Use `.env.local` for Vite vars (prefix with `VITE_`)
- Required vars: `VITE_SUPBASE_URL`, `VITE_SUPBASE_KEY`, weather API keys, backend URL
- See: [src/config/env.ts](src/config/env.ts) for full IEnvConfig interface

### Linting Rules
- TypeScript strict mode enforced
- ESLint: React Hooks rules + React Refresh enabled
- Prettier formats on save via lint-staged (git pre-commit hook)
- No console logs in production builds (lint rule)

## Key Technologies
- **Frontend**: React 18, React Router 6, TypeScript 5.9
- **Styling**: Tailwind CSS (darkMode: 'class'), no CSS-in-JS
- **UI**: Lucide React (icons), Chart.js + react-chartjs-2
- **State**: React Context API (no Redux/Zustand)
- **Date**: Luxon (timezone-aware; avoid native Date for serialization)
- **Backend**: Supabase + custom Node API

## Project-Specific Conventions

### Naming
- Components: PascalCase (Dashboard.tsx), exports default
- Services: camelCase functions, export named + `Dto` types for API payloads
- Types: `I` prefix for interfaces, `Enum` suffix for enums
- Custom hooks: `useAuth()`, `useProfileDataContext()` patterns

### Error Handling
- Catch API errors with `handleResponseError(error)` from [src/services/api-utils.ts](src/services/api-utils.ts)
- Pass setFormErrorMessage to forms for error display
- User-facing errors stored in ProfileDataContext for modal/toast display

### DateTime Handling
- Use Luxon or ISO 8601 strings, never raw Date serialization
- Utility functions in [src/lib/utils.ts](src/lib/utils.ts): `getIsoDateTimeLocal()`, `getIsoDate()`, `getIsoTime()`
- Backend expects ISO format dates

### Form Patterns
1. State: useState hooks for each field
2. Validation: Helper function checking field values
3. Submit: Call service function (e.g., `createIncident()`), handle errors, call onSubmit callback
4. Context: Pull `setFormErrorMessage` from ProfileDataContext for errors
5. Navigation: Use `useNavigate()` for redirects post-submit

## External Integration Points
- **Supabase**: Auth, user session persistence; configured in [src/lib/supabase.ts](src/lib/supabase.ts)
- **Weather APIs**: OpenMeteo (free), NOAA (geomagnetic), custom radiation endpoint
- **Custom Backend**: Base URL from env, handles user profile, statistics, incident syncing

## Common Tasks

### Adding a New Domain Model
1. Define interface in [src/models/profileData.types.ts](src/models/profileData.types.ts)
2. Create service file [src/services/model.ts](src/services/) with CRUD functions
3. Add context state to [src/context/ProfileDataContext.tsx](src/context/ProfileDataContext.tsx)
4. Create form [src/components/forms/ModelForm.tsx](src/components/forms/) following IncidentForm pattern
5. Add page/route to [src/pages/](src/pages/) and App.tsx

### Adding a New Page
1. Create component in [src/pages/NewPage.tsx](src/pages/) (default export)
2. Add route to App.tsx Routes
3. Add navigation link if needed (Header.tsx or sidebar)
4. Protect with ProtectedRoute if auth required

### Fetching External Data
1. Create service function in [src/services/](src/services/)
2. Use `fetch()` with error handling via `handleResponseError()`
3. Return typed Promise (interface defined in models)
4. Optionally add to AuthContext for auto-fetching on mount
