# Mindefy Workspace Deployment Guide

This repository is configured as a **Monorepo-style Single Next.js Project** that hosts three distinct applications:
1.  **Portfolio** (Main/Root)
2.  **AskDocs** (AI Document Assistant)
3.  **CineSense** (Movie Recommendations)

It uses **Next.js Middleware** to route requests from different domains to their respective internal application folders. You only need to deploy this project **ONCE** on Vercel.

## 1. Project Structure

```
src/app/
├── (portfolio)/      # Routes for portfolio.mindefy.tech
├── (askdocs)/        # Routes for ask.mindefy.tech
└── (movies)/         # Routes for movie-recommendation.mindefy.tech
```

## 2. Vercel Deployment (One-Time Setup)

You will create a **single project** in Vercel to handle all traffic.

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import** your Git repository (`mindefy-rag-chatbot`).
3.  **Configure Project**:
    *   **Project Name**: `mindefy-workspace` (or any name you prefer).
    *   **Framework Preset**: Next.js.
    *   **Root Directory**: `./` (Leave as default).
    *   **Build Command**: `next build` (Default).
    *   **Output Directory**: `.next` (Default).
4.  **Environment Variables**:
    Add all environment variables required for **ALL** applications here.
    *   `NEXT_PUBLIC_API_URL` (for backend connections)
    *   And any other secrets used by AskDocs or Movies apps.
5.  **Click Deploy**.

## 3. Domain Configuration (Vercel)

Once the project is deployed, you need to connect your custom domains.

1.  Go to your **Vercel Project Dashboard** -> **Settings** -> **Domains**.
2.  Add the following domains:
    *   `portfolio.mindefy.tech` (Main Portfolio)
    *   `ask.mindefy.tech` (AskDocs App)
    *   `movie-recommendation.mindefy.tech` (CineSense App)
3.  Vercel will provide **DNS Records** (usually an A record or CNAME).
4.  **Log in to Hostinger** (or your DNS provider) and add these records for each subdomain.

## 4. How It Works (Middleware Logic)

The `src/middleware.js` file intelligently routes traffic based on the hostname:

*   **`portfolio.mindefy.tech`** request → Middleware serves content from `/src/app/(portfolio)`
*   **`ask.mindefy.tech`** request → Middleware serves content from `/src/app/(askdocs)`
*   **`movie-recommendation.mindefy.tech`** request → Middleware serves content from `/src/app/(movies)`

This happens transparently. The user sees the clean URL (e.g., `ask.mindefy.tech/login`), but Next.js serves the correct page internally.

## 5. Local Development

When running locally (`npm run dev`), you can access the apps via paths (since you don't have subdomains on localhost easily):

*   **Portfolio**: `http://localhost:3000`
*   **AskDocs**: `http://localhost:3000/askdocs/login`
*   **Movies**: `http://localhost:3000/movies`
