# WeatherIQ 2.0 — GitHub + Vercel

WeatherIQ 2.0 is a responsive Next.js app using free Open-Meteo APIs.

## Features
- Live current weather for searched cities, 7-day forecast and 24-hour trend
- GMT and IST live clocks
- Forecast-derived weather hazard indicators (**not official severe-weather alerts**)
- US AQI, PM2.5, PM10 and ozone from Open-Meteo air quality
- Historical comparison of next 7 days vs latest available 7 archive days
- Weather-based best days for outdoor travel/activity at the selected city
- Saved cities in the browser (localStorage, not synced between devices)
- Automatic refresh every 15 minutes **while the page is open**
- Celsius/Fahrenheit, geolocation, sunrise/sunset and weekly averages

## Deploy
1. Extract the ZIP and upload the **contents** of `weatheriq-v2/` into your GitHub repository root.
2. In Vercel, import the repository and use the Next.js preset.
3. No environment variables or API keys are required.
4. Build command: `npm run build`. Output directory: leave default.

For local development, use Node.js 20+, `npm install`, `npm run dev`.

## Important limitations
- Open-Meteo free API is intended for non-commercial use and has usage limits. Review terms at https://open-meteo.com/en/pricing
- 15-minute refresh is client-side polling only, not a Vercel scheduled job, and it does not guarantee the upstream model has new observations.
- Hazard signals are simple app-defined thresholds and are **not official severe-weather warnings**. Always consult local meteorological agencies for official alerts.
- Historical archive is typically delayed and is compared against a different week; not a like-for-like same-date climate normal.
- Travel suggestions rank the next 7 days for weather suitability **within the selected city**; no booking or destination matching.
- City favorites persist only in the current browser.
- If an optional AQI or archive request fails, current forecast can still load.

## API endpoints
- `/api/geocode?q=Paris`
- `/api/weather?lat=28.61&lon=77.21&name=Delhi&unit=celsius`

Open-Meteo: https://open-meteo.com/ (attribution provided in UI)
