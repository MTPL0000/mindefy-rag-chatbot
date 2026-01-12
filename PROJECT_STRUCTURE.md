# Project Structure - Multi-Feature Architecture

This project uses a **feature-based architecture** to organize code by business domain, making it easy to:
- Identify which code belongs to which feature
- Add new features without conflicts
- Maintain and scale individual features independently
- Share common utilities across features

## New Folder Structure

```
src/
├── features/                      # Feature-based modules
│   ├── rag-chatbot/              # RAG Chatbot feature
│   │   ├── components/           # Chatbot-specific components
│   │   │   ├── Button.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SocialLoginButtons.jsx
│   │   │   └── ConfirmationModal.jsx
│   │   ├── lib/                  # Chatbot-specific utilities
│   │   │   ├── api-service.js
│   │   │   ├── auth-service.js
│   │   │   ├── chat-service.js
│   │   │   └── pdf-service.js
│   │   ├── store/                # Chatbot state management
│   │   │   ├── authStore.js
│   │   │   └── chatStore.js
│   │   └── index.js              # Public exports
│   │
│   ├── movies/                   # Movie Recommendation feature
│   │   ├── components/           # Movie-specific components
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MoviePoster.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Dropdown.tsx
│   │   ├── lib/                  # Movie-specific utilities
│   │   │   ├── api.ts
│   │   │   ├── movieCache.ts
│   │   │   └── mockData.ts
│   │   ├── types/                # Movie-specific types
│   │   │   └── movie.ts
│   │   └── index.ts              # Public exports
│   │
│   └── shared/                   # Shared utilities across features
│       ├── components/           # Shared components
│       ├── lib/                  # Shared utilities
│       ├── hooks/                # Shared React hooks
│       └── types/                # Shared TypeScript types
│
├── app/                          # Next.js App Router
│   ├── (rag-chatbot)/           # RAG Chatbot routes (route group)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── chat/
│   │   ├── profile/
│   │   ├── admin/
│   │   └── auth/
│   │
│   ├── movies/                   # Movie routes
│   │   ├── page.jsx
│   │   ├── layout.jsx
│   │   ├── movie/[id]/
│   │   └── recommendations/
│   │
│   ├── layout.js                 # Root layout
│   └── page.jsx                  # Home page
│
└── globals.css                   # Global styles

```

## Benefits of This Structure

### 1. **Clear Feature Boundaries**
Each feature has its own folder with all related code:
- Components
- Business logic
- API services
- Types/interfaces
- State management

### 2. **Easy to Add New Features**
To add a new feature (e.g., "blog", "analytics"):
```
src/features/blog/
├── components/
├── lib/
├── types/
└── index.ts
```

### 3. **No Import Confusion**
```javascript
// Clear feature-based imports
import { MovieCard } from '@/features/movies/components/MovieCard'
import { Button } from '@/features/rag-chatbot/components/Button'
import { useAuth } from '@/features/shared/hooks/useAuth'
```

### 4. **Independent Deployment**
Features can be:
- Developed independently
- Tested in isolation
- Deployed separately (if needed)
- Removed without affecting others

### 5. **Team Collaboration**
Different teams can work on different features without conflicts:
- Team A works on `features/rag-chatbot/`
- Team B works on `features/movies/`
- Minimal merge conflicts

## Import Path Aliases

Configure in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/app/*": ["./src/app/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

## Adding a New Feature

1. Create feature folder:
   ```bash
   mkdir -p src/features/new-feature/{components,lib,types}
   ```

2. Add feature code in isolated folder

3. Create index file for public API:
   ```typescript
   // src/features/new-feature/index.ts
   export * from './components'
   export * from './lib'
   ```

4. Add routes in `app/new-feature/`

5. Update environment variables if needed

## Migration Status

- ✅ Movie feature organized in `features/movies/`
- 🔄 RAG Chatbot being reorganized into `features/rag-chatbot/`
- 📋 Shared utilities to be moved to `features/shared/`
