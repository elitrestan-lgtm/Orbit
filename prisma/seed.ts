import { PrismaClient } from "@prisma/client";
import { DEFAULT_NUDGE_WINDOWS, RELATIONSHIPS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  for (const relationship of RELATIONSHIPS) {
    await prisma.nudgeSetting.upsert({
      where: { relationship },
      update: {},
      create: { relationship, daysWindow: DEFAULT_NUDGE_WINDOWS[relationship] },
    });
  }

  for (const provider of ["gmail", "linkedin"] as const) {
    await prisma.integration.upsert({
      where: { provider },
      update: {},
      create: { provider, status: "disconnected" },
    });
  }

  const count = await prisma.contact.count();
  if (count === 0) {
    const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000);
    await prisma.contact.createMany({
      data: [
        {
          name: "Ada Lovelace",
          email: "ada@analytical.engine",
          company: "Analytical Engine",
          role: "Engineer",
          relationship: "mentor",
          warmth: 4,
          notes: "Mathematics mentor — intro'd by Babbage.",
          lastContactedAt: daysAgo(10),
        },
        {
          name: "Grace Hopper",
          email: "grace@navy.mil",
          company: "US Navy",
          role: "Rear Admiral",
          relationship: "advisor",
          warmth: 5,
          notes: "Introduced me to compilers. Check in after conference.",
          lastContactedAt: daysAgo(45),
        },
        {
          name: "Alan Turing",
          email: "alan@bletchley.uk",
          company: "Bletchley Park",
          role: "Cryptanalyst",
          relationship: "collaborator",
          warmth: 3,
          notes: "Working on the enigma project together.",
          lastContactedAt: daysAgo(3),
        },
        {
          name: "Katherine Johnson",
          company: "NASA",
          role: "Mathematician",
          relationship: "peer",
          warmth: 4,
          notes: "Coffee every few weeks.",
          lastContactedAt: daysAgo(20),
        },
        {
          name: "Linus Torvalds",
          email: "linus@kernel.org",
          company: "Linux Foundation",
          role: "Fellow",
          relationship: "friend",
          warmth: 2,
          notes: "Old friend — owe him a beer.",
          lastContactedAt: daysAgo(120),
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
