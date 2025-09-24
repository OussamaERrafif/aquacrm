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

const fishProducts = [
  { name: 'Sardine سردين', category: 'Poisson bleu', price: 30, supplier: 'Coopérative de pêche Agadir' },
  { name: 'Merlu ميرلو', category: 'Poisson blanc', price: 90, supplier: 'Marché de gros Casablanca' },
  { name: 'Sole سول', category: 'Poisson plat', price: 120, supplier: 'Pêche côtière Dakhla' },
  { name: 'Thon تونة', category: 'Poisson pélagique', price: 150, supplier: 'Port de Tan-Tan' },
  { name: 'Dorade Royale دوراد', category: 'Poisson blanc', price: 110, supplier: 'Coopérative Safi' },
  { name: 'Loup de Mer (Bar) لووت دو مير (بـار)', category: 'Poisson blanc', price: 130, supplier: 'Port de Larache' },
  { name: 'Crevette Royale روبيان ملكي', category: 'Crustacé', price: 160, supplier: 'Pêcheurs de Nador' },
  { name: 'Calmar كلمار', category: 'Céphalopode', price: 140, supplier: 'Marché d’El Jadida' },
  { name: 'Chinchard (Maquereau) شينشار (ماكرو)', category: 'Poisson bleu', price: 60, supplier: 'Port de Mohammedia' },
  { name: 'Espadon سيف البحر', category: 'Poisson noble', price: 200, supplier: 'Pêche hauturière Agadir' },
  { name: 'Rouget روشيه', category: 'Poisson côtier', price: 100, supplier: 'Marché de Larache' },
  { name: 'Seiche سيش', category: 'Céphalopode', price: 150, supplier: 'Port de Laâyoune' },
  { name: 'Langouste Rouge لوبستر أحمر', category: 'Crustacé', price: 350, supplier: 'Pêcheurs de Dakhla' },
  { name: 'Huître de Dakhla محار الداخلة', category: 'Mollusque', price: 80, supplier: 'Ferme marine Dakhla' },
  { name: 'Palourdes (Clams) محار', category: 'Mollusque', price: 70, supplier: 'Marée Rabat' },

  // Extended Moroccan fish & seafood
  { name: 'Carangue كرانغ', category: 'Poisson pélagique', price: 90, supplier: 'Port d’Agadir' },
  { name: 'Bonite بونيت', category: 'Poisson bleu', price: 80, supplier: 'Marché de Casablanca' },
  { name: 'Mulet بوري', category: 'Poisson gris', price: 70, supplier: 'Port de Kénitra' },
  { name: 'Anchois أنشوفة', category: 'Poisson bleu', price: 40, supplier: 'Port d’Al Hoceima' },
  { name: 'Pagre بَاجَر', category: 'Poisson blanc', price: 120, supplier: 'Pêche côtière Safi' },
  { name: 'Denté دنط', category: 'Poisson noble', price: 150, supplier: 'Port de Tanger' },
  { name: 'Raie راي', category: 'Poisson plat', price: 90, supplier: 'Marché de Mohammedia' },
  { name: 'Requin قرش', category: 'Poisson pélagique', price: 200, supplier: 'Port de Tan-Tan' },
  { name: 'Homard لوبستر', category: 'Crustacé', price: 400, supplier: 'Pêcheurs de Dakhla' },
  { name: 'Écrevisse كرافيت', category: 'Crustacé', price: 120, supplier: 'Ferme marine Nador' },
  { name: 'Bigorneau بيروني', category: 'Mollusque', price: 50, supplier: 'Côte Atlantique' },
  { name: 'Telline تيلين', category: 'Mollusque', price: 60, supplier: 'Marée Rabat' },
  { name: 'Mérou جرو', category: 'Poisson noble', price: 250, supplier: 'Port de Casablanca' },
  { name: 'Saint-Pierre سان بيير', category: 'Poisson noble', price: 220, supplier: 'Port de Safi' },
  { name: 'Turbo توربو', category: 'Poisson plat', price: 180, supplier: 'Port de Tanger' },
  { name: 'Capitaine كابيتان', category: 'Poisson blanc', price: 170, supplier: 'Port de Dakhla' },
  { name: 'Maquereau ماكرو', category: 'Poisson bleu', price: 60, supplier: 'Pêcheurs d’El Jadida' },
  { name: 'Congre كونغر', category: 'Poisson allongé', price: 110, supplier: 'Port d’Essaouira' },
  { name: 'Poisson-Scorpion سمك عقرب', category: 'Poisson côtier', price: 140, supplier: 'Marché de Tétouan' },
  { name: 'Dorade Grise دوراد رمادية', category: 'Poisson blanc', price: 100, supplier: 'Port de Safi' },
  { name: 'Chapon شابون', category: 'Poisson de roche', price: 160, supplier: 'Port de Tanger' },
  { name: 'Baliste باليست', category: 'Poisson de récif', price: 130, supplier: 'Port de Larache' },
  { name: 'Anguille ثعبان البحر', category: 'Poisson allongé', price: 200, supplier: 'Marée Rabat' },
  { name: 'Crabe سلطعون', category: 'Crustacé', price: 90, supplier: 'Port de Kénitra' },
  { name: 'Araignée de Mer عنكبوت البحر', category: 'Crustacé', price: 150, supplier: 'Pêcheurs de Larache' },
  { name: 'Poulpe أخطبوط', category: 'Céphalopode', price: 120, supplier: 'Port de Laâyoune' },
  { name: 'Langoustine لانغوستين', category: 'Crustacé', price: 180, supplier: 'Marché de Casablanca' },
  { name: 'Crevette Grise روبيان رمادي', category: 'Crustacé', price: 90, supplier: 'Port de Tanger' },
  { name: 'Crevette Rose روبيان وردي', category: 'Crustacé', price: 110, supplier: 'Port de Safi' },
  { name: 'Bernique برنيك', category: 'Mollusque', price: 50, supplier: 'Côte Atlantique' },
  { name: 'Alose أَلوز', category: 'Poisson bleu', price: 80, supplier: 'Port de Mohammedia' },
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