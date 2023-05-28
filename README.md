# Fullstack Authentication Example with Next.js and NextAuth.js

This is the starter project for the fullstack tutorial with Next.js and Prisma. You can find the final version of this project in the [`final`](https://github.com/prisma/blogr-nextjs-prisma/tree/final) branch of this repo.

## Building

`npm run dev`

## Prisma

To actually create the tables in your database, you now can use the following command of the Prisma CLI:

with multiple .env files:

`dotenv -e .env.local -- npx prisma db push`

with only .env:

`npx prisma db push`

**Studio**

`npx prisma studio` opens a db editor

The above requires installing the prisma cli and the dotenv cli
`npm install -g dotenv-cli && npx prisma generate`

## Notes

Used this example tutorial https://vercel.com/guides/nextjs-prisma-postgres 