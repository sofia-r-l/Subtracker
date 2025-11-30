# SubTracker Backend (server)

This folder contains a minimal Node + Express backend using Prisma with SQLite for the SubTracker app.

Quick start (from this folder):

1. Install deps

```powershell
npm install
```

2. Generate Prisma client and migrate DB

```powershell
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

3. Start dev server

```powershell
npm run dev
```

The API will run at http://localhost:4000/api/subscriptions
