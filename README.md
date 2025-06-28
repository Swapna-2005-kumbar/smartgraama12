# SmartGraama - Grama Panchayat Resident and Scheme Tracker

A comprehensive MERN stack web application designed for Grama Panchayat officers to manage resident records, evaluate eligibility for government schemes, and monitor beneficiary distribution and performance metrics.

## 🌟 Features

### Frontend (React.js + Tailwind CSS)
- **Dashboard**: Overview with statistics and data visualizations using Chart.js
- **Resident Management**: CRUD operations for resident data with search and filtering
- **Scheme Management**: Complete scheme lifecycle management with eligibility criteria
- **Eligibility Checker**: AI-powered scheme eligibility evaluation
- **Responsive Design**: Modern UI with mobile-first approach
- **Role-based Access**: Admin and Officer views with different permissions

### Backend (Node.js + Express.js + MongoDB)
- **RESTful APIs**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure role-based authentication system
- **Eligibility Engine**: Intelligent scheme eligibility checking
- **Data Validation**: Comprehensive input validation and error handling
- **MongoDB Integration**: Robust data persistence with Mongoose ODM

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Authentication**: JWT-based role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Chart.js for data visualization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartgraama12
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/smartgraama
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

#### Production Mode
```bash
# Build Frontend
cd frontend
npm run build

# Start Backend
cd backend
npm start
```

## 📁 Project Structure

```
smartgraama12/
├── backend/
│   ├── config/
│   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eligibilityController.js
│   │   │   ├── residentController.js
│   │   │   └── schemeController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Resident.js
│   │   │   ├── Scheme.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── eligibility.js
│   │   │   ├── residents.js
│   │   │   └── schemes.js
│   │   ├── package.json
│   │   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.js
│   │   │   ├── eligibility/
│   │   │   │   └── EligibilityChecker.js
│   │   │   ├── layout/
│   │   │   │   └── Layout.js
│   │   │   ├── residents/
│   │   │   │   ├── ResidentCard.js
│   │   │   │   ├── ResidentForm.js
│   │   │   │   └── Residents.js
│   │   │   └── schemes/
│   │   │       ├── SchemeCard.js
│   │   │       ├── SchemeForm.js
│   │   │       └── Schemes.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔐 Authentication & Authorization

The application supports two user roles:

### Admin
- Full access to all panchayats and analytics
- Can manage all residents and schemes
- Access to system-wide statistics

### Panchayat Officer
- Can manage records for their assigned panchayat
- Limited access to analytics
- Can perform eligibility checks

## 📊 Data Models

### Resident
- Personal information (name, Aadhaar, age, gender)
- Contact details (phone, email, address)
- Economic data (income, land size, house ownership)
- Social category and education
- Scheme participation status

### Scheme
- Basic information (name, description, category)
- Budget and beneficiary targets
- Eligibility criteria (income, age, category, etc.)
- Status tracking (Active, Pending, Completed, Suspended)

### User
- Authentication details (email, password)
- Role assignment (admin/officer)
- Panchayat association

## 🎯 Key Features

### Dashboard Analytics
- Total residents and schemes count
- Pending applications tracking
- Scheme performance visualization
- Beneficiary distribution charts

### Resident Management
- Add, edit, and delete resident records
- Search and filter functionality
- Category-wise filtering
- Comprehensive resident profiles

### Scheme Management
- Create and manage government schemes
- Define eligibility criteria
- Track budget utilization
- Monitor beneficiary progress

### Eligibility Checker
- Individual scheme eligibility checking
- Bulk eligibility assessment
- Detailed reasoning for eligibility decisions
- Real-time validation against criteria

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Residents
- `GET /api/residents` - Get all residents
- `POST /api/residents` - Create new resident
- `PUT /api/residents/:id` - Update resident
- `DELETE /api/residents/:id` - Delete resident

### Schemes
- `GET /api/schemes` - Get all schemes
- `POST /api/schemes` - Create new scheme
- `PUT /api/schemes/:id` - Update scheme
- `DELETE /api/schemes/:id` - Delete scheme

### Eligibility
- `POST /api/eligibility` - Check eligibility for a scheme

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Set up MongoDB Atlas or other cloud database
2. Configure environment variables
3. Deploy to your preferred platform

### Frontend Deployment (Vercel/Netlify)
1. Build the React application
2. Deploy to your preferred platform
3. Configure API endpoint URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔮 Future Enhancements

- AI/ML integration for automatic eligibility prediction
- PDF report generation
- SMS/Email notifications
- Multilingual support (Kannada, Hindi)
- QR code generation for residents
- Offline data sync capabilities
- Advanced analytics and reporting
- Mobile application development 