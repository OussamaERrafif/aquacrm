import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/fr'; // Using French locale for Moroccan-style names

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Parties (customers and suppliers)
  const parties = [];
  for (let i = 0; i < 20; i++) {
    const party = await prisma.party.create({
      data: {
        name: faker.person.fullName(),
        company: faker.company.name(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, Morocco`,
      },
    });
    parties.push(party);
  }
  console.log('Created 20 parties.');

  // Create Fish products
  const fishProducts: any[] = [];
  const fishNames = ['Sardine', 'Merlu', 'Sole', 'Thon', 'Dorade', 'Loup de mer', 'Crevette Royale', 'Calmar'];
  for (const name of fishNames) {
    const fish = await prisma.fish.create({
      data: {
        name: name,
        category: faker.commerce.department(),
        status: 'In Stock',
        price: parseFloat(faker.commerce.price({ min: 50, max: 200 })),
        stock: faker.number.int({ min: 10, max: 100 }),
        minStock: 5,
        supplier: faker.company.name(),
        imageUrl: faker.image.url(),
        imageHint: name.toLowerCase().replace(' ', '_'),
      },
    });
    fishProducts.push(fish);
  }
  console.log(`Created ${fishNames.length} fish products.`);

  // Create Invoices (buy and sell)
  for (let i = 0; i < 30; i++) {
    const party = faker.helpers.arrayElement(parties);
    const type = faker.helpers.arrayElement(['buy', 'sell']);
    const status = faker.helpers.arrayElement(['Paid', 'Unpaid', 'Overdue']);
    const totalAmount = parseFloat(faker.commerce.price({ min: 500, max: 10000 }));

    await prisma.invoice.create({
      data: {
        type: type,
        date: faker.date.past(),
        dueDate: faker.date.future(),
        totalAmount: totalAmount,
        status: status,
        partyId: party.id,
        items: {
          create: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => {
            const fish = faker.helpers.arrayElement(fishProducts);
            const weight = faker.number.int({ min: 1, max: 20 });
            const pricePerKilo = fish.price;
            return {
              fishId: fish.id,
              length: faker.helpers.arrayElement(['xs', 's', 'm', 'l', 'xl', 'xxl']),
              weight: weight,
              pricePerKilo: pricePerKilo,
            };
          }),
        },
      },
    });
  }
  console.log('Created 30 invoices.');

  // Create Loans
  for (let i = 0; i < 10; i++) {
    const party = faker.helpers.arrayElement(parties);
    await prisma.loan.create({
      data: {
        amount: parseFloat(faker.finance.amount({ min: 1000, max: 20000 })),
        disbursementDate: faker.date.past(),
        repaymentSchedule: 'Monthly',
        outstandingBalance: parseFloat(faker.finance.amount({ min: 0, max: 10000 })),
        status: faker.helpers.arrayElement(['Active', 'Paid Off', 'Defaulted']),
        fisherId: party.id,
      },
    });
  }
  console.log('Created 10 loans.');

  // Create Tracability entries
  for (let i = 0; i < 15; i++) {
    const tracData: Prisma.TracabilityCreateInput = {
      codeMareyeur: `MAR-${faker.string.alphanumeric(8).toUpperCase()}`,
      nomMareyeur: faker.person.fullName(),
      poidsAchete: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
      poidsVendu: faker.number.float({ min: 50, max: 900, fractionDigits: 2 }),
      tracabilityDate: faker.date.past(),
    } as any;

    await prisma.tracability.create({ data: tracData as any });
  }
  console.log('Created 15 tracability entries.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });