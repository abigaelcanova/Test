# Deploy to Vercel

## Option 1: Using Vercel CLI (Recommended)

1. Login to Vercel:
   ```bash
   npx vercel login
   ```
   This will open your browser to authenticate.

2. Deploy the project:
   ```bash
   npx vercel
   ```
   Follow the prompts (or use `npx vercel --yes` to accept defaults)

3. For production deployment:
   ```bash
   npx vercel --prod
   ```

## Option 2: Using Vercel Dashboard

1. Go to https://vercel.com and sign up/login
2. Click "Add New" → "Project"
3. Import your Git repository (or drag & drop your project folder)
4. Vercel will automatically detect it as a static site
5. Click "Deploy"

## Your Project Files

- index.html (main page)
- css/styles.css
- js/main.js
- vercel.json (deployment config)
- README.md
- .gitignore

The project is ready to deploy!
