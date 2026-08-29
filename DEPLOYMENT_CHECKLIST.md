# Deployment Checklist

Quick pre-deployment checklist for Netlify.

---

## ✅ Pre-Deployment

- [x] `netlify.toml` configured
- [x] Build script updated (removed turbopack flag)
- [x] Environment variables documented
- [x] `.gitignore` includes Netlify folders
- [x] All features tested locally
- [x] Documentation complete

## 📝 Netlify Setup Steps

### 1. Initial Setup (5 minutes)

1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com/)
   - "Add new site" → "Import existing project"
   - Select GitHub → `zweyaungnitun/AI_For_SME_And_Entrepreneurs`

2. **Verify Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Auto-detected from `netlify.toml` ✓

3. **Deploy**
   - Click "Deploy site"
   - Wait 3-5 minutes
   - Get URL: `https://[random-name].netlify.app`

### 2. Optional Configuration (10 minutes)

**For Full Features:**

Add environment variables in Netlify UI:

```bash
# Google AI (optional - demo mode without)
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.0-flash-thinking-exp-01-21
GEMINI_EMBED_MODEL=text-embedding-004

# Database (optional - in-memory without)
DATABASE_URL=postgresql://user:pass@host/db

# Google Drive (optional)
GOOGLE_DRIVE_ENABLED=false
```

**Steps:**
1. Site settings → Environment variables
2. Add key-value pairs
3. Trigger redeploy

### 3. Custom Domain (Optional, 5 minutes)

1. Site settings → Domain management → Add custom domain
2. Follow DNS instructions
3. SSL auto-provisions

---

## 🧪 Post-Deployment Testing

### Core Flow (3 minutes)

1. **Landing** → Visit `/`
   - [ ] Page loads
   - [ ] "Enter workspace" button works

2. **Select Business** → `/enter`
   - [ ] Lists demo businesses
   - [ ] Click "Daw Hla's Dry Goods"

3. **Dashboard** → `/dashboard`
   - [ ] Health banner: "WATCH"
   - [ ] Metrics display
   - [ ] Tabs work

4. **Console** → `/console`
   - [ ] Ask: "What should I do today?"
   - [ ] Tool execution shows
   - [ ] Brief returns (demo or live)

5. **AI Advisor** → `/advisor`
   - [ ] Chat interface
   - [ ] Send message
   - [ ] Response received

### Admin Features (2 minutes)

1. **Admin Panel** → `/admin`
   - [ ] Business list displays
   - [ ] Metrics show

2. **Google Drive** → `/admin/gdrive`
   - [ ] Connection UI loads
   - [ ] Instructions visible

3. **Import** → `/admin/import`
   - [ ] Upload form works
   - [ ] File preview displays

### Edge Cases (1 minute)

- [ ] Invalid route → 404 page
- [ ] Long query → Returns within 5s
- [ ] Empty session → Creates new
- [ ] Refresh page → State persists

---

## 🚨 Troubleshooting

### Build Fails

**Check logs:**
1. Netlify UI → Deploys → Failed build → Deploy log
2. Look for:
   - Module not found → `npm install` locally first
   - TypeScript errors → `npm run build` locally
   - Memory issues → Contact Netlify support

### Deployment Succeeds But Site Broken

**Check function logs:**
1. Netlify UI → Functions → View logs
2. Common issues:
   - Missing env vars → Add in UI
   - Database connection → Check `DATABASE_URL`
   - API key invalid → Verify in Google AI Studio

### Slow Performance

1. Check region: Database & Netlify same region?
2. Enable connection pooling: Neon dashboard
3. Monitor function duration: Netlify analytics

---

## 🎯 Production Checklist

Before announcing:

- [ ] All features tested on production URL
- [ ] Custom domain configured
- [ ] Environment variables set (if using paid features)
- [ ] Error monitoring enabled (optional: Sentry)
- [ ] Usage limits understood (Netlify free tier)
- [ ] Documentation reviewed
- [ ] Team has access to Netlify dashboard
- [ ] Backup strategy in place (git history)

---

## 📊 Monitoring

### Netlify Dashboard

**Key Metrics:**
- Deploys per day
- Build time
- Function invocations
- Bandwidth usage
- Error rate

### Application Health

**Monitor:**
- Agent execution time (<3s ideal)
- Database query latency (<100ms ideal)
- LLM response time (150-300ms for embeddings)
- Error rate (<1% target)

---

## 🔄 Updates & Maintenance

### Deploy New Version

```bash
# Make changes
git add .
git commit -m "feat: description"
git push origin main

# Netlify auto-deploys (3-5 min)
```

### Rollback

If something breaks:
1. Netlify UI → Deploys
2. Find last working deploy
3. Click "Publish deploy"

### Schedule Maintenance

1. Post in app/dashboard banner
2. Deploy during low-traffic (2-4 AM)
3. Monitor for 30 minutes post-deploy
4. Keep previous deploy ready for quick rollback

---

## 📚 Resources

**Documentation:**
- [Full Deployment Guide](./NETLIFY_DEPLOYMENT.md)
- [Features Reference](../FEATURES.md)
- [Architecture Overview](./DATABASE_RAG_ARCHITECTURE.md)

**External:**
- [Netlify Docs](https://docs.netlify.com/)
- [Next.js 15 on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Neon Database](https://neon.tech/docs)

**Support:**
- Netlify: support@netlify.com
- GitHub Issues: Project repository

---

## ✨ Success Criteria

Your deployment is successful when:

✅ Main URL loads in <2 seconds  
✅ Demo flow completes without errors  
✅ Admin panel accessible  
✅ All tabs/navigation work  
✅ Error handling graceful  
✅ Mobile responsive  
✅ HTTPS enabled  
✅ No console errors  

**Ready for users!** 🎉

---

## 🚀 Next Steps After Deployment

1. **Test with real users**
   - Share URL with 5-10 users
   - Collect feedback
   - Monitor error logs

2. **Set up monitoring**
   - Add Sentry (errors)
   - Add PostHog (analytics)
   - Set up alerts

3. **Optimize performance**
   - Enable Netlify Analytics
   - Review slow functions
   - Optimize database queries

4. **Scale as needed**
   - Upgrade Netlify plan when hitting limits
   - Scale Neon database
   - Add Redis cache if needed
