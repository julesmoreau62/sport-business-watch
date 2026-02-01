# 🏆 Sport Business Watch - Dashboard Template

**Automated sports business intelligence dashboard** with dynamic filtering, powered by Next.js + Notion API.

Live demo design: Modern, responsive, professional interface for tracking 35+ sports business sources across 5 continents.

---

## 🎯 What You Get

✅ **Dynamic filters** that auto-update from your Notion database (Region, Sport, Topic)  
✅ **Real-time search** across all articles  
✅ **Mobile-first responsive design**  
✅ **Professional dark theme** with smooth animations  
✅ **Zero maintenance** - connects directly to your Notion database  
✅ **Free hosting** on Vercel with unlimited bandwidth  

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Notion Keys

#### 1.1 Create Notion Integration
1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name it: **"Sport Business Watch"**
4. Select your workspace
5. Copy the **"Internal Integration Token"** (starts with `secret_...`)

#### 1.2 Connect Integration to Your Database
1. Open your Notion database
2. Click **"..."** (three dots in top right)
3. Click **"Connections"**
4. Search and select **"Sport Business Watch"**
5. Click **"Confirm"**

#### 1.3 Get Your Database ID
Your Notion database URL looks like:
```
https://www.notion.so/[workspace]/[DATABASE_ID]?v=...
```

Copy the `DATABASE_ID` part (between the last `/` and the `?`)

Example:
```
https://www.notion.so/jules/a1b2c3d4e5f6789012345678901234?v=123
                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                         This is your DATABASE_ID
```

---

### Step 2: Use This Template

Click the green **"Use this template"** button at the top of this repo.

This will create a copy in your GitHub account.

---

### Step 3: Deploy to Vercel

#### 3.1 Import to Vercel
1. Go to https://vercel.com (sign in with GitHub)
2. Click **"Add New"** → **"Project"**
3. Select your new repository
4. Vercel will auto-detect it's a Next.js project ✅

#### 3.2 Add Environment Variables
In the deployment screen, add these two variables:

```
NOTION_TOKEN=secret_your_token_here
NOTION_DATABASE_ID=your_database_id_here
```

#### 3.3 Deploy
Click **"Deploy"** and wait 2-3 minutes.

**Done!** Your dashboard is live! 🎉

---

## 🌐 Custom Domain (Optional)

Want to use `watch.julesmoreau.eu` or similar?

1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records with your domain provider
4. Done! (propagation takes ~10 minutes)

---

## 🔄 How It Works

1. **Your Python script** runs daily on GitHub Actions
2. Script updates your **Notion database**
3. **This dashboard** fetches data from Notion API
4. **Filters auto-generate** from your database content
5. Everything updates automatically, zero maintenance!

### Data Flow
```
Python Script → Notion Database → This Dashboard → Users
   (GitHub)         (Storage)        (Vercel)      (Browser)
```

---

## 📊 Database Structure Required

Your Notion database needs these properties:

| Property | Type | Required |
|----------|------|----------|
| Nom | Title | ✅ |
| Description | Text | ✅ |
| Date | Date | ✅ |
| Link | URL | ✅ |
| Priority | Select | ✅ (Options: 🔴 High, 🟡 Medium, 🟢 Low) |
| Sport | Select | ✅ |
| Thématique | Multi-select | ✅ |
| Region | Select | ✅ (Options: North America, Europe, Asia-Pacific, etc.) |

---

## 🎨 Features

### Dynamic Filters
- **Region**: Automatically generated from your Notion data
- **Sport**: Updates when you add new sports to Notion
- **Topic**: Updates when you add new topics
- **Search**: Real-time filtering across title and description

### UI/UX
- Smooth animations and transitions
- Hover effects on cards
- Responsive grid layout
- Mobile-optimized
- Professional dark theme

### Performance
- **Server-side caching** (30 min cache)
- **Optimized fonts** with automatic subsetting
- **Fast page loads** with Next.js optimizations

---

## 🛠️ Local Development (Optional)

Want to test locally before deploying?

```bash
# Clone your repo
git clone https://github.com/[your-username]/sport-business-watch.git
cd sport-business-watch

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Then edit .env.local with your Notion keys

# Run development server
npm run dev
```

Open http://localhost:3000

---

## 📱 Sharing With Others

After deployment, share your Vercel URL:
```
https://sport-business-watch.vercel.app
```

Or your custom domain:
```
https://watch.julesmoreau.eu
```

**No login required** - just share the link! Perfect for:
- Professors and classmates
- Job applications (BLAST, ESL, etc.)
- Portfolio showcase
- Research collaboration

---

## 🔧 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --accent-primary: #00ff88;  /* Change this */
  --accent-secondary: #0088ff; /* And this */
}
```

### Modify Layout
Edit `components/Dashboard.module.css` for styling  
Edit `components/Dashboard.js` for functionality

### Update Fonts
Edit `app/layout.js` to use different Google Fonts

---

## ❓ Troubleshooting

### "Failed to fetch articles"
- Check your `NOTION_TOKEN` is correct
- Check your `NOTION_DATABASE_ID` is correct
- Make sure integration is connected to the database

### Filters not showing all options
- Make sure articles exist in Notion with those values
- Filters generate dynamically from actual data

### Vercel build failing
- Check that environment variables are set
- Make sure Notion database structure matches requirements

---

## 💡 Pro Tips

1. **Cache Duration**: Edit `app/api/articles/route.js` line 7 to change cache time
2. **Articles Limit**: Change `page_size: 100` in API route to fetch more/less
3. **Sort Order**: Modify the `sorts` array in API route for different ordering

---

## 📈 Next Steps

Once deployed, you can:
- Share with your Sport Management class
- Add to your CV/portfolio
- Use for thesis research
- Show in job interviews
- Collaborate with peers

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review your environment variables
3. Check Vercel deployment logs
4. Open an issue on this repo

---

## 📄 License

MIT License - feel free to modify and use for your projects!

---

## 🎓 Built For

Master's students in Sport Management, esports professionals, and sports business analysts who need automated intelligence tracking.

**Powered by**: Next.js 14, Notion API, Vercel Edge Functions

---

Made with 🏆 for Sport Business Intelligence
