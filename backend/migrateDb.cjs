require('dotenv').config();
const { MongoClient } = require('mongodb');

// REPLACE THESE WITH YOUR ACTUAL URIs
const SOURCE_URI = "mongodb+srv://twilightstudios08_db_user:XwpZmzTXDUzlkaGQ@cluster0.y9xmdyr.mongodb.net/?appName=Cluster0";
const DESTINATION_URI = "mongodb+srv://imazenstudios_db_user:3iZ1x8HY8mfdnEBz@cluster0.n6q9lgi.mongodb.net/?appName=Cluster0";

async function migrate() {
  const sourceClient = new MongoClient(SOURCE_URI);
  const destClient = new MongoClient(DESTINATION_URI);

  try {
    console.log("Connecting to databases...");
    await sourceClient.connect();
    await destClient.connect();
    
    // Connect to the specific databases (usually 'test' by default, or change to your db name)
    const sourceDb = sourceClient.db(); 
    const destDb = destClient.db();

    // Get all collections from the source database
    const collections = await sourceDb.collections();
    console.log(`Found ${collections.length} collections to copy.`);

    for (const collection of collections) {
      const collectionName = collection.collectionName;
      console.log(`\nCopying collection: ${collectionName}...`);

      const documents = await collection.find({}).toArray();
      
      if (documents.length > 0) {
        const destCollection = destDb.collection(collectionName);
        
        // Optional: clear the destination collection first to prevent duplicates
        // await destCollection.deleteMany({});
        
        await destCollection.insertMany(documents);
        console.log(`✅ Successfully copied ${documents.length} documents into ${collectionName}`);
      } else {
        console.log(`⚠️ Collection ${collectionName} is empty. Skipping.`);
      }
    }

    console.log("\n🎉 Database migration complete!");

  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await sourceClient.close();
    await destClient.close();
  }
}

migrate();
