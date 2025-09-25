import { PrismaClient } from '@prisma/client';
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
// Extended Moroccan Fish & Seafood Seeding (French + Arabic)
// const fishProducts = [
const fishProducts = [
  { name: "Mulet بورة", category: "Poisson", price: 40, supplier: "Local" },
  { name: "Serran صنور", category: "Poisson", price: 60, supplier: "Local" },
  { name: "Raie راية", category: "Poisson", price: 70, supplier: "Local" },
  { name: "Dorade grise أوراغ", category: "Poisson", price: 90, supplier: "Local" },
  { name: "Denté ديدوب", category: "Poisson", price: 100, supplier: "Local" },
  { name: "Pagre دبدول", category: "Poisson", price: 110, supplier: "Local" },
  { name: "Sparidé شامة", category: "Poisson", price: 95, supplier: "Local" },
  { name: "Fausse sériole فوشاما", category: "Poisson", price: 120, supplier: "Local" },
  { name: "Sar شرغو", category: "Poisson", price: 80, supplier: "Local" },
  { name: "Chinchard شعرية", category: "Poisson", price: 50, supplier: "Local" },
  { name: "Bonite بونيت", category: "Poisson", price: 85, supplier: "Local" },
  { name: "Chinchard noir شلبة", category: "Poisson", price: 55, supplier: "Local" },
  { name: "Mérou معزة", category: "Poisson", price: 200, supplier: "Local" },
  { name: "Mérou blanc ميرو", category: "Poisson", price: 220, supplier: "Local" },
  { name: "Baudroie باوجو", category: "Poisson", price: 180, supplier: "Local" },
  { name: "Vive فايور", category: "Poisson", price: 75, supplier: "Local" },
  { name: "Sériole سوفريط", category: "Poisson", price: 130, supplier: "Local" },
  { name: "Chapon حداد", category: "Poisson", price: 150, supplier: "Local" },
  { name: "Dorade royale أبلاغ", category: "Poisson", price: 140, supplier: "Local" },
  { name: "Pagre rayé أمون", category: "Poisson", price: 115, supplier: "Local" }
];

for (const fish of fishProducts) {
  // Skip creating fish if it already exists
  const existingFish = await prisma.fish.findUnique({ where: { name: fish.name } as any });
  if (existingFish) {
    continue;
  }

  await prisma.fish.create({
    data: {
      name: fish.name,
      category: fish.category,
      status: 'In Stock',
      price: fish.price,
      stock: 50, // default stock
      minStock: 5,
      supplier: fish.supplier,
      imageUrl: `/images/fish/${fish.name.split(' ')[0].toLowerCase()}.jpg`,
      imageHint: fish.name.split(' ')[0].toLowerCase(),
    },
  });
}

console.log(`Created ${fishProducts.length} Moroccan fish products (FR + AR).`);
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