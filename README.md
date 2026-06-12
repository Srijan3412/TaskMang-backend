# 🚀 Taskly — Task Management REST API

A production-ready, security-hardened task management backend built with **Node.js**, **Express**, **PostgreSQL**, **Prisma ORM**, and **JWT authentication**. Features role-based access control, input validation, rate limiting, XSS protection, and Swagger API documentation.

Built as a clean-architecture REST API following industry best practices for authentication, authorization, and API security.

---

## ✨ Features

- **Authentication** — Register & Login with JWT tokens
- **Password Security** — bcrypt hashing (12 salt rounds)
- **Role-Based Access Control** — `USER` and `ADMIN` roles
- **Task CRUD** — Create, Read, Update, Delete with ownership enforcement
- **Ownership Checks** — Users can only access their own tasks; ADMINs can access all
- **Input Validation** — express-validator chains with detailed error messages
- **Security Hardened** — Helmet, rate limiting, XSS sanitization, CORS whitelist, body size limits
- **Swagger Documentation** — Interactive API docs at `/api-docs`
- **Clean Architecture** — Controller → Service → Prisma layered design
- **Environment Validation** — Zod schema validates all env vars at startup

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | PostgreSQL (Neon) / SQLite (dev) |
| **ORM** | Prisma |
| **Auth** | JWT + bcrypt |
| **Validation** | express-validator + Zod |
| **Security** | Helmet, express-rate-limit, xss |
| **Docs** | Swagger UI |
| **Logging** | Morgan |

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema with models
│   └── migrations/            # PostgreSQL migration files
├── src/
│   ├── config/
│   │   └── env.js             # Environment validation (Zod)
│   ├── controllers/
│   │   ├── auth.controller.js # Register & Login handlers
│   │   └── task.controller.js # Task CRUD handlers
│   ├── database/
│   │   └── prisma.js          # Prisma client singleton
│   ├── docs/
│   │   └── swagger.js         # Swagger/OpenAPI setup
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── role.middleware.js         # RBAC authorization
│   │   ├── rateLimiter.middleware.js  # Rate limiting (global + auth)
│   │   ├── sanitize.middleware.js     # XSS sanitization
│   │   ├── errorHandler.js           # Centralized error handler
│   │   └── notFound.js               # 404 fallback
│   ├── routes/v1/
│   │   ├── auth.routes.js     # POST /register, /login
│   │   └── task.routes.js     # CRUD /tasks
│   ├── services/
│   │   ├── auth.service.js    # Auth business logic
│   │   └── task.service.js    # Task business logic
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   ├── ApiResponse.js     # Standardized response wrapper
│   │   └── constants.js       # App constants
│   ├── validators/
│   │   ├── auth.validator.js  # Auth + Task validation chains
│   │   └── task.validator.js  # Task Zod schemas
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── .env.example               # Environment template
├── .gitignore
├── Dockerfile
└── package.json
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or use SQLite for local dev)

### 1. Clone & Install

```bash
git clone https://github.com/Srijan3412/TaskMang-backend.git
cd TaskMang-backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-min-8-characters"
NODE_ENV="development"
FRONTEND_URL="http://localhost:8080"
```

> **Production:** Replace `DATABASE_URL` with your PostgreSQL connection string:
> ```env
> DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
> ```

### 3. Setup Database

**For SQLite (local development):**
```bash
npx prisma db push
npx prisma generate
```

**For PostgreSQL (production):**
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start the Server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The server will start at:
```
http://localhost:4000
```

### 5. Verify

```bash
curl http://localhost:4000/api/v1/auth/login
```

You should get a `400` validation error (expected — no body sent).

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `4000` | Server port |
| `DATABASE_URL` | **Yes** | — | Database connection string |
| `JWT_SECRET` | **Yes** | — | JWT signing secret (min 8 chars) |
| `NODE_ENV` | No | `development` | `development` / `production` / `test` |
| `FRONTEND_URL` | No | `localhost:8080` | Comma-separated CORS allowed origins |

> ⚠️ The server will **refuse to start** if `DATABASE_URL` or `JWT_SECRET` are missing or invalid.

---

## 📡 API Endpoints

Base URL: `http://localhost:4000/api/v1`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Create a new account | ❌ Public |
| `POST` | `/auth/login` | Login and receive JWT | ❌ Public |

### Tasks

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `GET` | `/tasks` | Get user's tasks (ADMIN: all) | 🔒 JWT | USER, ADMIN |
| `POST` | `/tasks` | Create a new task | 🔒 JWT | USER, ADMIN |
| `GET` | `/tasks/:id` | Get task by ID | 🔒 JWT | Owner, ADMIN |
| `PUT` | `/tasks/:id` | Update a task | 🔒 JWT | Owner, ADMIN |
| `DELETE` | `/tasks/:id` | Delete a task | 🔒 JWT | Owner, ADMIN |
| `GET` | `/tasks/admin/all` | Get all tasks (admin only) | 🔒 JWT | ADMIN |

### Request/Response Examples

