# Mindefy Deployment Guide (Single Project)

This repository is configured as a **Single Next.js Project** that handles multiple domains using Middleware. You will deploy this **once** to Vercel, and it will serve all three applications based on the domain name.

## 1. Domain Configuration (Hostinger)

You need to configure your DNS settings on Hostinger for your domains.

**Using CNAME Records**
If you want to keep DNS on Hostinger, add CNAME records for each subdomain pointing to `cname.vercel-dns.com`:
1.  **portfolio.mindefy.tech**
2.  **ask.mindefy.tech**
3.  **movie-recommendation.mindefy.tech**

## 2. Vercel Deployment Steps

You will create **ONLY ONE** project in Vercel.

1.  **New Project** -> Import this repository.
2.  **Project Name**: `mindefy-workspace` (or your choice).
3.  **Framework Preset**: Next.js.
4.  **Root Directory**: `./` (Default - Leave empty).
5.  **Environment Variables**: Add all necessary env vars for ALL apps (AskDocs, Movies, etc.) in this single project.
6.  **Deploy**.

## 3. Vercel Domain Configuration

Once deployed, go to your **Project Settings -> Domains** on Vercel and add **ALL three domains**:

1.  `portfolio.mindefy.tech`
2.  `ask.mindefy.tech`
3.  `movie-recommendation.mindefy.tech`

## 4. How It Works (Middleware)

The `middleware.js` file detects which domain the user is visiting and rewrites the request to the correct internal folder:

-   **portfolio.mindefy.tech** -> Rewrites to `/portfolio` folder.
-   **ask.mindefy.tech** -> Rewrites to `/askdocs` folder.
-   **movie-recommendation.mindefy.tech** -> Rewrites to `/movies` folder.

This happens transparently on the server; the user always sees the clean URL (e.g., `ask.mindefy.tech/login`).

## 5. Local Development

When running locally (`npm run dev`), the middleware defaults to the **Portfolio** app at `localhost:3000`.

To access other apps locally, you can navigate explicitly to their internal paths:
-   **Portfolio**: `http://localhost:3000/portfolio` (or just `/`)
-   **AskDocs**: `http://localhost:3000/askdocs/login`
-   **Movies**: `http://localhost:3000/movies`

*Note: In production with custom domains, you won't need to include the folder prefix.*
