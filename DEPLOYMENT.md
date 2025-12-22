# Deployment Guide

## Deployment Overview

This guide covers deploying the Mental Health Consultation Platform to production environments.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates obtained
- [ ] Razorpay production credentials ready
- [ ] Email service configured (optional)
- [ ] Backup strategy in place
- [ ] Monitoring setup configured
- [ ] Load balancing configured (if needed)

## Environment Variables for Production

Create a production `.env` file with:

```env
# Database
DATABASE_URL="postgresql://prod_user:secure_password@prod-db-host:5432/mental_health_prod"

# JWT
JWT_SECRET="generate_a_very_long_random_string_here"
JWT_EXPIRY="7d"

# Server
PORT=5000
NODE_ENV="production"

# Frontend
FRONTEND_URL="https://yourdomain.com"

# Razorpay (Production)
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_live_secret_key"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASSWORD="your_app_password"
SENDER_EMAIL="noreply@yourdomain.com"

# File Upload
UPLOAD_DIR="/var/uploads"
MAX_FILE_SIZE=5242880
```

## Backend Deployment

### Option 1: Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set RAZORPAY_KEY_ID=your_key
heroku config:set RAZORPAY_KEY_SECRET=your_secret

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma db push
```

### Option 2: Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Set variables
railway variables set JWT_SECRET=your_secret_key
```

### Option 3: Deploy to AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd mental-health-app/server

# Install dependencies
npm install

# Configure environment
nano .env
# Add production values

# Setup database
npx prisma db push

# Start with PM2
pm2 start src/server.js --name "mental-health-api"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo amazon-linux-extras install nginx1 -y
sudo systemctl start nginx
```

### Option 4: Deploy to DigitalOcean App Platform

```bash
# Create app.yaml in root directory
name: mental-health-api
services:
- name: api
  github:
    repo: your-username/mental-health-app
    branch: main
  build_command: cd server && npm install
  run_command: cd server && npm start
  http_port: 5000
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${JWT_SECRET}
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}

databases:
- name: db
  engine: PG
  production: true
```

## Frontend Deployment

### Option 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd client
vercel --prod

# Configure environment variables in Vercel dashboard
# VITE_API_URL=https://your-api-domain.com/api
```

### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd client
netlify deploy --prod --dir=dist

# After first deploy, set environment variables
# VITE_API_URL=https://your-api-domain.com/api
```

### Option 3: Deploy to GitHub Pages

```bash
# Update vite.config.js base path
# base: '/mental-health-app/'

# Build
cd client
npm run build

# Deploy to gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

npm run deploy
```

### Option 4: Deploy to AWS S3 + CloudFront

```bash
# Build frontend
cd client
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Database Setup (Production)

### PostgreSQL on AWS RDS

```bash
# Create RDS instance via AWS Console
# Get endpoint: your-db.xxxx.us-east-1.rds.amazonaws.com

# Connect and setup
psql -h your-db.xxxx.us-east-1.rds.amazonaws.com -U admin -d mental_health_prod

# Push schema
npx prisma db push --skip-generate
```

### Backup Strategy

```bash
# Daily automated backup with pg_dump
0 2 * * * pg_dump -U admin -h db-host mental_health_prod > /backups/mental_health_$(date +\%Y\%m\%d).sql
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo yum install certbot python2-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Configure Nginx
sudo nano /etc/nginx/conf.d/default.conf

# Add SSL configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Reload Nginx
sudo systemctl reload nginx
```

## Monitoring and Logging

### Application Monitoring

```bash
# Install PM2 Plus (optional monitoring)
pm2 plus

# View logs
pm2 logs

# Monitor process
pm2 monit
```

### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/node

# Configure in server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});

app.use(Sentry.Handlers.errorHandler());
```

### Logging Service (Winston)

```bash
# Install Winston
npm install winston

# Configure logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Performance Optimization

### Frontend Optimization

```bash
# Code splitting
npm install @loadable/component

# Image optimization
npm install sharp

# Compression
npm install compression

# Caching headers (vite.config.js)
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
```

### Backend Optimization

```bash
# Install compression
npm install compression

// In app.js
const compression = require('compression');
app.use(compression());

# Database connection pooling
DATABASE_URL="postgresql://user:password@host/db?schema=public&connection_limit=5"

# Caching with Redis
npm install redis
```

## Security Hardening

### CORS Security
```javascript
// app.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation
```javascript
// All endpoints should validate input
const { body, validationResult } = require('express-validator');

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... continue
});
```

## Auto-Scaling (Production)

### Docker Setup for Container Deployment

```dockerfile
# Dockerfile for backend
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/mental_health
      NODE_ENV: production
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mental_health
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Continuous Integration/Deployment

### GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run build
      - name: Deploy
        run: |
          # Your deployment command
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Post-Deployment

1. **Verify Deployment**
   - Test all API endpoints
   - Test authentication flow
   - Test payment processing
   - Test file uploads

2. **Setup Monitoring**
   - Configure error tracking
   - Setup uptime monitoring
   - Configure alerts

3. **Documentation**
   - Document deployment procedure
   - Create runbooks for common issues
   - Document rollback procedure

4. **Backup & Recovery**
   - Test backup restoration
   - Document backup locations
   - Setup automated backups

## Rollback Procedure

```bash
# If deployment fails
git revert HEAD

# Redeploy previous version
git push origin main

# For database issues, use Prisma migrations
npx prisma migrate resolve --rolled-back "migration_name"
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check third-party service status (Razorpay, etc.)

---

Happy deploying! 🚀
