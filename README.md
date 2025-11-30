Requisitos:
- Node.js 18+ (o 20+)

1) Instalar dependencias (raíz):

\`\`\`powershell
npm install
\`\`\`

2) Arrancar frontend (desarrollo):

\`\`\`powershell
npm run dev
# http://localhost:5173
\`\`\`
3) Preparar y arrancar backend (carpeta `server`):

\`\`\`powershell
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init   # crea y aplica migraciones
npm run db:seed                      # opcional: poblar DB
npm run dev                          # servidor dev en http://localhost:4000
\`\`\`

API: http://localhost:4000/api/subscriptions