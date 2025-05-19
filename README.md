How to run: 

1. npm install
2. create .env file 
3. run prisma

command to run prisma: 
npx prisma migrate dev --name init
npx prisma generate

db using mysql workspace

inside .env file: 
DATABASE_URL="mysql://root:password@localhost:3306/orgx_db"
JWT_SECRET="your_jwt_secret"
PORT=5000
