# Multi-Domain Setup with Next.js Middleware

This guide explains how to deploy your project with separate domains using Next.js middleware.

## How It Works

The middleware intercepts requests and redirects to appropriate domains based on the route:

- **Main Domain** (`mindefy.com`) → Landing page only
- **AskDocs Domain** (`askdocs.mindefy.com`) → `/login`, `/signup`, `/chat`, `/admin`
- **CineSense Domain** (`cinesense.mindefy.com`) → `/movies`, `/recommendations`

## Setup Instructions

### 1. Configure Environment Variables

Create `.env.local` for local development:

```bash
# Copy the example file
cp .env.local.example .env.local
```

For **local development**, use:
```env
NEXT_PUBLIC_MAIN_DOMAIN=http://localhost:3000
NEXT_PUBLIC_ASKDOCS_DOMAIN=http://localhost:3000
NEXT_PUBLIC_CINESENSE_DOMAIN=http://localhost:3000
```

For **production** (set in Vercel dashboard):
```env
NEXT_PUBLIC_MAIN_DOMAIN=https://mindefy.com
NEXT_PUBLIC_ASKDOCS_DOMAIN=https://askdocs.mindefy.com
NEXT_PUBLIC_CINESENSE_DOMAIN=https://cinesense.mindefy.com
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Add Domains in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add these domains:
   - `mindefy.com` (or your main domain)
   - `askdocs.mindefy.com`
   - `cinesense.mindefy.com`

### 4. Configure DNS

Add these DNS records at your domain provider:

```
Type    Name        Value                   TTL
A       @           76.76.21.21            Auto
CNAME   askdocs     cname.vercel-dns.com   Auto
CNAME   cinesense   cname.vercel-dns.com   Auto
```

### 5. Set Environment Variables in Vercel

1. Go to **Settings** → **Environment Variables**
2. Add the production environment variables (see step 1)
3. Make sure to add them for **Production**, **Preview**, and **Development** environments

## Middleware Behavior

### On Main Domain (`mindefy.com`)

| User Clicks | Middleware Action |
|------------|------------------|
| AskDocs card (`/login`) | Redirects to `https://askdocs.mindefy.com/login` |
| CineSense card (`/movies`) | Redirects to `https://cinesense.mindefy.com/movies` |
| Landing page (`/`) | Shows landing page (no redirect) |

### On AskDocs Domain (`askdocs.mindefy.com`)

| User Visits | Middleware Action |
|------------|------------------|
| Root (`/`) | Redirects to `/login` |
| `/login` | Shows login page |
| `/signup` | Shows signup page |
| `/chat` | Shows chat interface |
| `/admin/pdf` | Shows knowledge base management |
| `/profile` | Shows user profile |
| `/auth/google/callback` | Handles Google OAuth callback |
| `/movies` or `/recommendations` | Redirects back to main domain |

**All AskDocs Routes Covered:**
- `/login` - Login page
- `/signup` - Signup page
- `/chat` - RAG chatbot interface
- `/admin/*` - Admin pages (knowledge base management)
- `/profile` - User profile
- `/auth/*` - Authentication callbacks (Google OAuth, etc.)

### On CineSense Domain (`cinesense.mindefy.com`)

| User Visits | Middleware Action |
|------------|------------------|
| Root (`/`) | Redirects to `/movies` |
| `/movies` | Shows movie listing page |
| `/movies/movie/[id]` | Shows individual movie details |
| `/recommendations` | Shows personalized recommendations |
| `/login`, `/signup`, `/chat`, `/admin`, `/profile` | Redirects back to main domain |

**All CineSense Routes Covered:**
- `/movies` - Movie listing and search
- `/movies/movie/[id]` - Individual movie details page
- `/recommendations` - Personalized movie recommendations

## Local Development

When developing locally:

1. All routes work on `localhost:3000`
2. No redirects happen (since all domains point to localhost)
3. You can test all features without domain setup

## Testing in Production

After deployment:

1. Visit `https://mindefy.com`
   - Should show landing page
   
2. Click **AskDocs** card
   - Should redirect to `https://askdocs.mindefy.com/login`
   
3. Click **CineSense** card
   - Should redirect to `https://cinesense.mindefy.com/movies`

4. Visit `https://askdocs.mindefy.com`
   - Should automatically redirect to `/login`
   
5. Visit `https://cinesense.mindefy.com`
   - Should automatically redirect to `/movies`

## Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that environment variables are set correctly in Vercel. Make sure domains don't have trailing slashes.

### Issue: 404 errors on subdomain
**Solution**: 
1. Verify domain is added in Vercel dashboard
2. Check DNS records are properly configured
3. Wait for DNS propagation (can take up to 48 hours)

### Issue: Middleware not working
**Solution**:
1. Check `middleware.js` is in the root directory (not in `src/`)
2. Verify the `matcher` config in middleware
3. Check Vercel deployment logs for errors

### Issue: CORS errors between domains
**Solution**: Configure your backend API to allow requests from all subdomains:
```javascript
Access-Control-Allow-Origin: https://*.mindefy.com
```

### Issue: Authentication not persisting across domains
**Solution**: Set cookies with the parent domain:
```javascript
// In your auth code
document.cookie = "token=...; domain=.mindefy.com; path=/";
```

## How Middleware Works

### Automatic Execution

**Important**: Next.js middleware is **automatically executed** - you don't need to import or call it anywhere!

- **File location**: `middleware.js` must be in the **root directory** (same level as `src/`)
- **Auto-detection**: Next.js automatically detects and runs this file on every request
- **No imports needed**: The middleware runs before any page loads

### Execution Flow

The `middleware.js` file:

1. **Intercepts all requests** before they reach your pages
2. **Checks the hostname** to determine which domain the user is on
3. **Checks the pathname** to see what route they're accessing
4. **Redirects if needed** based on the rules defined
5. **Allows the request** to continue if no redirect is needed

### Dynamic Route Handling

The middleware uses `path.startsWith()` to match routes, which means:

- `/movies` → Matches all routes starting with `/movies`
  - `/movies` ✅
  - `/movies/movie/Inception` ✅ (dynamic route)
  - `/movies/recommendations` ✅
  
- `/admin` → Matches all routes starting with `/admin`
  - `/admin` ✅
  - `/admin/pdf` ✅
  
This approach automatically covers:
- **Dynamic routes**: `/movies/movie/[id]` 
- **Nested routes**: `/admin/pdf`, `/auth/google/callback`
- **Query parameters**: `/movies?search=action`

## Benefits of This Approach

✅ **Single Codebase**: All projects in one repository  
✅ **Shared Components**: Reuse components across projects  
✅ **Easy Development**: Test everything on localhost  
✅ **SEO Friendly**: Each project has its own domain  
✅ **Clean URLs**: Users see project-specific domains  
✅ **Automatic Routing**: Middleware handles all redirects  

## Alternative: Separate Deployments

If you prefer completely separate deployments, you would need to:

1. Split the codebase into 3 separate repositories
2. Deploy each independently
3. Manually manage shared code/components
4. Update landing page to use full external URLs

The middleware approach is recommended for easier maintenance and development.
