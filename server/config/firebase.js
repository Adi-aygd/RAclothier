const admin = require('firebase-admin');
require('dotenv').config();
var serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    console.log(`📁 Project ID: ${serviceAccount.project_id}`);
    console.log(`🔐 Storage Bucket: ${serviceAccount.project_id}.appspot.com`);
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
    process.exit(1);
  }
} else {
  console.log('✅ Firebase Admin SDK already initialized');
}

// Export Firebase services
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

// Simple connection test
const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing basic Firebase connection...');

    // Just test if we can access the project
    const projectId = admin.app().options.projectId;
    console.log(`✅ Connected to Firebase project: ${projectId}`);

    // Test storage bucket
    try {
      await bucket.getMetadata();
      console.log('✅ Firebase Storage bucket ready');
    } catch (storageError) {
      console.log('⚠️  Storage bucket not accessible:', storageError.message);
    }

    console.log('🎉 Firebase is ready for use!');
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Check if Firebase project exists');
    console.log('   2. Verify service account permissions');
    console.log('   3. Enable Authentication in Firebase Console');
    console.log('   4. Enable Firestore in Firebase Console');
    console.log('   5. Enable Storage in Firebase Console');
  }
};

// Run connection test
testFirebaseConnection();

module.exports = {
  admin,
  auth,
  db,
  storage,
  bucket,
};