**Register:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"SecurePass1"}'
```

```json
{
  "statusCode": 201,
  "data": {
    "user": { "id": "...", "name": "John", "email": "john@example.com", "role": "USER" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

**Create Task:**
```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"title":"Build API","description":"Complete REST API","status":"IN_PROGRESS"}'
```

```json
{
  "statusCode": 201,
  "data": { "id": "...", "title": "Build API", "status": "IN_PROGRESS" },
  "message": "Task created successfully"
}
```

---

## 📖 API Documentation (Swagger)

Interactive Swagger UI is available at:

```
http://localhost:4000/api-docs
```

You can test all endpoints directly from the browser.

---

## 🔒 Security

This backend implements **6 layers of security**:

| Layer | Protection | Implementation |
|---|---|---|
| **Helmet** | Security headers, removes `X-Powered-By` | `helmet()` middleware |
| **Rate Limiting** | Brute-force prevention | Global: 100/15min, Auth: 5/15min |
| **XSS Sanitization** | Script injection prevention | Strips HTML tags from all inputs |
| **CORS** | Cross-origin restriction | Whitelist via `FRONTEND_URL` env |
| **Body Limit** | DoS payload prevention | 10kb max request body |
| **JWT Hardening** | Token security | Expired/invalid separation, user existence check |

### Additional Security:
- Passwords hashed with bcrypt (12 salt rounds)
- Passwords **never** returned in API responses
- JWT contains only `id`, `email`, `role` — no sensitive data
- Ownership checks on all task operations
- Error stacks hidden in production mode

---

## 🎨 Frontend

The React frontend is in a separate repository:

**Repository:** [TaskMang](https://github.com/Srijan3412/TaskMang)

### Frontend Tech Stack
- React 19 + TypeScript
- TanStack Router (file-based routing)
- TailwindCSS v4
- Shadcn/ui components
- Axios for API calls

### Frontend Features
- Registration & Login pages
- Protected dashboard with auth guards
- Task CRUD with real-time updates
- Status filtering (Pending, In Progress, Completed)
- Dark mode support
- Responsive design
- Toast notifications

### Running Frontend

```bash
git clone https://github.com/Srijan3412/TaskMang.git
cd TaskMang
npm install
npm run dev
```

Frontend runs at: `http://localhost:8080`

> Set `VITE_API_BASE_URL` environment variable to point to the backend:
> ```env
> VITE_API_BASE_URL=http://localhost:4000/api/v1
> ```

---

## 🚀 Deployment

### Backend — Render

1. Push to GitHub
2. Create a **Web Service** on [Render](https://render.com)
3. Connect your `TaskMang-backend` repo
4. Set:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `JWT_SECRET` | A strong random secret |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |

### Frontend — Vercel

1. Push to GitHub
2. Import on [Vercel](https://vercel.com/new)
3. Add environment variable:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api/v1` |

### Database — Neon PostgreSQL

1. Create a free project on [Neon](https://neon.tech)
2. Copy the connection string
3. Set it as `DATABASE_URL` on Render

### Docker

```bash
docker build -t taskly-backend .
docker run -p 4000:4000 --env-file .env taskly-backend
```

---

## 📈 Scalability Notes

### Redis Caching

Current architecture makes direct database calls for every request. Adding Redis as a caching layer would reduce database load significantly:

```
Current:    Request → PostgreSQL
Future:     Request → Redis Cache → PostgreSQL (cache miss only)
```

**Candidates for caching:**
- Task lists (cache per user, invalidate on write)
- Dashboard statistics
- User profile lookups

**Implementation:** Use `ioredis` + a cache-aside pattern with TTL-based expiration.

---

### Load Balancing

Scale horizontally behind a reverse proxy:

```
              ┌──────────┐
  Users  ───► │  Nginx   │
              └────┬─────┘
           ┌───────┼───────┐
           │       │       │
        Node 1  Node 2  Node 3
           │       │       │
           └───────┼───────┘
              PostgreSQL
```

The app is already **stateless** — JWT auth means no server-side sessions, so any instance can handle any request.

---

### Horizontal Scaling

No code changes needed for horizontal scaling because:

1. **JWT authentication** — No server-side session storage
2. **Stateless design** — No in-memory state between requests
3. **Prisma connection pooling** — Database connections managed automatically
4. **Rate limiting caveat** — Move to Redis-backed rate limiting (`rate-limit-redis`) for multi-instance deployments

---

### Microservices Migration Path

Current monolith can be decomposed into independent services:

```
Current Monolith          Future Microservices
┌─────────────────┐       ┌──────────────┐
│  Auth            │       │ Auth Service │ → JWT issuance
│  Tasks           │  ──►  │ Task Service │ → CRUD operations
│  Validation      │       │ Notification │ → Email/push alerts
│  Security        │       │ API Gateway  │ → Rate limiting, routing
└─────────────────┘       └──────────────┘
```

**Communication:** REST for synchronous calls, message queues (RabbitMQ/Redis Pub-Sub) for async events like notifications.

**Benefits:**
- Independent deployment cycles
- Independent scaling (scale Task Service during peak hours)
- Technology flexibility (rewrite Auth in Go if needed)
- Fault isolation (Auth failure doesn't break Tasks)

---

## 📜 License

MIT

---

## 👤 Author

**Srijan Bajpai**

- GitHub: [@Srijan3412](https://github.com/Srijan3412)
