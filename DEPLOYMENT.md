# 🚀 Deployment Guide - FileConvert Pro

Complete step-by-step deployment instructions for all major platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [One-Command Deployment (Vercel)](#one-command-deployment-vercel)
- [Docker Deployment](#docker-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Manual Server Deployment](#manual-server-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure:

- ✅ All dependencies are installed (`npm install`)
- ✅ Build succeeds locally (`npm run build`)
- ✅ No TypeScript errors (`npm run type-check`)
- ✅ Linting passes (`npm run lint`)

---

## 🚀 One-Command Deployment (Vercel)

**Recommended** - Fastest and easiest deployment option.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From project root
cd "d:\Downloads\Practice projects\File_Conversion"

# Deploy to production
vercel --prod
```

### Step 4: Configure (optional)

The `vercel.json` configuration is already set up:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Step 5: Custom Domain (optional)

```bash
vercel domains add yourdomain.com
```

**✅ Done!** Your app is live at `https://your-project.vercel.app`

---

## 🐳 Docker Deployment

For self-hosted or containerized deployments.

### Step 1: Create Dockerfile

```dockerfile
# Use Node 18 Alpine
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Step 2: Build Docker Image

```bash
docker build -t fileconvert-pro .
```

### Step 3: Run Container

```bash
docker run -d -p 3000:3000 --name fileconvert fileconvert-pro
```

### Step 4: Docker Compose (optional)

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

Run with:

```bash
docker-compose up -d
```

**✅ Access:** `http://localhost:3000`

---

## 🌐 Netlify Deployment

### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/fileconvert-pro.git
git push -u origin main
```

2. Visit [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Choose your repository
5. Configure build settings:

   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Framework:** Next.js

6. Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

---

## 🖥️ Manual Server Deployment

For deploying to your own VPS (DigitalOcean, AWS EC2, etc.)

### Step 1: Server Setup (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 process manager
sudo npm i -g pm2
```

### Step 2: Upload Code

```bash
# From your local machine
scp -r "d:\Downloads\Practice projects\File_Conversion" user@your-server:/var/www/
```

Or use Git:

```bash
# On server
cd /var/www
git clone https://github.com/yourusername/fileconvert-pro.git
cd fileconvert-pro
```

### Step 3: Install & Build

```bash
npm install
npm run build
```

### Step 4: Start with PM2

```bash
pm2 start npm --name "fileconvert" -- start
pm2 save
pm2 startup
```

### Step 5: Nginx Reverse Proxy (optional)

Create `/etc/nginx/sites-available/fileconvert`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/fileconvert /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

**✅ Access:** `https://yourdomain.com`

---

## 🔐 Environment Variables

Create `.env.local` for production:

```bash
# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Custom API endpoint
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Node environment
NODE_ENV=production
```

**Note:** This app works without any environment variables! All processing is client-side.

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] **Homepage loads** - Check main page renders correctly
- [ ] **File upload works** - Test drag & drop functionality
- [ ] **PDF conversion** - Upload a DOCX, convert to PDF
- [ ] **DOCX conversion** - Upload a PDF, convert to DOCX
- [ ] **Image OCR** - Upload an image, test OCR extraction
- [ ] **Dark mode toggle** - Switch themes
- [ ] **Download works** - Download converted files
- [ ] **Batch processing** - Upload multiple files
- [ ] **Mobile responsive** - Test on mobile devices
- [ ] **Performance** - Run Lighthouse audit (target: 95+)
- [ ] **SSL/HTTPS** - Ensure secure connection
- [ ] **SEO** - Check meta tags and sitemap

---

## 🐛 Troubleshooting

### Build Fails

**Error:** Module not found

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### CORS Issues with Tesseract.js

**Error:** Cross-Origin Worker blocked

```bash
# Check next.config.js has CORS headers (already configured)
# Ensure deployment platform allows Web Workers
```

### Large Bundle Size

**Warning:** Bundle exceeds recommended size

```bash
# Analyze bundle
npm run build

# The app uses code splitting and tree-shaking automatically
# Check for unused dependencies
```

### Memory Issues During Build

**Error:** JavaScript heap out of memory

```bash
# Increase Node memory
node --max-old-space-size=4096 ./node_modules/.bin/next build
```

---

## 📊 Performance Optimization

### After Deployment:

1. **Enable Vercel Analytics** (if using Vercel)
2. **Configure Caching Headers**
3. **Enable Compression** (gzip/brotli)
4. **CDN for Static Assets**
5. **Monitor Core Web Vitals**

### Recommended Tools:

- Google PageSpeed Insights
- Lighthouse CI
- WebPageTest
- Vercel Analytics

---

## 🔄 CI/CD Pipeline (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Need Help?

- Check [README.md](./README.md) for general documentation
- Review [troubleshooting](#troubleshooting) section
- Open an issue on GitHub

---

**Happy Deploying! 🎉**

Your file converter is now live and serving users worldwide!
