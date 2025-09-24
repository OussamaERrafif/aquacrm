import { PrismaClient, Prisma, PartyType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/fr'; // Using French locale for Moroccan-style names

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear the database
  console.log('Clearing the database ...');
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.loan.deleteMany({});
  await prisma.charge.deleteMany({});
  await prisma.chargesInvoice.deleteMany({});
  await prisma.fish.deleteMany({});
  await prisma.party.deleteMany({});
  await prisma.collaborator.deleteMany({});
  await prisma.tracability.deleteMany({});
  console.log('Database cleared.');

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
        type: faker.helpers.arrayElement([PartyType.BUYER, PartyType.SELLER]),
      },
    });
    parties.push(party);
  }
  console.log('Created 20 parties.');

  // Create Fish products
  const fishProducts: any[] = [];
  const fishNames = ['Sardine', 'Merlu', 'Sole', 'Thon', 'Dorade', 'Loup de mer', 'Crevette Royale', 'Calmar'];
  for (const name of fishNames) {
    // Skip creating fish if a product with the same name already exists
    const existingFish = await prisma.fish.findUnique({ where: { name } as any });
    if (existingFish) {
      fishProducts.push(existingFish as any);
      continue;
    }

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

    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    let newInvoiceNumber = 'INV-1';
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastInvoiceNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
      newInvoiceNumber = `INV-${lastInvoiceNumber + 1}`;
    }

    await prisma.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
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

  // Create Collaborators
  const collaborators = [];
  for (let i = 0; i < 5; i++) {
    const collaborator = await prisma.collaborator.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, Morocco`,
      },
    });
    collaborators.push(collaborator);
  }
  console.log('Created 5 collaborators.');

  // Create ChargesInvoices
  for (const collaborator of collaborators) {
    for (let i = 0; i < 2; i++) {
      const totalAmount = parseFloat(faker.commerce.price({ min: 100, max: 2000 }));
      const lastChargesInvoice = await prisma.chargesInvoice.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      let newChargesInvoiceNumber = 'INV-1';
      if (lastChargesInvoice && lastChargesInvoice.invoiceNumber) {
        const lastChargesInvoiceNumber = parseInt(lastChargesInvoice.invoiceNumber.split('-')[1]);
        newChargesInvoiceNumber = `INV-${lastChargesInvoiceNumber + 1}`;
      }

      await prisma.chargesInvoice.create({
        data: {
          invoiceNumber: newChargesInvoiceNumber,
          collaboratorId: collaborator.id,
          date: faker.date.past(),
          totalAmount: totalAmount,
          status: faker.helpers.arrayElement(['Paid', 'Unpaid']),
          charges: {
            create: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
              title: faker.commerce.productName(),
              price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
            })),
          },
        },
      });
    }
  }
  console.log('Created charges invoices.');


  console.log('Seeding finished.');

  // Ensure an admin user exists
  const adminUsername = 'admin';
  const adminEmail = 'admin@local.com';
  const adminPlain = 'admin';

  const existing = await prisma.user.findUnique({ where: { username: adminUsername } });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPlain, 10);
    await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashed,
      },
    });
    console.log('Created admin user (username: admin, password: admin)');
  } else {
    console.log('Admin user already exists, skipping creation.');
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