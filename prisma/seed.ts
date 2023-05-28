import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import {randomUUID} from 'crypto'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Deyan Mechev',
    email: 'deyan@metchev.net',
    username: 'deyan',
    password: bcrypt.hashSync('123', 10),
    userAuthToken: randomUUID()
  },
  {
    name: 'Anders Nielsen',
    email: 'anders@mail.com',
    username: 'anders',
    password: bcrypt.hashSync('345', 10),
    userAuthToken: randomUUID()
  },
  {
    name: 'Generic User',
    email: 'user@mail.com',
    username: 'genericUser',
    password: bcrypt.hashSync('678', 10),
    userAuthToken: randomUUID()
  },
]

async function main() {
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: {email: u.email},
      update: {email: u.email},
      create: {
        name: u.name,
        username: u.username,
        email: u.email,
        password: u.password,
        userAuthToken: u.userAuthToken
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
