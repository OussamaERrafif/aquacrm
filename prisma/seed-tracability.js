const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing Tracability entries...');
  await prisma.tracability.deleteMany();

  console.log('Creating 15 new Tracability entries...');
  for (let i = 0; i < 15; i++) {
    await prisma.tracability.create({
      data: {
        codeMareyeur: `MAR-${faker.string.alphanumeric(8).toUpperCase()}`,
        nomMareyeur: faker.person.fullName(),
        poidsAchete: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
        poidsVendu: faker.number.float({ min: 50, max: 900, precision: 0.01 }),
        tracabilityDate: faker.date.past(),
      },
    });
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
