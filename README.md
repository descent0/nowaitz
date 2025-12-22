# NoWaitz – Appointment Booking Platform

NoWaitz is a full-stack appointment booking platform that connects customers with service providers. It enables users to discover services and book appointments seamlessly, while service providers manage shops, employees, schedules, and bookings through a unified dashboard.

🌐 **Live Demo**  
Frontend: https://nowaitz.vercel.app

> ⚠️ **Note**  
> The backend is hosted on **Render (free tier)**.  
> The first request may take **30–60 seconds** due to cold start.  
> Please wait patiently — subsequent requests are fast.

This project was built to understand **real-world full-stack system design**, including role-based access control, scheduling logic, payment workflows, and third-party integrations.

---

## 🚀 Features

### 👤 For Customers
- Service discovery by category and location  
- Detailed shop and service listings  
- Real-time appointment booking  
- User profile & booking history  
- Google OAuth login  

### 🏪 For Service Providers
- Shop profile management  
- Employee and staff management  
- Schedule & availability configuration  
- Service pricing and duration setup  
- Appointment confirmation and tracking  
- Earnings and payment overview  

### 🛠️ For Administrators
- User and provider management  
- Service category management  
- Shop moderation  
- Financial analytics  
- System-wide monitoring dashboard  

---

## 🧠 Key Engineering Highlights

- Designed **RESTful APIs** with proper separation of concerns  
- Implemented **role-based access control** (User / Provider / Admin)  
- Built **secure authentication** using JWT and Google OAuth  
- Handled **concurrent bookings** with schedule validation  
- Integrated **Razorpay** for payments with verification  
- Used **cron jobs** for background tasks and cleanup  
- Followed **modular backend architecture** for scalability  

---

## 🛠 Tech Stack

### Backend
- Node.js, Express.js  
- MongoDB with Mongoose  
- Authentication: JWT, Passport.js (Google OAuth)  
- Payments: Razorpay  
- Messaging: Twilio (SMS), Nodemailer (Email)  
- File uploads: Multer  
- Scheduling: node-cron  
- Security: Helmet, CORS  

### Frontend
- React 19, React Router  
- Redux Toolkit (state management)  
- Tailwind CSS  
- Google Maps API, Leaflet  
- Chart.js (analytics)  
- Framer Motion (animations)  
- React Hook Form  

---

## 📋 Prerequisites

- Node.js (v16+)  
- MongoDB (local or cloud)  
- npm or yarn  

---

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/descent0/nowaitz.git
   cd nowaitz
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nowaitz
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
REACT_FRONTEND_API=http://localhost:3000
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🚀 Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

3. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
nowaitz/
├── backend/
│   ├── config/          # Configuration files (passport, cron)
│   ├── controller/      # Route controllers
│   ├── lib/            # Utility functions and database connection
│   ├── middleware/     # Authentication middleware
│   ├── model/          # MongoDB models
│   ├── routes/         # API route definitions
│   ├── uploads/        # File upload directory
│   └── index.js        # Main server file
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── Components/ # React components
│   │   ├── store/      # Redux store and slices
│   │   └── ...         # Other React app files
│   └── package.json
└── README.md
```

## 🔐 Authentication & Authorization

The application uses role-based access control with three main roles:
- **User**: Regular customers
- **Service Provider**: Shop owners and employees
- **Admin**: System administrators

Authentication is handled through JWT tokens and Google OAuth integration.

## 💳 Payment Integration

Payments are processed through Razorpay, supporting:
- Secure payment processing
- Multiple payment methods
- Payment verification and webhooks
- Refund management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout

### Shops
- `GET /api/shop` - Get all shops
- `POST /api/shop` - Create new shop
- `PUT /api/shop/:id` - Update shop
- `DELETE /api/shop/:id` - Delete shop

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book a new appointment
- `PUT /api/appointments/:id` - Update appointment status

### Services
- `GET /api/serv` - Get all services
- `POST /api/serv` - Create new service
- `PUT /api/serv/:id` - Update service

### Payments
- `POST /api/razor-pay/order` - Create payment order
- `POST /api/razor-pay/verify` - Verify payment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@nowaitz.com or join our Discord community.

## 🙏 Acknowledgments

- React and Express communities
- Open source contributors
- Service providers and customers using the platform
