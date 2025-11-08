# 🔐 Environment Variables Guide

## Overview
This guide documents all environment variables for the Harness Hero platform, including the new analytics, A/B testing, recommendations, and performance monitoring features.

---

## 📁 File Structure

```
/
├── .env.example                    # Root-level shared config (documentation)
├── apps/web/env.template          # Frontend environment template
├── apps/web/.env.local            # Frontend local config (gitignored)
└── services/backend/env.template  # Backend environment template
    └── services/backend/.env      # Backend local config (gitignored)
```

---

## 🌐 Frontend Environment Variables

**File:** `apps/web/.env.local` (copy from `env.template`)

### **Analytics & Tracking**

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Get from: https://analytics.google.com/ > Admin > Data Streams > Measurement ID

# Mixpanel
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
# Get from: https://mixpanel.com/ > Project Settings > Token

# Segment
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your_segment_key
# Get from: https://app.segment.com/ > Sources > Write Key
```

### **Performance Monitoring**

```bash
# Enable Web Vitals tracking
NEXT_PUBLIC_ENABLE_WEB_VITALS=true

# Enable performance monitoring in production
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

### **A/B Testing & Experiments**

```bash
# Enable experimentation framework
NEXT_PUBLIC_ENABLE_EXPERIMENTS=true

# Optional: Remote experiment configuration endpoint
NEXT_PUBLIC_EXPERIMENTS_API_URL=https://api.example.com/experiments
```

### **Feature Flags**

```bash
# Enable AI-powered recommendations
NEXT_PUBLIC_ENABLE_ML_RECOMMENDATIONS=true

# Enable product comparison
NEXT_PUBLIC_ENABLE_COMPARISON=true

# Enable social sharing
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=true

# Enable first-time onboarding
NEXT_PUBLIC_ENABLE_ONBOARDING=true
```

### **Social Sharing**

```bash
# URL shortener API (optional)
NEXT_PUBLIC_SHORT_URL_API=https://api.short.io/links

# Social media metadata
NEXT_PUBLIC_TWITTER_SITE=@harnesshero
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### **Personalization**

```bash
# Enable user preference learning
NEXT_PUBLIC_ENABLE_PREFERENCE_LEARNING=true

# Maximum recommendations to show
NEXT_PUBLIC_MAX_RECOMMENDATIONS=6
```

### **Development & Debugging**

```bash
# Enable detailed console logging (development only)
NEXT_PUBLIC_DEBUG_ANALYTICS=false
NEXT_PUBLIC_DEBUG_EXPERIMENTS=false
NEXT_PUBLIC_DEBUG_PERFORMANCE=false
```

---

## 🔧 Backend Environment Variables

**File:** `services/backend/.env` (copy from `env.template`)

### **Analytics & Tracking**

```bash
# Server-side analytics tokens
MIXPANEL_SERVER_TOKEN=your_server_token
SEGMENT_SERVER_WRITE_KEY=your_server_key

# Analytics batch processing
ANALYTICS_BATCH_SIZE=100
ANALYTICS_FLUSH_INTERVAL_MS=10000
```

### **Performance Monitoring**

```bash
# Enable server performance monitoring
ENABLE_PERFORMANCE_MONITORING=true

# Performance metrics endpoint (optional)
PERFORMANCE_METRICS_ENDPOINT=https://metrics.example.com

# Slow query threshold (milliseconds)
SLOW_QUERY_THRESHOLD_MS=1000
```

### **A/B Testing & Experiments**

```bash
# Experiment configuration URL (optional)
EXPERIMENTS_CONFIG_URL=https://api.example.com/config

# Enable experiment result tracking
ENABLE_EXPERIMENT_TRACKING=true
```

### **Recommendations Engine**

```bash
# Enable ML recommendations
ENABLE_ML_RECOMMENDATIONS=true

# Advanced ML model endpoint (optional)
ML_MODEL_ENDPOINT=https://ml.example.com/recommend

# Recommendation cache TTL (seconds)
RECOMMENDATION_CACHE_TTL=3600
```

### **Logging**

```bash
# Log level: error, warn, info, debug, trace
LOG_LEVEL=info

# Enable structured logging
STRUCTURED_LOGGING=true

# Log analytics events
LOG_ANALYTICS_EVENTS=false
```

---

## 🚀 Quick Setup Guide

### **Step 1: Copy Template Files**

```bash
# Frontend
cp apps/web/env.template apps/web/.env.local

# Backend
cp services/backend/env.template services/backend/.env
```

### **Step 2: Get Analytics Credentials**

#### **Google Analytics 4:**
1. Go to https://analytics.google.com/
2. Admin > Data Streams > Web
3. Copy "Measurement ID" (starts with G-)
4. Add to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

#### **Mixpanel:**
1. Go to https://mixpanel.com/
2. Project Settings > Project Token
3. Copy token
4. Add to `NEXT_PUBLIC_MIXPANEL_TOKEN`
5. For server-side: Get Server Token and add to `MIXPANEL_SERVER_TOKEN`

#### **Segment:**
1. Go to https://app.segment.com/
2. Sources > [Your Source] > Settings
3. Copy "Write Key"
4. Add to `NEXT_PUBLIC_SEGMENT_WRITE_KEY`

### **Step 3: Configure Feature Flags**

Enable/disable features by setting to `true` or `false`:

```bash
# Enable all new features
NEXT_PUBLIC_ENABLE_ML_RECOMMENDATIONS=true
NEXT_PUBLIC_ENABLE_COMPARISON=true
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=true
NEXT_PUBLIC_ENABLE_ONBOARDING=true
NEXT_PUBLIC_ENABLE_EXPERIMENTS=true
```

### **Step 4: Install Dependencies**

```bash
# Install web-vitals for performance monitoring
npm install web-vitals
```

---

## 📊 Analytics Provider Setup

### **Option 1: Google Analytics 4 (Recommended)**

**Pros:**
- Free tier available
- Familiar interface
- Good reporting tools
- BigQuery integration

**Setup:**
```tsx
// app/layout.tsx
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
  `}
</Script>
```

