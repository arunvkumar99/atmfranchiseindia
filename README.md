# 🏧 ATM Franchise India - Business Website

[![Deploy Status](https://img.shields.io/badge/deploy-ready-green)](https://github.com/arunvkumar99/atmfranchiseindia)
[![License](https://img.shields.io/badge/license-proprietary-red)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/tech-React%20%2B%20TypeScript-blue)](package.json)
[![Languages](https://img.shields.io/badge/languages-13-orange)](src/lib/i18n.ts)

A modern, high-performance website for ATM franchise opportunities in India. Built with React, TypeScript, and direct Google Sheets integration for zero database costs.

## ✨ Key Features

- 🌐 **13 Indian Languages** - Full multilingual support with i18next
- 📊 **Direct Google Sheets** - No database required
- 📱 **Mobile Responsive** - Optimized for all devices
- 🔌 **Offline Support** - Forms work without internet
- 🚀 **Lightning Fast** - <3s load time on 3G
- 🔒 **Enterprise Security** - Input sanitization, rate limiting
- 💰 **Cost Efficient** - ~$1/month operational cost
- 🔄 **Language Persistence** - Maintains selection across navigation

## 🏗️ Architecture

```
Frontend (React) → Serverless API → Google Sheets
```

- **No Database** - Direct Google Sheets integration saves $500-1000/year
- **Serverless** - API functions on Vercel/Netlify
- **JAMstack** - JavaScript, APIs, and Markup
- **CDN Delivery** - Global edge network

## 📚 Documentation

All project documentation is organized in the `/docs` folder:

### Core Documentation
- [CLAUDE.md](CLAUDE.md) - AI Assistant context and guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes

### Detailed Documentation (`/docs`)
- **[Architecture](docs/architecture/)** - System design and technical architecture
- **[Translation](docs/translation/)** - Multi-language implementation guides
  - [Implementation Lessons](docs/translation/learnings/HINDI_IMPLEMENTATION_LESSONS.md) - Key learnings from Hindi
  - [Multi-Language Strategy](docs/translation/MULTI_LANGUAGE_STRATEGY.md) - Future language roadmap
- **[Development](docs/development/)** - Setup, deployment, and security guides
- **[Daily Reports](docs/daily-reports/)** - Day-by-day implementation progress
- **[Quality](docs/quality/)** - Quality improvements and metrics
- **[Team](docs/team/)** - Team documentation and plans
- **[Project](docs/project/)** - Project summaries and overviews

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Account (for Sheets API)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/arunvkumar99/atmfranchiseindia.git
cd atmfranchiseindia

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit http://localhost:8080

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Google Sheets API
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@account.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Security
ALLOWED_ORIGINS=https://atmfranchiseindia.com
NODE_ENV=production

# Optional
ADMIN_EMAIL=admin@atmfranchiseindia.com
JWT_SECRET=your-secret-key
```

### Google Sheets Setup

1. **Create Service Account**
   ```bash
   # Go to Google Cloud Console
   # Create new project → Enable Sheets API
   # Create service account → Download JSON key
   ```

2. **Share Your Sheet**
   - Open your Google Sheet
   - Share with service account email
   - Give Editor permission

3. **Configure Sheet ID**
   - Copy ID from sheet URL
   - Add to `.env` file

## 📝 Available Scripts

```bash
npm run dev        # Start development server (port 8080)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format with Prettier
```

## 🌍 Multilingual Support

### Supported Languages
- 🇺🇸 English (en)
- 🇮🇳 Hindi (हिन्दी)
- 🇧🇩 Bengali (বাংলা)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Gujarati (ગુજરાતી)
- 🇵🇰 Urdu (اردو)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Odia (ଓଡ଼ିଆ)
- 🇮🇳 Punjabi (ਪੰਜਾਬੀ)
- 🇮🇳 Assamese (অসমীয়া)
- 🇮🇳 Malayalam (മലയാളം)

### Translation Files
```
public/locales/
  ├── en/
  │   ├── common.json
  │   ├── forms.json
  │   ├── home.json
  │   └── products.json
  └── [other languages]/
```

## 📊 Forms & Data Flow

### Available Forms
1. **Contact Form** - General inquiries
2. **Franchise Application** - ATM franchise requests
3. **Agent Application** - Become an agent
4. **Influencer Application** - Partnership opportunities
5. **Location Submission** - Submit ATM locations
6. **Job Application** - Career opportunities

### Data Flow
```
User Input → Validation → Rate Limiting → Google Sheets
     ↓
Offline Queue (if no internet) → Retry when online
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/arunvkumar99/atmfranchiseindia)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/arunvkumar99/atmfranchiseindia)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 📈 Performance

### Metrics
- **Lighthouse Score:** 95+
- **Bundle Size:** <250KB gzipped
- **First Paint:** <1.5s
- **Time to Interactive:** <3s
- **Core Web Vitals:** All green

### Optimizations
- Code splitting per route
- Lazy loading components
- Image optimization
- CDN delivery
- Brotli compression

## 🔒 Security

### Features
- ✅ Input sanitization (XSS protection)
- ✅ Rate limiting (3 requests/hour)
- ✅ CORS restrictions
- ✅ Environment variables for secrets
- ✅ HTTPS enforced
- ✅ Content Security Policy

### Best Practices
- No hardcoded credentials
- Secure headers via middleware
- Regular dependency updates
- Error boundary protection

## 💰 Cost Analysis

### Current Setup (Monthly)
| Service | Cost |
|---------|------|
| Hosting (Vercel) | $0 |
| Google Sheets | $0 |
| Domain | ~$1 |
| **Total** | **~$1** |

### Savings vs Traditional
- Database: -$25-50/month
- Backend hosting: -$10-20/month
- **Annual Savings: $500-1000**

## 📁 Project Structure

```
atmfranchiseindia/
├── public/
│   ├── assets/           # Static assets
│   └── locales/         # Translation files
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Base UI components
│   │   └── forms/      # Form components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities & services
│   ├── hooks/          # Custom React hooks
│   └── App.tsx         # Main app component
├── api/                # Serverless functions
└── docs/               # Documentation
```

## 🧪 Testing

```bash
# Run tests (when added)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

- **Email:** support@atmfranchiseindia.com
- **Phone:** +91-9072380076
- **GitHub Issues:** [Create Issue](https://github.com/arunvkumar99/atmfranchiseindia/issues)

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📊 Status

- **Version:** 2.0.0
- **Status:** Production Ready
- **Last Updated:** December 2024
- **Maintainer:** ATM Franchise India Team

---

**🚀 Ready for Production Deployment**

Built with modern web technologies for optimal performance and user experience.