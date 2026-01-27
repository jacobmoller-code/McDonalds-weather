# Complete Setup Guide for GitHub Pages

Follow these steps exactly to publish your weather analysis tool online with automatic daily updates.

## ✅ Prerequisites

- [x] Windows PC with VS Code installed
- [x] Node.js installed
- [x] GitHub account created
- [x] Git installed (comes with VS Code or [download here](https://git-scm.com/))

---

## 📋 Step-by-Step Instructions

### Step 1: Open Command Prompt in Your Folder

1. Press **Win + R**
2. Type `cmd` and press Enter
3. Navigate to your folder:
   ```cmd
   cd c:\Users\Moller\Desktop\Sandbox
   ```

### Step 2: Initialize Git Repository

Run these commands one by one:

```cmd
git init
git add .
git commit -m "Initial commit: McDonald's weather analysis"
```

**What this does:** Creates a local Git repository and saves all your files.

---

### Step 3: Create GitHub Repository

1. **Open browser** → Go to [https://github.com](https://github.com)
2. **Log in** to your GitHub account
3. Click the **+ icon** (top right corner)
4. Select **New repository**

**Repository Settings:**
- Repository name: `mcdonalds-weather-denmark` (or any name you prefer)
- Description: `Weather impact analysis for McDonald's Denmark`
- Visibility: **Public** ⚠️ **Must be Public for free GitHub Pages**
- ❌ **Do NOT check** "Add a README file"
- ❌ **Do NOT check** "Add .gitignore"
- ❌ **Do NOT check** "Choose a license"

5. Click **Create repository**

---

### Step 4: Connect Your Local Code to GitHub

After creating the repository, GitHub shows you commands. Copy them and run in Command Prompt:

```cmd
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR-USERNAME` with your actual GitHub username
- `YOUR-REPO-NAME` with the name you chose in Step 3

**Example:**
```cmd
git remote add origin https://github.com/johndoe/mcdonalds-weather-denmark.git
git branch -M main
git push -u origin main
```

**Authentication:**
- GitHub may ask for login credentials
- If using 2FA, you'll need a [Personal Access Token](https://github.com/settings/tokens) instead of password

---

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab (top menu)
3. Scroll down and click **Pages** in left sidebar
4. Under **Source**:
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click **Save**

**Wait 1-2 minutes**, then refresh the page.

You'll see a green box with your URL:
```
✅ Your site is live at https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

**Example:**
```
https://johndoe.github.io/mcdonalds-weather-denmark/
```

---

### Step 6: Verify Auto-Update is Working

1. In your repository, click **Actions** tab
2. You should see workflow: **"Update Weather Data"**
3. If not running yet, click it → **Run workflow** → **Run workflow** (green button)

**Watch it run:**
- Green checkmark ✅ = Success
- Red X ❌ = Failed (click to see error logs)

**What it does:**
1. Fetches weather data for all 96 restaurants
2. Generates new HTML with latest forecasts
3. Commits changes back to GitHub
4. Your website auto-updates!

---

## 🎉 Success! Your Site is Live

### 🌐 Access Your Website

Open your browser and go to:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

### 📅 Auto-Update Schedule

Your website automatically updates:
- ⏰ **Daily at 06:00 UTC** (7:00 CET / 8:00 CEST)
- 🔄 **Every time you push to GitHub**
- 🖱️ **Manual trigger** via Actions tab

### 🔄 How to Trigger Manual Update

1. Go to **Actions** tab in GitHub
2. Click **"Update Weather Data"** workflow
3. Click **"Run workflow"** dropdown
4. Click **"Run workflow"** button (green)
5. Wait 5-10 minutes for completion
6. Refresh your website - new data!

---

## 🛠️ Making Changes to Your Site

### Update Code Locally

1. Edit files in `c:\Users\Moller\Desktop\Sandbox`
2. Test locally: `node generate_interactive_html.js`
3. Open `index.html` in browser to preview

### Push Changes to GitHub

```cmd
cd c:\Users\Moller\Desktop\Sandbox
git add .
git commit -m "Description of changes"
git push
```

**GitHub Actions will automatically:**
- Run your scripts
- Update the weather data
- Deploy the new version

---

## 📊 Understanding Your Files

| File | Purpose |
|------|---------|
| `index.html` | Main webpage (auto-generated) |
| `weather_impact_interactive.js` | Fetches weather data |
| `generate_interactive_html.js` | Creates HTML from data |
| `McDonald restaurants.xlsx` | Restaurant master list |
| `.github/workflows/update-weather.yml` | Auto-update schedule |
| `package.json` | Node.js dependencies |

**⚠️ Never manually edit `index.html`** - it's auto-generated!

---

## 🔍 Troubleshooting

### Problem: "git: command not found"

**Solution:** Install Git from [https://git-scm.com/](https://git-scm.com/)

---

### Problem: GitHub Actions Failing

**Check:**
1. Go to Actions tab → Click failed workflow
2. Read error messages
3. Common fixes:
   - API rate limit hit (will work next day)
   - Syntax error in code (fix and push again)

**Quick fix:** Re-run the workflow:
- Click failed workflow → **Re-run all jobs**

---

### Problem: Website Not Updating

**Checklist:**
- ✅ GitHub Actions completed successfully?
- ✅ Files committed to repository? (check commit history)
- ✅ Waited 2-3 minutes? (GitHub Pages takes time)

**Force refresh:** Press `Ctrl + Shift + R` in browser

---

### Problem: Some Restaurants Missing

**Normal behavior:**
- ~28 out of 124 restaurants fail geocoding
- Analysis continues with 96 successful locations
- This is expected and doesn't break the tool

---

## 🎨 Customizing Your Site

### Change Update Time

Edit `.github/workflows/update-weather.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # Change this line
```

**Examples:**
- `'0 8 * * *'` = 08:00 UTC
- `'30 5 * * *'` = 05:30 UTC
- `'0 */12 * * *'` = Every 12 hours

Use [Crontab Guru](https://crontab.guru/) to create custom schedules.

### Change Snow Impact Weight

Edit `weather_impact_interactive.js` line 151:

```javascript
const snowImpact = -snowDiff * 5.0; // Change 5.0 to adjust sensitivity
```

**Higher number** = Snow matters more

### Change Colors

Edit `generate_interactive_html.js` CSS section (lines 60-400)

---

## 📞 Getting Help

### GitHub Resources
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)

### Weather API Resources
- [Open-Meteo API Docs](https://open-meteo.com/en/docs)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

---

## ✅ Quick Checklist

After setup, verify:

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub (see commits)
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Website URL works (may take 2 minutes)
- [ ] GitHub Actions workflow exists (Actions tab)
- [ ] Manual workflow run succeeds
- [ ] Data updates after workflow runs

---

## 🎯 Next Steps

Your weather analysis tool is now live and auto-updating!

**Share your URL** with team members:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

**Remember:**
- Data auto-updates daily at 06:00 UTC
- No maintenance required
- Free hosting via GitHub Pages
- Secure and private (only accessible via URL)

---

**🎉 Congratulations! You're all set up!**

If you encounter any issues, refer to the Troubleshooting section above or check the [README.md](README.md) for more details.
