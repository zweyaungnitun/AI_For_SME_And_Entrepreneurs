# Netlify Deployment Guide

Complete guide for deploying Foundry to Netlify.

---

## Quick Start

### 1. Connect Repository

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub: `zweyaungnitun/AI_For_SME_And_Entrepreneurs`
4. Netlify auto-detects Next.js configuration

### 2. Configure Build Settings

Netlify will auto-detect from `netlify.toml`, but verify:

```
Build command: npm run build
Publish directory: .next
Node version: 20
```

### 3. Set Environment Variables

**Optional (for full features):**

```bash
# AI/LLM (leave empty for demo mode)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-thinking-exp-01-21
GEMINI_EMBED_MODEL=text-embedding-004

# Database (leave empty for in-memory mode)
DATABASE_URL=your_neon_connection_string

# Google Drive Integration (optional)
GOOGLE_DRIVE_ENABLED=false
```

**How to set:**
1. Site settings → Environment variables
2. Add each variable
3. Redeploy

### 4. Deploy

Click "Deploy site" and wait 3-5 minutes.

---

## Deployment Modes

### Demo Mode (No API Keys)
✅ **Works out of the box**
- Heuristic planner
- Specialist `demo()` functions
- Local tools only
- No database required
- Perfect for testing/demos

**Features Available:**
- ✅ Dashboard
- ✅ Agent console (demo responses)
- ✅ Financial tools
- ✅ Document upload (parsing only)
- ⚠️ No vector search
- ⚠️ No persistent sessions

### Production Mode (With API Keys)
🚀 **Full functionality**
- Live Gemini responses
- Vector search (RAG)
- Database persistence
- Session management
- Multi-tenant isolation

**Requires:**
- `GEMINI_API_KEY` — Google AI Studio API key
- `DATABASE_URL` — Neon PostgreSQL URL

---

## Configuration Files

### `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Key settings:
- **Node 20**: Required for Next.js 15
- **Next.js plugin**: Handles serverless functions
- **External modules**: Neon serverless driver

### `next.config.ts`

Already configured for:
- Server Components
- App Router
- Edge runtime compatible
- Serverless functions

---

## Post-Deployment Checklist

### Verify Core Features

1. **Landing Page** (`/`)
   - [ ] Loads correctly
   - [ ] "Enter workspace" works

2. **Business Selection** (`/enter`)
   - [ ] Lists demo businesses
   - [ ] Selects Daw Hla successfully

3. **Dashboard** (`/dashboard`)
   - [ ] Shows health banner
   - [ ] Displays metrics
   - [ ] Tabs work (Overview, Finance, etc.)

4. **Agent Console** (`/console`)
   - [ ] Ask: "What should I do today?"
   - [ ] Shows tool execution
   - [ ] Returns brief (demo or live)

5. **AI Advisor** (`/advisor`)
   - [ ] Chat interface loads
   - [ ] Guardrails display
   - [ ] Messages send/receive

6. **Admin Panel** (`/admin`)
   - [ ] Lists businesses
   - [ ] Google Drive page loads
   - [ ] Import page accessible

### Test Edge Cases

- [ ] Empty database (in-memory fallback)
- [ ] No API key (demo mode)
- [ ] Invalid session (creates new)
- [ ] Large file upload (size limits)

---

## Performance Optimization

### Build Optimization

**Already configured:**
- Server Components (reduce JS)
- Static generation where possible
- Image optimization
- Code splitting

**Netlify automatically:**
- Minifies JS/CSS
- Compresses assets (gzip/brotli)
- CDN distribution
- HTTP/2 push

### Runtime Optimization

**Database:**
- Connection pooling (Neon)
- Indexed queries
- Vector search cache

**API:**
- SSE for streaming
- Edge functions for speed
- Rate limiting built-in

### Monitoring

**Netlify Analytics:**
- Pageviews
- Unique visitors
- Top pages
- Bandwidth usage

**Custom Metrics:**
Add to your monitoring:
- Agent execution time
- Tool call duration
- LLM response latency
- Database query time

---

## Environment Setup

### Development → Staging → Production

**Development** (Local)
```bash
npm run dev
# Uses .env.local
```

**Staging** (Netlify Branch Deploy)
```bash
# Create staging branch
git checkout -b staging
git push origin staging

# Netlify auto-deploys branch
# URL: staging--your-site.netlify.app
```

**Production** (Netlify Main)
```bash
git push origin main
# Auto-deploys to: your-site.netlify.app
```

---

## Database Setup (Neon)

### Create Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project: "foundry-production"
3. Copy connection string

### Initialize Schema

**Option 1: Automatic (on first request)**
```typescript
// Already configured in src/lib/db/ensure.ts
// Schema auto-creates on first API call
```

**Option 2: Manual (psql)**
```bash
psql $DATABASE_URL < schema.sql
```

### Seed Demo Data

```bash
# Set DATABASE_URL in .env.local
npm run dev

# Visit /admin/import
# Or call API:
curl -X POST https://your-site.netlify.app/api/seed
```

