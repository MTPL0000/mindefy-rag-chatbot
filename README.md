# Multi-Feature Portfolio Platform

A Next.js application with **feature-based architecture** that combines multiple projects:
- **RAG Chatbot** - AI-powered chat with document understanding
- **Movie Recommendations** - Personalized movie discovery system

## 🏗️ Architecture

This project uses a **modular, feature-based structure** designed for scalability and easy integration of new features.

```
src/
├── features/                    # Feature modules (isolated & independent)
│   ├── rag-chatbot/            # RAG Chatbot feature
│   │   ├── components/         # UI components
│   │   ├── lib/                # Business logic & services
│   │   └── store/              # State management
│   ├── movies/                 # Movie Recommendations feature
│   │   ├── components/         # UI components
│   │   ├── lib/                # API & utilities
│   │   └── types/              # TypeScript types
│   └── shared/                 # Shared utilities
│       ├── components/
│       ├── lib/
│       └── hooks/
└── app/                        # Next.js routes
    ├── (rag-chatbot routes)
    └── movies/
```

### Why Feature-Based Architecture?

✅ **Clear Boundaries** - Each feature is self-contained  
✅ **Easy to Scale** - Add new features without conflicts  
✅ **Team Collaboration** - Multiple teams can work independently  
✅ **Maintainable** - Easy to locate and modify code  
✅ **Reusable** - Share common utilities via `features/shared/`

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# RAG Chatbot API
NEXT_PUBLIC_API_URL=your_rag_api_url

# Movie Recommendation API
NEXT_PUBLIC_MOVIE_API_URL=your_movie_api_url
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

### Features

#### RAG Chatbot (`/features/rag-chatbot/`)
- Authentication & user management
- AI chat interface with multiple models
- PDF document upload & processing
- Admin panel

**Routes:**
- `/` - Home
- `/login` - Login
- `/signup` - Signup
- `/chat` - Chat interface
- `/profile` - User profile
- `/admin/pdf` - PDF management

#### Movies (`/features/movies/`)
- Browse 10,000+ movies
- Search by title, genre, cast
- Select movies & get AI recommendations
- View detailed movie information

**Routes:**
- `/movies` - Browse & select movies
- `/movies/movie/:title` - Movie details
- `/movies/recommendations` - Personalized recommendations

## 🔧 Adding a New Feature

1. **Create feature folder:**
```bash
mkdir -p src/features/new-feature/{components,lib,types}
```

2. **Add your code** in the feature folder

3. **Create index file** for exports:
```typescript
// src/features/new-feature/index.ts
export * from './components';
export * from './lib';
```

4. **Add routes** in `src/app/new-feature/`

5. **Import using aliases:**
```javascript
import { Component } from '@/features/new-feature/components/Component';
```

## 📦 Tech Stack

- **Framework:** Next.js 15.5.9 (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **State:** Zustand (RAG Chatbot)
- **Language:** JavaScript + TypeScript

## 🌐 Deployment

Deployed at: `https://portfolio.mindefy.tech/`

**URL Structure:**
- RAG Chatbot: `https://portfolio.mindefy.tech/*`
- Movies: `https://portfolio.mindefy.tech/movies/*`

## 📚 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed architecture guide
- [MOVIES_INTEGRATION.md](./MOVIES_INTEGRATION.md) - Movie feature documentation
