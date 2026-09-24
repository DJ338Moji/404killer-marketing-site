const fs = require('fs');
const path = require('path');
const config = require('../config');

async function reportAppMetrics() {
  console.log(`📊 [Routine 4] Fetching Mojipass Shopify app adoption & churn metrics...`);

  let sessions = [];
  let uninstalledFromFirestore = [];

  // 1. Query PostgreSQL via Prisma
  try {
    const prismaModulePath = path.resolve('/Users/dalejohnson/Documents/Documents - Dale’s MacBook Air/Mojipass/MojipassProjects/mojipass-shopify-app/node_modules/@prisma/client');
    if (fs.existsSync(prismaModulePath)) {
      const { PrismaClient } = require(prismaModulePath);
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: config.mojipass.databaseUrl
          }
        }
      });
      sessions = await prisma.session.findMany();
      await prisma.$disconnect();
    }
  } catch (err) {
    console.warn(`Warning querying PostgreSQL: ${err.message}`);
  }

  // 2. Query Firestore for uninstalled logs
  try {
    const adminPath = path.resolve('/Users/dalejohnson/Documents/Documents - Dale’s MacBook Air/Mojipass/MojipassProjects/mojipass-core-api/node_modules/firebase-admin');
    if (fs.existsSync(adminPath) && config.mojipass.firebase.privateKey) {
      const admin = require(adminPath);
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.mojipass.firebase.projectId,
            clientEmail: config.mojipass.firebase.clientEmail,
            privateKey: config.mojipass.firebase.privateKey
          })
        });
      }
      const db = admin.firestore();
      const snapshot = await db.collection('shops').where('status', '==', 'uninstalled').get();
      snapshot.forEach(doc => {
        uninstalledFromFirestore.push({ id: doc.id, ...doc.data() });
      });
    }
  } catch (err) {
    console.warn(`Warning querying Firestore: ${err.message}`);
  }

  // 3. Snapshot tracking for delta analysis
  const snapshotPath = path.join(config.paths.logsDir, 'merchant_snapshot.json');
  let previousShops = [];
  if (fs.existsSync(snapshotPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
      previousShops = parsed.shops || [];
    } catch (e) {}
  }

  const currentShops = [...new Set(sessions.map(s => s.shop))];
  const newInstallsList = currentShops.filter(s => !previousShops.includes(s));
  const removedShopsList = previousShops.filter(s => !currentShops.includes(s));

  // Save current snapshot
  fs.writeFileSync(snapshotPath, JSON.stringify({
    lastChecked: new Date().toISOString(),
    shops: currentShops
  }, null, 2), 'utf8');

  const result = {
    totalActive: currentShops.length,
    activeShops: currentShops,
    newInstalls: newInstallsList.length,
    recentInstalls: newInstallsList.map(s => ({ shop: s, installedAt: new Date().toISOString() })),
    uninstalls: removedShopsList.length,
    recentUninstalls: removedShopsList.map(s => ({ shop: s, uninstalledAt: new Date().toISOString() })),
    firestoreUninstalls: uninstalledFromFirestore
  };

  console.log(`✅ [Routine 4 Completed] Active Stores: ${result.totalActive} | New: ${result.newInstalls} | Removals: ${result.uninstalls}`);
  return result;
}

module.exports = reportAppMetrics;
