# Quick Reference Card

## 🔗 Your Website URL
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```
*(Replace with your actual GitHub username and repository name)*

---

## 🔄 Common Tasks

### Update Data Manually
```cmd
cd c:\Users\Moller\Desktop\Sandbox
npm run update
git add index.html weather_impact_interactive.xlsx hourly_weather_data.json
git commit -m "Manual update"
git push
```

### Make Code Changes
```cmd
cd c:\Users\Moller\Desktop\Sandbox
# Edit files...
git add .
git commit -m "Your change description"
git push
```

### Trigger GitHub Actions Manually
1. Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions`
2. Click **"Update Weather Data"**
3. Click **"Run workflow"** → **"Run workflow"**

---

## 📅 Auto-Update Schedule

**Current Schedule:** Daily at **06:00 UTC**

**Convert to your timezone:**
- 06:00 UTC = 07:00 CET (winter)
- 06:00 UTC = 08:00 CEST (summer)

---

## 📁 Key Files (Don't Delete!)

| File | Why It's Important |
|------|-------------------|
| `index.html` | Your website (auto-generated) |
| `McDonald restaurants.xlsx` | Restaurant data source |
| `weather_impact_interactive.js` | Weather data fetcher |
| `generate_interactive_html.js` | HTML generator |
| `.github/workflows/update-weather.yml` | Auto-update script |
| `package.json` | Node.js dependencies |

---

## 🐛 Quick Troubleshooting

### Site Not Updating?
1. Check: `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions`
2. Green checkmark ✅ = Working
3. Red X ❌ = Click to see error

### Fix Most Problems
1. Delete `node_modules` folder
2. Run: `npm install`
3. Run: `npm run update`
4. Push changes

---

## 📊 Impact Formula Reference

**Current weights:**
- Snow: **5.0x** (highest impact)
- Rain: **1.5x**
- Temperature: **0.1x** (only matters if extreme)

**To change:** Edit `weather_impact_interactive.js` line 150-151

---

## 🔧 Quick Fixes

### Reset Everything
```cmd
cd c:\Users\Moller\Desktop\Sandbox
git fetch origin
git reset --hard origin/main
npm install
```

### View Recent Commits
```cmd
git log --oneline -10
```

### Undo Last Commit (not pushed)
```cmd
git reset --soft HEAD~1
```

---

## 📞 Helpful Links

- **Your Repo:** `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`
- **GitHub Actions:** `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions`
- **Settings:** `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/settings`
- **Cron Helper:** https://crontab.guru/

---

## ⚡ Emergency Commands

### Site Broken? Rollback:
```cmd
git revert HEAD
git push
```

### Force Update Right Now:
```cmd
cd c:\Users\Moller\Desktop\Sandbox
node weather_impact_interactive.js && node generate_interactive_html.js
git add index.html weather_impact_interactive.xlsx hourly_weather_data.json
git commit -m "Emergency update"
git push
```

---

**Print this page and keep it handy!**
