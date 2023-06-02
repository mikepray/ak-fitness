# fitness app for clients

a webapp for fitness trainers to build workouts for clients. 

built on nextjs, prisma, postgres, and running on vercel

## Building

`npm run dev`

## Prisma

To actually create the tables in your database, you now can use the following command of the Prisma CLI:

with multiple .env files (e.g., `.env.local`):

`dotenv -e .env.local -- npx prisma db push`

with only .env:

`npx prisma db push`

**Studio**

`npx prisma studio` opens a db editor connected to the vercel cloud pg db

The above requires installing the prisma cli and the dotenv cli
`npm install -g dotenv-cli && npx prisma generate`

## Notes

Used this example tutorial https://vercel.com/guides/nextjs-prisma-postgres 