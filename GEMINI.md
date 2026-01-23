# Gemini Project Context: Migraine Tracker Suite

## Project Overview

A multi-repo system for tracking migraine triggers and symptoms, correlating
them with environmental factors (solar radiation, geomagnetic activity, and
weather).

## Tech Stack

### Monolith (Backend)

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB (Mongoose)
- **Auth**: Supabase + JWT
- **Integrations**: NOAA (Solar), GFZ (Geomagnetic), TEMIS (UV), Open-Meteo
  (Weather)

### Dashboard (Frontend)

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Visuals**: Recharts (Biorhythms, Incident Trends)

## Active Skills (Rules)

- **Package Manager**: Always use `npm` for the dashboard as per existing
  lockfiles.
- **Formatting:** Always run `npm format` after implementation.
- **Type Checking:** Always run `npm typecheck` after implementation.
- **Linting:** Always run `npm lint` after implementation.
- **Typescript**: Strict typing is required. Avoid `any` in DTOs and Interfaces.

## Historical Plan & Task Progress

1. [DONE] **Auth Foundation**: Supabase integration and RBAC guards.
2. [DONE] **External Data Clients**: NOAA, GFZ, and Weather integration.
3. [DONE] **Core Domains**: Incidents, Symptoms, Triggers, and Medications.
4. [IN PROGRESS] **Visualization**: Implementing Biorhythm and Solar Radiation
   charts in the Dashboard.
5. [TODO] **Correlation Engine**: Logic to automatically find links between
   weather and incident frequency.
