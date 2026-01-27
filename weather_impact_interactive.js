const XLSX = require('xlsx');
const https = require('https');
const http = require('http');
const fs = require('fs');

// Helper function to make HTTP requests
function fetchJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = url.startsWith('https') ? https : http;

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'WeatherImpactModel/1.0 (McDonald Denmark Analysis)',
        ...headers
      }
    };

    client.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Fetch hourly weather data
async function getHourlyWeatherData(lat, lon, startDate, endDate) {
  const url = `https://archive-api.open-meteo.com/v1/archive?` +
    `latitude=${lat}&longitude=${lon}` +
    `&start_date=${startDate}&end_date=${endDate}` +
    `&hourly=temperature_2m,precipitation,snowfall,weather_code,cloud_cover,wind_speed_10m` +
    `&daily=temperature_2m_mean,precipitation_sum,snowfall_sum` +
    `&timezone=Europe/Copenhagen`;

  try {
    return await fetchJSON(url);
  } catch (error) {
    console.error(`Hourly weather fetch failed:`, error.message);
    return null;
  }
}

// Fetch forecast with hourly data
async function getForecastWithHourly(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,precipitation,snowfall,weather_code,cloud_cover,wind_speed_10m` +
    `&daily=temperature_2m_mean,precipitation_sum,snowfall_sum` +
    `&timezone=Europe/Copenhagen&forecast_days=7`;

  try {
    return await fetchJSON(url);
  } catch (error) {
    console.error(`Forecast fetch failed:`, error.message);
    return null;
  }
}

// Get weekday name in Danish
function getWeekdayName(dateString) {
  const date = new Date(dateString);
  const weekdays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  return weekdays[date.getDay()];
}

// Calculate dates for next 7 days from a start date
function calculateDates(startDate = new Date()) {
  const forecast = [];
  const historical = [];

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(startDate);
    forecastDate.setDate(forecastDate.getDate() + i);

    // Get same weekday from last year
    const historicalDate = new Date(forecastDate);
    historicalDate.setFullYear(historicalDate.getFullYear() - 1);

    // Adjust to same weekday if needed
    const dayDiff = forecastDate.getDay() - historicalDate.getDay();
    if (dayDiff !== 0) {
      historicalDate.setDate(historicalDate.getDate() + dayDiff);
    }

    forecast.push(forecastDate.toISOString().split('T')[0]);
    historical.push(historicalDate.toISOString().split('T')[0]);
  }

  return { forecast, historical };
}

// Calculate impact with emphasis on precipitation and snow
function calculateImpact(forecastTemp, lyTemp, forecastPrecip, lyPrecip, forecastSnow, lySnow) {
  const tempDiff = forecastTemp - lyTemp;
  const precipDiff = forecastPrecip - lyPrecip;
  const snowDiff = forecastSnow - lySnow;

  // Temperature only matters if extreme (below 0 or above 25)
  let tempImpact = 0;
  if (forecastTemp < 0 && lyTemp >= 0) tempImpact = -3; // New freezing temps
  else if (forecastTemp >= 0 && lyTemp < 0) tempImpact = 3; // No longer freezing
  else if (Math.abs(tempDiff) > 10) tempImpact = tempDiff * 0.3; // Large temp swings
  else tempImpact = tempDiff * 0.1; // Small temperature changes don't matter much

  // Precipitation and snow have major impact - SNOW IS CRITICAL!
  const precipImpact = -precipDiff * 1.5; // More rain = negative
  const snowImpact = -snowDiff * 5.0; // SNOW HAS HUGE IMPACT - much more than rain!

  const totalImpact = tempImpact + precipImpact + snowImpact;

  let impact = 'Lignende';
  if (totalImpact > 3) impact = 'Bedre';
  else if (totalImpact < -3) impact = 'Dårligere';

  return impact;
}

// Main processing
async function processRestaurants(startDate = new Date()) {
  console.log('=== Weather Impact Model - Version 2 (Direct Coordinates) ===\n');
  console.log(`Start date: ${startDate.toISOString().split('T')[0]}\n`);

  // Read Excel with coordinates
  const workbook = XLSX.readFile('Restaurant geo location.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const restaurants = XLSX.utils.sheet_to_json(sheet);

  console.log(`Found ${restaurants.length} restaurants with coordinates\n`);

  const { forecast, historical } = calculateDates(startDate);
  const results = [];
  const hourlyData = {};

  // Process all restaurants
  console.log('Processing all restaurants...\n');

  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    const restaurantName = restaurant.__EMPTY || restaurant.Restaurant || `Restaurant ${i+1}`;
    const lat = restaurant.Latitude;
    const lon = restaurant.Longitude;

    console.log(`[${i + 1}/${restaurants.length}] Processing: ${restaurantName}...`);

    // Validate coordinates
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.log(`  ✗ Invalid coordinates\n`);
      continue;
    }

    console.log(`  ✓ Coordinates: ${lat}, ${lon}`);

    // Small delay to be respectful to API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get forecast with hourly
    const forecastData = await getForecastWithHourly(lat, lon);
    if (!forecastData) {
      console.log(`  ✗ Forecast fetch failed\n`);
      continue;
    }
    console.log(`  ✓ Forecast fetched`);

    // Get historical data with hourly
    const historicalData = await getHourlyWeatherData(lat, lon, historical[0], historical[6]);
    if (!historicalData) {
      console.log(`  ✗ Historical data fetch failed\n`);
      continue;
    }
    console.log(`  ✓ Historical data fetched`);

    // Store hourly data for detail pages
    hourlyData[restaurantName] = {
      forecast: forecastData.hourly,
      historical: historicalData.hourly
    };

    // Create 7 rows (one per day)
    for (let day = 0; day < 7; day++) {
      const dateForecast = forecast[day];
      const dateHistorical = historical[day];
      const weekday = getWeekdayName(dateForecast);

      const forecastTemp = forecastData.daily.temperature_2m_mean[day];
      const forecastPrecip = forecastData.daily.precipitation_sum[day];
      const forecastSnow = forecastData.daily.snowfall_sum[day];

      const lyTemp = historicalData.daily.temperature_2m_mean[day];
      const lyPrecip = historicalData.daily.precipitation_sum[day];
      const lySnow = historicalData.daily.snowfall_sum[day];

      const impact = calculateImpact(forecastTemp, lyTemp, forecastPrecip, lyPrecip, forecastSnow, lySnow);

      results.push({
        Restaurant: restaurantName,
        Dato: new Date(dateForecast).toLocaleDateString('da-DK', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        DateISO: dateForecast,
        Ugedag: weekday,
        'Temp 2026': forecastTemp ? forecastTemp.toFixed(1) : 'N/A',
        'Temp 2025': lyTemp ? lyTemp.toFixed(1) : 'N/A',
        'Nedbør 2026': forecastPrecip ? forecastPrecip.toFixed(1) : 'N/A',
        'Nedbør 2025': lyPrecip ? lyPrecip.toFixed(1) : 'N/A',
        'Sne 2026': forecastSnow ? forecastSnow.toFixed(1) : 'N/A',
        'Sne 2025': lySnow ? lySnow.toFixed(1) : 'N/A',
        Impact: impact
      });
    }

    console.log(`  ✓ 7 days analyzed\n`);
  }

  // Save results
  const ws = XLSX.utils.json_to_sheet(results);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daily Weather Impact');
  XLSX.writeFile(wb, 'weather_impact_interactive.xlsx');

  // Save hourly data as JSON
  fs.writeFileSync('hourly_weather_data.json', JSON.stringify(hourlyData, null, 2));

  console.log(`\n✓ Done! Results saved to weather_impact_interactive.xlsx`);
  console.log(`✓ Hourly data saved to hourly_weather_data.json`);
  console.log(`Total rows: ${results.length} (${results.length / 7} restaurants × 7 days)`);
}

// Check if date argument provided
const args = process.argv.slice(2);
const startDate = args[0] ? new Date(args[0]) : new Date();

processRestaurants(startDate).catch(console.error);
