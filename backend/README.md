# LetsType Backend

Production-oriented backend foundation for the LetsType application. This phase provides the Express server, environment validation, Prisma schema, and health endpoint that future authentication, user profile, progress, analytics, achievements, and leaderboard features can build on.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma
- Zod

## Setup

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to a local PostgreSQL connection string before running Prisma commands. Set `JWT_SECRET` before using authenticated routes, and set `GOOGLE_CLIENT_ID` before using Google authentication.

## Scripts

```bash
npm run dev
npm start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Health Check

```http
GET /health
```

Expected response:

```json
{
  "status": "ok",
  "service": "letstype-backend"
}
```

## Structure

```text
src/
  config/       Environment and application configuration
  controllers/  Request handlers
  middleware/   Express middleware
  routes/       Route registration
  services/     Business service modules
  validators/   Zod schemas
  utils/        Shared backend utilities
  app.js        Express app composition
```
