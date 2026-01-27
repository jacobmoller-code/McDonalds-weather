# McDonald's Denmark - Weather Impact Analysis

Interactive weather impact analysis tool for McDonald's restaurants in Denmark. Compares next 7 days weather forecast with same weekdays from last year to help with labor planning and business decisions.

## 🌟 Features

- **121 McDonald's locations** across Denmark (100% coverage!)
- **7-day weather forecast** with hourly detail
- **Snow-sensitive impact scoring** (5x weight vs 1.5x for rain)
- **Franchisee & Restaurant filters** (cascading dropdowns)
- **Hourly weather comparison** for labor planning
- **Auto-updates daily** at 06:00 UTC via GitHub Actions
- **No geocoding failures** - direct GPS coordinates

## 📊 Live Demo

Once deployed, access the live site at:
`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## 🚀 Setup Instructions

### Step 1: Initialize Git Repository

Open Command Prompt or PowerShell in the Sandbox folder:

```bash
cd "c:\Users\Moller\Desktop\Sandbox"
git init
git add .
git commit -m "Initial commit: Weather impact analysis tool"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon (top right) → **New repository**
3. Name it (e.g., `mcdonalds-weather-denmark`)
4. Keep it **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

### Step 3: Connect Local Repo to GitHub

Copy the commands from GitHub (they look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

Paste and run them in your Command Prompt.

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes, then refresh - you'll see your site URL!

### Step 5: Verify GitHub Actions

1. Go to **Actions** tab in your repository
2. You should see the workflow "Update Weather Data"
3. It will run automatically:
   - Daily at 06:00 UTC
   - On every push to main
   - Manually via "Run workflow" button

### Step 6: Test the Setup

1. Go to **Actions** tab
2. Click "Update Weather Data" workflow
3. Click **Run workflow** → **Run workflow** (green button)
4. Wait 5-10 minutes for it to complete
5. Check your GitHub Pages URL - data should be updated!

## 📁 Important Files

- `index.html` - Main webpage (auto-generated daily)
- `weather_impact_interactive.js` - Data fetcher (weather API calls)
- `generate_interactive_html.js` - HTML generator
- `Restaurant geo location.xlsx` - Restaurant master data (121 locations with GPS)
- `.github/workflows/update-weather.yml` - GitHub Actions workflow

## 🔄 How Auto-Update Works

1. **Daily at 06:00 UTC**, GitHub Actions triggers
2. Runs `weather_impact_interactive.js` (fetches new weather data)
3. Runs `generate_interactive_html.js` (generates new HTML)
4. Commits and pushes changes to GitHub
5. GitHub Pages automatically deploys the updated site

## 🛠️ Manual Update (Local)

If you need to update manually on your computer:

```bash
cd "c:\Users\Moller\Desktop\Sandbox"
npm run update
```

Then commit and push:

```bash
git add index.html weather_impact_interactive.xlsx hourly_weather_data.json
git commit -m "Manual update"
git push
```

## 📊 Data Sources

- **Weather Forecast**: [Open-Meteo API](https://open-meteo.com/) (free, no API key needed)
- **Geocoding**: [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/)
- **Historical Weather**: Open-Meteo Archive API

## 🔒 Privacy & Rate Limits

- All APIs used are free and public
- Nominatim requires 1 request/second (implemented)
- No API keys stored in repository
- Restaurant data stays in your private repository

## 🐛 Troubleshooting

### Actions Fail

- Check Actions tab → Click failed run → See error logs
- Common issue: API rate limits (will retry next day)

### Site Not Updating

- Verify Actions ran successfully
- Check if commits were pushed (see commit history)
- GitHub Pages can take 1-2 minutes to update

### Geocoding Failures

- Some addresses may fail (~28 out of 124)
- This is normal - analysis continues with successful locations

## 📝 Customization

### Change Update Schedule

Edit `.github/workflows/update-weather.yml`:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Change time here (UTC)
```

[Cron syntax help](https://crontab.guru/)

### Modify Impact Formula

Edit `weather_impact_interactive.js`, function `calculateImpact()`:

```javascript
const precipImpact = -precipDiff * 1.5; // Adjust weight
const snowImpact = -snowDiff * 5.0;     // Adjust weight
```

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

This is a private business tool. If you want to share improvements:

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Built with:** Node.js, Open-Meteo API, GitHub Pages, GitHub Actions

**Last Updated:** Auto-updates daily at 06:00 UTC
