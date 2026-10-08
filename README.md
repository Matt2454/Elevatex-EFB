# ELEVATEX EFB

A web-based Electronic Flight Bag (EFB) built for the ELEVATEX technical assignment. It integrates with the SimBrief API to fetch Operational Flight Plan (OFP) data and displays real-time weather information.

## Features

* **SimBrief Integration:** Fetches and displays flight data including origin, destination, ATC callsign, cruise altitude, flight time, and ramp fuel.
* **Real-time Weather:** Displays METAR data for departure, arrival, and alternate airports. Uses a custom Next.js API route (`/api/metar`) to proxy the NOAA API and avoid client-side CORS issues.
* **Route Map:** Visualizes the departure and arrival airports using Leaflet.

## Tech Stack

* Next.js (App Router)
* Tailwind CSS
* Leaflet

## Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

Open http://localhost:3000 with your browser to see the application.

## Usage

Enter a valid SimBrief Pilot ID or Username in the search field and click "Load Flight Plan" to retrieve and display the briefing data.