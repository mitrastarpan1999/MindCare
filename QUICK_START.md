# Quick Start Guide

This guide will help you get the Mental Health Consultation Platform up and running quickly.

## Prerequisites
- Node.js v16 or higher
- PostgreSQL v12 or higher
- Git Bash (configured as default terminal)
- npm or yarn

## Setup Steps

### 1. Environment Configuration
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

### 2. Database Setup
```bash
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push
```

### 3. Backend Setup
```bash
# Still in /server directory
npm run dev
# Backend runs on http://localhost:5000
```

### 4. Frontend Setup (in a new terminal)
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Verify Installation
- Open http://localhost:5173 in your browser
- You should see the MindCare homepage
- Click "Register" to test the registration flow

## Default Credentials (for testing)

### Test Patient
- Email: patient@test.com
- Password: password123

### Test Psychologist
- Email: doctor@test.com
- Password: password123

## Common Commands

### Frontend
```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd server
npm run dev                    # Start with hot reload
npm start                      # Start production
npx prisma generate          # Regenerate Prisma client
npx prisma db push           # Sync database schema
npx prisma studio            # Open Prisma Studio GUI
```

## Project Structure Quick Reference

- **client/** - React frontend
  - `src/pages/` - Page components
  - `src/components/` - Reusable components
  - `src/services/` - API calls
  - `src/context/` - State management

- **server/** - Express backend
  - `src/controllers/` - Business logic
  - `src/routes/` - API endpoints
  - `src/models/` - Database models (Prisma)
  - `src/middleware/` - Custom middleware

- **prisma/** - Database configuration
  - `schema.prisma` - Database schema

## Troubleshooting

### Port Already in Use
```bash
# Change backend port
# Edit .env: PORT=5001

# Change frontend port
npm run dev -- --port 5174
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in .env
# Reset database
npx prisma db push --force-reset
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Next Steps

1. Register as a Patient or Psychologist
2. Explore the dashboard
3. Try booking an appointment (use test payment credentials)
4. Check the API documentation for integration details

## Documentation
- See `README.md` for full project documentation
- See `API_DOCUMENTATION.md` for API endpoints
- See `DEPLOYMENT.md` for production setup

## Need Help?
Refer to the main README.md file for detailed information about features, architecture, and contributing guidelines.
