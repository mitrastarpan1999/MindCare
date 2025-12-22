# Mental Health Consultation Platform

A full-stack web application connecting patients with mental health professionals for online and in-person consultations.

## Features

### For Patients
- Register and create a profile
- Browse and search psychologists by location and fees
- View psychologist profiles and availability
- Book appointments
- Make secure payments via Razorpay
- Manage appointment history

### For Psychologists
- Register with credentials and license verification
- Manage professional profile
- Set availability and working hours
- View and manage appointments
- Accept or decline booking requests
- Update appointment status

### General Features
- JWT-based authentication
- Secure password hashing with bcrypt
- Document upload for license verification
- Responsive design with Tailwind CSS
- Real-time appointment management

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Razorpay** - Payment gateway

## Project Structure

```
mental-health-app/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── context/                # Context API files
│   │   ├── hooks/                  # Custom hooks
│   │   ├── services/               # API services
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Main App component
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                         # Express Backend
│   ├── src/
│   │   ├── controllers/            # Route controllers
│   │   ├── routes/                 # API routes
│   │   ├── models/                 # Database models
│   │   ├── middleware/             # Custom middleware
│   │   ├── config/                 # Configuration files
│   │   ├── utils/                  # Utility functions
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # Server entry point
│   ├── uploads/                    # File uploads directory
│   └── package.json
│
├── prisma/
│   └── schema.prisma              # Database schema
│
├── .env.example                   # Environment variables example
└── package.json                   # Root package.json
```

## Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Setup Instructions

#### 1. Clone the Repository
```bash
cd mental-health-app
```

#### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mental_health_db"
JWT_SECRET="your_secret_key"
RAZORPAY_KEY_ID="your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
FRONTEND_URL="http://localhost:5173"
```

#### 3. Install Backend Dependencies
```bash
cd server
npm install
```

#### 4. Setup Database
```bash
npx prisma generate
npx prisma db push
```

#### 5. Install Frontend Dependencies
```bash
cd ../client
npm install
```

#### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register-patient` - Register as patient
- `POST /api/auth/register-psychologist` - Register as psychologist
- `POST /api/auth/login` - Login user

### Psychologists
- `GET /api/psychologists` - Get all psychologists
- `GET /api/psychologists/:id` - Get psychologist details
- `PUT /api/psychologists/:id` - Update profile
- `POST /api/psychologists/:id/upload-license` - Upload license
- `POST /api/psychologists/:id/availability` - Set availability

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/patient/:id` - Get patient appointments
- `GET /api/appointments/psychologist/:id` - Get psychologist appointments
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Payments
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/:appointmentId` - Get payment details

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Token is included in all subsequent API requests
5. Protected routes verify token before rendering

## Database Schema

### Patient
- ID, Full Name, Email, Password, Age, Gender, City, State, Phone
- Timestamps (created, updated)

### Psychologist
- ID, Full Name, Email, Password, Phone, Gender, Clinic Address
- Qualifications, License Number, License Document URL
- Years of Experience, Consultation Fee
- Timestamps (created, updated)

### Availability
- ID, Psychologist ID, Day of Week, Start Time, End Time
- Slot Duration (minutes)

### Appointment
- ID, Patient ID, Psychologist ID, Date, Start Time, End Time
- Type (online/in-person), Status, Notes
- Timestamps (created, updated)

### Payment
- ID, Appointment ID, Patient ID, Psychologist ID
- Amount, Currency, Order ID, Payment ID, Signature, Status
- Timestamps (created, updated)

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT authentication with expiry
- Role-based access control (Patient/Psychologist)
- File upload validation (size and type)
- CORS protection
- Input validation and sanitization

## Payment Integration

### Razorpay Setup
1. Create Razorpay account at https://razorpay.com
2. Get API credentials from dashboard
3. Add to `.env` file:
   ```
   RAZORPAY_KEY_ID="your_key_id"
   RAZORPAY_KEY_SECRET="your_key_secret"
   ```

### Payment Flow
1. Patient selects appointment time and date
2. Backend creates Razorpay order
3. Frontend opens Razorpay payment modal
4. After successful payment, order is verified
5. Appointment is confirmed and email sent

## Future Enhancements

- Real-time chat between patient and psychologist
- Video consultation via WebRTC or Zoom API
- Reviews and ratings system
- Specialization categories
- Email notifications
- SMS notifications
- Appointment reminders
- Insurance integration
- Doctor availability calendar

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npx prisma db push` to sync schema

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: `npm run dev -- --port 5174`

### CORS Issues
- Verify FRONTEND_URL in backend .env
- Check API proxy in vite.config.js

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions, please create an issue in the repository.