### **Option 2: Mixpanel**

**Pros:**
- Detailed user analytics
- Funnel analysis
- Cohort tracking
- A/B test results

**Setup:**
```tsx
// app/layout.tsx
<Script id="mixpanel" strategy="afterInteractive">
  {`
    (function(f,b){/* Mixpanel snippet */})();
    mixpanel.init("${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}");
  `}
</Script>
```

### **Option 3: Segment (Multiple Destinations)**

**Pros:**
- Send data to multiple tools
- Centralized tracking
- Clean implementation

**Setup:**
```tsx
// Use Segment to forward to GA4, Mixpanel, etc.
```

---

## 🧪 A/B Testing Configuration

### **Local Testing (No Config Needed)**

The experimentation framework works out of the box using localStorage:

```tsx
import { experiments } from '@/lib/experiments';

// Get variant
const variant = experiments.getVariant('onboarding_v1');
```

### **Remote Configuration (Optional)**

Set up a remote config endpoint:

```bash
NEXT_PUBLIC_EXPERIMENTS_API_URL=https://api.example.com/experiments
```

**Expected API Response:**
```json
{
  "experiments": [
    {
      "id": "onboarding_v1",
      "name": "Onboarding Flow Test",
      "variants": ["control", "variant_a", "variant_b"],
      "active": true,
      "targetPercentage": 100
    }
  ]
}
```

---

## 🤖 ML Recommendations Setup

### **Basic Setup (No Config Needed)**

The recommendation engine works client-side:

```tsx
import { recommendationEngine } from '@/lib/recommendations';

const recommended = recommendationEngine.getRecommendations(products);
```

### **Advanced ML (Optional)**

Connect to a machine learning service:

```bash
# Backend
ML_MODEL_ENDPOINT=https://ml.example.com/recommend
```

**Expected API Format:**
```json
POST /recommend
{
  "userId": "user_123",
  "context": {
    "currentProduct": "product_456",
    "cartItems": ["product_789"]
  }
}

Response:
{
  "recommendations": ["product_111", "product_222", "product_333"]
}
```

---

## 🔒 Security Best Practices

### **DO:**
✅ Use `.env.local` for sensitive keys (gitignored)  
✅ Use `NEXT_PUBLIC_` prefix ONLY for client-safe variables  
✅ Rotate secrets regularly  
✅ Use different keys for dev/staging/prod  
✅ Store production secrets in Vercel/environment  

### **DON'T:**
❌ Commit `.env.local` or `.env` files  
❌ Use `NEXT_PUBLIC_` for API keys or secrets  
❌ Share credentials in code or Slack  
❌ Use the same secrets across environments  

---

## 🌍 Environment-Specific Configuration

### **Development**
```bash
NODE_ENV=development
NEXT_PUBLIC_DEBUG_ANALYTICS=true
NEXT_PUBLIC_DEBUG_EXPERIMENTS=true
```

### **Staging**
```bash
NODE_ENV=production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-STAGING-ID
NEXT_PUBLIC_DEBUG_ANALYTICS=false
```

### **Production**
```bash
NODE_ENV=production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PRODUCTION-ID
NEXT_PUBLIC_DEBUG_ANALYTICS=false
NEXT_PUBLIC_DEBUG_EXPERIMENTS=false
```

---

## 📝 Validation Checklist

Before deploying, verify:

- [ ] All required variables are set
- [ ] Analytics tokens are valid
- [ ] Feature flags are configured correctly
- [ ] No secrets in `NEXT_PUBLIC_` variables
- [ ] `.env.local` is in `.gitignore`
- [ ] Production uses production credentials
- [ ] Debug flags are disabled in production

---

## 🆘 Troubleshooting

### **Analytics not tracking**
1. Check console for errors
2. Verify token format (GA4: G-XXXXXXXX)
3. Enable debug mode: `NEXT_PUBLIC_DEBUG_ANALYTICS=true`
4. Check browser ad blockers

### **A/B tests not working**
1. Check localStorage in DevTools
2. Verify experiment is active in config
3. Clear localStorage and retry
4. Enable debug: `NEXT_PUBLIC_DEBUG_EXPERIMENTS=true`

### **Recommendations not showing**
1. Check if products array is populated
2. Verify feature flag is enabled
3. Check browser console for errors
4. Ensure localStorage isn't full

### **Performance monitoring not working**
1. Install `web-vitals`: `npm install web-vitals`
2. Verify `NEXT_PUBLIC_ENABLE_WEB_VITALS=true`
3. Check Network tab for analytics requests
4. Test with real user interaction (not bot)

---

## 📚 Additional Resources

- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9304153)
- [Mixpanel Documentation](https://developer.mixpanel.com/docs)
- [Segment Sources](https://segment.com/docs/connections/sources/)
- [Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Summary

**New Variables Added:**
- ✅ 3 Analytics providers (GA4, Mixpanel, Segment)
- ✅ Performance monitoring configuration
- ✅ A/B testing framework settings
- ✅ ML recommendations configuration
- ✅ Social sharing settings
- ✅ Feature flags for all new features
- ✅ Debug flags for development

**Total New Variables:** 25+  
**Files Updated:** 3 (frontend template, backend template, root example)  
**Documentation:** Complete ✨

All environment variables are now properly documented and templated!
