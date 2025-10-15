# Admin Panel - User Management System

Full-stack application with Protobuf serialization and RSA-4096 cryptographic signing.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm installed
- Git (to clone the repository)

**Note:** No `.env` files needed! Everything works with sensible defaults.

### Step 1: Clone the Repository
```bash
git clone https://github.com/bencyubahiro77/QT-mini-admin-panel.git`
cd QT
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup SQLite database and generate Prisma client
npm run db:push

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
- ✅ SQLite database created
- ✅ RSA-4096 keys generated and saved to `backend/keys/`
- ✅ Frontend proxies API requests to backend
- ✅ No configuration required!

##   Project Structure

```
QT/
├── backend/              # Node.js + Express + Prisma API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes  
│   │   ├── services/     # Crypto & Protobuf services
│   │   └── utils/        # RSA key management
│   └── prisma/           # Database schema
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

##  Notes & Assumptions

### Data Flow
1. **Backend** generates RSA-4096 key pair on first startup
2. When creating/updating users:
   - Email is hashed using SHA-384
   - Email is signed with private RSA key
   - Hash and signature stored in SQLite database
3. **Frontend** fetches data as Protobuf binary format
4. Each user is cryptographically verified before display

### Key Assumptions
- **Database**: SQLite is used for simplicity (file-based at `backend/prisma/dev.db`)
- **RSA Keys**: Auto-generated on first run and stored in `backend/keys/` directory
  - `private-key.pem` - Used for signing (keep secure in production!)
  - `public-key.pem` - Used for verification (shared with frontend via API)
  - Keys persist across restarts
- **Ports**: Backend on 5000, Frontend on 5173 (defaults, configurable via `.env`)
- **CORS**: Enabled for local development (configure for production)
- **API Proxy**: Frontend dev server proxies `/api` requests to backend automatically
- **Data Integrity**: All users must have valid signatures to appear in the UI
- **Hot Reload**: Both servers support hot reload during development

### Important Notes
-  **Zero Configuration**: No `.env` files needed for local development - everything auto-generates
-  **First Run**: Database (`dev.db`) and RSA keys (`keys/*.pem`) are created automatically
-  **Email Changes**: Updating a user's email triggers re-signing with new hash and signature
-  **Security**: Current implementation is for demonstration - add authentication for production
-  **Protobuf**: ~60% smaller payload compared to JSON for user lists
-  **API Docs**: Swagger UI provides interactive testing at http://localhost:5000/api-docs
-  **Environment Variables**: See `.env.example` files for optional configuration (not required)

### Troubleshooting
- **Port 5000 in use**: Stop other processes or change `PORT` in `.env`
- **Frontend can't connect**: Verify backend is running at http://localhost:5000
- **Crypto verification fails**: Keys auto-generate on first run. If deleted, restart backend to regenerate.
- **Prisma errors**: Run `npm run db:push` in backend directory
- **Missing dependencies**: Delete `node_modules` and run `npm install` again

---

**Built with TypeScript, React, and Node.js**