---

## Google Drive Integration

### Setup MCP Server

1. **Install Cursor MCP** (development)
   ```bash
   npx @modelcontextprotocol/create-server gdrive
   ```

2. **Configure OAuth** (production)
   - Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect: `https://your-site.netlify.app/api/gdrive/callback`

3. **Set Environment Variable**
   ```bash
   GOOGLE_DRIVE_ENABLED=true
   ```

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Check package.json dependencies
npm install
```

**Error: "TypeScript errors"**
```bash
# Run type check locally first
npm run build
```

### Runtime Issues

**"Unable to connect to database"**
- Check `DATABASE_URL` format
- Verify Neon project is active
- Check connection limits

**"Gemini API error"**
- Verify API key is valid
- Check quota/billing in Google AI Studio
- Falls back to demo mode automatically

**"Session not found"**
- Normal on first visit
- Creates new session automatically
- Check `/enter` route works

### Performance Issues

**Slow page loads**
- Check Netlify function logs
- Verify database location (same region)
- Enable Neon connection pooling

**Vector search timeout**
- Check pgvector index exists
- Verify embedding dimension (768)
- Consider increasing lists in IVFFlat

---

## Security

### Already Configured

✅ **Headers** (in netlify.toml)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

✅ **Tenant Isolation**
- Session-scoped queries
- Shop-filtered data
- No cross-tenant leakage

✅ **Input Validation**
- Guardrails on AI input
- File type checking
- Size limits enforced

### Additional Security

**Recommended:**
1. Enable Netlify Identity (if auth needed)
2. Set up rate limiting on `/api/*`
3. Configure CORS headers
4. Add CSP headers
5. Enable audit logs

---

## Scaling Considerations

### Current Limits

**Netlify Free Tier:**
- 100 GB bandwidth/month
- 300 build minutes/month
- 125K serverless function requests/month

**Recommended Upgrade Path:**
- 100-1K users: Free tier OK
- 1K-10K users: Pro ($19/mo)
- 10K+ users: Business ($99/mo)

### Database Scaling

**Neon Limits:**
- Free: 10 GB storage, 0.5 GB RAM
- Pro: 50 GB storage, 4 GB RAM
- Scale: 200 GB storage, 8 GB RAM

**Vector Search:**
- Current: IVFFlat (100 lists)
- Scale: HNSW index
- Cache: Add Redis for hot embeddings

---

## Custom Domain

### Add Domain

1. Netlify: Site settings → Domain management
2. Add custom domain: `foundry.yourdomain.com`
3. Follow DNS instructions
4. SSL auto-provisions (Let's Encrypt)

### DNS Configuration

**For root domain:**
```
A record: 75.2.60.5
```

**For subdomain:**
```
CNAME: your-site.netlify.app
```

---

## Continuous Deployment

### Auto-Deploy on Push

✅ **Already configured**
- Push to `main` → Production deploy
- Push to other branches → Preview deploys
- Pull requests → Deploy previews

### Deploy Contexts

```toml
# netlify.toml
[context.production]
  environment = { GEMINI_API_KEY = "prod_key" }

[context.branch-deploy]
  environment = { GEMINI_API_KEY = "dev_key" }

[context.deploy-preview]
  environment = { GEMINI_API_KEY = "preview_key" }
```

---

## Monitoring & Logs

### Netlify Logs

**Function logs:**
```bash
netlify functions:log <function-name>
```

**Deploy logs:**
Site settings → Deploys → Deploy log

### Application Logs

**Server-side:**
```typescript
console.log() // Visible in function logs
console.error() // Visible in function logs
```

**Client-side:**
- Browser DevTools Console
- Netlify Analytics
- Sentry (optional)

---

## Rollback Procedure

If deployment breaks:

1. **Quick rollback:**
   - Netlify UI → Deploys → Previous deploy → "Publish deploy"

2. **Git revert:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Branch rollback:**
   ```bash
   git checkout <previous-commit>
   git push origin main --force
   ```

---

## Support Resources

### Netlify Docs
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Serverless Functions](https://docs.netlify.com/functions/overview/)

### Project Docs
- `AGENTS.md` — Multi-agent system
- `docs/DATABASE_RAG_ARCHITECTURE.md` — Database setup
- `docs/GOOGLE_DRIVE.md` — Drive integration
- `FEATURES.md` — Complete features

### External Services
- [Neon Docs](https://neon.tech/docs/introduction)
- [Google AI Studio](https://aistudio.google.com/apikey)
- [MCP Protocol](https://modelcontextprotocol.io/)

---

## Success!

Your Foundry deployment should now be live at:
**https://your-site.netlify.app**

Test the demo flow:
1. Visit `/enter`
2. Select "Daw Hla's Dry Goods"
3. Dashboard loads with health: WATCH
4. Console: Ask "What should I do today?"
5. Brief returns: Collect Ko Min first

**Ready for production!** 🚀
