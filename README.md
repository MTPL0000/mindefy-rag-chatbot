# Mindefy Workspace

This repository contains the Mindefy suite of applications, organized as a Monorepo.

## Project Structure

The codebase is split into three independent applications located in the `apps/` directory:

### 1. Portfolio (`apps/portfolio`)
- **Domain**: `https://portfolio.mindefy.tech`
- **Description**: The main landing page that showcases other projects.
- **Key Features**: Links to AskDocs and CineSense.

### 2. AskDocs (`apps/askdocs`)
- **Domain**: `https://ask.mindefy.tech`
- **Description**: RAG Chatbot application.
- **Routes**:
  - `/login` - Login page
  - `/signup` - Signup page
  - `/chat` - Chat interface

### 3. Movie Recommendation (`apps/movie-recommendation`)
- **Domain**: `https://movie-recommendation.mindefy.tech`
- **Description**: AI-powered movie recommendation engine (CineSense).
- **Routes**:
  - `/` - Home (Browse movies)
  - `/{movieid}` - Movie Details
  - `/recommendations` - Personalized recommendations

## Development

To work on a specific app, navigate to its directory:

```bash
# Portfolio
cd apps/portfolio
npm install
npm run dev

# AskDocs
cd apps/askdocs
npm install
npm run dev

# Movies
cd apps/movie-recommendation
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel and configuring domains.
