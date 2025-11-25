// utils/firebase.js
const admin = require("firebase-admin");
const path = require("path");

const {
  FIREBASE_SERVICE_ACCOUNT_PATH,
  FIREBASE_SERVICE_ACCOUNT_BASE64,
  FIREBASE_STORAGE_BUCKET,
} = process.env;

let firebaseInitialized = false;
let bucket = null;

function initializeFirebase() {
  if (firebaseInitialized) return;

  try {
    let serviceAccount = null;

    // 1️⃣ Preferred: Base64 method
    if (FIREBASE_SERVICE_ACCOUNT_BASE64) {
      console.log("Initializing Firebase using BASE64 credentials...");
      const jsonString = Buffer.from(
        FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString("utf8");
      serviceAccount = JSON.parse(jsonString);
    }

    // 2️⃣ Fallback: File path method
    else if (FIREBASE_SERVICE_ACCOUNT_PATH) {
      console.log("Initializing Firebase using FILE PATH credentials...");
      serviceAccount = require(path.resolve(FIREBASE_SERVICE_ACCOUNT_PATH));
    }

    // 3️⃣ No credentials → do NOT crash
    else {
      console.warn(
        "⚠️ Firebase credentials NOT found. Firebase will NOT be initialized."
      );
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: FIREBASE_STORAGE_BUCKET,
    });

    bucket = admin.storage().bucket();
    firebaseInitialized = true;

    console.log("✅ Firebase initialized successfully.");
  } catch (err) {
    console.error("❌ Firebase initialization failed:", err.message);
    console.warn("⚠️ Server will continue running WITHOUT Firebase.");
  }
}

// Automatically initialize
initializeFirebase();

async function uploadFile(localPath, destination) {
  if (!firebaseInitialized || !bucket) {
    throw new Error("❌ Firebase is not initialized — cannot upload files.");
  }

  await bucket.upload(localPath, { destination });

  const file = bucket.file(destination);
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

module.exports = { uploadFile, firebaseInitialized };
