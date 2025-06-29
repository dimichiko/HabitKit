# HabitKit Clone

A full-stack productivity application built with React frontend and NestJS backend, featuring habit tracking, calorie management, invoice generation, and training tracking.

## 🏗️ Project Structure

```
habitkit-clone/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── apps/    # Feature-based applications
│   │   │   ├── habitkit/
│   │   │   ├── caloriekit/
│   │   │   ├── invoicekit/
│   │   │   └── trainingkit/
│   │   └── ...
│   └── package.json
├── server-nest/     # NestJS Backend
│   ├── src/
│   │   ├── auth/    # Authentication module
│   │   ├── habits/  # Habits management
│   │   ├── invoices/ # Invoice generation
│   │   ├── calories/ # Calorie tracking
│   │   └── users/   # User management
│   └── package.json
└── package.json     # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habitkit-clone
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Copy the example file and configure it:
   ```bash
   cp server-nest/.env.example server-nest/.env
   ```
   
   Edit `server-nest/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/habitkit
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5051
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or start MongoDB manually
   mongod
   ```

### Development

**Start both frontend and backend simultaneously:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5051

**Start individually:**
```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Production

**Build both applications:**
```bash
npm run build
```

**Start production servers:**
```bash
# Start backend
npm run start:server

# Start frontend (in another terminal)
npm run start:client
```

## 📱 Applications

### HabitKit
Track daily habits, set goals, and monitor progress with a beautiful calendar interface.

### CalorieKit
Log meals, track nutrition, and manage weight goals with detailed analytics.

### InvoiceKit
Generate professional invoices, manage clients, and track payments.

### TrainingKit
Plan workouts, track exercises, and monitor fitness progress.

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:client` | Start only the React frontend |
| `npm run dev:server` | Start only the NestJS backend |
| `npm run build` | Build both applications for production |
| `npm run install:all` | Install dependencies for all packages |
| `npm run clean` | Remove all node_modules directories |
| `npm run start:client` | Start frontend in production mode |
| `npm run start:server` | Start backend in production mode |
| `npm run lint` | Run linting on both client and server |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
| `npm run health` | Check server health status |

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport JWT** - Authentication
- **Zod** - Validation
- **Rate Limiting** - Security
- **CORS** - Cross-origin requests

## 📡 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /api/health` - API health check with endpoints info

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Invoices
- `GET /api/invoices` - Get user invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Calories
- `GET /api/calories` - Get user meals
- `POST /api/calories` - Log new meal
- `PUT /api/calories/:id` - Update meal
- `DELETE /api/calories/:id` - Delete meal

## 🔒 Environment Variables

### Backend (.env in server-nest/)
```env
# Server Configuration
PORT=5051
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/habitkit

# Security
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin security
- **Input Validation** - Zod schema validation
- **Security Headers** - XSS and clickjacking protection
- **Password Hashing** - bcrypt with configurable rounds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list | grep mongodb`
- Check connection string in `.env` file
- Verify MongoDB port (default: 27017)

### Port Conflicts
- Frontend default: 3000
- Backend default: 5051
- Change ports in respective configuration files if needed

### Build Issues
- Clear node_modules: `npm run clean`
- Reinstall dependencies: `npm run install:all`
- Check Node.js version compatibility

### Security Issues
- **IMPORTANT**: Change the JWT_SECRET in production
- Use strong, unique secrets
- Never commit `.env` files to version control
- Enable HTTPS in production

### Health Check
```bash
# Check if server is running
npm run health

# Manual health check
curl http://localhost:5051/api/health
``` 