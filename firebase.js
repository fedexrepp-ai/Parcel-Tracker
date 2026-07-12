import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtjcu2o1Eq2bO-EgbxDMOI21rVT98KGFc",
  authDomain: "parcel-tracker-579ab.firebaseapp.com",
  projectId: "parcel-tracker-579ab",
  storageBucket: "parcel-tracker-579ab.firebasestorage.app",
  messagingSenderId: "745147459948",
  appId: "1:745147459948:web:b814009ad71c171e766b49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };