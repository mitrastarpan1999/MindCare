# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth Endpoints

#### Register Patient
```
POST /auth/register-patient
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "gender": "Male",
  "city": "Delhi",
  "state": "Delhi",
  "phone": "9876543210"
}

Response:
{
  "message": "Patient registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### Register Psychologist
```
POST /auth/register-psychologist
Content-Type: application/json

{
  "fullName": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "9876543210",
  "gender": "Female",
  "clinicAddress": "123 Health Street, Delhi",
  "qualifications": "M.D. (Psychiatry)",
  "licenseNumber": "LIC123456",
  "yearsExperience": 10,
  "consultationFee": 500
}

Response:
{
  "message": "Psychologist registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "Dr. Jane Smith",
    "email": "jane@example.com",
    "role": "psychologist"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "patient"  // or "psychologist"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "User Name",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### Psychologist Endpoints

#### Get All Psychologists
```
GET /psychologists?city=Delhi&minFee=300&maxFee=1000

Response:
{
  "message": "Psychologists retrieved successfully",
  "data": [
    {
      "id": "psych_id",
      "fullName": "Dr. Jane Smith",
      "qualifications": "M.D. (Psychiatry)",
      "clinicAddress": "123 Health Street",
      "yearsExperience": 10,
      "consultationFee": 500,
      "availabilities": [...]
    }
  ]
}
```

#### Get Psychologist Details
```
GET /psychologists/:id

Response:
{
  "message": "Psychologist retrieved successfully",
  "data": {
    "id": "psych_id",
    "fullName": "Dr. Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "gender": "Female",
    "qualifications": "M.D. (Psychiatry)",
    "licenseNumber": "LIC123456",
    "yearsExperience": 10,
    "consultationFee": 500,
    "clinicAddress": "123 Health Street",
    "availabilities": [
      {
        "id": "avail_id",
        "dayOfWeek": "Monday",
        "startTime": "09:00",
        "endTime": "17:00",
        "slotDurationMins": 30
      }
    ]
  }
}
```

#### Update Profile
```
PUT /psychologists/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "9876543210",
  "clinicAddress": "New Address",
  "qualifications": "Updated qualifications",
  "consultationFee": 600
}

Response:
{
  "message": "Profile updated successfully",
  "data": {...}
}
```

#### Upload License
```
POST /psychologists/:id/upload-license
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- license: (file)

Response:
{
  "message": "License document uploaded successfully",
  "data": {
    "id": "psych_id",
    "fullName": "Dr. Jane Smith",
    "licenseDocUrl": "/uploads/license-filename.pdf"
  }
}
```

#### Set Availability
```
POST /psychologists/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "dayOfWeek": "Monday",
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDurationMins": 30
}

Response:
{
  "message": "Availability set successfully",
  "data": {
    "id": "avail_id",
    "psychologistId": "psych_id",
    "dayOfWeek": "Monday",
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDurationMins": 30
  }
}
```

### Appointment Endpoints

#### Create Appointment
```
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "psychologistId": "psych_id",
  "appointmentDate": "2025-01-15",
  "startTime": "10:00",
  "endTime": "10:30",
  "consultationType": "online",
  "notes": "I have anxiety issues"
}

Response:
{
  "message": "Appointment created successfully",
  "data": {
    "id": "apt_id",
    "patientId": "patient_id",
    "psychologistId": "psych_id",
    "appointmentDate": "2025-01-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "consultationType": "online",
    "status": "pending",
    "psychologist": {
      "id": "psych_id",
      "fullName": "Dr. Jane Smith",
      "consultationFee": 500
    }
  }
}
```

#### Get Patient Appointments
```
GET /appointments/patient/:patientId
Authorization: Bearer <token>

Response:
{
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "apt_id",
      "patientId": "patient_id",
      "psychologistId": "psych_id",
      "appointmentDate": "2025-01-15T00:00:00.000Z",
      "startTime": "10:00",
      "status": "pending",
      "consultationType": "online",
      "psychologist": {
        "id": "psych_id",
        "fullName": "Dr. Jane Smith",
        "email": "jane@example.com",
        "phone": "9876543210",
        "clinicAddress": "123 Health Street",
        "consultationFee": 500
      },
      "payment": {...}
    }
  ]
}
```

#### Update Appointment Status
```
PUT /appointments/:appointmentId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"  // or "declined", "completed", "cancelled"
}

Response:
{
  "message": "Appointment status updated successfully",
  "data": {...}
}
```

### Payment Endpoints

#### Create Payment Order
```
POST /payment/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "appointmentId": "apt_id"
}

Response:
{
  "message": "Payment order created successfully",
  "data": {
    "payment": {
      "id": "payment_id",
      "appointmentId": "apt_id",
      "amount": 500,
      "currency": "INR",
      "orderId": "razorpay_order_id",
      "status": "pending"
    },
    "razorpayOrder": {
      "id": "razorpay_order_id",
      "amount": 50000,  // in paise
      "currency": "INR"
    },
    "razorpayKey": "razorpay_key_id"
  }
}
```

#### Verify Payment
```
POST /payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "razorpay_order_id",
  "paymentId": "razorpay_payment_id",
  "signature": "razorpay_signature"
}

Response:
{
  "message": "Payment verified successfully",
  "data": {
    "id": "payment_id",
    "appointmentId": "apt_id",
    "status": "completed",
    "paymentId": "razorpay_payment_id",
    "signature": "razorpay_signature"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required" or "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already registered" or "This time slot already exists"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details (development only)"
}
```

## Testing with Postman

1. Create a Postman collection
2. Set base URL: `http://localhost:5000/api`
3. For authenticated requests, add Bearer token to Authorization header
4. Import the API endpoints and test

## Rate Limiting

Currently not implemented. Consider adding in production.

## CORS

CORS is enabled for the frontend URL specified in `.env`
