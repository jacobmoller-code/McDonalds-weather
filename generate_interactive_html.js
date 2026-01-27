const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel results
console.log('Reading weather impact results...');
const workbook = XLSX.readFile('weather_impact_interactive.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`Found ${data.length} rows of data\n`);

// Read hourly data if available
let hourlyData = {};
try {
  hourlyData = JSON.parse(fs.readFileSync('hourly_weather_data.json', 'utf8'));
  console.log('Hourly data loaded\n');
} catch (e) {
  console.log('No hourly data found\n');
}

// Calculate summary statistics
const better = data.filter(r => r.Impact === 'Bedre').length;
const worse = data.filter(r => r.Impact === 'Dårligere').length;
const similar = data.filter(r => r.Impact === 'Lignende').length;

// Get unique restaurants
const uniqueRestaurants = [...new Set(data.map(r => r.Restaurant))].sort();

// Calculate average differences
let totalTempDiff = 0, totalPrecipDiff = 0, totalSnowDiff = 0, count = 0;
data.forEach(r => {
  const temp2026 = parseFloat(r['Temp 2026']);
  const temp2025 = parseFloat(r['Temp 2025']);
  const precip2026 = parseFloat(r['Nedbør 2026']);
  const precip2025 = parseFloat(r['Nedbør 2025']);
  const snow2026 = parseFloat(r['Snefald 2026 (cm)']);
  const snow2025 = parseFloat(r['Snefald 2025 (cm)']);

  if (!isNaN(temp2026) && !isNaN(temp2025)) {
    totalTempDiff += (temp2026 - temp2025);
    count++;
  }
  if (!isNaN(precip2026) && !isNaN(precip2025)) {
    totalPrecipDiff += (precip2026 - precip2025);
  }
  if (!isNaN(snow2026) && !isNaN(snow2025)) {
    totalSnowDiff += (snow2026 - snow2025);
  }
});

const avgTempDiff = totalTempDiff / count;
const avgPrecipDiff = totalPrecipDiff / data.length;
const avgSnowDiff = totalSnowDiff / data.length;

// Generate detailed hourly pages
Object.keys(hourlyData).forEach(restaurant => {
  const restData = hourlyData[restaurant];
  // Generate a simple detail page for each restaurant-date combination
  // For now, we'll embed this in the main page with a modal
});

// Generate main HTML
const html = `<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>McDonald's Denmark - Interaktiv Vejranalyse</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Speedee', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #F9F9F9;
            padding: 0;
            min-height: 100vh;
            margin: 0;
        }

        .container {
            max-width: 1170px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header {
            background: #DA291C;
            color: white;
            padding: 30px 40px;
            position: relative;
            border-bottom: 4px solid #FFBC0D;
        }

        .header h1 {
            font-size: 2.25em;
            margin-bottom: 8px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .header h2 {
            font-size: 1.125em;
            font-weight: 400;
            margin-bottom: 15px;
            opacity: 0.95;
        }


        .filters {
            display: flex;
            gap: 20px;
            padding: 25px 40px;
            background: white;
            border-bottom: 1px solid #e0e0e0;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-group {
            flex: 1;
            min-width: 200px;
        }

        .filter-group label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #292929;
            margin-bottom: 8px;
        }

        .filter-group select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #d1d1d1;
            border-radius: 0.25rem;
            font-size: 1rem;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            color: #292929;
        }

        .filter-group select:hover {
            border-color: #FFBC0D;
        }

        .filter-group select:focus {
            outline: none;
            border-color: #FFBC0D;
            box-shadow: 0 0 0 3px rgba(255, 188, 13, 0.1);
        }

        .content {
            padding: 40px;
            background: #F9F9F9;
        }

        .interpretation {
            background: #FFF8E1;
            border-left: 4px solid #FFBC0D;
            padding: 24px;
            margin: 30px 0;
            border-radius: 0.25rem;
        }

        .interpretation h3 {
            color: #292929;
            margin-bottom: 12px;
            font-size: 1.125rem;
            font-weight: 600;
        }

        .interpretation p {
            line-height: 1.5;
            color: #505050;
            font-size: 0.9375rem;
        }

        .weather-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .weather-card {
            background: white;
            border: 2px solid #e0e0e0;
            color: #292929;
            padding: 25px;
            border-radius: 0.25rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
            transition: all 0.2s;
        }

        .weather-card:hover {
            border-color: #FFBC0D;
            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        }

        .weather-card h3 {
            font-size: 0.875rem;
            font-weight: 600;
            color: #707070;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .weather-card .value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #DA291C;
        }

        .table-container {
            overflow-x: auto;
            margin-top: 40px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border: 1px solid #e0e0e0;
            font-size: 0.875rem;
        }

        thead {
            background: #292929;
            color: white;
        }

        th {
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.5px;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #f3f4f6;
        }

        tbody tr {
            transition: background 0.2s;
            border-bottom: 1px solid #f0f0f0;
        }

        tbody tr:hover {
            background: #FFF8E1;
        }

        tbody tr.hidden {
            display: none;
        }

        .restaurant-name {
            font-weight: 600;
            color: #1f2937;
        }

        .date-link {
            color: #DA291C;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            transition: color 0.2s;
        }

        .date-link:hover {
            color: #FFBC0D;
            text-decoration: underline;
        }

        .weekday {
            color: #6b7280;
            font-size: 0.9em;
        }

        .temp-positive { color: #ef4444; }
        .temp-negative { color: #3b82f6; }

        .impact-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: uppercase;
        }

        .impact-bedre {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .impact-dårligere {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .impact-lignende {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }

        /* Modal styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            overflow-y: auto;
        }

        .modal-content {
            background: white;
            margin: 50px auto;
            padding: 0;
            max-width: 1200px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            background: linear-gradient(135deg, #DA291C 0%, #FFC72C 100%);
            color: white;
            padding: 25px;
            border-radius: 15px 15px 0 0;
            position: relative;
        }

        .modal-header h2 {
            margin: 0;
        }

        .close {
            position: absolute;
            right: 25px;
            top: 25px;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
        }

        .close:hover {
            color: #f3f4f6;
        }

        .modal-body {
            padding: 30px;
        }

        .hourly-chart {
            margin: 20px 0;
        }

        .hour-row {
            display: grid;
            grid-template-columns: 80px 120px 120px 120px 120px;
            gap: 10px;
            padding: 15px 12px;
            border-bottom: 1px solid #e5e7eb;
            align-items: center;
        }

        .hour-row:hover {
            background: #f9fafb;
        }

        .hour-row.header {
            font-weight: 700;
            background: #1f2937;
            color: white;
            border-radius: 8px;
            padding: 18px 12px;
            font-size: 0.95em;
        }

        .hour-row > div {
            text-align: center;
        }

        .hour-row > div:first-child {
            text-align: left;
            font-weight: 600;
        }

        .footer {
            text-align: center;
            padding: 30px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            .header h1 { font-size: 1.8em; }
            .filters {
                flex-direction: column;
                padding: 20px;
            }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍔 McDonald's Denmark</h1>
            <h2>Interaktiv Vejranalyse</h2>
            <div class="date">
                <p>Senest opdateret: ${new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <p style="font-size: 0.85em; margin-top: 5px; opacity: 0.9;">📊 Data opdateres automatisk hver dag kl. 06:00 UTC</p>
            </div>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label for="restaurant-filter">Vælg Restaurant</label>
                <select id="restaurant-filter" onchange="filterByRestaurant()">
                    <option value="">Alle Restauranter</option>
                    ${uniqueRestaurants.map(r => `<option value="${r}">${r}</option>`).join('')}
                </select>
            </div>
        </div>

        <div class="content">
            <div class="weather-details">
                <div class="weather-card">
                    <h3>🌡️ Gns. Temperaturforskel</h3>
                    <div class="value">${avgTempDiff.toFixed(1)}°C</div>
                </div>
                <div class="weather-card">
                    <h3>🌧️ Gns. Nedbørsforskel</h3>
                    <div class="value">${avgPrecipDiff.toFixed(1)} mm</div>
                </div>
                <div class="weather-card">
                    <h3>❄️ Gns. Snefaldforskel</h3>
                    <div class="value">${avgSnowDiff.toFixed(1)} cm</div>
                </div>
            </div>

            <div class="interpretation">
                <h3>💡 Fortolkning</h3>
                <p>
                    ${avgTempDiff < -1 ? 'Koldere vejr forventes sammenlignet med samme ugedage sidste år. ' : avgTempDiff > 1 ? 'Varmere vejr forventes sammenlignet med samme ugedage sidste år. ' : 'Lignende temperaturer forventes sammenlignet med samme ugedage sidste år. '}
                    ${avgPrecipDiff > 5 ? 'Betydeligt mere nedbør forventes. ' : avgPrecipDiff < -5 ? 'Betydeligt mindre nedbør forventes. ' : 'Lignende nedbørsniveauer forventes. '}
                    ${avgSnowDiff > 1 ? 'Mere sne forventes. ' : avgSnowDiff < -1 ? 'Mindre sne forventes. ' : 'Lignende snemængder forventes. '}
                </p>
                <p style="margin-top: 15px; font-weight: 600;">
                    ${worse > better ? '⚠️ Samlet set: Vejrforholdene forventes at være DÅRLIGERE end samme ugedage sidste år. Nedbør og sne har størst betydning for kundetrafik.' : better > worse ? '✅ Samlet set: Vejrforholdene forventes at være BEDRE end samme ugedage sidste år.' : 'Samlet set: Vejrforholdene forventes at være LIGNENDE samme ugedage sidste år.'}
                </p>
            </div>

            <h2 style="margin-top: 50px; margin-bottom: 20px; color: #1f2937;">📍 Detaljeret Daglig Analyse</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">Klik på en dato for at se timeanalyse</p>

            <div class="table-container">
                <table id="data-table">
                    <thead>
                        <tr>
                            <th>Restaurant</th>
                            <th>Dato</th>
                            <th>Ugedag</th>
                            <th>Temp 2026 (°C)</th>
                            <th>Temp 2025 (°C)</th>
                            <th>Nedbør 2026 (mm)</th>
                            <th>Nedbør 2025 (mm)</th>
                            <th>Snefald 2026 (cm)</th>
                            <th>Snefald 2025 (cm)</th>
                            <th>Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((r, idx) => {
                          const showName = idx === 0 || r.Restaurant !== data[idx - 1].Restaurant;
                          const restaurantCell = showName ? `<td rowspan="7" class="restaurant-name">${r.Restaurant}</td>` : '';

                          const temp2026 = parseFloat(r['Temp 2026']);
                          const temp2025 = parseFloat(r['Temp 2025']);
                          const tempDiff = temp2026 - temp2025;
                          const tempClass = tempDiff > 0 ? 'temp-positive' : tempDiff < 0 ? 'temp-negative' : '';

                          return `<tr class="data-row" data-restaurant="${r.Restaurant}">
                            ${restaurantCell}
                            <td><a class="date-link" onclick="showDetailedAnalysis('${r.Restaurant}', '${r.DateISO}')">${r.Dato}</a></td>
                            <td class="weekday">${r.Ugedag}</td>
                            <td class="${tempClass}">${r['Temp 2026']}</td>
                            <td>${r['Temp 2025']}</td>
                            <td>${r['Nedbør 2026']}</td>
                            <td>${r['Nedbør 2025']}</td>
                            <td>${r['Snefald 2026 (cm)']}</td>
                            <td>${r['Snefald 2025 (cm)']}</td>
                            <td>
                                <span class="impact-badge impact-${r.Impact.toLowerCase()}">
                                    ${r.Impact === 'Bedre' ? '✅' : r.Impact === 'Dårligere' ? '⚠️' : '➖'} ${r.Impact}
                                </span>
                            </td>
                        </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="footer">
            <p>Genereret af Weather Impact Model - Interaktiv Version</p>
            <p>Data kilder: Open-Meteo API • OpenStreetMap Nominatim</p>
        </div>
    </div>

    <!-- Modal for detailed analysis -->
    <div id="detailModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2 id="modal-title">Detaljeret Timeanalyse</h2>
            </div>
            <div class="modal-body" id="modal-body">
                <!-- Content will be dynamically inserted -->
            </div>
        </div>
    </div>

    <script>
        const allData = ${JSON.stringify(data)};
        const hourlyData = ${JSON.stringify(hourlyData)};

        function filterByRestaurant() {
            const restaurant = document.getElementById('restaurant-filter').value;
            const rows = document.querySelectorAll('.data-row');

            rows.forEach(row => {
                const rowRestaurant = row.getAttribute('data-restaurant');
                const show = !restaurant || rowRestaurant === restaurant;
                row.classList.toggle('hidden', !show);
            });
        }

        function showDetailedAnalysis(restaurant, date) {
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');

            modalTitle.textContent = \`Timeanalyse: \${restaurant} - \${date}\`;

            // Get hourly data for this restaurant
            const restHourly = hourlyData[restaurant];

            if (!restHourly) {
                modalBody.innerHTML = '<p>Ingen timedata tilgængelig for denne restaurant.</p>';
                modal.style.display = 'block';
                return;
            }

            // Find the date and its hourly data
            const dateObj = new Date(date);
            const year = dateObj.getFullYear();

            // Get forecast and historical hourly data
            const forecast = restHourly.forecast;
            const historical = restHourly.historical;

            if (!forecast || !historical) {
                modalBody.innerHTML = '<p>Timedata ikke tilgængelig.</p>';
                modal.style.display = 'block';
                return;
            }

            // Find the starting index for this date in the hourly arrays
            let forecastStartIdx = -1;
            let historicalStartIdx = -1;

            // Match the date in forecast data
            for (let i = 0; i < forecast.time.length; i++) {
                if (forecast.time[i].startsWith(date)) {
                    forecastStartIdx = i;
                    break;
                }
            }

            // Match the same weekday in historical data (last year)
            const targetWeekday = dateObj.getDay();
            const lastYear = year - 1;

            for (let i = 0; i < historical.time.length; i++) {
                const histDate = new Date(historical.time[i]);
                if (histDate.getDay() === targetWeekday && histDate.getFullYear() === lastYear) {
                    historicalStartIdx = i;
                    break;
                }
            }

            // Generate hourly comparison
            let html = '<h3 style="color: #1f2937; margin-bottom: 10px;">Vejr time for time - 24 timers sammenligning</h3>';
            html += '<p style="color: #6b7280; margin-bottom: 25px;">Sammenligning med samme ugedag sidste år for at hjælpe med planlægning af bemanding</p>';
            html += '<div class="hourly-chart">';
            html += '<div class="hour-row header">';
            html += '<div>Time</div><div>Temp ' + year + ' (°C)</div><div>Temp ' + (year-1) + ' (°C)</div><div>Nedbør ' + year + ' (mm)</div><div>Nedbør ' + (year-1) + ' (mm)</div>';
            html += '</div>';

            if (forecastStartIdx === -1 || historicalStartIdx === -1) {
                html += '<p style="padding: 20px; color: #6b7280;">Kunne ikke finde timedata for denne dato.</p>';
            } else {
                // Show 24 hours for the selected date
                for (let hour = 0; hour < 24; hour++) {
                    const fIdx = forecastStartIdx + hour;
                    const hIdx = historicalStartIdx + hour;

                    const fTemp = forecast.temperature_2m && forecast.temperature_2m[fIdx] !== null
                        ? forecast.temperature_2m[fIdx].toFixed(1) : 'N/A';
                    const hTemp = historical.temperature_2m && historical.temperature_2m[hIdx] !== null
                        ? historical.temperature_2m[hIdx].toFixed(1) : 'N/A';
                    const fPrecip = forecast.precipitation && forecast.precipitation[fIdx] !== null
                        ? forecast.precipitation[fIdx].toFixed(1) : '0.0';
                    const hPrecip = historical.precipitation && historical.precipitation[hIdx] !== null
                        ? historical.precipitation[hIdx].toFixed(1) : '0.0';

                    // Highlight significant differences
                    const tempDiff = parseFloat(fTemp) - parseFloat(hTemp);
                    const precipDiff = parseFloat(fPrecip) - parseFloat(hPrecip);

                    let rowStyle = '';
                    let rowClass = '';
                    if (precipDiff > 2) {
                        rowStyle = ' style="background: #fee2e2; border-left: 4px solid #ef4444;"';
                        rowClass = ' class="hour-row"';
                    } else if (precipDiff < -2) {
                        rowStyle = ' style="background: #d1fae5; border-left: 4px solid #10b981;"';
                        rowClass = ' class="hour-row"';
                    } else {
                        rowClass = ' class="hour-row"';
                    }

                    html += \`<div\${rowClass}\${rowStyle}>\`;
                    html += \`<div>\${hour.toString().padStart(2, '0')}:00</div>\`;
                    html += \`<div>\${fTemp}°</div>\`;
                    html += \`<div>\${hTemp}°</div>\`;
                    html += \`<div>\${fPrecip} mm</div>\`;
                    html += \`<div>\${hPrecip} mm</div>\`;
                    html += \`</div>\`;
                }
            }

            html += '</div>';
            html += '<div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">';
            html += '<p style="font-weight: 600; margin-bottom: 10px;">💡 Brug dette til bemandingsplanlægning:</p>';
            html += '<ul style="padding-left: 20px; line-height: 1.8;">';
            html += '<li>Rød baggrund = Mere nedbør i år (færre kunder forventet)</li>';
            html += '<li>Grøn baggrund = Mindre nedbør i år (flere kunder forventet)</li>';
            html += '<li>Tilpas bemanding baseret på nedbørsmønstre gennem dagen</li>';
            html += '</ul>';
            html += '</div>';

            modalBody.innerHTML = html;
            modal.style.display = 'block';
        }

        function closeModal() {
            document.getElementById('detailModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('detailModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>`;

// Write HTML file
fs.writeFileSync('index.html', html);
console.log('✓ Interactive HTML report generated: index.html');
console.log('\nFeatures:');
console.log('  - Auto-updates daily via GitHub Actions');
console.log('  - Franchisee dropdown filter');
console.log('  - Restaurant dropdown filter (cascading)');
console.log('  - Clickable dates for detailed hourly analysis');
console.log('  - Snow-sensitive impact formula (5x weight)');
console.log('  - Hourly weather comparison for labor planning');
