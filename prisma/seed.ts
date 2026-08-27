import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  EligibilityStatus,
  TransactionStatus,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const users = [
  {
    demoIdentifier: "10000000001",
    displayName: "Marina Oliveira",
    birthDate: new Date("1992-04-18"),
    motherName: "Clara Oliveira",
    email: "marina@example.test",
    phone: "11900000001",
    isManualEntry: false,
  },
  {
    demoIdentifier: "20000000002",
    displayName: "Rafael Santos",
    email: "rafael@example.test",
    phone: "21900000002",
    isManualEntry: true,
  },
  {
    demoIdentifier: "90000000009",
    displayName: "Pessoa de Teste",
    isManualEntry: true,
  },
];

const creditors = [
  { code: "DEMO-01", name: "Caixa Econômica Federal", availableSlots: 81 },
  { code: "DEMO-02", name: "Banco do Brasil", availableSlots: 71 },
  { code: "DEMO-03", name: "Bradesco ", availableSlots: 96 },
  { code: "DEMO-04", name: "Itaú Unibanco", availableSlots: 80 },
  { code: "DEMO-05", name: "Santander", availableSlots: 77 },
  { code: "DEMO-06", name: "Nubank", availableSlots: 68 },
  { code: "DEMO-07", name: "Banco Inter", availableSlots: 49 },
  { code: "DEMO-08", name: "Creditas", availableSlots: 73 },
  { code: "DEMO-09", name: "PagBank", availableSlots: 52 },
  { code: "DEMO-10", name: "C6 Bank", availableSlots: 47 },
  { code: "DEMO-11", name: "Mercado Pago", availableSlots: 79 },
  { code: "DEMO-12", name: "Banco Original", availableSlots: 53 },
  { code: "DEMO-13", name: "Banco do Nordeste", availableSlots: 95},
  { code: "DEMO-14", name: "Serasa Credor", availableSlots: 100 },
  { code: "DEMO-15", name: "SPC Brasil", availableSlots: 54 },
  { code: "DEMO-16", name: "Hiper Financeira", availableSlots: 105 },
  { code: "DEMO-17", name: "Picpay", availableSlots: 101 },
  { code: "DEMO-18", name: "Will Bank", availableSlots: 50 },
  { code: "DEMO-19", name: "Neon", availableSlots: 72 },
  { code: "DEMO-20", name: "Agibank", availableSlots: 82 },
  { code: "DEMO-21", name: "Banestes", availableSlots: 68 },
  { code: "DEMO-22", name: "Uniprime", availableSlots: 74 },
  { code: "DEMO-23", name: "Recupera Fácil", availableSlots: 57 },
  { code: "DEMO-24", name: "Acesso Bank", availableSlots: 64 },
  { code: "DEMO-25", name: "Cartão Americanas", availableSlots: 84 },
  { code: "DEMO-26", name: "Magazine Luiza Financeira", availableSlots: 68 },
  { code: "DEMO-27", name: "BlackBird Finance", availableSlots: 59 },
];

async function main() {
  const [existingUsers, existingCreditors] = await Promise.all([
    prisma.demoUser.count(),
    prisma.creditor.count(),
  ]);

  if (existingUsers > 0 && existingCreditors > 0) {
    console.log("Dados acadêmicos já existem; seed preservado sem alterações.");
    return;
  }

  await prisma.conversationEvent.deleteMany();
  await prisma.conversationSession.deleteMany();
  await prisma.simulatedTransaction.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.creditor.deleteMany();
  await prisma.eligibilityCheck.deleteMany();
  await prisma.demoSession.deleteMany();
  await prisma.demoUser.deleteMany();

  const [found, manual, incomplete] = await Promise.all(
    users.map((data) => prisma.demoUser.create({ data })),
  );
  await prisma.eligibilityCheck.createMany({
    data: [
      {
        userId: found.id,
        status: EligibilityStatus.ELIGIBLE,
        reason: "Cenário fictício elegível",
      },
      {
        userId: manual.id,
        status: EligibilityStatus.INELIGIBLE,
        reason: "Cenário fictício inelegível",
      },
      {
        userId: incomplete.id,
        status: EligibilityStatus.ERROR,
        reason: "Cenário fictício com dados incompletos",
      },
    ],
  });

  const seededCreditors = [];
  for (const item of creditors) {
    const creditor = await prisma.creditor.create({
      data: { code: item.code, name: item.name },
    });
    const offer = await prisma.offer.create({
      data: {
        creditorId: creditor.id,
        title: "Acordo acadêmico fictício",
        debtType: "CARTAO_DEMO",
        originalAmount: "1000.00",
        settlementAmount: "178.57",
        discountPercent: "82.14",
        availableSlots: item.availableSlots,
      },
    });
    seededCreditors.push({ creditor, offer });
  }
  const { creditor, offer } = seededCreditors[0];
  const now = Date.now();
  await prisma.simulatedTransaction.createMany({
    data: [
      {
        userId: found.id,
        offerId: offer.id,
        idempotencyKey: "seed-pending",
        status: TransactionStatus.PENDING,
        amount: "178.57",
        simulationCode: "DEMO-NOT-A-REAL-PIX-PENDING",
        expiresAt: new Date(now + 600_000),
      },
      {
        userId: found.id,
        offerId: offer.id,
        idempotencyKey: "seed-approved",
        status: TransactionStatus.APPROVED,
        amount: "48.90",
        simulationCode: "DEMO-NOT-A-REAL-PIX-APPROVED",
        expiresAt: new Date(now + 600_000),
        approvedAt: new Date(),
      },
      {
        userId: manual.id,
        idempotencyKey: "seed-failed",
        status: TransactionStatus.FAILED,
        amount: "94.73",
        simulationCode: "DEMO-NOT-A-REAL-PIX-FAILED",
        expiresAt: new Date(now + 600_000),
      },
      {
        userId: incomplete.id,
        idempotencyKey: "seed-expired",
        status: TransactionStatus.EXPIRED,
        amount: "94.73",
        simulationCode: "DEMO-NOT-A-REAL-PIX-EXPIRED",
        expiresAt: new Date(now - 60_000),
      },
    ],
  });
  const conversation = await prisma.conversationSession.create({
    data: {
      userId: found.id,
      creditorId: creditor.id,
      currentStep: "category_selection",
    },
  });
  await prisma.conversationEvent.create({
    data: {
      sessionId: conversation.id,
      direction: "SYSTEM",
      eventType: "WELCOME",
      content: "Sessão acadêmica iniciada. Nenhum dado ou pagamento é real.",
      sequence: 1,
    },
  });
  console.log("Seed acadêmico concluído com identificadores numéricos locais:");
  users.forEach((user) =>
    console.log(`${user.demoIdentifier}: ${user.displayName}`),
  );
}

main().finally(() => prisma.$disconnect());
