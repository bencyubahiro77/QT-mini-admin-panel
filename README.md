# Admin Panel - User Management System

Full-stack application with Protobuf serialization and RSA-4096 cryptographic signing.

##  Quick Start

### Prerequisites
- **Node.js** 18+ and npm installed
- Git (to clone the repository)


### Step 1: Clone the Repository
```bash
git clone https://github.com/bencyubahiro77/QT-mini-admin-panel.git
cd QT-mini-admin-panel
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup database with migrations 
npm run migrate:dev

# Start the backend server
npm run dev
```
  Backend will run on **http://localhost:5000**  
  API Documentation available at **http://localhost:5000/api-docs** (Swagger UI)

### Step 3: Frontend Setup
Open a **new terminal** and run:
```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```
  Frontend will run on **http://localhost:5173**

### Step 4: Access the Application
Open your browser and navigate to:
- **Frontend UI**: http://localhost:5173
- **Backend API Docs**: http://localhost:5000/api-docs

That's it! The application is now running.

**What happens automatically:**
- SQLite database created with migrations
- Database schema tracked and versioned
- RSA-4096 keys generated and saved to `backend/keys/`
- Frontend proxies API requests to backend
- No configuration required!

##   Project Structure

```
QT/
├── backend/              # Node.js + Express + Prisma API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes  
│   │   ├── services/     # Crypto & Protobuf services
│   │   └── utils/        # RSA key management
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/   # Database migrations (tracked)
│   └── keys/             # RSA-4096 key pairs
│
├── frontend/             # React + Redux Toolkit UI
│   ├── src/
│   │   ├── app/          # Redux store
│   │   ├── components/   # UI components (Shadcn/UI)
│   │   ├── features/     # User management & dashboard
│   │   └── utils/        # Protobuf decoder & crypto verifier
│   └── ...
│
└── README.md             
```

##  Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite
- **Documentation**: Swagger/OpenAPI 3.0
- **Serialization**: Protocol Buffers (protobufjs)
- **Cryptography**: 
  - RSA-4096 for digital signatures
  - SHA-384 for hashing

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Shadcn/UI (Radix UI + Tailwind CSS)
- **Charts**: Recharts
- **Build Tool**: Vite
- **Protobuf**: protobufjs
- **Crypto**: Web Crypto API

##  Features

- **Dashboard**: User statistics, active/inactive breakdown, 7-day growth chart
- **User Management**: Full CRUD operations with real-time updates
- **Cryptographic Security**: RSA-4096 signatures + SHA-384 hashing
- **Protobuf Serialization**: Efficient binary data transfer
- **Signature Verification**: Frontend validates all user data integrity
- **Modern UI**: Built with Shadcn/UI and Tailwind CSS
- **API Documentation**: Interactive Swagger UI at http://localhost:5000/api-docs
- **Database Migrations**: Safe, tracked schema changes

##  Database Management

The project uses **Prisma Migrations** for safe database management:

### Available Commands
```bash
# Development
npm run migrate:dev          # Create and apply new migration
npm run migrate:status       # Check migration status
npm run migrate:reset        # Reset database (dev only)

# Production
npm run migrate:deploy       # Apply migrations safely

# Database Tools
npm run prisma:studio        # Open database GUI
npm run prisma:generate      # Regenerate Prisma Client
```

### Making Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run migrate:dev`
3. Name your migration (e.g., "add_user_profile")
4. Migration is created and applied automatically
5. Commit migration files to version control
