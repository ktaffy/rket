// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOvY8KuoXD_HwGJSoFnTTcsRMUtdtpPhs",
    authDomain: "rket-a4696.firebaseapp.com",
    databaseURL: "https://rket-a4696-default-rtdb.firebaseio.com",
    projectId: "rket-a4696",
    storageBucket: "rket-a4696.firebasestorage.app",
    messagingSenderId: "641854958369",
    appId: "1:641854958369:web:e5fd79048acad01e602c60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

export { database }