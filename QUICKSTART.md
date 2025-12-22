# Quick Start Guide

## Prerequisites
- Node.js v16+
- PostgreSQL v12+
- Git
- Razorpay Account (for payments)

## Step-by-Step Setup

### 1. Database Setup
```bash
# Create a PostgreSQL database
createdb mental_health_db

# Or use pgAdmin GUI to create the database
```

### 2. Environment Configuration
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values
nano .env
```

Required values:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mental_health_db"
JWT_SECRET="your_super_secret_key_12345"
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxx"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### 3. Backend Installation
```bash
cd server
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Server will run on `http://localhost:5000`

### 4. Frontend Installation
```bash
cd client
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Application

### 1. Create Test Accounts

**Patient Registration:**
1. Go to http://localhost:5173/register
2. Select "Register as Patient"
3. Fill in details:
   - Name: John Patient
   - Email: patient@test.com
   - Password: Test@123
4. Click Register

**Psychologist Registration:**
1. Go to http://localhost:5173/register
2. Select "Register as Psychologist"
3. Fill in details:
   - Name: Dr. Jane Smith
   - Email: doctor@test.com
   - Password: Test@123
   - License Number: LIC123456
   - Consultation Fee: 500
4. Click Register

### 2. Test Patient Flow

1. **Login as Patient**
   - Email: patient@test.com
   - Password: Test@123
   - Role: Patient

2. **Browse Psychologists**
   - Click "Psychologists" in navbar
   - Use filters to search

3. **View Profile**
   - Click on a psychologist card
   - View their details and availability

4. **Book Appointment**
   - Click "Book Appointment"
   - Select date and time
   - Choose consultation type (online/in-person)
   - Click "Proceed to Payment"

5. **Make Payment** (Test Mode)
   - Razorpay test card: 4111111111111111
   - Expiry: 12/25
   - CVV: 123
   - Click "Pay"

### 3. Test Psychologist Flow

1. **Login as Psychologist**
   - Email: doctor@test.com
   - Password: Test@123
   - Role: Psychologist

2. **View Dashboard**
   - See pending bookings
   - View statistics

3. **Set Availability** (Coming Soon)
   - Set working hours
   - Manage schedule

## Project Structure Quick Reference

```
MentalH/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── services/      # API calls
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx        # Main app
│   └── index.html
│
├── server/                # Express Backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── models/        # Data models
│   │   ├── middleware/    # Auth, uploads
│   │   ├── config/        # Configuration
│   │   └── server.js      # Entry point
│   └── uploads/           # File storage
│
├── prisma/
│   └── schema.prisma      # Database schema
│
└── README.md             # Full documentation
```

## Common Commands

### Backend
```bash
cd server

# Development
npm run dev

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# View database in Prisma Studio
npx prisma studio
```

### Frontend
```bash
cd client

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL format
# Test connection:
psql postgresql://user:password@localhost:5432/mental_health_db
```

### Prisma Schema Out of Sync
```bash
cd server
npx prisma db push --force-reset  # WARNING: Deletes data!
npx prisma db push                # Safe option
```

### CORS Issues
```bash
# Check FRONTEND_URL in .env matches actual frontend URL
# Frontend default: http://localhost:5173
# Update if running on different port
```

### Clear Cache
```bash
# Frontend
rm -r node_modules package-lock.json
npm install

# Backend
rm -r node_modules package-lock.json
npm install
```

## Features Checklist

### Authentication ✓
- [x] Patient registration
- [x] Psychologist registration
- [x] JWT login
- [x] Protected routes
- [x] Role-based access

### Psychologist Management ✓
- [x] Browse psychologists
- [x] Filter by location & fees
- [x] View full profile
- [x] Set availability
- [x] Upload license

### Appointments ✓
- [x] Book appointment
- [x] View appointments
- [x] Update status
- [x] Cancel appointment
- [x] Appointment history

### Payment ✓
- [x] Razorpay integration
- [x] Create orders
- [x] Payment verification
- [x] Success/failure handling

### UI/UX ✓
- [x] Responsive design
- [x] Tailwind CSS styling
- [x] Navigation
- [x] Forms with validation
- [x] Error handling

## Next Steps

### For Development
1. Test all features thoroughly
2. Add input validation
3. Implement error boundaries
4. Add loading states
5. Implement notifications

### For Production
1. Set up SSL/HTTPS
2. Configure environment variables securely
3. Set up database backups
4. Implement rate limiting
5. Add monitoring and logging
6. Set up CI/CD pipeline

## Support & Resources

- **Database**: https://www.prisma.io/
- **Frontend**: https://react.dev/
- **Backend**: https://expressjs.com/
- **Styling**: https://tailwindcss.com/
- **Payments**: https://razorpay.com/
- **Authentication**: https://jwt.io/

## Need Help?

1. Check the README.md for full documentation
2. Review API_DOCUMENTATION.md for API details
3. Check browser console for frontend errors
4. Check server logs for backend errors

Happy coding! 🚀
