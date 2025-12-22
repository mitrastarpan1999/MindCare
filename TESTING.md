# Testing Guide

## Testing Overview

This guide covers testing strategies for the Mental Health Consultation Platform.

## Frontend Testing

### Unit Testing with Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

#### Example Test File: `src/components/__tests__/LoginForm.test.jsx`

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../LoginForm';
import * as authAPI from '../../services/api';

vi.mock('../../services/api');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    authAPI.login.mockResolvedValueOnce({
      data: {
        token: 'test_token',
        user: { id: '1', email: 'test@test.com', role: 'patient' }
      }
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Add assertions
  });

  it('displays error on login failure', async () => {
    authAPI.login.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    // Test error handling
  });
});
```

### E2E Testing with Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

#### Example E2E Test: `tests/patient-flow.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Patient Flow', () => {
  test('Patient can register and book appointment', async ({ page }) => {
    // Navigate to registration
    await page.goto('http://localhost:5173/register');
    
    // Fill registration form
    await page.fill('input[name="fullName"]', 'John Patient');
    await page.fill('input[name="email"]', 'patient@test.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.fill('input[name="confirmPassword"]', 'Test@123');
    
    // Submit
    await page.click('button:has-text("Register as Patient")');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/patient/dashboard');
    
    // Navigate to psychologists
    await page.click('a:has-text("Psychologists")');
    await expect(page).toHaveURL('/psychologists');
    
    // Book appointment
    await page.click('button:has-text("View Profile & Book")');
    await page.click('button:has-text("Book Appointment")');
    
    // Fill booking details
    await page.fill('input[type="date"]', '2025-01-20');
    await page.fill('input[type="time"]', '10:00');
    
    // Proceed to payment
    await page.click('button:has-text("Proceed to Payment")');
    
    // Verify payment modal appears
    await expect(page.locator('.razorpay-container')).toBeVisible();
  });
});
```

## Backend Testing

### API Testing with Jest

```bash
npm install -D jest supertest
```

#### Example API Test: `server/src/__tests__/auth.test.js`

```javascript
const request = require('supertest');
const app = require('../app');
const prisma = require('../config/database');

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register-patient', () => {
    it('should register a new patient', async () => {
      const response = await request(app)
        .post('/api/auth/register-patient')
        .send({
          fullName: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
          age: 25,
          gender: 'Male'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('john@test.com');
    });

    it('should reject duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register-patient')
        .send({
          fullName: 'John Doe',
          email: 'john@test.com',
          password: 'password123'
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register-patient')
        .send({
          fullName: 'Jane Doe',
          email: 'john@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Setup user
      await request(app)
        .post('/api/auth/register-patient')
        .send({
          fullName: 'Test User',
          email: 'test@test.com',
          password: 'password123'
        });

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123',
          role: 'patient'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
          role: 'patient'
        });

      expect(response.status).toBe(401);
    });
  });
});
```

## Manual Testing

### Test Cases for Patient

#### Registration
- [ ] Register with all required fields
- [ ] Register with optional fields
- [ ] Reject invalid email format
- [ ] Reject password less than 6 characters
- [ ] Reject mismatched passwords
- [ ] Prevent duplicate email registration

#### Login
- [ ] Login with valid credentials
- [ ] Reject invalid email
- [ ] Reject invalid password
- [ ] Maintain login state after refresh
- [ ] Logout clears token

#### Browse Psychologists
- [ ] Display all psychologists
- [ ] Filter by city
- [ ] Filter by fee range
- [ ] View detailed profile
- [ ] Display availability

#### Book Appointment
- [ ] Select date and time
- [ ] Add appointment notes
- [ ] Select consultation type
- [ ] Proceed to payment

#### Payment
- [ ] Create payment order
- [ ] Open Razorpay modal
- [ ] Verify successful payment
- [ ] Handle payment failure
- [ ] Confirm appointment after payment

#### View Appointments
- [ ] Display all appointments
- [ ] Show appointment details
- [ ] Cancel appointment
- [ ] Confirmation on cancellation

### Test Cases for Psychologist

#### Registration
- [ ] Register with professional credentials
- [ ] Verify license number uniqueness
- [ ] Validate consultation fee
- [ ] Upload license document

#### Profile Management
- [ ] Update qualifications
- [ ] Update consultation fee
- [ ] Update clinic address
- [ ] Upload/replace license

#### Availability Management
- [ ] Add availability for each day
- [ ] Set multiple time slots
- [ ] Edit existing availability
- [ ] Delete availability slot

#### Appointment Management
- [ ] View pending appointments
- [ ] Accept appointment
- [ ] Decline appointment
- [ ] Mark as completed
- [ ] View appointment history

## Testing Checklist

### Frontend
- [ ] Component rendering
- [ ] Form submission
- [ ] Error handling
- [ ] Loading states
- [ ] Navigation
- [ ] Authentication flow
- [ ] Protected routes
- [ ] Responsive design
- [ ] Accessibility

### Backend
- [ ] User registration (both roles)
- [ ] User login
- [ ] JWT token generation
- [ ] Protected endpoints
- [ ] Database operations
- [ ] Error responses
- [ ] Input validation
- [ ] File uploads
- [ ] Payment processing

### Integration
- [ ] End-to-end patient flow
- [ ] End-to-end psychologist flow
- [ ] Payment flow
- [ ] Appointment lifecycle
- [ ] Error scenarios

### Performance
- [ ] Load times
- [ ] API response times
- [ ] Database query performance
- [ ] Bundle size
- [ ] Memory usage

## Postman Collection

```json
{
  "info": {
    "name": "Mental Health API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Patient",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register-patient",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"John Doe\",\n  \"email\": \"john@test.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@test.com\",\n  \"password\": \"password123\",\n  \"role\": \"patient\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Psychologists",
      "item": [
        {
          "name": "Get All",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/psychologists"
          }
        }
      ]
    }
  ]
}
```

## CI/CD Testing

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: mental_health_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install Dependencies
        run: npm install

      - name: Setup Database
        run: |
          cd server
          npx prisma db push --skip-generate

      - name: Run Tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/mental_health_test
        run: npm test

      - name: Build
        run: npm run build
```

## Performance Testing

### Load Testing with k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let response = http.get('http://localhost:5000/api/psychologists');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Test Reports

Generate test reports:

```bash
# Frontend test report
npm run test:coverage

# Backend test report
cd server
npm run test:coverage

# E2E test report
npx playwright show-report
```

## Best Practices

1. **Write tests early** - Use TDD approach
2. **Test critical flows** - Focus on user journeys
3. **Mock external services** - Isolate tests from Razorpay, etc.
4. **Use fixtures** - Create reusable test data
5. **Keep tests simple** - One assertion per test when possible
6. **Run tests before deployment** - Automated CI/CD pipeline
7. **Monitor coverage** - Aim for 80%+ coverage
8. **Test error cases** - Not just happy paths

---

Happy testing! 🧪
