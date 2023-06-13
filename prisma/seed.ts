import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import {randomUUID} from 'crypto'
import {CaseStatus} from "../src/lib/enums/CaseStatus"
import {DocType} from "../src/lib/enums/DocType"

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

const caseData = [
  {
    status: CaseStatus.NEW,
    caseNumber: '812345',
    address: 'Sofia, str. Valdayska 12',
    createdBy: 1,
    documents: {
      create: [
        {
          heading: 'Lorem ipsum dolor sit amet',
          type: DocType.RESERVATION,
          desc: 'Nunc arcu erat, dapibus quis ornare sit amet, ornare efficitur lorem.',
          documentSubItems: {
            create: [
              {
                label: 'Suspendisse non erat libero.',
                checked: true
              },
              {
                label: 'Donec tellus nulla, molestie bibendum eros quis, imperdiet consequat metus.'
              }
            ]
          },
          sequence: 1
        },
        {
          heading: 'Morbi hendrerit erat at vehicula cursus',
          type: DocType.QUESTION,
          desc: 'Lorem ipsum dolor sit amet',
          documentSubItems: {
            create: [
              {
                label: 'Nunc arcu erat, dapibus quis ornare sit amet, ornare efficitur lorem.',
                checked: true
              },
              {
                label: 'Suspendisse non erat libero.'
              }
            ]
          },
          sequence: 2
        }
      ]
    }
  }
]

const templateData = [
  {
    type: DocType.INFO,
    heading: 'Info Morbi hendrerit erat at vehicula cursus',
    desc: 'Lorem ipsum dolor sit amet'
  },
  {
    type: DocType.QUESTION,
    heading: 'Question Lorem ipsum dolor sit amet',
    desc: 'Nunc arcu erat, dapibus quis ornare sit amet, ornare efficitur lorem.'
  },
  {
    type: DocType.RESERVATION,
    heading: 'Reservation Quisque sit amet euismod magna'
  }
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

  for (const c of caseData) {
    const caseItem = await prisma.case.upsert({
      where: {caseNumber: c.caseNumber},
      update: {caseNumber: c.caseNumber},
      create: {
        status: c.status,
        caseNumber: c.caseNumber,
        address: c.address,
        createdBy: c.createdBy,
        documents: c.documents
      }
    })
  }

  for (const td of templateData) {
    const templateData = await prisma.templateDocument.create({
      data: td
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
