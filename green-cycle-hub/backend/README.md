# SMACOM Backend API

A waste-to-wealth system connecting waste producers, bio-processors, and farmers through an intelligent platform powered by IoT sensors, AI recommendations, and a live marketplace.

## Project Structure

```
smacom-backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables
├── app/
│   ├── api/               # API route handlers
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── users.py      # User management
│   │   ├── waste.py      # Waste listings
│   │   ├── processor.py   # Bio-processor management
│   │   ├── farmer.py     # Farmer management
│   │   ├── marketplace.py # Marketplace transactions
│   │   ├── iot.py        # IoT sensor data
│   │   ├── learning.py   # Learning center
│   │   ├── payments.py   # Payment processing
│   │   ├── admin.py      # Admin functions
│   │   ├── notifications.py # Notifications
│   │   └── reports.py    # Analytics & reports
│   ├── core/             # Core application logic
│   │   ├── config.py     # Configuration
│   │   ├── security.py   # Security utilities
│   │   ├── dependencies.py # FastAPI dependencies
│   │   └── realtime.py   # WebSocket/real-time
│   ├── db/               # Database
│   │   ├── supabase_client.py # Supabase connection
│   │   └── schema.sql    # Database schema
│   ├── mqtt/             # MQTT IoT integration
│   │   ├── broker.py     # MQTT broker setup
│   │   └── handlers.py   # Message handlers
│   ├── services/         # Business logic
│   │   ├── ai_recommendation.py
│   │   ├── alert_engine.py
│   │   ├── credits.py
│   │   ├── commission.py
│   │   ├── mpesa.py
│   │   ├── flutterwave.py
│   │   ├── fcm.py
│   │   ├── sendgrid.py
│   │   ├── certificates.py
│   │   └── reports.py
│   └── models/           # Pydantic models
│       ├── user.py
│       ├── waste.py
│       ├── iot.py
│       ├── order.py
│       ├── payment.py
│       ├── course.py
│       └── notification.py
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env` and update with your configuration:
- Supabase credentials
- MQTT broker details
- Payment gateway keys
- Firebase credentials
- SendGrid API key

### 4. Run the Application

```bash
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### 5. API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

- **User Management**: Authentication, profiles, roles (waste producer, processor, farmer)
- **Waste Management**: Listings, collection, tracking
- **IoT Integration**: Real-time sensor data from composting units
- **AI Recommendations**: Smart suggestions based on waste type and conditions
- **Marketplace**: Buy/sell compost, biochar, and agricultural products
- **Payments**: M-Pesa, Flutterwave, and credit-based payments
- **Learning Center**: Courses on composting and sustainable farming
- **Notifications**: Real-time alerts via Firebase Cloud Messaging
- **Reports**: Environmental impact certificates and analytics

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/{id}` - Update user profile

### Waste Management
- `GET /api/v1/waste` - List waste items
- `POST /api/v1/waste` - Create waste listing
- `GET /api/v1/waste/{id}` - Get waste details

### IoT
- `GET /api/v1/iot/sensors` - List IoT sensors
- `GET /api/v1/iot/readings/{sensor_id}` - Get sensor readings

### Marketplace
- `GET /api/v1/marketplace/listings` - View available products
- `POST /api/v1/marketplace/orders` - Create order

### Payments
- `POST /api/v1/payments/initiate` - Initiate payment
- `GET /api/v1/payments/{id}` - Get payment status

### Admin
- `GET /api/v1/admin/dashboard` - Admin dashboard
- `GET /api/v1/admin/reports` - System reports

## Database Schema

Tables include:
- `users` - User accounts
- `waste_listings` - Waste management
- `processors` - Bio-processor profiles
- `farmers` - Farmer profiles
- `orders` - Marketplace orders
- `payments` - Payment records
- `iot_sensors` - IoT device data
- `courses` - Learning content
- `notifications` - User notifications

## Technology Stack

- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **IoT**: MQTT
- **Payments**: M-Pesa, Flutterwave
- **Notifications**: Firebase Cloud Messaging, SendGrid
- **Real-time**: WebSocket
- **AI/ML**: TensorFlow, scikit-learn

## Contributing

Submit pull requests to improve features or fix bugs.

## License

MIT License - See LICENSE file for details

## Contact

For questions or support, reach out to the SMACOM team.
