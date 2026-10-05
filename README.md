### ELEVATEX /// Electronic Flight bag (EFB) Project

A modern, lightweight EFB web application built with Next.js, TypeScript and Tailwind CSS. It retreives, parses and visualizes the OFB data directly from SimBrief (with SimBrief API)

### Features

1. **SimBrief integration** Fetches active flight plans using either a SimBrief Pilot ID or Username
2. **API Proxy**: uses a custom Next.js Route Handler ('/api/simbrief') to securely proxy requests, bypass CORS restrictions and handle API errors cleanly.
3. **Flight Briefing Overview**: Displays departure/arrival ICAO code, aircraft type, flight number, route, cruise altitude, enroute time and ramp fuel.
4. **Loading &. error handling**: Clear visual indicators for API loading states and fallback error messaging for missing or invalid flight plans.

## Tech stack

**Framework**: Next.js (App Router)
**Language**: TypeScript
**styling**: Tailwind CSS
**Data Source**: SimBrief API ('xml.fetcher.php' with JSON response mapping)

## architecture & engineering decisions

**Server-side Proy**: instead of fetching directly from the client, requests are handled server-side. This keeps the network layer clean, handles edge-case XML error responses from SimBrief, and prevents CORS issues.
**Type Safety**: Custom TypeScript definition and interfaces ensure end-to-end data safety when mapping complex  OFP JSON responses.

clone the repository: ```bash
   git clone [https://github.com/Matt2454/Elevatex-EFB.git](https://github.com/Matt2454/Elevatex-EFB.git)
   cd Elevatex-EFB